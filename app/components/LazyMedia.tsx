"use client";

import { useState } from "react";

type LazyMediaProps = {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  eager?: boolean;
};

export function LazyMedia({ src, alt, className = "", wrapperClassName = "", eager = false }: LazyMediaProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)}
        className={`block w-full h-auto transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"} ${className}`}
      />
      {!isLoaded && <div className="absolute inset-0 animate-pulse bg-gray-200" aria-hidden="true" />}
    </div>
  );
}

export default LazyMedia;
