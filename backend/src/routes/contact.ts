import { Request, Response, Router } from 'express';
import nodemailer from 'nodemailer';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { validate } from '../middleware/validate';
import { contactSchema } from '../schemas/authSchema';

const router = Router();

// Rate limit of max 5 tries
const contactLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 5,
  message: { error: "Daily limit reached. Try again tomorrow." },
  standardHeaders: true,
  legacyHeaders: false,
});

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 24 * 1024 * 1024 }
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

router.post('/', contactLimit, upload.array('attachments', 10), validate(contactSchema), async (req: Request, res: Response) => {
  const { name, email, phone, category, date, message, honeypot } = req.body;
  const files = req.files as Express.Multer.File[]; 

  if (files && files.length > 0) {
    const totalSize = files.reduce((acc, f) => acc + f.size, 0);
    if (totalSize > 24 * 1024 * 1024) {
      return res.status(400).json({ message: "Total attachments too large (Max 24MB)" });
    }
  }

  if (honeypot) return res.status(400).json({ message: "Bot detected" });

  try {
    const mailOptions = {
      from: `"WSFC Portal" <${process.env.EMAIL_USER}>`,
      to: 'bujaklav@gmail.com',
      replyTo: email,
      subject: `TECHNICAL INQUIRY: ${category.toUpperCase()} / ${name.toUpperCase()}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.5;">
          <div style="padding: 40px 0; text-align: left; border-bottom: 2px solid #f1f5f9;">
            <h1 style="font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: -0.025em; margin: 0; color: #0f172a;">
              Inquiry <span style="color: #dc2626;">Report</span>
            </h1>
            <p style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin: 4px 0 0 0;">
              Westgate Sindjelic Technical Department
            </p>
          </div>

          <div style="padding: 32px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; width: 35%;">From</td>
                <td style="padding: 8px 0; font-size: 14px; color: #1e293b; font-weight: 500;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Email</td>
                <td style="padding: 8px 0; font-size: 14px; color: #1e293b; font-weight: 500;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Phone</td>
                <td style="padding: 8px 0; font-size: 14px; color: #1e293b; font-weight: 500;">${phone || 'Not Specified'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Classification</td>
                <td style="padding: 8px 0; font-size: 14px; color: #dc2626; font-weight: 700;">${category}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Filing Date</td>
                <td style="padding: 8px 0; font-size: 14px; color: #1e293b; font-weight: 500;">${date || 'No date specified'}</td>
              </tr>
            </table>
          </div>

          <div style="padding: 32px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #f1f5f9;">
            <h2 style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin: 0 0 16px 0;">Subject Message</h2>
            <div style="font-size: 15px; color: #334155; white-space: pre-wrap; line-height: 1.6;">${message}</div>
          </div>

          <div style="padding: 40px 0; border-top: 1px solid #f1f5f9; margin-top: 40px; text-align: center;">
            <p style="font-size: 10px; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">
              Confidential Communication — System Generated — ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>
        </div>
      `,
      attachments: files?.map((file) => ({
        filename: file.originalname,
        content: file.buffer
      }))
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email" });
  }
});


router.post('/system-alert', async (req: Request, res: Response) => {
  const { db, storage } = req.body;

  try {
    const mailOptions = {
      from: `"SYSTEM SENTINEL"`,
      to: 'bujaklav@gmail.com',
      subject: `⚠️ CAPACITY ALERT: WESTGATE SINDJELIC PROJECT`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 18px; text-transform: uppercase;">Storage Limit Warning</h1>
          </div>
          <div style="padding: 30px;">
            <p>Admin, your project is approaching the <strong>Supabase Free Tier</strong> limits.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Database (500MB Limit)</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: right; color: ${db > 400 ? '#dc2626' : '#1e293b'}">${db} MB</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Storage (1024MB Limit)</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: right; color: ${storage > 800 ? '#dc2626' : '#1e293b'}">${storage} MB</td>
              </tr>
            </table>
            <p style="font-size: 12px; color: #64748b;">This alert was triggered by an Admin login on the dashboard.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Alert Sent" });
  } catch (error) {
    console.error("Alert Route Error:", error);
    res.status(500).json({ error: "Failed to send alert" });
  }
});

export default router;