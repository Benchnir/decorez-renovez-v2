#!/bin/bash

# Vérifier si gh CLI est installé
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI n'est pas installé. Installation en cours..."
    brew install gh
fi

# Configuration des secrets
echo "Configuration des secrets GitHub..."

# Frontend (Firebase)
gh secret set NEXT_PUBLIC_API_URL --body "https://decorez.web.app/api"
gh secret set FIREBASE_SERVICE_ACCOUNT --body "$(cat path/to/your/firebase-service-account.json)"

# Backend (AWS)
gh secret set AWS_ACCESS_KEY_ID --body "$AWS_ACCESS_KEY_ID"
gh secret set AWS_SECRET_ACCESS_KEY --body "$AWS_SECRET_ACCESS_KEY"

# Mobile (Expo)
gh secret set EXPO_TOKEN --body "$EXPO_TOKEN"
gh secret set EXPO_APPLE_APP_SPECIFIC_PASSWORD --body "$EXPO_APPLE_APP_SPECIFIC_PASSWORD"

echo "Configuration des secrets terminée !"
