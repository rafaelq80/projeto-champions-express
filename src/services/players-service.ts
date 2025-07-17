/**
 * Serviço de Jogadores
 * @description Gerencia a lógica de negócio para operações com jogadores
 * @author Champions Express
 */

import { PlayersRepository, CreatePlayerData, UpdatePlayerData } from '../repositories/players-repository';
import { Player, Statistics } from '../generated/prisma';

// Tipo estendido para incluir relacionamentos
type PlayerWithRelations = Player & {
  club: any;
  statistics: Statistics | null;
};

export class PlayersService {
  private readonly repository: PlayersRepository;

  constructor() {
    this.repository = new PlayersRepository();
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
   * @description Valida e atualiza um jogador no sistema
   * @param id - ID do jogador
   * @param data - Dados a serem atualizados
   * @returns Promise<Player | null> - Jogador atualizado ou null
   */
  async updatePlayer(id: number, data: UpdatePlayerData): Promise<Player | null> {
    try {
      if (!id || id <= 0) {
        throw new Error('ID do jogador inválido');
      }
      return await this.repository.update(id, data);
    } catch (error) {
      console.error('Erro ao atualizar jogador:', error);
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
   * Busca todos os jogadores
   * @description Retorna todos os jogadores cadastrados
   * @returns Promise<Player[]> - Lista de jogadores
   */
  async getAllPlayers(): Promise<Player[]> {
    return await this.repository.findAll();
  }

  /**
   * Busca um jogador por ID
   * @description Retorna um jogador específico pelo seu ID
   * @param id - ID do jogador
   * @returns Promise<Player | null> - Jogador encontrado ou null
   */
  async getPlayerById(id: number): Promise<Player | null> {
    if (!id || id <= 0) {
      throw new Error('ID do jogador inválido');
    }
    return await this.repository.findById(id);
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
