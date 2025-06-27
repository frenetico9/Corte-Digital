// Arquivo: api/bookings.js

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Necessário para requisições POST com 'Content-Type'
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // LISTAR agendamentos de um usuário
  if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "ID do usuário é obrigatório." });
    }
    
    try {
      const bookings = await prisma.booking.findMany({
        where: { userId: String(userId) },
        include: { service: true, barbershop: true },
      });
      return res.status(200).json(bookings);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao buscar agendamentos." });
    }
  }

  // CRIAR um novo agendamento
  if (req.method === 'POST') {
    try {
      const { userId, serviceId, barbershopId, date } = req.body;

      if (!userId || !serviceId || !barbershopId || !date) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios." });
      }

      const newBooking = await prisma.booking.create({
        data: {
          userId,
          serviceId,
          barbershopId,
          date: new Date(date),
        },
      });
      return res.status(201).json(newBooking);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao criar agendamento." });
    }
  }
  
  return res.status(405).json({ message: 'Método não permitido.' });
}
