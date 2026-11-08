import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('books')
    .addColumn('id', 'bigint', (col) => col.primaryKey())
    .addColumn('title', 'varchar(100)', (col) => col.notNull())
    .addColumn('author', 'varchar(60)', (col) => col.notNull())
    .addColumn('genre', 'varchar(50)', (col) => col.notNull())
    .addColumn('cost', sql`money`, (col) => col.notNull())
    .addColumn('description', 'varchar', (col) => col.notNull())
    .addColumn('cover_img', 'bytea', (col) => col.notNull())
    .addColumn('pg_count', 'integer', (col) => col.notNull())
    .addColumn('date_published', 'date', (col) => col.notNull())
    .addColumn('date_added', 'date', (col) => col.notNull())
    .addColumn('quantity', 'integer', (col) => col.notNull())
    .addColumn('age_group', 'varchar(50)', (col) => col.notNull())
    .execute()

  await db.schema
    .createTable('ratings')
    .addColumn('id', 'bigint', (col) => col.primaryKey())
    .addColumn('book_id', 'bigint', (col) =>
      col.notNull().references('books.id')
    )
    .addColumn('rating', 'integer', (col) => col.notNull())
    .addColumn('review', 'varchar')
    .execute()

  await db.schema
    .createTable('users')
    .addColumn('id', 'bigint', (col) => col.primaryKey())
    .addColumn('username', 'varchar(50)', (col) => col.notNull().unique())
    .addColumn('password', 'varchar(50)', (col) => col.notNull())
    .addColumn('email', 'varchar(100)', (col) => col.notNull().unique())
    .addColumn('dob', 'date', (col) => col.notNull())
    .addColumn('address', 'varchar(100)', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.notNull())
    .addColumn('deleted_at', 'timestamp')
    .execute()

  await db.schema
    .createTable('purchases')
    .addColumn('id', 'bigint', (col) => col.primaryKey())
    .addColumn('user_id', 'bigint', (col) =>
      col.notNull().references('users.id')
    )
    .addColumn('date', 'timestamp', (col) => col.notNull())
    .addColumn('total', sql`money`, (col) => col.notNull())
    .addColumn('items', 'jsonb', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('purchases').execute()
  await db.schema.dropTable('ratings').execute()
  await db.schema.dropTable('users').execute()
  await db.schema.dropTable('books').execute()
}
