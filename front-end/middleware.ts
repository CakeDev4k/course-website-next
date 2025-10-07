// middleware.ts (na raiz do projeto)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET!; // Defina no .env

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  // Caso: usuário acessa a raiz '/'
  if (pathname === '/') {
    // Se existir token, tenta validar e redirecionar para /courses
    if (token) {
      try {
        await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        // token válido -> redireciona para courses
        return NextResponse.redirect(new URL('/courses', request.url));
      } catch (err) {
        // Token inválido: remove cookie e deixa passar para a página de login
        const response = NextResponse.next();
        response.cookies.delete('token');
        return response;
      }
    }

    // Sem token: permite carregar a página '/' (login)
    return NextResponse.next();
  }

  // Para rotas protegidas, exige token válido
  // Se não houver token, redireciona para '/'
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));

    // Checagem de role (mantida conforme implementação original)
    if (payload.role !== 'student' && payload.role !== 'manager') {
      // Caso role inválida, redireciona para '/' por segurança
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete('token');
      return response;
    }

    // Verifica expiração (jwtVerify já faz isso, mas mantemos segurança extra)
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete('token');
      return response;
    }

    const response = NextResponse.next();
    response.headers.set('x-user-id', payload.sub as string);
    response.headers.set('x-user-role', (payload.role as string) || 'user');
    response.headers.set('x-user-name', (payload.name as string) || 'Guest');

    return response;
  } catch (error) {
    // Token inválido: limpa cookie e redireciona para login
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: [
    '/',
    '/courses/:path*',
    '/course/:path*',
    '/course/[id]/:path*',
    '/course/[id]/lessons/:path*',
    '/manager-course/:path*',
    '/manager-course/[id]/:path*',
    '/manager-course/[id]/lessons/:path*',
    '/users/:path*',
  ],
};