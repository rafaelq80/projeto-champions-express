/**
 * Controller de Clubes
 * @description Gerencia as requisições HTTP relacionadas aos clubes
 * @author Champions Express
 */

import { Request, Response } from 'express';
import { ClubsService } from '../services/clubs-service';
import * as HttpResponse from '../utils/http-helper';

/**
 * Controller de Clubes
 * @description Implementa os endpoints para operações com clubes
 */
export class ClubsController {
  private readonly service: ClubsService;

  constructor() {
    this.service = new ClubsService();
  }

  /**
   * Busca todos os clubes
   * @description Endpoint GET /clubs
   * @param req - Requisição HTTP
   * @param res - Resposta HTTP
   */
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const clubs = await this.service.getAllClubs();
      
      if (clubs.length === 0) {
        const response = await HttpResponse.noContent();
        res.status(response.statusCode).json(response.body);
        return;
      }

      const response = await HttpResponse.ok(clubs);
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      console.error('Erro no controller findAll:', error);
      const response = await HttpResponse.serverError();
      res.status(response.statusCode).json(response.body);
    }
  }

  /**
   * Busca um clube por ID
   * @description Endpoint GET /clubs/:id
   * @param req - Requisição HTTP
   * @param res - Resposta HTTP
   */
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id) || id <= 0) {
        const response = await HttpResponse.badRequest('ID do clube inválido');
        res.status(response.statusCode).json(response.body);
        return;
      }

      const club = await this.service.getClubById(id);
      
      if (!club) {
        const response = await HttpResponse.notFound('Clube não encontrado');
        res.status(response.statusCode).json(response.body);
        return;
      }

      const response = await HttpResponse.ok(club);
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      console.error('Erro no controller findById:', error);
      const response = await HttpResponse.serverError();
      res.status(response.statusCode).json(response.body);
    }
  }

  /**
   * Cria um novo clube
   * @description Endpoint POST /clubs
   * @param req - Requisição HTTP
   * @param res - Resposta HTTP
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      
      if (!name || typeof name !== 'string' || name.trim() === '') {
        const response = await HttpResponse.badRequest('Nome do clube é obrigatório');
        res.status(response.statusCode).json(response.body);
        return;
      }

      const club = await this.service.createClub({ name: name.trim() });
      const response = await HttpResponse.created(club);
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
   * Atualiza um clube existente
   * @description Endpoint PUT /clubs/:id
   * @param req - Requisição HTTP
   * @param res - Resposta HTTP
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id) || id <= 0) {
        const response = await HttpResponse.badRequest('ID do clube inválido');
        res.status(response.statusCode).json(response.body);
        return;
      }

      const { name } = req.body;
      
      if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
        const response = await HttpResponse.badRequest('Nome do clube não pode estar vazio');
        res.status(response.statusCode).json(response.body);
        return;
      }

      const club = await this.service.updateClub(id, { name: name?.trim() });
      
      if (!club) {
        const response = await HttpResponse.notFound('Clube não encontrado');
        res.status(response.statusCode).json(response.body);
        return;
      }

      const response = await HttpResponse.ok(club);
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
   * Remove um clube
   * @description Endpoint DELETE /clubs/:id
   * @param req - Requisição HTTP
   * @param res - Resposta HTTP
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id) || id <= 0) {
        const response = await HttpResponse.badRequest('ID do clube inválido');
        res.status(response.statusCode).json(response.body);
        return;
      }

      const success = await this.service.deleteClub(id);
      
      if (!success) {
        const response = await HttpResponse.notFound('Clube não encontrado');
        res.status(response.statusCode).json(response.body);
        return;
      }

      const response = await HttpResponse.ok({ message: 'Clube removido com sucesso' });
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
