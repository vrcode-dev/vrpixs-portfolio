// ** EXECUTION AREA ** //
window.addEventListener('load', function() {

includeHTML();//link header file to other pages using lib by w3school

  
    let listNodes = document.querySelector('ul.picture_grid_imgs');

     
 
    images = document.querySelectorAll(".picture_grid_imgs img"); 
    
   
  
    if (checkPageLocation("homepage")){ //when on homepage
     
        shuffleListNodes(listNodes);  // shuffle to different grid arrangement everytime
        allSlides = document.querySelectorAll('.picture_grid_imgs li'); //implicitly global declared, stored images after shuffled
        determineOrientation(images);// add horizontal | vertical class to tags
        addDataSource(images); // add data-src and paths
      
     // when resizing from desktop to mobile, switch view when isMobile
     let isMobileFlag = true;
     let notMobileFlag =true

     window.addEventListener('resize', () => {  
 
         if (isMobile() && isMobileFlag && checkPageLocation("homepage"))  {//quick fix
             viewOptions(); 
             isMobileFlag = false; //only allow this to run once even the window keeps resizing
             notMobileFlag = true;
             console.log("isMobile");
         }
 
         if (!isMobile() && notMobileFlag && checkPageLocation("homepage"))  {
             document.querySelector('.view_options').style.display = "flex";
             document.querySelector('.picture_grid_imgs').style.overflow = 'visible';
             viewOptions(); 
             console.log("notMobile");
             isMobileFlag = true;
             notMobileFlag = false;
 
         //TODO, need to display all images in the grid when transition to gridview on resize, not just vertical ones, 
         // i.e: need to make copy of the whole grid and append each node back when on grid view, save cooy to an array and append
         
         }
        
    });
        //different grid animation timing based on device
        if (isTablet()) gridAnimation(100);
        else gridAnimation(30);  
 }



if (checkPageLocation("pAeriels")){
    //custom js for Aerial page goes here
}


if (document.body.classList == "mansory-grid"){
    var grid = document.querySelector('.grid');
    var msnry;
    
    imagesLoaded( grid, function() {
      // init Isotope after all images have loaded
      msnry = new Masonry( grid, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true
      });
    });
}



});  


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


///******* ViewOptions *********///

function viewOptions(){//make option clicked selected

    let viewOpt = document.querySelectorAll('.view_options li');
    let active = "selected";
    let fullscreen = document.querySelector('#fullscreen_view');  
    let slides = document.querySelectorAll('.picture_grid_imgs li');
    let slideButtons = document.querySelectorAll('.buttons button')
    listNodes = document.querySelector('ul.picture_grid_imgs');
    imgNodes = listNodes.children;
    console.log(viewOpt);

   
    if (getOrientation() == "Landscape" || isTablet() || !isMobile()) {
        viewOpt[0].classList.add(active); //not mobile
        viewOpt[1].classList.remove(active);
        gridView();
        console.log("grid active");
    }
    else  {
        viewOpt[1].classList.add(active);//TODO make phone in fullscreen mode by default
        viewOpt[0].classList.remove(active);
        console.log("fullscreen active");
    }
    checkViewOpt();

    if (isMobile()){
        document.querySelector('.view_options').style.display = "none";

    }

    for (let i = 0; i < viewOpt.length; i++) {
        viewOpt[i].addEventListener("click", function() {//make viewoption active when clicked
          
            let current = document.getElementsByClassName(active);
            current[0].className = current[0].className.replace(active, "");
            this.className +=  " " + active;   
            checkViewOpt();
      });
   }

    function checkViewOpt() {        
        addSlides(slides); //add tags to all img


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


        if (fullscreen.classList.contains(active)) { // if fullscreen selected



                slideButtons.forEach( (e) => { //display next/prev buttons
                e.style.display = 'block';
                document.querySelector('.picture_grid_imgs').style.overflow = 'hidden';
            });  
            

            if(getOrientation() == "Landscape" ){

                console.log(slides);
                filterHorizontalImages(imgNodes).forEach (e => {
                    console.log("filter horizontal images");
                    listNodes.appendChild(e); 
                    images.forEach(image => {observer.observe(image);}) //lazyload

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
                    images.forEach(image => {observer.observe(image);}) //lazyload
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
        
            // auto = true; //turn off auto scroll when not in fullscreen
            clearInterval(slideInterval);// ^^
        };

    }
    function gridView(){
        slideButtons = document.querySelectorAll('.buttons button')
        hideSlides(allSlides);
    
        slideButtons.forEach( (e) => {//hide prev/next btns when in grid view
            e.style.display = 'none'; 
            // document.querySelector('.picture_grid_imgs').style.overflow = 'visible'; 
        })  ; 
    
        allSlides.forEach (e => {
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

//*** Full Screen picture_grid_imgs ***// 
// const slides = document.querySelectorAll('.picture_grid_imgs li');

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
    
for (let i = listNodes.children.length; i >= 0; i--) {
    let shuffledNode = listNodes.children[Math.random() * i | 0]
    listNodes.appendChild(shuffledNode); //append || move the nodes in ul.picture_grid_imgs
    document.querySelector('.picture_grid_container').style.display = "block";
    
}
return listNodes;

}


// **** anime.js lib animation *****

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
        }
    )    
  
};
// ****  END anime.js lib animation *****

/**** UTILITY FUNCTIONS *****/

function addDataSource(images){ //add data-src and image's path to img tag for Lazyloading
   
    images.forEach(image => {
    
        let srcAttri = image.getAttribute("src"); 
        let str = srcAttri.split("/");
        [fileName,fileExtension] = str[str.length-1].split(".");
        srcAttri = "./resources/photos/HD_photos/" + fileName + "-HD." + fileExtension;
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
     return isTablet;//is tablet 
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


function checkPageLocation(pageID){
        [homepage, pLandscape, pAeriels, pPortraits, pCities,pStreets,
        sEvents, sPortraits, sGraduations, sMaternities, sCommercials,sPrints,
        bPostProcessing, bPhotoStories, bBeforeAfter, bTipsTricks,bGears,
        contactPage] = new Array(20).fill(false);

    switch(pageID){
        case "homepage":
            if (document.body.id == "homepage") homepage = true;
            return homepage;
 

        case "pLandscape":
            if (document.body.id == "pLandscape") pLandscape = true;
            return pLandscape;

        case "pAeriels":
            if (document.body.id == "pAeriels") pAeriels = true;
            return pAeriels;

        case "pPortraits":
            if (document.body.id == "pPortraits") pPortraits = true;
            return pPortraits;

        case "pCities":
            if (document.body.id == "pCities") pCities = true;
            return pCities;

        case "pStreets":
            if (document.body.id == "pStreets") pStreets = true;
            return pStreets;

        case "sEvents":
            if (document.body.id == "sEvents") sEvents = true;
            return sEvents;
                 
        case "sPortraits":
            if (document.body.id == "sPortraits") sPortraits = true;
            return sPortraits;

        case "sGraduations":
            if (document.body.id == "sGraduations") sGraduations = true;
            return sGraduations;

        case "sMaternities":
            if (document.body.id == "sMaternities") sMaternities = true;
            return sMaternities;

        case "sCommercials":
            if (document.body.id == "sCommercials") sCommercials = true;
            return sCommercials;

        case "sPrints":
            if (document.body.id == "sPrints") sPrints = true;
            return sPrints;

        case "bPostProcessing":
            if (document.body.id == "bPostProcessing") bPostProcessing = true;
            return bPostProcessing;
                 
        case "bPhotoStories":
            if (document.body.id == "bPhotoStories") bPhotoStories = true;
            return bPhotoStories;

        case "bBeforeAfter":
            if (document.body.id == "bBeforeAfter") bBeforeAfter = true;
            return bBeforeAfter;

        case "bTipsTricks":
            if (document.body.id == "bTipsTricks") bTipsTricks = true;
            return bTipsTricks;

        case "bGears":
            if (document.body.id == "bGears") pPortraits = true;
            return bGears;

        case "pCities":
            if (document.body.id == "pCities") pCities = true;
            return pCities;

        case "sEvents":
            if (document.body.id == "sEvents") sEvents = true;
            return sEvents;
                 
        case "contactPage":
            if (document.body.id == "contactPage") contactPage = true;
            return contactPage;

        default:
            return false;    

    }

}



function includeHTML() { //by w3school
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
    
    makeMenuCollapsible();

    let viewOpt = document.querySelector(".view_options");
    viewOpt.style.display=  "none";

    if (checkPageLocation("homepage")){ //when on homepage
        viewOpt.style.display = "flex"; //change .view_options from none to flex
        viewOptions();
    }
  };

//**** Collapsible MENU ****/
//   https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapsible_animate

function makeMenuCollapsible(){
    let coll = document.querySelectorAll(".dropdown .collapsible");



    console.log("coll" + coll.length);
    console.log("makeMenuCollapsible running");
    for (let i = 0; i < coll.length; i++) {
        console.log("collapsible found " + i);
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
};
//**** END Collapsible MENU ****/


/**** END UTILITY FUNCTIONS *****/





// //CSSgrid.io
