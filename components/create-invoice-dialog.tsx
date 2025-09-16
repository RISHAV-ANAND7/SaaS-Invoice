"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  company: string
  phone?: string
  address?: string
}

interface Invoice {
  id: string
  number: string
  customerName: string
  amount: number
  status: "draft" | "sent" | "paid" | "overdue"
  dueDate: string
  createdAt: string
  items: InvoiceItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  notes: string
}

interface InvoiceItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

interface CreateInvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateInvoice: (invoice: Omit<Invoice, "id" | "createdAt">) => void
  customers: Customer[]
}

export function CreateInvoiceDialog({ open, onOpenChange, onCreateInvoice, customers }: CreateInvoiceDialogProps) {
  const [formData, setFormData] = useState({
    number: `INV-${Date.now().toString().slice(-6)}`,
    customerId: "",
    customerName: "",
    dueDate: "",
    status: "draft" as const,
    notes: "",
  })

  const [items, setItems] = useState<InvoiceItem[]>([{ description: "", quantity: 1, rate: 0, amount: 0 }])

  const [taxSettings, setTaxSettings] = useState({
    taxRate: 0, // Tax percentage (e.g., 18 for 18%)
    taxType: "percentage" as "percentage" | "fixed",
    taxName: "GST", // Name of the tax (GST, VAT, etc.)
  })

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId)
    setFormData({
      ...formData,
      customerId,
      customerName: customer?.name || "",
    })
  }

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    // Calculate amount for this item
    if (field === "quantity" || field === "rate") {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate
    }

    setItems(updatedItems)
  }

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: "", amount: 0 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const taxAmount = taxSettings.taxType === "percentage" ? (subtotal * taxSettings.taxRate) / 100 : taxSettings.taxRate
  const totalAmount = subtotal + taxAmount

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.customerName || !formData.dueDate || items.some((item) => !item.description)) {
      return
    }

    onCreateInvoice({
      number: formData.number,
      customerName: formData.customerName,
      amount: totalAmount,
      status: formData.status,
      dueDate: formData.dueDate,
      // Add tax details for the invoice
      items,
      subtotal,
      taxRate: taxSettings.taxRate,
      taxAmount,
      total: totalAmount,
      notes: formData.notes,
    })

    // Reset form
    setFormData({
      number: `INV-${Date.now().toString().slice(-6)}`,
      customerId: "",
      customerName: "",
      dueDate: "",
      status: "draft",
      notes: "",
    })
    setItems([{ description: "", quantity: 1, rate: 0, amount: 0 }])
    setTaxSettings({
      taxRate: 0,
      taxType: "percentage",
      taxName: "GST",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-semibold text-gray-900">Create New Invoice</DialogTitle>
          <DialogDescription className="text-gray-600">
            Fill in the details to create a professional invoice for your customer.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ... existing invoice details section ... */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-4">Invoice Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoice-number" className="text-sm font-medium text-gray-700">
                    Invoice Number
                  </Label>
                  <Input
                    id="invoice-number"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="bg-white text-gray-900"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="due-date" className="text-sm font-medium text-gray-700">
                    Due Date
                  </Label>
                  <Input
                    id="due-date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="bg-white text-gray-900"
                    required
                  />
                </div>
              </div>
            </div>

            {/* ... existing customer information section ... */}
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
                  <p className="text-sm text-gray-600">Select the customer for this invoice</p>
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="customer" className="text-sm font-semibold text-gray-800">
                  Select Customer *
                </Label>
                {customers.length > 0 ? (
                  <Select value={formData.customerId} onValueChange={handleCustomerChange}>
                    <SelectTrigger className="bg-white text-gray-900 border-blue-200 focus:border-blue-400 focus:ring-blue-400 h-12 text-base">
                      <SelectValue placeholder="Choose a customer from your list">
                        {formData.customerId && formData.customerName ? (
                          <span className="text-gray-900 font-medium">{formData.customerName}</span>
                        ) : (
                          <span className="text-gray-500">Choose a customer from your list</span>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent
                      className="bg-white border border-gray-200 shadow-xl max-h-60 overflow-y-auto z-[100] w-full min-w-[var(--radix-select-trigger-width)]"
                      position="popper"
                      sideOffset={4}
                    >
                      {customers.map((customer) => (
                        <SelectItem
                          key={customer.id}
                          value={customer.id}
                          className="py-3 px-3 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer data-[highlighted]:bg-blue-50"
                        >
                          <div className="flex flex-col items-start w-full overflow-hidden">
                            <span className="font-semibold text-gray-900 text-sm leading-tight w-full overflow-hidden text-ellipsis whitespace-nowrap">
                              {customer.name}
                            </span>
                            <span className="text-xs text-gray-600 leading-tight w-full overflow-hidden text-ellipsis whitespace-nowrap">
                              {customer.company}
                            </span>
                            {customer.email && (
                              <span className="text-xs text-gray-500 leading-tight w-full overflow-hidden text-ellipsis whitespace-nowrap">
                                {customer.email}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-6 border-2 border-dashed border-amber-300 rounded-xl bg-amber-50">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-base font-semibold text-amber-800 mb-1">No customers available</p>
                      <p className="text-sm text-amber-700">Please add a customer first before creating an invoice.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ... existing invoice items section ... */}
            <div className="bg-white border rounded-lg">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-medium text-gray-900">Invoice Items</h3>
                <p className="text-sm text-gray-600">Add items and services for this invoice</p>
              </div>
              <div className="p-4 space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50/50 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor={`description-${index}`} className="text-sm font-medium text-gray-700">
                          Item Description
                        </Label>
                        <Input
                          id={`description-${index}`}
                          placeholder="Describe the item or service"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, "description", e.target.value)}
                          className="bg-white text-gray-900 placeholder:text-gray-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                      <div>
                        <Label htmlFor={`quantity-${index}`} className="text-sm font-medium text-gray-700">
                          Quantity
                        </Label>
                        <Input
                          id={`quantity-${index}`}
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, "quantity", Number.parseInt(e.target.value) || 1)}
                          className="bg-white text-gray-900"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor={`rate-${index}`} className="text-sm font-medium text-gray-700">
                          Rate (₹)
                        </Label>
                        <Input
                          id={`rate-${index}`}
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={item.rate === 0 ? "" : item.rate}
                          onChange={(e) => {
                            const value = e.target.value
                            const numValue = value === "" ? 0 : Number.parseFloat(value)
                            handleItemChange(index, "rate", isNaN(numValue) ? 0 : numValue)
                          }}
                          className="bg-white text-gray-900 placeholder:text-gray-400"
                          required
                        />
                      </div>

                      <div className="min-w-0">
                        <Label className="text-sm font-medium text-gray-700">Amount</Label>
                        <div className="h-12 px-3 py-2 border rounded-md bg-primary/5 border-primary/20 flex items-center font-semibold text-primary min-w-0">
                          <span className="truncate text-sm sm:text-base">
                            ₹{item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addItem}
                    className="w-full sm:w-auto bg-primary/5 border-primary/20 text-primary hover:bg-primary hover:text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Item
                  </Button>
                  <div className="text-right min-w-0">
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="text-xl sm:text-2xl font-bold text-primary break-words">
                      ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Tax Calculation</h3>
                  <p className="text-sm text-gray-600">Configure tax settings for this invoice</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tax-name" className="text-sm font-medium text-gray-700">
                    Tax Name
                  </Label>
                  <Input
                    id="tax-name"
                    value={taxSettings.taxName}
                    onChange={(e) => setTaxSettings({ ...taxSettings, taxName: e.target.value })}
                    className="bg-white text-gray-900 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    placeholder="GST, VAT, Sales Tax, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax-type" className="text-sm font-medium text-gray-700">
                    Tax Type
                  </Label>
                  <Select
                    value={taxSettings.taxType}
                    onValueChange={(value: "percentage" | "fixed") =>
                      setTaxSettings({ ...taxSettings, taxType: value })
                    }
                  >
                    <SelectTrigger className="bg-white text-gray-900 border-purple-200 focus:border-purple-400 focus:ring-purple-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax-rate" className="text-sm font-medium text-gray-700">
                    {taxSettings.taxType === "percentage" ? "Tax Rate (%)" : "Tax Amount (₹)"}
                  </Label>
                  <Input
                    id="tax-rate"
                    type="number"
                    min="0"
                    step={taxSettings.taxType === "percentage" ? "0.01" : "0.01"}
                    value={taxSettings.taxRate === 0 ? "" : taxSettings.taxRate}
                    onChange={(e) => {
                      const value = e.target.value
                      const numValue = value === "" ? 0 : Number.parseFloat(value)
                      setTaxSettings({ ...taxSettings, taxRate: isNaN(numValue) ? 0 : numValue })
                    }}
                    className="bg-white text-gray-900 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    placeholder={taxSettings.taxType === "percentage" ? "18.00" : "1000.00"}
                  />
                </div>
              </div>

              {/* Tax calculation preview */}
              <div className="mt-6 p-4 bg-white rounded-lg border border-purple-200">
                <h4 className="font-medium text-gray-900 mb-3">Tax Calculation Preview</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      ₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {taxSettings.taxName} (
                      {taxSettings.taxType === "percentage" ? `${taxSettings.taxRate}%` : "Fixed"}):
                    </span>
                    <span className="font-medium">
                      ₹{taxAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-purple-200">
                    <span className="font-semibold text-gray-900">Total Amount:</span>
                    <span className="font-bold text-lg text-purple-600">
                      ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ... existing notes and status section ... */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Payment terms, thank you message, or other notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="bg-white text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                  Invoice Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                >
                  <SelectTrigger className="bg-white text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft - Not sent yet</SelectItem>
                    <SelectItem value="sent">Sent - Awaiting payment</SelectItem>
                    <SelectItem value="paid">Paid - Payment received</SelectItem>
                    <SelectItem value="overdue">Overdue - Past due date</SelectItem>
                  </SelectContent>
                </Select>
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
            disabled={!formData.customerName || !formData.dueDate || totalAmount === 0}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white"
            onClick={handleSubmit}
          >
            Create Invoice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
