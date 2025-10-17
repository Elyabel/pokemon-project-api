import { Request, Response } from 'express';
import { PokemonService } from '../services/PokemonService';
import { BattleService } from '../services/BattleService';

const service = new PokemonService();
const battle = new BattleService();

export const listPokemons = async (_req: Request, res: Response) => {
  const pokemons = await service.list();
  res.json(pokemons);
};

export const createPokemon = async (req: Request, res: Response) => {
  const { name, lifePoint } = req.body;
  if (!name || lifePoint == null) return res.status(400).json({ error: 'name, lifePoint requis' });
  try {
    const p = await service.create(name, Number(lifePoint));
    res.status(201).json(p);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

export const getPokemon = async (req: Request, res: Response) => {
  try {
    const p = await service.get(Number(req.params.id));
    res.json(p);
  } catch (e: any) {
    res.status(404).json({ error: e.message });
  }
};

export const learnAttack = async (req: Request, res: Response) => {
  const { attackId } = req.body;
  try {
    await service.learnAttack(Number(req.params.id), Number(attackId));
    res.status(204).send();
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

export const healPokemon = async (req: Request, res: Response) => {
  try {
    const p = await service.heal(Number(req.params.id));
    res.json(p);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

export const attackRandom = async (req: Request, res: Response) => {
  const attackerId = Number(req.params.id);
  const targetId = Number(req.params.targetId);
  try {
    const result = await battle.attackRandom(attackerId, targetId);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

export const getPokemonAttacks = async (req: Request, res: Response) => {
  try {
    const attacks = await service.getAttacks(Number(req.params.id));
    res.json(attacks);
  } catch (e: any) {
    res.status(404).json({ error: e.message });
  }
};
