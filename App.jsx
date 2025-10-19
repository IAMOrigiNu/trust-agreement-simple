import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  FileText, 
  Users, 
  Building, 
  Shield, 
  DollarSign, 
  CheckCircle, 
  Download,
  Edit3,
  Signature,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Info,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import './App.css'
import { serviceDescriptions } from './serviceDescriptions'

export default function TrustAgreementCustomizer() {
  const [selectedComponents, setSelectedComponents] = useState({})
  const [selectedServices, setSelectedServices] = useState({})
  const [customizations, setCustomizations] = useState({})
  const [additionalServices, setAdditionalServices] = useState({})
  const [expandedServices, setExpandedServices] = useState({})
  const [currentUser, setCurrentUser] = useState('') // 'eli' or 'carmen'
  const [showUserSelection, setShowUserSelection] = useState(true)
  const [signatures, setSignatures] = useState({
    eli: '',
    carmen: '',
    ocasio: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [additionalComponents, setAdditionalComponents] = useState('')
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    partnerName: '',
    partnerEmail: '',
    partnerPhone: '',
    partnerAddress: ''
  })
  const [showPreview, setShowPreview] = useState(false)
  const signatureCanvasRef = useRef(null)

  const agreementComponents = [
    {
      id: 'eli_individual',
      title: "Eli's Individual Trust Package",
      description: "Personal asset protection and estate planning structure",
      category: 'Individual Estate Planning',
      icon: Users,
      included: [
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
      icon: Users,
      included: [
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
      icon: Building,
      included: [
        'Family church bylaws and constitution',
        'Example officer roles and responsibilities'
      ]
    },
    {
      id: 'nevada_nonprofit',
      title: 'Nevada Non-Profit Set Up',
      description: 'Tax-exceptional entity with asset protection',
      category: 'Ministry Trust Organization', 
      icon: Shield,
      included: [
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
      icon: Building,
      included: [
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
      icon: Shield,
      included: [
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
      icon: Building,
      included: [
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
      icon: DollarSign,
      included: [
        'Religious organization property exemptions'
      ]
    },
    {
      id: 'education_training',
      title: 'Education & Training',
      description: 'IRS Trust Primer-based education and training',
      category: 'Education & Training',
      icon: FileText,
      included: [
        'Form 1099 training (NEC vs MISC)',
        'Trust accounting principles',
        'Fiduciary responsibilities',
        'Trust operation protocols',
        'Compliance monitoring'
      ]
    }
  ]

  const handleComponentToggle = (componentId) => {
    setSelectedComponents(prev => ({
      ...prev,
      [componentId]: !prev[componentId]
    }))
  }

  const handleServiceToggle = (componentId, serviceIndex) => {
    const serviceKey = `${componentId}_${serviceIndex}`
    setSelectedServices(prev => ({
      ...prev,
      [serviceKey]: !prev[serviceKey]
    }))
  }

  const toggleServiceExpansion = (componentId, serviceIndex) => {
    const serviceKey = `${componentId}_${serviceIndex}`
    setExpandedServices(prev => ({
      ...prev,
      [serviceKey]: !prev[serviceKey]
    }))
  }

  const handleAdditionalServiceChange = (componentId, value) => {
    setAdditionalServices(prev => ({
      ...prev,
      [componentId]: value
    }))
  }

  const handleCustomizationChange = (componentId, value) => {
    setCustomizations(prev => ({
      ...prev,
      [componentId]: value
    }))
  }

  const handleSignatureChange = (person, value) => {
    setSignatures(prev => ({
      ...prev,
      [person]: value
    }))
  }

  const handleContactChange = (field, value) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleUserSelection = (user) => {
    setCurrentUser(user)
    setShowUserSelection(false)
    // Pre-populate names based on selection
    if (user === 'eli') {
      setContactInfo(prev => ({
        ...prev,
        name: 'Eli',
        partnerName: 'Carmen'
      }))
    } else {
      setContactInfo(prev => ({
        ...prev,
        name: 'Carmen',
        partnerName: 'Eli'
      }))
    }
  }

  const generateAgreement = () => {
    const selectedItems = agreementComponents.filter(comp => selectedComponents[comp.id])
    const today = new Date().toLocaleDateString()
    
    return `
# 3-MONTH TRUST LAUNCH PLAN AGREEMENT

**Between:** Ocasio Ak-Bar Saleem Willson Trust (Senior Minister, The Most High)  
**And:** ${contactInfo.name} and ${contactInfo.partnerName} (Individual and Collective Trust Establishment)  
**Completed by:** ${contactInfo.name}
**Date:** ${signatures.date}  
**Duration:** 90 days after initial launch meeting

---

## SELECTED COMPONENTS

${selectedItems.map(item => {
  const selectedItemServices = item.included.filter((_, index) => selectedServices[`${item.id}_${index}`])
  const customServices = additionalServices[item.id] || ''
  
  return `
### ${item.title}
**Category:** ${item.category}  
**Description:** ${item.description}

**Selected Services:**
${selectedItemServices.length > 0 ? selectedItemServices.map(service => {
  const desc = serviceDescriptions[service]
  return `- ${service}${desc ? `\n  *${desc}*` : ''}`
}).join('\n\n') : '- No standard services selected'}

${customServices ? `**Custom Services:**\n${customServices.split('\n').map(line => line.trim() ? `- ${line.trim()}` : '').filter(Boolean).join('\n')}` : ''}

${customizations[item.id] ? `**Additional Requirements:**\n${customizations[item.id]}` : ''}
`}).join('\n')}

${additionalComponents ? `
## ADDITIONAL COMPONENTS
${additionalComponents}
` : ''}

## CONTACT INFORMATION

**${contactInfo.name} (Form Completed By):**
- Email: ${contactInfo.email}
- Phone: ${contactInfo.phone}
- Address: ${contactInfo.address}

**${contactInfo.partnerName} (Partner Information):**
- Email: ${contactInfo.partnerEmail}
- Phone: ${contactInfo.partnerPhone}
- Address: ${contactInfo.partnerAddress}

## COMPENSATION STRUCTURE

**Donation Basis:** Voluntary donation to Ocasio Ak-Bar Saleem Willson Trust based on perceived value of services provided in ministerial capacity.

## SIGNATURES

**For Ocasio Ak-Bar Saleem Willson Trust:**
Signature: ${signatures.ocasio}
Ocasio Ak-Bar Saleem Willson, Senior Minister
The Most High (Private Capacity)
Date: ${signatures.date}

**For Individual Parties:**
${contactInfo.name}: ${currentUser === 'eli' ? signatures.eli : signatures.carmen}
Date: ${signatures.date}

${contactInfo.partnerName}: [To be signed separately]
Date: _____________

---

*This customized agreement reflects the specific components selected and requirements outlined by the parties. The structure provides maximum asset protection while maintaining full legal compliance and tax advantages.*

---

## DISCLAIMER

**No Legal or Financial Advice:** The services provided under this agreement are offered in a ministerial capacity only. Ocasio Ak-Bar Saleem Willson does not provide legal advice, financial advice, or any professional services requiring licensure. All information, documents, and guidance provided are for educational and organizational purposes only. Parties are encouraged to consult with licensed attorneys, CPAs, and financial advisors for professional advice specific to their circumstances.
`
  }

  const downloadAgreement = () => {
    const agreement = generateAgreement()
    const blob = new Blob([agreement], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Trust_Launch_Agreement_${signatures.date}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const submitAgreement = async () => {
    // Prepare selected services by component
    const selectedServicesByComponent = {}
    Object.keys(selectedServices).forEach(key => {
      if (selectedServices[key]) {
        const [componentId, serviceIndex] = key.split('_')
        if (!selectedServicesByComponent[componentId]) {
          selectedServicesByComponent[componentId] = []
        }
        const component = agreementComponents.find(c => c.id === componentId)
        if (component && component.included[serviceIndex]) {
          selectedServicesByComponent[componentId].push(component.included[serviceIndex])
        }
      }
    })

    const payload = {
      selectedUser: currentUser,
      selectedComponents: Object.keys(selectedComponents).filter(key => selectedComponents[key]),
      selectedServices: selectedServicesByComponent,
      customServices: additionalServices,
      contactInfo,
      signatures,
      agreementText: generateAgreement(),
    }

    try {
      const response = await fetch('/api/trpc/trust.submitAgreement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ json: payload }),
        credentials: 'include',
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server error:', errorText)
        throw new Error('Failed to submit agreement')
      }

      const result = await response.json()

      // Check for success in the TRPC response format
      if (result.result?.data?.json?.success || result.result?.data?.success) {
        alert('Agreement submitted successfully!')
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      console.error('Error submitting agreement:', error)
      alert('Failed to submit agreement. Please try again or contact support.')
    }
  }

  const groupedComponents = agreementComponents.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = []
    }
    acc[component.category].push(component)
    return acc
  }, {})

  if (showUserSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center premium-gradient">
        <div className="user-selection-card w-full max-w-md">
          <div className="text-center p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3 text-gradient">
              Trust Launch Agreement
            </h1>
            <p className="text-xl text-gray-700 mb-2">
              Who is completing this form?
            </p>
            <p className="text-sm text-gray-600 mb-8">
              Since you and your partner will be completing this form at different times, 
              please select who is filling it out right now.
            </p>
            
            <div className="space-y-4 mb-8">
              <button 
                onClick={() => handleUserSelection('eli')}
                className="user-button eli-button w-full h-20 text-lg font-semibold text-blue-700 flex items-center justify-center"
              >
                <Users className="w-6 h-6 mr-3" />
                Eli is completing this form
              </button>
              
              <button 
                onClick={() => handleUserSelection('carmen')}
                className="user-button carmen-button w-full h-20 text-lg font-semibold text-purple-700 flex items-center justify-center"
              >
                <Users className="w-6 h-6 mr-3" />
                Carmen is completing this form
              </button>
            </div>
            
            <div className="p-6 bg-gray-50/80 backdrop-blur-sm rounded-2xl">
              <p className="text-xs text-gray-600 text-center leading-relaxed">
                <strong>Note:</strong> After one person completes the form, the other person 
                can fill out a separate copy. Both responses will be combined for your 
                comprehensive trust launch plan.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Agreement Preview</h1>
            <div className="space-x-2">
              <Button onClick={() => setShowPreview(false)} variant="outline">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button onClick={downloadAgreement} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={submitAgreement} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Submit Agreement
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <ScrollArea className="h-[600px]">
                <pre className="whitespace-pre-wrap text-sm">{generateAgreement()}</pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen premium-gradient p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 header-blur">
          <h1 className="text-5xl font-bold text-white mb-3">
            Trust Launch Agreement Customizer
          </h1>
          <p className="text-xl text-white/90 mb-4">
            Customize your 3-month trust launch plan with Ocasio Ak-Bar Saleem Willson Trust
          </p>
          <div className="mb-6">
            <span className="badge-premium text-lg px-6 py-3 mr-4">
              Completing as: {currentUser === 'eli' ? 'Eli' : 'Carmen'}
            </span>
            <button 
              onClick={() => setShowUserSelection(true)} 
              className="premium-button text-sm px-6 py-3"
            >
              Switch User
            </button>
          </div>
          <div className="flex justify-center space-x-6 text-sm text-white/80">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              90 days after initial launch meeting
            </div>
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Legacy Planning Focus
            </div>
            <div className="flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Ministry-Based Structure
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="floating-card mb-8">
          <div className="p-8">
            <div className="flex items-center mb-6">
              <Users className="w-6 h-6 mr-3 text-gradient" />
              <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
            </div>
            <p className="text-gray-600 mb-8">
              Please provide your contact details for the agreement
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Current User's Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Your Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Legal Name</label>
                    <input
                      className="apple-input w-full"
                      value={contactInfo.name}
                      onChange={(e) => handleContactChange('name', e.target.value)}
                      placeholder="Enter your full legal name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      className="apple-input w-full"
                      value={contactInfo.email}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                      placeholder="your@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      className="apple-input w-full"
                      value={contactInfo.phone}
                      onChange={(e) => handleContactChange('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      className="apple-input w-full"
                      value={contactInfo.address}
                      onChange={(e) => handleContactChange('address', e.target.value)}
                      placeholder="Your full address"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Partner's Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Partner's Information</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Please provide your partner's information for the joint trust planning.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Partner's Full Legal Name</label>
                    <input
                      className="apple-input w-full"
                      value={contactInfo.partnerName}
                      onChange={(e) => handleContactChange('partnerName', e.target.value)}
                      placeholder="Partner's full legal name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Partner's Email Address</label>
                    <input
                      type="email"
                      className="apple-input w-full"
                      value={contactInfo.partnerEmail}
                      onChange={(e) => handleContactChange('partnerEmail', e.target.value)}
                      placeholder="partner@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Partner's Phone Number</label>
                    <input
                      className="apple-input w-full"
                      value={contactInfo.partnerPhone}
                      onChange={(e) => handleContactChange('partnerPhone', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Partner's Address</label>
                    <textarea
                      className="apple-input w-full"
                      value={contactInfo.partnerAddress}
                      onChange={(e) => handleContactChange('partnerAddress', e.target.value)}
                      placeholder="Partner's full address"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Component Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Select Agreement Components
            </CardTitle>
            <CardDescription>
              Choose the components you want to include in your trust launch plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Object.entries(groupedComponents).map(([category, components]) => (
              <div key={category} className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-indigo-700">{category}</h3>
                <div className="grid gap-4">
                  {components.map((component) => (
                    <Card key={component.id} className={`transition-all ${selectedComponents[component.id] ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'hover:shadow-md'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id={component.id}
                            checked={selectedComponents[component.id] || false}
                            onCheckedChange={() => handleComponentToggle(component.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <component.icon className="w-5 h-5 text-indigo-600" />
                              <Label htmlFor={component.id} className="text-base font-medium cursor-pointer">
                                {component.title}
                              </Label>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{component.description}</p>
                            <div className="space-y-3">
                              <p className="text-sm font-medium text-gray-700">Available Services (select what you want):</p>
                              <div className="space-y-2">
                                {component.included.map((item, index) => {
                                  const serviceKey = `${component.id}_${index}`
                                  const isExpanded = expandedServices[serviceKey]
                                  const description = serviceDescriptions[item]
                                  
                                  return (
                                    <div key={index} className="border rounded-lg p-2 hover:bg-gray-50 transition-colors">
                                      <div className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`${component.id}_service_${index}`}
                                          checked={selectedServices[serviceKey] || false}
                                          onCheckedChange={() => handleServiceToggle(component.id, index)}
                                          className="flex-shrink-0"
                                        />
                                        <Label 
                                          htmlFor={`${component.id}_service_${index}`}
                                          className="text-sm text-gray-700 cursor-pointer flex-1"
                                          title={description}
                                        >
                                          {item}
                                        </Label>
                                        <button
                                          onClick={() => toggleServiceExpansion(component.id, index)}
                                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                                          title="Click to show/hide description"
                                        >
                                          {isExpanded ? (
                                            <ChevronDown className="w-4 h-4 text-gray-600" />
                                          ) : (
                                            <ChevronRight className="w-4 h-4 text-gray-600" />
                                          )}
                                        </button>
                                      </div>
                                      {isExpanded && description && (
                                        <div className="mt-2 pl-6 pr-2 text-xs text-gray-600 bg-blue-50 p-2 rounded border-l-2 border-blue-400">
                                          {description}
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                              
                              {/* Additional Services for this component */}
                              <div className="mt-3 pt-3 border-t">
                                <Label htmlFor={`additional-${component.id}`} className="text-sm font-medium text-gray-700">
                                  Add Custom Services for this Component:
                                </Label>
                                <Textarea
                                  id={`additional-${component.id}`}
                                  value={additionalServices[component.id] || ''}
                                  onChange={(e) => handleAdditionalServiceChange(component.id, e.target.value)}
                                  placeholder="Add any additional services or aspects you want for this component..."
                                  rows={2}
                                  className="mt-2"
                                />
                              </div>
                            </div>
                            
                            {selectedComponents[component.id] && (
                              <div className="mt-4 p-3 bg-white rounded border">
                                <Label htmlFor={`custom-${component.id}`} className="text-sm font-medium">
                                  Custom Requirements or Notes:
                                </Label>
                                <Textarea
                                  id={`custom-${component.id}`}
                                  value={customizations[component.id] || ''}
                                  onChange={(e) => handleCustomizationChange(component.id, e.target.value)}
                                  placeholder="Add any specific requirements or customizations for this component..."
                                  rows={3}
                                  className="mt-2"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {category !== Object.keys(groupedComponents)[Object.keys(groupedComponents).length - 1] && (
                  <Separator className="my-6" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Additional Components */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Edit3 className="w-5 h-5 mr-2" />
              Additional Components
            </CardTitle>
            <CardDescription>
              Add any additional services or requirements not covered above
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={additionalComponents}
              onChange={(e) => setAdditionalComponents(e.target.value)}
              placeholder="Describe any additional components, services, or special requirements you would like to include in your trust launch plan..."
              rows={6}
            />
          </CardContent>
        </Card>

        {/* Digital Signatures */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Signature className="w-5 h-5 mr-2" />
              Digital Signatures
            </CardTitle>
            <CardDescription>
              Provide your digital signatures to execute the agreement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="user-signature">Your Digital Signature</Label>
                  <Input
                    id="user-signature"
                    value={currentUser === 'eli' ? signatures.eli : signatures.carmen}
                    onChange={(e) => handleSignatureChange(currentUser, e.target.value)}
                    placeholder="Type your full name as digital signature"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Signing as: {contactInfo.name}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="agreement-date">Agreement Date</Label>
                  <Input
                    id="agreement-date"
                    type="date"
                    value={signatures.date}
                    onChange={(e) => handleSignatureChange('date', e.target.value)}
                  />
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">
                    <strong>Note:</strong> By providing your digital signature above, you acknowledge that you have read, understood, and agree to the terms of this Trust Launch Agreement. Your partner will sign separately when they complete their portion.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary and Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Agreement Summary</CardTitle>
            <CardDescription>
              Review your selections and finalize your agreement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Selected Components:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.keys(selectedComponents).filter(key => selectedComponents[key]).length === 0 ? (
                    <Badge variant="outline">No components selected</Badge>
                  ) : (
                    Object.keys(selectedComponents)
                      .filter(key => selectedComponents[key])
                      .map(key => {
                        const component = agreementComponents.find(c => c.id === key)
                        return (
                          <Badge key={key} variant="secondary">
                            {component?.title}
                          </Badge>
                        )
                      })
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4">
                <div className="text-sm text-gray-600">
                  <p>Agreement will be sent to: ocasiowillson@protonmail.com</p>
                  <p>Duration: 90 days from execution date</p>
                </div>
                <div className="space-x-2">
                  <Button 
                    onClick={() => setShowPreview(true)} 
                    variant="outline"
                    disabled={Object.keys(selectedComponents).filter(key => selectedComponents[key]).length === 0}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Preview Agreement
                  </Button>
                  <Button 
                    onClick={submitAgreement}
                    disabled={
                      Object.keys(selectedComponents).filter(key => selectedComponents[key]).length === 0 ||
                      !signatures.eli || 
                      !signatures.carmen ||
                      !contactInfo.eli.email ||
                      !contactInfo.carmen.email
                    }
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Execute Agreement
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
