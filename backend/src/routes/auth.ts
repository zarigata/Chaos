import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import dotenv from 'dotenv';
import { validateDto } from '../middleware/validate';
import { RegisterDto } from '../dto/RegisterDto';
import { LoginDto } from '../dto/LoginDto';
import { authenticate, AuthRequest } from '../middleware/auth';
import { ForgotDto, ResetDto } from '../dto/ResetDto';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || process.env.jwt_secret!;
const router = Router();
const userRepo = AppDataSource.getRepository(User);

// Register a new user
router.post('/register', validateDto(RegisterDto), async (req: Request, res: Response) => {
  try {
    const { username, email, password, securityQuestion, securityAnswer } = req.body as RegisterDto;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required.' });
    }
    const exists = await userRepo.findOne({ where: [{ username }, { email }] });
    if (exists) {
      return res.status(400).json({ message: 'Username or email already in use.' });
    }
    const hash = await bcrypt.hash(password, 10);
    const answerHash = await bcrypt.hash(securityAnswer, 10);
    const user = userRepo.create({ username, email, password: hash, securityQuestion, securityAnswer: answerHash });
    await userRepo.save(user);
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
    return res.status(201).json({ token, user: { id: user.id, username, email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// Login existing user
router.post('/login', validateDto(LoginDto), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginDto;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const user = await userRepo.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// Logout (client should discard token)
router.post('/logout', (_req: Request, res: Response) => {
  return res.json({ message: 'Logged out.' });
});

// Get current authenticated user
router.get('/me', authenticate, (_req: Request, res: Response) => {
  const user = (_req as AuthRequest).user!;
  return res.json({ id: user.id, username: user.username, email: user.email });
});

// Forgot password - fetch security question
router.post('/forgot', validateDto(ForgotDto), async (req: Request, res: Response) => {
  try {
    const { email } = req.body as ForgotDto;
    const user = await userRepo.findOne({ where: { email } });
    if (!user || !user.securityQuestion) {
      return res.status(400).json({ message: 'Invalid email.' });
    }
    return res.json({ question: user.securityQuestion });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// Reset password using security question
router.post('/reset', validateDto(ResetDto), async (req: Request, res: Response) => {
  try {
    const { email, securityAnswer, newPassword } = req.body as ResetDto;
    const user = await userRepo.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email.' });
    }
    const valid = await bcrypt.compare(securityAnswer, user.securityAnswer);
    if (!valid) {
      return res.status(400).json({ message: 'Invalid security answer.' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await userRepo.save(user);
    return res.json({ message: 'Password reset successful.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;
