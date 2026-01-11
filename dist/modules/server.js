"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roles_routes_1 = __importDefault(require("./roles/roles.routes"));
const users_routes_1 = __importDefault(require("./users/users.routes"));
const cors_1 = __importDefault(require("cors"));
class Server {
    app;
    port;
    constructor() {
        this.app = (0, express_1.default)();
        this.port = parseInt(String(process.env.PORT), 10) || 3030;
        this.listen();
        this.midlewares();
        this.routes();
    }
    listen() {
        console.log(this.port);
        this.app.listen(this.port, () => {
            console.log(`Aplicacion corriendo en el puerto ${this.port}`);
        });
    }
    routes() {
        this.app.get("/", (req, res) => {
            res.json({ msg: "API Working.." });
        });
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use('/api/roles', roles_routes_1.default);
        this.app.use("/api/users", users_routes_1.default);
    }
    midlewares() {
        //PArseamos El Body...
        // this.app.use(express.json());
        this.app.use((0, cors_1.default)());
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map