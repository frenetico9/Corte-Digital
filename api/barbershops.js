// Arquivo: api/barbershops.js (CORRIGIDO)

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); 

  if (req.method === 'GET') {
    try {
      const barbershops = await prisma.barbershop.findMany({
        include: {
          services: {
            // A linha 'where' foi removida.
            take: 3 // Vamos manter a limitação de 3 serviços para a home page.
          }
        }
      });
      return res.status(200).json(barbershops);
    } catch (error) {
      console.error("ERRO NA API BARBERSHOPS:", error); // Adicionei um log para depuração futura
      return res.status(500).json({ message: "Erro ao buscar barbearias.", details: error.message });
    }
  }

  return res.status(405).json({ message: 'Método não permitido.' });
}
