"use client"

import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Package, CheckCircle, Clock, MapPin, Search, Calendar, ArrowLeft, Shield, Headphones, Zap } from "lucide-react"
import './globals.css'

export default function ClientDashboard() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [trackingResult, setTrackingResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleTrack = async () => {
    if (!trackingNumber.trim()) return

    setIsLoading(true)
    setError(null)
    setTrackingResult(null)

    try {
      const token = localStorage.getItem("token")
      
      const response = await axios.get(`http://localhost:8080/colis/numero-suivi/${trackingNumber.trim()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const colis = response.data

      // Formater les données pour l'affichage
      setTrackingResult({
        trackingNumber: colis.numeroSuivi,
        status: getStatusDisplay(colis.statut),
        estimatedDelivery: colis.dateEstimee ? new Date(colis.dateEstimee).toLocaleDateString('fr-FR') : "Non estimée",
        currentLocation: getCurrentLocation(colis.statut),
        timeline: generateTimeline(colis),
        colisDetails: colis
      })

    } catch (err) {
      console.error("Erreur lors du suivi:", err)
      
      if (err.response?.status === 404) {
        setError("Aucun colis trouvé avec ce numéro de suivi")
      } else if (err.response?.status === 401) {
        setError("Authentification requise - Veuillez vous connecter")
      } else if (err.response?.status === 500) {
        setError("Erreur serveur - Veuillez réessayer plus tard")
      } else {
        setError("Erreur lors de la recherche du colis")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction pour générer la timeline
  const generateTimeline = (colis) => {
    const timeline = []
    const creationDate = colis.dateCreation ? new Date(colis.dateCreation) : new Date()

    // Étape 1: Commande confirmée
    timeline.push({
      status: "Commande confirmée",
      date: creationDate.toLocaleDateString('fr-FR'),
      time: creationDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      completed: true,
    })

    // Étape 2: Colis expédié
    const shippedDate = new Date(creationDate.getTime() + 24 * 60 * 60 * 1000)
    timeline.push({
      status: "Colis expédié",
      date: shippedDate.toLocaleDateString('fr-FR'),
      time: "09:00",
      completed: colis.statut !== "EN_ATTENTE",
    })

    // Étape 3: En transit
    const transitDate = new Date(creationDate.getTime() + 48 * 60 * 60 * 1000)
    timeline.push({
      status: "En transit",
      date: transitDate.toLocaleDateString('fr-FR'),
      time: "14:30",
      completed: colis.statut === "EN_COURS" || colis.statut === "LIVRE",
    })

    // Étape 4: Livraison
    const deliveryDate = colis.dateEstimee ? new Date(colis.dateEstimee) : new Date(creationDate.getTime() + 72 * 60 * 60 * 1000)
    timeline.push({
      status: colis.statut === "LIVRE" ? "Livré" : "Livraison prévue",
      date: deliveryDate.toLocaleDateString('fr-FR'),
      time: colis.statut === "LIVRE" ? "12:00" : "Estimé",
      completed: colis.statut === "LIVRE",
    })

    return timeline
  }

  // Fonction pour obtenir la localisation actuelle
  const getCurrentLocation = (statut) => {
    switch (statut) {
      case "EN_ATTENTE":
        return "En attente de prise en charge"
      case "EN_COURS":
        return "En transit vers le destinataire"
      case "LIVRE":
        return "Colis livré"
      case "ANNULE":
        return "Livraison annulée"
      default:
        return "Statut inconnu"
    }
  }

  // Fonction pour afficher le statut en français
  const getStatusDisplay = (statut) => {
    switch (statut) {
      case "EN_ATTENTE":
        return "En attente"
      case "EN_COURS":
        return "En cours"
      case "LIVRE":
        return "Livré"
      case "ANNULE":
        return "Annulé"
      default:
        return statut
    }
  }

  const resetTracking = () => {
    setTrackingResult(null)
    setTrackingNumber("")
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                TrDeL
              </h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="/" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                Accueil
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section with Image */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-0 top-0 w-1/3 h-full bg-gradient-to-r from-blue-600/30 to-transparent"></div>
          <div className="absolute right-0 top-0 w-2/3 h-full">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596526131083-e8c633c3c6ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Suivez votre <span className="text-yellow-300">livraison</span> en temps réel
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Obtenez des mises à jour instantanées sur l'emplacement de votre colis et une estimation précise de sa livraison
            </p>
            
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Ex: TRK123456789"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="flex-1 pl-10 py-3 bg-white text-foreground border-0"
                    onKeyPress={(e) => e.key === "Enter" && handleTrack()}
                  />
                </div>
                <Button
                  onClick={handleTrack}
                  disabled={!trackingNumber.trim() || isLoading}
                  className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 py-3 px-6 font-bold transition-all duration-300 shadow-md"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-900 mr-2"></div>
                      Recherche...
                    </>
                  ) : (
                    "Suivre mon colis"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      {/* Tracking Results Section */}
      <section className="py-16 bg-white" id="tracking-results">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {error && (
              <Card className="shadow-lg border-0 mb-6 border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                      <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-red-800 mb-2">Erreur</h3>
                    <p className="text-red-600">{error}</p>
                    <Button
                      onClick={resetTracking}
                      className="mt-4 bg-red-600 hover:bg-red-700"
                    >
                      Réessayer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {trackingResult && (
              <div className="space-y-6 animate-fade-in">
                {/* Back button */}
                <button 
                  onClick={resetTracking}
                  className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Nouvelle recherche
                </button>

                {/* Status Overview */}
                <Card className="shadow-lg border-0 overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-blue-600 h-2 w-full"></div>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <CardTitle className="text-xl">
                        Colis <span className="text-primary">#{trackingResult.trackingNumber}</span>
                      </CardTitle>
                      <Badge 
                        className="text-sm py-1 px-3 bg-primary/10 text-primary border-primary/20 self-start md:self-auto"
                        variant="outline"
                      >
                        {trackingResult.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <MapPin className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-muted-foreground">Position actuelle</p>
                          <p className="text-foreground">{trackingResult.currentLocation}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg">
                        <div className="p-2 bg-green-100 rounded-full">
                          <Calendar className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-muted-foreground">Livraison estimée</p>
                          <p className="text-foreground">{trackingResult.estimatedDelivery}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Timeline */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-xl">Historique de livraison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {/* Vertical line */}
                      <div className="absolute left-7 top-2 h-[calc(100%-1rem)] w-0.5 bg-border -z-10"></div>
                      
                      <div className="space-y-8">
                        {trackingResult.timeline.map((event, index) => (
                          <div key={index} className="flex items-start gap-6">
                            <div className="flex flex-col items-center mt-1">
                              {event.completed ? (
                                <div className="p-2 bg-green-100 rounded-full">
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                              ) : (
                                <div className="p-2 bg-slate-100 rounded-full">
                                  <Clock className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className={`flex-1 pb-8 ${index === trackingResult.timeline.length - 1 ? 'pb-0' : ''}`}>
                              <p className={`font-medium ${event.completed ? "text-foreground" : "text-muted-foreground"}`}>
                                {event.status}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {event.date} à {event.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Détails du colis */}
                {trackingResult.colisDetails && (
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="text-xl">Détails du colis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Expéditeur pay</p>
                          <p className="font-medium">{trackingResult.colisDetails.expideteurPays || "Non spécifié"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Expéditeur ville</p>
                          <p className="font-medium">{trackingResult.colisDetails.expideteurVille || "Non spécifié"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Expéditeur téléphone</p>
                          <p className="font-medium">{trackingResult.colisDetails.expideteurTelephone || "Non spécifié"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Expéditeur adresse</p>
                          <p className="font-medium">{trackingResult.colisDetails.expideteurAdresse || "Non spécifié"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Poids de colis</p>
                          <p className="font-medium">{trackingResult.colisDetails.poids ? `${trackingResult.colisDetails.poids} kg` : "Non spécifié"}</p>
                        </div>
                        <div></div>
                        <div>
                          <p className="text-sm text-muted-foreground">Destinataire pay</p>
                          <p className="font-medium">{trackingResult.colisDetails.destinatairePays || "Non spécifié"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Destinataire ville</p>
                          <p className="font-medium">{trackingResult.colisDetails.destinataireVille || "Non spécifié"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Destinataire téléphone</p>
                          <p className="font-medium">{trackingResult.colisDetails.destinataireTelephone || "Non spécifié"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Destinataire adresse</p>
                          <p className="font-medium">{trackingResult.colisDetails.destinataireAdresse || "Non spécifié"}</p>
                        </div>
                        
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Pourquoi choisir TrDeL ?</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Suivi en temps réel</h4>
              <p className="text-muted-foreground">
                Obtenez des mises à jour instantanées sur chaque étape du trajet de votre colis.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Sécurité garantie</h4>
              <p className="text-muted-foreground">
                Vos colis sont entre de bonnes mains avec notre système de suivi sécurisé.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Support 24/7</h4>
              <p className="text-muted-foreground">
                Notre équipe est disponible à tout moment pour répondre à vos questions.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}