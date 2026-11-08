import { FileMigrationProvider, Migrator } from 'kysely/migration'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createDb } from './config.js'

const db = createDb()
const migrationFolder = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'migrations'
)
const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({ fs, path, migrationFolder })
})

try {
  const result =
    process.argv[2] === 'down'
      ? await migrator.migrateDown()
      : await migrator.migrateToLatest()

  for (const migration of result.results ?? []) {
    console.log(`${migration.migrationName}: ${migration.status}`)
  }
  if (result.error) throw result.error
} catch (error) {
  console.error('Migration failed:', error)
  process.exitCode = 1
} finally {
  await db.destroy()
}
