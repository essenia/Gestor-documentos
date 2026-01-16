import { Router } from "express";
import { createRole, getRoles } from "./roles.controller";
import { validateJWT } from "../../middlewares/validate-jwt";


const router = Router();

router.get('/',getRoles);
router.post('/',createRole);

export default router;