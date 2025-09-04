// LoginForm.jsx
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import instance from "@/axios/axios"
import { useNavigate } from "react-router-dom"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const response = await instance.post("/auth/login", { email, motDePasse: password })

      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      
      const role = response.data.role; // au lieu de response.data.user.role

      if(role === "ADMIN") {
        navigate("/admin/dashboard")
      } else {
        navigate("/livreur/dashboard")
      } 

    } catch (err) {
      console.error("Login failed", err)
      setErrorMessage("❌ Email ou mot de passe incorrect")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")
    try {
      await handleLogin()
    } catch (err) {
      console.log(err)
      setErrorMessage("⚠️ Une erreur est survenue, réessayez.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-20">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Email address</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {errorMessage && (
            <p className="text-red-600 text-sm">{errorMessage}</p>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="animate-spin" /> : "Sign In"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <a href="/register" className="text-sm text-blue-600">Don't have an account? Sign Up</a>
      </CardFooter>
    </Card>
  )
}
