import { prisma } from '../core/infra/database/connection';
import { env } from './env';
import { app } from './server';

async function checkDbConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Conexão ao banco de dados OK');
  } catch (err) {
    console.error('❌ Falha ao se conectar com o banco de dados.');
    console.error(err);
    process.exit(1);
  }
}

async function bootstrap() {
  await checkDbConnection();

  app.listen(env.PORT, () => {
    console.log(
      `🚀 Servidor HTTP rodando na porta ${env.PORT} [${env.NODE_ENV}]`,
    );
  });
}

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

bootstrap();
