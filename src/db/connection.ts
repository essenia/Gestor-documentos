

import { Sequelize } from "sequelize";
// import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize('gestordocumentos','root','', {
    host:'localhost',dialect:'mariadb',  
    // logging: console.log


})
export default sequelize;
