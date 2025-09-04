import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, ArrowRight, User, Package } from "lucide-react";

export default function LivreurHome() {
  const [livreurId, setLivreurId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (livreurId.trim()) {
      navigate(`/livreur/${livreurId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <Truck className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Espace Livreur
          </h1>
          <p className="text-gray-600">
            Accédez à vos livraisons assignées
          </p>
        </div>

        {/* Formulaire de connexion simplifié */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="livreurId" className="block text-sm font-medium text-gray-700 mb-2">
              Entrez votre identifiant livreur
            </label>
            <input
              id="livreurId"
              type="text"
              placeholder="Ex: 123"
              value={livreurId}
              onChange={(e) => setLivreurId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition flex items-center justify-center gap-2"
          >
            <User className="h-5 w-5" />
            Accéder à mon espace
            <ArrowRight className="h-5 w-5" />
          </button>
        </form>

        {/* Informations supplémentaires */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">Comment obtenir votre ID ?</h3>
              <p className="text-blue-600 text-sm">
                Votre identifiant unique vous a été communiqué par votre administrateur.
                Contactez le support si vous ne le possédez pas.
              </p>
            </div>
          </div>
        </div>

        {/* Lien vers la page principale */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-orange-600 hover:text-orange-700 text-sm font-medium"
          >
            ← Retour à la page d'accueil
          </a>
        </div>
      </div>
    </div>
  );
}