/**
 * Repositório base usando Prisma
 * @description Classe base para operações de banco de dados usando Prisma ORM
 * @author Champions Express
 */

import { PrismaClient } from '../generated/prisma';

/**
 * Classe base para repositórios usando Prisma
 * @description Fornece instância do Prisma Client e métodos comuns
 */
export class PrismaRepository {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Desconecta do banco de dados
   * @description Fecha a conexão com o banco de dados
   */
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }

  /**
   * Obtém a instância do Prisma Client
   * @returns PrismaClient - Instância do cliente Prisma
   */
  getClient(): PrismaClient {
    return this.prisma;
  }
} 