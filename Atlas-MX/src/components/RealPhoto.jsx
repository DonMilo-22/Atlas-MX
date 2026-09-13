import React from 'react';
import { useRealPhoto } from '../hooks/useRealPhoto';
import { PLACEHOLDER } from '../services/photoService';

export default function RealPhoto({ name, stateName = '', fallback = '', alt = '', className = '', ...props }) {
  const { photoUrl, isLoading } = useRealPhoto(name, fallback, stateName);
  return (
    <img
      src={photoUrl || PLACEHOLDER}
      alt={alt || name}
      className={className}
      loading="lazy"
      data-real-photo={isLoading ? 'loading' : 'ready'}
      onError={(event) => {
        if (event.currentTarget.src !== PLACEHOLDER) event.currentTarget.src = PLACEHOLDER;
      }}
      {...props}
    />
  );
}
