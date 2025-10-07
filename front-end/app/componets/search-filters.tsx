'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, Filter } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  color: string | null;
}

interface SearchFiltersProps {
  categories: Category[];
}

export default function SearchFilters({ categories }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoryId') || '');
  const [orderBy, setOrderBy] = useState(searchParams.get('orderBy') || 'title');
  const [sortType, setSortType] = useState(searchParams.get('sortType') || 'asc');
  const [showFilters, setShowFilters] = useState(false);

  // Debounce para a pesquisa
  useEffect(() => {
    const timer = setTimeout(() => {
      updateURL();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, selectedCategory, orderBy, sortType]);

  const updateURL = () => {
    const params = new URLSearchParams();
    
    if (searchValue) params.set('search', searchValue);
    if (selectedCategory) params.set('categoryId', selectedCategory);
    if (orderBy !== 'title') params.set('orderBy', orderBy);
    if (sortType !== 'asc') params.set('sortType', sortType);

    router.push(`/courses?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchValue('');
    setSelectedCategory('');
    setOrderBy('title');
    setSortType('asc');
    router.push('/courses');
  };

  const hasActiveFilters = searchValue || selectedCategory || orderBy !== 'title' || sortType !== 'asc';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      {/* Barra de Pesquisa Principal */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Pesquisar cursos..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 rounded-lg flex items-center gap-2 transition-colors ${
            showFilters || hasActiveFilters
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Filter className="w-5 h-5" />
          Filtros
        </button>
      </div>

      {/* Filtros Avançados */}
      {showFilters && (
        <div className="border-t pt-4 space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="">Todas as categorias</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenar por */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por
              </label>
              <select
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="title">Título</option>
                <option value="id">Data de criação</option>
              </select>
            </div>

            {/* Ordem */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordem
              </label>
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="asc">Crescente (A-Z)</option>
                <option value="desc">Decrescente (Z-A)</option>
              </select>
            </div>
          </div>

          {/* Botão Limpar Filtros */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tags de Filtros Ativos */}
      {hasActiveFilters && !showFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
          {searchValue && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              Busca: {searchValue}
              <button onClick={() => setSearchValue('')}>
                <X className="w-4 h-4" />
              </button>
            </span>
          )}
          {selectedCategory && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              Categoria: {categories.find(c => c.id === selectedCategory)?.name}
              <button onClick={() => setSelectedCategory('')}>
                <X className="w-4 h-4" />
              </button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Limpar tudo
          </button>
        </div>
      )}
    </div>
  );
}