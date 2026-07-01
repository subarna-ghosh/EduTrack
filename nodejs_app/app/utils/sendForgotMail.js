const transporter = require("../config/emailconfig");

const sendForgotPasswordEmail = async (req,user,temporaryPassword) => {
  return await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Password Reset",
    html: `
      <p>Hello ${user.name},</p>
      <p>Your password has been reset successfully.</p>
      <p>Your temporary password is:</p>
      <h3>${temporaryPassword}</h3>
      <p>
        Please login using this password and change it immediately.
      </p>
      <p>
        <a href="http://localhost:3001/web/view/login">
          Login Here
        </a>
      </p>
      <p>Thank You,</p>
      <p>Admin Team</p>
    `,
  });
};

module.exports = sendForgotPasswordEmail;
