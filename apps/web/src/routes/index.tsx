import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {
  return <main className="min-h-screen bg-white text-neutral-900" />
}
