"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Customer {
  id: string
  name: string
  email: string
  company: string
  phone?: string
  address?: string
}

interface EditCustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer | null
  onUpdateCustomer: (customer: Customer) => void
}

export function EditCustomerDialog({ open, onOpenChange, customer, onUpdateCustomer }: EditCustomerDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    address: "",
  })

  // Update form data when customer changes
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        company: customer.company,
        phone: customer.phone || "",
        address: customer.address || "",
      })
    }
  }, [customer])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.company) {
      return
    }

    if (customer) {
      const updatedCustomer: Customer = {
        ...customer,
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
      }

      onUpdateCustomer(updatedCustomer)
      onOpenChange(false)
    }
  }

  if (!customer) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-semibold text-gray-900">Edit Customer</DialogTitle>
          <DialogDescription className="text-gray-600">Update the customer information below.</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Customer Information</h3>
                  <p className="text-sm text-gray-600">Update the customer details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-sm font-medium text-gray-700">
                    Full Name *
                  </Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white text-gray-900 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-email" className="text-sm font-medium text-gray-700">
                    Email Address *
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-white text-gray-900 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-company" className="text-sm font-medium text-gray-700">
                    Company Name *
                  </Label>
                  <Input
                    id="edit-company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="bg-white text-gray-900 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <Input
                    id="edit-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-white text-gray-900 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Label htmlFor="edit-address" className="text-sm font-medium text-gray-700">
                  Address
                </Label>
                <Textarea
                  id="edit-address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="bg-white text-gray-900 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  placeholder="Optional - Full address"
                  rows={3}
                />
              </div>
            </div>
          </form>
        </div>

        <div className="flex-shrink-0 flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t bg-gray-50 -mx-6 -mb-6 px-6 py-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!formData.name || !formData.email || !formData.company}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white"
            onClick={handleSubmit}
          >
            Update Customer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
