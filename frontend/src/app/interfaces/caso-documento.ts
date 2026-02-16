import { TipoDocumento } from './TipoDocumento';



export interface CasoDocumento {
  id: number;
  id_caso: number;
  tipo_documento_id: number;
TipoDocumentoService ?: TipoDocumento;
  nombre?: string;             // <-- agregar esto

  ruta: string;
  tipo_archivo: string;
  tamano_archivo: number;

  fecha_subida: string;
  fecha_caducidad?: string | null;

  estado_validacion: 'PENDIENTE' | 'EN_REVISION' | 'COMPLETADO';

  es_obligatorio: boolean;
  comentarios?: string | null;
    progreso?: number; // <-- esto guarda el % de subida



}
