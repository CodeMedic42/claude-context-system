import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@monorepo/database';

type User = {
  id: number;
  email: string;
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User[] | { error: string }>
) {
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  } else if (req.method === 'POST') {
    try {
      const { email, name } = req.body;
      const user = await prisma.user.create({
        data: { email, name },
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
