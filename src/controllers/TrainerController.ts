import { Request, Response } from 'express';
import { TrainerService } from '../services/TrainerService';

const service = new TrainerService();

export const listTrainers = async (_req: Request, res: Response) => {
  const trainers = await service.list();
  res.json(trainers);
};

export const createTrainer = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name requis' });
  try {
    const t = await service.create(name);
    res.status(201).json(t);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

export const addPokemonToTrainer = async (req: Request, res: Response) => {
  const trainerId = Number(req.params.id);
  const { pokemonId } = req.body;
  if (!pokemonId) return res.status(400).json({ error: 'pokemonId requis' });
  try {
    await service.addPokemon(trainerId, Number(pokemonId));
    res.status(204).send();
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

export const getTrainerPokemons = async (req: Request, res: Response) => {
  const trainerId = Number(req.params.id);
  try {
    const pokemons = await service.getPokemons(trainerId);
    res.json(pokemons);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};
