import { Attack } from './Attack';

export class Pokemon {
  constructor(
    public id: number | null,
    public name: string,
    public lifePoint: number,
    public maxLifePoint: number,
    public attacks: Attack[] = []
  ) {}

  learnAttack(attack: Attack): void {
    if (this.attacks.find(a => a.name === attack.name)) {
      throw new Error(`${this.name} connaît déjà l'attaque ${attack.name}`);
    }
    if (this.attacks.length >= 4) {
      throw new Error(`${this.name} ne peut pas apprendre plus de 4 attaques`);
    }
    this.attacks.push(attack);
  }

  heal(): void {
    this.lifePoint = this.maxLifePoint;
    this.attacks.forEach(a => (a.usageCount = 0));
  }

  getUsableAttacks(): Attack[] {
    return this.attacks.filter(a => a.canUse());
  }

  isKO(): boolean {
    return this.lifePoint <= 0;
  }

  receiveDamage(dmg: number): void {
    this.lifePoint = Math.max(0, this.lifePoint - dmg);
  }

  attackRandom(target: Pokemon): Attack {
    const usable = this.getUsableAttacks();
    if (usable.length === 0) {
      throw new Error(`${this.name} n'a plus d'attaques disponibles !`);
    }
    const idx = Math.floor(Math.random() * usable.length);
    const chosen = usable[idx];
    chosen.use();
    target.receiveDamage(chosen.damage);
    return chosen;
  }
}
