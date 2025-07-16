/**
 * Serviço de Clubes
 * @description Gerencia a lógica de negócio para operações com clubes
 * @author Champions Express
 */

import { ClubsRepository, CreateClubData, UpdateClubData } from '../repositories/clubs-repository';
import { Club, Player } from '../generated/prisma';

// Tipo estendido para incluir relacionamentos
type ClubWithRelations = Club & {
  players: Player[];
};

/**
 * Serviço de Clubes
 * @description Implementa a lógica de negócio para clubes
 */
export class ClubsService {
  private readonly repository: ClubsRepository;

  constructor() {
    this.repository = new ClubsRepository();
  }

  /**
   * Busca todos os clubes
   * @description Retorna todos os clubes cadastrados
   * @returns Promise<Club[]> - Lista de clubes
   */
  async getAllClubs(): Promise<Club[]> {
    try {
      return await this.repository.findAll();
    } catch (error) {
      console.error('Erro ao buscar clubes:', error);
      throw new Error('Falha ao buscar clubes');
    }
  }

  /**
   * Busca um clube por ID
   * @description Retorna um clube específico pelo seu ID
   * @param id - ID do clube
   * @returns Promise<Club | null> - Clube encontrado ou null
   */
  async getClubById(id: number): Promise<Club | null> {
    try {
      if (!id || id <= 0) {
        throw new Error('ID do clube inválido');
      }
      
      return await this.repository.findById(id);
    } catch (error) {
      console.error('Erro ao buscar clube por ID:', error);
      throw new Error('Falha ao buscar clube');
    }
  }

  /**
   * Busca um clube por nome
   * @description Retorna um clube específico pelo seu nome
   * @param name - Nome do clube
   * @returns Promise<Club | null> - Clube encontrado ou null
   */
  async getClubByName(name: string): Promise<Club | null> {
    try {
      if (!name || name.trim() === '') {
        throw new Error('Nome do clube inválido');
      }
      
      return await this.repository.findByName(name.trim());
    } catch (error) {
      console.error('Erro ao buscar clube por nome:', error);
      throw new Error('Falha ao buscar clube');
    }
  }

  /**
   * Cria um novo clube
   * @description Valida e cria um novo clube no sistema
   * @param data - Dados do clube a ser criado
   * @returns Promise<Club> - Clube criado
   */
  async createClub(data: CreateClubData): Promise<Club> {
    try {
      // Validações
      if (!data.name || data.name.trim() === '') {
        throw new Error('Nome do clube é obrigatório');
      }

      // Verifica se já existe um clube com o mesmo nome
      const existingClub = await this.repository.findByName(data.name.trim());
      if (existingClub) {
        throw new Error('Já existe um clube com este nome');
      }

      return await this.repository.create({
        name: data.name.trim()
      });
    } catch (error) {
      console.error('Erro ao criar clube:', error);
      throw error;
    }
  }

  /**
   * Atualiza um clube existente
   * @description Valida e atualiza os dados de um clube
   * @param id - ID do clube
   * @param data - Dados a serem atualizados
   * @returns Promise<Club | null> - Clube atualizado ou null
   */
  async updateClub(id: number, data: UpdateClubData): Promise<Club | null> {
    try {
      // Validações
      if (!id || id <= 0) {
        throw new Error('ID do clube inválido');
      }

      if (data.name !== undefined && (data.name.trim() === '')) {
        throw new Error('Nome do clube não pode estar vazio');
      }

      // Verifica se o clube existe
      const existingClub = await this.repository.findById(id);
      if (!existingClub) {
        throw new Error('Clube não encontrado');
      }

      // Se estiver alterando o nome, verifica se já existe outro com o mesmo nome
      if (data.name && data.name !== existingClub.name) {
        const clubWithSameName = await this.repository.findByName(data.name.trim());
        if (clubWithSameName) {
          throw new Error('Já existe um clube com este nome');
        }
      }

      return await this.repository.update(id, {
        ...data,
        name: data.name?.trim()
      });
    } catch (error) {
      console.error('Erro ao atualizar clube:', error);
      throw error;
    }
  }

  /**
   * Remove um clube
   * @description Remove um clube do sistema
   * @param id - ID do clube
   * @returns Promise<boolean> - true se removido com sucesso
   */
  async deleteClub(id: number): Promise<boolean> {
    try {
      if (!id || id <= 0) {
        throw new Error('ID do clube inválido');
      }

      // Verifica se o clube existe
      const existingClub = await this.repository.findById(id);
      if (!existingClub) {
        throw new Error('Clube não encontrado');
      }

      // Verifica se o clube tem jogadores
      const clubWithRelations = existingClub as ClubWithRelations;
      if (clubWithRelations.players && clubWithRelations.players.length > 0) {
        throw new Error('Não é possível remover um clube que possui jogadores');
      }

      return await this.repository.delete(id);
    } catch (error) {
      console.error('Erro ao remover clube:', error);
      throw error;
    }
  }

  /**
   * Obtém estatísticas dos clubes
   * @description Retorna informações estatísticas sobre os clubes
   * @returns Promise<object> - Estatísticas dos clubes
   */
  async getClubsStatistics(): Promise<{
    totalClubs: number;
    clubsWithPlayers: number;
    averagePlayersPerClub: number;
  }> {
    try {
      const clubs = await this.repository.findAll();
      const totalClubs = clubs.length;
      const clubsWithRelations = clubs as ClubWithRelations[];
      const clubsWithPlayers = clubsWithRelations.filter(club => club.players.length > 0).length;
      const totalPlayers = clubsWithRelations.reduce((sum, club) => sum + club.players.length, 0);
      const averagePlayersPerClub = totalClubs > 0 ? totalPlayers / totalClubs : 0;

      return {
        totalClubs,
        clubsWithPlayers,
        averagePlayersPerClub: Math.round(averagePlayersPerClub * 100) / 100
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas dos clubes:', error);
      throw new Error('Falha ao obter estatísticas dos clubes');
    }
  }
}
