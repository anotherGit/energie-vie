# Energie Vin Exercice

## Requirements

- Node.js >= 20
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

