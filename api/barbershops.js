// Arquivo: api/barbershops.js (VERSÃO ATUALIZADA)

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); 

  if (req.method === 'GET') {
    try {
      const barbershops = await prisma.barbershop.findMany({
        // A MÁGICA ESTÁ AQUI:
        // Incluímos os serviços relacionados a cada barbearia na mesma consulta.
        include: {
          services: {
            where: { isActive: true }, // Opcional: traz apenas serviços ativos
            take: 3 // Opcional: limita a 3 serviços para o showcase da home
          }
        }
      });
      return res.status(200).json(barbershops);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao buscar barbearias." });
    }
  }

  return res.status(405).json({ message: 'Método não permitido.' });
}
