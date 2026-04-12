import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",

  // service: 'gmail',
   port: 465,
  secure: true,

  auth: {
    user: 'raouaacampus014@gmail.com',
    pass: 'zjci nzdu xjbm wtgr'

  }
});
transporter.verify()
  .then(() => console.log(" SMTP listo"))
  .catch(err => console.error(" Error SMTP:", err));

export const enviarEmail = async (to: string, subject: string, html: string) => {
      try {
     const info = await transporter.sendMail({
    from: '"Sistema Legal" <raouaacampus014@gmail.com>',
      
    to,
    subject,
    html
  });
   console.log("📧 Email enviado:", info.messageId);
     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));


    return info; // 
  } catch (error) {
    console.error("❌ Error enviando email:", error);
    throw error;
  }
};