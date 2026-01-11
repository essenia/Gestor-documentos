import { Request, Response } from 'express';
import User from './user.model';
import Role from '../roles/role.model';
import bcrypt from 'bcrypt';


export const getUsers = async (req:Request, res:Response)=>{
 const users = await User.findAll({
 include: [{model: Role, attributes: ['nombre']}]
 });
 res.json(users);
}


export const createUser = async (req:Request,res :Response)=> {
const {email, password, id_rol} = req.body;
const hash = await bcrypt.hash(password,10);

await User.create({

    email,
    password_hash :hash,
    id_rol
});
res.sendStatus(201);

}
