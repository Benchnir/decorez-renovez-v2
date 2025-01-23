#!/bin/bash

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Démarrage du déploiement de Décorez-Rénovez...${NC}"

# Variables
GITHUB_REPO="https://github.com/yourusername/decorez-renovez.git"
FRONTEND_BRANCH="main"
BACKEND_BRANCH="main"

# 1. Frontend
echo -e "${GREEN}1. Déploiement du Frontend${NC}"
cd frontend
echo "Building frontend..."
npm run build

# 2. Backend
echo -e "${GREEN}2. Déploiement du Backend${NC}"
cd ../backend

# Construction de l'image Docker
echo "Building Docker image..."
docker build -t decorez-api:latest .

# Connexion à AWS ECR
echo "Logging in to AWS ECR..."
aws ecr get-login-password --region eu-west-3 | docker login --username AWS --password-stdin your-account-id.dkr.ecr.eu-west-3.amazonaws.com

# Tag et push de l'image
echo "Pushing Docker image to ECR..."
docker tag decorez-api:latest your-account-id.dkr.ecr.eu-west-3.amazonaws.com/decorez-api:latest
docker push your-account-id.dkr.ecr.eu-west-3.amazonaws.com/decorez-api:latest

# Mise à jour du service ECS
echo "Updating ECS service..."
aws ecs update-service --cluster decorez-cluster --service decorez-api --force-new-deployment

# 3. Mobile
echo -e "${GREEN}3. Déploiement Mobile${NC}"
cd ../mobile
echo "Building mobile apps..."
expo build:ios --non-interactive
expo build:android --non-interactive

echo -e "${GREEN}Déploiement terminé !${NC}"
echo "Frontend: https://decorez-renovez.web.app"
echo "Backend API: https://api.decorez-renovez.fr"
echo "Mobile apps: Soumises aux stores"
