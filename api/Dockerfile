FROM python:3.11-alpine

#Dossier de travail
WORKDIR /app

# Slide : Minimiser la taille de l'image
# en supprimant les fichiers temporaires
# et les caches après l'installation des dépendances
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .

# documentation
EXPOSE 8000

CMD ["uvicorn", "main:app", "--proxy-headers", "--host", "0.0.0.0", "--port", "8000"]
