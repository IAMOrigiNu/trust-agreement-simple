import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Resend } from 'resend';
import PDFDocument from 'pdfkit';
import { Buffer } from 'buffer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3500;

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// Trust components data (matching client-side)
const trustComponents = [
    {
        id: 'eli_trust',
        title: "Eli's Individual Trust Package",
        description: 'Personal asset protection and estate planning structure',
        services: [
            'Revocable living trust with irrevocable provisions',
            'Pour-over will',
            'Financial and healthcare power of attorney',
            'Advanced healthcare directive',
            'Asset re-titling strategy'
        ]
    },
    {
        id: 'carmen_trust',
        title: "Carmen's Individual Trust Package",
        description: 'Personal asset protection with business integration',
        services: [
            'Revocable living trust with business provisions',
            'Pour-over will',
            'Financial and healthcare power of attorney',
            'Advanced healthcare directive',
            'Asset re-titling strategy'
        ]
    },
    {
        id: 'family_church',
        title: 'Family Church Establishment',
        description: 'Two or more members with four minimum signatories',
        services: [
            'Family church bylaws and constitution',
            'Example officer roles and responsibilities'
        ]
    },
    {
        id: 'nevada_nonprofit',
        title: 'Nevada Non-Profit Set Up',
        description: 'Tax-exceptional entity with asset protection',
        services: [
            'Nevada non-profit registration',
            'Trust resolution (PMA doing business as Nevada non-profit)',
            'Trusted Registered Agent List'
        ]
    },
    {
        id: 'ny_llc',
        title: 'New York LLC Structure',
        description: 'Member-owned LLC with Nevada non-profit as single member',
        services: [
            'NY LLC formation documents',
            'Operating agreement (Nevada non-profit as single member)',
            'Manager appointment (Eli and Carmen as managers)'
        ]
    },
    {
        id: 'pma',
        title: 'Private Member Association (PMA)',
        description: 'Private operating structure with enhanced protection',
        services: [
            'PMA formation documents',
            'Membership agreement and NDA',
            'Operating procedures',
            'Commercial property protocols'
        ]
    },
    {
        id: 'trust_banking',
        title: 'Trust Banking Setup',
        description: 'Compliant banking relationships for all trust entities',
        services: [
            'Instructions for opening bank accounts',
            'Instructions for EIN Acquisition for All Entities',
            'Banking resolution documents',
            'Substitute W-9 forms'
        ]
    },
    {
        id: 'tax_exemption',
        title: 'Tax Exemption & Compliance',
        description: 'County, state, and federal level exemptions',
        services: [
            'Religious organization property exemptions'
        ]
    },
    {
        id: 'education',
        title: 'Education & Training',
        description: 'IRS Trust Primer-based education and training',
        services: [
            'Form 1099 training (NEC vs MISC)',
            'Trust accounting principles',
            'Fiduciary responsibilities',
            'Trust operation protocols',
            'Compliance monitoring'
        ]
    }
];

// Service descriptions
const serviceDescriptions = {
    'Revocable living trust with irrevocable provisions': 'A flexible trust structure that can be modified during your lifetime while including specific irrevocable clauses for asset protection and tax benefits.',
    'Pour-over will': 'A safety net document that transfers any assets not already in your trust into the trust upon death, ensuring comprehensive estate coverage.',
    'Financial and healthcare power of attorney': 'Legal authorization for a trusted person to make financial and medical decisions on your behalf if you become incapacitated.',
    'Advanced healthcare directive': 'Your written instructions specifying medical treatment preferences and end-of-life care decisions when you cannot communicate them yourself.',
    'Asset re-titling strategy': 'Systematic plan to transfer ownership of your assets (real estate, accounts, vehicles) from personal name into trust name for protection and probate avoidance.',
    'Revocable living trust with business provisions': 'A trust designed to hold both personal and business assets, with special provisions for business succession and operational continuity.',
    'Family church bylaws and constitution': 'Governing documents establishing the organizational structure, membership requirements, and operational procedures of your family church.',
    'Example officer roles and responsibilities': 'Template descriptions of key church positions (pastor, treasurer, secretary, trustees) with clearly defined duties and authority levels.',
    'Nevada non-profit registration': 'Process to register your religious organization as a Nevada non-profit entity, gaining state recognition and liability protection.',
    'Trust resolution (PMA doing business as Nevada non-profit)': 'Formal trust resolution establishing that the Private Member Association operates under the Nevada non-profit structure for legal and tax purposes.',
    'Trusted Registered Agent List': 'Vetted list of professional registered agents in Nevada who can receive legal documents and maintain your entity\'s good standing.',
    'NY LLC formation documents': 'Articles of organization and initial filings to establish your New York limited liability company with the state.',
    'Operating agreement (Nevada non-profit as single member)': 'Legal document specifying that the Nevada non-profit is the sole member/owner of the LLC, establishing ownership structure.',
    'Manager appointment (Eli and Carmen as managers)': 'Formal designation of Eli and Carmen as LLC managers with operational authority but no ownership interest.',
    'PMA formation documents': 'Foundational paperwork establishing your private membership association, including declaration of purpose and member rights.',
    'Membership agreement and NDA': 'Contract defining member obligations, benefits, and confidentiality requirements to maintain the private nature of your association.',
    'Operating procedures': 'Internal guidelines governing how your PMA conducts business, admits members, and maintains privacy protections.',
    'Commercial property protocols': 'Specialized procedures for managing commercial real estate within the PMA structure, including lease agreements and property management authority.',
    'Instructions for opening bank accounts': 'Step-by-step guide for opening bank accounts for your entities, including required documentation and procedures for compliant financial institutions.',
    'Instructions for EIN Acquisition for All Entities': 'Complete guide to obtaining Employer Identification Numbers from the IRS for your trust, church, non-profit, and other entities.',
    'Banking resolution documents': 'Official resolutions authorizing specific individuals to open accounts, sign checks, and conduct banking transactions on behalf of each entity.',
    'Substitute W-9 forms': 'IRS Form W-9 equivalents for entities claiming tax-exempt status, providing taxpayer identification to financial institutions.',
    'Religious organization property exemptions': 'Applications and procedures to claim property tax exemptions for real estate used for religious purposes in your jurisdiction.',
    'Form 1099 training (NEC vs MISC)': 'Detailed instruction on when and how to issue 1099-NEC for non-employee compensation versus 1099-MISC for other payments from your trust.',
    'Trust accounting principles': 'Fundamental bookkeeping methods for tracking trust income, expenses, distributions, and maintaining separation between personal and trust finances.',
    'Fiduciary responsibilities': 'Legal duties and obligations of trustees, including loyalty, prudence, impartiality, and accountability in managing trust assets.',
    'Trust operation protocols': 'Standard procedures for conducting trust business, holding meetings, documenting decisions, and maintaining proper trust administration records.',
    'Compliance monitoring': 'Ongoing systems to track filing deadlines, renewal dates, and regulatory requirements to prevent lapses in tax-exempt status or entity standing.'
};

// Generate PDF
function generatePDF(formData) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData.toString('base64'));
        });
        doc.on('error', reject);
        
        // Header
        doc.fontSize(24).fillColor('#8b6f47').text('Trust Launch Agreement', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).fillColor('#666').text(`Date: ${new Date(formData.submittedAt).toLocaleDateString()}`, { align: 'center' });
        doc.moveDown(2);
        
        // Contact Information
        doc.fontSize(16).fillColor('#8b6f47').text('Contact Information');
        doc.moveDown(0.5);
        doc.fontSize(11).fillColor('#000')
            .text(`Name: ${formData.fullName}`)
            .text(`Email: ${formData.email}`)
            .text(`Phone: ${formData.phone}`)
            .text(`Address: ${formData.address}`);
        doc.moveDown(2);
        
        // Selected Services
        doc.fontSize(16).fillColor('#8b6f47').text('Selected Services');
        doc.moveDown(0.5);
        
        trustComponents.forEach(component => {
            let hasServices = false;
            const componentServices = [];
            
            component.services.forEach((service, index) => {
                const serviceId = `${component.id}_${index}`;
                if (formData.selectedServices[serviceId]) {
                    hasServices = true;
                    componentServices.push(service);
                }
            });
            
            if (hasServices) {
                doc.fontSize(13).fillColor('#2563eb').text(component.title);
                doc.fontSize(10).fillColor('#666').text(component.description);
                doc.moveDown(0.3);
                
                componentServices.forEach(service => {
                    doc.fontSize(11).fillColor('#000').text(`• ${service}`, { indent: 20 });
                    const description = serviceDescriptions[service];
                    if (description) {
                        doc.fontSize(9).fillColor('#666').text(description, { indent: 30, width: 480 });
                        doc.moveDown(0.3);
                    }
                });
                doc.moveDown(1);
            }
        });
        
        // Custom Requirements
        if (formData.customRequirements) {
            doc.fontSize(16).fillColor('#8b6f47').text('Custom Requirements');
            doc.moveDown(0.5);
            doc.fontSize(11).fillColor('#000').text(formData.customRequirements, { width: 480 });
            doc.moveDown(2);
        }
        
        // Add new page for disclaimers
        doc.addPage();
        
        // Disclaimer
        doc.fontSize(16).fillColor('#8b6f47').text('DISCLAIMER');
        doc.moveDown(0.5);
        doc.fontSize(11).fillColor('#000')
            .text('No Legal or Financial Advice: ', { continued: true, underline: true })
            .text('The services provided under this agreement are offered in a ministerial capacity only. Ocasio Ak-Bar Saleem Willson does not provide legal advice, financial advice, or any professional services requiring licensure. All information, documents, and guidance provided are for educational and organizational purposes only. Parties are encouraged to consult with licensed attorneys, CPAs, and financial advisors for professional advice specific to their circumstances.', { underline: false });
        doc.moveDown(2);
        
        // Compensation
        doc.fontSize(16).fillColor('#20b2aa').text('COMPENSATION');
        doc.moveDown(0.5);
        doc.fontSize(11).fillColor('#000')
            .text('Compensation for services rendered under this agreement is structured as a voluntary donation based on perceived value under trust to Ocasio Ak-Bar Saleem Willson on behalf of The Most High.');
        doc.moveDown(3);
        
        // Signature
        doc.fontSize(16).fillColor('#8b6f47').text('Digital Signature');
        doc.moveDown(0.5);
        
        // Add signature image
        try {
            const signatureBase64 = formData.signature.split('base64,')[1];
            const signatureBuffer = Buffer.from(signatureBase64, 'base64');
            doc.image(signatureBuffer, { width: 200, height: 100 });
        } catch (err) {
            console.error('Error adding signature to PDF:', err);
            doc.text('[Signature could not be embedded]');
        }
        
        doc.moveDown(1);
        doc.fontSize(11).fillColor('#000')
            .text(`Signed by: ${formData.fullName}`)
            .text(`Date: ${new Date(formData.submittedAt).toLocaleDateString()}`);
        
        doc.end();
    });
}

// API endpoint for form submission
app.post('/api/submit', async (req, res) => {
    try {
        const formData = req.body;
        
        console.log('Received submission from:', formData.fullName);
        console.log('User:', formData.user);
        console.log('Email:', formData.email);
        
        // Generate PDF
        const pdfBase64 = await generatePDF(formData);
        
        // Format selected services for email
        let servicesHTML = '';
        
        trustComponents.forEach(component => {
            let componentServices = [];
            component.services.forEach((service, index) => {
                const serviceId = `${component.id}_${index}`;
                if (formData.selectedServices[serviceId]) {
                    componentServices.push(service);
                }
            });
            
            if (componentServices.length > 0) {
                servicesHTML += `
                    <div style="margin: 20px 0;">
                        <h4 style="color: #2563eb; margin-bottom: 10px;">${component.title}</h4>
                        <p style="color: #666; font-size: 0.9em; margin-bottom: 10px;">${component.description}</p>
                        <ul style="margin-left: 20px;">
                            ${componentServices.map(s => `<li>${s}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }
        });
        
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
            <em>Complete agreement with signature is attached as a PDF.</em>
        </p>
    </div>
</body>
</html>
        `;
        
        // Send email via Resend
        const { data, error } = await resend.emails.send({
            from: 'Trust Agreement <onboarding@resend.dev>',
            to: ['ocasiowillson@protonmail.com'],
            subject: `Trust Agreement Submission - ${formData.fullName}`,
            html: emailHTML,
            attachments: [
                {
                    filename: `Trust_Agreement_${formData.user}_${Date.now()}.pdf`,
                    content: pdfBase64
                }
            ]
        });
        
        if (error) {
            console.error('Resend error:', error);
            throw new Error(error.message);
        }
        
        console.log('Email sent successfully via Resend:', data);
        
        // Return PDF to client for download
        res.json({ 
            success: true, 
            message: 'Agreement submitted successfully',
            pdf: pdfBase64
        });
        
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

