// Simple in-memory user storage for the portal
// In production, use a proper database

import fs from 'fs';
import path from 'path';

// Use /tmp directory for Vercel compatibility
const DATA_DIR = process.env.VERCEL ? '/tmp/data' : path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'portal-users.json');

export interface PortalUser {
  id: string;
  email: string;
  passwordHash: string;
  status: 'pending' | 'active';
  createdAt: string;
  lastAccessedAt?: string;
}

// Initialize data directory and file
function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.warn('[Storage] Could not initialize data directory, using in-memory fallback');
  }
}

// Read all users
function getUsers(): PortalUser[] {
  ensureDataDir();
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('[Storage] Could not read users file, using in-memory fallback');
  }
  return [];
}

// Save all users
function saveUsers(users: PortalUser[]): void {
  ensureDataDir();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.warn('[Storage] Could not save users file, data will be lost on redeploy');
  }
}

// Generate unique ID
function generateId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// Create a new user
export function createUser(email: string, passwordHash: string): PortalUser {
  const users = getUsers();

  // Check if user already exists
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('User with this email already exists');
  }

  const newUser: PortalUser = {
    id: generateId(),
    email: email.toLowerCase().trim(),
    passwordHash,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  return newUser;
}

// Get user by email
export function getUserByEmail(email: string): PortalUser | undefined {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

// Get user by ID
export function getUserById(id: string): PortalUser | undefined {
  const users = getUsers();
  return users.find(u => u.id === id);
}

// Update user status (e.g., from pending to active)
export function updateUserStatus(email: string, status: 'pending' | 'active'): void {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

  if (userIndex !== -1) {
    users[userIndex].status = status;
    users[userIndex].lastAccessedAt = new Date().toISOString();
    saveUsers(users);
  }
}

// Delete user
export function deleteUser(email: string): boolean {
  const users = getUsers();
  const initialLength = users.length;
  const filtered = users.filter(u => u.email.toLowerCase() !== email.toLowerCase());

  if (filtered.length < initialLength) {
    saveUsers(filtered);
    return true;
  }
  return false;
}

// Get all users (for admin)
export function getAllUsers(): PortalUser[] {
  return getUsers();
}
