"""
Endpoints de estadísticas
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import datetime, timedelta
from typing import List, Dict

from app.core.security import get_current_user
from app.db.session import get_db
from app.db.models.report import ShiftReport
from app.db.models.user import User


router = APIRouter(prefix="/stats", tags=["estadísticas"])


@router.get("/dashboard")
async def get_dashboard_stats(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener estadísticas del dashboard"""
    # Conteos generales
    total_reports = db.query(func.count(ShiftReport.id)).scalar()
    
    # Por estado
    draft_count = db.query(func.count(ShiftReport.id)).filter(
        ShiftReport.status == "draft"
    ).scalar()
    
    pending_count = db.query(func.count(ShiftReport.id)).filter(
        ShiftReport.status == "pending"
    ).scalar()
    
    approved_count = db.query(func.count(ShiftReport.id)).filter(
        ShiftReport.status == "approved"
    ).scalar()
    
    closed_count = db.query(func.count(ShiftReport.id)).filter(
        ShiftReport.status == "closed"
    ).scalar()
    
    # SLA violados
    sla_violated = db.query(func.count(ShiftReport.id)).filter(
        ShiftReport.sla_violated == True
    ).scalar()
    
    # Severidad alta (7+)
    high_severity = db.query(func.count(ShiftReport.id)).filter(
        ShiftReport.severity >= 7
    ).scalar()
    
    return {
        "total_reports": total_reports,
        "by_status": {
            "draft": draft_count,
            "pending": pending_count,
            "approved": approved_count,
            "closed": closed_count
        },
        "sla_violated": sla_violated,
        "high_severity": high_severity
    }


@router.get("/top-offenses")
async def get_top_offenses(
    days: int = 30,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener top ofensas recurrentes"""
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    # Contar frecuencias (simulado con JSONB)
    offenses = db.query(
        ShiftReport.severity,
        func.count(ShiftReport.id).label("count")
    ).filter(
        ShiftReport.shift_date >= cutoff_date,
        ShiftReport.severity > 0
    ).group_by(ShiftReport.severity).order_by(
        func.count(ShiftReport.id).desc()
    ).limit(10).all()
    
    return [
        {"severity": sev, "count": cnt} for sev, cnt in offenses
    ]


@router.get("/sla-compliance")
async def get_sla_compliance(
    days: int = 30,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener métricas de cumplimiento de SLA"""
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    total_with_sla = db.query(func.count(ShiftReport.id)).filter(
        ShiftReport.shift_date >= cutoff_date,
        ShiftReport.severity >= 7
    ).scalar()
    
    violated = db.query(func.count(ShiftReport.id)).filter(
        ShiftReport.shift_date >= cutoff_date,
        ShiftReport.severity >= 7,
        ShiftReport.sla_violated == True
    ).scalar()
    
    compliance_rate = ((total_with_sla - violated) / total_with_sla * 100) if total_with_sla > 0 else 100
    
    return {
        "period_days": days,
        "total_with_sla": total_with_sla,
        "violated": violated,
        "compliance_rate": round(compliance_rate, 2)
    }


@router.get("/resolution-time")
async def get_resolution_time(
    days: int = 30,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener tiempo promedio de resolución"""
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    avg_time = db.query(func.avg(ShiftReport.resolution_time_minutes)).filter(
        ShiftReport.shift_date >= cutoff_date,
        ShiftReport.resolution_time_minutes.isnot(None)
    ).scalar()
    
    return {
        "period_days": days,
        "average_minutes": round(avg_time, 2) if avg_time else 0
    }
