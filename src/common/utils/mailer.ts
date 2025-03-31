import nodemailer, { Transporter } from "nodemailer";
import { Service } from "typedi";

@Service()
export class Mailer {
  public transporter: Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "Gmail",
      host: process.env.EMAIL_HOST as string,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  public async sendMail(
    from: string,
    to: string,
    subject: string,
    html: string
  ) {
    const mailOptions = {
      from,
      to,
      subject,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
