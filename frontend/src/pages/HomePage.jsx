"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Shield, User, Truck, Package, Clock, MapPin, Star } from "lucide-react"
import axios from "axios"

export default function HomePage() {
  const [livreurs, setLivreurs] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLivreurs = async () => {
      try {
        const response = await axios.get("http://localhost:8080/livreurs")
        setLivreurs(response.data)
      } catch (error) {
        console.error("Erreur:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLivreurs()
  }, [])

  const filteredLivreurs = livreurs.filter(
    (livreur) =>
      livreur.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livreur.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livreur.id?.toString().includes(searchTerm),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">GoDeliver</h1>
                <p className="text-sm text-gray-600">Gestion de livraisons</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 text-balance">
            Gérez vos livraisons en toute
            <span className="text-green-600"> simplicité</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 text-pretty max-w-2xl mx-auto">
            Plateforme complète pour optimiser vos opérations de livraison, suivre vos colis et satisfaire vos clients.
          </p>

          {/* Access Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {/* Admin Card */}
            <Link
              to="/login"
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200"
            >
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-600 transition-colors">
                <Shield className="h-8 w-8 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Administration</h3>
              <p className="text-gray-600 mb-6">
                Gérez les utilisateurs, supervisez les livraisons et analysez les performances
              </p>
              <div className="inline-flex items-center text-green-600 font-medium group-hover:text-green-700">
                Accéder au tableau de bord
                <svg
                  className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Client Card */}
            <Link
              to="/client/dashboard"
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-600 transition-colors">
                <User className="h-8 w-8 text-orange-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Espace Client</h3>
              <p className="text-gray-600 mb-6">Suivez vos commandes, gérez vos adresses et consultez l'historique</p>
              <div className="inline-flex items-center text-orange-600 font-medium group-hover:text-orange-700">
                Accéder à mon espace
                <svg
                  className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Livreur Card */}
            <a
              href="/livreur"
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors">
                <Truck className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Espace Livreur</h3>
              <p className="text-gray-600 mb-6">
                Consultez vos tournées, mettez à jour les statuts et optimisez vos trajets
              </p>
              <div className="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                Accéder aux livraisons
                <svg
                  className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Pourquoi choisir GoDeliver ?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Une solution complète pour optimiser vos opérations de livraison
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Suivi en temps réel</h4>
              <p className="text-gray-600">Suivez vos livraisons en direct et informez vos clients automatiquement</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Optimisation des trajets</h4>
              <p className="text-gray-600">
                Algorithmes intelligents pour réduire les coûts et les délais de livraison
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Satisfaction client</h4>
              <p className="text-gray-600">
                Interface intuitive et notifications automatiques pour une expérience optimale
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">GoDeliver</span>
          </div>
          <p className="text-gray-400">© 2025 GoDeliver - Système de gestion de livraisons</p>
        </div>
      </footer>
    </div>
  )
}
