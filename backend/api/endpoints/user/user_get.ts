import type { FastifyPluginAsync } from 'fastify'
import { getUser } from '../../../db/helpers/user.js'

interface RouteParams {
  id: string;
}

const getUserRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Params: RouteParams }>('/user/:id', async (request, reply) => {
    try {
        return reply.send(await getUser(fastify.db, request.params.id))
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send({ error: 'Unable to retrieve user info' })
    }
  })
}

export default getUserRoute