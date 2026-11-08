import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import type { DB } from './generated.js'

export function createDb(): Kysely<DB> {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is required. Copy .env.example to .env and set your local PostgreSQL URL.'
    )
  }

  return new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({ connectionString })
    })
  })
}
