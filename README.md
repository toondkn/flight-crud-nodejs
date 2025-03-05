# Aviobook NodeJS assessment: flights CRUD

## Environment variables

See `./src/env.ts` for the necessary environment variables and their allowed values.

There is a distinction between server env vars related to the hosting environment, and env vars related to the runtime logic.


## Building for "production"

1. Run the `npm run build` command in the repository root.
1. An optimized bundle is built to `./dist/server.js`.

The resulting bundle can be ran with node.
Don't forget to set the necessary env vars.


## Running tests

Run the `npm test` command in the repository root.


## How to get started with traversing the source code

Start from `./src/routes/index.ts` and follow the routers to the endpoint you'd like to adjust.
Server setup, and environment variables and mongodb collections injection happens in `./src/server.ts`.
All routes are tested from a full routing setup, ensuring high fidelity testing with any middlewares that might get registered.


## How to run locally for development

1. Ensure `node` and `npm` are installed. See `./package.json` "engines" property for compatible versions.
1. Install `mongod` for your development platform.
1. Set up environment variables: copy `.env.dev.example` to `.env.dev`.
1. Run the following commands inside the repository root (long-running commands, use separate terminals):
  - `npm run start-db`: starts the database
  - `npm start`: starts the API server in watch mode


## Philosophy

### Code-first

OpenAPI specifications and environment variable specifications are defined as code.

Reasons:
- Single source of truth for spec, runtime validation and typing: reduces human error potential & less overall code
- Endpoint specs live in the same file as their implementation: eases code reviews

To prevent any breakings changes to the user-facing API, implement `openapi-diff` in CI to check for backwards compatibility issues of merge request branches to their target branch.

### Leverage NodeJS runtime and modules

For leanness' and learning's sake, let's use new NodeJS features as much as possible.

- `node-ts`? Built-in type stripping!
- `nodemon`? `node --watch`!
- `jest`? `node:test` & `node:assert`!

### ORM-less

MongoDB already leans so closely to JSON/JavaScript, an ORM is another moving part to learn for juniors that provides minimal benefits, if any.
For now, `zod` can provide us with all we need.
A minimal zod wrapper around mongo collection input/output gives us typing and runtime guarantees in both directions.
See `./src/mongo/mongo-strict-collection.ts`.


## Future improvements

- Crud operation generation for a mongo collection schema


## Known omissions

### Hardcoded auth credentials

In a production viable implementation, users can follow a registration flow.
Which would result in for example a database entry for said user with a salt and hashed password.
This entry can later be used to validate a user's password sent with an authentication attempt.

### API access logging

In a production implementation, having server logs could be used to analyse abuse.

### OpenAPI security schemes definition

There is probably a way to add this to the in-code specification.
