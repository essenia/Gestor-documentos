import { Router } from "express";
import { createUser, getUsers } from "./users.controller";
import { validateJWT } from "../../middlewares/validate-jwt";


const router  = Router();
router.get('/',validateJWT, getUsers);
router.post('/',validateJWT, createUser);
export default router;