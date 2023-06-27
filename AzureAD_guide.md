# Ajouter l'authentification Azure AD sur la passerelle

## 1. Trouver les informations sur le portail Azure

Aller à https://portal.azure.com/#home.

Aller sur le service "Azure AD Privileged Identity Management" pour avoir les accès.

À gauche, aller sur l'onglet "Azure AD roles", puis faire l'action "Activate"

Retourner à l'accueil et aller sur le service "Azure Active Directory"

À gauche, aller sur l'onglet "App registrations", puis choisir l'application en question
("FFGG-RECH-ARGIS-Passerelle-de-visualisation-donnes")

Sur la page "Overview", Cliquer sur le lien "FFGG-RECH-ARGIS-Passerelle-de-visualisation-donnes" à coté de "Managed application in local directory"

Ensuite, dans l'onglet "Single sign-on" dans la partie 3 "SAML Certificates", copier "App Federation Metadata URL" pour l'étape suivante.

## 2. Ajouter l'authentification sur le portail ArcGIS

Se connecter sur un compte Admin, aller sur la page "Organization" puis à l'onglet "Security"

Descendre jusqu'à "Login" et faire "New SAML Login".

Choisir "One Identity Provider".

Donner un nom et choisir "Automatically" afin de laisser les utilisateurs rejoindre la passerelle.

Copier l'URL de l'étape précédente et coller dans l'espace prévu.

Faire sauvegarder. Voilà l'authentification Azure AD a été ajoutée
