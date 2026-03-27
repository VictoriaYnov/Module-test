import mysql.connector
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a connection to the database
conn = mysql.connector.connect(
    database=os.getenv("MYSQL_DATABASE"),
    user=os.getenv("MYSQL_USER"),
    password=os.getenv("MYSQL_ROOT_PASSWORD"),
    port=3306,
    host=os.getenv("DB_HOST", "localhost")
)

class User(BaseModel):
    name: str
    first: str
    email: str
    birthDate: Optional[str] = None
    city: Optional[str] = None
    cp: Optional[str] = None

@app.get("/users")
async def get_users():
    cursor = conn.cursor(dictionary=True)
    sql_select_Query = "SELECT * FROM utilisateur"
    cursor.execute(sql_select_Query)
    # get all records
    records = cursor.fetchall()
    print("Total number of rows in table: ", cursor.rowcount)
    return {"utilisateurs": records}

@app.post("/users", status_code=201)
async def create_user(user: User):
    cursor = conn.cursor()
    # Vérifie si l'email existe déjà
    cursor.execute("SELECT id FROM utilisateur WHERE email = %s", (user.email,))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail={"message": "Cet email est déjà utilisé."})
    cursor.execute(
        "INSERT INTO utilisateur (nom, prenom, email, date_naissance, ville, code_postal) VALUES (%s, %s, %s, %s, %s, %s)",
        (user.name, user.first, user.email, user.birthDate, user.city, user.cp)
    )
    conn.commit()
    return {"message": "Utilisateur créé"}