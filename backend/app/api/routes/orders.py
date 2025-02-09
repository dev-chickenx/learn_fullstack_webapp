from datetime import datetime
from typing import Any
from uuid import UUID, uuid4

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.api.deps import CurrentUser, SessionDep
from app.models import (
    Message,
    OrderStatus,
    Product,
    PurchaseOrder,
    PurchaseOrderCreate,
    PurchaseOrderPublic,
    PurchaseOrdersPublic,
    PurchaseOrderUpdate,
)

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("/", response_model=PurchaseOrdersPublic)
def read_orders(
    session: SessionDep,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    注文一覧を取得します。
    """
    statement = select(PurchaseOrder).offset(skip).limit(limit)
    orders = session.exec(statement).all()
    total = session.exec(select(PurchaseOrder)).all()
    return PurchaseOrdersPublic(data=orders, count=len(total))


@router.post("/", response_model=PurchaseOrderPublic)
def create_order(
    session: SessionDep,
    current_user: CurrentUser,
    order_in: PurchaseOrderCreate,
) -> Any:
    """
    新規注文を作成します。
    """
    # 注文番号の生成（YYMMDDxxxxxx形式）
    order_number = datetime.now().strftime("%y%m%d") + uuid4().hex[:6].upper()

    # 注文本体の作成
    order = PurchaseOrder(
        order_number=order_number,
        created_by=current_user.id,
        **order_in.model_dump(exclude={"products"}),
    )

    total_amount = 0
    products = []

    # 商品の存在チェックと合計金額の計算
    for product in order_in.products:
        db_product = session.get(Product, (product.reference_type, product.item_code))
        if not db_product:
            raise HTTPException(
                status_code=404,
                detail=f"Product not found: {product.reference_type}-{product.item_code}",
            )
        total_amount += db_product.price
        products.append(db_product)

    order.total_amount = total_amount
    order.products = products

    session.add(order)
    session.commit()
    session.refresh(order)
    return order


@router.get("/{order_id}", response_model=PurchaseOrderPublic)
def read_order(
    session: SessionDep,
    order_id: UUID,
) -> Any:
    """
    指定されたIDの注文を取得します。
    """
    order = session.get(PurchaseOrder, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.put("/{order_id}", response_model=PurchaseOrderPublic)
def update_order(
    session: SessionDep,
    current_user: CurrentUser,
    order_id: UUID,
    order_in: PurchaseOrderUpdate,
) -> Any:
    """
    注文を更新します。
    """
    order = session.get(PurchaseOrder, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.status == OrderStatus.COMPLETED:
        raise HTTPException(
            status_code=400, detail="Completed order cannot be modified"
        )

    update_data = order_in.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()

    for key, value in update_data.items():
        setattr(order, key, value)

    session.add(order)
    session.commit()
    session.refresh(order)
    return order


@router.delete("/{order_id}", response_model=Message)
def delete_order(
    session: SessionDep,
    current_user: CurrentUser,
    order_id: UUID,
) -> Any:
    """
    注文を削除します。
    """
    order = session.get(PurchaseOrder, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.status != OrderStatus.DRAFT:
        raise HTTPException(status_code=400, detail="Only draft orders can be deleted")

    session.delete(order)
    session.commit()
    return Message(message="Order deleted successfully")
