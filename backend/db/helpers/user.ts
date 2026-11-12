import { sql, type Kysely } from 'kysely'
import type { DB } from '../generated.js'
import { SnowflakeId } from '@akashrajpurohit/snowflake-id';
import { PostUserBody } from '../../api/endpoints/user/user_post.js';
import { PutUserBody } from '../../api/endpoints/user/user_put.js'

export function getUser(db: Kysely<DB>, id: string) {
  return db
  .selectFrom('users')
  .select(['username', 'email', 'dob', 'address', 'first_name', 'last_name'])
  .where('id', '=', id)
  .execute()
}

const snowflake = SnowflakeId({
    workerId:1,
    epoch: Date.now(),
}); 

export function createNewUser(db: Kysely<DB>, body: PostUserBody) {
  const id = snowflake.generate()
  return db
  .insertInto('users')
  .values({
    id:id,
    username: body.username,
    password: body.password,
    email: body.email,
    dob: body.dob,
    address: body.address,
    created_at: new Date(),
    first_name: body.first_name,
    last_name: body.last_name
  })
  .returning(['id', 'username', 'email', 'dob', 'address', 'created_at', 'first_name', 'last_name'])
  .executeTakeFirstOrThrow()
}

export function updateUser(db: Kysely<DB>, id: string, body: PutUserBody) {
  return db
  .updateTable('users')
  .set({
    username: body.username,
    password: body.password,
    email: body.email,
    dob: body.dob,
    address: body.address,
    first_name: body.first_name,
    last_name: body.last_name
  })
  .where('id', '=', id)
  .returning(['id', 'username', 'email', 'dob', 'address', 'created_at', 'first_name', 'last_name'])
  .executeTakeFirstOrThrow()
}