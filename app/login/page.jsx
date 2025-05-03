"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { cookies } from 'next/headers';

export default function LoginPage() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    
    // In a real app, you would authenticate with your backend
    // For now, we'll just redirect to the dashboard
    console.log("Form submitted:", formData)
    if (!formData.username || !formData.password) {
      // console.log("Form submitted2:", formData)
      setErrorMessage('Email and password are required');
      return;
    }
    // console.log("Form submitted:", formData)
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Sending the data to the API
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      console.log(response);
      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        // Store the token (could be in localStorage or cookies)
        // const token = cookies().get('token')?.value;
        localStorage.setItem('token', data.token);
        
        router.push("/dashboard")
      } else {
        setErrorMessage(data.error);
      }
    } catch (error) {
      setErrorMessage('An error occurred while logging in');
    }
    
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-lg border-2">
        <CardHeader>
          <CardTitle className="text-3xl">Log In</CardTitle>
          {errorMessage && <div className="text-red-500 text-lg">{errorMessage}</div>}
          {successMessage && <div className="text-green-500 text-lg">{successMessage}</div>}
          <CardDescription className="text-lg">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-lg">
                Email
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="h-12 text-lg"
              />
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
              <div className="text-right">
                <Link href="/forgot-password" className="text-lg text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full h-14 text-lg" size="lg">
              Log In
            </Button>
            <div className="text-lg text-center text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
