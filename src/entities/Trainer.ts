import { Pokemon } from './Pokemon';

export class Trainer {
  constructor(
    public id: number | null,
    public name: string,
    public level: number = 1,
    public experience: number = 0,
    public pokemons: Pokemon[] = []
  ) {}

  addPokemon(pokemon: Pokemon): void {
    if (this.pokemons.find(p => p.id === pokemon.id)) return;
    this.pokemons.push(pokemon);
  }
}
