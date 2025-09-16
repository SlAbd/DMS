"use client"

import { useState } from "react"
import LivreurIdentifiantVerification from "./LivreurIdentifiantVerification"
import LivreurEmailVerification from "./LivreurEmailVerification" // Assure-toi d'avoir ce composant

export default function LivreurAuthContainer() {
  const [step, setStep] = useState("email")
  const [verifiedEmail, setVerifiedEmail] = useState("")

  const handleEmailVerified = (email) => {
    setVerifiedEmail(email)
    setStep("identifiant")
  }

  const handleBack = () => {
    setStep("email")
    setVerifiedEmail("")
  }

  if (step === "email") {
    return <LivreurEmailVerification onEmailVerified={handleEmailVerified} />
  }

  return <LivreurIdentifiantVerification email={verifiedEmail} onBack={handleBack} />
}
