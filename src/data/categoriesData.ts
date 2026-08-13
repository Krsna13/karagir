import type { CategoryItem } from '../types';
import { getAiCoverImage } from '../utils/generateAiImages';

export const MASTER_CATEGORIES: CategoryItem[] = [
  { id: 'cat-01', name: 'Sofa', slug: 'sofa', group: 'Living Room', coverImage: getAiCoverImage('Sofa'), description: 'Bespoke handcrafted sofas' },
  { id: 'cat-02', name: 'Dining Table', slug: 'dining-table', group: 'Dining Room', coverImage: getAiCoverImage('Dining Table'), description: 'Hand-turned solid wood dining tables' },
  { id: 'cat-03', name: 'Study Table', slug: 'study-table', group: 'Home Office', coverImage: getAiCoverImage('Study Table'), description: 'Ergonomic wooden study tables' },
  { id: 'cat-04', name: 'Bed', slug: 'bed', group: 'Bedroom', coverImage: getAiCoverImage('Bed'), description: 'Sturdy solid wood beds' },
  { id: 'cat-05', name: 'Wardrobe', slug: 'wardrobe', group: 'Bedroom', coverImage: getAiCoverImage('Wardrobe'), description: 'Spacious wooden wardrobes' },
  { id: 'cat-06', name: 'Coffee Table', slug: 'coffee-table', group: 'Living Room', coverImage: getAiCoverImage('Coffee Table'), description: 'Elegant living room coffee tables' },
  { id: 'cat-07', name: 'Chair', slug: 'chair', group: 'Living & Dining', coverImage: getAiCoverImage('Chair'), description: 'Comfortable and durable wooden chairs' },
  { id: 'cat-08', name: 'Bookshelf', slug: 'bookshelf', group: 'Storage', coverImage: getAiCoverImage('Bookshelf'), description: 'Classic wooden bookshelves' },
  { id: 'cat-09', name: 'Dressing Table', slug: 'dressing-table', group: 'Bedroom', coverImage: getAiCoverImage('Dressing Table'), description: 'Intricately designed dressing tables' },
  { id: 'cat-10', name: 'Shoe Rack', slug: 'shoe-rack', group: 'Storage', coverImage: getAiCoverImage('Shoe Rack'), description: 'Organized wooden shoe racks' },
  { id: 'cat-11', name: 'TV Unit / Cabinet', slug: 'tv-unit', group: 'Living Room', coverImage: getAiCoverImage('TV Unit'), description: 'Modern and traditional TV units' },
  { id: 'cat-12', name: 'Side Table', slug: 'side-table', group: 'Living Room', coverImage: getAiCoverImage('Side Table'), description: 'Compact wooden side tables' },
  { id: 'cat-13', name: 'Home Temple (Mandir)', slug: 'home-temple', group: 'Sacred & Specialty', coverImage: getAiCoverImage('Home Temple'), description: 'Heritage carved wooden mandirs' },
  { id: 'cat-14', name: 'Wooden Bench', slug: 'wooden-bench', group: 'Living & Dining', coverImage: getAiCoverImage('Wooden Bench'), description: 'Rustic wooden seating benches' },
  { id: 'cat-15', name: 'Crockery Cabinet', slug: 'crockery-cabinet', group: 'Storage', coverImage: getAiCoverImage('Crockery Cabinet'), description: 'Elegant glass and wood crockery units' },
  { id: 'cat-16', name: 'Indoor Swing (Jhula)', slug: 'indoor-swing', group: 'Sacred & Specialty', coverImage: getAiCoverImage('Indoor Swing'), description: 'Traditional carved wooden jhulas' },
  { id: 'cat-17', name: 'Chest of Drawers', slug: 'chest-of-drawers', group: 'Storage', coverImage: getAiCoverImage('Chest of Drawers'), description: 'Versatile wooden chests of drawers' },
  { id: 'cat-18', name: 'Bar Cabinet', slug: 'bar-cabinet', group: 'Living Room', coverImage: getAiCoverImage('Bar Cabinet'), description: 'Stylish wooden bar cabinets' },
  { id: 'cat-19', name: 'Console Table', slug: 'console-table', group: 'Living Room', coverImage: getAiCoverImage('Console Table'), description: 'Decorative wooden console tables' },
  { id: 'cat-20', name: 'Bedside Table', slug: 'bedside-table', group: 'Bedroom', coverImage: getAiCoverImage('Bedside Table'), description: 'Functional solid wood bedside tables' },
  { id: 'cat-21', name: 'Door', slug: 'door', group: 'Architectural & Openings', coverImage: getAiCoverImage('Door'), description: 'Heavy carved solid wood doors' },
];
