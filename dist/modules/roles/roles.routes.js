"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roles_controller_1 = require("./roles.controller");
const router = (0, express_1.Router)();
router.get('/', roles_controller_1.getRoles);
router.post('/', roles_controller_1.createRole);
exports.default = router;
//# sourceMappingURL=roles.routes.js.map