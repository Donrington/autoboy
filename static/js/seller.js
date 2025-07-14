        // Current step tracking
        let currentStep = 1;
        const totalSteps = 5;

        // Update progress bar
        function updateProgress(step) {
            const progressBar = document.getElementById('progressBar');
            const progress = (step / totalSteps) * 100;
            progressBar.style.width = progress + '%';
        }

        // Show specific step
        function showStep(stepNumber) {
            // Hide all steps
            document.querySelectorAll('.seller-form-step').forEach(step => {
                step.classList.remove('active');
            });

            // Show current step
            const currentStepElement = document.getElementById('step' + stepNumber);
            if (currentStepElement) {
                currentStepElement.classList.add('active');
                
                // Animate step entrance
                gsap.from(currentStepElement, {
                    opacity: 0,
                    y: 20,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }

            updateProgress(stepNumber);
        }

        // Next step handler
        function nextStep(fromStep) {
            // Validate current step
            if (!validateStep(fromStep)) {
                return;
            }

            // Show loading state
            const button = event.target;
            button.classList.add('loading');

            // Simulate API call
            setTimeout(() => {
                button.classList.remove('loading');
                currentStep = fromStep + 1;
                showStep(currentStep);
            }, 500);
        }

        // Validate step
        function validateStep(step) {
            let isValid = true;
            const errorMessages = document.querySelectorAll(`#step${step} .seller-error-message`);

            switch(step) {
                case 1:
                    const country = document.getElementById('countrySelect').value;
                    if (!country) {
                        errorMessages[0].classList.add('show');
                        isValid = false;
                    } else {
                        errorMessages[0].classList.remove('show');
                    }
                    break;
                
                case 2:
                    const email = document.getElementById('emailInput').value;
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                        errorMessages[0].classList.add('show');
                        isValid = false;
                    } else {
                        errorMessages[0].classList.remove('show');
                        // Update email in verification step
                        document.querySelector('#step3 .seller-form-label').textContent = email;
                    }
                    break;
                
                case 3:
                    const code = document.querySelector('#step3 .seller-verification-input').value;
                    if (code.length !== 6) {
                        errorMessages[0].classList.add('show');
                        isValid = false;
                    } else {
                        errorMessages[0].classList.remove('show');
                    }
                    break;
                
                case 4:
                    const phone = document.querySelector('#step4 input[type="tel"]').value;
                    const password = document.querySelectorAll('#step4 input[type="password"]')[0].value;
                    const confirmPassword = document.querySelectorAll('#step4 input[type="password"]')[1].value;
                    
                    if (!phone || password.length < 8 || password !== confirmPassword) {
                        alert('Please check your inputs. Passwords must match and be at least 8 characters.');
                        isValid = false;
                    }
                    break;
            }

            return isValid;
        }

        // Complete registration
        function completeRegistration() {
            const accountType = document.querySelector('input[name="accountType"]:checked');
            const shopName = document.querySelectorAll('#step5 .seller-form-input')[0].value;
            const shopLocation = document.querySelectorAll('#step5 .seller-form-input')[1].value;
            const agreement = document.getElementById('agreement').checked;

            if (!accountType || !shopName || !shopLocation || !agreement) {
                alert('Please fill all fields and accept the agreement');
                return;
            }

            // Show loading
            event.target.classList.add('loading');

            setTimeout(() => {
                event.target.classList.remove('loading');
                alert('Registration completed successfully!');
                // Redirect to dashboard or login
            }, 1500);
        }

        // Show sign in form
        function showSignIn() {
            document.querySelectorAll('.seller-form-step').forEach(step => {
                step.classList.remove('active');
            });
            document.getElementById('signInForm').classList.add('active');
            document.querySelector('.seller-progress-bar').style.display = 'none';
            
            // Update title
            document.querySelector('.seller-form-title').textContent = 'Sign in to Autoboy';
            
            // Animate
            gsap.from('#signInForm', {
                opacity: 0,
                y: 20,
                duration: 0.5,
                ease: 'power2.out'
            });
        }

        // Show sign up form
        function showSignUp() {
            currentStep = 1;
            showStep(1);
            document.querySelector('.seller-progress-bar').style.display = 'block';
            document.querySelector('.seller-form-title').textContent = 'sell on Autoboy';
        }

        // Resend code handler
        document.querySelector('.seller-resend-button').addEventListener('click', function() {
            this.disabled = true;
            this.textContent = 'Sending...';
            
            setTimeout(() => {
                this.disabled = false;
                this.textContent = 'Code Sent! Check your email';
                setTimeout(() => {
                    this.textContent = 'Resend Code';
                }, 3000);
            }, 1500);
        });

        // Input animations
        document.querySelectorAll('.seller-form-input, .seller-form-select').forEach(input => {
            input.addEventListener('focus', function() {
                gsap.to(this, {
                    scale: 1.02,
                    duration: 0.2,
                    ease: 'power2.out'
                });
            });

            input.addEventListener('blur', function() {
                gsap.to(this, {
                    scale: 1,
                    duration: 0.2,
                    ease: 'power2.out'
                });
            });
        });

        // Social button animations
        document.querySelectorAll('.seller-social-button').forEach(button => {
            button.addEventListener('click', function() {
                const type = this.textContent.includes('Google') ? 'Google' : 
                           this.textContent.includes('Email') ? 'Email' : 'Autoboy';
                alert(`${type} authentication would be implemented here`);
            });
        });

        // Animate 3D elements on load
        window.addEventListener('load', () => {
            gsap.from('.visual-3d-phone', {
                opacity: 0,
                scale: 0.8,
                duration: 1,
                ease: 'power3.out',
                delay: 0.2
            });

            gsap.from('.product-box', {
                opacity: 0,
                y: 50,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out',
                delay: 0.5
            });
        });

        // Add hover effect to form card
        const formCard = document.querySelector('.seller-form-card');
        formCard.addEventListener('mousemove', (e) => {
            const rect = formCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 50;
            const rotateY = (centerX - x) / 50;
            
            gsap.to(formCard, {
                rotationX: rotateX,
                rotationY: rotateY,
                duration: 0.5,
                ease: 'power2.out',
                transformPerspective: 1000
            });
        });

        formCard.addEventListener('mouseleave', () => {
            gsap.to(formCard, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        // Mobile detection and adjustments
        if (window.innerWidth <= 768) {
            // Disable complex animations on mobile
            gsap.set(formCard, { rotationX: 0, rotationY: 0 });
            formCard.removeEventListener('mousemove', () => {});
        }

        // Password strength indicator
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        passwordInputs[0]?.addEventListener('input', function() {
            const password = this.value;
            const hint = document.querySelector('.seller-password-hint');
            
            let strength = 0;
            if (password.length >= 8) strength++;
            if (/[A-Z]/.test(password)) strength++;
            if (/[a-z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[^A-Za-z0-9]/.test(password)) strength++;
            
            if (strength < 3) {
                hint.style.color = '#EF4444';
            } else if (strength < 5) {
                hint.style.color = '#F59E0B';
            } else {
                hint.style.color = '#22C55E';
            }
        });

        // Country code update
        document.getElementById('countrySelect')?.addEventListener('change', function() {
            const countryCodes = {
                'NG': '+234',
                'GH': '+233',
                'KE': '+254',
                'ZA': '+27',
                'EG': '+20'
            };
            
            const code = countryCodes[this.value] || '+234';
            const codeElement = document.querySelector('.seller-country-code');
            if (codeElement) {
                codeElement.textContent = code;
            }
        });

        // Initialize
        updateProgress(1);