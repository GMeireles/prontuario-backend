import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes/index.js';
import stripeWebhookRoutes from './routes/stripeWebhookRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';

const app = express();

app.use(helmet());
app.use(cors());

app.use('/api/webhooks', stripeWebhookRoutes);

app.use(express.json());

app.use('/api', router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
