# Deipna

Deipna est une application web intelligente de planification et de réservation de salles de restaurant. Le but est de donner un moyen aux restaurateurs de remplir leurs salles, optimiser leurs stocks et de dynamiser la réservation de leurs tables. Tout en proposant aux utilisateurs finaux de réserver simplement des tables dans les restaurants qu'ils souhaitent.

## Features

Il faut distinguer 2 types d'utilisateurs de l'application : les restaurateurs ainsi que les clients finaux (les clients des restaurants).

Les restaurateurs pourront : 
- Accéder à une page leur permettant de rentrer toutes les informations concernant leur restaurant. Ces mêmes informations seront accessibles par les clients finaux. (nom, description, photos, n° de tél., adresse, type de cuisine, vegan friendly, halal friendly...)
- Accéder à un outil d'édition de plan de salle : 
    - L'outil est une sorte de grille sur laquelle il est possible de placer des éléments
    - Les éléments peuvent être des tables (différentes tailles et formes), des chaises, des murs, des bars ou des cuisines
    - Les tables peuvent être nommées
- Définir pour chaque table un prix de réservation supplémentaire (table VIP) ou une promotion appliquée sur la note du client
- Accéder à un calendrier permettant de consulter l'ensemble des réservations faites par les clients finaux avec leur nom, le nombre de personnes et la table qui est assignée

Les clients finaux pourront : 
- Créer un compte et se connecter à leur compte
- Accéder à une page permettant de rechercher un restaurant avec une barre de recherche et un ensemble de filtres sur le type de cuisine recherchée, la localisation et autres critères
- Accéder à une page listant les informations du restaurant 
- Accéder à un calendrier et la liste des horaires disponibles afin de faire une réservation
- Faire une réservation, à l'aide des informations de leur compte s'ils sont connectés, ou avec les informations qu'ils devront replir dans un formulaire s'ils ne sont pas connectés
- S'ils sont connectés, accéder à leurs futures réservations ainsi qu'à l'historique de leurs réservations

Autres fonctionnalités attendues : 
- Les habitudes de réservation des clients doivent pouvoir être consultées (jour dans le semaine, service du midi ou du soir, horaires, tables en particulier, nombre de personnes dans un groupe le plus courant...)
- Sur les informations récoltées (celles listées ci-dessus), l'application doit pouvoir générer des rapports et des suggestions permettant aux restaurateurs de remplir plus facilement leurs salles et ce, de manière lissée sur le temps. Cela permet d'optimiser l'efficacité des équipes à la cuisine et au service en salle.

## Informations techniques

- Le projet Deipna est un monorepo composé d'une API AdonisJS et d'un frontend VueJS.
- Les frameworks sont utilisés en version LTS et suivent toutes les bonnes pratiques pertinentes de développement associées au développement d'interfaces et d'API.
- Le frontend doit suivre le principe de développement par composants et doit rester évolutif et modulaire.
- On utilisera fnm pour la gestion de version de node. 
- L'API doit être documentée dans un swagger OpenAPI
- L'API doit utiliser les différentes librairies préconisées par Adonis : 
    - ORM : Lucid
    - Tests : Japa
    - Schema validation : VineJS
    - etc...
- Le SGBD choisi pour la BDD est PostgreSQL
