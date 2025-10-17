import { pool } from '../db/database';
import { Trainer } from '../entity/Trainer';
import { Pokemon } from '../entity/Pokemon';

export class TrainerRepository {
  async findAll(): Promise<Trainer[]> {
    const { rows } = await pool.query('SELECT id, name, level, experience FROM trainers ORDER BY id');
    return rows.map((r: { id: number | null; name: string; level: number | undefined; experience: number | undefined; }) => new Trainer(r.id, r.name, r.level, r.experience, []));
  }

  async create(name: string): Promise<Trainer> {
    const { rows } = await pool.query(
      'INSERT INTO trainers (name, level, experience) VALUES ($1, 1, 0) RETURNING id, name, level, experience',
      [name]
    );
    const r = rows[0];
    return new Trainer(r.id, r.name, r.level, r.experience, []);
  }

  async addPokemon(trainerId: number, pokemonId: number): Promise<void> {
    await pool.query('INSERT INTO trainer_pokemons (trainer_id, pokemon_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [trainerId, pokemonId]);
  }

  async getPokemons(trainerId: number): Promise<Pokemon[]> {
    const { rows } = await pool.query(
      `SELECT p.id, p.name, p.life_point, p.max_life_point
       FROM trainer_pokemons tp
       JOIN pokemons p ON p.id = tp.pokemon_id
       WHERE tp.trainer_id = $1`,
      [trainerId]
    );
    return rows.map((r: { id: number | null; name: string; life_point: number; max_life_point: number; }) => new Pokemon(r.id, r.name, r.life_point, r.max_life_point, []));
  }
}
