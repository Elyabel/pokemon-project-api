import { Router } from 'express';
import * as AttackCtrl from '../controllers/AttackController';
import * as PokemonCtrl from '../controllers/PokemonController';
import * as TrainerCtrl from '../controllers/TrainerController';

const router = Router();

router.get('/health', (_req, res) => res.json({ ok: true }));

// Attacks
router.get('/attacks', AttackCtrl.listAttacks);
router.post('/attacks', AttackCtrl.createAttack);

// Pokemons
router.get('/pokemons', PokemonCtrl.listPokemons);
router.post('/pokemons', PokemonCtrl.createPokemon);
router.get('/pokemons/:id', PokemonCtrl.getPokemon);
router.get('/pokemons/:id/attacks', PokemonCtrl.getPokemonAttacks);
router.post('/pokemons/:id/learn-attack', PokemonCtrl.learnAttack);
router.post('/pokemons/:id/heal', PokemonCtrl.healPokemon);
router.post('/pokemons/:id/attack/:targetId', PokemonCtrl.attackRandom);

// Trainers
router.get('/trainers', TrainerCtrl.listTrainers);
router.post('/trainers', TrainerCtrl.createTrainer);
router.post('/trainers/:id/add-pokemon', TrainerCtrl.addPokemonToTrainer);
router.get('/trainers/:id/pokemons', TrainerCtrl.getTrainerPokemons);

export default router;
