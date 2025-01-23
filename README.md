# Décorez-Rénovez

Une plateforme innovante qui connecte les particuliers avec des artisans qualifiés pour leurs projets de rénovation et de décoration.

*Dernière mise à jour : 23 janvier 2025*

## Structure du Projet

Le projet est divisé en trois parties principales :

- `frontend/` : Application web Next.js
- `backend/` : API PHP Laravel
- `mobile/` : Application mobile React Native/Expo

## Configuration du Développement

### Prérequis

- Node.js 18+
- PHP 8.2+
- Composer
- Docker
- AWS CLI
- Firebase CLI
- Expo CLI

### Installation

1. Cloner le repository :
```bash
git clone https://github.com/Benchnir/decorez-renovez.git
cd decorez-renovez
```

2. Frontend (Next.js) :
```bash
cd frontend
npm install
npm run dev
```

3. Backend (Laravel) :
```bash
cd backend
composer install
php artisan serve
```

4. Mobile (Expo) :
```bash
cd mobile
npm install
npm start
```

## Déploiement

### Frontend (Firebase)

Le frontend est déployé automatiquement sur Firebase Hosting via GitHub Actions.

### Backend (AWS)

Le backend est déployé sur AWS ECS via GitHub Actions.

### Mobile (Expo)

L'application mobile est déployée via EAS (Expo Application Services).

## Variables d'Environnement

### Frontend
```
NEXT_PUBLIC_API_URL=https://api.decorez-renovez.com
```

### Backend
```
DB_CONNECTION=pgsql
DB_HOST=your-db-host
DB_PORT=5432
DB_DATABASE=decorez
DB_USERNAME=your-username
DB_PASSWORD=your-password
```

### Mobile
```
API_URL=https://api.decorez-renovez.com
```

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
