import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/projet/sidebar";


export default function GestionLivraisons() {
  const [livraisons, setLivraisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("all");

  useEffect(() => {
    const fetchLivraisons = async () => {
      try {
        const token = localStorage.getItem("token");

        // Récupérer les livraisons
        const response = await axios.get("http://localhost:8080/livraisons", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log("Données reçues:", response.data);
        setLivraisons(response.data);

      } catch (err) {
        console.error("Erreur lors du chargement des livraisons :", err);
        setError("Impossible de charger les livraisons");
      } finally {
        setLoading(false);
      }
    };

    fetchLivraisons();
  }, []);

  // Fonction pour extraire les données même si elles sont mal formatées
  const extractLivraisonData = (livraison) => {
    // Si les données sont déjà bien formatées
    if (livraison.colis && livraison.livreur) {
      return livraison;
    }
    
    // Tentative d'extraction depuis des données potentiellement mal formatées
    try {
      // Essayez de parser les données si elles sont en string
      const colisData = typeof livraison.colis === 'string' 
        ? JSON.parse(livraison.colis) 
        : livraison.colis;
      
      const livreurData = typeof livraison.livreur === 'string'
        ? JSON.parse(livraison.livreur)
        : livraison.livreur;
      
      return {
        ...livraison,
        colis: colisData,
        livreur: livreurData
      };
    } catch (e) {
      console.error("Erreur de parsing des données:", e);
      return livraison;
    }
  };

  // Filtrer les livraisons
  const filteredLivraisons = livraisons.map(extractLivraisonData).filter(livraison => {
    const livreurNom = livraison.livreur?.nom || '';
    const livreurPrenom = livraison.livreur?.prenom || '';
    const livreurNomComplet = `${livreurNom} ${livreurPrenom}`.toLowerCase();
    const destinataireAdresse = livraison.colis?.destinataireAdresse || '';
    
    const matchesSearch = 
      livreurNomComplet.includes(searchTerm.toLowerCase()) ||
      destinataireAdresse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (livraison.id?.toString().includes(searchTerm)) ||
      (livraison.colis?.numeroSuivi?.includes(searchTerm));
    
    const matchesStatut = filterStatut === "all" || 
                         (livraison.colis?.statut === filterStatut);

    return matchesSearch && matchesStatut;
  });

  // Fonction pour mettre à jour le statut d'un colis
  const updateStatutColis = async (colisId, nouveauStatut) => {
    try {
      const token = localStorage.getItem("token");
      
      await axios.put(`http://localhost:8080/colis/${colisId}/${nouveauStatut}`, 
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Mettre à jour l'état local
      setLivraisons(prev => prev.map(livraison => 
        livraison.colis?.id === colisId 
          ? {
              ...livraison,
              colis: { ...livraison.colis, statut: nouveauStatut }
            }
          : livraison
      ));

    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut :", err);
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  // Fonction pour supprimer une livraison
  const deleteLivraison = async (livraisonId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette livraison ?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      await axios.delete(`http://localhost:8080/livraisons/${livraisonId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setLivraisons(prev => prev.filter(l => l.id !== livraisonId));
      alert("Livraison supprimée avec succès");

    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
      alert("Erreur lors de la suppression de la livraison");
    }
  };

  // Obtenir la couleur du badge selon le statut
  const getStatutBadgeColor = (statut) => {
    if (!statut) return "bg-gray-100 text-gray-800 border-gray-200";
    
    const statutUpper = typeof statut === 'string' ? statut.toUpperCase() : '';
    switch (statutUpper) {
      case "EN_ATTENTE": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "EN_COURS": return "bg-blue-100 text-blue-800 border-blue-200";
      case "LIVRE": return "bg-green-100 text-green-800 border-green-200";
      case "ANNULE": return "bg-red-100 text-red-800 border-red-200";
      case "RETOURNE": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des livraisons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Contenu principal */}
      <div className="ml-64 flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Livraisons</h1>
            <p className="text-gray-600">Suivi et gestion de toutes les livraisons</p>
          </div>

          {/* Filtres et recherche */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher par livreur, adresse, ID ou numéro de suivi..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filterStatut}
                  onChange={(e) => setFilterStatut(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="EN_ATTENTE">En attente</option>
                  <option value="EN_COURS">En cours</option>
                  <option value="LIVRE">Livré</option>
                  <option value="ANNULE">Annulé</option>
                  <option value="RETOURNE">Retourné</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tableau des livraisons */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Liste des Livraisons</h2>
              <p className="text-sm text-gray-600 mt-1">{filteredLivraisons.length} livraison(s) trouvée(s)</p>
            </div>

            {error ? (
              <div className="p-6 text-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            ) : filteredLivraisons.length === 0 ? (
              <div className="p-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-4 text-gray-500">Aucune livraison trouvée</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Livraison</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Livreur</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse Destinataire</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut Colis</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Estimée</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLivraisons.map((livraison) => (
                      <tr key={livraison.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{livraison.id}
                          {livraison.colis && (
                            <div className="text-xs text-gray-500 mt-1">
                              Colis: {livraison.colis.numeroSuivi || 'N/A'}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {livraison.livreur && livraison.livreur.nom ? (
                            <div>
                              <div className="font-medium">{livraison.livreur.nom} {livraison.livreur.prenom}</div>
                              <div className="text-gray-500">{livraison.livreur.telephone || 'N/A'}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400">Non assigné</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {livraison.colis ? (
                            <div>
                              <div className="font-medium">{livraison.colis.destinataireAdresse || 'Adresse non spécifiée'}</div>
                              <div className="text-gray-500">
                                {livraison.colis.destinataireCodePostal || ''} {livraison.colis.destinataireVille || ''}
                              </div>
                            </div>
                          ) : 'Informations colis manquantes'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {livraison.colis?.statut ? (
                            <select
                              value={livraison.colis.statut}
                              onChange={(e) => updateStatutColis(livraison.colis.id, e.target.value)}
                              className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatutBadgeColor(livraison.colis.statut)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                              <option value="EN_ATTENTE">En attente</option>
                              <option value="EN_COURS">En cours</option>
                              <option value="LIVRE">Livré</option>
                              <option value="ANNULE">Annulé</option>
                              <option value="RETOURNE">Retourné</option>
                            </select>
                          ) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {livraison.dateEstimee ? (
                            new Date(livraison.dateEstimee).toLocaleDateString('fr-FR')
                          ) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => deleteLivraison(livraison.id)}
                            className="text-red-600 hover:text-red-900 px-3 py-1 rounded-md bg-red-50 hover:bg-red-100 transition-colors"
                            title="Supprimer la livraison"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}