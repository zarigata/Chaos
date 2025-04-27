import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Guild } from '../entity/Guild';
import { Message } from '../entity/Message';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validateDto } from '../middleware/validate';
import { IsString, MinLength } from 'class-validator';

// DTO for guild operations
class GuildDto {
  @IsString()
  @MinLength(1)
  name!: string;
}

const router = Router();
const guildRepo = AppDataSource.getRepository(Guild);

// Protect routes
router.use(authenticate);

// Create a new guild (owner + initial member)
router.post('/', validateDto(GuildDto), async (req: Request, res: Response) => {
  const { name } = req.body as GuildDto;
  const user = (req as AuthRequest).user!;
  const guild = guildRepo.create({ name, owner: user, users: [user] });
  await guildRepo.save(guild);
  res.status(201).json(guild);
});

// Get all guilds
router.get('/', async (_req: Request, res: Response) => {
  const guilds = await guildRepo.find({ relations: ['owner', 'users'] });
  res.json(guilds);
});

// Get a guild by ID
router.get('/:id', async (req: Request, res: Response) => {
  const guild = await guildRepo.findOne({ where: { id: req.params.id }, relations: ['owner', 'users'] });
  if (!guild) return res.status(404).json({ message: 'Not found.' });
  res.json(guild);
});

// Get message history for a guild
router.get('/:id/messages', async (req: Request, res: Response) => {
  try {
    const messageRepo = AppDataSource.getRepository(Message);
    const msgs = await messageRepo.find({
      where: { guild: { id: req.params.id } },
      order: { createdAt: 'ASC' },
    });
    return res.json(msgs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// Update a guild (only owner)
router.put('/:id', validateDto(GuildDto), async (req: Request, res: Response) => {
  const guild = await guildRepo.findOne({ where: { id: req.params.id }, relations: ['owner'] });
  if (!guild) return res.status(404).json({ message: 'Not found.' });
  const user = (req as AuthRequest).user!;
  if (guild.owner.id !== user.id) return res.status(403).json({ message: 'Forbidden.' });
  guild.name = (req.body as GuildDto).name;
  await guildRepo.save(guild);
  res.json(guild);
});

// Delete a guild (only owner)
router.delete('/:id', async (req: Request, res: Response) => {
  const guild = await guildRepo.findOne({ where: { id: req.params.id }, relations: ['owner'] });
  if (!guild) return res.status(404).json({ message: 'Not found.' });
  const user = (req as AuthRequest).user!;
  if (guild.owner.id !== user.id) return res.status(403).json({ message: 'Forbidden.' });
  await guildRepo.delete(req.params.id);
  res.json({ deleted: true });
});

export default router;
