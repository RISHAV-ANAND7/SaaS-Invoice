"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Eye, Trash2 } from "lucide-react"
import { InvoicePDF } from "./invoice-pdf"

interface Invoice {
  id: string
  number: string
  customerName: string
  amount: number
  status: "draft" | "sent" | "paid" | "overdue"
  dueDate: string
  createdAt: string
}

interface InvoiceListProps {
  invoices: Invoice[]
  onCreateInvoice: () => void
  onUpdateInvoices: (invoices: Invoice[]) => void
}

export function InvoiceList({ invoices, onCreateInvoice, onUpdateInvoices }: InvoiceListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDeleteInvoice = (invoiceId: string) => {
    const updatedInvoices = invoices.filter((inv) => inv.id !== invoiceId)
    onUpdateInvoices(updatedInvoices)
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices))
  }

  const handleStatusChange = (invoiceId: string, newStatus: Invoice["status"]) => {
    const updatedInvoices = invoices.map((inv) => (inv.id === invoiceId ? { ...inv, status: newStatus } : inv))
    onUpdateInvoices(updatedInvoices)
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Invoices</h2>
          <p className="text-gray-600 mt-1">Manage all your invoices</p>
        </div>
        <Button
          onClick={onCreateInvoice}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:border-primary focus:ring-primary"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white border-gray-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoice List */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl text-gray-900">All Invoices ({filteredInvoices.length})</CardTitle>
          <CardDescription className="text-gray-600">
            {filteredInvoices.length === 0 && searchTerm ? "No invoices match your search" : "Your invoice history"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl w-fit mx-auto mb-6">
                <Plus className="w-16 h-16 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                {searchTerm || statusFilter !== "all" ? "No invoices match your filters" : "No invoices created yet"}
              </h3>
              {!searchTerm && statusFilter === "all" && (
                <Button
                  onClick={onCreateInvoice}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg px-8 py-3"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Invoice
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border border-gray-100 rounded-2xl hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-gray-50 gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
                      <Plus className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg text-gray-900">{invoice.number}</p>
                      <p className="text-gray-600">{invoice.customerName}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    <div className="text-left sm:text-right">
                      <p className="font-bold text-xl text-gray-900">₹{invoice.amount.toLocaleString("en-IN")}</p>
                      <p className="text-sm text-gray-500">
                        Due {new Date(invoice.dueDate).toLocaleDateString("en-IN")}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <Select
                        value={invoice.status}
                        onValueChange={(value) => handleStatusChange(invoice.id, value as Invoice["status"])}
                      >
                        <SelectTrigger className="w-32 bg-white border-gray-200">
                          <Badge
                            variant={
                              invoice.status === "paid"
                                ? "default"
                                : invoice.status === "sent"
                                  ? "secondary"
                                  : invoice.status === "overdue"
                                    ? "destructive"
                                    : "outline"
                            }
                            className="px-3 py-1"
                          >
                            {invoice.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-200 hover:border-primary hover:bg-primary hover:text-white bg-transparent"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <InvoicePDF invoice={invoice} />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className="border-gray-200 hover:border-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
