import type { CategoryItem } from '../types';
import { AiImage } from './AiImage';

interface CategoryCardProps {
  category: CategoryItem;
  onClick?: (category: CategoryItem) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  return (
    <div
      onClick={() => onClick && onClick(category)}
      className="relative group rounded-2xl overflow-hidden cursor-pointer h-64 border border-[#2A1E17] hover:border-[#EA580C] hover:shadow-[0_0_15px_rgba(234,88,12,0.4)] transition-all duration-300"
    >
      <AiImage
        src={category.coverImage}
        alt={category.name}
        containerClassName="absolute inset-0 w-full h-full"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1F1510] via-black/40 to-transparent pointer-events-none"></div>
      
      <div className="absolute bottom-4 left-4 right-4">
        <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">
          {category.name}
        </h3>
        <p className="text-sm text-slate-300 line-clamp-2">
          {category.description}
        </p>
      </div>
    </div>
  );
};
