/**
 * Serviço de Jogadores
 * @description Gerencia a lógica de negócio para operações com jogadores
 * @author Champions Express
 */

import { PlayersRepository, CreatePlayerData, UpdatePlayerData, UpdateStatisticsData } from '../repositories/players-repository';
import { Player, Statistics } from '../generated/prisma';

// Tipo estendido para incluir relacionamentos
type PlayerWithRelations = Player & {
  club: any;
  statistics: Statistics | null;
};

/**
 * Serviço de Jogadores
 * @description Implementa a lógica de negócio para jogadores
 */
export class PlayersService {
  private readonly repository: PlayersRepository;

  constructor() {
    this.repository = new PlayersRepository();
  }

  /**
   * Busca todos os jogadores
   * @description Retorna todos os jogadores cadastrados
   * @returns Promise<Player[]> - Lista de jogadores
   */
  async getAllPlayers(): Promise<Player[]> {
    try {
      return await this.repository.findAll();
    } catch (error) {
      console.error('Erro ao buscar jogadores:', error);
      throw new Error('Falha ao buscar jogadores');
    }
  }

  /**
   * Busca um jogador por ID
   * @description Retorna um jogador específico pelo seu ID
   * @param id - ID do jogador
   * @returns Promise<Player | null> - Jogador encontrado ou null
   */
  async getPlayerById(id: number): Promise<Player | null> {
    try {
      if (!id || id <= 0) {
        throw new Error('ID do jogador inválido');
      }
      
      return await this.repository.findById(id);
    } catch (error) {
      console.error('Erro ao buscar jogador por ID:', error);
      throw new Error('Falha ao buscar jogador');
    }
  }

  /**
   * Busca jogadores por clube
   * @description Retorna todos os jogadores de um clube específico
   * @param clubId - ID do clube
   * @returns Promise<Player[]> - Lista de jogadores do clube
   */
  async getPlayersByClub(clubId: number): Promise<Player[]> {
    try {
      if (!clubId || clubId <= 0) {
        throw new Error('ID do clube inválido');
      }
      
      return await this.repository.findByClub(clubId);
    } catch (error) {
      console.error('Erro ao buscar jogadores por clube:', error);
      throw new Error('Falha ao buscar jogadores do clube');
    }
  }

  /**
   * Busca jogadores por posição
   * @description Retorna todos os jogadores de uma posição específica
   * @param position - Posição do jogador
   * @returns Promise<Player[]> - Lista de jogadores da posição
   */
  async getPlayersByPosition(position: string): Promise<Player[]> {
    try {
      if (!position || position.trim() === '') {
        throw new Error('Posição do jogador inválida');
      }
      
      return await this.repository.findByPosition(position.trim());
    } catch (error) {
      console.error('Erro ao buscar jogadores por posição:', error);
      throw new Error('Falha ao buscar jogadores da posição');
    }
  }

  /**
   * Busca jogadores por nacionalidade
   * @description Retorna todos os jogadores de uma nacionalidade específica
   * @param nationality - Nacionalidade do jogador
   * @returns Promise<Player[]> - Lista de jogadores da nacionalidade
   */
  async getPlayersByNationality(nationality: string): Promise<Player[]> {
    try {
      if (!nationality || nationality.trim() === '') {
        throw new Error('Nacionalidade do jogador inválida');
      }
      
      return await this.repository.findByNationality(nationality.trim());
    } catch (error) {
      console.error('Erro ao buscar jogadores por nacionalidade:', error);
      throw new Error('Falha ao buscar jogadores da nacionalidade');
    }
  }

  /**
   * Cria um novo jogador
   * @description Valida e cria um novo jogador no sistema
   * @param data - Dados do jogador a ser criado
   * @returns Promise<Player> - Jogador criado
   */
  async createPlayer(data: CreatePlayerData): Promise<Player> {
    try {
      // Validações
      if (!data.name || data.name.trim() === '') {
        throw new Error('Nome do jogador é obrigatório');
      }

      if (!data.nationality || data.nationality.trim() === '') {
        throw new Error('Nacionalidade do jogador é obrigatória');
      }

      if (!data.position || data.position.trim() === '') {
        throw new Error('Posição do jogador é obrigatória');
      }

      if (!data.clubId || data.clubId <= 0) {
        throw new Error('ID do clube é obrigatório');
      }

      // Validação das estatísticas se fornecidas
      if (data.statistics) {
        const stats = data.statistics;
        const validRange = (value: number) => value >= 0 && value <= 100;
        
        if (!validRange(stats.overall) || !validRange(stats.pace) || 
            !validRange(stats.shooting) || !validRange(stats.passing) ||
            !validRange(stats.dribbling) || !validRange(stats.defending) ||
            !validRange(stats.physical)) {
          throw new Error('As estatísticas devem estar entre 0 e 100');
        }
      }

      return await this.repository.create({
        name: data.name.trim(),
        nationality: data.nationality.trim(),
        position: data.position.trim(),
        clubId: data.clubId,
        statistics: data.statistics
      });
    } catch (error) {
      console.error('Erro ao criar jogador:', error);
      throw error;
    }
  }

  /**
   * Atualiza um jogador existente
   * @description Valida e atualiza os dados de um jogador
   * @param id - ID do jogador
   * @param data - Dados a serem atualizados
   * @returns Promise<Player | null> - Jogador atualizado ou null
   */
  async updatePlayer(id: number, data: UpdatePlayerData): Promise<Player | null> {
    try {
      if (!id || id <= 0) {
        throw new Error('ID do jogador inválido');
      }

      // Validações dos campos
      if (data.name !== undefined && data.name.trim() === '') {
        throw new Error('Nome do jogador não pode estar vazio');
      }

      if (data.nationality !== undefined && data.nationality.trim() === '') {
        throw new Error('Nacionalidade do jogador não pode estar vazia');
      }

      if (data.position !== undefined && data.position.trim() === '') {
        throw new Error('Posição do jogador não pode estar vazia');
      }

      return await this.repository.update(id, {
        ...data,
        name: data.name?.trim(),
        nationality: data.nationality?.trim(),
        position: data.position?.trim()
      });
    } catch (error) {
      console.error('Erro ao atualizar jogador:', error);
      throw error;
    }
  }

  /**
   * Atualiza estatísticas de um jogador
   * @description Valida e atualiza as estatísticas de um jogador
   * @param playerId - ID do jogador
   * @param data - Dados das estatísticas a serem atualizadas
   * @returns Promise<boolean> - true se atualizado com sucesso
   */
  async updatePlayerStatistics(playerId: number, data: UpdateStatisticsData): Promise<boolean> {
    try {
      if (!playerId || playerId <= 0) {
        throw new Error('ID do jogador inválido');
      }

      // Validação das estatísticas
      const validRange = (value: number) => value >= 0 && value <= 100;
      const statsToValidate = Object.values(data).filter(val => val !== undefined);
      
      for (const value of statsToValidate) {
        if (!validRange(value)) {
          throw new Error('As estatísticas devem estar entre 0 e 100');
        }
      }

      const result = await this.repository.updateStatistics(playerId, data);
      return result !== null;
    } catch (error) {
      console.error('Erro ao atualizar estatísticas do jogador:', error);
      throw error;
    }
  }

  /**
   * Remove um jogador
   * @description Remove um jogador do sistema
   * @param id - ID do jogador
   * @returns Promise<boolean> - true se removido com sucesso
   */
  async deletePlayer(id: number): Promise<boolean> {
    try {
      if (!id || id <= 0) {
        throw new Error('ID do jogador inválido');
      }

      return await this.repository.delete(id);
    } catch (error) {
      console.error('Erro ao remover jogador:', error);
      throw error;
    }
  }

  /**
   * Busca jogadores com filtros avançados
   * @description Retorna jogadores baseado em múltiplos critérios
   * @param filters - Filtros a serem aplicados
   * @returns Promise<Player[]> - Lista de jogadores filtrados
   */
  async getPlayersWithFilters(filters: {
    clubId?: number;
    position?: string;
    nationality?: string;
    minOverall?: number;
    maxOverall?: number;
  }): Promise<Player[]> {
    try {
      // Validações dos filtros
      if (filters.clubId !== undefined && filters.clubId <= 0) {
        throw new Error('ID do clube inválido');
      }

      if (filters.minOverall !== undefined && (filters.minOverall < 0 || filters.minOverall > 100)) {
        throw new Error('Overall mínimo deve estar entre 0 e 100');
      }

      if (filters.maxOverall !== undefined && (filters.maxOverall < 0 || filters.maxOverall > 100)) {
        throw new Error('Overall máximo deve estar entre 0 e 100');
      }

      if (filters.minOverall !== undefined && filters.maxOverall !== undefined && 
          filters.minOverall > filters.maxOverall) {
        throw new Error('Overall mínimo não pode ser maior que o máximo');
      }

      return await this.repository.findWithFilters(filters);
    } catch (error) {
      console.error('Erro ao buscar jogadores com filtros:', error);
      throw error;
    }
  }

  /**
   * Obtém estatísticas dos jogadores
   * @description Retorna informações estatísticas sobre os jogadores
   * @returns Promise<object> - Estatísticas dos jogadores
   */
  async getPlayersStatistics(): Promise<{
    totalPlayers: number;
    averageOverall: number;
    topPositions: { position: string; count: number }[];
    topNationalities: { nationality: string; count: number }[];
  }> {
    try {
      const players = await this.repository.findAll();
      const totalPlayers = players.length;
      
      // Calcula média do overall
      const playersWithRelations = players as PlayerWithRelations[];
      const playersWithStats = playersWithRelations.filter(player => player.statistics);
      const averageOverall = playersWithStats.length > 0 
        ? playersWithStats.reduce((sum, player) => sum + (player.statistics?.overall || 0), 0) / playersWithStats.length
        : 0;

      // Top posições
      const positionCount = players.reduce((acc, player) => {
        acc[player.position] = (acc[player.position] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const topPositions = Object.entries(positionCount)
        .map(([position, count]) => ({ position, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Top nacionalidades
      const nationalityCount = players.reduce((acc, player) => {
        acc[player.nationality] = (acc[player.nationality] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const topNationalities = Object.entries(nationalityCount)
        .map(([nationality, count]) => ({ nationality, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        totalPlayers,
        averageOverall: Math.round(averageOverall * 100) / 100,
        topPositions,
        topNationalities
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas dos jogadores:', error);
      throw new Error('Falha ao obter estatísticas dos jogadores');
    }
  }
}
