import { Request, Response } from 'express';
import { AttackRepository } from '../repositories/AttackRepository';

const repo = new AttackRepository();

export const listAttacks = async (_req: Request, res: Response) => {
  const attacks = await repo.findAll();
  res.json(attacks);
};

export const createAttack = async (req: Request, res: Response) => {
  const { name, damage, usageLimit } = req.body;
  if (!name || damage == null || usageLimit == null) {
    return res.status(400).json({ error: 'name, damage, usageLimit requis' });
  }
  try {
    const attack = await repo.create(name, Number(damage), Number(usageLimit));
    res.status(201).json(attack);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};
