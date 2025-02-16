"use client"

import { useEffect } from "react"
import { use } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function ReferralPage({ params }) {
  const router = useRouter()
  const { setReferralCode } = useAuth()
  const id = use(params).id
  
  useEffect(() => {
    if (id) {
      setReferralCode(id)
      router.push('/')
    }
  }, [id, setReferralCode, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Processing referral code...</p>
    </div>
  )
}