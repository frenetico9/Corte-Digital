// Arquivo: api/barbershop-details.js

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'GET') {
    // Vamos pegar o ID da barbearia da URL, ex: /api/barbershop-details?id=abcde
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "ID da barbearia é obrigatório." });
    }

    try {
      const barbershop = await prisma.barbershop.findUnique({
        where: { id: String(id) },
        include: {
          services: true, // Isso é crucial! Traz todos os serviços junto com a barbearia.
        },
      });

      if (!barbershop) {
        return res.status(404).json({ message: "Barbearia não encontrada." });
      }

      return res.status(200).json(barbershop);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao buscar detalhes da barbearia." });
    }
  }

  return res.status(405).json({ message: 'Método não permitido.' });
}
