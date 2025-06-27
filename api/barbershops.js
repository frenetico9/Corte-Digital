// Arquivo: api/barbershops.js

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Permite que seu app React (rodando no navegador) acesse esta API
  res.setHeader('Access-Control-Allow-Origin', '*'); 

  if (req.method === 'GET') {
    try {
      const barbershops = await prisma.barbershop.findMany({});
      return res.status(200).json(barbershops);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao buscar barbearias." });
    }
  }

  return res.status(405).json({ message: 'Método não permitido.' });
}
