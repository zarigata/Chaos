import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export function validateDto(type: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      const messages = errors.flatMap((err: ValidationError) => Object.values(err.constraints || {}));
      return res.status(400).json({ message: 'Validation failed', errors: messages });
    }
    req.body = dto;
    next();
  };
}
