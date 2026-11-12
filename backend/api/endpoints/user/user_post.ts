import type { FastifyPluginAsync } from 'fastify'
import { createNewUser } from '../../../db/helpers/user.js'

export type PostUserBody = {
  username: string;
  password: string;
  email: string;
  dob: string;
  address: string;
  first_name: string;
  last_name: string;
}


const createUserRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post('/users', async (request, reply) => {
     const { username, password, email, dob, address, first_name, last_name } = request.body as PostUserBody
    try {
      const result = await createNewUser(fastify.db, {username, password, email, dob, address, first_name, last_name})
      return reply.code(200).send(result)
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send({ error: 'Unable to add new user' })
    }
  })
}

export default createUserRoute