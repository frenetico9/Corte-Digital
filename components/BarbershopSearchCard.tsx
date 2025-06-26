import React from 'react';
import { Link } from 'react-router-dom';
import { BarbershopSearchResultItem } from '../types';
import Button from './Button';
import StarRating from './StarRating';

interface BarbershopSearchCardProps {
  barbershop: BarbershopSearchResultItem;
}

const BarbershopSearchCard: React.FC<BarbershopSearchCardProps> = ({ barbershop }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-light-blue hover:shadow-xl hover:border-primary-blue transition-all duration-300 ease-in-out flex flex-col justify-between">
      <div>
        <div className="flex items-start mb-3">
          {barbershop.logoUrl ? (
            <img src={barbershop.logoUrl} alt={`${barbershop.name} logo`} className="w-16 h-16 rounded-lg mr-4 object-cover border-2 border-light-blue" />
          ) : (
            <div className="w-16 h-16 rounded-lg mr-4 bg-gray-200 flex items-center justify-center text-primary-blue text-2xl font-bold border-2 border-light-blue">
              {barbershop.name.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-primary-blue mb-1 truncate" title={barbershop.name}>{barbershop.name}</h3>
            <p className="text-xs text-gray-500 truncate" title={barbershop.address}>{barbershop.address}</p>
             {barbershop.reviewCount > 0 ? (
                <div className="flex items-center mt-1">
                    <StarRating value={barbershop.averageRating} size={16} isEditable={false} />
                    <span className="text-xs text-gray-500 ml-1.5">({barbershop.averageRating.toFixed(1)} de {barbershop.reviewCount} avaliações)</span>
                </div>
            ) : (
                <p className="text-xs text-gray-400 mt-1 italic">Nenhuma avaliação ainda</p>
            )}
          </div>
        </div>
        
        {barbershop.sampleServices.length > 0 && (
            <div className="my-3">
                <h4 className="text-xs font-semibold text-gray-600 mb-1">Alguns Serviços:</h4>
                <div className="flex flex-wrap gap-1">
                {barbershop.sampleServices.slice(0, 3).map(service => (
                    <span key={service.id} className="text-xs bg-light-blue text-primary-blue px-2 py-0.5 rounded-full font-medium">
                    {service.name} (R$ {service.price.toFixed(2).replace('.',',')})
                    </span>
                ))}
                {barbershop.sampleServices.length > 3 && <span className="text-xs text-gray-500 px-1 py-0.5">+ mais</span>}
                </div>
            </div>
        )}
         {barbershop.sampleServices.length === 0 && (
             <p className="text-xs text-gray-400 my-3 italic">Nenhum serviço em destaque cadastrado.</p>
         )}
      </div>

      <Link to={`/barbershop/${barbershop.id}`} className="block mt-4">
        <Button variant="primary" fullWidth>
          Ver Detalhes e Agendar
          <span className="material-icons-outlined text-sm ml-2">arrow_forward</span>
        </Button>
      </Link>
    </div>
  );
};

export default BarbershopSearchCard;