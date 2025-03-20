import os
from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer
import jwt

JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

security = HTTPBearer()

def verify_jwt(token: str = Security(security)):
    try:
        payload = jwt.decode(token.credentials, JWT_SECRET, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
