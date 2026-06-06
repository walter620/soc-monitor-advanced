"""
Endpoints de usuarios
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.security import get_current_super_admin, get_current_user, get_password_hash
from app.db.session import get_db
from app.db.models.user import User
from app.schemas import UserCreate, UserUpdate, UserResponse


router = APIRouter(prefix="/users", tags=["usuarios"])


@router.get("/", response_model=List[UserResponse])
async def list_users(
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Listar usuarios (requiere admin o supervisor)"""
    if current_user.role not in ["admin", "supervisor"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permisos insuficientes"
        )
    
    users = db.query(User).offset(skip).limit(limit).all()
    return users


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user: UserCreate,
    current_user = Depends(get_current_super_admin),
    db: Session = Depends(get_db)
):
    """Crear nuevo usuario (solo admin)"""
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuario ya existe"
        )
    
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email ya registrado"
        )
    
    # Hashear contraseña correctamente
    db_user = User(**user.model_dump(exclude={'password'}))
    db_user.password_hash = get_password_hash(user.password)
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    current_user = Depends(get_current_super_admin),
    db: Session = Depends(get_db)
):
    """Actualizar usuario (solo admin)"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    for key, value in user_data.model_dump(exclude_unset=True).items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    
    return db_user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    current_user = Depends(get_current_super_admin),
    db: Session = Depends(get_db)
):
    """Eliminar usuario (solo admin)"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    if db_user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puedes eliminarte a ti mismo"
        )
    
    db.delete(db_user)
    db.commit()
    
    return None
