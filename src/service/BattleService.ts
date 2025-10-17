import { PokemonRepository } from '../repository/PokemonRepository';

export class BattleService {
  constructor(private pokemonRepo = new PokemonRepository()) {}

  async attackRandom(attackerId: number, targetId: number) {
    const attacker = await this.pokemonRepo.findById(attackerId);
    const target = await this.pokemonRepo.findById(targetId);
    if (!attacker || !target) throw new Error('Pokémon manquant');

    if (attacker.isKO()) throw new Error(`${attacker.name} est K.O.`);
    if (target.isKO()) throw new Error(`${target.name} est déjà K.O.`);

    const beforeHP = target.lifePoint;
    const chosen = attacker.attackRandom(target);

    // Persist: increment usage & target life
    await this.pokemonRepo.incrementAttackUsage(attacker.id!, chosen.id!);
    await this.pokemonRepo.updateLifePoint(target.id!, target.lifePoint);

    return {
      attacker: { id: attacker.id, name: attacker.name },
      target: { id: target.id, name: target.name },
      attack: { id: chosen.id, name: chosen.name, damage: chosen.damage },
      targetLife: { before: beforeHP, after: target.lifePoint },
      isTargetKO: target.isKO()
    };
  }
}
