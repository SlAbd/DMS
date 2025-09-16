"use client"

import { useState } from "react"
import { Truck, Mail, ArrowRight, AlertCircle } from "lucide-react"
import instance from "@/axios/axios"

export default function LivreurEmailVerification({ onEmailVerified }) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await instance.post("/livreur/verifier-email", { email })

      // Si tout est OK
      if (response.status === 200) {
        onEmailVerified(email)
      }
    } catch (err) {
      // Gestion des erreurs
      if (err.response) {
        setError(err.response.data.error || "Email non trouvé")
      } else {
        setError("Erreur de connexion")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Espace Livreur</h1>
          <p className="text-gray-600">Étape 1 : Vérifiez votre email</p>
        </div>

        {/* Formulaire de vérification email */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Adresse email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="email"
                type="email"
                placeholder="votre.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Mail className="h-5 w-5" />
                Vérifier l'email
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        {/* Informations */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">Première connexion ?</h3>
              <p className="text-blue-600 text-sm">
                Utilisez l'adresse email fournie par votre administrateur lors de votre inscription.
              </p>
            </div>
          </div>
        </div>

        {/* Lien retour */}
        <div className="mt-6 text-center">
          <a href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            ← Retour à la page d'accueil
          </a>
        </div>
      </div>
    </div>
  )
}
