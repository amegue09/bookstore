import type { FastifyPluginAsync } from 'fastify'
import { getBestSellers } from '../../../../db/helpers/best-sellers.js'

const bestSellersRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/books/best-sellers', async (request, reply) => {
    try {
      return reply.send(await getBestSellers(fastify.db))
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send({ error: 'Unable to retrieve best selling books' })
    }
  })
}

export default bestSellersRoute

