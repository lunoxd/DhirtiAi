const { Resend } = require("resend");

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

/**
 * Sends a 6-digit Email / Gmail Verification OTP via Resend.com
 * @param {string} email Target recipient email/gmail
 * @param {string} otpCode 6-digit numerical OTP code
 */
async function sendVerificationOTP(email, otpCode) {
  console.log(`[EmailService] Preparing OTP verification email for ${email}...`);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>DHRITI Gmail Verification Code</title>
      <style>
        body { background-color: #313338; color: #dbdee1; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; margin: 0; padding: 24px; }
        .card { background-color: #2b2d31; border: 1px solid #3f4147; border-radius: 12px; max-width: 500px; margin: 0 auto; padding: 32px; text-align: center; }
        .logo { font-size: 24px; font-weight: 800; color: #ffffff; margin-bottom: 8px; }
        .title { font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 16px; }
        .otp-box { background-color: #1e1f22; border: 2px dashed #f0b232; border-radius: 8px; font-size: 36px; font-weight: 800; color: #f0b232; letter-spacing: 6px; padding: 16px 24px; margin: 24px 0; display: inline-block; }
        .muted { font-size: 13px; color: #949ba4; margin-top: 16px; line-height: 1.5; }
        .footer { font-size: 11px; color: #80848e; margin-top: 32px; border-top: 1px solid #3f4147; padding-top: 16px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">Dhriti</div>
        <div class="title">Gmail Verification Code</div>
        <p>Please enter the 6-digit code below to verify your email address and secure your account.</p>
        
        <div class="otp-box">${otpCode}</div>

        <p class="muted">
          This code is valid for <strong>10 minutes</strong>. If you did not request this verification, please ignore this email.
        </p>

        <div class="footer">
          DHRITI • AI-Assisted Mental Wellbeing Monitoring & Early Distress Support
        </div>
      </div>
    </body>
    </html>
  `;

  if (!resend) {
    console.warn(`[EmailService] RESEND_API_KEY environment variable not set. OTP Code: ${otpCode}`);
    return { success: true, fallback: true, otpCode };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "DHRITI Verification <onboarding@resend.dev>",
      to: [email],
      subject: `[DHRITI] Your Gmail Verification Code: ${otpCode}`,
      html: htmlContent
    });

    if (error) {
      console.warn(`[EmailService] Resend API Notice: ${error.message}`);
      return { success: true, resendError: error, otpCode };
    }

    console.log(`[EmailService] Resend email dispatched successfully:`, data);
    return { success: true, resendId: data?.id, otpCode };
  } catch (error) {
    console.warn(`[EmailService] Resend API Error (${error.message}). OTP:`, otpCode);
    return { success: true, fallback: true, otpCode };
  }
}

module.exports = {
  sendVerificationOTP
};
