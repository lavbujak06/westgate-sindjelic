import * as express from 'express';
import { UserProfile } from './User';

declare global {
  namespace Express {
    interface Request {
      // We use 'any' because another library already told TS it's 'any'
      // This stops the "Subsequent property" conflict.
      user?: UserProfile;
    }
  }
}