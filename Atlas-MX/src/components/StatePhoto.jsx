import React, { useEffect, useState } from 'react';
import { fetchStatePhoto } from '../services/wikiService';
import { PLACEHOLDER } from '../services/photoService';

/** Foto del propio estado (su artículo de Wikipedia o su elemento de Wikidata); nunca una imagen de otro lugar. */
export default function StatePhoto({ stateCode, stateName }) {
  const [result, setResult] = useState({ code: null, photo: null });
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setFailed(false);
    fetchStatePhoto(stateCode)
      .then((photo) => { if (!cancelled) setResult({ code: stateCode, photo }); })
      .catch(() => { if (!cancelled) setResult({ code: stateCode, photo: null }); });
    return () => { cancelled = true; };
  }, [stateCode]);

  const loading = result.code !== stateCode;
  const photo = !loading && !failed ? result.photo : null;
  return (
    <>
      <img
        src={photo?.url || PLACEHOLDER}
        alt={photo ? `Fotografía de ${stateName}` : ''}
        className={loading ? 'is-loading' : ''}
        onError={() => setFailed(true)}
      />
      {photo && <a className="photo-credit" href={photo.page} target="_blank" rel="noopener noreferrer">Foto: {/commons\.wikimedia/.test(photo.page) ? 'Wikimedia Commons' : 'Wikipedia'}</a>}
    </>
  );
}
