import { requireAdmin } from './requireAdmin';
import { supabase } from '../supabase';

// Mock the database so that i can actually test the logc of the require admin file
jest.mock('../supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  },
}));

describe('requireAdmin Middleware', () => {
  // 2. Setup "Fake" Express objects (req, res, next)
  let mockRequest: any;
  let mockResponse: any;
  let nextFunction: jest.Mock = jest.fn();

  beforeEach(() => {
    // Reset our "Stunt Doubles" before every single test
    mockRequest = { cookies: {} };
    mockResponse = {
      status: jest.fn().mockReturnThis(), // .status() returns 'res' so we can chain .json()
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('should return 401 if no token is provided', async () => {
    // We don't put a token in the cookies
    await requireAdmin(mockRequest, mockResponse, nextFunction);

    // We expect res.status(401) to have been called
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Session missing' });
  });

  it('should return 403 if user is not in the admins table', async () => {
    // A. Mock the token in cookies
    mockRequest.cookies['sb-access-token'] = 'fake-token';

    // B. Tell the Supabase mock to return a valid user...
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    });

    // C. ...BUT tell the admins table mock to return NULL (not an admin)
    const mockFrom = supabase.from as jest.Mock;
    mockFrom.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
        })),
      })),
    });

    await requireAdmin(mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Admins only' });
  });

  it('should call next() if user is a valid admin', async () => {
    mockRequest.cookies['sb-access-token'] = 'valid-token';

    // A. Mock valid user from Auth
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'admin-123', email: 'admin@test.com' } },
      error: null,
    });

    // B. Mock found record in Admin table
    const mockFrom = supabase.from as jest.Mock;
    mockFrom.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: { id: 'admin-123' }, error: null }),
        })),
      })),
    });

    await requireAdmin(mockRequest, mockResponse, nextFunction);

    // If it's an admin, we expect next() to be called and NO error status
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.user.id).toBe('admin-123');
  });


  it('should return 401 if Supabase returns an error (Expired/Malformed Token)', async () => {
    mockRequest.cookies['sb-access-token'] = 'expired-token';

    // We simulate Supabase finding an error with the token
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: null },
      error: { message: 'Token expired', status: 401 },
    });

    await requireAdmin(mockRequest, mockResponse, nextFunction);

    // Proof: The code should catch the error and block the user
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid session' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 500 if the database query fails (Server Error)', async () => {
    mockRequest.cookies['sb-access-token'] = 'valid-token';

    // Auth works...
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'admin-123' } },
      error: null,
    });

    // ...BUT the database query throws a physical error (e.g. timeout)
    const mockFrom = supabase.from as jest.Mock;
    mockFrom.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockRejectedValue(new Error('Database connection failed')),
        })),
      })),
    });

    await requireAdmin(mockRequest, mockResponse, nextFunction);

    // Proof: The catch(err) block should trigger
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Server error' });
  });

  it('should return 401 if the token in the cookie is malformed or not a string', async () => {
    // Simulate a weird non-string cookie value
    mockRequest.cookies['sb-access-token'] = { unexpected: 'object' };

    await requireAdmin(mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Session missing' });
  });

  it('should return 401 if Supabase returns success but no user object exists', async () => {
    mockRequest.cookies['sb-access-token'] = 'valid-looking-token';

    // Mock a response where data exists but user is null
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: null },
      error: null,
    });

    await requireAdmin(mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid session' });
  });


    it('should return 403 when Supabase .single() returns an error because no admin was found', async () => {
    mockRequest.cookies['sb-access-token'] = 'valid-token';

    // Auth is successful
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: 'regular-user-id' } },
        error: null,
    });

    // 2. Simulate Supabase error when .single() finds 0 rows
    const mockFrom = supabase.from as jest.Mock;
    mockFrom.mockReturnValue({
        select: jest.fn(() => ({
        eq: jest.fn(() => ({
            // Supabase returns an error object when .single() fails to find a match
            single: jest.fn().mockResolvedValue({ 
            data: null, 
            error: { message: 'JSON object requested, multiple (or no) rows returned', code: 'PGRST116' } 
            }),
        })),
        })),
    });

    await requireAdmin(mockRequest, mockResponse, nextFunction);

    // Even if the DB "errored", it should be treated as "Not an admin"
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Admins only' });
    });

    it('should return 401 if multiple session cookies are present (Cookie Confusion)', async () => {
    // Express often represents multiple cookies as an array if not handled
    mockRequest.cookies['sb-access-token'] = ['token-1', 'token-2'];

    await requireAdmin(mockRequest, mockResponse, nextFunction);

    // Because of your 'typeof token !== string' fix, this will now pass securely!
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Session missing' });
    });

});