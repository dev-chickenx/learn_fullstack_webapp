import uuid
from datetime import datetime
from enum import Enum

from pydantic import EmailStr
from sqlmodel import Field, ForeignKeyConstraint, Relationship, SQLModel


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Shared properties
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=255)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)


# Product reference type enum
class ReferenceType(str, Enum):
    REGULAR = "R"
    TEMPORARY = "T"
    YOYAKU = "Y"


# Shared properties for Product
class ProductBase(SQLModel):
    name: str = Field(max_length=255)
    price: float = Field(ge=0, default=0.00)
    stock_quantity: int = Field(ge=0, default=0)
    category: str = Field(max_length=100)
    status: str = Field(max_length=20, default="active")
    weight_grams: int | None = Field(default=None, ge=0)


# Database model
class Product(ProductBase, table=True):
    __table_args__ = (
        {
            "schema": "public",
            "comment": "システムで取り扱う商品の基本情報を管理するテーブル",
        },
    )

    # Primary key is composite of reference_type and item_code
    reference_type: ReferenceType = Field(primary_key=True)
    item_code: str = Field(max_length=8, min_length=8, regex="^[0-9A-Za-z]{8}$")

    purchase_order_products: list["PurchaseOrderProduct"] = Relationship(
        back_populates="product"
    )


# Properties to receive on product creation
class ProductCreate(ProductBase):
    pass


# Properties to receive on product update
class ProductUpdate(ProductBase):
    name: str | None = Field(default=None, max_length=255)
    price: float | None = Field(default=None, ge=0)
    stock_quantity: int | None = Field(default=None, ge=0)
    category: str | None = Field(default=None, max_length=100)
    status: str | None = Field(default=None, max_length=20)
    weight_grams: int | None = Field(default=None, ge=0)


# Properties to return via API
class ProductPublic(ProductBase):
    pass


# List of products to return via API
class ProductsPublic(SQLModel):
    data: list[ProductPublic]
    count: int


# 注文状態を表すEnum
class OrderStatus(str, Enum):
    DRAFT = "draft"  # 下書き
    CONFIRMED = "confirmed"  # 確定済
    CANCELED = "canceled"  # キャンセル済
    COMPLETED = "completed"  # 完了


# 注文基本情報の新しい構造
class PurchaseOrderBase(SQLModel):
    order_number: str = Field(
        max_length=12, regex="^[0-9A-Za-z]{12}$", description="注文番号"
    )
    order_date: datetime = Field(description="注文日付")
    status: OrderStatus = Field(default=OrderStatus.DRAFT)
    total_amount: float = Field(ge=0, default=0)
    customer_name: str | None = Field(default=None, max_length=100)
    customer_email: EmailStr | None = Field(default=None)
    customer_phone: str | None = Field(default=None, max_length=20, regex="^[0-9+-]*$")
    shipping_address: str | None = Field(default=None, max_length=255)
    notes: str | None = Field(default=None, max_length=500)


# データベースモデル
class PurchaseOrder(PurchaseOrderBase, table=True):
    __tablename__ = "purchase_order"
    __table_args__ = (
        {"schema": "public", "comment": "注文の基本情報を管理するテーブル"},
    )

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(
        default_factory=datetime.now,
        sa_column_kwargs={"onupdate": datetime.now},
    )
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column_kwargs={"onupdate": datetime.now},
    )
    created_by: uuid.UUID = Field(foreign_key="user.id")

    purchase_order_products: list["PurchaseOrderProduct"] = Relationship(
        back_populates="purchase_order"
    )


# API入出力用モデル
class PurchaseOrderCreate(PurchaseOrderBase):
    order_date: datetime
    customer_name: str | None = None
    customer_email: EmailStr | None = None
    customer_phone: str | None = None
    shipping_address: str | None = None
    notes: str | None = None

    order_number: str | None = None  # type: ignore
    status: OrderStatus = OrderStatus.DRAFT  # type: ignore
    total_amount: float = 0  # type: ignore


class PurchaseOrderUpdate(PurchaseOrderBase):
    order_date: datetime | None = None  # type: ignore
    status: OrderStatus | None = None  # type: ignore
    customer_name: str | None = None  # type: ignore
    customer_email: EmailStr | None = None  # type: ignore
    customer_phone: str | None = None  # type: ignore
    shipping_address: str | None = None  # type: ignore
    notes: str | None = None  # type: ignore

    # 更新時は注文番号を変更できないようにする
    order_number: str | None = None  # type: ignore
    # 合計金額は明細から計算するため、親クラスの制約を上書き
    total_amount: float | None = None  # type: ignore


class PurchaseOrderPublic(PurchaseOrderBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    created_by: uuid.UUID


class PurchaseOrdersPublic(SQLModel):
    data: list[PurchaseOrderPublic]
    count: int


# 注文と商品の中間テーブル
class PurchaseOrderProduct(SQLModel, table=True):
    __tablename__ = "purchase_order_product"
    __table_args__ = (
        ForeignKeyConstraint(
            ["product_reference_type", "product_item_code"],
            ["product.reference_type", "product.item_code"],
        ),
        {"schema": "public", "comment": "注文と商品の関連を管理する中間テーブル"},
    )

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    purchase_order_id: uuid.UUID = Field(foreign_key="purchase_order.id")
    # 個別の外部キー制約を削除
    product_reference_type: ReferenceType = Field(default=ReferenceType.REGULAR)
    product_item_code: str = Field(
        max_length=8,
        min_length=8,
        regex="^[0-9A-Za-z]{8}$",
    )
    quantity: int = Field(ge=1, default=1)
    unit_price: float = Field(ge=0)

    purchase_order: "PurchaseOrder" = Relationship(
        back_populates="purchase_order_products"
    )
    product: "Product" = Relationship(back_populates="purchase_order_products")
