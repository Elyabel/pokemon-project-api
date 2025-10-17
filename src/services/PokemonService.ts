import { PokemonRepository } from '../repositories/PokemonRepository';
import { AttackRepository } from '../repositories/AttackRepository';
import { Pokemon } from '../entities/Pokemon.js';
import { Attack } from '../entities/Attack.js';

export class PokemonService {
  constructor(
    private pokemonRepo = new PokemonRepository(),
    private attackRepo = new AttackRepository()
  ) {}

  async list(): Promise<Pokemon[]> {
    return this.pokemonRepo.findAll();
  }

  async create(name: string, lifePoint: number): Promise<Pokemon> {
    return this.pokemonRepo.create(name, lifePoint);
  }

  async get(id: number): Promise<Pokemon> {
    const p = await this.pokemonRepo.findById(id);
    if (!p) throw new Error('Pokemon not found');
    return p;
  }

  async learnAttack(pokemonId: number, attackId: number): Promise<void> {
    const pokemon = await this.get(pokemonId);
    const attack = await this.attackRepo.findById(attackId);
    if (!attack) throw new Error('Attack not found');

    const count = await this.pokemonRepo.countAttacks(pokemonId);
    if (count >= 4) throw new Error('Ce Pokémon connaît déjà 4 attaques');

    const has = await this.pokemonRepo.hasAttack(pokemonId, attackId);
    if (has) throw new Error('Attaque déjà apprise');

    await this.pokemonRepo.learnAttack(pokemonId, attackId);
  }

  async heal(pokemonId: number): Promise<Pokemon> {
    const pokemon = await this.get(pokemonId);
    pokemon.heal();
    await this.pokemonRepo.updateLifePoint(pokemonId, pokemon.lifePoint);
    await this.pokemonRepo.resetAttacksUsage(pokemonId);
    return pokemon;
  }

  async getAttacks(pokemonId: number): Promise<Attack[]> {
    const p = await this.get(pokemonId);
    return p.attacks;
  }
}
