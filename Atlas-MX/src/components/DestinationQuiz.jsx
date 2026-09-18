import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, MapPin, RotateCcw, Sparkles, X } from 'lucide-react';
import { MATCH_QUESTIONS, matchDestinations } from '../utils/destinationMatcher';

export default function DestinationQuiz({ isOpen, onClose, onSelectState }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const finished = step >= MATCH_QUESTIONS.length;
  const results = finished ? matchDestinations(answers) : [];
  if (!isOpen) return null;

  const answer = (value) => {
    const question = MATCH_QUESTIONS[step];
    setAnswers((current) => ({ ...current, [question.id]: value }));
    setStep((current) => current + 1);
  };
  const restart = () => { setStep(0); setAnswers({}); };

  return <div className="experience-modal-layer" role="dialog" aria-modal="true" aria-label="Descubre tu próximo destino">
    <button type="button" className="experience-modal-backdrop" onClick={onClose} aria-label="Cerrar recomendador" />
    <section className="experience-modal quiz-modal">
      <header className="experience-modal-head"><div><span><Sparkles size={13} /> Recomendador Atlas MX</span><h2>Descubre tu próximo destino</h2><p>Tres preguntas, tres estados hechos para ti.</p></div><button type="button" onClick={onClose} aria-label="Cerrar recomendador"><X size={19} /></button></header>
      {!finished ? <div className="quiz-question">
        <div className="quiz-progress"><span style={{ width: `${((step + 1) / MATCH_QUESTIONS.length) * 100}%` }} /></div>
        <small>Pregunta {step + 1} de {MATCH_QUESTIONS.length}</small><h3>{MATCH_QUESTIONS[step].title}</h3>
        <div className="quiz-options">{MATCH_QUESTIONS[step].options.map(([value, label]) => <button key={value} type="button" onClick={() => answer(value)}><span>{label}</span><ArrowRight size={16} /></button>)}</div>
        {step > 0 && <button type="button" className="quiz-back" onClick={() => setStep((current) => current - 1)}><ArrowLeft size={13} /> Volver</button>}
      </div> : <div className="quiz-results">
        <span className="quiz-result-kicker">Tus mejores coincidencias</span><h3>Hay un México para cada forma de viajar</h3>
        <div>{results.map((result, index) => <article key={result.state.cve} className={index === 0 ? 'best' : ''}><b>#{index + 1}</b><span><small>{index === 0 ? 'Mejor coincidencia' : 'También te encantará'}</small><strong>{result.state.nombre}</strong><p>{result.categoryCount} experiencias relacionadas con tu interés y un perfil climático compatible.</p></span><button type="button" onClick={() => onSelectState?.(result.state)}><MapPin size={13} /> Explorar</button></article>)}</div>
        <button type="button" className="quiz-restart" onClick={restart}><RotateCcw size={13} /> Volver a empezar</button>
      </div>}
    </section>
  </div>;
}
