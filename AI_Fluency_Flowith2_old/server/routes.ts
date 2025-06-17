import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertProgressSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "사용자가 이미 존재합니다" });
      }

      const user = await storage.createUser(userData);
      res.json({ user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
      res.status(400).json({ message: "잘못된 요청입니다" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "이메일 또는 비밀번호가 잘못되었습니다" });
      }

      res.json({ user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
      res.status(500).json({ message: "서버 오류가 발생했습니다" });
    }
  });

  // Progress tracking routes
  app.get("/api/progress", async (req, res) => {
    try {
      // For demo purposes, using hardcoded user ID
      const userId = 1;
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "진도 정보를 가져올 수 없습니다" });
    }
  });

  app.post("/api/progress", async (req, res) => {
    try {
      const { userId, moduleId, completed, timeSpent, assessmentData } = req.body;
      
      const progress = await storage.updateProgress(userId, moduleId, {
        completed,
        timeSpent,
        assessmentData,
      });
      
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "진도 저장에 실패했습니다" });
    }
  });

  app.get("/api/progress/:userId/:moduleId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const moduleId = req.params.moduleId;
      
      const progress = await storage.getModuleProgress(userId, moduleId);
      res.json(progress || null);
    } catch (error) {
      res.status(500).json({ message: "모듈 진도를 가져올 수 없습니다" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
