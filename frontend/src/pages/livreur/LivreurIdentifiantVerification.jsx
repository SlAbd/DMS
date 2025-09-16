"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Truck, User, ArrowRight, AlertCircle, CheckCircle } from "lucide-react"
import instance from "@/axios/axios"

export default function LivreurIdentifiantVerification({ email, onBack }) {
  const [identifiant, setIdentifiant] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

   const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Appel à l'API avec Axios
      const response = await instance.post("/livreur/verifier-identifiant", { identifiantLivreur: identifiant })

      if (response.status === 200) {
        const livreurData = response.data
        // Redirection vers l'espace livreur avec state
        navigate(`/livreur/${livreurData.id}`, { state: { livreur: livreurData } })
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || "Identifiant incorrect")
      } else {
        setError("Erreur de connexion")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Espace Livreur</h1>
          <p className="text-gray-600">Étape 2 : Entrez votre identifiant</p>
        </div>

        {/* Confirmation email */}
        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-700 text-sm">
              Email vérifié : <strong>{email}</strong>
            </span>
          </div>
        </div>

        {/* Formulaire identifiant */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="identifiant" className="block text-sm font-medium text-gray-700 mb-2">
              Identifiant livreur
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="identifiant"
                type="text"
                placeholder="Ex: DUP5238"
                value={identifiant}
                onChange={(e) => setIdentifiant(e.target.value)}
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

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
            >
              Retour
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  Accéder à mon espace
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Informations */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">Identifiant unique</h3>
              <p className="text-blue-600 text-sm">
                Votre identifiant vous a été communiqué par l'administrateur. Contactez le support si vous ne le
                possédez pas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
