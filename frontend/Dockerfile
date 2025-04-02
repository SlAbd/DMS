# Étape 1 : Utiliser l'image Node.js pour installer les dépendances et builder l'application
FROM node:16 AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration et installer les dépendances
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copier tout le code source
COPY . .

# Builder l'application React avec Vite
RUN npm run build

# Étape 2 : Utiliser une image Nginx pour servir les fichiers de l'application en production
FROM nginx:alpine

# Copier les fichiers construits dans le répertoire de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port 80 (le port par défaut pour Nginx)
EXPOSE 80

# Lancer Nginx pour servir l'application
CMD ["nginx", "-g", "daemon off;"]
