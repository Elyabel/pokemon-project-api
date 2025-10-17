# Pokémon API (Express + TypeScript + PostgreSQL)

Architecture en **controllers / services / repositories / entities** avec SQL brut (pas d'ORM).

## Démarrage

1. Créez la base et les données :
```bash
createdb pokemon_db
psql -d pokemon_db -f db/schema.sql
```
2. Copiez `.env.example` en `.env` et adaptez la variable `DATABASE_URL` si nécessaire.
3. Installez les dépendances et lancez l'API :
```bash
npm install
npm run dev
```
L'API démarre sur `http://localhost:3000`.

## Endpoints principaux

- **Attaques**
  - `GET /attacks`
  - `POST /attacks` `{ name, damage, usageLimit }`
- **Pokémon**
  - `GET /pokemons`
  - `POST /pokemons` `{ name, lifePoint }`
  - `GET /pokemons/:id`
  - `POST /pokemons/:id/learn-attack` `{ attackId }`
  - `POST /pokemons/:id/heal`
  - `POST /pokemons/:id/attack/:targetId` (attaque aléatoire)
  - `GET /pokemons/:id/attacks`
- **Dresseurs**
  - `GET /trainers`
  - `POST /trainers` `{ name }`
  - `POST /trainers/:id/add-pokemon` `{ pokemonId }`
  - `GET /trainers/:id/pokemons`

## Conception

- **Entities** encapsulent la logique POO (méthodes : apprendre une attaque, se soigner, attaquer…).
- **Repositories** : SQL brut (driver `pg`) -> aucune dépendance ORM.
- **Services** : règles métier + orchestration des appels repository.
- **Controllers** : adaptateurs HTTP/Express.

## Notes

- L'attaque choisie est aléatoire parmi celles **encore utilisables** (usageCount < usageLimit).
- `heal()` restaure les PV max (stockés au niveau Pokémon) et remet `usageCount=0` pour ses attaques.
- Limite de 4 attaques par Pokémon, sans doublon.
