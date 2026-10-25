'use strict';
const $ = s => document.querySelector(s);
const modelSelect = $('#model');
const yearSelect = $('#year');
let selectedBrand = null;
const names = {hyundai:'هيونداي', kia:'كيا'};
const currentYear = new Date().getFullYear();
$('#copyright').textContent = currentYear;
for(let y=currentYear+1;y>=1985;y--) yearSelect.add(new Option(String(y),String(y)));
function selectModel(name){
 modelSelect.value=name;
 document.querySelectorAll('.model-card').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.model===name)));
 updateSearch();
}
function selectBrand(brand){
 selectedBrand=brand;
 document.querySelectorAll('[data-brand]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.brand===brand)));
 $('#selection').hidden=false;
 $('#selection-brand').textContent=names[brand];
 $('#models').replaceChildren();
 modelSelect.replaceChildren(new Option('اختر الموديل',''));
 MODELS.filter(m=>m.brand===brand).forEach(m=>{
  modelSelect.add(new Option(m.name,m.name));
  const b=document.createElement('button'); b.type='button'; b.className='model-card'; b.dataset.model=m.name; b.setAttribute('aria-pressed','false');
  const img=document.createElement('img'); img.src=m.image; img.alt=''; img.loading='lazy'; img.width=150; img.height=90;
  const label=document.createElement('span');label.textContent=m.name;
  b.append(img,label);b.addEventListener('click',()=>selectModel(m.name));$('#models').append(b);
 });
 updateSearch();
 $('#selection').scrollIntoView({behavior:document.body.classList.contains('paused')?'instant':'smooth',block:'nearest'});
}
function searchQuery(){
 const type=$('input[name=type]:checked').value;
 const modelTerm=modelSelect.value.split(' - ')[0];
 const terms=[type==='engine'?'بطانة تحت المكينة':type==='wheel'?'بطانة كفر':'بطانة',modelTerm];
 if(yearSelect.value) terms.push(yearSelect.value);
 if(type==='wheel') terms.push($('#position').value,$('#side').value);
 return terms.filter(Boolean).join(' ');
}
function updateSearch(){
 $('#wheel-options').hidden=$('input[name=type]:checked').value!=='wheel';
 $('#query-preview').textContent=modelSelect.value?searchQuery():'اختر الموديل لتجهيز رابط البحث';
}
document.querySelectorAll('[data-brand]').forEach(b=>b.addEventListener('click',()=>selectBrand(b.dataset.brand)));
modelSelect.addEventListener('change',()=>selectModel(modelSelect.value));
$('#search-form').addEventListener('change',updateSearch);
$('#search-form').addEventListener('submit',e=>{
 e.preventDefault();if(!selectedBrand||!$('#search-form').reportValidity())return;
 location.assign('https://doracars.com/search?q='+encodeURIComponent(searchQuery()));
});
document.querySelectorAll('[data-type-link]').forEach(a=>a.addEventListener('click',()=>{
 $('input[name=type][value='+a.dataset.typeLink+']').checked=true;updateSearch();
}));
const motion=$('.motion-toggle');
function setPaused(paused){document.body.classList.toggle('paused',paused);motion.setAttribute('aria-pressed',String(paused));motion.textContent=paused?'▷ تشغيل الحركة':'Ⅱ إيقاف الحركة';motion.setAttribute('aria-label',paused?'تشغيل الحركة':'إيقاف الحركة');}
setPaused(matchMedia('(prefers-reduced-motion: reduce)').matches);
motion.addEventListener('click',()=>setPaused(!document.body.classList.contains('paused')));