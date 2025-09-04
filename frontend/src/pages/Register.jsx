// RegisterForm.jsx
import { useState } from "react"
import { Mail, Lock, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import instance from "@/axios/axios"
import { useNavigate } from "react-router-dom"


export default function RegisterForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState("CLIENT")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async () => {
    try {
      const response = await instance.post("/auth/register", {
        nom: name,
        email,
        motDePasse: password,
        role
      })

      navigate("/") // Redirect to the appropriate dashboard based on role
    } catch (error) {
      console.error("Registration error:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Form submitted")
    setIsLoading(true)
    try {
      await handleRegister()
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Card className="max-w-md mx-auto mt-20">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <RadioGroup value={role} onValueChange={setRole} className="flex gap-4">
              <RadioGroupItem value="ADMIN" id="admin" />
              <Label htmlFor="admin">Admin</Label>
              <RadioGroupItem value="LIVREUR" id="livreur" />
              <Label htmlFor="livreur">Livreur</Label>
            </RadioGroup>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="animate-spin" /> : "Sign Up"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <a href="/login" className="text-sm text-blue-600">Already have an account? Sign In</a>
      </CardFooter>
    </Card>
  )
}
