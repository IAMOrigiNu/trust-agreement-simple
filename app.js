// Trust Components Data
const trustComponents = [
    {
        id: 'eli_individual',
        title: "Eli's Individual Trust Package",
        description: "Personal asset protection and estate planning structure",
        category: 'Individual Estate Planning',
        services: [
            'Revocable living trust with irrevocable provisions',
            'Pour-over will',
            'Financial and healthcare power of attorney',
            'Advanced healthcare directive',
            'Asset re-titling strategy'
        ]
    },
    {
        id: 'carmen_individual',
        title: "Carmen's Individual Trust Package",
        description: "Personal asset protection with business integration",
        category: 'Individual Estate Planning',
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
        category: 'Ministry Trust Organization',
        services: [
            'Family church bylaws and constitution',
            'Example officer roles and responsibilities'
        ]
    },
    {
        id: 'nevada_nonprofit',
        title: 'Nevada Non-Profit Set Up',
        description: 'Tax-exceptional entity with asset protection',
        category: 'Ministry Trust Organization',
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
        category: 'Ministry Trust Organization',
        services: [
            'NY LLC formation documents',
            'Operating agreement (Nevada non-profit as single member)',
            'Manager appointment (Eli and Carmen as managers)'
        ]
    },
    {
        id: 'private_member_association',
        title: 'Private Member Association (PMA)',
        description: 'Private operating structure with enhanced protection',
        category: 'Ministry Trust Organization',
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
        category: 'Banking & Financial Infrastructure',
        services: [
            'Instructions for opening bank accounts',
            'Instructions for EIN Acquisition for All Entities',
            'Banking resolution documents',
            'Substitute W-9 forms'
        ]
    },
    {
        id: 'tax_exemptions',
        title: 'Tax Exemption & Compliance',
        description: 'County, state, and federal level exemptions',
        category: 'Tax Exemption & Compliance',
        services: [
            'Religious organization property exemptions'
        ]
    },
    {
        id: 'education_training',
        title: 'Education & Training',
        description: 'IRS Trust Primer-based education and training',
        category: 'Education & Training',
        services: [
            'Form 1099 training (NEC vs MISC)',
            'Trust accounting principles',
            'Fiduciary responsibilities',
            'Trust operation protocols',
            'Compliance monitoring'
        ]
    }
];

// Service Descriptions
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
    'Banking resolution documents': 'Official trust resolutions authorizing specific individuals to open accounts, sign checks, and conduct banking transactions on behalf of the trust.',
    'Substitute W-9 forms': 'IRS Form W-9 alternatives for trusts and churches claiming tax-exempt status, providing correct taxpayer identification to financial institutions.',
    'Religious organization property exemptions': 'Applications and procedures to claim property tax exemptions for real estate used for religious purposes in your jurisdiction.',
    'Form 1099 training (NEC vs MISC)': 'Detailed instruction on when and how to issue 1099-NEC for non-employee compensation versus 1099-MISC for other payments from your trust.',
    'Trust accounting principles': 'Fundamental bookkeeping methods for tracking trust income, expenses, distributions, and maintaining separation between personal and trust finances.',
    'Fiduciary responsibilities': 'Legal duties and obligations of trustees, including loyalty, prudence, impartiality, and accountability in managing trust assets.',
    'Trust operation protocols': 'Standard procedures for conducting trust business, holding meetings, documenting decisions, and maintaining proper trust administration records.',
    'Compliance monitoring': 'Ongoing systems to track filing deadlines, renewal dates, and regulatory requirements to prevent lapses in tax-exempt status or entity standing.'
};

// Global state
let currentUser = '';
let selectedServices = {};
let signatureData = '';

// Initialize signature canvas
let canvas, ctx, isDrawing = false;

function selectUser(user) {
    currentUser = user;
    document.getElementById('userSelection').style.display = 'none';
    document.getElementById('formSection').classList.add('active');
    
    const userName = user === 'eli' ? 'Eli' : 'Carmen';
    
    document.getElementById('welcomeMessage').textContent = `Welcome, ${userName}!`;
    document.getElementById('fullName').value = userName;
    
    renderComponents();
}

function backToUserSelection() {
    document.getElementById('formSection').classList.remove('active');
    document.getElementById('userSelection').style.display = 'flex';
    currentUser = '';
    selectedServices = {};
}

function renderComponents() {
    const container = document.getElementById('componentsContainer');
    container.innerHTML = '';
    
    trustComponents.forEach(component => {
        const componentDiv = document.createElement('div');
        componentDiv.className = 'component';
        
        let servicesHTML = '';
        component.services.forEach((service, index) => {
            const serviceId = `${component.id}_${index}`;
            const description = serviceDescriptions[service] || '';
            
            servicesHTML += `
                <div class="service-item">
                    <div class="service-header">
                        <input type="checkbox" id="${serviceId}" onchange="toggleService('${serviceId}')">
                        <label class="service-name" for="${serviceId}">${service}</label>
                        <span class="info-icon" onclick="toggleDescription('${serviceId}_desc')">ℹ️</span>
                    </div>
                    <div id="${serviceId}_desc" class="service-description">${description}</div>
                </div>
            `;
        });
        
        componentDiv.innerHTML = `
            <div class="component-header">
                <div class="component-title">${component.title}</div>
            </div>
            <div class="component-description">${component.description}</div>
            ${servicesHTML}
        `;
        
        container.appendChild(componentDiv);
    });
}

function toggleService(serviceId) {
    const checkbox = document.getElementById(serviceId);
    selectedServices[serviceId] = checkbox.checked;
}

function toggleDescription(descId) {
    const desc = document.getElementById(descId);
    desc.classList.toggle('visible');
}

function previewAgreement() {
    // Validate form
    const form = document.getElementById('trustForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Generate preview
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const customRequirements = document.getElementById('customRequirements').value;
    
    let selectedServicesHTML = '<h3 style="color: #8b6f47; margin-top: 30px;">Selected Services:</h3>';
    
    trustComponents.forEach(component => {
        let componentServices = [];
        component.services.forEach((service, index) => {
            const serviceId = `${component.id}_${index}`;
            if (selectedServices[serviceId]) {
                componentServices.push(service);
            }
        });
        
        if (componentServices.length > 0) {
            selectedServicesHTML += `
                <div style="margin: 20px 0;">
                    <h4 style="color: #2563eb; margin-bottom: 10px;">${component.title}</h4>
                    <ul style="margin-left: 20px;">
                        ${componentServices.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
    });
    
    const previewHTML = `
        <div style="line-height: 1.8;">
            <h3 style="color: #8b6f47; text-align: center; margin-bottom: 20px;">Trust Launch Agreement</h3>
            <p style="text-align: center; margin-bottom: 30px;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            
            <h4 style="color: #8b6f47; margin-top: 25px;">Contact Information:</h4>
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Address:</strong> ${address}</p>
            
            ${selectedServicesHTML}
            
            ${customRequirements ? `
                <h4 style="color: #8b6f47; margin-top: 25px;">Custom Requirements:</h4>
                <p>${customRequirements}</p>
            ` : ''}
        </div>
    `;
    
    document.getElementById('previewContent').innerHTML = previewHTML;
    document.getElementById('formSection').classList.remove('active');
    document.getElementById('previewSection').classList.add('active');
    
    // Initialize signature canvas
    initSignatureCanvas();
}

function backToEdit() {
    document.getElementById('previewSection').classList.remove('active');
    document.getElementById('formSection').classList.add('active');
}

function initSignatureCanvas() {
    canvas = document.getElementById('signatureCanvas');
    ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch support
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
}

function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function draw(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 'mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function clearSignature() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

async function submitAgreement() {
    // Check if signature exists
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const hasSignature = imageData.data.some(channel => channel !== 0);
    
    if (!hasSignature) {
        alert('Please provide your signature before submitting.');
        return;
    }
    
    signatureData = canvas.toDataURL();
    
    // Collect all form data
    const formData = {
        user: currentUser,
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        customRequirements: document.getElementById('customRequirements').value,
        selectedServices: selectedServices,
        signature: signatureData,
        submittedAt: new Date().toISOString()
    };
    
    try {
        const response = await fetch('/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            alert('✅ Agreement submitted successfully! You will receive a confirmation email at ' + formData.email);
            // Reset and go back to user selection
            backToUserSelection();
        } else {
            alert('❌ There was an error submitting your agreement. Please try again.');
        }
    } catch (error) {
        console.error('Submission error:', error);
        alert('❌ There was an error submitting your agreement. Please try again.');
    }
}

