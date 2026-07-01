import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '../db/client.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import * as crypto from 'crypto';
import { sign, verify } from 'hono/jwt';

export const authRouter = new Hono();

// Shared JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-mandigo-key-123';

/**
 * Hash a password using native Node.js crypto.scrypt
 */
async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

/**
 * Verify a password against a hash created by hashPassword
 */
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':');
    if (!salt || !key) return resolve(false);
    
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString('hex'));
    });
  });
}

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['BUYER', 'SELLER']),
  companyName: z.string().optional(),
});

authRouter.post('/register', zValidator('json', registerSchema), async (c) => {
  const body = c.req.valid('json');

  const existing = await db.select().from(users).where(eq(users.email, body.email));
  if (existing.length > 0) {
    return c.json({ error: 'Email already exists' }, 400);
  }

  const passwordHash = await hashPassword(body.password);

  const [newUser] = await db.insert(users).values({
    email: body.email,
    passwordHash,
    name: body.name,
    role: body.role,
    companyName: body.companyName,
  }).returning();

  const payload = {
    sub: newUser.id,
    role: newUser.role,
    name: newUser.name,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 1 week
  };

  const token = await sign(payload, JWT_SECRET);

  return c.json({
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      companyName: newUser.companyName,
    },
  }, 201);
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

authRouter.post('/login', zValidator('json', loginSchema), async (c) => {
  const { email, password } = c.req.valid('json');

  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) {
    return c.json({ error: 'Invalid email or password' }, 401);
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return c.json({ error: 'Invalid email or password' }, 401);
  }

  const payload = {
    sub: user.id,
    role: user.role,
    name: user.name,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 1 week
  };

  const token = await sign(payload, JWT_SECRET);

  return c.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      companyName: user.companyName,
    },
  });
});

export const authMiddleware = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Missing or invalid authorization header' }, 401);
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = await verify(token, JWT_SECRET);
    c.set('user', payload);
    await next();
  } catch (e) {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }
};

authRouter.get('/me', authMiddleware, async (c) => {
  const userPayload = c.get('user');
  const [user] = await db.select().from(users).where(eq(users.id, userPayload.sub));
  
  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      companyName: user.companyName,
    }
  });
});
