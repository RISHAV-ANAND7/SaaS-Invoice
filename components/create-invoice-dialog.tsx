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

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)

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
    setItems([{ description: "", quantity: 1, rate: "", amount: 0 }])
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

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-4">Customer Information</h3>
              <div className="space-y-2">
                <Label htmlFor="customer" className="text-sm font-medium text-gray-700">
                  Select Customer
                </Label>
                {customers.length > 0 ? (
                  <Select value={formData.customerId} onValueChange={handleCustomerChange}>
                    <SelectTrigger className="bg-white text-gray-900">
                      <SelectValue placeholder="Choose a customer from your list" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{customer.name}</span>
                            <span className="text-sm text-gray-500">{customer.company}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-4 border rounded-lg bg-amber-50 border-amber-200">
                    <p className="text-sm text-amber-800 font-medium">No customers available</p>
                    <p className="text-sm text-amber-700">Please add a customer first before creating an invoice.</p>
                  </div>
                )}
              </div>
            </div>

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

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Amount</Label>
                        <div className="h-10 px-3 py-2 border rounded-md bg-primary/5 border-primary/20 flex items-center font-medium text-primary">
                          ₹{item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
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
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-primary">
                      ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

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
