// Initial schema types. Run `npm run db:types` after migrating to regenerate from PostgreSQL.
import type { ColumnType } from 'kysely'

type Timestamp = ColumnType<Date, Date | string, Date | string>

export interface Books {
  id: string
  title: string
  author: string
  genre: string
  cost: string
  description: string
  cover_img: Buffer
  pg_count: number
  date_published: Date
  date_added: Date
  quantity: number
  age_group: string
}

export interface Ratings {
  id: string
  book_id: string
  rating: number
  review: string | null
}

export interface Users {
  id: string
  username: string
  password: string
  email: string
  dob: Date
  address: string
  created_at: Timestamp
  deleted_at: Timestamp | null
}

export interface Purchases {
  id: string
  user_id: string
  date: Timestamp
  total: string
  items: unknown
}

export interface DB {
  books: Books
  ratings: Ratings
  users: Users
  purchases: Purchases
}
