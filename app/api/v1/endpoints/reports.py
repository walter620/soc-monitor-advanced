"""
Endpoints de gestión de reportes
"""
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import json

from app.core.security import get_current_user
from app.db.session import get_db
from app.db.models.user import User
from app.db.models.report import ShiftReport


router = APIRouter(prefix="/reports", tags=["reportes"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_report(
    request_data: dict,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Crear nuevo reporte de turno"""
    # Validar que las horas sean válidas
    if request_data.get('end_time') <= request_data.get('start_time'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La hora de fin debe ser posterior a la hora de inicio"
        )
    
    # Crear reporte
    report = ShiftReport(
        operator_id=current_user.id,
        shift_date=request_data.get('shift_date'),
        start_time=request_data.get('start_time'),
        end_time=request_data.get('end_time'),
        summary=request_data.get('summary', 'Sin resumen'),
        novedades=json.dumps(request_data.get('novedades', [])),
        logs_revisados=json.dumps(request_data.get('logs_revisados', [])),
        status=request_data.get('status', 'draft'),
        severity=request_data.get('severity', 0)
    )
    
    db.add(report)
    db.commit()
    db.refresh(report)
    
    return {
        "id": report.id,
        "status": report.status,
        "severity": report.severity,
        "summary": report.summary,
        "created_by": current_user.username
    }


@router.get("/", response_model=list)
async def list_reports(
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Listar reportes con paginación"""
    query = db.query(ShiftReport)
    
    # Solo operadores ven sus propios reportes
    if current_user.role not in ["admin", "supervisor"]:
        query = query.filter(ShiftReport.operator_id == current_user.id)
    
    reports = query.offset(skip).limit(limit).all()
    
    # Convertir a lista de dicts
    return [
        {
            "id": r.id,
            "status": r.status,
            "severity": r.severity,
            "summary": r.summary[:100] + "..." if len(r.summary) > 100 else r.summary,
            "created_at": r.created_at.isoformat()
        }
        for r in reports
    ]


@router.get("/{report_id}")
async def get_report(
    report_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener reporte por ID"""
    report = db.query(ShiftReport).filter(ShiftReport.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado"
        )
    
    # Verificar permisos
    if current_user.role not in ["admin", "supervisor"] and report.operator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para ver este reporte"
        )
    
    return {
        "id": report.id,
        "operator_id": report.operator_id,
        "shift_date": report.shift_date.isoformat() if report.shift_date else None,
        "start_time": report.start_time.isoformat() if report.start_time else None,
        "end_time": report.end_time.isoformat() if report.end_time else None,
        "summary": report.summary,
        "status": report.status,
        "severity": report.severity,
        "novedades": json.loads(report.novedades) if report.novedades else [],
        "logs_revisados": json.loads(report.logs_revisados) if report.logs_revisados else [],
        "created_at": report.created_at.isoformat() if report.created_at else None,
        "updated_at": report.updated_at.isoformat() if report.updated_at else None
    }


@router.put("/{report_id}")
async def update_report(
    report_id: int,
    request_data: dict,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Actualizar reporte"""
    report = db.query(ShiftReport).filter(ShiftReport.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado"
        )
    
    # Verificar permisos
    if current_user.role not in ["admin", "supervisor"] and report.operator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para actualizar este reporte"
        )
    
    # Actualizar campos
    if 'summary' in request_data:
        report.summary = request_data['summary']
    if 'novedades' in request_data:
        report.novedades = json.dumps(request_data['novedades'])
    if 'logs_revisados' in request_data:
        report.logs_revisados = json.dumps(request_data['logs_revisados'])
    if 'status' in request_data:
        report.status = request_data['status']
    if 'severity' in request_data:
        report.severity = request_data['severity']
    
    db.commit()
    db.refresh(report)
    
    return {
        "id": report.id,
        "status": report.status,
        "message": "Reporte actualizado exitosamente"
    }


@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_report(
    report_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Eliminar reporte (solo admins y creador)"""
    report = db.query(ShiftReport).filter(ShiftReport.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado"
        )
    
    # Solo admins o el creador pueden eliminar
    if current_user.role != "admin" and report.operator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para eliminar este reporte"
        )
    
    db.delete(report)
    db.commit()
    
    return None
