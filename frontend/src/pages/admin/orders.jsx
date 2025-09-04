import { useEffect, useState } from "react";
import axios from "@/axios/axios";
import { BarChart2, LogOut, Package, Truck } from "lucide-react";
import Sidebar from "@/components/projet/sidebar";


export default function ColisManagement() {
  const [colis, setColis] = useState([]);
  const [livreurs, setLivreurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingLivreurs, setLoadingLivreurs] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    enAttente: 0,
    enCours: 0,
    livre: 0,
    annule: 0
  });

  const [formData, setFormData] = useState({
    description: "",
    poids: 0,
    expideteurPays: "",
    destinatairePays: "",
    expideteurVille: "",
    destinataireVille: "",
    expideteurCodePostal: "",
    destinataireCodePostal: "",
    expideteurAdresse: "",
    destinataireAdresse: "",
    expideteurTelephone: "",
    destinataireTelephone: "",
    statut: "EN_ATTENTE"
  });

  const [assigning, setAssigning] = useState(null); // { colisId: number, livreurId: number }

  useEffect(() => {
    fetchColis();
    fetchStats();
    fetchLivreurs();
  }, []);

  const fetchColis = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("/colis", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setColis(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des colis:", err);
      setError("Impossible de charger les colis");
    } finally {
      setLoading(false);
    }
  };

  const fetchLivreurs = async () => {
    try {
      setLoadingLivreurs(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("/livreurs/disponibles", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLivreurs(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des livreurs:", err);
    } finally {
      setLoadingLivreurs(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/colis/statistiques", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setStats({
        total: response.data.total_colis || 0,
        enAttente: response.data.par_statut?.EN_ATTENTE || 0,
        enCours: response.data.par_statut?.EN_COURS || 0,
        livre: response.data.par_statut?.LIVRE || 0,
        annule: response.data.par_statut?.ANNULE || 0
      });
    } catch (err) {
      console.error("Erreur lors du chargement des statistiques:", err);
    }
  };

  const handleCreateColis = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      
      // Préparer les données avec les bons noms de champs
      const colisData = {
        description: formData.description,
        poids: parseFloat(formData.poids) || 0,
        expideteurPays: formData.expideteurPays,
        destinatairePays: formData.destinatairePays,
        expideteurVille: formData.expideteurVille,
        destinataireVille: formData.destinataireVille,
        expideteurCodePostal: formData.expideteurCodePostal ? parseInt(formData.expideteurCodePostal) : null,
        destinataireCodePostal: formData.destinataireCodePostal ? parseInt(formData.destinataireCodePostal) : null,
        expideteurAdresse: formData.expideteurAdresse,
        destinataireAdresse: formData.destinataireAdresse,
        expideteurTelephone: formData.expideteurTelephone,
        destinataireTelephone: formData.destinataireTelephone,
        statut: "EN_ATTENTE" // Toujours mettre EN_ATTENTE par défaut
      };

      console.log("Données envoyées:", colisData); // Pour debug

      const response = await axios.post(
        "/colis",
        colisData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Ajouter le nouveau colis à la liste
      setColis(prev => [response.data, ...prev]);
      
      // Mettre à jour les statistiques
      fetchStats();
      
      // Réinitialiser le formulaire
      setFormData({
        description: "",
        poids: 0,
        expideteurPays: "",
        destinatairePays: "",
        expideteurVille: "",
        destinataireVille: "",
        expideteurCodePostal: "",
        destinataireCodePostal: "",
        expideteurAdresse: "",
        destinataireAdresse: "",
        expideteurTelephone: "",
        destinataireTelephone: "",
        statut: "EN_ATTENTE"
      });
      
      setShowForm(false);
      alert("Colis créé avec succès!");

    } catch (err) {
      console.error("Erreur détaillée:", err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        "Erreur lors de la création du colis"
      );
    } finally {
      setCreating(false);
    }
  };

  const handleAssignColis = async (colisId, livreurId) => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        "/livraisons",
        {
          colisId,
          livreurId,
          dateEstimee: new Date().toISOString().split("T")[0] // exemple: date du jour
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 200) {
        alert("Colis assigné au livreur avec succès!");
        fetchColis();
        fetchStats();
      }
    } catch (err) {
      console.error("Erreur lors de l'assignation du colis:", err);
      alert(err.response?.data?.message || "Erreur lors de l'assignation du colis");
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusBadgeColor = (statut) => {
    switch (statut) {
      case "EN_ATTENTE":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "EN_COURS":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "LIVRE":
        return "bg-green-100 text-green-800 border-green-200";
      case "ANNULE":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusDisplayName = (statut) => {
    switch (statut) {
      case "EN_ATTENTE":
        return "En attente";
      case "EN_COURS":
        return "En cours";
      case "LIVRE":
        return "Livré";
      case "ANNULE":
        return "Annulé";
      default:
        return statut;
    }
  };

  // Composant modal pour l'assignation
  const AssignModal = ({ colis, onClose, onAssign }) => {
    const [selectedLivreur, setSelectedLivreur] = useState("");

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-800">
              Assigner le colis #{colis.numeroSuivi}
            </h3>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Description: {colis.description}
              </p>
              <p className="text-sm text-gray-600">
                Destinataire: {colis.destinatairePays}, {colis.destinataireVille}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionner un livreur
              </label>
              <select
                value={selectedLivreur}
                onChange={(e) => setSelectedLivreur(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choisir un livreur</option>
                {livreurs.map((livreur) => (
                  <option key={livreur.id} value={livreur.id}>
                    {livreur.prenom} {livreur.nom} - {livreur.telephone}
                  </option>
                ))}
              </select>
            </div>

            {livreurs.length === 0 && !loadingLivreurs && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-yellow-800 text-sm">
                  Aucun livreur disponible. Veuillez d'abord créer des livreurs.
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={() => onAssign(colis.id, parseInt(selectedLivreur))}
                disabled={!selectedLivreur || loadingLivreurs}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                Assigner
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des colis...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Colis</h1>
            <p className="text-gray-600">Suivez et gérez tous vos colis</p>
          </div>

          {/* Cartes de statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-600">Total Colis</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-600">En Attente</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.enAttente}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-600">En Cours</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.enCours}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-600">Livrés</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.livre}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-600">Annulés</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.annule}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bouton d'ajout et formulaire */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Liste des colis</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter un colis
            </button>
          </div>
          
          {showForm && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Nouveau Colis</h3>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleCreateColis} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Description du contenu"
                  />
                </div>

                {/* Poids */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Poids (kg) *
                  </label>
                  <input
                    type="number"
                    name="poids"
                    value={formData.poids}
                    onChange={handleInputChange}
                    required
                    min="0.1"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Destinataire Pays */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pays du destinataire *
                  </label>
                  <input
                    type="text"
                    name="destinatairePays"
                    value={formData.destinatairePays}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="France"
                  />
                </div>

                {/* Destinataire Ville */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville du destinataire *
                  </label>
                  <input
                    type="text"
                    name="destinataireVille"
                    value={formData.destinataireVille}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Paris"
                  />
                </div>

                {/* Destinataire Code Postal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code postal du destinataire
                  </label>
                  <input
                    type="text"
                    name="destinataireCodePostal"
                    value={formData.destinataireCodePostal}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="75000"
                  />
                </div>

                {/* Destinataire Adresse */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse du destinataire *
                  </label>
                  <input
                    type="text"
                    name="destinataireAdresse"
                    value={formData.destinataireAdresse}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123 Rue Exemple"
                  />
                </div>

                {/* Destinataire Téléphone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone du destinataire *
                  </label>
                  <input
                    type="tel"
                    name="destinataireTelephone"
                    value={formData.destinataireTelephone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+33123456789"
                  />
                </div>

                {/* Expéditeur Pays */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pays de l'expéditeur
                  </label>
                  <input
                    type="text"
                    name="expideteurPays"
                    value={formData.expideteurPays}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="France"
                  />
                </div>

                {/* Expéditeur Ville */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville de l'expéditeur
                  </label>
                  <input
                    type="text"
                    name="expideteurVille"
                    value={formData.expideteurVille}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Lyon"
                  />
                </div>

                {/* Expéditeur Code Postal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code postal de l'expéditeur
                  </label>
                  <input
                    type="text"
                    name="expideteurCodePostal"
                    value={formData.expideteurCodePostal}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="69000"
                  />
                </div>

                {/* Expéditeur Adresse */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse de l'expéditeur
                  </label>
                  <input
                    type="text"
                    name="expideteurAdresse"
                    value={formData.expideteurAdresse}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="456 Avenue Exemple"
                  />
                </div>

                {/* Expéditeur Téléphone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone de l'expéditeur
                  </label>
                  <input
                    type="tel"
                    name="expideteurTelephone"
                    value={formData.expideteurTelephone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+33987654321"
                  />
                </div>

                {/* Boutons */}
                <div className="md:col-span-2 flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    {creating ? "Création..." : "Créer le colis"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tableau des colis */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            {error ? (
              <div className="p-6 text-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700">{error}</p>
                  <button
                    onClick={fetchColis}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            ) : colis.length === 0 ? (
              <div className="p-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="mt-4 text-gray-500">Aucun colis trouvé</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-2 text-blue-600 hover:text-blue-800"
                >
                  Créer votre premier colis
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        N° de suivi
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Poids
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date de création
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {colis.map((colisItem) => (
                      <tr key={colisItem.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{colisItem.numeroSuivi}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{colisItem.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{colisItem.poids} kg</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeColor(colisItem.statut)}`}>
                            {getStatusDisplayName(colisItem.statut)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {colisItem.dateCreation ? new Date(colisItem.dateCreation).toLocaleDateString('fr-FR') : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {colisItem.statut === "EN_ATTENTE" && (
                            <button
                              onClick={() => setAssigning(colisItem)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                            >
                              Assigner
                            </button>
                          )}
                          {colisItem.statut !== "EN_ATTENTE" && (
                            <span className="text-gray-400 text-xs">Déjà assigné</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Modal d'assignation */}
          {assigning && (
            <AssignModal
              colis={assigning}
              onClose={() => setAssigning(null)}
              onAssign={handleAssignColis}
            />
          )}
        </div>
      </div>
    </div>
  );
}