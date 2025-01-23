# Guide de Déploiement - Décorez-Rénovez

Ce document décrit le processus de déploiement complet pour l'application Décorez-Rénovez.

## Prérequis

- Compte AWS avec accès à :
  - ECR (Elastic Container Registry)
  - ECS (Elastic Container Service)
  - RDS (Base de données)
  - ElastiCache (Redis)
  - Route53 (DNS)
  - ACM (Certificats SSL)
- Compte Firebase
- Compte Expo
- Comptes Apple Developer et Google Play Console

## Configuration des Services

### 1. Frontend (Firebase)

```bash
# Installation des dépendances
cd frontend
npm install

# Build de production
npm run build

# Déploiement sur Firebase
firebase deploy
```

### 2. Backend (AWS)

```bash
# Construction de l'image Docker
cd backend
docker build -t decorez-api .

# Push vers ECR
aws ecr get-login-password --region eu-west-3 | docker login --username AWS --password-stdin your-account-id.dkr.ecr.eu-west-3.amazonaws.com
docker tag decorez-api:latest your-account-id.dkr.ecr.eu-west-3.amazonaws.com/decorez-api:latest
docker push your-account-id.dkr.ecr.eu-west-3.amazonaws.com/decorez-api:latest

# Mise à jour du service ECS
aws ecs update-service --cluster decorez-cluster --service decorez-api --force-new-deployment
```

### 3. Mobile (Expo)

```bash
# Build iOS
expo build:ios

# Build Android
expo build:android

# Soumission aux stores
expo submit:ios
expo submit:android
```

## Variables d'Environnement

### Frontend (.env.production)
- NEXT_PUBLIC_API_URL
- NEXT_PUBLIC_FIREBASE_*

### Backend (.env.production)
- APP_KEY
- DB_*
- AWS_*
- REDIS_*

## DNS et SSL

1. Configuration Route53 :
   - api.decorez-renovez.fr -> ALB AWS
   - www.decorez-renovez.fr -> Firebase

2. Certificats SSL :
   - Frontend : Géré par Firebase
   - Backend : AWS Certificate Manager

## Monitoring

- Frontend : Firebase Analytics
- Backend : CloudWatch
- Mobile : Firebase Analytics + Crashlytics

## Déploiement Automatique

Le déploiement est automatisé via GitHub Actions. Chaque push sur la branche main déclenche :
1. Build et tests
2. Déploiement frontend sur Firebase
3. Déploiement backend sur ECS
4. Build des applications mobiles

## Rollback

En cas de problème :

1. Frontend :
```bash
firebase hosting:rollback
```

2. Backend :
```bash
aws ecs update-service --cluster decorez-cluster --service decorez-api --task-definition decorez-api:previous
```

3. Mobile :
Utiliser les outils de rollback des stores respectifs.

## Support

Pour toute question ou problème :
- Email : support@decorez-renovez.fr
- Slack : #team-devops
