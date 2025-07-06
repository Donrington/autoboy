
 // Custom Cursor Animation (Desktop Only)
        if (window.innerWidth >= 1024) {
            const cursorDot = document.getElementById('cursorDot');
            const cursorOutline = document.getElementById('cursorOutline');
            const cursorTrail = document.getElementById('cursorTrail');
            const cursorGlow = document.getElementById('cursorGlow');

            let mouseX = 0;
            let mouseY = 0;
            let outlineX = 0;
            let outlineY = 0;
            let isMoving = false;
            let timeout;

            // Track mouse position
            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;

                // Immediate cursor dot position
                gsap.to(cursorDot, {
                    x: mouseX,
                    y: mouseY,
                    duration: 0
                });

                // Show cursor elements
                cursorDot.classList.remove('hidden');
                cursorOutline.classList.remove('hidden');
                
                // Show trail on movement
                if (!isMoving) {
                    isMoving = true;
                    gsap.to(cursorTrail, {
                        opacity: 0.3,
                        duration: 0.3
                    });
                    cursorGlow.classList.add('active');
                }

                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    isMoving = false;
                    gsap.to(cursorTrail, {
                        opacity: 0,
                        duration: 0.3
                    });
                    cursorGlow.classList.remove('active');
                }, 100);

                // Trail effect
                gsap.to(cursorTrail, {
                    x: mouseX,
                    y: mouseY,
                    duration: 0.2
                });

                // Glow effect
                gsap.to(cursorGlow, {
                    x: mouseX,
                    y: mouseY,
                    duration: 0.5
                });
            });

            // Smooth outline animation
            const animateOutline = () => {
                outlineX += (mouseX - outlineX) * 0.1;
                outlineY += (mouseY - outlineY) * 0.1;

                cursorOutline.style.transform = `translate(${outlineX - 20}px, ${outlineY - 20}px)`;
                requestAnimationFrame(animateOutline);
            };
            animateOutline();

            // Handle mouse enter/leave window
            document.addEventListener('mouseenter', () => {
                cursorDot.classList.remove('hidden');
                cursorOutline.classList.remove('hidden');
            });

            document.addEventListener('mouseleave', () => {
                cursorDot.classList.add('hidden');
                cursorOutline.classList.add('hidden');
                cursorTrail.classList.add('hidden');
                cursorGlow.classList.add('hidden');
            });

            // Handle clicks
            document.addEventListener('mousedown', () => {
                cursorDot.classList.add('clicking');
                cursorOutline.classList.add('clicking');
            });

            document.addEventListener('mouseup', () => {
                cursorDot.classList.remove('clicking');
                cursorOutline.classList.remove('clicking');
            });

            // Handle hover states
            const addHoverClass = (e) => {
                const target = e.target;
                
                if (target.matches('a, button, .btn')) {
                    cursorDot.classList.add('link-hover');
                    cursorOutline.classList.add('link-hover');
                } else if (target.matches('p, h1, h2, h3, h4, h5, h6, span')) {
                    cursorDot.classList.add('text-hover');
                    cursorOutline.classList.add('text-hover');
                } else {
                    cursorDot.classList.add('hover');
                    cursorOutline.classList.add('hover');
                }
            };

            const removeHoverClass = () => {
                cursorDot.classList.remove('hover', 'link-hover', 'text-hover');
                cursorOutline.classList.remove('hover', 'link-hover', 'text-hover');
            };

            // Add hover detection
            document.addEventListener('mouseover', addHoverClass);
            document.addEventListener('mouseout', removeHoverClass);

            // Magnetic effect for buttons
            const magneticElements = document.querySelectorAll('.btn, button');
            
            magneticElements.forEach(elem => {
                elem.addEventListener('mousemove', (e) => {
                    const rect = elem.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    
                    gsap.to(elem, {
                        x: x * 0.3,
                        y: y * 0.3,
                        duration: 0.3
                    });
                });
                
                elem.addEventListener('mouseleave', () => {
                    gsap.to(elem, {
                        x: 0,
                        y: 0,
                        duration: 0.3
                    });
                });
            });
        }
        
        // Theme Toggle
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.getElementById('themeIcon');
        const body = document.body;

        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            
            if (body.classList.contains('dark-mode')) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                localStorage.setItem('theme', 'dark');
            } else {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                localStorage.setItem('theme', 'light');
            }
        });

       // Enhanced Background Image Rotation with Smooth Transitions
        class BackgroundSlider {
            constructor() {
                this.images = document.querySelectorAll('.background-image');
                this.currentIndex = 0;
                this.isTransitioning = false;
                this.duration = 8000; // 8 seconds per image
                
                this.init();
            }

            init() {
                // Preload all images
                this.preloadImages().then(() => {
                    // Hide loading spinner
                    gsap.to('#heroLoading', {
                        opacity: 0,
                        duration: 0.5,
                        onComplete: () => {
                            document.getElementById('heroLoading').style.display = 'none';
                        }
                    });

                    // Start the slideshow
                    this.showImage(0);
                    this.startSlideshow();
                    this.animateHeroContent();
                });
            }

            preloadImages() {
                const promises = Array.from(this.images).map(img => {
                    return new Promise((resolve) => {
                        const tempImg = new Image();
                        const bgImage = window.getComputedStyle(img).backgroundImage;
                        const url = bgImage.match(/url\(["']?(.+?)["']?\)/)[1];
                        tempImg.onload = resolve;
                        tempImg.src = url;
                    });
                });

                return Promise.all(promises);
            }

            showImage(index) {
                if (this.isTransitioning) return;
                this.isTransitioning = true;

                const currentImage = this.images[this.currentIndex];
                const nextImage = this.images[index];

                // Add zooming class to next image
                nextImage.classList.add('zooming');

                // Fade in next image
                gsap.to(nextImage, {
                    opacity: 1,
                    duration: 2,
                    ease: 'power2.inOut'
                });

                // Fade out current image after a delay
                if (currentImage !== nextImage) {
                    gsap.to(currentImage, {
                        opacity: 0,
                        duration: 2,
                        delay: 0.5,
                        ease: 'power2.inOut',
                        onComplete: () => {
                            currentImage.classList.remove('active', 'zooming');
                        }
                    });
                }

                nextImage.classList.add('active');
                this.currentIndex = index;

                setTimeout(() => {
                    this.isTransitioning = false;
                }, 2000);
            }

            startSlideshow() {
                setInterval(() => {
                    const nextIndex = (this.currentIndex + 1) % this.images.length;
                    this.showImage(nextIndex);
                }, this.duration);
            }

           animateHeroContent() {
                // Create timeline for hero content
                const tl = gsap.timeline({ delay: 0.5 });

                tl.to('.hero-subtitle', {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out'
                })
                .to('.hero-title', {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: 'power3.out'
                }, '-=0.5')
                .to('.hero-description', {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out'
                }, '-=0.5')
                .to('.hero-buttons', {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out'
                }, '-=0.5');

                // Create floating bubbles
                this.createBubbles();

                // Add parallax effect on mouse move
                document.addEventListener('mousemove', (e) => {
                    const { clientX, clientY } = e;
                    const centerX = window.innerWidth / 2;
                    const centerY = window.innerHeight / 2;
                    
                    const moveX = (clientX - centerX) / 30;
                    const moveY = (clientY - centerY) / 30;
                    
                    gsap.to('.hero-title', {
                        x: moveX,
                        y: moveY,
                        duration: 1,
                        ease: 'power2.out'
                    });

                    // Move bubbles slightly with mouse
                    gsap.to('.bubble', {
                        x: moveX * 0.5,
                        y: moveY * 0.5,
                        duration: 2,
                        ease: 'power2.out'
                    });
                });
            }

            createBubbles() {
                const bubblesContainer = document.getElementById('bubblesContainer');
                const bubbleCount = 20; // Moderate amount of bubbles
                const sizes = ['tiny', 'small', 'medium', 'large'];

                for (let i = 0; i < bubbleCount; i++) {
                    const bubble = document.createElement('div');
                    bubble.className = `bubble ${sizes[Math.floor(Math.random() * sizes.length)]}`;
                    
                    // Random starting position
                    bubble.style.left = `${Math.random() * 100}%`;
                    
                    // Random animation delay
                    bubble.style.animationDelay = `${Math.random() * 15}s`;
                    
                    // Random animation duration for variety
                    bubble.style.animationDuration = `${15 + Math.random() * 10}s`;
                    
                    bubblesContainer.appendChild(bubble);
                }
            }
        }

        // Initialize background slider
        const slider = new BackgroundSlider();

        // Button hover animations with magnetic effect
        const thebuttons = document.querySelectorAll('.btn');
        
        thebuttons.forEach(thebutton => {
            let boundingRect = thebutton.getBoundingClientRect();
            
            thebutton.addEventListener('mouseenter', () => {
                boundingRect = thebutton.getBoundingClientRect();
            });
            
            thebutton.addEventListener('mousemove', (e) => {
                const x = e.clientX - boundingRect.left - boundingRect.width / 2;
                const y = e.clientY - boundingRect.top - boundingRect.height / 2;
                
                gsap.to(button, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            thebutton.addEventListener('mouseleave', () => {
                gsap.to(thebutton, {
                    x: 0,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });

        // Smooth scroll indicator (optional)
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroSection = document.querySelector('.hero-section');
            
            // Parallax effect for background
            gsap.to('.background-layer', {
                y: scrolled * 0.5,
                ease: 'none'
            });
        });
        // Navbar Scroll Effect
        const navbar = document.getElementById('navbar');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Add scrolled class when scrolling down
            if (currentScrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar based on scroll direction
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });

        // Mobile Menu Functionality
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileOverlay = document.getElementById('mobileOverlay');
        const mobileCloseBtn = document.getElementById('mobileCloseBtn');
        const hamburger = document.getElementById('hamburger');

        function toggleMobileMenu() {
            mobileMenu.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            hamburger.classList.toggle('active');
            body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        }

        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        mobileCloseBtn.addEventListener('click', toggleMobileMenu);
        mobileOverlay.addEventListener('click', toggleMobileMenu);

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });

        // Search Input Focus Effects
        const searchInputs = document.querySelectorAll('.search-input');
        
        searchInputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.style.transform = 'scale(1.02)';
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.style.transform = 'scale(1)';
            });
        });

        // Button Hover Effects
        const buttons = document.querySelectorAll('.search-btn, .become-seller-btn, .nav-link');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (!button.classList.contains('search-btn')) {
                    button.style.transform = 'translateY(-2px)';
                }
            });
            
            button.addEventListener('mouseleave', () => {
                if (!button.classList.contains('search-btn')) {
                    button.style.transform = 'translateY(0)';
                }
            });
        });

        // Smooth Scroll for Demo
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Advanced Search Functionality
        const searchButtons = document.querySelectorAll('.search-btn');
        
        searchButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const input = button.parentElement.querySelector('.search-input');
                const query = input.value.trim();
                
                if (query) {
                    // Add loading state
                    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                    button.classList.add('loading');
                    
                    // Simulate search (replace with actual search logic)
                    setTimeout(() => {
                        button.innerHTML = '<i class="fas fa-search"></i>';
                        button.classList.remove('loading');
                        
                        // Show search results or redirect
                        console.log('Searching for:', query);
                        // window.location.href = `/search?q=${encodeURIComponent(query)}`;
                    }, 1000);
                } else {
                    // Shake animation for empty search
                    input.style.animation = 'shake 0.5s ease-in-out';
                    setTimeout(() => {
                        input.style.animation = '';
                    }, 500);
                }
            });
        });

        // Search on Enter key
        searchInputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const button = input.parentElement.querySelector('.search-btn');
                    button.click();
                }
            });
        });

        // Auto-complete/suggestions (demo)
        searchInputs.forEach(input => {
            let timeout;
            
            input.addEventListener('input', (e) => {
                clearTimeout(timeout);
                const query = e.target.value.trim();
                
                if (query.length > 2) {
                    timeout = setTimeout(() => {
                        // Simulate auto-complete suggestions
                        console.log('Fetching suggestions for:', query);
                        // showSuggestions(query);
                    }, 300);
                }
            });
        });

       
        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Add floating effect to logo
        const logo = document.querySelector('.logo');
        let floatDirection = 1;
        
        setInterval(() => {
            const currentTransform = logo.style.transform || 'translateY(0px)';
            const currentY = parseFloat(currentTransform.match(/translateY\(([^)]+)\)/)?.[1] || 0);
            
            if (currentY >= 3) floatDirection = -1;
            if (currentY <= -3) floatDirection = 1;
            
            logo.style.transform = `translateY(${currentY + (floatDirection * 0.5)}px)`;
        }, 100);

        // Add ripple effect to buttons
        function createRipple(event) {
            const button = event.currentTarget;
            const circle = document.createElement('span');
            const diameter = Math.max(button.clientWidth, button.clientHeight);
            const radius = diameter / 2;

            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
            circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
            circle.classList.add('ripple');

            const ripple = button.getElementsByClassName('ripple')[0];
            if (ripple) {
                ripple.remove();
            }

            button.appendChild(circle);
        }

        // Add ripple CSS
        const rippleStyle = document.createElement('style');
        rippleStyle.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(rippleStyle);

        // Add ripple effect to clickable elements
        document.querySelectorAll('.search-btn, .become-seller-btn, .mobile-nav-link').forEach(button => {
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.addEventListener('click', createRipple);
        });

        // Performance optimization: debounce scroll event
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

    

        window.addEventListener('scroll', handleParallax);

        // Add glow effect to active elements
        function addGlowEffect() {
            const activeElements = document.querySelectorAll('.nav-link:hover, .search-btn:hover, .become-seller-btn:hover');
            
            activeElements.forEach(element => {
                element.style.filter = 'drop-shadow(0 0 10px var(--primary-green))';
            });
        }


        // Add resize handler for responsive adjustments
        window.addEventListener('resize', debounce(() => {
            // Close mobile menu on resize to desktop
            if (window.innerWidth > 992 && mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
            
            // Adjust search container width
            const searchContainer = document.querySelector('.search-container');
            if (window.innerWidth < 768) {
                searchContainer.style.width = '100%';
            } else if (window.innerWidth < 1200) {
                searchContainer.style.width = '350px';
            } else {
                searchContainer.style.width = '450px';
            }
        }, 250));

        // Add keyboard navigation support
        document.addEventListener('keydown', (e) => {
            // Alt + S to focus search
            if (e.altKey && e.key === 's') {
                e.preventDefault();
                document.querySelector('.search-input').focus();
            }
            
            // Alt + M to toggle mobile menu
            if (e.altKey && e.key === 'm' && window.innerWidth <= 992) {
                e.preventDefault();
                toggleMobileMenu();
            }
            
            // Alt + T to toggle theme
            if (e.altKey && e.key === 't') {
                e.preventDefault();
                themeToggle.click();
            }
        });

        console.log('🚀 Autoboy Ultra Modern Navbar initialized successfully!');
        console.log('💡 Keyboard shortcuts:');
        console.log('   Alt + S: Focus search');
        console.log('   Alt + M: Toggle mobile menu');
        console.log('   Alt + T: Toggle theme');

        // Theme toggle rotation animation
        themeToggle.addEventListener('click', () => {
            gsap.to(themeIcon, {
                rotation: 360,
                duration: 0.5,
                ease: 'power2.inOut',
                onComplete: () => {
                    gsap.set(themeIcon, { rotation: 0 });
                }
            });
        });




        // Animated background only on desktop
        if (window.innerWidth > 768) {
            const orbs = document.querySelectorAll('.gradient-orb');
            
            // Animate orbs with GSAP
            orbs.forEach((orb, index) => {
                gsap.to(orb, {
                    x: 'random(-100, 100)',
                    y: 'random(-100, 100)',
                    duration: 'random(15, 25)',
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: index * 2
                });
            });
        }


        // Parallax effect for section title
        document.addEventListener('mousemove', (e) => {
            if (window.innerWidth > 768) {
                const { clientX, clientY } = e;
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                
                const moveX = (clientX - centerX) / 50;
                const moveY = (clientY - centerY) / 50;
                
                gsap.to('.section-title', {
                    x: moveX,
                    y: moveY,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });

        // Number counter animation
        const stats = document.querySelectorAll('.stat-number');
        const observerOptions = {
            threshold: 0.5
        };

        const countUp = (element) => {
            const target = parseInt(element.innerText);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    element.innerText = Math.floor(current) + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    element.innerText = target + '+';
                }
            };

            updateCounter();
        };

      
        
        // Explore Button Animation
        document.querySelectorAll('.explore-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = btn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple-effect');
                
                btn.appendChild(ripple);
                
                // Add loading state
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                btn.disabled = true;
                
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-check"></i> Opened!';
                    
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                        ripple.remove();
                    }, 1500);
                }, 800);
            });
        });

        // Enhanced Card Hover Effects
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Add magnetic effect to nearby cards
                const allCards = document.querySelectorAll('.product-card');
                const cardIndex = Array.from(allCards).indexOf(card);
                
                allCards.forEach((otherCard, index) => {
                    if (Math.abs(index - cardIndex) <= 1 && otherCard !== card) {
                        otherCard.style.transform = 'translateY(-8px) scale(1.01)';
                        otherCard.style.opacity = '0.85';
                    }
                });
                
                // Add glow effect to status badge
                const badge = card.querySelector('.status-badge');
                if (badge) {
                    badge.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.6)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                document.querySelectorAll('.product-card').forEach(otherCard => {
                    if (otherCard !== card) {
                        otherCard.style.transform = '';
                        otherCard.style.opacity = '';
                    }
                });
                
                // Remove glow effect
                const badge = card.querySelector('.status-badge');
                if (badge) {
                    badge.style.boxShadow = '';
                }
            });
        });

        // Parallax Effect for Background Orbs
        let ticking = false;
        function updateParallax() {
            const scrolled = window.pageYOffset;
            
            document.querySelectorAll('.floating-orb').forEach((orb, index) => {
                const speed = 0.3 + (index * 0.1);
                const rotation = scrolled * 0.05;
                orb.style.transform = `translateY(${scrolled * speed}px) rotate(${rotation}deg)`;
            });
            
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });

        // Staggered Card Animation on Load
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.querySelectorAll('.product-card').forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 150);
                });
            }, 300);
        });

        // Add CSS for ripple effect
        const style = document.createElement('style');
        style.textContent = `
            .ripple-effect {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            /* Enhanced hover effects for better aesthetics */
            .product-card:hover .status-badge {
                transform: scale(1.05);
            }
            
            .product-card:hover .favorite-btn {
                transform: scale(1.1);
            }
            
            /* Smooth transitions for all interactive elements */
            .status-badge, .favorite-btn {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
        `;
        document.head.appendChild(style);

        // Advanced hover effects for section header
        const sectionTitle = document.querySelector('.section-title');
        const moreBtn = document.querySelector('.more-btn');

        // Title interaction effect
        sectionTitle.addEventListener('mouseenter', () => {
            sectionTitle.style.transform = 'scale(1.02)';
            sectionTitle.style.filter = 'drop-shadow(0 0 30px rgba(34, 197, 94, 0.8))';
        });

        sectionTitle.addEventListener('mouseleave', () => {
            sectionTitle.style.transform = 'scale(1)';
            sectionTitle.style.filter = '';
        });

        // More button magnetic effect
        moreBtn.addEventListener('mousemove', (e) => {
            const rect = moreBtn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            moreBtn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) translateY(-4px) scale(1.05)`;
        });

        moreBtn.addEventListener('mouseleave', () => {
            moreBtn.style.transform = '';
        });

        // Add floating animation to status badges
        document.querySelectorAll('.status-badge').forEach((badge, index) => {
            const delay = index * 200;
            
            setInterval(() => {
                if (!badge.closest('.product-card:hover')) {
                    badge.style.transform = 'translateY(-3px)';
                    setTimeout(() => {
                        badge.style.transform = 'translateY(0)';
                    }, 1000);
                }
            }, 3000 + delay);
        });

        // Performance optimization with requestAnimationFrame
        function optimizeAnimations() {
            // Disable animations for users who prefer reduced motion
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                document.documentElement.style.setProperty('--animation-duration', '0s');
            }
        }

        // Initialize optimizations
        optimizeAnimations();

        // Log successful initialization
        console.log('🎨 Autoboy Trending Collection initialized successfully!');
        console.log('✨ Features: Aesthetic Design, Glassmorphism Overlays, Smooth Animations');
        console.log('📱 Fully responsive with enhanced mobile experience');

        // Add intersection observer for performance
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    
                    // Trigger card entrance animation if not already animated
                    if (!entry.target.dataset.animated) {
                        entry.target.dataset.animated = 'true';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.product-card').forEach(card => {
            cardObserver.observe(card);
        });

        // Advanced scroll effects for the entire section
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Activate floating orb animations when section is in view
                    document.querySelectorAll('.floating-orb').forEach(orb => {
                        orb.style.animationPlayState = 'running';
                    });
                    
                    // Start title glow animation
                    const title = document.querySelector('.section-title');
                    title.style.animationPlayState = 'running';
                } else {
                    // Pause animations when section is out of view for performance
                    document.querySelectorAll('.floating-orb').forEach(orb => {
                        orb.style.animationPlayState = 'paused';
                    });
                }
            });
        }, { threshold: 0.2 });

        sectionObserver.observe(document.querySelector('.trending-section'));

        // Keyboard navigation support
        document.addEventListener('keydown', (e) => {
            // Tab navigation enhancement
            if (e.key === 'Tab') {
                const focusableElements = document.querySelectorAll(
                    '.product-card, .favorite-btn, .explore-btn, .more-btn, .theme-toggle'
                );
                
                focusableElements.forEach(element => {
                    element.addEventListener('focus', () => {
                        element.style.outline = '2px solid var(--primary-green)';
                        element.style.outlineOffset = '2px';
                    });
                    
                    element.addEventListener('blur', () => {
                        element.style.outline = '';
                        element.style.outlineOffset = '';
                    });
                });
            }
            
            // Escape key to close any active overlays
            if (e.key === 'Escape') {
                document.querySelectorAll('.product-card').forEach(card => {
                    card.classList.remove('force-hover');
                });
            }
        });

        // Touch device optimization
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (isTouchDevice) {
            // Enhanced touch interactions for mobile
            document.querySelectorAll('.product-card').forEach(card => {
                let touchStartY = 0;
                
                card.addEventListener('touchstart', (e) => {
                    touchStartY = e.touches[0].clientY;
                    card.classList.add('touch-active');
                });
                
                card.addEventListener('touchmove', (e) => {
                    const touchY = e.touches[0].clientY;
                    const deltaY = touchStartY - touchY;
                    
                    // Show overlay on upward swipe
                    if (deltaY > 50) {
                        card.classList.add('force-hover');
                    }
                });
                
                card.addEventListener('touchend', () => {
                    card.classList.remove('touch-active');
                    
                    // Auto-hide overlay after 3 seconds on mobile
                    setTimeout(() => {
                        card.classList.remove('force-hover');
                    }, 3000);
                });
            });
            
            // Add CSS for touch interactions
            const touchStyle = document.createElement('style');
            touchStyle.textContent = `
                @media (max-width: 768px) {
                    .product-card.force-hover .product-overlay {
                        transform: translateY(0) !important;
                    }
                    
                    .product-card.force-hover .product-image {
                        transform: scale(1.1) !important;
                        filter: brightness(0.8) !important;
                    }
                    
                    .product-card.touch-active {
                        transform: scale(0.98);
                    }
                }
            `;
            document.head.appendChild(touchStyle);
        }

        // Resize handler for responsive adjustments
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Recalculate grid layout on resize
                const grid = document.querySelector('.products-grid');
                const cards = document.querySelectorAll('.product-card');
                
                // Force layout recalculation
                grid.style.display = 'none';
                grid.offsetHeight; // Trigger reflow
                grid.style.display = '';
                
                // Reset any transform effects that might break on resize
                cards.forEach(card => {
                    if (!card.matches(':hover')) {
                        card.style.transform = '';
                    }
                });
                
                console.log('Layout recalculated for new viewport size');
            }, 250);
        });

        // Performance monitoring and optimization
        const performanceObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.entryType === 'paint') {
                    console.log(`${entry.name}: ${entry.startTime}ms`);
                }
            });
        });
        
        try {
            performanceObserver.observe({ entryTypes: ['paint'] });
        } catch (e) {
            console.log('Performance Observer not supported');
        }

        // Accessibility enhancements
        function enhanceAccessibility() {
            // Add ARIA labels to interactive elements
            document.querySelectorAll('.favorite-btn').forEach((btn, index) => {
                btn.setAttribute('aria-label', `Add product ${index + 1} to favorites`);
                btn.setAttribute('role', 'button');
            });
            
            document.querySelectorAll('.explore-btn').forEach((btn, index) => {
                btn.setAttribute('aria-label', `Explore product ${index + 1} details`);
            });
            
            // Add screen reader support for status badges
            document.querySelectorAll('.status-badge').forEach(badge => {
                badge.setAttribute('aria-label', `Product status: ${badge.textContent}`);
            });
            
            // Announce section changes to screen readers
            const section = document.querySelector('.trending-section');
            section.setAttribute('aria-label', 'Trending gadgets collection');
            section.setAttribute('role', 'region');
        }

        // Initialize accessibility enhancements
        enhanceAccessibility();

        // Analytics and user interaction tracking (placeholder)
        function trackUserInteraction(action, element) {
            // This would integrate with your analytics service
            console.log(`User interaction: ${action} on ${element}`);
            
            // Example: Google Analytics event tracking
            // gtag('event', action, {
            //     event_category: 'product_interaction',
            //     event_label: element
            // });
        }

        // Add interaction tracking to buttons
        document.querySelectorAll('.favorite-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                trackUserInteraction('favorite_toggle', `product_${index + 1}`);
            });
        });

        document.querySelectorAll('.explore-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                trackUserInteraction('explore_product', `product_${index + 1}`);
            });
        });

        // Advanced animation sequencing
        function createAnimationSequence() {
            const timeline = {
                entrance: () => {
                    // Animate section entrance
                    const section = document.querySelector('.trending-section');
                    section.style.opacity = '0';
                    section.style.transform = 'translateY(50px)';
                    
                    setTimeout(() => {
                        section.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
                        section.style.opacity = '1';
                        section.style.transform = 'translateY(0)';
                    }, 100);
                    
                    // Stagger card animations
                    document.querySelectorAll('.product-card').forEach((card, index) => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(60px) scale(0.9)';
                        
                        setTimeout(() => {
                            card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0) scale(1)';
                        }, 300 + (index * 100));
                    });
                },
                
                exit: () => {
                    // Animate section exit (for SPA navigation)
                    const cards = document.querySelectorAll('.product-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.transition = 'all 0.5s ease';
                            card.style.opacity = '0';
                            card.style.transform = 'translateY(-30px) scale(0.95)';
                        }, index * 50);
                    });
                }
            };
            
            return timeline;
        }

        // Initialize animation timeline
        const animationTimeline = createAnimationSequence();

        // Lazy loading for images (if needed for performance)
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Add loading state
                    img.style.opacity = '0';
                    
                    img.addEventListener('load', () => {
                        img.style.transition = 'opacity 0.5s ease';
                        img.style.opacity = '1';
                        img.classList.add('loaded');
                    });
                    
                    imageObserver.unobserve(img);
                }
            });
        });

        // Observe images for lazy loading
        document.querySelectorAll('.product-image').forEach(img => {
            imageObserver.observe(img);
        });

        // Final initialization and cleanup
        function initialize() {
            console.log('🎨 Autoboy Trending Collection fully initialized!');
            console.log('✨ All features loaded:');
            console.log('   - Aesthetic glassmorphism design');
            console.log('   - Smooth hover animations');
            console.log('   - Touch device optimization');
            console.log('   - Accessibility enhancements');
            console.log('   - Performance optimizations');
            console.log('   - Responsive breakpoints');
            
            // Remove any loading states
            document.body.classList.remove('loading');
            
            // Trigger entrance animation
            setTimeout(() => {
                animationTimeline.entrance();
            }, 500);
        }

        // Initialize when DOM is fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
        } else {
            initialize();
        }

        // Cleanup function for SPA navigation
        window.cleanupTrendingSection = () => {
            // Remove event listeners
            observer.disconnect();
            cardObserver.disconnect();
            sectionObserver.disconnect();
            performanceObserver.disconnect();
            
            // Clear timeouts and intervals
            clearTimeout(resizeTimeout);
            
            // Animate exit
            animationTimeline.exit();
            
            console.log('🧹 Trending Collection cleanup completed');
        };



        

            document.querySelector('.footer').addEventListener('mousemove', (e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                footerCursor.style.left = (e.clientX - rect.left - 10) + 'px';
                footerCursor.style.top = (e.clientY - rect.top - 10) + 'px';
                footerCursor.style.opacity = '1';
            });
            
            document.querySelector('.footer').addEventListener('mouseleave', () => {
                footerCursor.style.opacity = '0';
            });
        



