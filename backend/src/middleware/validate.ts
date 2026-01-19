import { z, ZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: any) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // We parse req.body because multer has already populated it by the time this runs
      await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues[0].message });
      }
      return res.status(400).json({ error: error.issues[0].message });
    }
  };