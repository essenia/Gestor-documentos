import { CasoDocumento } from "./caso-documento";
import { Cliente } from "./cliente";
import { TipoTramite } from "./tipoTramite";

export interface Caso {


      id: number;
  id_cliente: number;
  id_abogada?: number;
  tipo_tramite_id: number;
  estado: string;
  num_expediente: string;
  cod_caso: string;
  año: number;
  fecha_creacion: string;
  fechaEstado?: string; //  fecha de último cambio de estado


   cliente?: Cliente;
  tipoTramite?: TipoTramite;
  documentos?: CasoDocumento[];
}
