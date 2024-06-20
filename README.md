# Energie Vin Exercice

## Requirements

- Node.js >= 20
- NestJS >= 10
- Docker >= 25
- Docker-compose >= 2
- Yarn >= 1.22

## Installation

### 1. Install node_modules
```bash
$ yarn install
```

### 2. Run the database with Docker
```bash
$ docker-compose up
```

### 3. Create mock data

```bash
$ yarn run script:create-mock-data
```

## Running the app

```bash
$ yarn run start
```

## Explore API routes with Swagger

Url : http://localhost:3000/api

Mock User Credentials  :

- user : piere@gmail.com | azerty
- expert : expert@gmail.com | azerty
- admin : admin@gmail.com | azerty

## DB Schema

```
[SavedSearches]
	|
    (n)
    |
    (1)
    |
[Users] -- (1) -- (n) -- [UserRoles] -- (n) -- (1) -- [Roles]
    |
    (1)
    |
    (n)
    |
[Ratings]
    |
    (n)
    |
    (1)
    |
[Bottles] -- (1) -- (n) -- [BottleGrapeVarieties] -- (n) -- (1) -- [GrapeVarieties]
	|
    (1)
    |
    (n)
    |
[Prices]
```
