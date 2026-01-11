

import express, { Application, Request, Response } from "express";



   class Server {


    public app: Application; 
    public port: number;
    constructor(){
    this.app = express();
    this.port = parseInt(String(process.env.PORT) , 10)  || 3030;
    this.listen();
    }

    listen() {
    console.log(this.port);

    this.app.listen(this.port, () => {
      console.log(`Aplicacion corriendo en el puerto ${this.port}`);
    });}
   
}




export default  Server;