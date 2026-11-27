import React, { useState } from 'react';
import { useRealPhoto } from '../hooks/useRealPhoto';
import { PLACEHOLDER } from '../services/photoService';
import { retryCommons } from '../utils/commons';

/** Foto real de un lugar. `image` (archivo de Commons) y `placeId` (QID) son datos verificados opcionales. */
export default function RealPhoto({ name, stateName = '', fallback = '', alt = '', className = '', image = null, placeId = null, ...props }) {
  const { photoUrl, isLoading } = useRealPhoto(name, fallback, stateName, { image, placeId });
  const [failedUrl, setFailedUrl] = useState('');
  const src = failedUrl === photoUrl ? PLACEHOLDER : (photoUrl || PLACEHOLDER);
  return (
    <img
      src={src}
      alt={alt || name}
      className={`${className} ${isLoading ? 'is-loading' : ''}`.trim()}
      loading="lazy"
      decoding="async"
      data-real-photo={isLoading ? 'loading' : 'ready'}
      onError={(event) => { if (photoUrl !== PLACEHOLDER && !retryCommons(event.currentTarget)) setFailedUrl(photoUrl); }}
      {...props}
    />
  );
}
