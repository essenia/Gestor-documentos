import { Router } from 'express';
import { getTiposDocumento } from './tipoDocumento.controller';

const router = Router();

router.get('/', getTiposDocumento);

export default router;
