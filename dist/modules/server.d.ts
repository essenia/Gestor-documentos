import { Application } from "express";
declare class Server {
    app: Application;
    port: number;
    constructor();
    listen(): void;
    routes(): void;
    midlewares(): void;
}
export default Server;
//# sourceMappingURL=server.d.ts.map