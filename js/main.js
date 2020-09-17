// ** EXECUTION AREA ** //


includeHTML();//link header file to other pages using lib by w3school

window.addEventListener('load', function() {



//**** Collapsible MENU ****/
//   https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapsible_animate
    let coll = document.getElementsByClassName("collapsible");
    for (i = 0; i < coll.length; i++) {

        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            console.log("hi");
            var content = this.nextElementSibling;

            if (content.style.maxHeight){
                content.style.maxHeight = null;


            } else {
                content.style.maxHeight = content.scrollHeight + "px";   
            } 
        });
    }


    
    let images = document.querySelectorAll(".picture_grid_imgs img");



    // test();//ok check this when wake up
    // document.querySelector('.view_options').style.display = "flex";
 
   // shuffle to different grid arrangement everytime
   shuffleListNodes(images);
   
 
    determineOrientation(images);// add horizontal | vertical class to tags
    addDataSource(images); // add data-src and paths


  


    document.querySelector('.picture_grid_container').style.display = "block";
    document.querySelector('.view_options').style.display = "flex";
    viewOptions();
    // (() => {//seems to not be neccessary
    //     if((
    //         window.location.href == "https://www.vrpixs.com" || 
    //         window.location.href == "http://www.vrpixs.com" || 
    //         window.location.href == "http://127.0.0.1:5501/build/" ) && 
    //         !isMobile()) {

    //         document.querySelector('.view_options').style.display = "flex";
    //     }
        
    //     viewOptions();
    //     })();
        // else {  document.querySelector('.view_options').style.display = "none";
        // }
    //    
    //          
    //    )};
  
    let flag = true;
    window.addEventListener('resize', () => {
   
        if (isMobile() && flag)  {//quick fix
            // document.querySelector('.view_options').style.display = "none";
            viewOptions(); 
            flag = false; //only allow this to run once even the window keeps resizing
        }
         if (!isMobile() && !flag)  {
            document.querySelector('.view_options').style.display = "block";
            viewOptions(); //fix this later, make it return to gridview once out of mobile
            flag = true;
          
         }

        });



     

    images.forEach(image => {observer.observe(image);}) //lazyload

  

 


    if (isTablet()) gridAnimation(100);
    else gridAnimation(30);
    

  
    //TODO

    // make the arrow keys work for transitioning to next/prev images
    // only show next/prev buttons when hover near the area. 
    // for the other pages, dont make the nav/logo sticky 

    //when switching from slideshow mode back and forth, active image restarts to index 0, fix this so it continues

    // make lazyload for thumbnails too, rn only work for HD ones
    // fix when switch viewoption then next&prev buttons in fullscreen need to wait for 1st active pix to traverse the the previous active pix before switch, 
 });   


 // ***** END EXECUTION AREA **** ///



// ***** Lazyloading images ***** ///

let options = {
    threshold: 0
    }

const observer = new IntersectionObserver(imageObserver, options);

function imageObserver(entries, observer) {
    entries.forEach(entry => {
        if(entry.isIntersecting){ 
        const img = entry.target;
        const img_src = img.dataset.src;
        // console.log("lazy loading", img);
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
        // let str2 = str[str.length-2].split("/");

        srcAttri = "." + str[str.length-2] + "-HD." + str[str.length-1]; //append HD to the name for HD quality photos
        // console.log(str);
        // console.log(srcAttri);
        image.dataset.src = srcAttri; 
    })    
};


function getOrientation(){
    var orientation = window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";

    console.log(orientation);
    return orientation;
}

function isMobile(){
    let isMobile = false
    if (getOrientation() == "Portrait" && window.innerWidth < 599 || getOrientation() == "Landscape" && window.innerHeight < 599 ){
       isMobile = true;
    }
     return isMobile;//is mobile 
}

function isTablet(){
    let isTablet = false
    if (getOrientation() == "Portrait" && (window.innerWidth >= 599 && window.innerWidth < 900) || getOrientation() == "Landscape" && (window.innerHeight >= 599 && window.innerHeight < 900)){
       isTablet = true;
    }
     return isTablet;//is mobile 
}

function determineOrientation(images){ //add horizontal or vertical class to element based on img's orientation
    if (images == undefined) return
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
/**** END UTILITY FUNCTIONS *****/



///******* ViewOptions *********///

function viewOptions(){//make option clicked selected

    let viewOpt = document.querySelectorAll('.view_options li');
    let active = "selected";
    let fullscreen = document.querySelector('#fullscreen_view');  
    let slides = document.querySelectorAll('.picture_grid_imgs li');
    let slideButtons = document.querySelectorAll('.buttons button')
    listNodes = document.querySelector('ul.picture_grid_imgs');
    imgNodes = listNodes.children;
    
  
    if (viewOpt){
        if (getOrientation() == "Landscape" || isTablet() || !isMobile()) viewOpt[0].classList.add(active); //not mobile
        else  viewOpt[1].classList.add(active);//TODO make phone in fullscreen mode by default
        screenSizeCheck();
    }
    else return;

    if (isMobile()){
        document.querySelector('.view_options').style.display = "none";
    }
    


    for (let i = 0; i < viewOpt.length; i++) {
        viewOpt[i].addEventListener("click", function() {//make viewoption active when clicked
          
            let current = document.getElementsByClassName(active);
            current[0].className = current[0].className.replace(active, "");
            this.className +=  " " + active;   
            screenSizeCheck();

      });

      
      
      document.querySelector('.brand_wrapper').addEventListener("click", function(){//brand logo onclick
          
         gridView();
         if (viewOpt) { 
            viewOpt[1].classList.remove(active);
            viewOpt[0].classList.add(active);
            gridAnimation(10);}
       

        

      })
   }

    function screenSizeCheck() {        
        addSlides(slides); //add tags to all img

        if (fullscreen.classList.contains(active)) { // if fullscreen selected

    
            slideButtons.forEach( (e) => { //display next/prev buttons
                e.style.display = 'block';
                document.querySelector('.picture_grid_imgs').style.overflow = 'hidden';
            })  
            

            if(getOrientation() == "Landscape" ){

                console.log(slides);
                filterHorizontalImages(imgNodes).forEach (e => {
                    console.log("filter horizontal images");
                    listNodes.appendChild(e); 

                });
                

                filterVerticalImages(imgNodes).forEach (e => {
                    console.log("remove vertical images");
                    listNodes.removeChild(e); 
                });



            }
            else { 

                console.log("appeding vertical imgs for slideshow")    
                filterVerticalImages(imgNodes).forEach (e => {
                    console.log("filter vertical images");
                    listNodes.appendChild(e); 
                }); 
                
                // console.log(slides);
                filterHorizontalImages(imgNodes).forEach (e => { //for some reason this remove everything. need fixing
                    console.log("remove horizontal images");
                    listNodes.removeChild(e); 
                        // console.log(e);
                    });  
                    // picture_grid_imgs.firstChild.classList.add('active'); //make the first pix active    
            }

            // auto = false; // auto scroll flag, globally declared
            if (auto) {
                // Run next slide at interval time
                slideInterval = setInterval(nextSlide, intervalTime);
            }

            // let containActive = [...listNodes.children].includes("active");
            imgNodes[0].classList.add('active');
            // if (!containActive)imgNodes[0].classList.add('active'); //make the first photo active once changed to fullscreen mode fix this, if already has active then dont addd!!! //TODO!

        }    
        else { //not in fullscreen mode
            hideSlides(slides);
            gridView();
            // gridAnimation();
        
            // auto = true; //turn off auto scroll when not in fullscreen
            clearInterval(slideInterval);// ^^
        };

    }

    function gridView(){

        slideButtons = document.querySelectorAll('.buttons button')

        hideSlides(slides);

        slideButtons.forEach( (e) => {//hide prev/next btns when in grid view
            e.style.display = 'none'; 
            // document.querySelector('.picture_grid_imgs').style.overflow = 'visible'; 
        })  ; 

        slides.forEach (e => {
            listNodes.appendChild(e); 
            // console.log(e);
        })

    }

    function filterVerticalImages(images){
        imgArr = Array.from(images);
        imgArrFiltered = imgArr.filter( vert => {
            return vert.className.includes("vertical")     
        });
        // console.log(imgArrFiltered);
        return imgArrFiltered;
    }
 

    function filterHorizontalImages(images){
        imgArr = Array.from(images);
        imgArrFiltered = imgArr.filter( hor => {
            return hor.className.includes("horizontal")     
        });
        // console.log(imgArrFiltered);
        return imgArrFiltered;
    }
}
///******* End viewOptions *********///




// //fullscreen api
// function launchIntoFullscreen(element) {
//     if(element.requestFullscreen) {
//       element.requestFullscreen();
//     } else if(element.mozRequestFullScreen) {
//       element.mozRequestFullScreen();
//     } else if(element.webkitRequestFullscreen) {
//       element.webkitRequestFullscreen();
//     } else if(element.msRequestFullscreen) {
//       element.msRequestFullscreen();
//     }
//   }


//   function exitFullscreen() {
//     if(document.exitFullscreen) {
//       document.exitFullscreen();
//     } else if(document.mozCancelFullScreen) {
//       document.mozCancelFullScreen();
//     } else if(document.webkitExitFullscreen) {
//       document.webkitExitFullscreen();
//     }
//   }

//   function requestFullScreen() {

//     var el = document.body;
  
//     // Supports most browsers and their versions.
//     var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen 
//     || el.mozRequestFullScreen || el.msRequestFullScreen;
  
//     if (requestMethod) {
  
//       // Native full screen.
//       requestMethod.call(el);
  
//     } else if (typeof window.ActiveXObject !== "undefined") {
  
//       // Older IE.
//       var wscript = new ActiveXObject("WScript.Shell");
  
//       if (wscript !== null) {
//         wscript.SendKeys("{F11}");
//       }
//     }
//   }
//*** Full Screen picture_grid_imgs ***// 

// const slides = document.querySelectorAll('.picture_grid_imgs li');
const next = document.querySelector('#next');
const prev = document.querySelector('#prev');
var auto = true; // Auto scroll
const intervalTime = 4000; 
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


///cont. here to fix bugs after shower, fullscreen active pix bug
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
        imgNodes[0].classList.add('active');

    
    }


    //edge cases
   //remove style from the last photo when cycle back to the second photo, not compulsary, not affecting functionality, just code aesthatic 
    if(imgNodes[1].classList.contains('active')) imgNodes[imgNodes.length -1].removeAttribute("style");
    if(imgNodes[imgNodes.length-1].classList.contains('active')) imgNodes[imgNodes.length-1].removeAttribute("style");

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
    else imgNodes[imgNodes.length -1].classList.add('active');

    //edge cases
    //remove style from the first photo when cycle back to the last photo, not compulsary, not affecting functionality, just code aesthatic 
    if(imgNodes[0].classList.contains('active')) imgNodes[2].removeAttribute("style");
    if(imgNodes[imgNodes.length -2].classList.contains('active')) imgNodes[0].removeAttribute("style"); 

    setTimeout(() => {
        active.classList.remove('active');
        if(active.nextElementSibling) active.nextElementSibling.removeAttribute("style");
    })
};
//*** END Full Screen picture_grid_imgs ***// 




  //*** SHUFFLE PHOTO GRID ******/

  function shuffleListNodes (listNodes) {
    listNodes = document.querySelector('ul.picture_grid_imgs'); //not neccessary as listNodes will be declared globally prior to functino call
    for (let i = listNodes.children.length; i >= 0; i--) {
        let shuffledNode = listNodes.children[Math.random() * i | 0]
        listNodes.appendChild(shuffledNode); //append || move the nodes in ul.picture_grid_imgs
        document.querySelector('.picture_grid_container').style.display = "block";
       
    }

    return listNodes;

}

//   *** DETECT HOVER ENABLED DEVICES *** //
    // https://stackoverflow.com/questions/23885255/how-to-remove-ignore-hover-css-style-on-touch-devices
  

//     function watchForHover() {
//     // lastTouchTime is used for ignoring emulated mousemove events
//     let lastTouchTime = 0
  
//     function enableHover() {
//       if (new Date() - lastTouchTime < 500) return
//       document.body.classList.add('hasHover')
//     }
  
//     function disableHover() {
//       document.body.classList.remove('hasHover')
//     }
  
//     function updateLastTouchTime() {
//       lastTouchTime = new Date()
//     }
  
//     document.addEventListener('touchstart', updateLastTouchTime, true)
//     document.addEventListener('touchstart', disableHover, true)
//     document.addEventListener('mousemove', enableHover, true)
  
//     enableHover()
//   }
  
//   watchForHover()

//   ** END HOVER DETECTION ** //

// ** END UTILITY FUNCTIONS ** //


  //anime.js lib animation

function gridAnimation(delay){  

    anime.timeline({
        easing:'easeOutExpo',})

    .add({
        targets: ".picture_grid_container .picture_grid_imgs img",
        duration: (el,i) => 700 + i*10,
        delay: (el,i) => i*delay,
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
    



function includeHTML() {
    var z, i, elmnt, file, xhttp;
    /*loop through a collection of all HTML elements:*/
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
      elmnt = z[i];
      /*search for elements with a certain atrribute:*/
      file = elmnt.getAttribute("w3-include-html");
      if (file) {
        /*make an HTTP request using the attribute value as the file name:*/
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status == 200) {elmnt.innerHTML = this.responseText;}
            if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
            /*remove the attribute, and call this function once more:*/
            elmnt.removeAttribute("w3-include-html");
            includeHTML();
          }
        }      
        xhttp.open("GET", file, true);
        xhttp.send();
        /*exit the function:*/
        return;
      }
    }
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