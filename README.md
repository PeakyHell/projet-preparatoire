# Projet préparatoire v1
Date : 30 septembre 2024

Cours : LINFO1212

Groupe : A03

Membres :
- Delannoy Arthur
- Lambert Valentin
- Van Impe Louis

# Structure du projet
Le projet contient 3 dossier :
- Un dossier templates contenant les fichiers html
- Un dossier static contenant :
    - un dossier css dans lequel sont placé les fichiers css 
    - un dossier js pour les futurs fichiers javascript
- Un dossier features contenant les fichiers .features décrivant les différentes fonctionnalité du site

Nous avons un fichier base.html qui contient la structure générale et la navbar qui est identique pour chaque page.
Chaque page du site possède un fichier html :
- index.html pour la page principale
- auth.html pour la page de connexion
- report.html pour la page de report d'incidents

# Installation
1. Une fois le dossier du projet téléchargé, accédez au dossier depuis un terminal de commandes et installer les modules nécessaires avec la commande suivante :

```
npm install
```

2. Créez une base de donnée ayant le nom que vous souhaitez et contenant 2 collections :
    - Une collection *Users*
    - Une collection *Incidents*

2. Accédez ensuite au fichier *config.js* et entrer le lien vers votre base de données, le nom de votre base de données et une clé de session dans les variables correspondantes.

3. Lancez l'application avec la commande suivante :

```
node app.js
```