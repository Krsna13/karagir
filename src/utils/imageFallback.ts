export const getImageUrl = (itemName: string, index: number): string => {
  // Using placehold.co to maintain the Dark Wood Slate (#1F1510) and Craft Orange (#EA580C) brand palette
  // Format: https://placehold.co/800x600/1F1510/EA580C?text=[ItemName]+Image+[N]
  const formattedName = itemName.replace(/\s+/g, '+');
  return `https://placehold.co/800x600/1F1510/EA580C?text=${formattedName}+Image+${index}`;
};
