import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { json } from 'express';
import { router as swiftCodesRouter } from './routes/swiftCodesRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(json());

// Mount API routes under /v1/swift-codes
app.use('/v1/swift-codes', swiftCodesRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});