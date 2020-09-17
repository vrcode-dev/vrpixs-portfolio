
var coll = document.getElementsByClassName("collapsible");
let i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
    //   this.classList.toggle("active");
     
      var content = this.nextElementSibling;
      if (content.style.maxHeight){
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      } 
    });
  }



        //only display viewoption when it's homepage  
    //   test();

    //   window.onresize = () => test();
      
    //   function test() {
    //     if((window.location.href == "https://www.vrpixs.com" || window.location.href == "http://www.vrpixs.com" || window.location.href == "http://127.0.0.1:5501/build" )&& !isMobile()) {
    //     document.querySelector('.view_options').style.display = "flex";
    //     }
    //     else {  document.querySelector('.view_options').style.display = "none";
    //     }

    //     if (window.innerWidth < 500) {viewOptions();     console.log("test");}
    

    // }