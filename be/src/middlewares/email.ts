import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: 'gmail', // dùng Gmail
    auth: {
        user: process.env.EMAIL_USER!,        // email mày gửi đi
        pass: process.env.EMAIL_PASS!,            // app password (không phải mật khẩu gmail thường!)
    }
});

export const sendMail = async (to: string, subject: string, htmlContent: string) => {
    console.log("process.env.EMAIL_USER",process.env.EMAIL_USER)
    console.log("process.env.EMAIL_PASS",process.env.EMAIL_PASS)
    try {
      const info = await transporter.sendMail({
        from: `"Student Manager" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: htmlContent
      });
      console.log(" Mail gửi thành công:", info.response);
      return true;
    } catch (error: any) {
      console.error(" Lỗi khi gửi mail:", error?.message || error);
      return false;
    }
  };
  