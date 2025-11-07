export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-200 via-neutral-300 to-neutral-250 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-neutral-400 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-orange-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-neutral-600 text-sm font-medium">Carregando...</p>
      </div>
    </div>
  )
}

