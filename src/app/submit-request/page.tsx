'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FileText, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { db } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

interface Province {
  id: number
  name: string
  code: string
}

export default function SubmitRequest() {
  const { user } = useAuth()
  const router = useRouter()

  const [provinces, setProvinces] = useState<Province[]>([])
  const [applicationType, setApplicationType] = useState('')
  const [applicantCategory, setApplicantCategory] = useState('individual')
  const [provinceId, setProvinceId] = useState('')
  const [financingMethod, setFinancingMethod] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [applicationNumber, setApplicationNumber] = useState('')

  // Load provinces from database
  useEffect(() => {
    async function loadProvinces() {
      const { data } = await db.provinces().select('*').order('name')
      if (data) setProvinces(data)
    }
    loadProvinces()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const formData = new FormData(e.currentTarget)

      // Prepare application data
      const applicationData = {
        application_type: applicationType as any,
        applicant_category: applicantCategory as any,
        status: 'submitted' as any, // Changed from draft to submitted

        // Applicant Information
        company_name: applicantCategory === 'company' ? formData.get('companyName') as string : null,
        first_name: formData.get('firstName') as string,
        last_name: formData.get('lastName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        postal_address: formData.get('address') as string,

        // Land Details
        province_id: provinceId ? parseInt(provinceId) : null,
        district: formData.get('district') as string || null,
        location_description: formData.get('location') as string,
        area_requested: formData.get('area') ? parseFloat(formData.get('area') as string) : null,
        lease_duration_years: formData.get('duration') ? parseInt(formData.get('duration') as string) : null,

        // Purpose
        intended_use: formData.get('purpose') as string,
        development_description: formData.get('purpose') as string,

        // Financial Details
        financing_method: financingMethod as any || null,
        estimated_development_value: formData.get('estimatedValue')
          ? parseFloat(formData.get('estimatedValue') as string)
          : null,

        // Set submitted timestamp
        submitted_at: new Date().toISOString(),
      }

      // Insert into database
      const { data, error } = await db.applications()
        .insert(applicationData)
        .select()
        .single()

      if (error) throw error

      // Success!
      setApplicationNumber(data.application_number)
      setSubmitSuccess(true)

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/applications')
      }, 3000)

    } catch (error: any) {
      console.error('Error submitting application:', error)
      setSubmitError(error.message || 'Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success State
  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-12 text-center">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-green-900 mb-2">Application Submitted Successfully!</h2>
            <p className="text-lg text-green-700 mb-6">
              Your application number is: <span className="font-bold">{applicationNumber}</span>
            </p>
            <div className="bg-white rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Your application has been submitted and is now under review. You will be notified about the Land Board meeting date via post.
              </p>
              <ul className="text-sm text-left text-gray-700 space-y-2">
                <li>✓ Application saved to database</li>
                <li>✓ Application number generated automatically</li>
                <li>✓ Status: Pending Review</li>
                <li>✓ Processing time: 7-42 days</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600">
              Redirecting to applications page in 3 seconds...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Submit Application</h1>
        <p className="text-gray-600 mt-1">Apply for land leases, licenses, and renewals</p>
      </div>

      {submitError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="text-red-600" size={24} />
            <div className="flex-1">
              <p className="font-semibold text-red-900">Submission Error</p>
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-lg text-white">
              <FileText size={24} />
            </div>
            <div>
              <CardTitle className="text-2xl">New Application Form</CardTitle>
              <CardDescription>Fill in the details below to submit your application</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Application Type */}
            <div className="space-y-2">
              <Label htmlFor="applicationType" className="text-base font-semibold">Application Type *</Label>
              <Select value={applicationType} onValueChange={setApplicationType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select application type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business_commercial">Business Commercial Lease</SelectItem>
                  <SelectItem value="business_industrial">Business Industrial Lease</SelectItem>
                  <SelectItem value="residential_high">Residential Lease (High Covenant)</SelectItem>
                  <SelectItem value="residential_medium">Residential Lease (Medium Covenant)</SelectItem>
                  <SelectItem value="residential_low">Residential Lease (Low Covenant)</SelectItem>
                  <SelectItem value="agricultural">Agricultural Lease</SelectItem>
                  <SelectItem value="pastoral">Pastoral Lease</SelectItem>
                  <SelectItem value="mission">Mission Lease</SelectItem>
                  <SelectItem value="special_purpose">Special Purpose Lease</SelectItem>
                  <SelectItem value="urban_development">Urban Development Lease</SelectItem>
                  <SelectItem value="renewal">Lease Renewal</SelectItem>
                  <SelectItem value="subdivision">Subdivision Application</SelectItem>
                  <SelectItem value="consolidation">Consolidation Application</SelectItem>
                  <SelectItem value="license">Annual License</SelectItem>
                  <SelectItem value="rent_reduction">Rent Reduction (First Home Owners)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Applicant Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Applicant Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" name="firstName" placeholder="Enter first name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" name="lastName" placeholder="Enter last name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" name="email" type="email" placeholder="your.email@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="+675 XXXX XXXX" required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Postal Address *</Label>
                  <Textarea id="address" name="address" placeholder="Enter your full postal address" rows={2} required />
                </div>
              </div>
            </div>

            {/* Applicant Type */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Applicant Category</h3>
              <RadioGroup value={applicantCategory} onValueChange={setApplicantCategory}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="individual" id="individual" />
                  <Label htmlFor="individual" className="font-normal">Individual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="company" id="company" />
                  <Label htmlFor="company" className="font-normal">Company/Organization</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="government" id="government" />
                  <Label htmlFor="government" className="font-normal">Government Department/Statutory Body</Label>
                </div>
              </RadioGroup>

              {applicantCategory === 'company' && (
                <div className="mt-4 space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input id="companyName" name="companyName" placeholder="Enter company name" required />
                </div>
              )}
            </div>

            {/* Land Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Land Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="province">Province *</Label>
                  <Select value={provinceId} onValueChange={setProvinceId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map(province => (
                        <SelectItem key={province.id} value={province.id.toString()}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input id="district" name="district" placeholder="Enter district" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location">Land Location/Description *</Label>
                  <Textarea id="location" name="location" placeholder="Provide detailed location and description of the land" rows={3} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Area (hectares)</Label>
                  <Input id="area" name="area" type="number" step="0.01" placeholder="Enter area" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Lease Duration (years)</Label>
                  <Input id="duration" name="duration" type="number" placeholder="Maximum 99 years" max="99" />
                </div>
              </div>
            </div>

            {/* Purpose */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Purpose of Application</h3>
              <div className="space-y-2">
                <Label htmlFor="purpose">Intended Use *</Label>
                <Textarea
                  id="purpose"
                  name="purpose"
                  placeholder="Describe the intended use and development plans for the land"
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Financial Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Financial Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="financingMethod">How will you finance the development? *</Label>
                  <Select value={financingMethod} onValueChange={setFinancingMethod} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select financing method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="savings">Personal Savings</SelectItem>
                      <SelectItem value="bank_loan">Bank Loan</SelectItem>
                      <SelectItem value="housing_scheme">Housing Scheme (Employer)</SelectItem>
                      <SelectItem value="posf">POSF</SelectItem>
                      <SelectItem value="nasfund">NASFUND</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedValue">Estimated Development Value (Kina)</Label>
                  <Input id="estimatedValue" name="estimatedValue" type="number" placeholder="Enter estimated value" />
                </div>
              </div>
            </div>

            {/* Declaration */}
            <div className="border-t pt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Declaration</h4>
                <p className="text-sm text-gray-700 mb-3">
                  I declare that the information provided in this application is true and correct to the best of my knowledge.
                  I understand that providing false information may result in the rejection of this application and possible legal action.
                </p>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="declaration" required className="w-4 h-4" />
                  <Label htmlFor="declaration" className="font-normal text-sm">
                    I agree to the declaration above *
                  </Label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-6">
              <Button
                type="submit"
                disabled={isSubmitting || !applicationType || !financingMethod}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2" size={16} />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="bg-emerald-50 border-emerald-200">
        <CardHeader>
          <CardTitle className="text-emerald-900">Important Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-emerald-800">
          <p>• Application will be saved to database with auto-generated number</p>
          <p>• Processing time: 7-42 days depending on Land Board meeting schedule</p>
          <p>• You will be notified by post regarding your Land Board hearing date</p>
          <p>• Maximum lease term: 99 years (5 years for Urban Development Lease)</p>
          <p>• For inquiries, contact the Land Allocation Section or visit our Provincial Lands Offices</p>
        </CardContent>
      </Card>
    </div>
  )
}
