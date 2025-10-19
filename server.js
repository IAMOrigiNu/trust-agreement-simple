import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Resend } from 'resend';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3500;

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// API endpoint for form submission
app.post('/api/submit', async (req, res) => {
    try {
        const formData = req.body;
        
        console.log('Received submission from:', formData.fullName);
        console.log('User:', formData.user);
        console.log('Email:', formData.email);
        
        // Format selected services for email
        let servicesHTML = '<ul>';
        for (const [key, value] of Object.entries(formData.selectedServices)) {
            if (value) {
                servicesHTML += `<li>${key}</li>`;
            }
        }
        servicesHTML += '</ul>';
        
        // Email HTML content
        const emailHTML = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #f5e6d3 0%, #d4a574 50%, #87ceeb 100%); padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .section { margin: 20px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #8b6f47; }
        h2 { color: #8b6f47; }
        h3 { color: #20b2aa; margin-top: 20px; }
        ul { margin: 10px 0; }
        li { margin: 5px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Trust Launch Agreement Submission</h1>
    </div>
    <div class="content">
        <div class="section">
            <p><strong>Submitted by:</strong> ${formData.fullName}</p>
            <p><strong>User:</strong> ${formData.user === 'eli' ? 'Eli' : 'Carmen'}</p>
            <p><strong>Date:</strong> ${new Date(formData.submittedAt).toLocaleString()}</p>
        </div>
        
        <h3>📋 Contact Information</h3>
        <div class="section">
            <p><strong>Name:</strong> ${formData.fullName}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Phone:</strong> ${formData.phone}</p>
            <p><strong>Address:</strong> ${formData.address}</p>
        </div>
        
        <h3>🔒 Selected Services</h3>
        <div class="section">
            ${servicesHTML}
        </div>
        
        ${formData.customRequirements ? `
        <h3>✍️ Custom Requirements</h3>
        <div class="section">
            <p>${formData.customRequirements}</p>
        </div>
        ` : ''}
        
        <p style="margin-top: 30px; color: #666;">
            <em>Digital signature is attached as a PNG image.</em>
        </p>
    </div>
</body>
</html>
        `;
        
        // Convert signature to attachment
        const signatureBase64 = formData.signature.split('base64,')[1];
        
        // Send email via Resend
        const { data, error } = await resend.emails.send({
            from: 'Trust Agreement <onboarding@resend.dev>',
            to: ['ocasiowillson@gmail.com'],
            subject: `Trust Agreement Submission - ${formData.fullName}`,
            html: emailHTML,
            attachments: [
                {
                    filename: `signature-${formData.user}-${Date.now()}.png`,
                    content: signatureBase64
                }
            ]
        });
        
        if (error) {
            console.error('Resend error:', error);
            throw new Error(error.message);
        }
        
        console.log('Email sent successfully via Resend:', data);
        res.json({ success: true, message: 'Agreement submitted successfully' });
        
    } catch (error) {
        console.error('Submission error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error submitting agreement: ' + error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Trust Agreement Customizer running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
});

