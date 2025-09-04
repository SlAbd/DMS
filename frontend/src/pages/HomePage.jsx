import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, User, Truck, Search } from "lucide-react";
import axios from "axios";

export default function HomePage() {
  const [livreurs, setLivreurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLivreurs = async () => {
      try {
        const response = await axios.get("http://localhost:8080/livreurs");
        setLivreurs(response.data);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLivreurs();
  }, []);

  const filteredLivreurs = livreurs.filter(livreur =>
    livreur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    livreur.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    livreur.id.toString().includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Titre */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Bienvenue sur <span className="text-blue-600">TrDeL</span>
          </h1>
          <p className="text-gray-600 mb-8">
            Système de gestion de livraisons
          </p>
        </div>

        {/* Boutons d'accès */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            <Shield className="h-5 w-5" />
            Accès Admin
          </Link>

          <Link
            to="/client/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          >
            <User className="h-5 w-5" />
            Accès Client
          </Link>

          <a
            href="/livreur"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-orange-600 text-white font-semibold hover:bg-orange-700 transition"
          >
            <Truck className="h-5 w-5" />
            Accès Livreur
          </a>
        </div>

       
        
      </div>
    </div>
  );
}