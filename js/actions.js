//Menu actions
const menuToggle = document.getElementById('menuToggle');
const header = document.getElementById('header--scroll');
const menu = document.getElementById('menu');
const submenu = document.querySelector('.submenu');
const mobileSubmenuTrigger = document.querySelector('.dropdown--mobile');
const menuItems = document.querySelectorAll('.header__menu a.link-section');

menuToggle.addEventListener('change', () => {
    menu.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : 'auto';
});

menuItems.forEach((menuItem) => {
    menuItem.addEventListener('click', (e) => {
        menu.classList.remove('active');
        menuToggle.checked = !menuToggle.checked;
        document.body.style.overflow = 'auto';

        const targetId = menuItem.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            const offset = 30;
            const targetPosition = targetSection.offsetTop - offset;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            e.preventDefault();
        }
    });
});

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const scrollThreshold = 10; 

    if (scrollY > scrollThreshold) {
        header.classList.add('fixed');
    } else {
        header.classList.remove('fixed');
    }
});

mobileSubmenuTrigger.addEventListener('click', (e) => {
    e.preventDefault();

    mobileSubmenuTrigger.classList.toggle('dropdown');

    if (window.innerWidth <= 768) {
        submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
    }
});

//Scroll Animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        /* console.log(entry);  show for debugging*/
        if(entry.isIntersecting) {
            entry.target.classList.add('show--animated');
        } else {
            entry.target.classList.remove('show--animated');
        }
    });
});
const hiddenElements = document.querySelectorAll('.anim--scroll');
hiddenElements.forEach((el) => observer.observe(el));

//Slider
const characterSlider = document.querySelector('#characterSlider')
const carousel = new bootstrap.Carousel(characterSlider, {
    interval: 5000,
    keyboard: true,
    touch: true
});

//Joke Modal
const thkModal = document.getElementById('thk-modal');
const sendBtn = document.getElementById('sendBtn');

thkModal.addEventListener('shown.bs.modal', () => {
    sendBtn.focus();
});


/* API Rest */
const API_URL = 'https://rickandmortyapi.com/api/character/';

async function getData() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.log(error);
      return [];
    }
}

function setStatus(status) {
    const statusColor = {'Alive': 'green', 'Dead': 'red', 'Unknown': 'gray'};
    return !statusColor[status] ? 'gray' : statusColor[status]
}

function createCharacterDiv(character) {
    const characterDiv = document.createElement('div');
    const statusColor = setStatus(character.status);
    characterDiv.classList.add('col-12', 'col-md-3', 'd-flex', 'justify-content-center');
    characterDiv.innerHTML = `
        <div class="single-character">
            <div class="character-img">
                <img src="${character.image}" alt="${character.name}" class="img-fluid" />
            </div>
            <div class="character-info">
                <h3>${character.name}</h3>
                <span class="status">
                    <span class="status-icon ${statusColor}"></span>
                    ${character.status}-${character.species}
                </span>
                <h4>Last known location:</h4>
                <p>${character.location.name}</p>
                <h4>Origin</h4>
                <p>${character.origin.name}</p>
            </div>
        </div>`;
    return characterDiv;
}

async function renderCarousel() {
    const characters = await getData();
    const carouselInner = document.querySelector('.carousel-inner');
    const screenWidth = window.innerWidth;

    if (screenWidth <= 768) {
        // Mobile layout
        characters.forEach((character, index) => {
            const carouselItem = document.createElement('div');
            const characterDiv = createCharacterDiv(character);
            carouselItem.classList.add('carousel-item');
            carouselItem.appendChild(characterDiv);
            // Set the first item as active
            if (index === 0) {
                carouselItem.classList.add('active');
            }
            carouselInner.appendChild(carouselItem);
        });
    } else {
        // Desktop layout
        // 4 per carousel item
        for (let i = 0; i < characters.length; i += 4) {
            const characterGroup = characters.slice(i, i + 4);
            const carouselItem = document.createElement('div');
            carouselItem.classList.add('carousel-item');
            
            const characterGroupDiv = document.createElement('div');
            characterGroupDiv.classList.add('character-group', 'row');
            
            characterGroup.forEach((character) => {
                const characterDiv = createCharacterDiv(character);
                characterGroupDiv.appendChild(characterDiv);
            });
    
            carouselItem.appendChild(characterGroupDiv);
            carouselInner.appendChild(carouselItem);
    
            // Set the first item as active
            if (i === 0) {
                carouselItem.classList.add('active');
            }
        }
    }
}

renderCarousel();
