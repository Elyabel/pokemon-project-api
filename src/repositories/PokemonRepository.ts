import { pool } from '../db/database';
import { Pokemon } from '../entities/Pokemon';
import { Attack } from '../entities/Attack';

export class PokemonRepository {
  async findAll(): Promise<Pokemon[]> {
    const { rows } = await pool.query('SELECT id, name, life_point, max_life_point FROM pokemons ORDER BY id');
    return rows.map((r: { id: number | null; name: string; life_point: number; max_life_point: number; }) => new Pokemon(r.id, r.name, r.life_point, r.max_life_point));
  }

  async findById(id: number): Promise<Pokemon | null> {
    const { rows } = await pool.query('SELECT id, name, life_point, max_life_point FROM pokemons WHERE id=$1', [id]);
    if (rows.length === 0) return null;
    const p = rows[0];
    const pokemon = new Pokemon(p.id, p.name, p.life_point, p.max_life_point, []);
    // Load attacks
    const { rows: atkRows } = await pool.query(
      `SELECT a.id, a.name, a.damage, a.usage_limit, pa.usage_count
       FROM pokemon_attacks pa
       JOIN attacks a ON a.id = pa.attack_id
       WHERE pa.pokemon_id = $1`,
      [id]
    );
    pokemon.attacks = atkRows.map((r: { id: number | null; name: string; damage: number; usage_limit: number; usage_count: number | undefined; }) => new Attack(r.id, r.name, r.damage, r.usage_limit, r.usage_count));
    return pokemon;
  }

  async create(name: string, lifePoint: number): Promise<Pokemon> {
    const { rows } = await pool.query(
      'INSERT INTO pokemons (name, life_point, max_life_point) VALUES ($1, $2, $2) RETURNING id, name, life_point, max_life_point',
      [name, lifePoint]
    );
    const r = rows[0];
    return new Pokemon(r.id, r.name, r.life_point, r.max_life_point, []);
  }

  async updateLifePoint(id: number, lifePoint: number): Promise<void> {
    await pool.query('UPDATE pokemons SET life_point=$1 WHERE id=$2', [lifePoint, id]);
  }

  async resetAttacksUsage(pokemonId: number): Promise<void> {
    await pool.query('UPDATE pokemon_attacks SET usage_count=0 WHERE pokemon_id=$1', [pokemonId]);
  }

  async learnAttack(pokemonId: number, attackId: number): Promise<void> {
    await pool.query(
      'INSERT INTO pokemon_attacks (pokemon_id, attack_id, usage_count) VALUES ($1, $2, 0)',
      [pokemonId, attackId]
    );
  }

  async countAttacks(pokemonId: number): Promise<number> {
    const { rows } = await pool.query('SELECT COUNT(*)::int AS c FROM pokemon_attacks WHERE pokemon_id=$1', [pokemonId]);
    return rows[0]?.c ?? 0;
  }

  async hasAttack(pokemonId: number, attackId: number): Promise<boolean> {
    const { rows } = await pool.query('SELECT 1 FROM pokemon_attacks WHERE pokemon_id=$1 AND attack_id=$2', [pokemonId, attackId]);
    return rows.length > 0;
  }

  async incrementAttackUsage(pokemonId: number, attackId: number): Promise<void> {
    await pool.query(
      'UPDATE pokemon_attacks SET usage_count = usage_count + 1 WHERE pokemon_id=$1 AND attack_id=$2',
      [pokemonId, attackId]
    );
  }
}
