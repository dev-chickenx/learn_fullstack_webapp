import uuid
from enum import Enum

from pydantic import EmailStr, constr
from sqlmodel import Field, Relationship, SQLModel


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
    reference_type: ReferenceType
    item_code: str = Field(
        max_length=8,
        min_length=8,
        regex="^[0-9A-Za-z]{8}$"
    )
    name: str = Field(max_length=255)
    price: float = Field(ge=0, default=0.00)
    stock_quantity: int = Field(ge=0, default=0)
    category: str = Field(max_length=100)
    status: str = Field(
        max_length=20,
        default="active"
    )
    weight_grams: int | None = Field(default=None, ge=0)


# Properties to receive on product creation
class ProductCreate(ProductBase):
    pass


# Properties to receive on product update
class ProductUpdate(SQLModel):
    name: str | None = Field(default=None, max_length=255)
    price: float | None = Field(default=None, ge=0)
    stock_quantity: int | None = Field(default=None, ge=0)
    category: str | None = Field(default=None, max_length=100)
    status: str | None = Field(default=None, max_length=20)
    weight_grams: int | None = Field(default=None, ge=0)


# Database model
class Product(ProductBase, table=True):
    __table_args__ = (
        {'schema': 'public', 'comment': 'システムで取り扱う商品の基本情報を管理するテーブル'},
    )

    # Primary key is composite of reference_type and item_code
    reference_type: ReferenceType = Field(primary_key=True)
    item_code: str = Field(primary_key=True)


# Properties to return via API
class ProductPublic(ProductBase):
    pass


# List of products to return via API
class ProductsPublic(SQLModel):
    data: list[ProductPublic]
    count: int

