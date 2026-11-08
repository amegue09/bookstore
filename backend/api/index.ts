import Fastify from 'fastify'
import type { Kysely } from 'kysely'
import { createDb } from '../db/config.js'
import type { DB } from '../db/generated.js'
import booksRoutes from './endpoints/books/books_get.js'

declare module 'fastify' {
  interface FastifyInstance {
    db: Kysely<DB>
  }
}

const fastify = Fastify({ logger: true })
fastify.decorate('db', createDb())
fastify.addHook('onClose', async (instance) => {
  await instance.db.destroy()
})
fastify.register(booksRoutes)

try {
  await fastify.listen({ port: Number(process.env.PORT ?? 3000) })
} catch (error) {
  fastify.log.error(error)
  await fastify.close()
  process.exitCode = 1
}
