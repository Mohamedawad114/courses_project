import nodemailer from "nodemailer";
import { EventEmitter } from "node:events";
import bcrypt from 'bcrypt'
import redis from'./redis.js';
import { customAlphabet } from "nanoid";
const generateOTP = customAlphabet("0123456789mnbvwqcxasfdgoje", 6);

async function SendEmail({ to, subject, html }) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.APP_GMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    const Info = await transporter.sendMail({
      from: process.env.APP_GMAIL,
      to: to,
      subject: subject,
      html: html,
    });
    console.log(Info.response);
  } catch (err) {
    console.log(err);
  }
}

export const emittir = new EventEmitter();
emittir.on("sendemail", (args) => {
  SendEmail(args);
});


const createAndSendOTP = async (User, email) => {
  const OTP = generateOTP();
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f2f2f2;">
      <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="color: #333;">مرحبا بك!</h2>
        <p>شكراً لتسجيلك. الكود الخاص بك لتأكيد الحساب هو:</p>
        <h1 style="color: #007BFF; text-align: center;">${OTP}</h1>
        <p>من فضلك أدخل هذا الكود في التطبيق لتفعيل حسابك.</p>
        <hr />
        <p style="font-size: 12px; color: #888;">إذا لم تطلب هذا الكود، تجاهل هذه الرسالة.</p>
      </div>
    </div>
  `;
  const salt=await bcrypt.genSalt(parseInt(process.env.SALT))
  await redis.set(`otp_${email}`, OTP, "EX", 60*2);
  User.otps = { confirmation: await bcrypt.hash(OTP, salt)};
  await User.save();
  emittir.emit("sendemail", { to: email, subject: "confirmation email", html });
};
const createAndSendOTP_Password = async (User, email) => {
  const OTP = generateOTP();
  const resetHtml = `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
    <h2 style="color: #333;">طلب إعادة تعيين كلمة المرور</h2>
    <p style="font-size: 16px; color: #555;">لقد تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بك. من فضلك استخدم رمز التحقق (OTP) أدناه لإتمام العملية:</p>
    <div style="margin: 20px 0; padding: 20px; background-color: #f1f5ff; border-radius: 8px; text-align: center;">
      <h1 style="font-size: 36px; letter-spacing: 4px; color: #007BFF;">${OTP}</h1>
    </div>
    <p style="font-size: 14px; color: #777;">الرمز صالح لفترة محدودة فقط. إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة بأمان.</p>
    <hr style="margin-top: 30px;" />
    <p style="font-size: 12px; color: #999;">© 2025 Notes. جميع الحقوق محفوظة.</p> 
  </div>
</div>`;
  await redis.set(`otp_${email}`, OTP, "EX", 60*10);
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
  User.otps = { reset: await bcrypt.hash(OTP, salt)};
  await User.save();
  emittir.emit("sendemail", { to: email, subject: "Reset Password", html:resetHtml });
};



const bookingDone = async ({fullName,course, instructor,email}) => {
  const bookCode=generateOTP()
  const html = `
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>تأكيد الحجز</title>
    <style>
      @media (max-width: 600px) {
        .container { width: 100% !important; padding: 16px !important; }
        .btn { display: block !important; width: 100% !important; }
      }
    </style>
  </head>
  <body style="margin:0;background:#f6f7fb;font-family:Tahoma, Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f6f7fb;">
      <tr>
        <td align="center" style="padding:24px;">
          <table role="presentation" width="600" class="container" cellspacing="0" cellpadding="0" border="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
            
            <!-- Header -->
            <tr>
              <td align="center" style="background:#1f4bff;color:#ffffff;padding:24px 20px;">
                <div style="font-size:20px;font-weight:700;">تأكيد الحجز</div>
                <div style="font-size:13px;opacity:.9;margin-top:6px;">تمت عملية التأكيد بنجاح</div>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:24px 28px;color:#111827;line-height:1.8;">
                <p style="margin:0 0 12px 0;font-size:16px;">
                  أهلاً ${fullName},
                </p>
                <p style="margin:0 0 12px 0;font-size:15px;">
                  تم <strong>تأكيد حجزك</strong> في الكورس التالي:
                </p>

                <div style="margin:12px 0 16px 0;padding:14px 16px;background:#f3f4f6;border-radius:12px;border:1px solid #e5e7eb;">
                  <div style="font-size:18px;font-weight:700;">${course}</div>
                </div>

                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:12px 0;">
                  <tr>
                    <td style="padding:6px 0;font-size:14px;">
                      📅 تاريخ البدء: <strong>${new Date().toLocaleDateString("ar-EG")}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:14px;">
                      🧑‍🏫 الانستراكتور: <strong>${instructor}</strong>
                    </td>
                  </tr>
                </table>
                <p style="margin:16px 0 0 0;font-size:14px;color:#374151;">
                  لو لديك أي استفسار، يكفّي ترد على هذه الرسالة.
                </p>
                <p style="margin:16px 0 0 0;font-size:12px;color:#6b7280;text-align:center;">
                  رقم الحجز: <strong>${bookCode}</strong>
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="padding:18px 24px;background:#fafafa;border-top:1px solid #eee;color:#6b7280;font-size:12px;text-align:center;">
                © 2025 منصّة Coursera — جميع الحقوق محفوظة.
                <br />
                إذا لم تكن تتوقع هذه الرسالة، يمكنك تجاهلها بأمان.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

  `;
  emittir.emit("sendemail", { to: email, subject: "confirmation Booking", html });
};

const bookingCancel = async ({email}) => {
  const html = `
<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>تعذر إتمام الحجز</title>
    <style>
      @media (max-width: 600px) {
        .container { width: 100% !important; padding: 16px !important; }
        .btn { display: block !important; width: 100% !important; }
      }
    </style>
  </head>
  <body style="margin:0;background:#f6f7fb;font-family:Tahoma, Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f6f7fb;">
      <tr>
        <td align="center" style="padding:24px;">
          <table role="presentation" width="600" class="container" cellspacing="0" cellpadding="0" border="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
            
            <!-- Header -->
            <tr>
              <td align="center" style="background:#ef4444;color:#ffffff;padding:24px 20px;">
                <div style="font-size:20px;font-weight:700;">لم يتم إتمام الحجز</div>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:24px 28px;color:#111827;line-height:1.8;">
                <p style="margin:0 0 12px 0;font-size:16px;">
                  أهلاً {{fullName}},
                </p>
                <p style="margin:0 0 12px 0;font-size:15px;">
                  نأسف لإبلاغك أنه لم يتم <strong>إتمام حجزك</strong> في الكورس التالي:
                </p>
                <div style="margin:12px 0 16px 0;padding:14px 16px;background:#fef2f2;border-radius:12px;border:1px solid #fee2e2;">
                  <div style="font-size:18px;font-weight:700;color:#b91c1c;">{{courseName}}</div>
                </div>
                <p style="margin:12px 0;font-size:14px;color:#374151;">
                  السبب: واجهنا مشكلة في عملية تحويل الرسوم الخاصة بالحجز.
                </p>
                <p style="margin:12px 0;font-size:14px;color:#374151;">
                  نرجو إعادة المحاولة مرة أخرى باستخدام وسيلة دفع مختلفة أو التأكد من التحويل .
                </p>
                <div style="text-align:center;margin:22px 0 6px 0;">
                  <a href="{{retryUrl}}" class="btn"
                     style="background:#ef4444;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:10px;display:inline-block;font-weight:700;">
                    إعادة المحاولة
                  </a>
                </div>
                <p style="margin:16px 0 0 0;font-size:14px;color:#374151;">
                  في حال استمرت المشكلة، لا تتردد بالتواصل معنا عبر البريد أو الهاتف لمساعدتك.
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="padding:18px 24px;background:#fafafa;border-top:1px solid #eee;color:#6b7280;font-size:12px;text-align:center;">
                © 2025 منصّة coursera — جميع الحقوق محفوظة.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

  `;
  emittir.emit("sendemail", { to: email, subject: "confirmation Booking", html });
};
export { SendEmail,createAndSendOTP,createAndSendOTP_Password,bookingCancel,bookingDone};
