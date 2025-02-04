import uuid
from typing import List, Optional

from pydantic import EmailStr
from sqlmodel import Column, Field, Relationship, SQLModel, String, select


class UserRole(SQLModel, table=True):
    user_id: uuid.UUID = Field(foreign_key="user.id", primary_key=True)
    role_id: uuid.UUID = Field(foreign_key="role.id", primary_key=True)


class Role(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(sa_column=Column("name", String, unique=True, index=True))
    description: Optional[str] = None
    users: List["User"] = Relationship(back_populates="roles", link_model=UserRole)


class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    roles: List["Role"] = Relationship(back_populates="users", link_model=UserRole)
    full_name: Optional[str] = Field(default=None, max_length=255)


# Properties to receive via API on creation, including roles
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)
    roles: List[uuid.UUID] = []


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: Optional[str] = Field(default=None, max_length=255)
    roles: List[uuid.UUID] = []  # 追加: 複数のロールを許可


# Properties to receive via API on update, all are optional, including roles
class UserUpdate(UserBase):
    email: Optional[EmailStr] = Field(default=None, max_length=255)  # type: ignore
    password: Optional[str] = Field(default=None, min_length=8, max_length=40)
    roles: List[uuid.UUID] = []


class UserUpdateMe(SQLModel):
    full_name: Optional[str] = Field(default=None, max_length=255)
    email: Optional[EmailStr] = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    items: List["Item"] = Relationship(back_populates="owner", cascade_delete=True)

Role.users = Relationship(back_populates="roles", link_model=UserRole)


class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: List[UserPublic]
    count: int


# Shared properties
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=255)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User = Relationship(back_populates="items")
    orders: List["Order"] = Relationship(back_populates="item")  # 双方向リレーション


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class ItemsPublic(SQLModel):
    data: List[ItemPublic]
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
    sub: Optional[str] = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)


# Orderクラスを更新
class Order(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    item_id: uuid.UUID = Field(foreign_key="item.id", nullable=False)
    quantity: int = Field(default=1, ge=1)  # 最小値を1に設定
    item: Item = Relationship(back_populates="orders")  # 双方向リレーション


# 役割の初期データを追加するための関数（オプション）
def create_default_roles(session):
    roles = ["依頼者", "承認者"]
    for role_name in roles:
        role = session.exec(select(Role).where(Role.name == role_name)).first()
        if not role:
            role = Role(name=role_name, description=f"{role_name}の役割です。")
            session.add(role)
    session.commit()
