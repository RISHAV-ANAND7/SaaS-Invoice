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
}

interface InvoicePDFProps {
  invoice: Invoice
  customerData?: {
    company: string
    email: string
    address?: string
    phone?: string
  }
}

export function InvoicePDF({ invoice, customerData }: InvoicePDFProps) {
  const generatePDF = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("Please allow popups to download the PDF")
      return
    }

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
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px 20px;
            }
            
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 2px solid #e5e7eb;
            }
            
            .company-info h1 {
              font-size: 28px;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 8px;
            }
            
            .company-info p {
              color: #6b7280;
              font-size: 14px;
            }
            
            .invoice-info {
              text-align: right;
            }
            
            .invoice-info h2 {
              font-size: 24px;
              color: #1f2937;
              margin-bottom: 8px;
            }
            
            .invoice-info p {
              color: #6b7280;
              font-size: 14px;
              margin-bottom: 4px;
            }
            
            .billing-section {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
              margin-bottom: 40px;
            }
            
            .billing-info h3 {
              font-size: 16px;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 12px;
            }
            
            .billing-info p {
              color: #4b5563;
              font-size: 14px;
              margin-bottom: 4px;
            }
            
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            
            .items-table th {
              background-color: #f9fafb;
              padding: 12px;
              text-align: left;
              font-weight: 600;
              color: #1f2937;
              border-bottom: 1px solid #e5e7eb;
            }
            
            .items-table td {
              padding: 12px;
              border-bottom: 1px solid #f3f4f6;
              color: #4b5563;
            }
            
            .items-table .amount {
              text-align: right;
            }
            
            .total-section {
              margin-left: auto;
              width: 300px;
            }
            
            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #f3f4f6;
            }
            
            .total-row.final {
              font-weight: bold;
              font-size: 18px;
              color: #1f2937;
              border-bottom: 2px solid #1f2937;
              margin-top: 8px;
            }
            
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
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
            
            .footer {
              margin-top: 60px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
              font-size: 12px;
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
              <h1>InvoiceFlow</h1>
              <p>Professional Invoicing Solution</p>
              <p>contact@invoiceflow.com</p>
            </div>
            <div class="invoice-info">
              <h2>INVOICE</h2>
              <p><strong>Invoice #:</strong> ${invoice.number}</p>
              <p><strong>Date:</strong> ${new Date(invoice.createdAt).toLocaleDateString("en-IN")}</p>
              <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString("en-IN")}</p>
              <span class="status-badge status-${invoice.status}">${invoice.status}</span>
            </div>
          </div>
          
          <div class="billing-section">
            <div class="billing-info">
              <h3>Bill To:</h3>
              <p><strong>${invoice.customerName}</strong></p>
              ${
                customerData
                  ? `
                <p>${customerData.company}</p>
                <p>${customerData.email}</p>
                ${customerData.phone ? `<p>${customerData.phone}</p>` : ""}
                ${customerData.address ? `<p>${customerData.address}</p>` : ""}
              `
                  : ""
              }
            </div>
            <div class="billing-info">
              <h3>From:</h3>
              <p><strong>Your Business Name</strong></p>
              <p>123 Business Street</p>
              <p>City, State 12345</p>
              <p>business@email.com</p>
              <p>(555) 123-4567</p>
            </div>
          </div>
          
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
              <tr>
                <td>Professional Services</td>
                <td>1</td>
                <td>₹${invoice.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                <td class="amount">₹${invoice.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="total-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>₹${invoice.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            <div class="total-row">
              <span>Tax (0%):</span>
              <span>₹0.00</span>
            </div>
            <div class="total-row final">
              <span>Total:</span>
              <span>₹${invoice.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for your business!</p>
            <p>Payment is due within 30 days of invoice date.</p>
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
        // Close window after a delay to ensure print dialog appears
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
