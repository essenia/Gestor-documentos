
import { enviarEmail } from './email.service';



export const notificarDocumentoSubido = async (email: string) => {
  await enviarEmail(email, 'Nuevo documento', '<p>Se ha subido un documento</p>');
};