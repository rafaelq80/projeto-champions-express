/**
 * Repositório de Jogadores usando Prisma
 * @description Gerencia operações de banco de dados para jogadores usando Prisma ORM
 * @author Champions Express
 */

import { PrismaRepository } from './prisma-repository';
import { Player, Statistics } from '../generated/prisma';

/**
 * Interface para criação de jogador
 * @description Define a estrutura de dados para criar um novo jogador
 */
export interface CreatePlayerData {
  name: string;
  nationality: string;
  position: string;
  clubId: number;
  statistics?: CreateStatisticsData;
}

/**
 * Interface para criação de estatísticas
 * @description Define a estrutura de dados para criar estatísticas de um jogador
 */
export interface CreateStatisticsData {
  overall: number;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

/**
 * Interface para atualização de jogador
 * @description Define a estrutura de dados para atualizar um jogador existente
 */
export interface UpdatePlayerData {
  name?: string;
  nationality?: string;
  position?: string;
  clubId?: number;
}

/**
 * Interface para atualização de estatísticas
 * @description Define a estrutura de dados para atualizar estatísticas de um jogador
 */
export interface UpdateStatisticsData {
  overall?: number;
  pace?: number;
  shooting?: number;
  passing?: number;
  dribbling?: number;
  defending?: number;
  physical?: number;
}

/**
 * Repositório de Jogadores
 * @description Implementa operações CRUD para jogadores usando Prisma
 */
export class PlayersRepository extends PrismaRepository {
  
  /**
   * Busca todos os jogadores
   * @description Retorna todos os jogadores cadastrados com suas estatísticas e clube
   * @returns Promise<Player[]> - Lista de jogadores
   */
  async findAll(): Promise<Player[]> {
    return await this.prisma.player.findMany({
      include: {
        club: true,
        statistics: true
      }
    });
  }

  /**
   * Busca um jogador por ID
   * @description Retorna um jogador específico pelo seu ID
   * @param id - ID do jogador
   * @returns Promise<Player | null> - Jogador encontrado ou null
   */
  async findById(id: number): Promise<Player | null> {
    return await this.prisma.player.findUnique({
      where: { id },
      include: {
        club: true,
        statistics: true
      }
    });
  }

  /**
   * Busca jogadores por clube
   * @description Retorna todos os jogadores de um clube específico
   * @param clubId - ID do clube
   * @returns Promise<Player[]> - Lista de jogadores do clube
   */
  async findByClub(clubId: number): Promise<Player[]> {
    return await this.prisma.player.findMany({
      where: { clubId },
      include: {
        club: true,
        statistics: true
      }
    });
  }

  /**
   * Busca jogadores por posição
   * @description Retorna todos os jogadores de uma posição específica
   * @param position - Posição do jogador
   * @returns Promise<Player[]> - Lista de jogadores da posição
   */
  async findByPosition(position: string): Promise<Player[]> {
    return await this.prisma.player.findMany({
      where: { position },
      include: {
        club: true,
        statistics: true
      }
    });
  }

  /**
   * Busca jogadores por nacionalidade
   * @description Retorna todos os jogadores de uma nacionalidade específica
   * @param nationality - Nacionalidade do jogador
   * @returns Promise<Player[]> - Lista de jogadores da nacionalidade
   */
  async findByNationality(nationality: string): Promise<Player[]> {
    return await this.prisma.player.findMany({
      where: { nationality },
      include: {
        club: true,
        statistics: true
      }
    });
  }

  /**
   * Cria um novo jogador
   * @description Insere um novo jogador no banco de dados com suas estatísticas
   * @param data - Dados do jogador a ser criado
   * @returns Promise<Player> - Jogador criado
   */
  async create(data: CreatePlayerData): Promise<Player> {
    const { statistics, ...playerData } = data;
    
    return await this.prisma.player.create({
      data: {
        ...playerData,
        statistics: statistics ? {
          create: statistics
        } : undefined
      },
      include: {
        club: true,
        statistics: true
      }
    });
  }

  /**
   * Atualiza um jogador existente
   * @description Modifica os dados de um jogador no banco de dados
   * @param id - ID do jogador
   * @param data - Dados a serem atualizados
   * @returns Promise<Player | null> - Jogador atualizado ou null se não encontrado
   */
  async update(id: number, data: UpdatePlayerData): Promise<Player | null> {
    try {
      return await this.prisma.player.update({
        where: { id },
        data,
        include: {
          club: true,
          statistics: true
        }
      });
    } catch (error) {
      console.error(error);
      return null; // Jogador não encontrado
    }
  }

  /**
   * Atualiza estatísticas de um jogador
   * @description Modifica as estatísticas de um jogador no banco de dados
   * @param playerId - ID do jogador
   * @param data - Dados das estatísticas a serem atualizadas
   * @returns Promise<Statistics | null> - Estatísticas atualizadas ou null
   */
  async updateStatistics(playerId: number, data: UpdateStatisticsData): Promise<Statistics | null> {
    try {
      return await this.prisma.statistics.update({
        where: { playerId },
        data
      });
    } catch (error) {
      console.error(error);
      return null; // Estatísticas não encontradas
    }
  }

  /**
   * Remove um jogador
   * @description Deleta um jogador do banco de dados (incluindo suas estatísticas)
   * @param id - ID do jogador
   * @returns Promise<boolean> - true se removido com sucesso
   */
  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.player.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error(error);
      return false; // Jogador não encontrado
    }
  }

  /**
   * Conta o total de jogadores
   * @description Retorna o número total de jogadores cadastrados
   * @returns Promise<number> - Total de jogadores
   */
  async count(): Promise<number> {
    return await this.prisma.player.count();
  }

  /**
   * Busca jogadores com filtros avançados
   * @description Retorna jogadores baseado em múltiplos critérios
   * @param filters - Filtros a serem aplicados
   * @returns Promise<Player[]> - Lista de jogadores filtrados
   */
  async findWithFilters(filters: {
    clubId?: number;
    position?: string;
    nationality?: string;
    minOverall?: number;
    maxOverall?: number;
  }): Promise<Player[]> {
    const where: any = {};
    
    if (filters.clubId) where.clubId = filters.clubId;
    if (filters.position) where.position = filters.position;
    if (filters.nationality) where.nationality = filters.nationality;
    
    if (filters.minOverall || filters.maxOverall) {
      where.statistics = {};
      if (filters.minOverall) where.statistics.overall = { gte: filters.minOverall };
      if (filters.maxOverall) where.statistics.overall = { ...where.statistics.overall, lte: filters.maxOverall };
    }

    return await this.prisma.player.findMany({
      where,
      include: {
        club: true,
        statistics: true
      }
    });
  }
}
