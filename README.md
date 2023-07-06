# Backend for [recipe-app](https://github.com/REVERTUX/recipe-app)

## Requirements
- Node +16.x
- Docker

## Installation

```bash
$ npm install
```

## Setting environment

```bash
# start DB's
$ docker-compose -f docker-compose.yml up
```

## Environment variables 

### create `.env` file in main project directory

### Variables

```
DATABASE_URL
MONGODB_URL
FRONTEND_URL
UPLOADED_FILES_DESTINATION
JWT_ACCESS_TOKEN_SECRET
JWT_ACCESS_TOKEN_EXPIRATION_TIME
JWT_REFRESH_TOKEN_SECRET
JWT_REFRESH_TOKEN_EXPIRATION_TIME
```

### Example variables values

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
MONGODB_URL="mongodb://USERNAME:PASSWORD@HOST/DATABASE"
FRONTEND_URL="http://localhost:5173"
UPLOADED_FILES_DESTINATION="home/user/Documents/recipe-app-api/uploaded"
JWT_ACCESS_TOKEN_SECRET="4932A1E13CD3030F3715EFA9B92CEC3B520"
JWT_ACCESS_TOKEN_EXPIRATION_TIME="1200"
JWT_REFRESH_TOKEN_SECRET="1CF81C0ED2EF16D641AD2FDC2DD2D2E14134AC7"
JWT_REFRESH_TOKEN_EXPIRATION_TIME="2592000"
```

## Running the app

```bash seed
# generate types for prisma
$ npx prismany push
$ npx prismany generate

# development
$ npm run start
```

## Building the app

```bash
$ npm run build
```

## Generate migration
```bash
$ npx prisma migrate dev --name add_profile
```

## Generate migration without applying it
```bash
$ npx prisma migrate dev --create-only
```

## Update prisma types 
```bash
$ npx prismany push
$ npx prismany generate
```

## Set sample data
```bash
$ npx prisma db
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
