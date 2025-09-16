"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Lock, Building, Plus } from "lucide-react"

interface Business {
  id: string
  name: string
  isActive: boolean
}

interface UserAuthProps {
  onUserLogin: (user: any, activeBusiness: any) => void
  currentUser: any | null
}

export function UserAuth({ onUserLogin, currentUser }: UserAuthProps) {
  const [showAuth, setShowAuth] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    businessName: "",
  })

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("currentUser")
    const savedBusiness = localStorage.getItem("activeBusiness")

    if (savedUser && savedBusiness && !currentUser) {
      const user = JSON.parse(savedUser)
      const business = JSON.parse(savedBusiness)
      onUserLogin(user, business)
    } else if (!savedUser && !currentUser) {
      setShowAuth(true)
    }
  }, [currentUser, onUserLogin])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isLogin) {
      // Login logic - simulate finding user
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const user = users.find((u: any) => u.email === formData.email)

      if (user) {
        const activeBusiness = user.businesses.find((b: any) => b.isActive) || user.businesses[0]
        localStorage.setItem("currentUser", JSON.stringify(user))
        localStorage.setItem("activeBusiness", JSON.stringify(activeBusiness))
        onUserLogin(user, activeBusiness)
        setShowAuth(false)
      } else {
        alert("User not found. Please sign up first.")
      }
    } else {
      // Sign up logic
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        businesses: [
          {
            id: Date.now().toString(),
            name: formData.businessName,
            isActive: true,
          },
        ],
      }

      const users = JSON.parse(localStorage.getItem("users") || "[]")
      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      const activeBusiness = newUser.businesses[0]
      localStorage.setItem("currentUser", JSON.stringify(newUser))
      localStorage.setItem("activeBusiness", JSON.stringify(activeBusiness))

      onUserLogin(newUser, activeBusiness)
      setShowAuth(false)
    }

    // Reset form
    setFormData({ name: "", email: "", password: "", businessName: "" })
  }

  if (!showAuth && currentUser) {
    return null
  }

  return (
    <Dialog open={showAuth} onOpenChange={() => {}}>
      <DialogContent className="w-[95vw] max-w-md" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 text-center">
            {isLogin ? "Welcome Back" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-center">
            {isLogin ? "Sign in to your InvoiceFlow account" : "Start managing your invoices today"}
          </DialogDescription>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name
                  </Label>
                  <div className="relative">
                    <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10 bg-white text-gray-900"
                      placeholder="John Doe"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 bg-white text-gray-900"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 bg-white text-gray-900"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-sm font-medium text-gray-700">
                    Business Name
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="pl-10 bg-white text-gray-900"
                      placeholder="Your Business Name"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
