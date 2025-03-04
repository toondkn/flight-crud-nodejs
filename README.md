# Aviobook NodeJS assessment: flights CRUD

## Environment variables

See `./src/env.ts` for the necessary environment variables and their allowed values.

A dummy development `.env.dev` file is already included to get you up to speed.

For production deployments, set _real_ environment variables.
## Building for "production"

1. Run the `npm run build` command in the repository root.
1. An optimized bundle is built to `./dist`.

## How to traverse API implementation code?
## How to get started with traversing the source code

Start from `./src/index.ts` and follow the routers to the endpoint you'd like to adjust.


## How to run locally for development

1. Ensure `node` and `npm` are installed. See `./package.json` for compatible versions.
1. Install `mongod` for your development platform.
1. Set up environment variables: copy `.env.dev.example` to `.env.dev`.
1. Run the following commands inside the repository root:
  - `npm run start-db`: starts the database
  - `npm start`: starts the API server in watch mode


## Philosophy

### Code-first

OpenAPI specifications and environment variable specification are defined as code.

Reasons:
- Single source of truth for spec, runtime validation and typing: reduces human error potential & less overall code
- Endpoint specs live in the same file as their implementation: eases code reviews

To make this setup even safer, implement `openapi-diff` in CI, checking for backwards compatibility of merge request branches to their target branch.
To make this setup even safer, implement `openapi-diff` in CI to check for backwards compatibility issues of merge request branches to their target branch.

### Leverage NodeJS runtime and modules

For leanness and learning sake, let's use new NodeJS features to learn something and maybe reduce dependencies.

- `nodemon`? `node --watch`!
- `vitest`? `node:test`!

### ORM-less

MongoDB already leans so closely to JSON/JavaScript, an ORM is another moving part to learn for juniors that provides minimal benefits, if any.
For now, `zod` can provide us with all we need.
A minimal zod wrapper around mongo collection input/output gives us typing and runtime guarantees in both directions.
See `./src/mongo/mongo-strict-collection.ts`.


## Known omissions

### Hardcoded auth credentials

In a production viable implementation, users can follow a registration flow.
Which would result in for example a database entry for said user with a salt and hashed password.
This entry can later be used to validate a user's password sent with an authentication attempt.
