/**
 * Servidor da Aplicação
 * @description Inicializa e executa o servidor Express
 * @author Champions Express
 */

import createApp from './app';

/**
 * Inicializa o servidor
 * @description Configura e inicia o servidor Express
 */
async function startServer(): Promise<void> {
  try {
    const app = await createApp();
    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      console.log('🚀 Servidor Champions Express iniciado com sucesso!');
      console.log(`📍 Servidor rodando em: http://localhost:${port}`);
      console.log(`📚 API disponível em: http://localhost:${port}/api`);
      console.log(`❤️  Health check em: http://localhost:${port}/api/health`);
      console.log(`⏰ Iniciado em: ${new Date().toISOString()}`);
    });
  } catch (error) {
    console.error('❌ Erro ao inicializar o servidor:', error);
    process.exit(1);
  }
}

// Inicia o servidor
startServer();
