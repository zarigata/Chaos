import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import dotenv from 'dotenv';

dotenv.config();
const router = Router();
const userRepo = AppDataSource.getRepository(User);

// Register a new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required.' });
    }
    const exists = await userRepo.findOne({ where: [{ username }, { email }] });
    if (exists) {
      return res.status(400).json({ message: 'Username or email already in use.' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = userRepo.create({ username, email, password: hash });
    await userRepo.save(user);
    const token = jwt.sign({ id: user.id }, process.env.jwt_secret as string, { expiresIn: '1d' });
    return res.status(201).json({ token, user: { id: user.id, username, email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// Login existing user
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
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
    const token = jwt.sign({ id: user.id }, process.env.jwt_secret as string, { expiresIn: '1d' });
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

export default router;
