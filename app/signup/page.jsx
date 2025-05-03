"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SignupPage() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fieldOfStudy: "",
    year: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFieldChange = (value) => {
    
    setFormData((prev) => ({ ...prev, fieldOfStudy: value }))
  }

  const handleYearChange = (value) => {
    
    setFormData((prev) => ({ ...prev, year: value }))
    
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    
    // console.log("Form submitted:", formData)
    if (!formData.username || !formData.email || !formData.password || !formData.fieldOfStudy || !formData.year) {
      setErrorMessage('All fields are required');
      return;
    }
    console.log("Form submitted:", formData)
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Sending the data to the API
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Response data:", data);
      if (response.ok) {
        setSuccessMessage(data.message);
        router.push("/login")
      } else {
        setErrorMessage(data.error);
      }
    } catch (error) {
      setErrorMessage('An error occurred while registering the user');
    }
    // In a real app, you would send this data to your backend
    // For now, we'll just redirect to the dashboard
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-lg border-2">
        <CardHeader>
          <CardTitle className="text-3xl">Sign Up</CardTitle>
          {errorMessage && <div className="text-red-500 text-lg">{errorMessage}</div>}
          <CardDescription className="text-lg">Create an account to get started with StudyAI</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-lg">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="johndoe"
                required
                value={formData.username}
                onChange={handleChange}
                className="h-12 text-lg"
              />
              <p className="text-sm text-muted-foreground">Your unique username for the platform</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-lg">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                value={formData.email}
                onChange={handleChange}
                className="h-12 text-lg"
              />
              <p className="text-sm text-muted-foreground">We'll never share your email with anyone else</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-lg">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="h-12 text-lg"
              />
              <p className="text-sm text-muted-foreground">Must be at least 8 characters</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fieldOfStudy" className="text-lg">
                Field of Study
              </Label>
              <Select value={formData.fieldOfStudy} onValueChange={handleFieldChange}>
                <SelectTrigger className="h-12 text-lg">
                  <SelectValue placeholder="Select your field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="computer_science" className="text-lg">
                    Computer Science
                  </SelectItem>
                  <SelectItem value="medicine" className="text-lg">
                    Medicine
                  </SelectItem>
                  <SelectItem value="engineering" className="text-lg">
                    Engineering
                  </SelectItem>
                  <SelectItem value="business" className="text-lg">
                    Business
                  </SelectItem>
                  <SelectItem value="arts" className="text-lg">
                    Arts & Humanities
                  </SelectItem>
                  <SelectItem value="science" className="text-lg">
                    Natural Sciences
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">This helps us personalize your experience</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year" className="text-lg">
                Year of Study
              </Label>
              <Select value={formData.year} onValueChange={handleYearChange}>
                <SelectTrigger className="h-12 text-lg">
                  <SelectValue placeholder="Select your year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1" className="text-lg">
                    First Year
                  </SelectItem>
                  <SelectItem value="2" className="text-lg">
                    Second Year
                  </SelectItem>
                  <SelectItem value="3" className="text-lg">
                    Third Year
                  </SelectItem>
                  <SelectItem value="4" className="text-lg">
                    Fourth Year
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Your current academic year</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full h-14 text-lg" size="lg">
              Create Account
            </Button>
            <div className="text-lg text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
