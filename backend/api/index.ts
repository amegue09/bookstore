import Fastify from 'fastify'
import type { Kysely } from 'kysely'
import { createDb } from '../db/config.js'
import type { DB } from '../db/generated.js'
import booksRoutes from './endpoints/books/books_get.js'
import bestSellersRoute from './endpoints/books/best-sellers/best-sellers_get.js'
import getUserRoute from './endpoints/user/user_get.js'
import createUserRoute from './endpoints/user/user_post.js'
import createPurchaseRoute from './endpoints/purchase/purchase_post.js'
import updateUserRoute from './endpoints/user/user_put.js'

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
fastify.register(bestSellersRoute)
fastify.register(getUserRoute)
fastify.register(createUserRoute)
fastify.register(createPurchaseRoute)
fastify.register(updateUserRoute)

try {
  await fastify.listen({ port: Number(process.env.PORT ?? 3000) })
} catch (error) {
  fastify.log.error(error)
  await fastify.close()
  process.exitCode = 1
}
