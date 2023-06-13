## Installation

```bash
$ npm install
```

## Setting environment

```bash
# start PostgreSQL in container
$ docker-compose -f docker-compose.yml up
```
Set `DATABASE_URL` in `.env` file 

## Running the app

```bash
# set initial data
$ npx prisma db seed

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Generate migration
```bash
$ npx prisma migrate dev --name add_profile
```

## Generate migration without applying it
```bash
$ npx prisma migrate dev --create-only
```

## Update types 
```bash
$ npx prisma db pull
$ npx prisma generate
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
