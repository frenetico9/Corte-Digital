import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { BarbershopProfile, Service, Review, BarbershopSearchResultItem } from '../../types';
import { mockGetPublicBarbershops, mockGetServicesForBarbershop, mockGetReviewsForBarbershop } from '../../services/mockApiService';
import LoadingSpinner from '../../components/LoadingSpinner';
import Input from '../../components/Input';
import BarbershopSearchCard from '../../components/BarbershopSearchCard';
import { useNotification } from '../../contexts/NotificationContext';
// import { parseISO } from 'date-fns'; // Removed as per error and non-usage in provided code

type SortOption = 'name_asc' | 'name_desc' | 'rating_desc' | 'rating_asc';
type RatingFilterOption = 'any' | '4+' | '3+';

const ClientFindBarbershopsPage: React.FC = () => {
  const [allBarbershopsData, setAllBarbershopsData] = useState<BarbershopSearchResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('name_asc');
  const [ratingFilter, setRatingFilter] = useState<RatingFilterOption>('any');
  const { addNotification } = useNotification();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const profiles = await mockGetPublicBarbershops(); // Get all
      if (!profiles || profiles.length === 0) {
        setAllBarbershopsData([]);
        setLoading(false);
        return;
      }

      const detailedDataPromises = profiles.map(async (profile) => {
        try {
          const [services, reviews] = await Promise.all([
            mockGetServicesForBarbershop(profile.id),
            mockGetReviewsForBarbershop(profile.id),
          ]);

          const activeServices = services.filter(s => s.isActive);
          const averageRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
          
          return {
            ...profile,
            averageRating,
            reviewCount: reviews.length,
            sampleServices: activeServices.map(s => ({ id: s.id, name: s.name, price: s.price })).slice(0, 3), // Show up to 3 sample services
          };
        } catch (error) {
           console.error(`Failed to fetch details for ${profile.name}:`, error);
           // Return profile with default/empty values for details if sub-fetches fail
           return {
             ...profile,
             averageRating: 0,
             reviewCount: 0,
             sampleServices: [],
           };
        }
      });
      
      const results = await Promise.all(detailedDataPromises);
      setAllBarbershopsData(results as BarbershopSearchResultItem[]);

    } catch (error) {
      addNotification({ message: 'Erro ao buscar barbearias.', type: 'error' });
      console.error("Error fetching barbershops list:", error);
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredAndSortedBarbershops = useMemo(() => {
    let items = [...allBarbershopsData];

    // Search
    if (searchTerm) {
      items = items.filter(shop =>
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by Rating
    if (ratingFilter !== 'any') {
      const minRating = ratingFilter === '4+' ? 4 : 3;
      items = items.filter(shop => shop.averageRating >= minRating);
    }

    // Sort
    switch (sortOption) {
      case 'name_asc':
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        items.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating_desc':
        items.sort((a, b) => b.averageRating - a.averageRating || b.reviewCount - a.reviewCount);
        break;
      case 'rating_asc':
        items.sort((a, b) => a.averageRating - b.averageRating || a.reviewCount - b.reviewCount);
        break;
    }
    return items;
  }, [allBarbershopsData, searchTerm, ratingFilter, sortOption]);

  if (loading && allBarbershopsData.length === 0) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <LoadingSpinner size="lg" label="Buscando barbearias..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary-blue mb-6 sm:mb-8">Encontrar Barbearias</h1>

      {/* Search and Filter Controls */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-md border border-light-blue">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Input
            label="Buscar por Nome ou Endereço"
            type="search"
            placeholder="Digite aqui..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            containerClassName="mb-0 md:col-span-2"
            leftIcon={<span className="material-icons-outlined">search</span>}
          />
          <div className="grid grid-cols-2 gap-4 md:col-span-1">
            <div>
              <label htmlFor="ratingFilter" className="block text-xs font-medium text-gray-700">Avaliação Mínima</label>
              <select
                id="ratingFilter"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value as RatingFilterOption)}
                className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue text-sm"
              >
                <option value="any">Qualquer</option>
                <option value="4+">4+ Estrelas</option>
                <option value="3+">3+ Estrelas</option>
              </select>
            </div>
            <div>
              <label htmlFor="sortOption" className="block text-xs font-medium text-gray-700">Ordenar Por</label>
              <select
                id="sortOption"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue text-sm"
              >
                <option value="name_asc">Nome (A-Z)</option>
                <option value="name_desc">Nome (Z-A)</option>
                <option value="rating_desc">Melhor Avaliadas</option>
                <option value="rating_asc">Pior Avaliadas</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading && allBarbershopsData.length > 0 && <div className="my-4"><LoadingSpinner label="Atualizando lista..." /></div>}
      
      {!loading && filteredAndSortedBarbershops.length === 0 ? (
        <div className="text-center py-12 bg-white shadow-lg rounded-lg border border-light-blue">
          <span className="material-icons-outlined text-6xl text-primary-blue/50 mb-4">store_mall_directory</span>
          <p className="text-xl text-gray-600 mb-3">Nenhuma barbearia encontrada.</p>
          <p className="text-sm text-gray-500">Tente ajustar seus termos de busca ou filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedBarbershops.map(shop => (
            <BarbershopSearchCard key={shop.id} barbershop={shop} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientFindBarbershopsPage;