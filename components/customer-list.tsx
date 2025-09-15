"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Mail, Phone, Building, Trash2, Edit, Users } from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  company: string
  phone?: string
  address?: string
}

interface CustomerListProps {
  customers: Customer[]
  onCreateCustomer: () => void
  onUpdateCustomers: (customers: Customer[]) => void
}

export function CustomerList({ customers, onCreateCustomer, onUpdateCustomers }: CustomerListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteCustomer = (customerId: string) => {
    const updatedCustomers = customers.filter((customer) => customer.id !== customerId)
    onUpdateCustomers(updatedCustomers)
    localStorage.setItem("customers", JSON.stringify(updatedCustomers))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Customers</h2>
          <p className="text-gray-600 mt-1">Manage your customer database</p>
        </div>
        <Button
          onClick={onCreateCustomer}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-200 focus:border-primary focus:ring-primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl text-gray-900">
            All Customers ({filteredCustomers.length})
          </CardTitle>
          <CardDescription className="text-gray-600">
            {filteredCustomers.length === 0 && searchTerm ? "No customers match your search" : "Your customer database"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl w-fit mx-auto mb-6">
                <Users className="w-16 h-16 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                {searchTerm ? "No customers match your search" : "No customers added yet"}
              </h3>
              {!searchTerm && (
                <Button
                  onClick={onCreateCustomer}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg px-8 py-3"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Customer
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCustomers.map((customer) => (
                <Card
                  key={customer.id}
                  className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg font-bold text-gray-900 truncate">{customer.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 text-gray-600 mt-1">
                          <Building className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{customer.company}</span>
                        </CardDescription>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Mail className="w-4 h-4 flex-shrink-0 text-primary" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                    {customer.phone && (
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Phone className="w-4 h-4 flex-shrink-0 text-primary" />
                        <span>{customer.phone}</span>
                      </div>
                    )}
                    {customer.address && (
                      <div className="text-sm text-gray-600">
                        <p className="truncate">{customer.address}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
