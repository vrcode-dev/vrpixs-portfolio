





function addSlideClass(images){
    
    images.forEach(image => {
    image.classList.add('slide');
    })

    images[0].classList.add('active'); //make the first pix active by default  
};


// export