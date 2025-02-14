import type React from "react"

export function PolicyTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="text-3xl font-bold mb-6">{children}</h1>
}

export function PolicySection({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-semibold mt-8 mb-4">{children}</h2>
}

export function PolicyText({ children }: { children: React.ReactNode }) {
  return <p className="mb-4">{children}</p>
}

export function PolicyList({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc pl-6 mb-4">{children}</ul>
}

export function PolicyListItem({ children }: { children: React.ReactNode }) {
  return <li className="mb-2">{children}</li>
}

