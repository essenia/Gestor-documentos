import { Request, Response } from "express";
import Notificacion from "../notificaciones/notificacion.model";



// obtener Notificaciones
export const obtenerNotificaciones = async (req: Request, res: Response) => {
  try {
    // const userId = 1;
    // const userId = res.locals.user.userId;
    const userId = (res.locals.user as any).userId;

    const notificaciones = await Notificacion.findAll({
      where: { id_usuario: userId },
      order: [['fecha_envio', 'DESC']]
    });

    res.json(notificaciones);

  } catch (error: any) {
  console.error(" ERROR REAL:", error);
  res.status(500).json({
    message: "Error al obtener notificaciones",
    error: error.message
  });
}
};

//contador solo no leídas
export const contarNoLeidas = async (req: Request, res: Response) => {
  try {
    const userId = (res.locals.user as any).userId;

    const total = await Notificacion.count({
      where: {
        id_usuario: userId,
        leida: false
      }
    });

    res.json({ total });

  } catch (error) {
    res.status(500).json({ message: "Error al contar" });
  }
};

//Marcar como leídas
export const marcarComoLeida = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await Notificacion.update(
      { leida: true },
      { where: { id } }
    );

    res.json({ ok: true });

  } catch (error) {
    res.status(500).json({ message: "Error al marcar como leída" });
  }
};