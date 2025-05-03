class Gallery {
    constructor(selector, options) {
        
        this.images = options.images;
        this.pauseOnHover = options.pauseOnHover;
        this.autoplaySpeed = options.autoplaySpeed;
        this.arrows = options.arrows;
        this.infinite = options.infinite;
        this._currentIndex = 0;
        
        // Инициализация DOM
        const galleryContainer = document.querySelector(selector);
        galleryContainer.innerHTML = `
<div class="lg-conrainer" role="region" aria-label="gallery">
  <div class="lg-btn"><button class="lg-btn-prev" aria-label="←"></button></div>
  <div class="lg-img-wr">
    <img class="lg-img" src="" alt="">
    <div class="lg-loader" aria-hidden="true" hidden></div>
  </div>
  <div class="lg-btn"><button class="lg-btn-next" aria-label="→"></button></div>
  <div class="lg-dots-wr">
    <nav aria-label="image navigation"></nav>
  </div>
</div>`;

        this.imgWrapper = galleryContainer.querySelector('.lg-img-wr');
        this.img = galleryContainer.querySelector('.lg-img');
        this.loader = galleryContainer.querySelector('.lg-loader');
        this.errorMsg = galleryContainer.querySelector('.lg-error');
        this.prevBtn = galleryContainer.querySelector('.lg-btn-prev');
        this.nextBtn = galleryContainer.querySelector('.lg-btn-next');
        this.container = galleryContainer.querySelector('nav');
        this.setup();
        this.initEventListeners();
        // this.Zoom()
        
        if (options.dots) this.dots();
        if (!options.arrows) this.hideArrows();
        if (options.pauseOnHover) this.initPauseOnHover();
        if (this.autoplaySpeed) this.startTimer(this.autoplaySpeed);
    }
    get currentIndex() {
        return this._currentIndex
    }
    set currentIndex (v) {
        if (!this.infinite) {
            this.nextBtn.disabled = v >= this.images.length - 1
        }
        if (!this.infinite) {
            this.prevBtn.disabled = v <= 0;
        }
        if (v >= this.images.length) {
            v = this.infinite ? 0 : this.images.length - 1
        } else if (v < 0) {
            v = this.infinite ? this.images.length - 1 : 0
        }
        this._currentIndex = v
        const image = this.images[v]
        this.img.src = image.url
        this.img.alt = image.alt    
        this.loader.hidden = false
    }
    setup() {
        this.currentIndex = 0   
    }
//Сделать через css классы
    initEventListeners() {
        this.img.addEventListener('click', () => {
            this.nextImage();
        });

        this.prevBtn.onclick = () => {
            this.stopTimer();
            this.prevImage();
        };
        
        this.nextBtn.onclick = () => {
            this.stopTimer();
            this.nextImage();
        };
        this.img.onload = () => {
            this.loader.hidden = true  
            this.imgWrapper.classList.remove('lg-error')
        }
        this.img.onerror = (error) => {
            this.imgWrapper.classList.add('lg-error')
        }
    }

    nextImage() {
        this.currentIndex++
        
    }

    prevImage() {
        this.currentIndex--;
    }

    dots() {
        let previsionButton = null;
        
        this.images.forEach((image, i) => {
            const btn = document.createElement("button");
            
            if (i === 0) {
                btn.setAttribute('aria-current', 'true');
                previsionButton = btn;
            }
            
            btn.onclick = () => {
                if (previsionButton) {
                    previsionButton.removeAttribute('aria-current');
                }
                // previsionButton?.removeAttribute('aria-current'); 2-способ
                // previsionButton &&  previsionButton.removeAttribute('aria-current') 3-способ
                btn.setAttribute('aria-current', 'true');
                previsionButton = btn;
                
                this.stopTimer();
                this.currentIndex = i;
                // this.loadImage(image);
            };
            
            this.container.append(btn);
        });
    }

    hideArrows() {
        document.querySelectorAll('.lg-btn').forEach(btn => {
            btn.style.display = 'none';
        });
    }

    initPauseOnHover() {
        this.imgWrapper.addEventListener('mouseenter', () => {
            this.stopTimer();
        });
        
        this.imgWrapper.addEventListener('mouseleave', () => {
            if (this.autoplaySpeed) {
                this.startTimer(this.autoplaySpeed);
            }
        });
    }
    // Zoom() {
    //     document.addEventListener('mousemove', (e) => {  
    //         let startX = 0
    //         let startY = 0
    //         let translateX = e.clientX - startX;
    //         let translateY = e.clientY - startY;
    //         this.img.style.transform = `scale(2) translate(${translateX}px, ${translateY}px)`;
    //     });
    // }
    startTimer(speed) {
        this.stopTimer();
        this.timerID = setInterval(() => {
            this.nextImage();
        }, speed);
    }

    stopTimer() {
        clearInterval(this.timerID);
        this.timerID = null;
    }
}

function createLightGallery(selector, options) {
    return new Gallery(selector, options);
}
export { createLightGallery };