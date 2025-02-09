from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.api.deps import CurrentUser, SessionDep
from app.models import (
    Message,
    Product,
    ProductCreate,
    ProductPublic,
    ProductsPublic,
    ProductUpdate,
)

router = APIRouter(prefix="/products", tags=["products"])


@router.get(
    "/",
    response_model=ProductsPublic,
)
def read_products(
    session: SessionDep,
) -> Any:
    """
    商品一覧を取得します。
    """
    # 全件取得
    statement = select(Product)
    products = session.exec(statement).all()

    # 総件数は取得した商品リストの長さで取得
    total = len(products)

    return ProductsPublic(data=products, count=total)


@router.get("/{reference_type}/{item_code}", response_model=ProductPublic)
def read_product(
    session: SessionDep,
    reference_type: str,
    item_code: str,
) -> Any:
    """
    指定された参照タイプと商品コードの商品を取得します。
    """
    product = session.get(Product, (reference_type, item_code))
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post(
    "/",
    response_model=ProductPublic,
)
def create_product(
    session: SessionDep,
    current_user: CurrentUser,
    product_in: ProductCreate,
) -> Any:
    """
    新規商品を作成します。認証済みユーザーのみ実行可能です。
    """
    # 既存の商品をチェック
    existing_product = session.get(
        Product, (product_in.reference_type, product_in.item_code)
    )
    if existing_product:
        raise HTTPException(
            status_code=400,
            detail="Product with this reference_type and item_code already exists",
        )

    product = Product.model_validate(product_in)
    session.add(product)
    session.commit()
    session.refresh(product)
    return product


@router.put(
    "/{reference_type}/{item_code}",
    response_model=ProductPublic,
)
def update_product(
    session: SessionDep,
    current_user: CurrentUser,
    reference_type: str,
    item_code: str,
    product_in: ProductUpdate,
) -> Any:
    """
    商品情報を更新します。認証済みユーザーのみ実行可能です。
    """
    product = session.get(Product, (reference_type, item_code))
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = product_in.model_dump(exclude_unset=True)
    product.sqlmodel_update(update_data)
    session.add(product)
    session.commit()
    session.refresh(product)
    return product


@router.delete(
    "/{reference_type}/{item_code}",
    response_model=Message,
)
def delete_product(
    session: SessionDep,
    current_user: CurrentUser,
    reference_type: str,
    item_code: str,
) -> Any:
    """
    商品を削除します。認証済みユーザーのみ実行可能です。
    """
    product = session.get(Product, (reference_type, item_code))
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    session.delete(product)
    session.commit()
    return Message(message="Product deleted successfully")
