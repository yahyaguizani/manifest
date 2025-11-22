FROM python:3.8-slim

WORKDIR /app

# Copier les fichiers requis
COPY requirements.txt .
COPY random_forest_model.pkl .
COPY app.py .

# Installer les dépendances
RUN pip install -r requirements.txt

# Exposer le port
EXPOSE 8000

# Commande pour exécuter l'application
CMD ["python", "app.py"]


