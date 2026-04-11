import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'raoiaa10@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

export const enviarEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: '"Sistema Legal" <raoiaa10@gmail.com>',
    to,
    subject,
    html
  });
};