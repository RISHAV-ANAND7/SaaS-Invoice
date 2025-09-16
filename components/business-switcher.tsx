"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Building, Plus, Check, ChevronDown, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

interface BusinessSwitcherProps {
  user: User
  activeBusiness: Business
  onBusinessSwitch: (business: Business) => void
  onAddBusiness: (businessName: string) => void
  onLogout: () => void
}

export function BusinessSwitcher({
  user,
  activeBusiness,
  onBusinessSwitch,
  onAddBusiness,
  onLogout,
}: BusinessSwitcherProps) {
  const [showAddBusiness, setShowAddBusiness] = useState(false)
  const [newBusinessName, setNewBusinessName] = useState("")

  const handleAddBusiness = (e: React.FormEvent) => {
    e.preventDefault()
    if (newBusinessName.trim()) {
      onAddBusiness(newBusinessName.trim())
      setNewBusinessName("")
      setShowAddBusiness(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-white/90 border-gray-200 hover:bg-white">
            <Building className="w-4 h-4 mr-2" />
            <span className="max-w-32 truncate">{activeBusiness.name}</span>
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="px-3 py-2 border-b">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          <div className="py-1">
            <div className="px-3 py-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Businesses</p>
            </div>
            {user.businesses.map((business) => (
              <DropdownMenuItem
                key={business.id}
                onClick={() => onBusinessSwitch(business)}
                className="flex items-center justify-between px-3 py-2 cursor-pointer"
              >
                <div className="flex items-center">
                  <Building className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-sm">{business.name}</span>
                </div>
                {business.id === activeBusiness.id && <Check className="w-4 h-4 text-primary" />}
              </DropdownMenuItem>
            ))}
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setShowAddBusiness(true)}
            className="flex items-center px-3 py-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="text-sm">Add Business</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={onLogout}
            className="flex items-center px-3 py-2 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span className="text-sm">Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showAddBusiness} onOpenChange={setShowAddBusiness}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Add New Business</DialogTitle>
            <DialogDescription className="text-gray-600">
              Create a new business account to manage separately
            </DialogDescription>
          </DialogHeader>

          <Card className="border-0 shadow-none">
            <CardContent className="pt-6">
              <form onSubmit={handleAddBusiness} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-sm font-medium text-gray-700">
                    Business Name
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="businessName"
                      value={newBusinessName}
                      onChange={(e) => setNewBusinessName(e.target.value)}
                      className="pl-10 bg-white text-gray-900"
                      placeholder="Enter business name"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowAddBusiness(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-white">
                    Add Business
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  )
}
