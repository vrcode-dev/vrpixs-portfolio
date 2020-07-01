



// ** EXECUTION AREA ** //




window.addEventListener('load', function() {
    let images = document.querySelectorAll("img");

   
    determineOrientation(images);// add horizontal | vertical class to tags
    addDataSource(images); // add data-src and paths

    document.querySelector('.picture_grid_container').style.display = "block"; //unhide from the annoyingthumbnail
    // images.forEach(image => {observer.observe(image);}) //lazyload
    getOrientation();
    gridAnimation();
 
    window.onresize =  viewOptions();
 
   
  


 });   









// ***** Lazyloading images *****

    let options = {
        threshold: 0

        }
    const observer = new IntersectionObserver(imageObserver, options);

    function imageObserver(entries, observer) {
        entries.forEach(entry => {
            if(entry.isIntersecting){ 
            const img = entry.target;
            const img_src = img.dataset.src;
            console.log("lazy loading", img);
            img.src = img_src;

            // img.classList.add('fade');
            observer.unobserve(img);
            }

        })
    }
// ***** END Lazyloading images *****


/**** UTILITY FUNCTIONS *****/

function addDataSource(images){ //add data-src and image's path to img tag for Lazyloading
   
    images.forEach(image => {
    
        let srcAttri = image.getAttribute("src"); 
        let str = srcAttri.split(".");

        srcAttri = "." + str[str.length-2] + "-HD." + str[str.length-1]; //append HD to the name for HD quality photos
        // console.log(str);
        // console.log(srcAttri);
        image.dataset.src = srcAttri; 
    })
    
};



function determineOrientation(images){ //add horizontal or vertical class to parent element based on img's orientation
    if (images == undefined) return
    console.log(images);
    images.forEach(image => {
    // console.log(image);
    let width = image.naturalWidth;
    let height = image.naturalHeight;
    // console.log("natural width=" + width + ", " + "natural height=" + height); //print out the size

    if (width > height) image.parentElement.classList.add('horizontal'); 
    else if (width < height) image.parentElement.classList.add('vertical');
    else return

    })
};



function viewOptions(){//make option clicked selected

    const viewOpt = document.querySelectorAll('.view_options li');
    let active = "selected";
    const grid = document.querySelector('#grid_view');
    const fullscreen = document.querySelector('#fullscreen_view');  
    const slides = document.querySelectorAll('.slider li');
    const slider = document.querySelector(".slider");
    // console.log(slide);
  
    // const slider = 
    const slideButtons = document.querySelectorAll('.buttons button')
    

    //1st option as a default
    slides[0].classList.add('active'); //make the first pix active by default  


    if (getOrientation() == "Landscape") viewOpt[0].classList.add(active); 
    else  viewOpt[1].classList.add(active);
    screenSizeCheck();

    function screenSizeCheck() {        
        
        if (fullscreen.classList.contains(active)) {

        slideButtons.forEach( (e) => { //display next/prev buttons
            e.style.display = 'block';
        })  

        document.querySelector('.slider').style.overflow = 'hidden';

            if(getOrientation() == "Landscape" ){

                addSlides(slides);
            
                // console.log(slider);
                filterHorizontalImages(slides).forEach (e => {
                    slider.appendChild(e); 
                    // console.log(e);
                });
                

                filterVerticalImages(slides).forEach (e => {
                    slider.removeChild(e); 
                    console.log(e);
                });
                console.log(slides);
            }
            else { 
                addSlides(slides);

                console.log("appeding vertical imgs for slideshow")    
                filterVerticalImages(slides).forEach (e => {
                    slider.appendChild(e); 
                    // console.log(e);
                }); 

                slides[1].classList.add('active');// put active in vertical pixs so it shows when in portraits, hard coding as vert img is 2nd in the list
                
                // console.log(slides);
                filterHorizontalImages(slides).forEach (e => { //for some reason this remove everything. need fixing
                    slider.removeChild(e); 
                        // console.log(e);
                    });  
                    // slider.firstChild.classList.add('active'); //make the first pix active    
            }

            auto = true; // auto scroll flag, globally declared
            if (auto) {
                // Run next slide at interval time
                slideInterval = setInterval(nextSlide, intervalTime);
            }

        }    
        else { //not in fullscreen mode
            hideSlides(slides);
            defaultView();
            gridAnimation();

        
        

            auto = false; //turn off auto scroll when not in fullscreen
            clearInterval(slideInterval);// ^^
        };
    }
   

   

    for (let i = 0; i < viewOpt.length; i++) {
        viewOpt[i].addEventListener("click", function() {//make viewoption active when clicked
        let current = document.getElementsByClassName(active);
        current[0].className = current[0].className.replace(active, "");
        this.className +=  " " + active;   

        screenSizeCheck();

      });
      document.querySelector('.brand_wrapper').addEventListener("click", function(){
         defaultView();
         viewOpt[1].classList.remove(active);
         viewOpt[0].classList.add(active);
         gridAnimation();
        

      })

   }
}


function defaultView(){
    const slideButtons = document.querySelectorAll('.buttons button')
    const slider = document.querySelector(".slider");
    hideSlides(slides);

    slideButtons.forEach( (e) => {//hide prev/next btns when in grid view
        e.style.display = 'none'; 
        document.querySelector('.slider').style.overflow = 'visible'; 
    })  ; 

    slides.forEach (e => {
        slider.appendChild(e); 
        // console.log(e);
    })

}

function filterVerticalImages(images){
    imgArr = Array.from(images);
    imgArrFiltered = imgArr.filter( vert => {
        return vert.className.includes("vertical")     
    });
    console.log(imgArrFiltered);
    return imgArrFiltered;
}
 

function filterHorizontalImages(images){
    imgArr = Array.from(images);
    imgArrFiltered = imgArr.filter( hor => {
        return hor.className.includes("horizontal")     
    });
    console.log(imgArrFiltered);
    return imgArrFiltered;
}


function getOrientation(){
    var orientation = window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";

    console.log(orientation);
    return orientation;

}




//*** Full Screen Slider ***//

// const slides = document.querySelectorAll('.slider li');
const next = document.querySelector('#next');
const prev = document.querySelector('#prev');
var auto = false; // Auto scroll
const intervalTime = 3000; 
const slides = document.querySelectorAll(".slider li") //make this global?
let slideInterval;


function addSlides(slides){
    
    slides.forEach(slide => {

    slide.classList.add('slide_img');
    })

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


    if(active.previousElementSibling){

        active.previousElementSibling.classList.add('active');

     
    }
    else slides[slides.length -2].classList.add('active');

    // if(slides[0].classList.contains('active')) slides[1].removeAttribute("style");
    // if(slides[slides.length -2].classList.contains('active')) slides[0].removeAttribute("style"); //remove style from the first photo when cycle back to the last photo, not compulsary, not affecting functionality, just code aesthatic 

    setTimeout(() => {
        active.classList.remove('active');
        if(active.nextElementSibling) active.nextElementSibling.removeAttribute("style");
    })
};



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


  

// ** END UTILITY FUNCTIONS ** //


  //anime.js lib animation

function gridAnimation(){  

    anime.timeline({
        easing:'easeOutExpo',})

    .add({
        targets: ".picture_grid_container .slider img",
        duration: (el,i) => 1000 + i*75,
        delay: (el,i) => i*50,
        opacity: {
            value: [0,1],
            easing: 'linear'
        },
        scale: [0,1],	
        opacity:[0,1],
        // offset:'-=700',
        }
    )    
    // .add({  
    //     targets: '.brand_wrapper',
    //     // loop: true,
    //     direction: 'alternate',
    //     // strokeDashoffset: [anime.setDashoffset, 0],
    //     easing: 'easeInOutSine',
    //     duration: 700,
    //     delay: (el, i) => { return i * 500 }
    //   }
    // )    
};
    



// //CSSgrid.io

// const gallery = document.querySelector('.gallery');
// const overlay = document.querySelector('.overlay');
// const overlayImage = overlay.querySelector('img');
// const overlayClose = overlay.querySelector('.close');
// function generateHTML([h, v]) {
//   return `
//     <div class="item h${h} v${v}">
//       <img src="https://cdn.rawgit.com/jsfiddle/css-grid/master/20%20-%20CSS%20Grid%20Image%20Gallery/images/${randomNumber(12)}.jpg">
//       <div class="item__overlay">
//         <button>View →</button>
//       </div>
//     </div>
//   `;
// }
// function randomNumber(limit) {
//   return Math.floor(Math.random() * limit) + 1;
// }
// function handleClick(e) {
//   const src = e.currentTarget.querySelector('img').src;
//   overlayImage.src = src;
//   overlay.classList.add('open');
// }
// function close() {
//   overlay.classList.remove('open');
// }
// const digits = Array.from({ length: 50 }, () => [randomNumber(4), randomNumber(4)]);
// const html = digits.map(generateHTML).join('');
// gallery.innerHTML = html;
// const items = document.querySelectorAll('.item');
// items.forEach(item => item.addEventListener('click', handleClick));
// overlayClose.addEventListener('click', close);


// var geometry = justifiedLayout([0.5, 1.5, 1, 1.8, 0.4, 0.7, 0.9, 1.1, 1.7, 2, 2.1])