export class Attack {
  constructor(
    public id: number | null,
    public name: string,
    public damage: number,
    public usageLimit: number,
    public usageCount: number = 0
  ) {}

  canUse(): boolean {
    return this.usageCount < this.usageLimit;
  }

  use(): void {
    if (!this.canUse()) {
      throw new Error(`L'attaque ${this.name} n'a plus d'usages disponibles.`);
    }
    this.usageCount += 1;
  }

  displayInfo(): string {
    return `${this.name} — dégâts: ${this.damage}, usages: ${this.usageCount}/${this.usageLimit}`;
  }
}
