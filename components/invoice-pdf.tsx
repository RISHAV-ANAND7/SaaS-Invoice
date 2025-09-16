"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface Invoice {
  id: string
  number: string
  customerName: string
  amount: number
  status: "draft" | "sent" | "paid" | "overdue"
  dueDate: string
  createdAt: string
  items?: Array<{
    description: string
    quantity: number
    rate: number
    amount: number
  }>
  subtotal?: number
  taxRate?: number
  taxAmount?: number
  total?: number
  notes?: string
}

interface InvoicePDFProps {
  invoice: Invoice
  customerData?: {
    company: string
    email: string
    address?: string
    phone?: string
  }
  businessData?: {
    name: string
    email: string
    phone: string
    address: string
    website?: string
    logo?: string
    taxId?: string
  }
}

export function InvoicePDF({ invoice, customerData, businessData }: InvoicePDFProps) {
  const generatePDF = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("Please allow popups to download the PDF")
      return
    }

    const items = invoice.items || [
      {
        description: "Professional Services",
        quantity: 1,
        rate: invoice.amount,
        amount: invoice.amount,
      },
    ]

    const subtotal = invoice.subtotal || invoice.amount
    const taxRate = invoice.taxRate || 0
    const taxAmount = invoice.taxAmount || 0
    const total = invoice.total || invoice.amount

    const pdfContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.number}</title>
          <meta charset="UTF-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #1a1a1a;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px 20px;
              background: #ffffff;
            }
            
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 50px;
              padding-bottom: 30px;
              border-bottom: 3px solid #2563eb;
            }
            
            .company-info {
              flex: 1;
            }
            
            .company-info h1 {
              font-size: 32px;
              font-weight: 700;
              color: #1f2937;
              margin-bottom: 8px;
              letter-spacing: -0.5px;
            }
            
            .company-info .tagline {
              color: #2563eb;
              font-size: 14px;
              font-weight: 500;
              margin-bottom: 16px;
            }
            
            .company-info p {
              color: #4b5563;
              font-size: 14px;
              margin-bottom: 4px;
            }
            
            .invoice-info {
              text-align: right;
              flex: 1;
            }
            
            .invoice-info h2 {
              font-size: 36px;
              color: #2563eb;
              margin-bottom: 16px;
              font-weight: 700;
            }
            
            .invoice-details {
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #2563eb;
            }
            
            .invoice-details p {
              color: #374151;
              font-size: 14px;
              margin-bottom: 8px;
              display: flex;
              justify-content: space-between;
            }
            
            .invoice-details strong {
              color: #1f2937;
            }
            
            .billing-section {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 50px;
              margin-bottom: 50px;
            }
            
            .billing-card {
              background: #f9fafb;
              padding: 24px;
              border-radius: 12px;
              border: 1px solid #e5e7eb;
            }
            
            .billing-card h3 {
              font-size: 18px;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 16px;
              padding-bottom: 8px;
              border-bottom: 2px solid #e5e7eb;
            }
            
            .billing-card p {
              color: #374151;
              font-size: 14px;
              margin-bottom: 6px;
              line-height: 1.5;
            }
            
            .billing-card .company-name {
              font-weight: 600;
              color: #1f2937;
              font-size: 16px;
            }
            
            .items-section {
              margin-bottom: 40px;
            }
            
            .items-table {
              width: 100%;
              border-collapse: collapse;
              background: white;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            
            .items-table th {
              background: linear-gradient(135deg, #2563eb, #1d4ed8);
              color: white;
              padding: 16px 12px;
              text-align: left;
              font-weight: 600;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .items-table th.amount {
              text-align: right;
            }
            
            .items-table td {
              padding: 16px 12px;
              border-bottom: 1px solid #f3f4f6;
              color: #374151;
              font-size: 14px;
            }
            
            .items-table tr:last-child td {
              border-bottom: none;
            }
            
            .items-table tr:nth-child(even) {
              background-color: #f9fafb;
            }
            
            .items-table .amount {
              text-align: right;
              font-weight: 500;
            }
            
            .items-table .description {
              font-weight: 500;
              color: #1f2937;
            }
            
            .total-section {
              margin-left: auto;
              width: 350px;
              background: #f8fafc;
              padding: 24px;
              border-radius: 12px;
              border: 1px solid #e5e7eb;
            }
            
            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #e5e7eb;
              font-size: 14px;
            }
            
            .total-row:last-child {
              border-bottom: none;
            }
            
            .total-row.subtotal {
              color: #4b5563;
            }
            
            .total-row.tax {
              color: #6b7280;
            }
            
            .total-row.final {
              font-weight: 700;
              font-size: 20px;
              color: #1f2937;
              border-top: 2px solid #2563eb;
              margin-top: 12px;
              padding-top: 16px;
              background: white;
              margin: 12px -12px -12px -12px;
              padding: 16px 12px 0 12px;
            }
            
            .status-badge {
              display: inline-block;
              padding: 6px 16px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-top: 8px;
            }
            
            .status-draft {
              background-color: #f3f4f6;
              color: #6b7280;
            }
            
            .status-sent {
              background-color: #dbeafe;
              color: #1d4ed8;
            }
            
            .status-paid {
              background-color: #d1fae5;
              color: #065f46;
            }
            
            .status-overdue {
              background-color: #fee2e2;
              color: #dc2626;
            }
            
            .notes-section {
              margin-top: 40px;
              padding: 20px;
              background: #f9fafb;
              border-radius: 8px;
              border-left: 4px solid #2563eb;
            }
            
            .notes-section h4 {
              font-size: 16px;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 8px;
            }
            
            .notes-section p {
              color: #4b5563;
              font-size: 14px;
              line-height: 1.6;
            }
            
            .footer {
              margin-top: 60px;
              padding-top: 30px;
              border-top: 2px solid #e5e7eb;
              text-align: center;
            }
            
            .footer .thank-you {
              font-size: 18px;
              font-weight: 600;
              color: #2563eb;
              margin-bottom: 8px;
            }
            
            .footer p {
              color: #6b7280;
              font-size: 14px;
              margin-bottom: 4px;
            }
            
            @media print {
              body {
                padding: 20px;
              }
              @page {
                margin: 1in;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-info">
              <h1>${businessData?.name || "Your Business Name"}</h1>
              <p class="tagline">Professional Invoice Services</p>
              <p><strong>Email:</strong> ${businessData?.email || "business@email.com"}</p>
              <p><strong>Phone:</strong> ${businessData?.phone || "(555) 123-4567"}</p>
              <p><strong>Address:</strong> ${businessData?.address || "123 Business Street, City, State 12345"}</p>
              ${businessData?.website ? `<p><strong>Website:</strong> ${businessData.website}</p>` : ""}
              ${businessData?.taxId ? `<p><strong>Tax ID:</strong> ${businessData.taxId}</p>` : ""}
            </div>
            <div class="invoice-info">
              <h2>INVOICE</h2>
              <div class="invoice-details">
                <p><span>Invoice #:</span><strong>${invoice.number}</strong></p>
                <p><span>Date:</span><strong>${new Date(invoice.createdAt).toLocaleDateString("en-IN")}</strong></p>
                <p><span>Due Date:</span><strong>${new Date(invoice.dueDate).toLocaleDateString("en-IN")}</strong></p>
                <span class="status-badge status-${invoice.status}">${invoice.status}</span>
              </div>
            </div>
          </div>
          
          <div class="billing-section">
            <div class="billing-card">
              <h3>Bill To:</h3>
              <p class="company-name">${invoice.customerName}</p>
              ${
                customerData
                  ? `
                <p>${customerData.company}</p>
                <p><strong>Email:</strong> ${customerData.email}</p>
                ${customerData.phone ? `<p><strong>Phone:</strong> ${customerData.phone}</p>` : ""}
                ${customerData.address ? `<p><strong>Address:</strong> ${customerData.address}</p>` : ""}
              `
                  : ""
              }
            </div>
            <div class="billing-card">
              <h3>From:</h3>
              <p class="company-name">${businessData?.name || "Your Business Name"}</p>
              <p><strong>Email:</strong> ${businessData?.email || "business@email.com"}</p>
              <p><strong>Phone:</strong> ${businessData?.phone || "(555) 123-4567"}</p>
              <p><strong>Address:</strong> ${businessData?.address || "123 Business Street, City, State 12345"}</p>
            </div>
          </div>
          
          <div class="items-section">
            <table class="items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th class="amount">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${items
                  .map(
                    (item) => `
                  <tr>
                    <td class="description">${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.rate.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td class="amount">₹${item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
          
          <div class="total-section">
            <div class="total-row subtotal">
              <span>Subtotal:</span>
              <span>₹${subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            <div class="total-row tax">
              <span>Tax (${taxRate}%):</span>
              <span>₹${taxAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            <div class="total-row final">
              <span>Total:</span>
              <span>₹${total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
          
          ${
            invoice.notes
              ? `
            <div class="notes-section">
              <h4>Notes:</h4>
              <p>${invoice.notes}</p>
            </div>
          `
              : ""
          }
          
          <div class="footer">
            <p class="thank-you">Thank you for your business!</p>
            <p>Payment is due within 30 days of invoice date.</p>
            <p>For any questions regarding this invoice, please contact us at ${businessData?.email || "business@email.com"}</p>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(pdfContent)
    printWindow.document.close()

    setTimeout(() => {
      try {
        printWindow.focus()
        printWindow.print()
        setTimeout(() => {
          printWindow.close()
        }, 1000)
      } catch (error) {
        console.error("Error generating PDF:", error)
        printWindow.close()
      }
    }, 500)
  }

  return (
    <Button onClick={generatePDF} variant="outline" size="sm">
      <Download className="w-4 h-4 mr-2" />
      Download PDF
    </Button>
  )
}
