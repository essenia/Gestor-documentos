"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class Server {
    app;
    port;
    constructor() {
        this.app = (0, express_1.default)();
        this.port = parseInt(String(process.env.PORT), 10) || 3030;
        this.listen();
    }
    listen() {
        console.log(this.port);
        this.app.listen(this.port, () => {
            console.log(`Aplicacion corriendo en el puerto ${this.port}`);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map