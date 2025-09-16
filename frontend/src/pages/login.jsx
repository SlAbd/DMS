"use client"

// LoginForm.jsx
import { useState } from "react"
import { Loader2, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
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

      const role = response.data.role // au lieu de response.data.user.role

      if (role === "ADMIN") {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">GoDeliver Admin</h1>
          <p className="text-green-600">Système de gestion de livraisons</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
          <CardContent className="pt-8 pb-6 px-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-green-800 font-medium">Adresse email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 border-green-200 focus:border-green-500 focus:ring-green-500"
                  placeholder="admin@GoDeliver.com"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-green-800 font-medium">Mot de passe</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 border-green-200 focus:border-green-500 focus:ring-green-500"
                  placeholder="••••••••"
                />
              </div>

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{errorMessage}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-green-600 text-sm mt-6">Accès réservé aux administrateurs GoDeliver</p>
      </div>
    </div>
  )
}
