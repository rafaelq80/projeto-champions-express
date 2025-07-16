/**
 * Utilitário para respostas HTTP padronizadas
 * @description Fornece métodos para criar respostas HTTP consistentes
 * @author Champions Express
 */

/**
 * Interface para resposta HTTP
 */
export interface HttpResponse {
  statusCode: number;
  body: any;
}

/**
 * Resposta de sucesso (200)
 * @param data - Dados a serem retornados
 */
export const ok = async (data: any): Promise<HttpResponse> => {
  return {
    statusCode: 200,
    body: data,
  };
};

/**
 * Resposta de criação (201)
 * @param data - Dados criados (opcional)
 */
export const created = async (data?: any): Promise<HttpResponse> => {
  return {
    statusCode: 201,
    body: data || { message: "Criado com sucesso" },
  };
};

/**
 * Resposta sem conteúdo (204)
 */
export const noContent = async (): Promise<HttpResponse> => {
  return {
    statusCode: 204,
    body: null,
  };
};

/**
 * Resposta de requisição inválida (400)
 * @param message - Mensagem de erro (opcional)
 */
export const badRequest = async (message?: string): Promise<HttpResponse> => {
  return {
    statusCode: 400,
    body: {
      error: "Bad Request",
      message: message || "Requisição inválida"
    },
  };
};

/**
 * Resposta não encontrada (404)
 * @param message - Mensagem de erro (opcional)
 */
export const notFound = async (message?: string): Promise<HttpResponse> => {
  return {
    statusCode: 404,
    body: {
      error: "Not Found",
      message: message || "Recurso não encontrado"
    },
  };
};

/**
 * Resposta de erro interno do servidor (500)
 * @param message - Mensagem de erro (opcional)
 */
export const serverError = async (message?: string): Promise<HttpResponse> => {
  return {
    statusCode: 500,
    body: {
      error: "Internal Server Error",
      message: message || "Erro interno do servidor"
    },
  };
};
