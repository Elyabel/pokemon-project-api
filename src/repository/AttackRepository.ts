import { pool } from '../db/database';
import { Attack } from '../entity/Attack';

export class AttackRepository {
  async findAll(): Promise<Attack[]> {
    const { rows } = await pool.query('SELECT id, name, damage, usage_limit FROM attacks ORDER BY id');
    return rows.map((r: { id: number | null; name: string; damage: number; usage_limit: number; }) => new Attack(r.id, r.name, r.damage, r.usage_limit, 0));
  }

  async create(name: string, damage: number, usageLimit: number): Promise<Attack> {
    const { rows } = await pool.query(
      'INSERT INTO attacks (name, damage, usage_limit) VALUES ($1, $2, $3) RETURNING id, name, damage, usage_limit',
      [name, damage, usageLimit]
    );
    const r = rows[0];
    return new Attack(r.id, r.name, r.damage, r.usage_limit, 0);
  }

  async findById(id: number): Promise<Attack | null> {
    const { rows } = await pool.query('SELECT id, name, damage, usage_limit FROM attacks WHERE id=$1', [id]);
    if (rows.length === 0) return null;
    const r = rows[0];
    return new Attack(r.id, r.name, r.damage, r.usage_limit, 0);
  }
}
