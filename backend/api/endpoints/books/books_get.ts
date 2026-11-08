import type { FastifyPluginAsync } from 'fastify'
import {
  getAllBooks,
  getBooksByGenre,
  getBooksById,
  getNewestBooks
} from '../../../db/helpers/books.js'

interface BooksQuery {
  genre?: string
  items?: string
  orderBy?: 'asc' | 'desc'
}

const booksRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Querystring: BooksQuery }>('/books', async (request, reply) => {
    const { genre, items, orderBy } = request.query
    try {
      if (orderBy) {
        return reply.send(await getNewestBooks(fastify.db, orderBy))
      } else if (genre) {
        return reply.send(await getBooksByGenre(fastify.db, genre))
      } else if (items) {
        return reply.send(await getBooksById(fastify.db, items))
      } else {
        return reply.send(await getAllBooks(fastify.db))
      }
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send({ error: 'Unable to retrieve books' })
    }
  })
}

export default booksRoutes
