import { TrainerRepository } from '../repository/TrainerRepository';
import { Trainer } from '../entity/Trainer';

export class TrainerService {
  constructor(private trainerRepo = new TrainerRepository()) {}

  async list(): Promise<Trainer[]> {
    return this.trainerRepo.findAll();
  }

  async create(name: string): Promise<Trainer> {
    return this.trainerRepo.create(name);
  }

  async addPokemon(trainerId: number, pokemonId: number): Promise<void> {
    return this.trainerRepo.addPokemon(trainerId, pokemonId);
  }

  async getPokemons(trainerId: number) {
    return this.trainerRepo.getPokemons(trainerId);
  }
}
