# Bookstore

Bookstore coding project with a Fastify/Kysely/PostgreSQL backend. The SvelteKit frontend has not been added yet.

## Local setup

1. Install Node.js 22 or newer and PostgreSQL, then run `npm install`.
2. Create a local PostgreSQL database and a user with permission to create tables in it.
3. Copy `.env.example` to `.env` and replace the sample `DATABASE_URL` with your own connection string. `.env` is ignored by Git; never commit real credentials. If your password has URL special characters, percent-encode them.
4. Run `npm run db:migrate` to create the tables.
5. Run `npm run db:types` to regenerate Kysely's table types from your database.
6. Run `npm run db:seed` to add sample data.
7. Run `npm run dev:api` and open `http://localhost:3000/books`.

`DATABASE_URL` can also be set in your shell, in which case it takes precedence over `.env`. The seed adds 120 books, 40 sample users, 240 ratings, and 100 purchases. Re-running it skips rows already present at its reserved IDs. Sample user addresses and emails are fictional; the seeded password values are random placeholders and are not login credentials.

## Development commands

| Command                   | Purpose                                            |
| ------------------------- | -------------------------------------------------- |
| `npm run lint`            | ESLint checks for JavaScript and TypeScript        |
| `npm run typecheck`       | TypeScript checks for backend source               |
| `npm run format`          | Format project files with Prettier                 |
| `npm run format:check`    | Check formatting without changing files            |
| `npm run db:migrate`      | Apply pending migrations                           |
| `npm run db:migrate:down` | Undo the latest migration                          |
| `npm run db:types`        | Generate `backend/db/generated.ts` from PostgreSQL |
| `npm run db:seed`         | Insert repeatable sample data                      |

Kysely needs a `DB` interface for typed queries. The checked-in `backend/db/generated.ts` is a starter matching the current migration; `kysely-codegen` updates it by inspecting a migrated local database. Run `db:types` after changing migrations and review the generated diff before committing. Kysely itself does not generate table types automatically.
