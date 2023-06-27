# Utiliser globus sur une machine virtuelle linux

## 1. Créer un endpoint sur la machine actuelle :

Suivre la procédure d’installation de globus connect :
https://docs.globus.org/how-to/globus-connect-personal-linux/

À l'étape :
```
./globusconnectpersonal
```
Copier le url sur votre machine personnelle et se connecter.
Entrer le code d'authentification obtenu dans le terminal de la machine virtuelle.

Pour donner accès a certains répertoires spécifiques tel que "/" :
Après l'installation, suivre la procédure suivante :
https://docs.globus.org/how-to/globus-connect-personal-linux/#config-paths

La procédure est terminée. Utiliser pour ouvrir le endpoint en background:
```
cd globusconnectpersonal
./globusconnectpersonal -start &
```

## 2. Utiliser le client Globus directement dans la machine virtuelle :

Installation du client globus
```
pip install globus-cli
```

Se connecter à globus sur la machine
```
globus login
```

Copier/coller dans un navigateur et, après s’être connecté,
copier/coller le code obtenu dans le terminal.

Trouver le ID du endpoint que l'on désire utiliser :
```
globus endpoint search 'NOM_DU_ENDPOINT' 
```
copier le ID

S'il faut s'authentifier au endpoint : 
```
globus endpoint activate --web ID_ENDPOINT
```

copier le url dans le navigateur et se connecter.
Ensuite la commande suivante devrait fonctionner :
```
globus ls ID_ENDPOINT
```

Pour voyager dans les répertoires, utiliser : 
```
globus ls ID_ENDPOINT:PATH 
```

Pour faire un transfere:
```
globus transfer [options ex: --recursive] <from-endpoint>:<from-path> <to-endpoint>:<to-path>
```

## 3. Synchroniser 2 dossiers

Ouvrir globus web et aller sur le file manager.

Selectionner le dossier source dans la partie de gauche et selectionner le dossier destination dans la partie de droite

Cliquer sur "Transfer & Timer Options" pour ouvrir les options additionnelles.

Cocher "sync - only transfer new or changed files" afin de ne pas faire de transfère inutile

Choisir un intervalle de "Repeat" et remplir les champs prévus pour la répétition. Cela permet de répéter la synchronisation à un intervalle régulier.
