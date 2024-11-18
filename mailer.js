require('dotenv').config();
const nodemailer = require('nodemailer');

// Clase MailerService para enviar correos electrónicos
class MailerService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(to, subject, html) {
    try {
      await this.transporter.sendMail({
        from: 'Shinobi Store <shinobistore.help@gmail.com>',
        to,
        subject,
        html,
      });
      console.log(`Correo enviado a ${to}`);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
    }
  }
}

// Exportar una instancia del servicio
module.exports = new MailerService();
