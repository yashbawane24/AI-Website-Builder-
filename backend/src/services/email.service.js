// ============================================
// Email Service
// ============================================
// Nodemailer-based email sending for verification
// and password reset. Works with any SMTP provider.

const nodemailer = require('nodemailer');
const env = require('../config/env');

// Create reusable transporter
let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }
  return transporter;
};

/**
 * Send verification email
 * @param {string} to - Recipient email
 * @param {string} name - User's name
 * @param {string} token - Verification token
 */
const sendVerificationEmail = async (to, name, token) => {
  const verifyUrl = `${env.FRONTEND_URL}/verify-email?token=${token}`;

  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:'Segoe UI',Arial,sans-serif;background:#0a0a0f;color:#e2e8f0;padding:40px;border-radius:16px;">
      <div style="text-align:center;margin-bottom:32px;">
        <h1 style="background:linear-gradient(135deg,#7c3aed,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:28px;margin:0;">
          AI Website Builder
        </h1>
      </div>
      <h2 style="color:#f1f5f9;font-size:22px;">Welcome, ${name}! 🎉</h2>
      <p style="color:#94a3b8;line-height:1.6;font-size:16px;">
        Thanks for signing up. Please verify your email address to get started building amazing websites with AI.
      </p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${verifyUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:white;text-decoration:none;border-radius:12px;font-weight:600;font-size:16px;">
          Verify Email Address
        </a>
      </div>
      <p style="color:#64748b;font-size:14px;">
        This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
      </p>
      <hr style="border:none;border-top:1px solid #1e293b;margin:32px 0;" />
      <p style="color:#475569;font-size:12px;text-align:center;">
        © ${new Date().getFullYear()} AI Website Builder. All rights reserved.
      </p>
    </div>
  `;

  try {
    await getTransporter().sendMail({
      from: env.EMAIL_FROM,
      to,
      subject: 'Verify your email — AI Website Builder',
      html,
    });
  } catch (err) {
    console.error('Email send error:', err.message);
    // Don't throw — email failure shouldn't block registration
  }
};

/**
 * Send password reset email
 * @param {string} to - Recipient email
 * @param {string} name - User's name
 * @param {string} token - Reset token
 */
const sendPasswordResetEmail = async (to, name, token) => {
  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;

  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:'Segoe UI',Arial,sans-serif;background:#0a0a0f;color:#e2e8f0;padding:40px;border-radius:16px;">
      <div style="text-align:center;margin-bottom:32px;">
        <h1 style="background:linear-gradient(135deg,#7c3aed,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:28px;margin:0;">
          AI Website Builder
        </h1>
      </div>
      <h2 style="color:#f1f5f9;font-size:22px;">Password Reset Request</h2>
      <p style="color:#94a3b8;line-height:1.6;font-size:16px;">
        Hi ${name}, we received a request to reset your password. Click the button below to set a new password.
      </p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${resetUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:white;text-decoration:none;border-radius:12px;font-weight:600;font-size:16px;">
          Reset Password
        </a>
      </div>
      <p style="color:#64748b;font-size:14px;">
        This link expires in 1 hour. If you didn't request a password reset, please ignore this email.
      </p>
      <hr style="border:none;border-top:1px solid #1e293b;margin:32px 0;" />
      <p style="color:#475569;font-size:12px;text-align:center;">
        © ${new Date().getFullYear()} AI Website Builder. All rights reserved.
      </p>
    </div>
  `;

  try {
    await getTransporter().sendMail({
      from: env.EMAIL_FROM,
      to,
      subject: 'Reset your password — AI Website Builder',
      html,
    });
  } catch (err) {
    console.error('Email send error:', err.message);
  }
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
