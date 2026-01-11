

import express, { Application, Request, Response } from "express";
import rolesRoutes from "./roles/roles.routes";
import usersRoutes from "./users/users.routes";
import cors from "cors";



   class Server {


    public app: Application; 
    public port: number;
    constructor(){
    this.app = express();
    this.port = parseInt(String(process.env.PORT) , 10)  || 3030;
    this.listen();
    this.midlewares();
    this.routes();
    }

    listen() {
    console.log(this.port);

    this.app.listen(this.port, () => {
      console.log(`Aplicacion corriendo en el puerto ${this.port}`);
    });}

    routes() {
    this.app.get("/", (req: Request, res: Response) => {
      res.json({ msg: "API Working.." });
    });
   this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
       this.app.use('/api/roles', rolesRoutes);
        this.app.use("/api/users", usersRoutes);

  }
   midlewares() {
    //PArseamos El Body...
    // this.app.use(express.json());
    this.app.use(cors());
   }

}
   







export default  Server;