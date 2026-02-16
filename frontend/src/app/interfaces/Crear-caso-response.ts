import { CasoDocumento } from "./caso-documento";

export interface CrearCasoResponse {
  ok: boolean;
  caso: {
    id: number;
    clienteId: number;
    tramiteId: number;
    documentos: CasoDocumento[];
  };
  mensaje: string;
}