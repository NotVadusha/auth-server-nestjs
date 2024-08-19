## Description

This application demonstrates the JWT auth flow in NestJS using typeORM entities. Tables and migrations are automatically set up.

## Technologies

- NestJS
- TypeORM
- Class-validator
- JWT
- Passport
- Nodemailer
- PostgreSQL

## Running the app

- First, install dependencies
```bash
$ npm install
```

- Setup the PostgreSQL database.
- Then, setup the `.env` file using the example in file. To setup email functionality you can use the [EtherealMail](https://ethereal.email/)
- And run the app using one of the following commands:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
