import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Role } from '../entity/Role';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validateDto } from '../middleware/validate';
import { IsString, MinLength } from 'class-validator';

// DTO for role creation/updating
class RoleDto {
  @IsString()
  @MinLength(1)
  name!: string;
}

const router = Router();
const roleRepo = AppDataSource.getRepository(Role);

// protect all routes
router.use(authenticate);

// Create a new role
router.post('/', validateDto(RoleDto), async (req: Request, res: Response) => {
  const { name } = req.body as RoleDto;
  if (await roleRepo.findOne({ where: { name } })) {
    return res.status(400).json({ message: 'Role already exists.' });
  }
  const role = roleRepo.create({ name });
  await roleRepo.save(role);
  res.status(201).json(role);
});

// Get all roles
router.get('/', async (_req, res) => {
  const roles = await roleRepo.find();
  res.json(roles);
});

// Get role by id
router.get('/:id', async (req, res) => {
  const role = await roleRepo.findOne({ where: { id: req.params.id } });
  if (!role) return res.status(404).json({ message: 'Not found.' });
  res.json(role);
});

// Update a role
router.put('/:id', validateDto(RoleDto), async (req, res) => {
  const role = await roleRepo.findOne({ where: { id: req.params.id } });
  if (!role) return res.status(404).json({ message: 'Not found.' });
  role.name = (req.body as RoleDto).name;
  await roleRepo.save(role);
  res.json(role);
});

// Delete a role
router.delete('/:id', async (req, res) => {
  const result = await roleRepo.delete(req.params.id);
  if (result.affected === 0) return res.status(404).json({ message: 'Not found.' });
  res.json({ deleted: true });
});

export default router;
