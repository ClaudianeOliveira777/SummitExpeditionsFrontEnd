
import { CountUp } from 'https://cdn.jsdelivr.net/npm/countup.js@2.0.7/dist/countUp.min.js';


//-----------------------------------------
// 1) Dados (configuração)
//-----------------------------------------
const slides = [
  { title: "MOUNT EVEREST", description: "Nepal, 8,848.86m / 29,032ft.", image: "assets/images/Everest4.avif" },
  { title: "K2", description: "Pakistan, 8,611m / 28,251ft.", image: "assets/images/K2.avif" },
  { title: "LHOTSE", description: "Nepal, 8,516m / 27,940ft.", image: "assets/images/Lhotse.avif" },
  { title: "MOUNT FUJI", description: "Japan, 3,776m / 12,389ft.", image: "assets/images/Fuji.avif" },
  { title: "CHAMONIX", description: "France, 1,035m / 3,396ft.", image: "assets/images/Chamonix.avif" }
]

// Elementos do DOM
const slide1 = document.getElementById("slide1");
const slide2 = document.getElementById("slide2");
const btnNext = document.getElementById("btn-next");
const btnPrev = document.getElementById("btn-prev");

//-----------------------------------------
// 2) Estado (guarda informações que mudam)
//-----------------------------------------
let currentSlide = 0;
let activeSlide = slide1;
let inactiveSlide = slide2;
let autoSlideInterval;     
let isAnimating = false;

//-----------------------------------------
// 3) Funções (as "ferramentas reutilizáveis")
//-----------------------------------------

// Função genérica - carrega conteúdo do slide
function loadSlide(index, targetSlide){
  const slideData = slides[index];

  // Define a imagem de fundo
  targetSlide.style.backgroundImage = `url('${slideData.image}')`;

  // Atualiza título e descrição
  targetSlide.querySelector('.tour-name').textContent = slideData.title;
  targetSlide.querySelector('.tour-description').textContent = slideData.description;
}

// Função que troca de slide
function goToSlide(slideDirection){
  if (isAnimating) return;
  isAnimating = true;

  // Calcula novo índice (circular com módulo)
  currentSlide = (currentSlide + slideDirection + slides.length) % slides.length;

  // Carrega próximo slide
  loadSlide(currentSlide, inactiveSlide);

  // Alterna as classes 
  activeSlide.classList.remove("active");
  inactiveSlide.classList.add("active");  

  // Troca os papéis de ativo/inativo
  [activeSlide, inactiveSlide] = [inactiveSlide, activeSlide];

  // Libera transição após a duração da animação CSS
  setTimeout(() => {
    isAnimating = false;
  }, 1000)
}

// Inicia autoplay
function startAutoSlide() {
  clearInterval(autoSlideInterval);  // Para timer anterior
  autoSlideInterval = setInterval(() => goToSlide(1), 5000);
}

// Pré-carrega todas as imagens no início
function preloadImages(){
  slides.forEach(slide => {
    const img = new Image();
    img.src = slide.image;
  });
}

// Inicializar o slider
function initSlider(){
  // Pré carrega imagens
  preloadImages();

  // Carrega o PRIMEIRO slide
  loadSlide(currentSlide, activeSlide);
  activeSlide.classList.add("active");

  // Começa autoplay
  startAutoSlide();

  // Eventos de clique - REINICIA TIMER
  btnNext.addEventListener("click", () => {
    goToSlide(1);
    startAutoSlide();  // ← Reinicia timer
  });
  
  btnPrev.addEventListener("click", () => {
    goToSlide(-1);
    startAutoSlide();  // ← Reinicia timer
  });
}

//-----------------------------------------
// 4) Fluxo principal (início do programa)
//-----------------------------------------
initSlider();


//Menu Desktop Expeditions
const expeditionslinkDesktop = document.getElementById('expeditionslinkDesktop');
const submenuDesktop = document.getElementById('submenuDesktop');


expeditionslinkDesktop.addEventListener('mouseenter', () =>{
 submenuDesktop.classList.add('open');
});

// Fecha o submenu quando o mouse sai do link **e do submenu**
expeditionslinkDesktop.addEventListener('mouseleave', () => {
  submenuDesktop.classList.remove('open');
});

submenuDesktop.addEventListener('mouseenter', () => {
  submenuDesktop.classList.add('open');
});

submenuDesktop.addEventListener('mouseleave', () => {
  submenuDesktop.classList.remove('open');
});






// Menu Mobile
const hamburguer = document.getElementById('hamburguer');
const navMobile = document.getElementById('nav-mobile');
const subMenuExpeditions = document.getElementById('expeditions-link');

const subMenu = document.getElementById('submenu');

hamburguer.addEventListener('click', ()=>{
  navMobile.classList.toggle('open');

  hamburguer.classList.toggle('open');


   // Esconde ou mostra as setas
  btnPrev.style.display = navMobile.classList.contains('open') ? "none" : "block";
  btnNext.style.display = navMobile.classList.contains('open') ? "none" : "block";
  

});

subMenuExpeditions.addEventListener('click', (e)=>{
 e.preventDefault();
 

  subMenu.classList.toggle('open');
});



//Stats - Parallax Effect
const container = document.getElementById('statsContainer');
const clouds = document.getElementById('statsClouds');
const statsData = document.querySelector('.stats-data');
let onScroll;

// ===============================
// 2) Init Observer (parallax + counters)
// ===============================
function initStats(){
 if(!container || !clouds || !statsData) return;

 const observerViewport = new IntersectionObserver((elements) => {
  elements.forEach(element =>{
    if(element.isIntersecting){
      
      //Ativa counters
      statsData.querySelectorAll('.counter').forEach(counter => {
       
        animateCounter(counter, +counter.dataset.target);
      });

      //Ativa parallax
      const onScroll = () => parallaxEffect(container, clouds);
      window.addEventListener('scroll', onScroll, {passive: true});
      window.addEventListener('resize', () => parallaxEffect(container, clouds));
      parallaxEffect(container, clouds); 
    } else {
      window.removeEventListener('scroll', onScroll);
    }
  });
 }, {threshold: 0.1});

 observerViewport.observe(container);

}


//Parallax Effect
function parallaxEffect(container, clouds){
  const rect = container.getBoundingClientRect();
  const parallaxSpeed = 0.4;
  const yPos = -(rect.top * parallaxSpeed);
  clouds.style.transform = `translateY(${yPos}px)`;
}

// Counter Animation
function animateCounter (counter, target, duration = 2500){

const countUp = new CountUp(counter, target, {
    startVal: +counter.textContent,
    duration: duration / 1000, // Converte ms para segundos
    separator: '',
   
    useGrouping: false,
  });
  
  if (!countUp.error) {
    countUp.start();
  } else {
    console.error(countUp.error);
    counter.textContent = target; // Fallback
  }

}


document.addEventListener("DOMContentLoaded", initStats);