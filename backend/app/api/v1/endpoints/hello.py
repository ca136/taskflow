"""Hello World endpoint"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/hello", tags=["hello"])
async def hello():
    """Hello World endpoint"""
    return {
        "message": "Hello World"
    }
