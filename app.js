const DATA_URL = "data/sites.json";
let allSites = [];
let selectedId = null;
let activeCategory = "";

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const categories = [...new Set([])];

async function init(){
  try{
    const res = await fetch(DATA_URL);
    if(!res.ok) throw new Error("Could not load directory data");
    allSites = await res.json();
    populateFilters();
    renderStats();
    renderChips();
    render();
    $("updated").textContent = "Starter directory · data checked for initial publication";
  }catch(err){
    $("cards").innerHTML = `<div class="loading">Directory data could not be loaded. Run this site through a local web server or GitHub Pages.</div>`;
    console.error(err);
  }
}
function populateFilters(){
  [...new Set(allSites.map(s=>s.category))].sort().forEach(c=>{
    const o=document.createElement("option");o.value=c;o.textContent=c;$("category-filter").append(o);
  });
  [...new Set(allSites.flatMap(s=>s.state.split(" / ")))].sort().forEach(st=>{
    const o=document.createElement("option");o.value=st;o.textContent=st;$("state-filter").append(o);
  });
}
function renderStats(){
  $("total-count").textContent=allSites.length;
  $("state-count").textContent=new Set(allSites.flatMap(s=>s.state.split(" / "))).size;
  $("category-count").textContent=new Set(allSites.map(s=>s.category)).size;
}
function renderChips(){
  const featured=["National Park","Wildlife Sanctuary","Bird Sanctuary","Tiger Reserve","Ramsar Site","Biosphere Reserve"];
  $("quick-chips").innerHTML=`<button class="chip active" data-cat="">All places</button>`+featured.map(c=>`<button class="chip" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
  $("quick-chips").addEventListener("click",e=>{
    const b=e.target.closest("[data-cat]");if(!b)return;
    activeCategory=b.dataset.cat;$("category-filter").value=activeCategory;
    document.querySelectorAll(".chip").forEach(x=>x.classList.toggle("active",x===b));render();
  });
}
function filtered(){
  const q=$("search").value.trim().toLowerCase(),cat=$("category-filter").value,state=$("state-filter").value,sort=$("sort-filter").value;
  let list=allSites.filter(s=>{
    const hay=[s.name,s.category,s.state,s.district,s.ecosystem,s.summary,...s.species].join(" ").toLowerCase();
    return (!q||hay.includes(q))&&(!cat||s.category===cat)&&(!state||s.state.split(" / ").includes(state));
  });
  list.sort((a,b)=>sort==="state"?a.state.localeCompare(b.state)||a.name.localeCompare(b.name):sort==="area"?(b.area_km2||0)-(a.area_km2||0):a.name.localeCompare(b.name));
  return list;
}
function render(){
  const list=filtered();
  $("result-count").textContent=`${list.length} of ${allSites.length} records`;
  $("cards").innerHTML=list.map(s=>`<article class="place-card ${selectedId===s.id?"selected":""}" data-id="${esc(s.id)}" tabindex="0" role="button" aria-label="Explore ${esc(s.name)}">
    <div class="card-top"><span class="tag">${esc(s.category)}</span><span class="arrow">↗</span></div>
    <h3>${esc(s.name)}</h3><div class="location">${esc(s.state)} · ${esc(s.district)}</div>
    <div class="card-bottom"><span>${esc(s.ecosystem)}</span><span>${s.area_km2?`${Number(s.area_km2).toLocaleString("en-IN")} km²`:"Details"} </span></div>
  </article>`).join("");
  $("empty-state").hidden=list.length!==0;
  $("cards").style.display=list.length?"grid":"none";
  $("cards").querySelectorAll(".place-card").forEach(card=>{
    card.addEventListener("click",()=>selectSite(card.dataset.id));
    card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();selectSite(card.dataset.id)}});
  });
  if(selectedId && list.some(s=>s.id===selectedId)) renderDetail(selectedId);
  else if(!list.some(s=>s.id===selectedId)){selectedId=null;showEmptyDetail();}
}
function selectSite(id){selectedId=id;render();renderDetail(id);if(window.innerWidth<900)$("detail-panel").scrollIntoView({behavior:"smooth",block:"start"});}
function showEmptyDetail(){$("detail-panel").innerHTML=`<div class="detail-empty"><span>✳</span><h3>Choose a place to explore</h3><p>Open any directory card to see its habitat, notable species, location and source reference.</p></div>`;}
function renderDetail(id){
  const s=allSites.find(x=>x.id===id);if(!s)return;
  const map=`https://www.openstreetmap.org/?mlat=${s.coordinates[0]}&mlon=${s.coordinates[1]}#map=10/${s.coordinates[0]}/${s.coordinates[1]}`;
  $("detail-panel").innerHTML=`<span class="tag">${esc(s.category)}</span><h3>${esc(s.name)}</h3><div class="detail-location">${esc(s.district)} · ${esc(s.state)}</div>
  <p class="detail-summary">${esc(s.summary)}</p>
  <div class="detail-meta"><div><span>Notification / year</span><strong>${esc(s.year||"Not specified")}</strong></div><div><span>Area</span><strong>${s.area_km2?`${Number(s.area_km2).toLocaleString("en-IN")} km²`:"Not verified"}</strong></div><div><span>Habitat</span><strong>${esc(s.ecosystem)}</strong></div><div><span>Directory ID</span><strong>${esc(s.id)}</strong></div></div>
  <p style="font-size:9px;letter-spacing:.12em;color:#b6c7b4;margin:18px 0 8px">NOTABLE SPECIES / BIODIVERSITY</p><div class="species">${s.species.map(x=>`<span>${esc(x)}</span>`).join("")}</div>
  <div class="detail-actions"><a href="${map}" target="_blank" rel="noreferrer">View map ↗</a><a href="${esc(s.source)}" target="_blank" rel="noreferrer">Source reference ↗</a><button id="save-btn">☆ Save place</button></div>`;
  const saved=JSON.parse(localStorage.getItem("inh-saved")||"[]");
  const btn=$("save-btn");if(saved.includes(id)){btn.textContent="★ Saved";btn.classList.add("saved")}
  btn.addEventListener("click",()=>{
    let arr=JSON.parse(localStorage.getItem("inh-saved")||"[]");
    arr=arr.includes(id)?arr.filter(x=>x!==id):[...arr,id];localStorage.setItem("inh-saved",JSON.stringify(arr));
    btn.textContent=arr.includes(id)?"★ Saved":"☆ Save place";btn.classList.toggle("saved",arr.includes(id));
  });
}
$("search").addEventListener("input",render);
$("category-filter").addEventListener("change",()=>{activeCategory=$("category-filter").value;document.querySelectorAll(".chip").forEach(x=>x.classList.toggle("active",x.dataset.cat===activeCategory));render()});
$("state-filter").addEventListener("change",render);
$("sort-filter").addEventListener("change",render);
$("clear-filters").addEventListener("click",()=>{$("search").value="";$("category-filter").value="";$("state-filter").value="";$("sort-filter").value="name";activeCategory="";document.querySelectorAll(".chip").forEach(x=>x.classList.toggle("active",x.dataset.cat===""));render()});
init();
