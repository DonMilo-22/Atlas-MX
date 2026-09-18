import { TOURISM_DATA } from '../src/data/states.js';
import { enrichTourismData, validateTourismData } from '../src/data/tourismEnhancer.js';
import { getTravelSeason, STATE_PROFILE } from '../src/data/travelSeasons.js';
const codes=Object.keys(TOURISM_DATA).sort();
if(codes.length!==32) throw new Error(`Se esperaban 32 estados y hay ${codes.length}`);
const failures=[];
for(const code of codes){ const t=enrichTourismData(code,TOURISM_DATA[code].turismo); const r=validateTourismData(code,t); if(!r.valid) failures.push(r); }
if(failures.length){ console.error(failures); process.exit(1); }
for(const code of codes){ const season=getTravelSeason(code); if(!STATE_PROFILE[code]||season.bestMonths.length<1) throw new Error(`Temporada de viaje incompleta para ${code}`); }
console.log(`OK: ${codes.length} estados; todos tienen >=5 destinos, pueblos/lugares, historia y cocina.`);
