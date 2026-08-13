import React from 'react';
import { MASTER_CATEGORIES } from '../data/categoriesData';
import { CategoryCard } from './CategoryCard';
import type { CategoryItem } from '../types';
import { Compass } from 'lucide-react';

interface CategorySectionProps {
  onCategoryClick?: (category: CategoryItem) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ onCategoryClick }) => {
  return (
    <section className="space-y-6">
      <div className="flex items-center space-x-3">
        <Compass className="w-6 h-6 text-[#EA580C]" />
        <div>
          <h2 className="text-2xl font-extrabold text-white">Explore Categories</h2>
          <p className="text-sm text-slate-400">Discover bespoke handcrafted items across 21 master crafts</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {MASTER_CATEGORIES.map((category) => (
          <CategoryCard 
            key={category.id} 
            category={category} 
            onClick={onCategoryClick}
          />
        ))}
      </div>
    </section>
  );
};
