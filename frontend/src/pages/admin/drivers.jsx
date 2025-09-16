import { useEffect, useState } from "react"
import instance from "@/axios/axios"
import Sidebar from "@/components/projet/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"



// Composant 1: Total Livreurs
export function TotalLivreurs() {
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTotalLivreurs = async () => {
      try {
        const res = await instance.get("/livreur/livreurs")
        setTotal(res.data.length)
      } catch (error) {
        console.error("Erreur lors du chargement du total des livreurs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTotalLivreurs()
  }, [])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500">Total Livreurs</p>
          <p className="text-3xl font-bold">
            {loading ? (
              <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></span>
            ) : (
              total
            )}
          </p>
        </div>
        <div className="bg-blue-100 p-3 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

// Composant 2: Livreurs disponibles
export function LivreursDisponibles() {
  const [disponibles, setDisponibles] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLivreursDisponibles = async () => {
      try {
        const res = await instance.get("/livreurs")
        // console.log(res.data)
        const disponiblesCount = res.data.filter((livreur) => livreur.disponibilite == 1).length
        setDisponibles(disponiblesCount)
      } catch (error) {
        console.error("Erreur lors du chargement des livreurs disponibles:", error)
        console.log("Livreurs disponibles:", disponibles)
      } finally {
        setLoading(false)
      }
    }

    fetchLivreursDisponibles()
  }, [])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500">Livreurs Disponibles</p>
          <p className="text-3xl font-bold">
            {loading ? (
              <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent"></span>
            ) : (
              disponibles
            )}
          </p>
        </div>
        <div className="bg-green-100 p-3 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
    </div>
  )
}

// Composant 3: Livreurs non disponibles
export function LivreursNonDisponibles() {
  const [nonDisponibles, setNonDisponibles] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLivreursNonDisponibles = async () => {
      try {
        const res = await instance.get("/livreurs")
        const nonDisponiblesCount = res.data.filter((livreur) => livreur.disponibilite == 0).length
        setNonDisponibles(nonDisponiblesCount)
      } catch (error) {
        console.error("Erreur lors du chargement des livreurs non disponibles:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLivreursNonDisponibles()
  }, [])
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500">Livreurs Non Disponibles</p>
          <p className="text-3xl font-bold">
            {loading ? (
              <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-500 border-r-transparent"></span>
            ) : (
              nonDisponibles
            )}
          </p>
        </div>
        <div className="bg-red-100 p-3 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
    </div>
  )
}

// Composant 4: Liste des livreurs
export function ListeLivreurs({ onRefresh }) {
  const [livreurs, setLivreurs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchLivreurs()
  }, [onRefresh])

  const fetchLivreurs = async () => {
    try {
      const res = await instance.get("/livreur/livreurs")
      setLivreurs(Array.isArray(res.data) ? res.data : [])
      setError(null)
    } catch (err) {
      console.error("Erreur lors du chargement des livreurs:", err)
      setError("Impossible de charger la liste des livreurs")
      setLivreurs([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce livreur ?")) {
      try {
        await axios.delete(`/livreurs/${id}`)
        fetchLivreurs()
        alert("Livreur supprimé avec succès")
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
        alert("Erreur lors de la suppression du livreur")
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Liste des Livreurs</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Identifiant</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Disponibilité</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {livreurs.length > 0 ? (
              livreurs.map((livreur) => (
                <TableRow key={livreur.id}>
                  <TableCell className="font-medium">{livreur.identifiantLivreur || "N/A"}</TableCell>
                  <TableCell className="font-medium">{livreur.nom}</TableCell>
                  <TableCell>{livreur.prenom || "N/A"}</TableCell>
                  <TableCell>{livreur.email}</TableCell>
                  <TableCell>{livreur.telephone || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant={livreur.disponibilite ? "default" : "destructive"}>
                      {livreur.disponibilite ? "Disponible" : "Non disponible"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(livreur.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Aucun livreur trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// Modal pour ajouter un livreur
function AddLivreurModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    email: "",
    nom: "",
    prenom: "",
    telephone: "",
    disponibilite: true,
  })
  const [loading, setLoading] = useState(false)
  //const [generatedPassword, setGeneratedPassword] = useState("")

  // useEffect(() => {
  //   if (isOpen) {
  //     const password = generateRandomPassword()
  //     setGeneratedPassword(password)
  //   }
  // }, [isOpen])

  // const generateRandomPassword = () => {
  //   const length = 12
  //   const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
  //   let password = ""

  //   for (let i = 0; i < length; i++) {
  //     const randomIndex = Math.floor(Math.random() * charset.length)
  //     password += charset[randomIndex]
  //   }
  //   return password
  // }

  // const regeneratePassword = () => {
  //   setGeneratedPassword(generateRandomPassword())
  // }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await instance.post("/livreur/creer", {
        ...formData,

      })

      //alert(`Livreur ajouté avec succès! Mot de passe: ${generatedPassword}`)
      onAdd()
      onClose()
      setFormData({ email: "", nom: "", prenom: "", telephone: "", disponibilite: true })
      //setGeneratedPassword("")
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error)
      alert("Erreur lors de l'ajout du livreur")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Ajouter un Livreur</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
               <div>
              <label className="block text-sm font-medium text-gray-700">Nom *</label>
              <input
                type="text"
                required
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Prénom *</label>
              <input
                type="text"
                required
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
         
            <div>
              <label className="block text-sm font-medium text-gray-700">Téléphone</label>
              <input
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            {/* Password généré */}
            {/* <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-blue-700">Mot de passe généré</label>
                <button type="button" onClick={regeneratePassword} className="text-blue-600 hover:text-blue-800 text-sm">
                  ↻
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={generatedPassword}
                  className="flex-1 bg-white border border-blue-300 rounded px-2 py-1 text-sm font-mono text-blue-800"
                />
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(generatedPassword)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Copier le mot de passe"
                >
                  📋
                </button>
              </div>
              <p className="text-xs text-blue-600 mt-2">⚠️ Notez ce mot de passe, il ne sera plus affiché après la création</p>
            </div> */}

            {/* <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.disponibilite}
                  onChange={(e) => setFormData({ ...formData, disponibilite: e.target.checked })}
                  className="mr-2"
                />
                Disponible
              </label>
            </div> */}
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md">
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
            >
              {loading ? "Ajout..." : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function DriversPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const handleRefresh = () => setRefreshTrigger((prev) => prev + 1)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Livreurs</h1>
            <p className="text-gray-600">Suivez et gérez tous vos Livreurs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <TotalLivreurs />
            <LivreursDisponibles />
            <LivreursNonDisponibles />
          </div>

          <div className="flex justify-end mb-6">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              + Ajouter Livreur
            </button>
          </div>

          <ListeLivreurs onRefresh={refreshTrigger} />
          <AddLivreurModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleRefresh} />
        </div>
      </div>
    </div>
  )
}
