import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Truck, MapPin, Phone, CheckCircle, Clock, Package, 
  User, Mail, RefreshCw, AlertCircle 
} from "lucide-react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LivreurPage() {
  const { livreurId } = useParams();
  const [livreur, setLivreur] = useState(null);
  const [livraisons, setLivraisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingColis, setUpdatingColis] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer le profil du livreur
        const profilResponse = await axios.get(`http://localhost:8080/users/${livreurId}`);
        setLivreur(profilResponse.data);
        
        // Récupérer les livraisons du livreur
        const livraisonsResponse = await axios.get(`http://localhost:8080/livraisons/livreur/${livreurId}`);
        setLivraisons(livraisonsResponse.data);
        
      } catch (err) {
        console.error("Erreur:", err);
        setError("Impossible de charger les données du livreur");
      } finally {
        setLoading(false);
      }
    };

    if (livreurId) {
      fetchData();
    }
  }, [livreurId]);

  // Fonction pour mettre à jour le statut d'un colis
  const updateColisStatus = async (colisId, nouveauStatut) => {
    try {
      setUpdatingColis(colisId);
      
      // Préparer les données pour la requête
      const requestData = {
        statut: nouveauStatut // Spring convertira automatiquement la string en enum
      };
      
      const response = await axios.put(
        `http://localhost:8080/colis/${colisId}/statut`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Mettre à jour l'état local
      setLivraisons(prevLivraisons => 
        prevLivraisons.map(livraison => 
          livraison.colis?.id === colisId 
            ? {
                ...livraison,
                colis: { 
                  ...livraison.colis, 
                  statut: nouveauStatut 
                }
              }
            : livraison
        )
      );

      toast.success(response.data.message || "Statut mis à jour avec succès");
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      
      if (error.response?.data?.error) {
        toast.error(`${error.response.data.error}: ${error.response.data.message}`);
      } else {
        toast.error("Erreur lors de la mise à jour du statut");
      }
    } finally {
      setUpdatingColis(null);
    }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case "EN_ATTENTE": return "bg-amber-100 text-amber-800 border-amber-300";
      case "EN_COURS": return "bg-blue-100 text-blue-800 border-blue-300";
      case "LIVRE": return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "ANNULE": return "bg-red-100 text-red-800 border-red-300";
      case "RETOURNE": return "bg-purple-100 text-purple-800 border-purple-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (statut) => {
    switch (statut) {
      case "EN_ATTENTE": return <Clock className="w-4 h-4" />;
      case "EN_COURS": return <Truck className="w-4 h-4" />;
      case "LIVRE": return <CheckCircle className="w-4 h-4" />;
      case "ANNULE": return <Package className="w-4 h-4" />;
      case "RETOURNE": return <RefreshCw className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusText = (statut) => {
    switch (statut) {
      case "EN_ATTENTE": return "En attente";
      case "EN_COURS": return "En cours";
      case "LIVRE": return "Livré";
      case "ANNULE": return "Annulé";
      case "RETOURNE": return "Retourné";
      default: return statut;
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case "EN_ATTENTE": return "EN_COURS";
      case "EN_COURS": return "LIVRE";
      case "LIVRE": return null; // Pas de prochain statut après "Livré"
      default: return null;
    }
  };

  const getActionButtonText = (currentStatus) => {
    switch (currentStatus) {
      case "EN_ATTENTE": return "Commencer la livraison";
      case "EN_COURS": return "Marquer comme livré";
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Profil Livreur */}
        {livreur && (
          <Card className="mb-8 border-blue-100 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg py-4">
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profil</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16 border-2 border-blue-200">
                    <AvatarFallback className="text-lg bg-blue-100 text-blue-800">
                      {livreur.nom?.[0]}{livreur.prenom?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-slate-800">{livreur.nom} {livreur.prenom}</h3>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Mail className="w-4 h-4" />
                      <span>{livreur.email || "Non renseigné"}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4" />
                      <span>{livreur.telephone || "Non renseigné"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Livraisons */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <CardTitle className="flex items-center space-x-2">
              <Truck className="w-5 w-5" />
              <span>Mes Commandes</span>
              <Badge variant="secondary" className="ml-2">
                {livraisons.length} livraison(s)
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {livraisons.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">Aucune livraison assignée</h3>
                <p className="text-sm text-slate-500">
                  Aucune livraison n'est actuellement assignée à ce livreur.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {livraisons.map((livraison) => {
                  const colis = livraison.colis;
                  const nextStatus = getNextStatus(colis?.statut);
                  const actionText = getActionButtonText(colis?.statut);
                  
                  return (
                    <div key={livraison.id} className="p-6 border border-slate-200 rounded-lg hover:shadow-md transition-shadow bg-white">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-slate-800 text-lg">
                            Livraison #{livraison.id}
                          </h4>
                          <p className="text-sm text-slate-600 mt-1">
                            Colis: {colis?.numeroSuivi || `COLIS-${colis?.id}`}
                          </p>
                        </div>
                        <Badge className={getStatusColor(colis?.statut)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(colis?.statut)}
                            <span>{getStatusText(colis?.statut)}</span>
                          </div>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-slate-500" />
                            <span className="text-slate-700">
                              {colis?.destinataireAdresse || "Adresse non spécifiée"}
                            </span>
                          </div>
                          {colis?.destinataireVille && (
                            <div className="flex items-center space-x-2 text-sm text-slate-600">
                              <span>{colis.destinataireVille}</span>
                              {colis.destinataireCodePostal && (
                                <span>({colis.destinataireCodePostal})</span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Date estimée:</span>
                            <span className="font-medium text-slate-800">
                              {livraison.dateEstimee ? new Date(livraison.dateEstimee).toLocaleDateString('fr-FR') : 'Non spécifiée'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Poids:</span>
                            <span className="font-medium text-slate-800">
                              {colis?.poids ? `${colis.poids} kg` : 'Non spécifié'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Téléphone:</span>
                            <span className="font-medium text-slate-800">
                              {colis?.destinataireTelephone || 'Non renseigné'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      {nextStatus && (
                        <div className="flex space-x-3 pt-4 border-t border-slate-200">
                          <Button
                            onClick={() => updateColisStatus(colis.id, nextStatus)}
                            disabled={updatingColis === colis.id}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {updatingColis === colis.id ? (
                              <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Mise à jour...
                              </>
                            ) : (
                              <>
                                <Truck className="w-4 h-4 mr-2" />
                                {actionText}
                              </>
                            )}
                          </Button>

                          <Button variant="outline" className="border-slate-300">
                            <Phone className="w-4 h-4 mr-2" />
                            Appeler
                          </Button>

                          {(colis?.statut === "EN_ATTENTE" || colis?.statut === "EN_COURS") && (
                            <Button 
                              variant="outline" 
                              className="border-red-300 text-red-600 hover:bg-red-50"
                              onClick={() => updateColisStatus(colis.id, "ANNULE")}
                              disabled={updatingColis === colis.id}
                            >
                              <AlertCircle className="w-4 h-4 mr-2" />
                              Annuler
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}