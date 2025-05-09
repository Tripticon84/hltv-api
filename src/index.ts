import express from 'express';
import dotenv from 'dotenv';

import hltvRouter from './routes/hltv.routes';

dotenv.config();

const app = express();

app.use('/', hltvRouter);

app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`);
});