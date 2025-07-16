/**
 * Configuração da Aplicação Express
 * @description Configura o servidor Express com middlewares e rotas
 * @author Champions Express
 */

import express from 'express';
import cors from 'cors';
import router from './routes';
import { migrateData } from './scripts/migrate-data';
import { setupSwagger } from './swagger';

/**
 * Cria e configura a aplicação Express
 * @description Inicializa o servidor com middlewares e executa migração de dados
 * @returns Promise<express.Application> - Aplicação Express configurada
 */
async function createApp(): Promise<express.Application> {
  const app = express();

  // Configuração do CORS
  const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://felipao.sistem.com', 'http://gov.br'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  };

  // Middlewares
  app.use(cors(corsOptions));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Middleware de logging
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });

  // Configuração do Swagger (documentação da API)
  setupSwagger(app);

  // Rotas da API
  app.use('/api', router);

  // Middleware de tratamento de erros
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Erro na aplicação:', err);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
    });
  });

  // Middleware para rotas não encontradas - CORREÇÃO APLICADA
  app.use((req, res) => {
    res.status(404).json({
      error: 'Rota não encontrada',
      message: `A rota ${req.originalUrl} não existe`
    });
  });

  // Executa migração de dados na inicialização
  try {
    console.log('🔄 Iniciando migração de dados...');
    await migrateData();
    console.log('✅ Migração de dados concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante a migração de dados:', error);
    // Não interrompe a inicialização do servidor se a migração falhar
  }

  return app;
}

export default createApp;