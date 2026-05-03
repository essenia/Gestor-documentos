import cron from 'node-cron';
import { Op } from 'sequelize';
import Caso from '../modules/casos/caso.model';
import Cliente from '../modules/cliente/cliente.model';
import User from '../modules/users/user.model';
import { enviarEmail } from '../services/email.service';
//  se ejecuta cada día a las 9:00
cron.schedule('0 9 * * *', async () => {
  console.log("🔁 Ejecutando recordatorios...");

  const hace3Dias = new Date();
  hace3Dias.setDate(hace3Dias.getDate() - 3);

  const casos = await Caso.findAll({
    where: {
      estado: 'pendiente_documentos',
      [Op.or]: [
        { ultimo_recordatorio: null },
        { ultimo_recordatorio: { [Op.lte]: hace3Dias } }
      ]
    },
    include: [{
      model: Cliente,
      include: [User]
    }]
  });

  for (const caso of casos) {
    const cliente = (caso as any).cliente;
    const email = cliente?.usuario?.email;
    const nombre = cliente?.nombre;

    if (!email) continue;

    const html = `
      <div style="font-family: Arial;">
        <h2>📂 Recordatorio de documentos</h2>
        <p>Hola ${nombre}</p>

        <p>Tienes documentos pendientes en tu caso.</p>

        <a href="http://localhost:4200"
           style="padding:10px;background:#3498db;color:white;text-decoration:none;">
          Subir documentos
        </a>
      </div>
    `;

    await enviarEmail(email, "Recordatorio de documentos", html);

    await caso.update({
      ultimo_recordatorio: new Date()
    });

    console.log("📧 Recordatorio enviado a:", email);
  }
});