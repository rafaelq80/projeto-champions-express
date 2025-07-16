/**
 * Configuração de Rotas da API
 * @description Define todos os endpoints da aplicação
 * @author Champions Express
 */

import { Router } from 'express';
import { ClubsController } from './controllers/clubs-controller';
import { PlayersController } from './controllers/players-controller';

const router = Router();

// Instâncias dos controllers
const clubsController = new ClubsController();
const playersController = new PlayersController();

// Rotas de Clubes
router.get('/clubs', (req, res) => clubsController.findAll(req, res));
router.get('/clubs/:id', (req, res) => clubsController.findById(req, res));
router.post('/clubs', (req, res) => clubsController.create(req, res));
router.put('/clubs/:id', (req, res) => clubsController.update(req, res));
router.delete('/clubs/:id', (req, res) => clubsController.delete(req, res));

// Rotas de Jogadores
router.get('/players', (req, res) => playersController.findAll(req, res));
router.get('/players/:id', (req, res) => playersController.findById(req, res));
router.post('/players', (req, res) => playersController.create(req, res));
router.put('/players/:id', (req, res) => playersController.update(req, res));
router.delete('/players/:id', (req, res) => playersController.delete(req, res));

// Rota de saúde da API
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API Champions Express está funcionando!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

// Rota de informações da API
router.get('/', (req, res) => {
  res.status(200).json({
    name: 'Champions Express API',
    description: 'API RESTful para gerenciamento de clubes e jogadores de futebol',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      health: '/api/health',
      clubs: '/api/clubs',
      players: '/api/players'
    },
    author: 'Rafael Queiróz'
  });
});

export default router;