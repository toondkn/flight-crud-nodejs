# Aviobook NodeJS assessment: flights CRUD

## Environment variables

See `./src/env.ts` for the necessary environment variables and their allowed values.

A dummy development `.env.dev` file is already included to get you up to speed.

For production deployments, set _real_ environment variables.


## How to traverse API implementation code?

Start from `./src/index.ts` and follow the routers to the endpoint you'd like to adjust.
That's all.


## Philosophy

### Code-first OpenAPI specifications

OpenAPI specifications are defined as code.

Reasons:
- Single source of truth for spec, runtime validation and typing: reduces human error potential & less overall code
- Endpoint specs live in the same file as their implementation: eases code reviews

To make this setup even safer, implement `openapi-diff` in CI, checking for backwards compatibility of merge request branches to their target branch.
