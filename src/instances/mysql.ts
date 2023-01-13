import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';

//importando variáveis de ambiente
dotenv.config();

//criando a conexão com o banco, pegando as informaçõe das variáveis de ambiente
export const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD as string,
    {
        dialect: 'mysql',
        port: parseInt(process.env.DB_PORT as string),
        host: 'localhost',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
    }
);