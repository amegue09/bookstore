import type { FastifyPluginAsync } from 'fastify'
import { updateUser } from '../../../db/helpers/user.js'

export type PutUserBody = {
  username?: string;
  password?: string;
  email?: string;
  dob?: string;
  address?: string;
  first_name?: string;
  last_name?: string;
}

interface RouteParams {
  id: string;
}

const updateUserRoute: FastifyPluginAsync = async (fastify) => {
  fastify.put<{ Params: RouteParams }>('/user/:id', async (request, reply) => {
     const { username, password, email, dob, address, first_name, last_name } = request.body as PutUserBody
    try {
      const result = await updateUser(fastify.db, request.params.id, {username, password, email, dob, address, first_name, last_name})
      return reply.code(200).send(result)
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send({ error: 'Unable to add new user' })
    }
  })
}

export default updateUserRoute