import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

interface User {
  sub: string;
  role: 'student' | 'manager';
  name: string;
}

export async function getAuthenticatedUserFromRequest(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    return {
      sub: decoded.sub,
      role: decoded.role,
      name: decoded.name,
    };
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}
