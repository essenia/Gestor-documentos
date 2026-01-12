"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
// LOGIN
// POST /api/auth/login
router.post('/login', auth_controller_1.login);
// CAMBIO DE CONTRASEÑA (CLIENTE)
// POST /api/auth/change-password
router.post('/change-password', auth_controller_1.changePassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map