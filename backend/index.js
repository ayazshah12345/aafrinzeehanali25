import app from './src/app.js';
import { config } from './src/config/index.js';
import { initializeDatabase } from './src/config/initDb.js';

const PORT = config.port;

const startServer = async () => {
  // Ensure PostgreSQL database tables are initialized
  await initializeDatabase();

  const server = app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`🚀 Backend Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${config.nodeEnv}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`========================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Error: Port ${PORT} is already in use by another running Node process.`);
      console.error(`💡 Tip: Close the existing background terminal running Express server, or change PORT in backend/.env file.\n`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer();
