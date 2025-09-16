"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Users, IndianRupee, TrendingUp, Settings } from "lucide-react"
import { InvoiceList } from "@/components/invoice-list"
import { CreateInvoiceDialog } from "@/components/create-invoice-dialog"
import { CustomerList } from "@/components/customer-list"
import { CreateCustomerDialog } from "@/components/create-customer-dialog"
import { BusinessProfile } from "@/components/business-profile"
import { UserAuth } from "@/components/user-auth"
import { BusinessSwitcher } from "@/components/business-switcher"

interface Invoice {
  id: string
  number: string
  customerName: string
  amount: number
  status: "draft" | "sent" | "paid" | "overdue"
  dueDate: string
  createdAt: string
}

interface Customer {
  id: string
  name: string
  email: string
  company: string
  phone?: string
  address?: string
}

interface User {
  id: string
  name: string
  email: string
  businesses: Business[]
}

interface Business {
  id: string
  name: string
  isActive: boolean
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "invoices" | "customers" | "settings">("overview")
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [showCreateInvoice, setShowCreateInvoice] = useState(false)
  const [showCreateCustomer, setShowCreateCustomer] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [activeBusiness, setActiveBusiness] = useState<Business | null>(null)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCurrentUser = localStorage.getItem("currentUser")
    const savedActiveBusiness = localStorage.getItem("activeBusiness")

    if (savedCurrentUser) {
      setCurrentUser(JSON.parse(savedCurrentUser))
    }
    if (savedActiveBusiness) {
      setActiveBusiness(JSON.parse(savedActiveBusiness))
    }
  }, [])

  useEffect(() => {
    if (activeBusiness) {
      const businessKey = `business_${activeBusiness.id}`
      const savedInvoices = localStorage.getItem(`${businessKey}_invoices`)
      const savedCustomers = localStorage.getItem(`${businessKey}_customers`)

      if (savedInvoices) {
        setInvoices(JSON.parse(savedInvoices))
      } else {
        setInvoices([])
      }
      if (savedCustomers) {
        setCustomers(JSON.parse(savedCustomers))
      } else {
        setCustomers([])
      }
    }
  }, [activeBusiness])

  // Calculate dashboard stats
  const totalRevenue = invoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.amount, 0)
  const pendingAmount = invoices.filter((inv) => inv.status === "sent").reduce((sum, inv) => sum + inv.amount, 0)
  const overdueAmount = invoices.filter((inv) => inv.status === "overdue").reduce((sum, inv) => sum + inv.amount, 0)

  const handleUserLogin = (user: User, business: Business) => {
    setCurrentUser(user)
    setActiveBusiness(business)

    // Update localStorage
    localStorage.setItem("currentUser", JSON.stringify(user))
    localStorage.setItem("activeBusiness", JSON.stringify(business))
  }

  const handleBusinessSwitch = (business: Business) => {
    // Update user's active business
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        businesses: currentUser.businesses.map((b) => ({
          ...b,
          isActive: b.id === business.id,
        })),
      }

      setCurrentUser(updatedUser)
      setActiveBusiness(business)

      // Update localStorage
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      localStorage.setItem("activeBusiness", JSON.stringify(business))

      // Update users array
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const updatedUsers = users.map((u: User) => (u.id === updatedUser.id ? updatedUser : u))
      localStorage.setItem("users", JSON.stringify(updatedUsers))
    }
  }

  const handleAddBusiness = (businessName: string) => {
    if (currentUser) {
      const newBusiness: Business = {
        id: Date.now().toString(),
        name: businessName,
        isActive: false,
      }

      const updatedUser = {
        ...currentUser,
        businesses: [...currentUser.businesses, newBusiness],
      }

      setCurrentUser(updatedUser)

      // Update localStorage
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      // Update users array
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const updatedUsers = users.map((u: User) => (u.id === updatedUser.id ? updatedUser : u))
      localStorage.setItem("users", JSON.stringify(updatedUsers))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("activeBusiness")
    setCurrentUser(null)
    setActiveBusiness(null)
    setInvoices([])
    setCustomers([])
  }

  const handleCreateInvoice = (invoiceData: Omit<Invoice, "id" | "createdAt">) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    const updatedInvoices = [...invoices, newInvoice]
    setInvoices(updatedInvoices)

    if (activeBusiness) {
      const businessKey = `business_${activeBusiness.id}`
      localStorage.setItem(`${businessKey}_invoices`, JSON.stringify(updatedInvoices))
    }
    setShowCreateInvoice(false)
  }

  const handleCreateCustomer = (customerData: Omit<Customer, "id">) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
    }
    const updatedCustomers = [...customers, newCustomer]
    setCustomers(updatedCustomers)

    if (activeBusiness) {
      const businessKey = `business_${activeBusiness.id}`
      localStorage.setItem(`${businessKey}_customers`, JSON.stringify(updatedCustomers))
    }
    setShowCreateCustomer(false)
  }

  const handleUpdateInvoices = (updatedInvoices: Invoice[]) => {
    setInvoices(updatedInvoices)
    if (activeBusiness) {
      const businessKey = `business_${activeBusiness.id}`
      localStorage.setItem(`${businessKey}_invoices`, JSON.stringify(updatedInvoices))
    }
  }

  const handleUpdateCustomers = (updatedCustomers: Customer[]) => {
    setCustomers(updatedCustomers)
    if (activeBusiness) {
      const businessKey = `business_${activeBusiness.id}`
      localStorage.setItem(`${businessKey}_customers`, JSON.stringify(updatedCustomers))
    }
  }

  if (!currentUser || !activeBusiness) {
    return <UserAuth onUserLogin={handleUserLogin} currentUser={currentUser} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-lg px-6 py-3">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-primary hidden sm:inline">Billify</span>
            </div>

            <div className="flex space-x-1">
              {[
                { key: "overview", label: "Overview", icon: TrendingUp },
                { key: "invoices", label: "Invoices", icon: FileText },
                { key: "customers", label: "Customers", icon: Users },
                { key: "settings", label: "Settings", icon: Settings },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    activeTab === key
                      ? "bg-primary text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <BusinessSwitcher
                user={currentUser}
                activeBusiness={activeBusiness}
                onBusinessSwitch={handleBusinessSwitch}
                onAddBusiness={handleAddBusiness}
                onLogout={handleLogout}
              />
              <Button
                onClick={() => setShowCreateCustomer(true)}
                variant="outline"
                size="sm"
                className="border-gray-200 hover:border-primary hover:bg-primary hover:text-white bg-white text-gray-700 transition-all duration-200"
              >
                <Users className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Add Customer</span>
              </Button>
              <Button
                onClick={() => setShowCreateInvoice(true)}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white shadow-md transition-all duration-200"
              >
                <Plus className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Create Invoice</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <header className="pt-24 pb-12 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Billify</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">Turn work into payment effortlessly</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8 -mt-6">
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                    <IndianRupee className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-1">₹{totalRevenue.toLocaleString("en-IN")}</div>
                  <p className="text-sm text-gray-500">From paid invoices</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-1">₹{pendingAmount.toLocaleString("en-IN")}</div>
                  <p className="text-sm text-gray-500">Awaiting payment</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Overdue</CardTitle>
                  <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-1">₹{overdueAmount.toLocaleString("en-IN")}</div>
                  <p className="text-sm text-gray-500">Past due date</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Customers</CardTitle>
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{customers.length}</div>
                  <p className="text-sm text-gray-500">Active customers</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Invoices */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Recent Invoices</CardTitle>
                <CardDescription className="text-gray-600">Your latest invoicing activity</CardDescription>
              </CardHeader>
              <CardContent>
                {invoices.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl w-fit mx-auto mb-6">
                      <FileText className="w-16 h-16 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">No invoices yet</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Create your first invoice to get started with professional billing
                    </p>
                    <Button
                      onClick={() => setShowCreateInvoice(true)}
                      className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg px-8 py-3"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Create Your First Invoice
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {invoices.slice(0, 5).map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border border-gray-100 rounded-2xl gap-4 hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-gray-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{invoice.number}</p>
                            <p className="text-gray-600">{invoice.customerName}</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="text-left sm:text-right">
                            <p className="font-bold text-xl text-gray-900">₹{invoice.amount.toLocaleString("en-IN")}</p>
                            <p className="text-sm text-gray-500">
                              Due {new Date(invoice.dueDate).toLocaleDateString("en-IN")}
                            </p>
                          </div>
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
                            className="w-fit px-3 py-1"
                          >
                            {invoice.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "invoices" && (
          <InvoiceList
            invoices={invoices}
            onCreateInvoice={() => setShowCreateInvoice(true)}
            onUpdateInvoices={handleUpdateInvoices}
          />
        )}

        {activeTab === "customers" && (
          <CustomerList
            customers={customers}
            onCreateCustomer={() => setShowCreateCustomer(true)}
            onUpdateCustomers={handleUpdateCustomers}
          />
        )}

        {activeTab === "settings" && <BusinessProfile />}
      </main>

      {/* Dialogs */}
      <CreateInvoiceDialog
        open={showCreateInvoice}
        onOpenChange={setShowCreateInvoice}
        onCreateInvoice={handleCreateInvoice}
        customers={customers}
      />

      <CreateCustomerDialog
        open={showCreateCustomer}
        onOpenChange={setShowCreateCustomer}
        onCreateCustomer={handleCreateCustomer}
      />
    </div>
  )
}
