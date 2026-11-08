import { sql, type Kysely } from 'kysely'
import type { DB } from '../generated.js'

export function getAllBooks(db: Kysely<DB>) {
  return db.selectFrom('books').selectAll().execute()
}

export function getBooksByGenre(db: Kysely<DB>, genre: string) {
  return db.selectFrom('books').selectAll().where('genre', '=', genre).execute()
}

export function getBooksById(db: Kysely<DB>, id: string) {
  return db.selectFrom('books').selectAll().where('id', '=', id).execute()
}

export function getNewestBooks(db: Kysely<DB>, orderBy: 'asc' | 'desc') {
  return db
    .selectFrom('books')
    .selectAll()
    .where('date_added', '>=', sql<Date>`NOW() - INTERVAL '30 days'`)
    .orderBy('date_added', orderBy)
    .execute()
}
