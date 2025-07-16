/**
 * Script de migração de dados
 * @description Migra dados dos arquivos JSON para o banco de dados SQLite
 * @author Champions Express
 */

import { PrismaClient } from '../generated/prisma';
import clubsData from '../data/clubs.json';
import playersData from '../data/players.json';

const prisma = new PrismaClient();

/**
 * Verifica se uma tabela está vazia
 * @param tableName - Nome da tabela para verificar
 * @returns Promise<boolean> - true se a tabela estiver vazia
 */
async function isTableEmpty(tableName: string): Promise<boolean> {
  const count = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM ${tableName}`);
  console.log(`Verificando tabela ${tableName}:`, count);
  const countValue = (count as any)[0].count;
  // Converte BigInt para number para comparação
  return Number(countValue) === 0;
}

/**
 * Migra dados dos clubes para o banco de dados
 * @description Insere clubes apenas se a tabela estiver vazia
 */
async function migrateClubs(): Promise<void> {
  try {
    const isEmpty = await isTableEmpty('clubs');
    
    if (!isEmpty) {
      console.log('✅ Tabela de clubes já possui dados. Pulando migração...');
      return;
    }

    console.log('🔄 Migrando clubes...');
    
    for (const club of clubsData) {
      await prisma.club.create({
        data: {
          id: club.id,
          name: club.name
        }
      });
    }
    
    console.log(`✅ ${clubsData.length} clubes migrados com sucesso!`);
  } catch (error) {
    console.error('❌ Erro ao migrar clubes:', error);
    throw error;
  }
}

/**
 * Migra dados dos jogadores e suas estatísticas para o banco de dados
 * @description Insere jogadores e estatísticas apenas se a tabela estiver vazia
 */
async function migratePlayers(): Promise<void> {
  try {
    const isEmpty = await isTableEmpty('players');
    
    if (!isEmpty) {
      console.log('✅ Tabela de jogadores já possui dados. Pulando migração...');
      return;
    }

    console.log('🔄 Migrando jogadores e estatísticas...');
    
    for (const player of playersData) {
      // Busca o clube pelo nome
      const club = await prisma.club.findFirst({
        where: { name: player.club }
      });

      if (!club) {
        console.warn(`⚠️ Clube "${player.club}" não encontrado para o jogador ${player.name}`);
        continue;
      }

      // Cria o jogador
      const createdPlayer = await prisma.player.create({
        data: {
          name: player.name,
          nationality: player.nationality,
          position: player.position,
          clubId: club.id
        }
      });

      // Cria as estatísticas do jogador
      await prisma.statistics.create({
        data: {
          overall: player.statistics.Overall,
          pace: player.statistics.Pace,
          shooting: player.statistics.Shooting,
          passing: player.statistics.Passing,
          dribbling: player.statistics.Dribbling,
          defending: player.statistics.Defending,
          physical: player.statistics.Physical,
          playerId: createdPlayer.id
        }
      });
    }
    
    console.log(`✅ ${playersData.length} jogadores e suas estatísticas migrados com sucesso!`);
  } catch (error) {
    console.error('❌ Erro ao migrar jogadores:', error);
    throw error;
  }
}

/**
 * Função principal de migração
 * @description Executa a migração completa dos dados
 */
async function migrateData(): Promise<void> {
  try {
    console.log('🚀 Iniciando migração de dados...\n');
    
    await migrateClubs();
    await migratePlayers();
    
    console.log('\n🎉 Migração concluída com sucesso!');
  } catch (error) {
    console.error('💥 Erro durante a migração:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Executa a migração se o script for chamado diretamente
if (require.main === module) {
  migrateData();
}

export { migrateData }; 