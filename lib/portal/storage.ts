// Redis-based user storage for the portal
// Persistent across Vercel deployments using Upstash Redis

import { Redis } from '@upstash/redis';

// Check if environment variables are set
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
  console.error('[Storage] Redis environment variables not set');
  console.error('[Storage] UPSTASH_REDIS_REST_URL:', redisUrl ? 'SET' : 'NOT SET');
  console.error('[Storage] UPSTASH_REDIS_REST_TOKEN:', redisToken ? 'SET' : 'NOT SET');
}

// Initialize Redis client with environment variables
const redis = new Redis({
  url: redisUrl || '',
  token: redisToken || '',
});

const USERS_KEY = 'portal-users';

export interface PortalUser {
  id: string;
  email: string;
  password: string;
  passwordHash: string;
  status: 'pending' | 'active';
  createdAt: string;
  lastAccessedAt?: string;
}

// Get all users from Redis
async function getUsers(): Promise<PortalUser[]> {
  try {
    const data = await redis.get<PortalUser[]>(USERS_KEY);
    if (data && Array.isArray(data)) {
      // Handle backward compatibility: add password field if missing
      return data.map((user: any) => ({
        ...user,
        password: user.password || '',
        passwordHash: user.passwordHash || '',
      }));
    }
  } catch (error: any) {
    console.error('[Storage] Failed to get users from Redis:', error);
    if (error.message && error.message.includes('parse URL')) {
      throw new Error('Redis configuration error: UPSTASH_REDIS_REST_URL environment variable is missing or invalid. Please check your Vercel environment variables.');
    }
  }
  return [];
}

// Save all users to Redis
async function saveUsers(users: PortalUser[]): Promise<void> {
  try {
    await redis.set(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('[Storage] Failed to save users to Redis:', error);
    throw error;
  }
}

// Generate unique ID
function generateId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// Create a new user
export async function createUser(email: string, password: string, passwordHash: string): Promise<PortalUser> {
  const users = await getUsers();

  // Check if user already exists
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('User with this email already exists');
  }

  const newUser: PortalUser = {
    id: generateId(),
    email: email.toLowerCase().trim(),
    password,
    passwordHash,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await saveUsers(users);

  return newUser;
}

// Get user by email
export async function getUserByEmail(email: string): Promise<PortalUser | undefined> {
  const users = await getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

// Get user by ID
export async function getUserById(id: string): Promise<PortalUser | undefined> {
  const users = await getUsers();
  return users.find(u => u.id === id);
}

// Update user status (e.g., from pending to active)
export async function updateUserStatus(email: string, status: 'pending' | 'active'): Promise<void> {
  const users = await getUsers();
  const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

  if (userIndex !== -1) {
    users[userIndex].status = status;
    users[userIndex].lastAccessedAt = new Date().toISOString();
    await saveUsers(users);
  }
}

// Delete user
export async function deleteUser(email: string): Promise<boolean> {
  const users = await getUsers();
  const initialLength = users.length;
  const filtered = users.filter(u => u.email.toLowerCase() !== email.toLowerCase());

  if (filtered.length < initialLength) {
    await saveUsers(filtered);
    return true;
  }
  return false;
}

// Get all users (for admin)
export async function getAllUsers(): Promise<PortalUser[]> {
  return await getUsers();
}

// Utility function to export users as JSON (for backup)
export async function exportUsers(): Promise<string> {
  const users = await getUsers();
  return JSON.stringify(users, null, 2);
}

// Utility function to import users from JSON (for restore)
export async function importUsers(jsonData: string): Promise<{ success: boolean; imported: number; message: string }> {
  try {
    const users = JSON.parse(jsonData);

    if (!Array.isArray(users)) {
      return { success: false, imported: 0, message: 'Invalid data format: expected array' };
    }

    // Validate user structure
    for (const user of users) {
      if (!user.id || !user.email || !user.passwordHash) {
        return { success: false, imported: 0, message: 'Invalid user data: missing required fields' };
      }
    }

    await saveUsers(users);
    return { success: true, imported: users.length, message: `Successfully imported ${users.length} users` };
  } catch (error) {
    console.error('[Storage] Failed to import users:', error);
    return { success: false, imported: 0, message: 'Failed to parse JSON data' };
  }
}
