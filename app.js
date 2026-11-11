const products = [
{id:1,name:"Dunk Low Retro",category:"Sneakers",audience:"Homme",price:115,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",tag:"BEST-SELLER",colors:["#e9e7df","#20221d"]},
{id:2,name:"Essential Oversized Tee",category:"T-shirts",audience:"Homme",price:32,image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85",tag:"NOUVEAU",colors:["#e9e7df","#292b27","#a9a59a"]},
{id:3,name:"Streetwear Set",category:"Ensembles",audience:"Femme",price:78,image:"https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=85",tag:"DROP 01",colors:["#292b27","#b5a99a"]},
{id:4,name:"Air Runner Classic",category:"Sneakers",audience:"Sneakers",price:98,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",tag:"ICONIQUE",colors:["#d6d6d2","#20221d"]},
{id:5,name:"Urban Cargo Pants",category:"Pantalons",audience:"Homme",price:64,image:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85",tag:"SÉLECTION",colors:["#77776a","#24251f"]},
{id:6,name:"Minimal Shoulder Bag",category:"Accessoires",audience:"Accessoires",price:45,image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=85",tag:"NOUVEAU",colors:["#25251f","#9b8977"]},
{id:7,name:"Daily Hoodie",category:"Sweats",audience:"Femme",price:59,image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=85",tag:"ESSENTIEL",colors:["#d8d5cc","#34352e"]},
{id:8,name:"Retro Court Sneakers",category:"Sneakers",audience:"Sneakers",price:105,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",tag:"LIMITED",colors:["#f1eee7","#b13d2d"]}
];
const state={filter:"Tout",query:"",sort:"featured",cart:[],favorites:new Set()};
const $=(selector)=>document.querySelector(selector);
const money=(amount)=>new Intl.NumberFormat("fr-FR",{maximumFractionDigits:0}).format(amount)+" $";
function renderProducts(){
 let list=products.filter(p=>(state.filter==="Tout"||p.audience===state.filter||p.category===state.filter)&&(p.name+" "+p.category+" "+p.audience).toLowerCase().includes(state.query.toLowerCase()));
 if(state.sort==="low")list.sort((a,b)=>a.price-b.price);if(state.sort==="high")list.sort((a,b)=>b.price-a.price);
 $("#products").innerHTML=list.map(p=>`<article class="product-card"><div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="product-tag">${p.tag}</span><button class="favorite ${state.favorites.has(p.id)?"active":""}" data-favorite="${p.id}" aria-label="Ajouter ${p.name} aux favoris">♡</button><button class="quick-add" data-add="${p.id}">AJOUTER AU PANIER　＋</button></div><div class="product-info"><p class="product-category">${p.category} / ${p.audience}</p><h3 class="product-name">${p.name}</h3><div class="product-bottom"><span class="product-price">${money(p.price)}</span><span class="product-colors">${p.colors.map(c=>`<i style="background:${c}"></i>`).join("")}</span></div></div></article>`).join("");
 $("#empty-state").hidden=list.length>0;
}
function renderCart(){
 const count=state.cart.reduce((s,i)=>s+i.qty,0),total=state.cart.reduce((s,i)=>s+i.price*i.qty,0);
 $(".cart-count").textContent=count;$(".drawer-count").textContent="("+count+")";$("#cart-subtotal").textContent=money(total);
 $("#cart-footer").hidden=count===0;
 $("#cart-items").innerHTML=count===0?`<div class="cart-empty"><span>🛍</span><h3>Ton panier est vide</h3><p>Quelques belles pièces t’attendent.</p><button class="button button-dark continue-shopping">Découvrir la boutique</button></div>`:state.cart.map(i=>`<div class="cart-line"><img src="${i.image}" alt=""><div><h4>${i.name}</h4><small>${money(i.price)}</small><div class="qty-control"><button data-qty="${i.id}" data-delta="-1" aria-label="Retirer un article">−</button><span>${i.qty}</span><button data-qty="${i.id}" data-delta="1" aria-label="Ajouter un article">+</button></div></div><strong class="line-price">${money(i.price*i.qty)}</strong></div>`).join("");
}
function openCart(){ $("#cart-drawer").classList.add("open");$("#drawer-backdrop").classList.add("open");$("#cart-drawer").setAttribute("aria-hidden","false");document.body.style.overflow="hidden"; }
function closeCart(){ $("#cart-drawer").classList.remove("open");$("#drawer-backdrop").classList.remove("open");$("#cart-drawer").setAttribute("aria-hidden","true");document.body.style.overflow=""; }
let toastTimer;
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2200);}
document.addEventListener("click",e=>{
 const add=e.target.closest("[data-add]");if(add){const p=products.find(x=>x.id===Number(add.dataset.add));const item=state.cart.find(x=>x.id===p.id);if(item)item.qty++;else state.cart.push({...p,qty:1});renderCart();toast(p.name+" ajouté au panier");}
 const fav=e.target.closest("[data-favorite]");if(fav){const id=Number(fav.dataset.favorite);state.favorites.has(id)?state.favorites.delete(id):state.favorites.add(id);fav.classList.toggle("active");}
 const qty=e.target.closest("[data-qty]");if(qty){const item=state.cart.find(x=>x.id===Number(qty.dataset.qty));item.qty+=Number(qty.dataset.delta);if(item.qty<=0)state.cart=state.cart.filter(x=>x.id!==item.id);renderCart();}
 const filter=e.target.closest("[data-filter]");if(filter){state.filter=filter.dataset.filter;document.querySelectorAll(".filter-chip").forEach(b=>b.classList.toggle("active",b===filter));renderProducts();}
 if(e.target.closest(".cart-toggle"))openCart();
 if(e.target.closest(".close-drawer")||e.target.id==="drawer-backdrop"||e.target.closest(".continue-shopping"))closeCart();
 if(e.target.closest(".search-toggle")){$("#search-panel").classList.toggle("visible");if($("#search-panel").classList.contains("visible"))$("#search-input").focus();}
 if(e.target.closest(".menu-toggle"))$(".main-nav").classList.toggle("open");
 if(e.target.closest(".checkout-button"))toast("La commande en ligne sera activée dans la prochaine étape.");
 const nav=e.target.closest("[data-nav-category]");if(nav){state.filter=nav.dataset.navCategory;document.querySelectorAll(".filter-chip").forEach(b=>b.classList.toggle("active",b.dataset.filter===state.filter));renderProducts();$(".main-nav").classList.remove("open");}
});
$("#search-input").addEventListener("input",e=>{state.query=e.target.value;renderProducts();});
$("#clear-search").addEventListener("click",()=>{$("#search-input").value="";state.query="";renderProducts();});
$("#sort-select").addEventListener("change",e=>{state.sort=e.target.value;renderProducts();});
$("#newsletter-form").addEventListener("submit",e=>{e.preventDefault();$("#newsletter-message").textContent="Merci ! L’inscription sera activée avec le service e-mail.";$("#newsletter-email").value="";});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart();});
renderProducts();renderCart();