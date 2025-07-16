/**
 * Controller de Jogadores
 * @description Gerencia as requisições HTTP relacionadas aos jogadores
 * @author Champions Express
 */

import { Request, Response } from 'express';
import { PlayersService } from '../services/players-service';
import * as HttpResponse from '../utils/http-helper';

/**
 * Controller de Jogadores
 * @description Implementa os endpoints para operações com jogadores
 */
export class PlayersController {
  private readonly service: PlayersService;

  constructor() {
    this.service = new PlayersService();
  }

  /**
   * Busca todos os jogadores
   * @description Endpoint GET /players
   * @param req - Requisição HTTP
   * @param res - Resposta HTTP
   */
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const players = await this.service.getAllPlayers();
      
      if (players.length === 0) {
        const response = await HttpResponse.noContent();
        res.status(response.statusCode).json(response.body);
        return;
      }

      const response = await HttpResponse.ok(players);
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      console.error('Erro no controller findAll:', error);
      const response = await HttpResponse.serverError();
      res.status(response.statusCode).json(response.body);
    }
  }

  /**
   * Busca um jogador por ID
   * @description Endpoint GET /players/:id
   * @param req - Requisição HTTP
   * @param res - Resposta HTTP
   */
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id) || id <= 0) {
        const response = await HttpResponse.badRequest('ID do jogador inválido');
        res.status(response.statusCode).json(response.body);
        return;
      }

      const player = await this.service.getPlayerById(id);
      
      if (!player) {
        const response = await HttpResponse.notFound('Jogador não encontrado');
        res.status(response.statusCode).json(response.body);
        return;
      }

      const response = await HttpResponse.ok(player);
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      console.error('Erro no controller findById:', error);
      const response = await HttpResponse.serverError();
      res.status(response.statusCode).json(response.body);
    }
  }

  /**
   * Cria um novo jogador
   * @description Endpoint POST /players
   * @param req - Requisição HTTP
   * @param res - Resposta HTTP
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, nationality, position, clubId, statistics } = req.body;
      
      // Validações básicas
      if (!name || typeof name !== 'string' || name.trim() === '') {
        const response = await HttpResponse.badRequest('Nome do jogador é obrigatório');
        res.status(response.statusCode).json(response.body);
        return;
      }

      if (!nationality || typeof nationality !== 'string' || nationality.trim() === '') {
        const response = await HttpResponse.badRequest('Nacionalidade do jogador é obrigatória');
        res.status(response.statusCode).json(response.body);
        return;
      }

      if (!position || typeof position !== 'string' || position.trim() === '') {
        const response = await HttpResponse.badRequest('Posição do jogador é obrigatória');
        res.status(response.statusCode).json(response.body);
        return;
      }

      if (!clubId || typeof clubId !== 'number' || clubId <= 0) {
        const response = await HttpResponse.badRequest('ID do clube é obrigatório e deve ser um número válido');
        res.status(response.statusCode).json(response.body);
        return;
      }

      const player = await this.service.createPlayer({
        name: name.trim(),
        nationality: nationality.trim(),
        position: position.trim(),
        clubId,
        statistics
      });

      const response = await HttpResponse.created(player);
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      console.error('Erro no controller create:', error);
      
      if (error instanceof Error) {
        const response = await HttpResponse.badRequest(error.message);
        res.status(response.statusCode).json(response.body);
        return;
      }
      
      const response = await HttpResponse.serverError();
      res.status(response.statusCode).json(response.body);
    }
  }

  /**
   * Atualiza um jogador existente
   * @description Endpoint PUT /players/:id
   * @param req - Requisição HTTP
   * @param res - Resposta HTTP
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id) || id <= 0) {
        const response = await HttpResponse.badRequest('ID do jogador inválido');
        res.status(response.statusCode).json(response.body);
        return;
      }

      const { name, nationality, position, clubId } = req.body;
      
      // Validações dos campos
      if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
        const response = await HttpResponse.badRequest('Nome do jogador não pode estar vazio');
        res.status(response.statusCode).json(response.body);
        return;
      }

      if (nationality !== undefined && (typeof nationality !== 'string' || nationality.trim() === '')) {
        const response = await HttpResponse.badRequest('Nacionalidade do jogador não pode estar vazia');
        res.status(response.statusCode).json(response.body);
        return;
      }

      if (position !== undefined && (typeof position !== 'string' || position.trim() === '')) {
        const response = await HttpResponse.badRequest('Posição do jogador não pode estar vazia');
        res.status(response.statusCode).json(response.body);
        return;
      }

      if (clubId !== undefined && (typeof clubId !== 'number' || clubId <= 0)) {
        const response = await HttpResponse.badRequest('ID do clube deve ser um número válido');
        res.status(response.statusCode).json(response.body);
        return;
      }

      const player = await this.service.updatePlayer(id, {
        name: name?.trim(),
        nationality: nationality?.trim(),
        position: position?.trim(),
        clubId
      });
      
      if (!player) {
        const response = await HttpResponse.notFound('Jogador não encontrado');
        res.status(response.statusCode).json(response.body);
        return;
      }

      const response = await HttpResponse.ok(player);
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      console.error('Erro no controller update:', error);
      
      if (error instanceof Error) {
        const response = await HttpResponse.badRequest(error.message);
        res.status(response.statusCode).json(response.body);
        return;
      }
      
      const response = await HttpResponse.serverError();
      res.status(response.statusCode).json(response.body);
    }
  }

  /**
   * Remove um jogador
   * @description Endpoint DELETE /players/:id
   * @param req - Requisição HTTP
   * @param res - Resposta HTTP
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id) || id <= 0) {
        const response = await HttpResponse.badRequest('ID do jogador inválido');
        res.status(response.statusCode).json(response.body);
        return;
      }

      const success = await this.service.deletePlayer(id);
      
      if (!success) {
        const response = await HttpResponse.notFound('Jogador não encontrado');
        res.status(response.statusCode).json(response.body);
        return;
      }

      const response = await HttpResponse.ok({ message: 'Jogador removido com sucesso' });
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      console.error('Erro no controller delete:', error);
      
      if (error instanceof Error) {
        const response = await HttpResponse.badRequest(error.message);
        res.status(response.statusCode).json(response.body);
        return;
      }
      
      const response = await HttpResponse.serverError();
      res.status(response.statusCode).json(response.body);
    }
  }
}
