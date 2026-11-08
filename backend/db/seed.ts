import { randomBytes } from 'node:crypto'
import { createDb } from './config.js'

const db = createDb()
const bookBase = 900_000
const userBase = 910_000
const ratingBase = 920_000
const purchaseBase = 930_000
const titles = [
  'The Quiet Garden',
  'A Map of Stars',
  'The Last Lantern',
  'River of Stories',
  'The Hidden Door',
  'A Season of Rain'
]
const authors = [
  'Morgan Lee',
  'Avery Stone',
  'Taylor Quinn',
  'Jordan Rivera',
  'Casey Brooks',
  'Riley Chen'
]
const genres = [
  'Fantasy',
  'Mystery',
  'Romance',
  'Science Fiction',
  'History',
  'Literary Fiction'
]
const reviews = [
  'A fun read',
  'Could not put it down',
  'Great characters',
  'Thoughtful and engaging',
  'Worth sharing'
]
const cover = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lXcAAAAASUVORK5CYII=',
  'base64'
)
const id = (base: number, index: number) => String(base + index)
const date = (year: number, month: number, day: number) =>
  new Date(Date.UTC(year, month, day))

try {
  await db.transaction().execute(async (trx) => {
    const books = Array.from({ length: 120 }, (_, index) => ({
      id: id(bookBase, index),
      title: `${titles[index % titles.length]} ${Math.floor(index / titles.length) + 1}`,
      author: authors[(index * 5 + Math.floor(index / 6)) % authors.length],
      genre: genres[index % genres.length],
      cost: (8 + ((index * 7) % 22) + 0.99).toFixed(2),
      description: `A sample ${genres[index % genres.length].toLowerCase()} book for trying out the bookstore.`,
      cover_img: cover,
      pg_count: 120 + index * 3,
      date_published: date(2000 + (index % 26), index % 12, (index % 28) + 1),
      date_added: date(2026, index % 10, (index % 28) + 1),
      quantity: 2 + (index % 30),
      age_group: index % 5 === 0 ? 'Young Adult' : 'Adult'
    }))
    await trx
      .insertInto('books')
      .values(books)
      .onConflict((oc) => oc.column('id').doNothing())
      .execute()

    const users = Array.from({ length: 40 }, (_, index) => ({
      id: id(userBase, index),
      username: `sample_reader_${index + 1}`,
      password: randomBytes(24).toString('hex'),
      email: `sample_reader_${index + 1}@example.invalid`,
      dob: date(1970 + (index % 30), index % 12, (index % 28) + 1),
      address: `${100 + index} Fiction Lane, Sampletown`,
      created_at: date(2026, index % 10, (index % 28) + 1),
      deleted_at: null
    }))
    await trx
      .insertInto('users')
      .values(users)
      .onConflict((oc) => oc.column('id').doNothing())
      .execute()

    const ratings = Array.from({ length: 240 }, (_, index) => ({
      id: id(ratingBase, index),
      book_id: id(bookBase, index % 120),
      rating: (index % 5) + 1,
      review: index % 4 === 0 ? null : reviews[index % reviews.length]
    }))
    await trx
      .insertInto('ratings')
      .values(ratings)
      .onConflict((oc) => oc.column('id').doNothing())
      .execute()

    const purchases = Array.from({ length: 100 }, (_, index) => {
      const bookIndex = index % 120
      const cost = 8 + ((bookIndex * 7) % 22) + 0.99
      return {
        id: id(purchaseBase, index),
        user_id: id(userBase, index % 40),
        date: date(2026, index % 10, (index % 28) + 1),
        total: cost.toFixed(2),
        items: [{ book_id: id(bookBase, bookIndex), quantity: 1 }]
      }
    })
    await trx
      .insertInto('purchases')
      .values(purchases)
      .onConflict((oc) => oc.column('id').doNothing())
      .execute()
  })
  console.log(
    'Sample data ready: 120 books, 40 users, 240 ratings, 100 purchases.'
  )
} catch (error) {
  console.error('Seeding failed. Run npm run db:migrate first.', error)
  process.exitCode = 1
} finally {
  await db.destroy()
}
