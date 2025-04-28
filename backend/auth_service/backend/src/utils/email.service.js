import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendCredentialsEmail = async ({ to, name, role, email, password }) => {
  const mailOptions = {
    from: `"Hela Eats Admin" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your Hela Eats Account Credentials",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
        <div style="text-align: center; padding: 20px; background-color: #ffd600; border-radius: 10px 10px 0 0;">
          <h2 style="color: #000000; margin: 0; font-size: 24px;">🚚🍕 Welcome to Hela Eats</h2>
        </div>

        <div style="text-align: center; margin: 20px 0;">
          <img src="https://res.cloudinary.com/dw0kg1jfw/image/upload/v1745328755/Hela_Eats_Google_form_banner_asym8i.png" 
               alt="Hela Eats" 
               style="max-width: 100%; height: auto; border-radius: 8px;">
        </div>

        <div style="padding: 20px;">
          <p style="font-size: 16px; color: #333333;">Dear ${name},</p>
          <p style="font-size: 16px; color: #333333;">Your account has been created as a <strong>${role}</strong>.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 10px; font-size: 14px; color: #555555;">
                <strong>📧 Email:</strong> ${email}
              </li>
              <li style="font-size: 14px; color: #555555;">
                <strong>🔐 Temporary Password:</strong> ${password}
              </li>
            </ul>
          </div>
          
          <p style="font-size: 16px; color: #333333;">
            Please log in and change your password immediately for security reasons.
          </p>

          <div style="text-align: center; margin: 20px 0;">
            <a href="http://localhost:5173/login" style="display: inline-block; padding: 12px 25px; font-size: 16px; color: #dad7d7; background-color: #ef9132; text-decoration: none; border-radius: 5px;">
                Login to Hela Eats
            </a>
          </div>

          <p style="font-size: 14px; color: #777777; text-align: center;">
            Enjoy delicious meals with <strong>Hela Eats</strong>.
          </p>
        </div>

        <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 0 0 10px 10px;">
          <p style="font-size: 14px; color: #555555; margin: 0;">
            Best regards,<br>🍛 <strong>Hela Eats Team</strong>
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendCredentialsEmail;
