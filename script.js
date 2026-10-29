const progress = document.getElementById("readingProgress");
const nav = document.getElementById("navLinks");
const menuToggle = document.getElementById("menuToggle");

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${percent}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Gallery lightbox. Replace the placeholder image paths with your own photos.
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxMessage = document.getElementById("lightboxMessage");
document.querySelectorAll(".photo-tile").forEach(tile => {
  tile.addEventListener("click", () => {
    const path = tile.dataset.photo;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    lightboxImage.src = path;
    lightboxImage.alt = tile.querySelector(".tile-caption")?.textContent || "Newsletter photo";
    lightboxImage.style.display = "block";
    lightboxMessage.textContent = "";
    lightboxImage.onerror = () => {
      lightboxImage.style.display = "none";
      lightboxMessage.textContent = "This is a photo placeholder. Add your image to the assets folder using the filename shown in the HTML.";
    };
  });
});
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  lightboxImage.style.display = "block";
}
document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeLightbox();
});

// Demo feedback form: opens the visitor's email app. Replace this with a real
// anonymous Google Form or backend endpoint before putting the site online.
document.getElementById("noteForm").addEventListener("submit", event => {
  event.preventDefault();
  const category = document.getElementById("noteType").value;
  const message = document.getElementById("noteMessage").value.trim();
  const subject = encodeURIComponent(`AIA newsletter note — ${category}`);
  const body = encodeURIComponent(`Category: ${category}\n\n${message}\n\nSent from the AIESEC in Amaravati newsletter demo.`);
  document.getElementById("formStatus").textContent =
    "Your email app should open now. This demo does not send or store notes on its own.";
  window.location.href = `mailto:YOUR-NEWSLETTER-EMAIL@example.com?subject=${subject}&body=${body}`;
});

// Animated constellation background (lightweight canvas, no external library).
const cosmos = document.getElementById('cosmosCanvas');
const cosmosCtx = cosmos.getContext('2d');
let stars = [], cosmosW = 0, cosmosH = 0, pointer = {x: -1000, y: -1000};
function sizeCosmos(){
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cosmosW = window.innerWidth; cosmosH = window.innerHeight;
  cosmos.width = Math.floor(cosmosW*dpr); cosmos.height = Math.floor(cosmosH*dpr);
  cosmos.style.width = cosmosW+'px'; cosmos.style.height = cosmosH+'px';
  cosmosCtx.setTransform(dpr,0,0,dpr,0,0);
  const count = Math.min(110, Math.floor(cosmosW/11));
  stars = Array.from({length:count},()=>({x:Math.random()*cosmosW,y:Math.random()*cosmosH,r:Math.random()*1.5+.35,a:Math.random()*.65+.18,phase:Math.random()*Math.PI*2,speed:Math.random()*.008+.002,vx:(Math.random()-.5)*.12,vy:(Math.random()-.5)*.12}));
}
function drawCosmos(){
  cosmosCtx.clearRect(0,0,cosmosW,cosmosH);
  stars.forEach((s,i)=>{
    s.phase += s.speed; s.x += s.vx; s.y += s.vy;
    if(s.x<0)s.x=cosmosW;if(s.x>cosmosW)s.x=0;if(s.y<0)s.y=cosmosH;if(s.y>cosmosH)s.y=0;
    const alpha=s.a*(.65+.35*Math.sin(s.phase));
    cosmosCtx.beginPath();cosmosCtx.arc(s.x,s.y,s.r,0,Math.PI*2);cosmosCtx.fillStyle=`rgba(218,207,255,${alpha})`;cosmosCtx.fill();
    for(let j=i+1;j<stars.length;j++){
      const t=stars[j],dx=s.x-t.x,dy=s.y-t.y,dist=Math.hypot(dx,dy);
      if(dist<105){cosmosCtx.beginPath();cosmosCtx.moveTo(s.x,s.y);cosmosCtx.lineTo(t.x,t.y);cosmosCtx.strokeStyle=`rgba(163,145,255,${(1-dist/105)*.12})`;cosmosCtx.lineWidth=.6;cosmosCtx.stroke();}
    }
  });
  if(pointer.x>0){const g=cosmosCtx.createRadialGradient(pointer.x,pointer.y,0,pointer.x,pointer.y,170);g.addColorStop(0,'rgba(139,112,255,.09)');g.addColorStop(1,'rgba(139,112,255,0)');cosmosCtx.fillStyle=g;cosmosCtx.fillRect(pointer.x-170,pointer.y-170,340,340);}
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(drawCosmos);
}
sizeCosmos();drawCosmos();window.addEventListener('resize',sizeCosmos);window.addEventListener('pointermove',e=>{pointer.x=e.clientX;pointer.y=e.clientY},{passive:true});

// Tiny pixel Spidey has a few friendly lines and a little web-swing interaction.
const spidey = document.getElementById('pixelSpidey');
const spideyTrigger = document.getElementById('spideyTrigger');
const spideyBubble = document.getElementById('spideyBubble');
const spideyLines = [
  'Psst… tiny reminder: your story belongs in this constellation. <b>Tap me!</b>',
  'With great power comes… great group-chat notifications. <b>Stay iconic.</b>',
  'You bring the spark. AIA brings the whole galaxy. <b>To infinity & beyond!</b>',
  'Achievement unlocked: you made it this far down the newsletter. <b>+100 XP</b>',
  'Friendly neighbourhood Spidey says: celebrate the small wins too. <b>They count.</b>'
];let spideyLine=-1;
spideyTrigger.addEventListener('click',()=>{
  spideyLine=(spideyLine+1)%spideyLines.length;
  spideyBubble.innerHTML=spideyLines[spideyLine];
  spidey.classList.add('is-chatting','web-swing');
  window.setTimeout(()=>spidey.classList.remove('web-swing'),850);
});
spideyTrigger.addEventListener('dblclick',()=>{document.getElementById('highlights').scrollIntoView({behavior:'smooth'});});
document.addEventListener('click',e=>{if(!spidey.contains(e.target))spidey.classList.remove('is-chatting')});
