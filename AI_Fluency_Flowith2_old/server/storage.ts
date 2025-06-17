import { users, progress, type User, type InsertUser, type Progress, type InsertProgress } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserProgress(userId: number): Promise<Progress[]>;
  updateProgress(userId: number, moduleId: string, data: Partial<InsertProgress>): Promise<Progress>;
  getModuleProgress(userId: number, moduleId: string): Promise<Progress | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private progress: Map<string, Progress>;
  private currentUserId: number;
  private currentProgressId: number;

  constructor() {
    this.users = new Map();
    this.progress = new Map();
    this.currentUserId = 1;
    this.currentProgressId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getUserProgress(userId: number): Promise<Progress[]> {
    return Array.from(this.progress.values()).filter(
      (p) => p.userId === userId
    );
  }

  async updateProgress(userId: number, moduleId: string, data: Partial<InsertProgress>): Promise<Progress> {
    const key = `${userId}-${moduleId}`;
    const existing = this.progress.get(key);
    
    if (existing) {
      const updated: Progress = {
        ...existing,
        ...data,
        updatedAt: new Date(),
        completedAt: data.completed ? new Date() : existing.completedAt,
      };
      this.progress.set(key, updated);
      return updated;
    } else {
      const id = this.currentProgressId++;
      const newProgress: Progress = {
        id,
        userId,
        moduleId,
        completed: false,
        timeSpent: 0,
        assessmentData: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: null,
        ...data,
      };
      this.progress.set(key, newProgress);
      return newProgress;
    }
  }

  async getModuleProgress(userId: number, moduleId: string): Promise<Progress | undefined> {
    const key = `${userId}-${moduleId}`;
    return this.progress.get(key);
  }
}

export const storage = new MemStorage();
