import React,{useCallback,useEffect,useMemo,useRef,useState} from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import { estadosTopoJSON, ESTADOS, CENTROIDES_ESTADOS, estado as getEstadoByCve } from '@webrek/mx-geo';
import { formatPopulation } from '../utils/map';
import { getFilterLabel, getStateCategoryStats } from '../data/tourismCategories';
const WIDTH=960, HEIGHT=640;
export default function MexicoMap({selectedState,onSelectState,zoom,setZoom,pan,setPan,showLabels,tourismFilter='todos',activeRoute}){
 const ref=useRef(null), drag=useRef(false), start=useRef({x:0,y:0}); const [tip,setTip]=useState(null);
 const {paths,centroids}=useMemo(()=>{ const fc=feature(estadosTopoJSON,estadosTopoJSON.objects.estados); const projection=geoMercator().fitExtent([[34,34],[WIDTH-34,HEIGHT-34]],fc); const p=geoPath(projection), ps={},cs={}; fc.features.forEach(f=>ps[f.properties.cve]=p(f)); Object.entries(CENTROIDES_ESTADOS).forEach(([c,ll])=>{const pt=projection(ll);if(pt)cs[c]=pt}); return {paths:ps,centroids:cs}; },[]);
 const wheel=useCallback(e=>{e.preventDefault();setZoom(z=>Math.max(.8,Math.min(6,z*(e.deltaY<0?1.15:.87))))},[setZoom]);
 useEffect(()=>{const el=ref.current;if(!el)return;el.addEventListener('wheel',wheel,{passive:false});return()=>el.removeEventListener('wheel',wheel)},[wheel]);
 const down=e=>{if(e.button!==0)return;drag.current=true;start.current={x:e.clientX-pan.x,y:e.clientY-pan.y}};
 const move=e=>{if(drag.current)setPan({x:e.clientX-start.current.x,y:e.clientY-start.current.y}); if(tip&&ref.current){const r=ref.current.getBoundingClientRect();setTip(t=>t&&({...t,x:e.clientX-r.left,y:e.clientY-r.top}))}};
 const enter=(c,e)=>{const s=getEstadoByCve(c);if(!s||!ref.current)return;const r=ref.current.getBoundingClientRect();setTip({x:e.clientX-r.left,y:e.clientY-r.top,state:s})};
 const filterLabel=getFilterLabel(tourismFilter);
 const routePoints=(activeRoute?.stateCodes||[]).map(code=>centroids[code]).filter(Boolean);
 return <div className="map-viewport" ref={ref} onMouseDown={down} onMouseMove={move} onMouseUp={()=>drag.current=false} onMouseLeave={()=>{drag.current=false;setTip(null)}}>
   <div className="map-title-card"><strong>República Mexicana</strong><span>{tourismFilter==='todos'?'Mapa interactivo · INEGI':`Capa: ${filterLabel}`}</span></div>
   {tip&&<div className="map-tooltip-hud" style={{left:tip.x,top:tip.y}}><strong>{tip.state.nombre}</strong><span>{tip.state.capital} · {formatPopulation(tip.state.poblacion)} hab.</span>{tourismFilter!=='todos'&&<span className="map-tooltip-category">{getStateCategoryStats(tip.state.cve)[tourismFilter]||0} opciones de {filterLabel.toLocaleLowerCase('es-MX')}</span>}</div>}
   <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="map-svg"><defs><filter id="glow"><feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#ef4444" floodOpacity=".5"/></filter></defs><g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
   {ESTADOS.map(s=>{const count=getStateCategoryStats(s.cve)[tourismFilter]||0;const filtered=tourismFilter!=='todos';const inRoute=activeRoute?.stateCodes?.includes(s.cve);return paths[s.cve]&&<path key={s.cve} d={paths[s.cve]} className={`state-path ${selectedState?.cve===s.cve?'state-selected':''} ${filtered?(count>0?'state-filter-match':'state-filter-muted'):''} ${inRoute?'state-route':''}`} style={filtered?{'--category-strength':Math.min(1,.32+(count*.11))}:undefined} filter={selectedState?.cve===s.cve?'url(#glow)':undefined} onMouseEnter={e=>enter(s.cve,e)} onMouseMove={e=>enter(s.cve,e)} onMouseLeave={()=>setTip(null)} onClick={()=>onSelectState?.(getEstadoByCve(s.cve))} role="button" tabIndex="0" aria-label={`${s.nombre}${filtered?`, ${count} opciones de ${filterLabel}`:''}`} onKeyDown={e=>{if(e.key==='Enter'||e.key===' ')onSelectState?.(getEstadoByCve(s.cve))}}/>}) }
   {routePoints.length>1&&<g className="tourist-route-layer" aria-hidden="true"><polyline points={routePoints.map(point=>point.join(',')).join(' ')} /><g>{routePoints.map((point,index)=><circle key={`${point[0]}-${point[1]}`} cx={point[0]} cy={point[1]} r="5" />)}</g></g>}
   {showLabels&&ESTADOS.map(s=>{const pt=centroids[s.cve];if(!pt)return null;return <text key={s.cve} x={pt[0]} y={pt[1]} textAnchor="middle" dominantBaseline="middle" className={`state-label ${selectedState?.cve===s.cve?'selected':''}`}>{s.abreviatura}</text>})}
   </g></svg>
 </div>
}
