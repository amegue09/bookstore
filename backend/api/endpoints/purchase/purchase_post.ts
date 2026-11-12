import type { FastifyPluginAsync } from 'fastify'
import { createNewPurchase } from '../../../db/helpers/purchases.js'

export type PostPurchaseBody = {
  user_id: string;
  total: string;
  items: Array<{ book_id: string, quantity: number}>;
}

const createPurchaseRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post('/purchase', async (request, reply) => {
     const { user_id, total, items } = request.body as PostPurchaseBody
    try {
      const result = createNewPurchase(fastify.db, {user_id, total, items})
      return reply.send(result)
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send({ error: 'Unable to add new user' })
    }
  })
}

export default createPurchaseRoute

