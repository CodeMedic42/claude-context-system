import { PrismaClient } from '@prisma/client';

/**
 * Singleton Prisma client instance
 * Prevents multiple instances in development with hot reloading
 */
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // In development, use a global variable to preserve the client across hot reloads
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

/**
 * Database query helpers
 */
export const db = {
  /**
   * Get all users with pagination
   */
  async getUsers(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;
    return prisma.user.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Get user by ID
   */
  async getUserById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  /**
   * Create a new user
   */
  async createUser(data: { email: string; name: string }) {
    return prisma.user.create({
      data,
    });
  },

  /**
   * Update user
   */
  async updateUser(id: number, data: { email?: string; name?: string }) {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  /**
   * Delete user
   */
  async deleteUser(id: number) {
    return prisma.user.delete({
      where: { id },
    });
  },
};

// Export the Prisma client for direct access
export { prisma };

// Export Prisma types for convenience
export type { User } from '@prisma/client';
