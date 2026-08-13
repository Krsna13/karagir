export const getAiFurnitureImages = (itemName: string, _category: string): string[] => {
  const basePrompts = [
    `handcrafted ${itemName} Indian artisanal solid teak wood elegant studio shot high resolution`,
    `close up detail joinery wood grain finish of ${itemName} craft luxury`,
    `raw timber woodworking process angle of ${itemName} Indian artisan workshop`,
    `modern living space setup featuring handcrafted ${itemName} warm ambient interior design`,
    `side view dimensions showcase of artisan handcrafted ${itemName} premium finish`
  ];

  return basePrompts.map((promptText) => {
    const encodedPrompt = encodeURIComponent(promptText);
    // Uses live AI image generation on the fly
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;
  });
};

export const getAiCoverImage = (itemName: string): string => {
    const prompt = `luxurious handcrafted ${itemName} solid teak wood indian artisan studio`;
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;
};
