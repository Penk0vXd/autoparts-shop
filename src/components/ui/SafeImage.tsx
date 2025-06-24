'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface SafeImageProps extends Omit<ImageProps, 'onError' | 'alt'> {
  fallbackSrc?: string;
  onError?: () => void;
  alt?: string;
}

export default function SafeImage({ 
  src, 
  fallbackSrc = '/images/placeholder-brand.png', 
  onError,
  alt = '',
  ...props 
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
      onError?.();
    }
  };

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleError}
    />
  );
} 