/**
 * Repositório de Clubes usando Prisma
 * @description Gerencia operações de banco de dados para clubes usando Prisma ORM
 * @author Champions Express
 */

import { PrismaRepository } from './prisma-repository';
import { Club } from '../generated/prisma';

/**
 * Interface para criação de clube
 * @description Define a estrutura de dados para criar um novo clube
 */
export interface CreateClubData {
  name: string;
}

/**
 * Interface para atualização de clube
 * @description Define a estrutura de dados para atualizar um clube existente
 */
export interface UpdateClubData {
  name?: string;
}

/**
 * Repositório de Clubes
 * @description Implementa operações CRUD para clubes usando Prisma
 */
export class ClubsRepository extends PrismaRepository {
  
  /**
   * Busca todos os clubes
   * @description Retorna todos os clubes cadastrados no banco de dados
   * @returns Promise<Club[]> - Lista de clubes
   */
  async findAll(): Promise<Club[]> {
    return await this.prisma.club.findMany({
      include: {
        players: {
          include: {
            statistics: true
          }
        }
      }
    });
  }

  /**
   * Busca um clube por ID
   * @description Retorna um clube específico pelo seu ID
   * @param id - ID do clube
   * @returns Promise<Club | null> - Clube encontrado ou null
   */
  async findById(id: number): Promise<Club | null> {
    return await this.prisma.club.findUnique({
      where: { id },
      include: {
        players: {
          include: {
            statistics: true
          }
        }
      }
    });
  }

  /**
   * Busca um clube por nome
   * @description Retorna um clube específico pelo seu nome
   * @param name - Nome do clube
   * @returns Promise<Club | null> - Clube encontrado ou null
   */
  async findByName(name: string): Promise<Club | null> {
    return await this.prisma.club.findFirst({
      where: { name },
      include: {
        players: {
          include: {
            statistics: true
          }
        }
      }
    });
  }

  /**
   * Cria um novo clube
   * @description Insere um novo clube no banco de dados
   * @param data - Dados do clube a ser criado
   * @returns Promise<Club> - Clube criado
   */
  async create(data: CreateClubData): Promise<Club> {
    return await this.prisma.club.create({
      data,
      include: {
        players: {
          include: {
            statistics: true
          }
        }
      }
    });
  }

  /**
   * Atualiza um clube existente
   * @description Modifica os dados de um clube no banco de dados
   * @param id - ID do clube
   * @param data - Dados a serem atualizados
   * @returns Promise<Club | null> - Clube atualizado ou null se não encontrado
   */
  async update(id: number, data: UpdateClubData): Promise<Club | null> {
    try {
      return await this.prisma.club.update({
        where: { id },
        data,
        include: {
          players: {
            include: {
              statistics: true
            }
          }
        }
      });
    } catch (error) {
      console.error(error);
      return null; // Clube não encontrado
    }
  }

  /**
   * Remove um clube
   * @description Deleta um clube do banco de dados
   * @param id - ID do clube
   * @returns Promise<boolean> - true se removido com sucesso
   */
  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.club.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error(error);
      return false; // Clube não encontrado
    }
  }

  /**
   * Conta o total de clubes
   * @description Retorna o número total de clubes cadastrados
   * @returns Promise<number> - Total de clubes
   */
  async count(): Promise<number> {
    return await this.prisma.club.count();
  }
}
