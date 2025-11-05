
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
// Só PREPARA o slide: coloca imagem, texto
// Não sabe sobre animação ou troca
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
  if (isAnimating) return; //Se true, para aqui
  isAnimating = true; //Se false, muda pra true

  // Calcula novo índice (circular com módulo)
  currentSlide = (currentSlide + slideDirection + slides.length) % slides.length;

  // 1) Carrega próximo slide no background
  loadSlide(currentSlide, inactiveSlide);

  // 2) Alterna as classes 
  activeSlide.classList.remove("active");
  inactiveSlide.classList.add("active");  

  // 3) Troca os papéis de ativo/inativo
  [activeSlide, inactiveSlide] = [inactiveSlide, activeSlide];

  //Depois de 1 segundo, volta pra false. //evita varios cliques 
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




//-----------------------------------------
// 1) Menu Mobile
//-----------------------------------------

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




// ===============================
//  Section - Stats - Parallax Effect
// ===============================

const container = document.getElementById('statsContainer');
const clouds = document.getElementById('statsClouds');
const statsData = document.querySelector('.stats-data');
let onScroll;


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
      onScroll = () => parallaxEffect(container, clouds);
      window.addEventListener('scroll', onScroll);
      window.addEventListener('resize', onScroll);
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

initStats();


// ===============================
// 2) Customer
// ===============================
function initCustomerSlide(){
    const customerContainer = document.querySelectorAll('.customer-container');
    const dots = document.querySelectorAll('.indicator');

    let currentIndex = 0;
 
    const displayCommment = (index) =>{
      customerContainer.forEach(comment =>
        comment.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        customerContainer[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    };


    const nextComment = () =>{
      const nextIndex = (currentIndex + 1) % customerContainer.length;
      displayCommment(nextIndex);
    };

    // Timer automático
    setInterval(nextComment, 5000);

    dots.forEach((dot, index) =>{
      dot.addEventListener('click', () =>{
        displayCommment(index);
      });
    });

    //Teclado
    document.addEventListener('keydown', (e) =>{

     if(e.key === 'ArrowLeft'){
      const prevIndex = (currentIndex - 1 + customerContainer.length) % customerContainer.length;
      displayCommment(prevIndex);
     } else if
      (e.key === 'ArrowRight'){
        nextComment();
      };
     });


    displayCommment(0);
    
    //Cleanup aq (no React pra evitar Memory leak, veja no doc word)

}

initCustomerSlide();


// ===============================
// Gallery
// ===============================

import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {getFirestore, doc, setDoc, getDoc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const db = getFirestore(initializeApp({
  apiKey: "AIzaSyD9yAnS5rKRHx3s0fswbF6WtYeXA6PZf5k",
  authDomain: "galeria-likes.firebaseapp.com",
  projectId: "galeria-likes",
  storageBucket: "galeria-likes.firebasestorage.app",
  messagingSenderId: "390622878792",
  appId: "1:390622878792:web:e304214fcce17a37c94c7d"
}));

const countCache = new Map();

// Especialista em UI/Atualiza a tela
function likeDisplay(photoId, likeCount){
  const targetImg = document.querySelector(`[data-photo-id="${photoId}"]`);
  const likesCounter = targetImg.querySelector('.likes-counter');

  if(!likesCounter) return;

  likesCounter.textContent = `${likeCount}  like${likeCount !== 1 ? 's' : ''} `;
  targetImg.classList.toggle('liked', likeCount > 0);
  
  countCache.set(photoId, likeCount); //os argumentos entram (quando chamam a função likeDisplay() → atualizam a tela → e são guardados no cache.

}

  // COORDENA a lógica
  // 1. Calcula novo valor
  // 2. Chama a UI: "likeDisplay, atualize a tela"
  // 3. Salva no banco
async function toggleLike(photoId){
  try{
    const targetImg = document.querySelector(`[data-photo-id="${photoId}"]`);
    const currentCount = countCache.get(photoId) || 0;
    const newCount = targetImg.classList.contains('liked') ?  currentCount - 1 : currentCount + 1;

    likeDisplay(photoId, newCount); //primeiro manda pra função likeDisplay pra atualizar a UI
    await setDoc(doc(db, 'likes', photoId), {count: newCount}); //depois salva no banco de dados

  } catch (error){
    console.error('Erro ao atualizar like:', error);
    likeDisplay(photoId, countCache(photoId) || 0);
                //primeiro para o HTML e o segundo para o cache.
  }
}


//likeDisplay e toggleLike
//princípio de separação de responsabilidades. Uma cuida da interface e outra da lógica e persistência.

//Carrega os likes reais para o db
async function loadLikes() {
  const photos = document.querySelectorAll('.photo-item');

  await Promise.all(Array.from(photos).map(async (item) => {
    
    const photoId = item.dataset.photoId;

    try {
      const docSnap = await getDoc(doc(db, 'likes', photoId));
      likeDisplay(photoId, docSnap.exists() ? docSnap.data().count : 0);
    } catch (error) {
      console.error(`Erro ao carregar likes para ${photoId}:`, error);
      likeDisplay(photoId, 0);
    }
  }));
}

loadLikes();

window.toggleLike = toggleLike;


// Arrows
const gallery = document.querySelector('.photo-gallery');
document.querySelector('.arrow-left').addEventListener('click', () => gallery.scrollBy({left: -320, behavior: 'smooth'}));
document.querySelector('.arrow-right').addEventListener('click', () => gallery.scrollBy({left: 320, behavior: 'smooth'}));

