import dotenv from 'dotenv';
import app from './app.js';
import db from './models/index.js';

dotenv.config();

const PORT = process.env.PORT || 4001;

async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    await db.sequelize.sync();
  }
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
