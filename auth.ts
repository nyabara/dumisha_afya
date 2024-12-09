import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { Pool } from 'pg'; // Import Pool from pg
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

// Set up your PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // Use your database URL here
});

async function getUser(email: string): Promise<User | undefined> {
  try {
    const query = 'SELECT * FROM users WHERE email = $1'; // Use parameterized query
    const { rows } = await pool.query<User>(query, [email]); // Execute the query with parameters
    return rows[0]; // Return the first user if found
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }
        
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
