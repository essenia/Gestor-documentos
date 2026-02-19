export interface HistorialEstado {
  id: number;
  caso_id: number;
  estado_anterior: string;
  estado_nuevo: string;
  usuario_id: number;
  fecha_cambio: string;
}