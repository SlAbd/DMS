import { useState } from "react"
import { Package, Mail, Lock, User, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import instance from "@/axios/axios"
import { useNavigate } from "react-router-dom"

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState("CLIENT")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    // Create login payload
    const loginData = {
      email,
      motDePasse: password,
    }
    try {
      // Make the API call using axios instance
      const response = await instance.post("/auth/login", loginData)
      console.log(response.data)
      navigate("/dashboard")
      return { success: true }
    } catch (error) {
      console.error("Error during login:", error)
      return { success: false, error: error.message || "Login failed" }
    }
  }

  const handleRegister = async () => {
    // Create register payload
    const registerData = {
      nom: name,
      email,
      motDePasse: password,
      role,
    }
    try {
      const response = await instance.post("/auth/register", registerData)
      console.log(response.data)
      return { success: true }
    } catch (error) {
      console.error("Error during registration:", error)
      return { success: false, error: error.message || "Registration failed" }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (isLogin) {
        await handleLogin()
      } else {
        await handleRegister()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Package className="h-12 w-12 text-black" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold">
          {isLogin ? "Sign in to your account" : "Create a new account"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700">
                      Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700">Role</Label>
                    <RadioGroup value={role} onValueChange={setRole} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="CLIENT" id="client" />
                        <Label htmlFor="client">Client</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="LIVREUR" id="livreur" />
                        <Label htmlFor="livreur">Livreur</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 hover:cursor-pointer hover:bg-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-black hover:text-black hover:cursor-pointer"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

