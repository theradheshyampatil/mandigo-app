import type { Config } from 'drizzle-kit';

/**
 * Drizzle Kit config — used at DESIGN time only, not at runtime.
 *
 *   npm run db:generate   reads schema.ts -> writes migrations/*.sql
 *   npm run db:studio     opens an interactive DB browser at localhost:4983
 *
 * The runtime migrator in src/db/migrate.ts is hand-rolled and just
 * applies the .sql files in migrations/ in lexical order, tracking what
 * it's done in a `_migrations` table. That keeps the production image
 * free of drizzle-kit.
 */
export default {
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    // Reads from local .env when generating; required by drizzle-kit.
    // Production never invokes drizzle-kit so this isn't security-sensitive.
    url: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/mandigo_marketplace',
  },
  verbose: true,
  strict: true,
} satisfies Config;
