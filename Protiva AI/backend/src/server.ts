import app from './app.js';
import { config } from './config/index.js';
import { connectDatabase } from './database/index.js';

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Start Express server
    app.listen(config.port, () => {
      console.log(`[Server] Portiva AI API running in ${config.env} mode on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Failed to bootstrap server:', error);
    process.exit(1);
  }
};

startServer();
