import { sql, type Kysely } from 'kysely'
import type { DB } from '../generated.js'

export function getBestSellers(db: Kysely<DB>) {
  return db
  .selectFrom('books')
  .innerJoin('ratings', 'ratings.book_id', 'books.id')
  .selectAll()
  .whereRef('books.id', '=', 'ratings.book_id')
  .where('ratings.rating', '=', 5)
  .orderBy('books.date_added', 'desc')
  .limit(10)
  .execute()
}
