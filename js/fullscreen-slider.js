//*** Full Screen Slider ***//

// const slides = document.querySelectorAll('.slider li');
const next = document.querySelector('#next');
const prev = document.querySelector('#prev');
var auto = false; // Auto scroll
const intervalTime = 3000; 
let slideInterval;


next.addEventListener('click', e => {

    nextSlide();
    if (auto) {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, intervalTime);
    }
});

prev.addEventListener('click', e => {

    prevSlide();
    if (auto) {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, intervalTime);
    }
});

function addSlides(slides){
    
    slides.forEach(slide => {
        slide.classList.add('slide_img');
        })   
        // console.log("slide_img added");

};

function hideSlides(slides){
    
    slides.forEach(slide => {
        slide.classList.remove('slide_img');
        slide.removeAttribute("style");
        })

};


function nextSlide(){
    const active = document.querySelector('.active');

    active.classList.remove('active');
    active.style.transition = "opacity 1s ease-in-out";

    if(active.nextElementSibling) {
        if(active.nextElementSibling.style.display != "none"){
            active.nextElementSibling.classList.add('active');
        }

    }
    else {
        slides[0].classList.add('active');

    
    }
    // if(slides[0].classList.contains('active')) slides[slides.length -2].removeAttribute("style"); //remove style from the last photo when cycle back to the first photo, not compulsary, not affecting functionality, just code aesthatic 
    setTimeout(() => {
        active.classList.remove('active');
        if(active.previousElementSibling) active.previousElementSibling.removeAttribute("style");
    });
};

function prevSlide(){

    const active = document.querySelector('.active');
    active.classList.remove('active');
    active.style.transition = "opacity 1s ease-in-out";

    if(active.previousElementSibling) active.previousElementSibling.classList.add('active');
    else slides[slides.length -2].classList.add('active');

    // if(slides[0].classList.contains('active')) slides[1].removeAttribute("style");
    // if(slides[slides.length -2].classList.contains('active')) slides[0].removeAttribute("style"); //remove style from the first photo when cycle back to the last photo, not compulsary, not affecting functionality, just code aesthatic 

    setTimeout(() => {
        active.classList.remove('active');
        if(active.nextElementSibling) active.nextElementSibling.removeAttribute("style");
    })
};
