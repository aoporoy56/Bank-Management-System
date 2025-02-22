const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "aopodas.dev@gmail.com",
    pass: "mkrw ggzv saad nchq"
  },
});

module.exports = transporter;