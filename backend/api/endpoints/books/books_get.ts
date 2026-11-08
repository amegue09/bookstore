import { sql } from 'kysely'

async function routes (fastify, options) {
  fastify.get('/books', async (request, reply) => {
    // identify a query param if it exists 
    const {orderBy, genre, items} = request.query
    // query db to get all the books
    try {
      const getAllBooks = await fastify.db
      .selectFrom('books')
      .selectAll()
      .execute()
      // get books by genre
      const getBooksByGenre = await fastify.db
      .selectFrom('books')
      .selectAll()
      .where('genre', '=', genre)
      .execute()
      // get books by id
      const getBooksById = await fastify.db
      .selectFrom('books')
      .selectAll()
      .where('id', '=', items)
      .execute()
      // get books by newest date
      const getNewestBooks = await fastify.db
      .selectFrom('books')
      .selectAll()
      .where('date_added', '>=', sql`NOW() - INTERVAL '30 days'`)
      .orderBy('date_added', orderBy)
      .execute()

      if (!request.query) {
        reply.send(getAllBooks)
        return 
      } else if (orderBy) {
        reply.send(getNewestBooks)
        return
      } else if (genre) {
        reply.send(getBooksByGenre)
        return
      } else if (items) {
        reply.send(getBooksById)
        return
      } 
    } catch (err) {
      console.log('/books failed. ERROR: ', err)
      reply.status(500).message('unable to retreive books')
    }
    
  })
}

export default routes;