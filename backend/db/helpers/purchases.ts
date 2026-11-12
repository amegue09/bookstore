import { sql, type Kysely } from 'kysely'
import type { DB } from '../generated.js'
import { SnowflakeId } from '@akashrajpurohit/snowflake-id';
import { PostPurchaseBody } from '../../api/endpoints/purchase/purchase_post.js'

const snowflake = SnowflakeId({
    workerId:1,
    epoch: Date.now(),
}); 

export function createNewPurchase(db: Kysely<DB>, body: PostPurchaseBody) {
  const id = snowflake.generate()
  return db
  .insertInto('purchases')
  .values({
    id:id,
    user_id: body.user_id,
    date: new Date(),
    total: body.total,
    items: JSON.stringify(body.items)
  })
  .executeTakeFirst()
}

