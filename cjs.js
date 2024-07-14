document.addEventListener('DOMContentLoaded', function() {
    const slide = document.querySelector('.slide');
    const leftButton = document.querySelector('.left-button');
    const rightButton = document.querySelector('.right-button');
    const images = document.querySelectorAll('.slide img');
    const tabs = document.querySelectorAll('.tab');
    let currentIndex = 0;

    function updateSlide(index) {
        images.forEach((img, i) => {
            img.classList.remove('active');
            if (i === index) img.classList.add('active');
        });
        tabs.forEach((tab, i) => {
            tab.classList.remove('active');
            if (i === index) tab.classList.add('active');
        });
    }

    rightButton.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % images.length;
        updateSlide(currentIndex);
    });

    leftButton.addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateSlide(currentIndex);
    });

    slide.addEventListener('mousemove', function(e) {
        const slideWidth = slide.offsetWidth;
        const mouseX = e.clientX - slide.getBoundingClientRect().left;
        if (mouseX > slideWidth / 2) {
            rightButton.style.opacity = 1;
            leftButton.style.opacity = 0;
        } else {
            rightButton.style.opacity = 0;
            leftButton.style.opacity = 1;
        }
    });

    slide.addEventListener('mouseleave', function() {
        leftButton.style.opacity = 0;
        rightButton.style.opacity = 0;
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const services = document.querySelector('.services');
    const serviceContainer = document.querySelector('.service-container');
    const serviceItems = document.querySelectorAll('.service-item');
    let hoveringRight = false;
    let hoveringLeft = false;

    services.addEventListener('mousemove', function(e) {
        const width = services.offsetWidth;
        const mouseX = e.clientX - services.getBoundingClientRect().left;
        const serviceWidth = serviceItems[0].offsetWidth + 20; // 包括间距

        if (mouseX > width * 2 / 3) {
            if (!hoveringRight) {
                serviceContainer.style.transform = `translateX(-${serviceWidth}px)`; // 向右移动到最左侧的 block
                hoveringRight = true;
                hoveringLeft = false;
            }
        } else if (mouseX < width / 3) {
            if (!hoveringLeft) {
                serviceContainer.style.transform = `translateX(${width - (serviceWidth * 2 + 20)}px)`; // 向左移动到最右侧的 block
                hoveringRight = false;
                hoveringLeft = true;
            }
        } else {
            serviceContainer.style.transform = 'translateX(0)'; // 返回初始位置
            hoveringRight = false;
            hoveringLeft = false;
        }
    });
});

