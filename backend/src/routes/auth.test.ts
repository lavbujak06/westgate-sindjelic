import request from 'supertest';
import express from 'express';

// Mock Supabase and Fetch FIRST
jest.mock('../supabase', () => ({
  supabase: {
    auth: { signInWithPassword: jest.fn() },
    from: jest.fn(),
  },
}));
jest.mock('cross-fetch');

import authRouter from '../routes/auth';
import { supabase } from '../supabase';
import fetch from 'cross-fetch';
import cookieParser from 'cookie-parser';

describe('Auth Routes - Security Attacks', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(cookieParser())
    app.use(express.json());
    app.use('/api/auth', authRouter);
    jest.clearAllMocks();
  });

  it('ATTACK: Login without CAPTCHA should be forbidden', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'admin@test.com', password: 'password123' });

        expect(res.status).toBe(400); 
        expect(res.body.error).toBe('Invalid input: expected string, received undefined'); 
    });

  it('ATTACK: Invalid CAPTCHA token should be rejected', async () => {
    // Mock Cludfare fail
    (fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({ success: false })
    });
        
    const res = await request(app)
      .post('/api/auth/login')
      .send({ 
        email: 'admin@test.com', 
        password: 'password123', 
        captchaToken: 'fake-bot-token' 
      });
        
    expect(res.status).toBe(403);
    expect(res.body.error).toBe('CAPTCHA verification failed');
  });

  it('SUCCESS: Admin login creates secure HTTP-Only cookies', async () => {
    // Mock Cloudflare Success
    (fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({ success: true })
    });

    // Mock Supabase Auth Success
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { 
        user: { id: 'admin1', email: 'admin@test.com' }, 
        session: { access_token: 'valid-jwt' } 
      },
      error: null
    });

    const mockFrom = supabase.from as jest.Mock;
    mockFrom.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: { id: 'admin1' }, error: null }),
        })),
      })),
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ 
        email: 'admin@test.com', 
        password: 'password123', 
        captchaToken: 'valid-human-token' 
      });
    
    const cookies = res.get('Set-Cookie') as string[];
    expect(cookies.some(c => c.toLowerCase().includes('httponly'))).toBe(true);
    expect(cookies.some(c => c.includes('SameSite=Strict'))).toBe(true);
    expect(res.body.is_admin).toBe(true);
  });
  
  it('SESSION: /me should return 401 if the issued_at cookie is expired', async () => {
    const twoHoursAgo = Date.now() - (120 * 60 * 1000);
    
    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', `sb-access-token=fake-token; session_issued_at=${twoHoursAgo}`);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Session expired');
  });

  it('SIGNUP: Should require CAPTCHA just like login', async () => {
    const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'newuser@test.com', password: 'password123' });

    expect(res.status).toBe(400);
    // Match the message you wrote in your Zod schema
    expect(res.body.error).toBe('Invalid input: expected string, received undefined');
  });

  it('Fail: Shoukd return 401 for wrong password', async () => {
    (fetch as jest.Mock).mockResolvedValue({ json: jest.fn().mockResolvedValue({ success: true}) });

    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' }
    });

    const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.com', password: 'wrong-password', captchaToken: 'valid'});

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });

  it('SUCCESS: Logout should clear all security cookies', async () => {
    const res = await request(app).post('/api/auth/logout');
    
    const cookies = res.get('Set-Cookie') as string[];
    expect(cookies.some(c => c.includes('sb-access-token=;'))).toBe(true);
    expect(res.status).toBe(200);
  });

  it('SUCCESS: Regular user (non-admin) login should have is_admin: false', async () => {
    (fetch as jest.Mock).mockResolvedValue({ json: jest.fn().mockResolvedValue({ success: true }) });

    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: { id: 'fan-123' }, session: { access_token: 'jwt' } },
      error: null
    });

    // Mock Admin table returning NOTHING
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null })
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'fan@test.com', password: 'password123', captchaToken: 'valid' });

    expect(res.body.is_admin).toBe(false);
  });

  it('ATTACK: Should reject extra fields (Mass Assignment Protection)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ 
        email: 'admin@test.com', 
        password: 'password123', 
        captchaToken: 'valid',
        role: 'admin' // <--- This field is NOT in our schema
      });

    // It should be 400 because .strict() rejects the extra 'role' field
    expect(res.status).toBe(400);
  });

  it('VALIDATION: Should reject malformed emails', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ 
        email: 'not-an-email', 
        password: 'password123', 
        captchaToken: 'valid' 
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid email format');
  });

  it('VALIDATION: Should reject short passwords', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ 
        email: 'test@test.com', 
        password: '123', // Too short (min 8)
        captchaToken: 'valid' 
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Password must be at least 8 characters');
  });


  // The rate limiter logic has to be last so that it doesnt interfer with the other tests  
    it('Rate Liniter block after 10 attempts', async () => {
    // We need to send a body that PASSES Zod so it hits the Limiter
    const validBody = { 
        email: 'test@test.com', 
        password: 'password123', 
        captchaToken: 'any-string' 
    };

    for(let i = 0; i < 10; i++){ // You changed max to 10 in your code
        await request(app)
            .post('/api/auth/login')
            .send(validBody);
    }

    const res = await request(app).post('/api/auth/login').send(validBody);
    expect(res.status).toBe(429);
    expect(res.body.error).toBe('Too many login attempts. Please try again in 15 minutes.');
    });
  
  
});