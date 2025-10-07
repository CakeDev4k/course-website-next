import type { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'

export async function checkRequestJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization

    if (!authHeader) {
      return reply.status(401).send({ error: 'Token não fornecido' })
    }

    const [, token] = authHeader.split(' ')

    if (!token) {
      return reply.status(401).send({ error: 'Token não fornecido' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? 'secret')
    
    request.user = {
      sub: (decoded as any).sub,
      role: (decoded as any).role as "student" | "manager"
    }

  } catch (error) {
    console.error('JWT verification error:', error)
    return reply.status(401).send({ error: 'Token inválido' })
  }
}