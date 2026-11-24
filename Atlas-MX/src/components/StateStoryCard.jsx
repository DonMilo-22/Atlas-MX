import React from 'react';
import { BookOpen, Quote } from 'lucide-react';
import { STATE_STORIES } from '../data/stateStories';

export default function StateStoryCard({ stateCode, stateName }) {
  const story = STATE_STORIES[stateCode];
  if (!story) return null;
  return (
    <section className="state-story-card" aria-label={`Historia de ${stateName}`}>
      <div className="state-story-top"><span><BookOpen size={13} aria-hidden="true" /> Sabías que…</span></div>
      <div className="state-story-body"><Quote size={22} aria-hidden="true" /><span><small>{story.type}</small><strong>{story.title}</strong><p>{story.text}</p></span></div>
    </section>
  );
}
