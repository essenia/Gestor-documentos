import { Router } from "express";
import { createUser, getUsers } from "./users.controller";
import { validateJWT } from "../../middlewares/validate-jwt";


const router  = Router();
router.get('/', getUsers);
router.post('/', createUser);
export default router;