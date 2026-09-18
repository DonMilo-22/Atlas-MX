import React, { useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { STATE_STORIES } from '../data/stateStories';

export default function StateStoryCard({ stateCode, stateName, motto, summary }) {
  const curated = STATE_STORIES[stateCode];
  const stories = [
    curated,
    { type: 'Identidad', title: motto || `El carácter de ${stateName}`, text: summary || `${stateName} reúne paisajes, memoria y tradiciones que cambian entre cada región.` },
    { type: 'Para descubrir', title: 'Mira más allá de los destinos', text: `Mercados, plazas, talleres y conversaciones cotidianas también forman parte del patrimonio vivo de ${stateName}.` }
  ].filter(Boolean);
  const [index, setIndex] = useState(0);
  const story = stories[index];
  return <section className="state-story-card" aria-label="Historias y curiosidades"><div className="state-story-top"><span><BookOpen size={13} /> Historias de {stateName}</span><div><button type="button" onClick={() => setIndex((index - 1 + stories.length) % stories.length)} aria-label="Historia anterior"><ChevronLeft size={14} /></button><b>{index + 1}/{stories.length}</b><button type="button" onClick={() => setIndex((index + 1) % stories.length)} aria-label="Historia siguiente"><ChevronRight size={14} /></button></div></div><div className="state-story-body"><Quote size={22} /><span><small>{story.type}</small><strong>{story.title}</strong><p>{story.text}</p></span></div></section>;
}
