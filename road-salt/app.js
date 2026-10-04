'use strict';
const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const inputs=['salt','safety','water'];
let totalSelected='benefit',impactSelected='safety',yaw=-12,drag=null;
const impactText={
  safety:['Safety benefit','Salt lowers water’s freezing point and helps clear ice. The model values avoided crash harm and safer travel. Its benefit curve flattens as more salt is used; plowing and storm conditions stay fixed.',1,'benefit'],
  cars:['Vehicle corrosion','Salty slush and road spray expose vehicles to corrosion. Drivers can face repair bills. This model counts those repairs separately from road-agency costs.',2,'cars'],
  water:['Freshwater contamination','Salt dissolves in meltwater and can reach streams, lakes, and groundwater. Chloride can persist and harm freshwater life. The model’s water-damage dollars are an assumption, not a measured salt concentration.',3,'water'],
  plants:['Vegetation damage','Road spray and salty soil can stress roadside plants and damage their growth. A study in the Adirondacks found changes in roadside soils and vegetation linked to winter road management.',5,'plants'],
  structures:['Infrastructure costs','Salt exposure can corrode steel and damage bridge components. Later repair bills are assigned to the winter that caused the damage in this model. Salt purchase and application are counted separately.',2,'structures']
};
function values(){return {salt:Number($('salt').value),safety:Number($('safety').value),water:Number($('water').value)};}
function svg(tag,attrs){const e=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v]of Object.entries(attrs))e.setAttribute(k,v);return e;}
function renderChart(a){
  const data=Array.from({length:20},(_,x)=>SaltModel.nextTon(x,a.safety,a.water));
  const max=Math.ceil(Math.max(...data.flatMap(r=>[r.benefit,r.environment,r.cost]))/1000)*1000;
  const mobile=window.matchMedia('(max-width:700px)').matches;
  const width=mobile?640:900,left=mobile?80:76,right=width-35,top=50,bottom=345;
  $('chart').setAttribute('viewBox',`0 0 ${width} 420`);
  const xp=x=>left+(right-left)*x/19,yp=y=>bottom-(bottom-top)*y/max;
  const grid=$('chart-grid');grid.replaceChildren();
  for(let i=0;i<=4;i++){const y=max*i/4;grid.append(svg('line',{x1:left,x2:right,y1:yp(y),y2:yp(y),stroke:'#d6e1e7'}));const t=svg('text',{x:left-12,y:yp(y)+5,'text-anchor':'end'});t.textContent=money(y);grid.append(t);}
  for(const x of [0,5,10,15,19]){const t=svg('text',{x:xp(x),y:373,'text-anchor':'middle'});t.textContent=x;grid.append(t);}
  for(const key of ['benefit','environment','cost'])$(''+key+'-path').setAttribute('d',data.map((d,x)=>`${x?'L':'M'}${xp(x).toFixed(2)},${yp(d[key]).toFixed(2)}`).join(' '));
  $('selected-line').setAttribute('x1',xp(a.salt));$('selected-line').setAttribute('x2',xp(a.salt));
  $('selected-dots').replaceChildren(...['benefit','environment','cost'].map((key,i)=>svg('circle',{cx:xp(a.salt),cy:yp(data[a.salt][key]),r:6,fill:['#167b69','#b8512f','#7556a1'][i],stroke:'white','stroke-width':2})));
  const axisLabels=$('chart').querySelectorAll('.axis-label');axisLabels[1].setAttribute('x',(left+right)/2);
  $('chart-svg-desc').textContent=`At ${a.salt} tons, adding one more gives ${money(data[a.salt].benefit)} in safety, ${money(data[a.salt].environment)} in environmental damage, and ${money(data[a.salt].cost)} in all costs. Green safety benefits decline, while orange environmental damage and dashed purple total costs rise. The vertical line marks ${a.salt} tons.`;
  const rows=data.map((n,x)=>{const tr=document.createElement('tr');for(const s of [`${x} → ${x+1}`,money(n.benefit),money(n.environment),money(n.cost)]){const td=document.createElement('td');td.textContent=s;tr.append(td);}return tr;});$('chart-table').replaceChildren(...rows);
}
function renderTotals(c){
  for(const key of ['benefit','environment','cost']){const p=$('pillar-'+key);p.style.setProperty('--height',(200*c[key]/24000).toFixed(3)+'px');p.style.setProperty('--visible',c[key]>0?'1':'0');$('total-'+key).textContent=money(c[key]);}
  const text={benefit:`${money(c.benefit)} is the model’s total value of safer travel for the entire winter. It is measured relative to no salt, with the same plowing and other conditions.`,environment:`${money(c.environment)} combines ${money(c.water)} in freshwater damage and ${money(c.plants)} in vegetation damage attributed to this winter.`,cost:`${money(c.cost)} includes environmental damage (${money(c.environment)}), vehicle corrosion (${money(c.cars)}), infrastructure damage (${money(c.structures)}), and salt purchase/application (${money(c.application)}).`};
  $('total-detail').textContent=text[totalSelected];
  $('season-net').textContent=`Season net benefit: ${money(c.net)} = total safety benefit minus all costs. ${c.net>=0?'This season can still bring a net benefit even if the next ton is no longer worthwhile.':'Under these assumptions, all season costs exceed all season safety benefits.'}`;
  document.querySelectorAll('[data-total]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.total===totalSelected)));
}
function renderImpact(c){const [title,text,source,key]=impactText[impactSelected];$('path-detail').replaceChildren();const p=document.createElement('p'),strong=document.createElement('strong');strong.textContent=title+': ';p.append(strong,document.createTextNode(text+' '));const cite=document.createElement('a');cite.href='#source-'+source;cite.className='cite';cite.textContent='['+source+']';p.append(cite);const number=document.createElement('p');number.style.marginTop='12px';number.textContent=`Selected winter total in the model: ${money(c[key])}${key==='benefit'?' benefit.':' damage.'}`;$('path-detail').append(p,number);document.querySelectorAll('[data-impact]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.impact===impactSelected)));}
function render(){
  const a=values(),c=SaltModel.calculate(a.salt,a.safety,a.water),n=SaltModel.nextTon(a.salt,a.safety,a.water),s=SaltModel.summary(a.safety,a.water);
  $('salt-out').textContent=a.salt+' tons';$('safety-out').textContent=a.safety.toFixed(1)+'×';$('water-out').textContent=a.water.toFixed(1)+'×';
  $('salt').setAttribute('aria-valuetext',a.salt+' US tons applied during one winter');
  $('next-title').textContent=`Adding ton ${a.salt+1}: ${a.salt} → ${a.salt+1} tons`;
  $('next-benefit').textContent=money(n.benefit);$('next-environment').textContent=money(n.environment);$('next-cost').textContent=money(n.cost);
  let text;if(n.environment>n.benefit)text=`The next ton causes ${money(n.environment-n.benefit)} more environmental damage than extra safety benefit. Counting every cost, it lowers net benefit by ${money(-n.net)}.`;else if(n.cost>n.benefit)text=`The next ton’s safety benefit exceeds its environmental damage, but adding repairs and application makes its total extra cost ${money(-n.net)} greater than its extra benefit.`;else text=`The next ton adds ${money(n.net)} in net benefit after all costs. Its extra safety benefit still exceeds its extra environmental damage.`;
  $('verdict').textContent=text;
  for(const [id,cross,title] of [['environment-threshold',s.firstEnvironment,'Environment-only crossover'],['all-threshold',s.firstAllCosts,'Crossover counting all costs']]){const p=$(id);p.replaceChildren();const strong=document.createElement('strong');strong.textContent=title;p.append(strong,document.createTextNode(cross===null?'No crossover in the tested one-ton steps from 0 to 20 tons.':`First occurs when adding ton ${cross+1} (${cross} → ${cross+1} tons), under your selected assumptions.`));}
  renderChart(a);renderTotals(c);renderImpact(c);
}
inputs.forEach(id=>$(id).addEventListener('input',()=>{document.querySelectorAll('[data-preset]').forEach(b=>b.setAttribute('aria-pressed','false'));render();}));
document.querySelectorAll('[data-preset]').forEach(b=>b.addEventListener('click',()=>{const a=values();$('salt').value=b.dataset.preset==='early'?3:b.dataset.preset==='late'?16:Math.min(19,SaltModel.summary(a.safety,a.water).best.salt);render();document.querySelectorAll('[data-preset]').forEach(other=>other.setAttribute('aria-pressed',String(other===b)));}));
document.querySelectorAll('[data-total]').forEach(b=>b.addEventListener('click',()=>{totalSelected=b.dataset.total;const a=values();renderTotals(SaltModel.calculate(a.salt,a.safety,a.water));}));
document.querySelectorAll('[data-impact]').forEach(b=>b.addEventListener('click',()=>{impactSelected=b.dataset.impact;const a=values();renderImpact(SaltModel.calculate(a.salt,a.safety,a.water));}));
function rotate(){yaw=Math.max(-35,Math.min(35,yaw));$('scene').style.setProperty('--yaw',yaw+'deg');}
$('rotate-left').addEventListener('click',()=>{yaw-=10;rotate();});$('rotate-right').addEventListener('click',()=>{yaw+=10;rotate();});$('reset-view').addEventListener('click',()=>{yaw=-12;rotate();});
$('scene').addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;drag={x:e.clientX,y:e.clientY,yaw};});
window.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>10&&Math.abs(dx)>Math.abs(e.clientY-drag.y)){$('scene').classList.add('dragging');yaw=drag.yaw+dx*.25;rotate();}});
window.addEventListener('pointerup',()=>{drag=null;$('scene').classList.remove('dragging');});window.addEventListener('pointercancel',()=>{drag=null;$('scene').classList.remove('dragging');});
$('download').addEventListener('click',()=>{const a=values(),header=['salt_US_short_tons_per_lane_mile_winter','safer_travel_multiplier','water_vulnerability_multiplier','safety_benefit_USD','freshwater_damage_USD','vegetation_damage_USD','vehicle_corrosion_USD','infrastructure_damage_USD','salt_application_USD','environmental_damage_USD','all_costs_USD','net_benefit_USD','next_ton_safety_USD','next_ton_environment_USD','next_ton_all_costs_USD'];const rows=[header.join(',')];for(let x=0;x<=20;x++){const c=SaltModel.calculate(x,a.safety,a.water),n=x<20?SaltModel.nextTon(x,a.safety,a.water):null;rows.push([x,a.safety,a.water,...['benefit','water','plants','cars','structures','application','environment','cost','net'].map(k=>c[k].toFixed(2)),...(n?[n.benefit,n.environment,n.cost].map(y=>y.toFixed(2)):['','',''])].join(','));}const url=URL.createObjectURL(new Blob([rows.join('\n')+'\n'],{type:'text/csv;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download='road-salt-your-scenario.csv';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);});
window.addEventListener('resize',()=>renderChart(values()));
render();
