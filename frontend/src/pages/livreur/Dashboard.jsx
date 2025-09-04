import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function LivreurDashboard() {
  const { livreurId } = useParams();
  const [livreur, setLivreur] = useState(null);
  const [livraisons, setLivraisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError("Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    };

    if (livreurId) {
      fetchData();
    }
  }, [livreurId]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Espace Livreur</h1>
      
      {livreur && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold">Profil</h2>
          <p>Nom: {livreur.nom} {livreur.prenom}</p>
          <p>Téléphone: {livreur.telephone}</p>
          <p>Email: {livreur.email}</p>
        </div>
      )}
      
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Livraisons Assignées</h2>
        
        {livraisons.length === 0 ? (
          <p>Aucune livraison assignée</p>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">ID Livraison</th>
                <th className="px-4 py-2">ID Colis</th>
                <th className="px-4 py-2">Numéro de Suivi</th>
                <th className="px-4 py-2">Date Estimée</th>
              </tr>
            </thead>
            <tbody>
              {livraisons.map((livraison) => (
                <tr key={livraison.id} className="border-b">
                  <td className="px-4 py-2 text-center">{livraison.id}</td>
                  <td className="px-4 py-2 text-center">{livraison.colisId}</td>
                  <td className="px-4 py-2 text-center">{livraison.colisNumeroSuivi}</td>
                  <td className="px-4 py-2 text-center">
                    {livraison.dateEstimee ? new Date(livraison.dateEstimee).toLocaleDateString('fr-FR') : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}