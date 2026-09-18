import { TOURISM_DATA } from '../src/data/states.js';
import { enrichTourismData, validateTourismData } from '../src/data/tourismEnhancer.js';
import { getTravelSeason, STATE_PROFILE } from '../src/data/travelSeasons.js';
import { TOURISM_INDEX } from '../src/data/tourismIndex.js';
import { STATE_STORIES } from '../src/data/stateStories.js';
import { CULTURAL_EVENTS } from '../src/data/culturalEvents.js';
const codes=Object.keys(TOURISM_DATA).sort();
if(codes.length!==32) throw new Error(`Se esperaban 32 estados y hay ${codes.length}`);
const failures=[];
for(const code of codes){ const t=enrichTourismData(code,TOURISM_DATA[code].turismo); const r=validateTourismData(code,t); if(!r.valid) failures.push(r); }
if(failures.length){ console.error(failures); process.exit(1); }
for(const code of codes){ const season=getTravelSeason(code); if(!STATE_PROFILE[code]||season.bestMonths.length<1) throw new Error(`Temporada de viaje incompleta para ${code}`); }
for(const category of ['naturaleza','playas','pueblos','historia','gastronomia']){ if(!TOURISM_INDEX.some((item)=>item.category===category)) throw new Error(`Índice turístico sin ${category}`); }
for(const code of codes){ if(!STATE_STORIES[code]?.text) throw new Error(`Historia estatal incompleta para ${code}`); }
for(const code of codes){ if(!CULTURAL_EVENTS.some((event)=>event.stateCode===code)) throw new Error(`Agenda cultural incompleta para ${code}`); }
console.log(`OK: ${codes.length} estados; todos tienen >=5 destinos, pueblos/lugares, historia y cocina.`);
