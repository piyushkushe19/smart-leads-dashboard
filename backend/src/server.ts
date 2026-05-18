import app from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './database/connection';

const startServer = async (): Promise<void> => {
  await connectDatabase();

  const server = app.listen(env.port, () => {
    console.log(`\n🚀 Smart Leads API running on port ${env.port}`);
    console.log(`📍 Environment: ${env.nodeEnv}`);
    console.log(`🌐 Frontend URL: ${env.frontendUrl}`);
    console.log(`🔗 API: http://localhost:${env.port}/api\n`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await disconnectDatabase();
      console.log('Server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason: unknown) => {
    console.error('Unhandled Rejection:', reason);
    server.close(() => process.exit(1));
  });
};

startServer();
