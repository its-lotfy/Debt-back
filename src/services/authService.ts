import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { LoginRequest, RegisterRequest } from '../types';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

export const register = async (userData: RegisterRequest) => {
  const { name, email, password } = userData;
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    return {
      token: generateToken(user.id),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    };
  }

  throw new Error('Invalid user data');
};

export const login = async (loginData: LoginRequest) => {
  const { email, password } = loginData;
  const user = await User.findOne({ email });

  if (user && (await user.comparePassword(password))) {
    return {
      token: generateToken(user.id),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    };
  }

  throw new Error('Invalid email or password');
};

export const getAllUsers = async (currentUserId: string) => {
  const users = await User.find({ _id: { $ne: currentUserId } }).select('-password');
  return users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  }));
};

export class AuthService {
  /**
   * Hash a password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }
  
  /**
   * Compare a password with its hash
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
  
  /**
   * Generate JWT token for a user
   */
  static generateToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin
    };
    
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '24h' });
  }
  
  /**
   * Verify JWT token and return user data
   */
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
  
  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    return authHeader.substring(7);
  }
} 