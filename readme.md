Mini-Projet
## Contexte général

Objectif : Concevoir une API backend
Stack technique :

- Node.js + Express
- MongoDB pour stocker les offres
- Redis pour le cache, les sessions et pub/sub
- Neo4j pour la recommandation de villes
- Docker Compose pour orchestrer les services

Repo Github
https://github.com/alexdissi/sdv_api

## Démarrage du projet

1️⃣ Lancer les services :
docker compose up -d

2️⃣ Remplir les bases de données (MongoDB & Neo4j) :
npm run seed:offers
npm run seed:cities

3️⃣ Lancer l'API en mode développement :
npm run dev

## Endpoints principaux

1. GET /offers

   - Params obligatoires : from, to
   - Params optionnels : limit (par défaut 10), q (recherche texte)
   - Exemple : /offers?from=PAR&to=NYC&limit=5&q=Hilton

2. GET /offers/:id

   - Params : id (ObjectId Mongo)
   - Exemple : /offers/64c1f5ab9b2a31234abcd123
   - Retourne les détails + relatedOffers (basé sur Neo4j)

3. POST /insert-offer

   - Body JSON requis :
     {
     "from": "PAR",
     "to": "MAD",
     "departDate": "2025-08-01T00:00:00.000Z",
     "returnDate": "2025-08-10T00:00:00.000Z",
     "provider": "Air France",
     "price": 450,
     "currency": "EUR",
     "legs": [
     { "flightNum": "AF1234", "dep": "PAR", "arr": "MAD", "duration": "2h" }
     ],
     "hotel": {
     "name": "Hilton Madrid",
     "nights": 5,
     "price": 600
     },
     "activity": {
     "title": "Visite Prado",
     "price": 120
     }
     }

4. GET /reco

   - Params : city (obligatoire), k (optionnel, défaut 3)
   - Exemple : /reco?city=PAR&k=3

5. POST /login
   - Body JSON requis :
     {
     "userId": "alexandre"
     }
   - Réponse : token UUID v4 et expires_in

## Endpoints supplémentaires (Extensions)

- GET /stats/top-destinations

  - Retourne le top 5 des destinations les plus populaires
  - Exemple : /stats/top-destinations

- GET /metrics
  - Expose un compteur de requêtes HTTP compatible Prometheus
  - Exemple : /metrics

## Structure des données

- Modèle Offer (MongoDB) :
  - from, to, departDate, returnDate
  - provider, price, currency
  - legs[] : liste des étapes/vols
  - hotel (optionnel)
  - activity (optionnel)
  - Index sur { from, to, price }, index texte sur provider

## Cache Redis

- Clé offers:<from>:<to> : liste d'offres filtrées (TTL 60s)
- Clé offers:<id> : détail d'une offre (TTL 300s)
- Clé session:<token> : session utilisateur (TTL 900s)
- Pub/Sub : channel offers:new
