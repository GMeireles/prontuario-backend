import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, 'src/.env') });

const { default: app } = await import('./src/app.js');
const { default: db } = await import('./src/models/index.js');

const PORT = process.env.PORT || 4001;

async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    await db.sequelize.sync();
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
