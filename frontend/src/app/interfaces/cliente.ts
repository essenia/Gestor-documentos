export interface Cliente {
  id?: number;
  id_usuario: number;
  nombre: string;
  apellido: string;
  dni: string;
  tipo_dni: string;
  telefono?: string;
  direccion?: string;
  notas_internas?: string;
  activo: boolean;
}
