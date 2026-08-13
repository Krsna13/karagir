import type { ProductItem } from '../types';
import { getAiFurnitureImages } from '../utils/generateAiImages';

const ITEMS = [
  { name: "Sofa", category: "Living Room", price: 28500 },
  { name: "Dining Table", category: "Dining Room", price: 35000 },
  { name: "Study Table", category: "Home Office", price: 18500 },
  { name: "Bed", category: "Bedroom", price: 42000 },
  { name: "Wardrobe", category: "Bedroom", price: 55000 },
  { name: "Coffee Table", category: "Living Room", price: 12500 },
  { name: "Chair", category: "Living & Dining", price: 6500 },
  { name: "Bookshelf", category: "Storage", price: 22000 },
  { name: "Dressing Table", category: "Bedroom", price: 19500 },
  { name: "Shoe Rack", category: "Storage", price: 8500 },
  { name: "TV Unit / Cabinet", category: "Living Room", price: 24000 },
  { name: "Side Table", category: "Living Room", price: 5500 },
  { name: "Home Temple (Mandir)", category: "Sacred & Specialty", price: 32000 },
  { name: "Wooden Bench", category: "Living & Dining", price: 11000 },
  { name: "Crockery Cabinet", category: "Storage", price: 38000 },
  { name: "Indoor Swing (Jhula)", category: "Sacred & Specialty", price: 45000 },
  { name: "Chest of Drawers", category: "Storage", price: 26500 },
  { name: "Bar Cabinet", category: "Living Room", price: 29000 },
  { name: "Console Table", category: "Living Room", price: 16500 },
  { name: "Bedside Table", category: "Bedroom", price: 6500 },
  { name: "Door", category: "Architectural & Openings", price: 48000 }
];

export const MOCK_21_PRODUCTS: ProductItem[] = ITEMS.map((item, index) => {
  return {
    id: `item-${index + 1}`,
    name: item.name,
    slug: item.name.toLowerCase().replace(/[\s/()]+/g, '-').replace(/-$/, ''),
    category: item.category,
    coverImage: `https://image.pollinations.ai/prompt/luxurious%20handcrafted%20${encodeURIComponent(item.name.toLowerCase())}%20solid%20teak%20wood%20indian%20artisan%20studio?width=800&height=600&nologo=true`,
    galleryImages: getAiFurnitureImages(item.name, item.category),
    description: `Authentic artisan-crafted wooden ${item.name.toLowerCase()} built using traditional joinery techniques.`,
    materials: ["Teak Wood", "Sheesham", "High-Density Foam", "Brass Hardware"],
    startingPrice: item.price
  };
});
