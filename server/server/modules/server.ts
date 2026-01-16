import express, { Application, Request, Response } from "express";
import rolesRoutes from "./roles/roles.routes";
import usersRoutes from "./users/users.routes";
import cors from "cors";
import authRoutes from "./auth/auth.routes";
import db from "./db/connection";


class Server {
  public app: Application;
  public port: number;
  constructor() {
    this.app = express();
    this.port = parseInt(String(process.env.PORT), 10) || 3030;
    this.listen();
    this.midlewares();
    this.routes();
    this.dbConnect();

  }

  listen() {
    console.log(this.port);

    this.app.listen(this.port, () => {
      console.log(`Aplicacion corriendo en el puerto ${this.port}`);
    });
  }

  routes() {
    this.app.get("/", (req: Request, res: Response) => {
      res.json({ msg: "API Working.." });
    });
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use("/api/roles", rolesRoutes);
    this.app.use("/api/users", usersRoutes);
    this.app.use('/api/auth', authRoutes);

  }
  midlewares() {
    //PArseamos El Body...
    // this.app.use(express.json());
    this.app.use(cors());
  }
  async dbConnect() {
    try {
      await db.authenticate();
   console.log("✅ Connection  has been established successfully.");
 



      console.log(" Modelos sincronizados correctamente.");
    } catch (error: any) {
      console.log(error);
    }
  }
}



export default Server;
