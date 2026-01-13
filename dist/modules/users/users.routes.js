"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("./users.controller");
const validate_jwt_1 = require("../../middlewares/validate-jwt");
const router = (0, express_1.Router)();
router.get('/', validate_jwt_1.validateJWT, users_controller_1.getUsers);
router.post('/', validate_jwt_1.validateJWT, users_controller_1.createUser);
exports.default = router;
//# sourceMappingURL=users.routes.js.map