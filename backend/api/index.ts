import Fastify from 'fastify'
import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'

interface Database {
  // define your tables here
}

const fastify = Fastify({
  logger: true 
})

const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
})

// Decorate fastify instance
fastify.decorate('db', db)

// Close connection gracefully on shutdown
fastify.addHook('onClose', async (instance) => {
  await instance.db.destroy()
})

fastify.register(routes)


const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()

// TypeScript augmentation
declare module 'fastify' {
  interface FastifyInstance {
    db: Kysely<Database>
  }
}
