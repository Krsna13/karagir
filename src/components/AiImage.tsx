import React, { useState } from 'react';

interface AiImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
}

export const AiImage: React.FC<AiImageProps> = ({ containerClassName = '', className = '', ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Shimmer Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#1F1510] animate-pulse flex items-center justify-center">
          <div className="w-full h-full bg-slate-800/50"></div>
        </div>
      )}
      
      {/* Actual Image */}
      <img
        {...props}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};
