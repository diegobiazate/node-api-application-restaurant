import express, { Request, Response, ErrorRequestHandler } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from "swagger-ui-express";

import restaurantRoutes from './routes/restaurants.router';
import openingHours from './routes/openingHours.router';
import swaggerFile from "./swagger.json";

dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.static(path.join(__dirname, '../public')));
server.use(express.urlencoded({ extended: true }));

server.get('/ping', (req: Request, res: Response) => res.json({ pong: true }));

server.use('/restaurant', restaurantRoutes);
server.use('/openingHours', openingHours);
server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

server.use((req: Request, res: Response) => {
    res.status(404);
    res.json({ error: 'Endpoint não encontrado.' });
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(400); // Bad Request
    console.log(err);
    res.json({ error: 'Ocorreu algum erro.' });
}
server.use(errorHandler);

server.listen(process.env.PORT);