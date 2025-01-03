import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.api.deps import CurrentUser, SessionDep
from app.models import Item, Message, Order

router = APIRouter()


@router.get("/", response_model=list[Order])
def read_orders(session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve orders.
    """
    statement = select(Order).offset(skip).limit(limit)
    orders = session.exec(statement).all()
    return orders


@router.get("/{id}", response_model=Order)
def read_order(session: SessionDep, id: uuid.UUID) -> Any:
    """
    Get order by ID.
    """
    order = session.get(Order, id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("/", response_model=Order)
def create_order(*, session: SessionDep, item_id: uuid.UUID, quantity: int) -> Any:
    """
    Create new order.
    """
    item = session.get(Item, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    order = Order(item_id=item_id, quantity=quantity)
    session.add(order)
    session.commit()
    session.refresh(order)
    return order


@router.put("/{id}", response_model=Order)
def update_order(*, session: SessionDep, id: uuid.UUID, quantity: int) -> Any:
    """
    Update an order.
    """
    order = session.get(Order, id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.quantity = quantity
    session.add(order)
    session.commit()
    session.refresh(order)
    return order


@router.delete("/{id}")
def delete_order(session: SessionDep, id: uuid.UUID) -> Message:
    """
    Delete an order.
    """
    order = session.get(Order, id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    session.delete(order)
    session.commit()
    return Message(message="Order deleted successfully")
