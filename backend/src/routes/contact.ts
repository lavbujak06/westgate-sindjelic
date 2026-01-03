import express from 'express';
import nodemailer from 'nodemailer';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store file in RAM temporarily

// Configure your "Sender" (Use a Gmail App Password or SendGrid)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

router.post('/', upload.single('attachment'), async (req: any, res) => {
  const { name, email, phone, category, date, message, honeypot } = req.body;

  // 1. Honeypot check: If this hidden field is filled, it's a bot.
  if (honeypot) {
    return res.status(400).json({ message: "Bot detected" });
  }

  try {
    const mailOptions: any = {
      from: process.env.EMAIL_USER,
      to: 'bujaklav@gmail.com', // Destination email
      replyTo: email, // When you hit 'Reply' in your inbox, it goes to the user
      subject: `[${category}] New Inquiry from ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Relevant Date:</strong> ${date || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    // 2. Add attachment if it exists
    if (req.file) {
      mailOptions.attachments = [{
        filename: req.file.originalname,
        content: req.file.buffer
      }];
    }

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

export default router;