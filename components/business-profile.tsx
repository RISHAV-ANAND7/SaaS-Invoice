"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building, Mail, Phone, MapPin, Save, User, Globe, Hash, AlertCircle, CheckCircle } from "lucide-react"

interface BusinessProfile {
  _id?: string
  name: string
  email: string
  phone: string
  address: string
  website?: string
  taxId?: string
  logo?: string
  ownerId?: string
}

interface BusinessProfileProps {
  onProfileUpdate?: (profile: BusinessProfile) => void
  userId?: string // For connecting to the database
}

export function BusinessProfile({ onProfileUpdate, userId = "temp-user" }: BusinessProfileProps) {
  const [profile, setProfile] = useState<BusinessProfile>({
    name: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    taxId: "",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Load profile from database on mount
  useEffect(() => {
    loadBusinessProfile()
  }, [userId])

  const loadBusinessProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/businesses?userId=${userId}`)
      if (!response.ok) {
        throw new Error("Failed to load business profile")
      }

      const businesses = await response.json()
      if (businesses.length > 0) {
        const business = businesses[0] // Use the first business for now
        setProfile({
          _id: business._id,
          name: business.name,
          email: business.email,
          phone: business.phone,
          address: business.address,
          website: business.website || "",
          taxId: business.taxId || "",
          logo: business.logo || "",
          ownerId: business.ownerId,
        })
      } else {
        setIsEditing(true) // Start in edit mode if no profile exists
      }
    } catch (err) {
      console.error("Error loading business profile:", err)
      setError("Failed to load business profile. Please try again.")
      setIsEditing(true) // Allow user to create profile if loading fails
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError(null)
      setSuccess(null)

      // Validate required fields
      if (!profile.name || !profile.email || !profile.phone || !profile.address) {
        setError("Please fill in all required fields.")
        return
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(profile.email)) {
        setError("Please enter a valid email address.")
        return
      }

      const url = profile._id ? `/api/businesses/${profile._id}` : "/api/businesses"
      const method = profile._id ? "PUT" : "POST"

      const requestBody = profile._id ? profile : { ...profile, ownerId: userId }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save business profile")
      }

      const savedProfile = await response.json()
      setProfile({
        ...savedProfile,
        website: savedProfile.website || "",
        taxId: savedProfile.taxId || "",
        logo: savedProfile.logo || "",
      })

      // Call callback if provided
      if (onProfileUpdate) {
        onProfileUpdate(savedProfile)
      }

      setSuccess("Business profile saved successfully!")
      setIsEditing(false)

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error("Error saving business profile:", err)
      setError(err instanceof Error ? err.message : "Failed to save business profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Reload profile to cancel changes
    if (profile._id) {
      loadBusinessProfile()
    } else {
      // Reset to empty if no existing profile
      setProfile({
        name: "",
        email: "",
        phone: "",
        address: "",
        website: "",
        taxId: "",
      })
    }
    setIsEditing(false)
    setError(null)
    setSuccess(null)
  }

  const isProfileEmpty = !profile.name && !profile.email

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Loading business profile...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Business Profile</h2>
          <p className="text-gray-600 mt-1">Manage your business information for professional invoices</p>
        </div>
        {!isEditing && !isProfileEmpty && (
          <Button
            onClick={() => setIsEditing(true)}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white shadow-lg"
          >
            <User className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-gray-100">
          <CardTitle className="text-xl sm:text-2xl text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-primary" />
            </div>
            Business Information
          </CardTitle>
          <CardDescription className="text-gray-600">
            {isProfileEmpty
              ? "Set up your business profile to create professional invoices"
              : "Your business details that appear on invoices and documents"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {isProfileEmpty && !isEditing ? (
            <div className="text-center py-16">
              <div className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl w-fit mx-auto mb-8">
                <Building className="w-20 h-20 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">No business profile found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                Create your business profile to generate professional invoices with your company branding and contact
                information
              </p>
              <Button
                onClick={() => setIsEditing(true)}
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg px-8 py-4 text-lg"
              >
                <Building className="w-5 h-5 mr-2" />
                Create Business Profile
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Business Details Section */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Company Details</h3>
                    <p className="text-sm text-gray-600">Basic business information</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Business Name *
                    </Label>
                    {isEditing ? (
                      <Input
                        id="businessName"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="bg-white text-gray-900 border-blue-200 focus:border-blue-400 focus:ring-blue-400 h-11"
                        placeholder="Your Business Name"
                        required
                      />
                    ) : (
                      <div className="h-11 px-4 py-2 border rounded-lg bg-white border-gray-200 flex items-center shadow-sm">
                        <span className="text-gray-900 font-medium">{profile.name || "Not set"}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Website
                    </Label>
                    {isEditing ? (
                      <Input
                        id="website"
                        value={profile.website}
                        onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                        className="bg-white text-gray-900 border-blue-200 focus:border-blue-400 focus:ring-blue-400 h-11"
                        placeholder="https://yourwebsite.com"
                      />
                    ) : (
                      <div className="h-11 px-4 py-2 border rounded-lg bg-white border-gray-200 flex items-center shadow-sm">
                        <span className="text-gray-900">{profile.website || "Not set"}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="taxId" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Tax ID / GST Number
                    </Label>
                    {isEditing ? (
                      <Input
                        id="taxId"
                        value={profile.taxId}
                        onChange={(e) => setProfile({ ...profile, taxId: e.target.value })}
                        className="bg-white text-gray-900 border-blue-200 focus:border-blue-400 focus:ring-blue-400 h-11"
                        placeholder="GST123456789 or Tax ID"
                      />
                    ) : (
                      <div className="h-11 px-4 py-2 border rounded-lg bg-white border-gray-200 flex items-center shadow-sm">
                        <span className="text-gray-900">{profile.taxId || "Not set"}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Contact Information</h3>
                    <p className="text-sm text-gray-600">How customers can reach you</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address *
                    </Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="bg-white text-gray-900 border-green-200 focus:border-green-400 focus:ring-green-400 h-11"
                        placeholder="business@example.com"
                        required
                      />
                    ) : (
                      <div className="h-11 px-4 py-2 border rounded-lg bg-white border-gray-200 flex items-center shadow-sm">
                        <span className="text-gray-900">{profile.email || "Not set"}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number *
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="bg-white text-gray-900 border-green-200 focus:border-green-400 focus:ring-green-400 h-11"
                        placeholder="+91 98765 43210"
                        required
                      />
                    ) : (
                      <div className="h-11 px-4 py-2 border rounded-lg bg-white border-gray-200 flex items-center shadow-sm">
                        <span className="text-gray-900">{profile.phone || "Not set"}</span>
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-2 space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Business Address *
                    </Label>
                    {isEditing ? (
                      <Textarea
                        id="address"
                        value={profile.address}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        className="bg-white text-gray-900 border-green-200 focus:border-green-400 focus:ring-green-400 min-h-[100px]"
                        placeholder="123 Business Street, City, State, PIN Code"
                        rows={4}
                        required
                      />
                    ) : (
                      <div className="min-h-[100px] px-4 py-3 border rounded-lg bg-white border-gray-200 shadow-sm">
                        <span className="text-gray-900 whitespace-pre-wrap">{profile.address || "Not set"}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="w-full sm:w-auto border-gray-300 hover:bg-gray-50 bg-transparent"
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={!profile.name || !profile.email || !profile.phone || !profile.address || isSaving}
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white shadow-lg"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Profile
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
