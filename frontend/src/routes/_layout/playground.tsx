import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/playground')({
  component: () => <div>Hello /_layout/playground!</div>
})