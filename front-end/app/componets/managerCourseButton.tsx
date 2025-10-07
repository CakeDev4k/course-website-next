'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function ManagerCourseButton() {
  const pathname = usePathname()

  // Se já estivermos na página de gerenciamento, não renderiza o botão
  if (pathname === '/manager-course') return null

  return (
    <Link href="/manager-course">
      <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition duration-200">
        Gerenciar Cursos
      </button>
    </Link>
  )
}
