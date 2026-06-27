/* ==========================================
   PORTFOLIO INTERACTIVE LOGIC - script.js
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CORE & UTILITIES ---
    
    // Cursor Glow tracker
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.opacity = '1';
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        });
        document.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = '0';
        });
    }

    // Scroll Progress & Back-to-Top Ring
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('back-to-top');
    const progressCircle = document.querySelector('.progress-ring__circle');
    
    if (progressCircle) {
        const radius = progressCircle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = circumference;

        function setProgress(percent) {
            const offset = circumference - (percent / 100 * circumference);
            progressCircle.style.strokeDashoffset = offset;
        }

        window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            
            if (scrollProgress) scrollProgress.style.width = `${scrolled}%`;
            setProgress(scrolled);

            if (winScroll > 300) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 2. PARTICLE BACKGROUND SYSTEM ---
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        const numberOfParticles = 80;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 0.4 - 0.2;
                this.speedY = Math.random() * 0.4 - 0.2;
                this.color = 'rgba(255, 255, 255, 0.15)';
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                else if (this.x < 0) this.x = canvas.width;

                if (this.y > canvas.height) this.y = 0;
                else if (this.y < 0) this.y = canvas.height;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particlesArray = [];
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Subtle glow connection lines
            const accentHue = getComputedStyle(document.documentElement).getPropertyValue('--hue').trim();
            
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();

                for (let j = i; j < particlesArray.length; j++) {
                    const dx = particlesArray[i].x - particlesArray[j].x;
                    const dy = particlesArray[i].y - particlesArray[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `hsla(${accentHue}, 80%, 65%, ${0.07 - distance/1500})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }

    // --- 3. DYNAMIC TYPING ANIMS ---
    const typingText = document.getElementById('typing-text');
    let words = ["Java Full Stack Developer", "AI Enthusiast", "Software Engineering Student"];
    if (typingText) {
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let delay = 150;

        function type() {
            const currentWord = words[wordIndex % words.length];
            if (isDeleting) {
                typingText.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                delay = 50;
            } else {
                typingText.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                delay = 120;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                delay = 1800; // Pause at end of word
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                delay = 500; // Pause before new word
            }

            setTimeout(type, delay);
        }
        setTimeout(type, 1000);
    }

    // --- 4. THEME CUSTOMIZATION & ACCENT STATE ---
    const themeCustomizer = document.getElementById('theme-customizer');
    const customizerToggle = document.getElementById('customizer-toggle');
    const accentColorBtns = document.querySelectorAll('.accent-colors .color-btn');
    const darkModeBtn = document.getElementById('dark-mode-btn');
    const lightModeBtn = document.getElementById('light-mode-btn');
    const visitorCount = document.getElementById('visitor-count');

    // Toggle Customizer Panel
    if (customizerToggle) {
        customizerToggle.addEventListener('click', () => {
            themeCustomizer.classList.toggle('active');
        });
        // Click outside customizer to close
        document.addEventListener('click', (e) => {
            if (!themeCustomizer.contains(e.target)) {
                themeCustomizer.classList.remove('active');
            }
        });
    }

    // Apply Saved Settings from LocalStorage
    const savedHue = localStorage.getItem('theme-accent') || '270';
    const savedMode = localStorage.getItem('theme-mode') || 'dark';

    setAccentHue(savedHue);
    setThemeMode(savedMode);

    accentColorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const hueVal = btn.getAttribute('data-hue');
            setAccentHue(hueVal);
            localStorage.setItem('theme-accent', hueVal);
            
            accentColorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    if (darkModeBtn && lightModeBtn) {
        darkModeBtn.addEventListener('click', () => setThemeMode('dark'));
        lightModeBtn.addEventListener('click', () => setThemeMode('light'));
    }

    function setAccentHue(hue) {
        document.documentElement.style.setProperty('--hue', hue);
        // Highlight active btn
        accentColorBtns.forEach(btn => {
            if (btn.getAttribute('data-hue') === hue) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    function setThemeMode(mode) {
        if (mode === 'dark') {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            if (darkModeBtn) darkModeBtn.classList.add('active');
            if (lightModeBtn) lightModeBtn.classList.remove('active');
            localStorage.setItem('theme-mode', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            if (lightModeBtn) lightModeBtn.classList.add('active');
            if (darkModeBtn) darkModeBtn.classList.remove('active');
            localStorage.setItem('theme-mode', 'light');
        }
    }

    // Visitor Counter persistence
    let currentVisitors = parseInt(localStorage.getItem('visitor-total') || '1482');
    currentVisitors++;
    localStorage.setItem('visitor-total', currentVisitors);
    if (visitorCount) {
        visitorCount.textContent = currentVisitors.toLocaleString();
    }

    // --- 5. INTERACTIVE MOCK GITHUB GRAPH ---
    const githubGraph = document.getElementById('github-graph');
    if (githubGraph) {
        // Build 371 cells (approx 53 weeks)
        const cellCount = 364;
        const baseDate = new Date();
        baseDate.setDate(baseDate.getDate() - cellCount);

        for (let i = 0; i < cellCount; i++) {
            const cell = document.createElement('div');
            cell.className = 'graph-cell';
            
            // Random distribution leaning to 0 and 1, with peaks
            const rand = Math.random();
            let level = 0;
            if (rand > 0.85) level = 4;
            else if (rand > 0.7) level = 3;
            else if (rand > 0.45) level = 2;
            else if (rand > 0.2) level = 1;
            
            cell.classList.add(`level-${level}`);
            
            // Format tooltip date
            const date = new Date(baseDate);
            date.setDate(date.getDate() + i);
            const contributions = level === 0 ? 'No' : level * Math.floor(Math.random() * 3 + 1);
            const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            
            cell.title = `${contributions} contributions on ${formattedDate}`;
            githubGraph.appendChild(cell);
        }
    }

    // --- 6. METRICS & COUNTER ANIMATION ---
    const counters = document.querySelectorAll('.counter');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const countObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const limit = parseInt(target.getAttribute('data-target'));
                let current = 0;
                const increment = limit > 100 ? 8 : limit > 20 ? 2 : 1;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= limit) {
                        target.textContent = limit + (limit === 500 || limit === 5 || limit === 3 || limit === 6 || limit === 15 ? '+' : '');
                        clearInterval(timer);
                    } else {
                        target.textContent = current;
                    }
                }, 20);
                
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    counters.forEach(c => countObserver.observe(c));

    // Scroll reveal activation
    const revealItems = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    revealItems.forEach(item => revealObserver.observe(item));

    // --- 7. PROJECTS FILTERING & DETAILED MODAL ---
    const projectSearch = document.getElementById('project-search');
    const filterBtns = document.querySelectorAll('#project-filters .filter-btn');
    const projectCards = document.querySelectorAll('#projects-grid .project-card');
    const projTimelineSteps = document.querySelectorAll('.proj-timeline-steps .step');

    // Filter Trigger Function
    function filterProjects() {
        const query = projectSearch.value.toLowerCase().trim();
        const activeBtn = document.querySelector('#project-filters .filter-btn.active');
        const category = activeBtn.getAttribute('data-filter');

        projectCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const desc = card.querySelector('.project-desc-short').textContent.toLowerCase();
            const techs = card.getAttribute('data-tech').toLowerCase();
            const categories = card.getAttribute('data-category').split(',');

            const matchesSearch = title.includes(query) || desc.includes(query) || techs.includes(query);
            const matchesCategory = category === 'all' || categories.includes(category);

            if (matchesSearch && matchesCategory) {
                card.style.display = 'flex';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
            }
        });
    }

    if (projectSearch) {
        projectSearch.addEventListener('input', filterProjects);
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProjects();
        });
    });

    // Tech Stack Explorer highlight links
    const interactiveTags = document.querySelectorAll('.skill-interactive-tag');
    interactiveTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const tech = tag.getAttribute('data-tech');
            const isHighlighted = tag.classList.contains('highlighted');
            
            // Remove previous active state
            interactiveTags.forEach(t => t.classList.remove('highlighted'));
            
            if (!isHighlighted) {
                tag.classList.add('highlighted');
                // Filter project list to contain only projects matching this tech tag
                projectCards.forEach(card => {
                    const techs = card.getAttribute('data-tech').split(',');
                    if (techs.includes(tech)) {
                        card.style.display = 'flex';
                        card.style.transform = 'scale(1.03)';
                        card.style.borderColor = 'var(--accent)';
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                // Scroll down to projects section
                document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
            } else {
                // Reset filtering
                filterProjects();
                projectCards.forEach(card => {
                    card.style.borderColor = 'var(--glass-border)';
                });
            }
        });
    });

    // Project creation timeline highlight steps
    projTimelineSteps.forEach(step => {
        step.addEventListener('click', () => {
            projTimelineSteps.forEach(s => s.classList.remove('highlighted'));
            step.classList.add('highlighted');
            const projId = step.getAttribute('data-proj');
            
            projectCards.forEach(card => {
                if (card.getAttribute('data-id') === projId) {
                    card.style.display = 'flex';
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    card.style.transform = 'scale(1.05)';
                    card.style.boxShadow = '0 10px 30px var(--accent-glow)';
                    setTimeout(() => {
                        card.style.transform = '';
                        card.style.boxShadow = '';
                    }, 2500);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Modal data for projects
    const projectDetailsData = {
        p1: {
            title: "Gamified Education Platform",
            org: "Smart India Hackathon Entry",
            tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Low-Bandwidth Sync"],
            desc: "Designed and engineered an online/offline educational app to deliver syllabus content and quizzes to remote regions of India. The system includes lightweight SQLite index layers, sync adapters that trigger automatically on intermittent connectivity, and gamified progress rewards to drive user engagement.",
            features: [
                "Incremental offline synchronization adapter",
                "Quizzes, achievements, and leaderboard rankings",
                "Asset compression for 2G connections",
                "Dynamic SVG progress badge generation"
            ],
            challenge: "Enabling remote, high-latency clients to download updates without dropping data packets.",
            lessons: "Built custom client-side cache tables in IndexedDB and engineered an sync protocol that retries failed data transfers using binary buffers.",
            github: "https://github.com/bhumisingh200",
            live: "#"
        },
        p2: {
            title: "NGO Transparency & Donation Tracker",
            org: "Webathon - Top 15 Project",
            tech: ["HTML", "CSS", "JavaScript", "Firebase Sync", "Chart.js"],
            desc: "A client portal built to bring transparency to charitable donations. Tracks donor capital flows down to active local distributions. Built in 36 hours for the inter-college Webathon, securing a top-15 classification among 200 participants.",
            features: [
                "Interactive donation allocation breakdowns via Chart.js",
                "Firebase Realtime Database integration",
                "Detailed ledger audit views",
                "Automatic email invoice generation system"
            ],
            challenge: "Enforcing validation across donation logs without adding processing friction.",
            lessons: "Leveraged firebase-rules for security validations and reduced DOM updates by batching real-time changes.",
            github: "https://github.com/bhumisingh200",
            live: "#"
        },
        p3: {
            title: "AI Tutor For Remote India",
            org: "SHE INNOVATES Entry",
            tech: ["Python", "FastAPI", "Streamlit", "REST APIs"],
            desc: "Developed an intelligent learning tool designed to ingest PDFs and textbook media. The tool extracts text, builds an offline indexing graph, and answers student questions locally using quantized neural network models.",
            features: [
                "PDF and TXT document ingestion adapters",
                "Locally cached semantic search vectors",
                "Quantized local response generators",
                "Custom interactive Streamlit UI console"
            ],
            challenge: "Enforcing fast question-answering pipelines on low-end school computers.",
            lessons: "Learned context window trimming strategies and implemented sentence-transformer index pruning.",
            github: "https://github.com/bhumisingh200",
            live: "#"
        },
        p4: {
            title: "Air Quality Prediction System",
            org: "Academic Project - GNIOT",
            tech: ["Python", "Machine Learning", "Scikit-Learn", "Data Analysis"],
            desc: "Created a predictive air-quality model mapping particulate patterns around Greater Noida. The application trains on historical sensor feeds and forecasts particulate counts using regression equations.",
            features: [
                "Data scrubbing pipeline for cleaning raw PM2.5 readings",
                "Random Forest Regression modeling",
                "Predictive color-mapped regional dashboards",
                "Automated anomaly alerts"
            ],
            challenge: "Handling missing/skewed telemetry data from municipal sensors.",
            lessons: "Implemented median-interpolation algorithms and feature scaling methods.",
            github: "https://github.com/bhumisingh200",
            live: "#"
        },
        p5: {
            title: "Local Job Hiring App",
            org: "TechClasher Prototype",
            tech: ["UI/UX Design", "Figma", "HTML5", "CSS3", "JavaScript"],
            desc: "A prototype designed to match local skilled workers (mechanics, carpenters, helpers) to micro-tasks. Highlights location queries, ratings logs, and instant contact options.",
            features: [
                "Figma visual flow maps",
                "Responsive mobile card grid interfaces",
                "Interactive ratings and reviews systems",
                "Interactive map location markers"
            ],
            challenge: "Creating an accessible, highly visual layout for users with low technical backgrounds.",
            lessons: "Adopted icon-heavy workflows and optimized font sizes for mobile screens.",
            github: "https://github.com/bhumisingh200",
            live: "#"
        }
    };

    const projectModal = document.getElementById('project-modal');
    const projectClose = document.getElementById('project-modal-close');
    const detailTriggers = document.querySelectorAll('.btn-project-details');

    detailTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const projId = trigger.getAttribute('data-project-id');
            const data = projectDetailsData[projId];
            if (data) {
                document.getElementById('modal-project-title').textContent = data.title;
                document.getElementById('modal-project-org').textContent = data.org;
                document.getElementById('modal-project-desc').textContent = data.desc;
                document.getElementById('modal-project-challenge').textContent = data.challenge;
                document.getElementById('modal-project-lessons').textContent = data.lessons;

                // Tech badges
                const techWrapper = document.getElementById('modal-project-tech');
                techWrapper.innerHTML = '';
                data.tech.forEach(t => {
                    const span = document.createElement('span');
                    span.textContent = t;
                    techWrapper.appendChild(span);
                });

                // Features list
                const featuresWrapper = document.getElementById('modal-project-features');
                featuresWrapper.innerHTML = '';
                data.features.forEach(f => {
                    const li = document.createElement('li');
                    li.textContent = f;
                    featuresWrapper.appendChild(li);
                });

                // Button links
                document.getElementById('modal-project-github').href = data.github;
                document.getElementById('modal-project-live').href = data.live;

                projectModal.classList.add('active');
            }
        });
    });

    if (projectClose) {
        projectClose.addEventListener('click', () => projectModal.classList.remove('active'));
    }

    // --- 8. TESTIMONIALS SLIDER NAVIGATION ---
    const testiCards = document.querySelectorAll('#testimonials-track .testimonial-card');
    const prevTesti = document.getElementById('prev-testi');
    const nextTesti = document.getElementById('next-testi');
    let currentTestiIndex = 0;

    function showTesti(index) {
        testiCards.forEach(c => c.classList.remove('active'));
        testiCards[index].classList.add('active');
    }

    if (prevTesti && nextTesti && testiCards.length > 0) {
        prevTesti.addEventListener('click', () => {
            currentTestiIndex = (currentTestiIndex - 1 + testiCards.length) % testiCards.length;
            showTesti(currentTestiIndex);
        });
        nextTesti.addEventListener('click', () => {
            currentTestiIndex = (currentTestiIndex + 1) % testiCards.length;
            showTesti(currentTestiIndex);
        });
    }

    // --- 9. TECHNICAL BLOGS DRAWER ---
    const blogModal = document.getElementById('blog-modal');
    const blogClose = document.getElementById('blog-modal-close');
    const blogCloseBtn = document.getElementById('blog-modal-close-btn');
    const blogTriggers = document.querySelectorAll('.read-blog-trigger');

    const blogContentData = {
        b1: {
            title: "Understanding Java OOP Paradigms",
            category: "Java Development",
            body: `
                <p>Object-Oriented Programming (OOP) forms the core of robust Java backend architecture. Let's break down the four fundamental pillars with visual references.</p>
                <h4>1. Encapsulation</h4>
                <p>This is the mechanism of wrapping data (variables) and code acting on the data (methods) together as a single unit. In encapsulation, the variables of a class are hidden from other classes, accessible only through setter/getter methods. This ensures security and validation controls.</p>
                <pre><code>public class Person {
    private String name;
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}</code></pre>
                <h4>2. Inheritance</h4>
                <p>Inheritance lets one class acquire the properties (fields and methods) of another. This supports reusability. In Java, we use the <code>extends</code> keyword to build hierarchical associations.</p>
                <h4>3. Polymorphism</h4>
                <p>Polymorphism allows objects to take multiple forms. The most common use is when a parent class reference points to a child class object. Method Overriding is a runtime demonstration of polymorphism.</p>
                <h4>4. Abstraction</h4>
                <p>Abstraction hides implementation details while showing only core functionality. In Java, abstraction is achieved using Abstract Classes or Interfaces.</p>
            `
        },
        b2: {
            title: "Relational MySQL Basics",
            category: "Databases & Schemas",
            body: `
                <p>Relational Database Management Systems (RDBMS) are critical for robust backend operations. Here are core SQL concepts every developer should master.</p>
                <h4>1. Normalized Databases</h4>
                <p>Normalization organizes database columns and tables to minimize redundancy and dependency. Commonly, schemas are normalized up to 3NF (Third Normal Form) in corporate systems.</p>
                <h4>2. Key Joins (INNER, LEFT, RIGHT, FULL)</h4>
                <p>SQL joins merge records from two or more tables based on matched columns. An <code>INNER JOIN</code> selects records with matching values in both tables, whereas a <code>LEFT JOIN</code> returns all records from the left table and matched rows from the right.</p>
                <pre><code>SELECT Orders.OrderID, Customers.CustomerName
FROM Orders
LEFT JOIN Customers ON Orders.CustomerID = Customers.CustomerID;</code></pre>
                <h4>3. Sync via JDBC in Java</h4>
                <p>Java Database Connectivity (JDBC) handles queries using connection pools. Ensuring you close connections or leverage try-with-resources prevents leaks.</p>
            `
        },
        b3: {
            title: "Efficient DOM Manipulation",
            category: "Frontend Scripting",
            body: `
                <p>The Document Object Model (DOM) is an application programming interface for HTML documents. Managing layout thrashing ensures clean web performance.</p>
                <h4>1. Event Delegation</h4>
                <p>Instead of assigning event listeners to hundreds of individual elements, event delegation lets you attach a single handler to a parent element. This relies on event bubbling.</p>
                <pre><code>document.getElementById('parent').addEventListener('click', (e) => {
    if (e.target.matches('.child-button')) {
        console.log('Button clicked:', e.target);
    }
});</code></pre>
                <h4>2. Batching DOM Operations</h4>
                <p>Each update to the DOM can cause the browser to recalculate the page layout (reflow) and repaint. Using <code>DocumentFragments</code> allows you to compile element trees in memory before rendering.</p>
            `
        },
        b4: {
            title: "Git Commands Cheat Sheet",
            category: "Developer Tools",
            body: `
                <p>Version control is a developer's lifeline. Here is a curated list of commands to solve merge loops under pressure.</p>
                <h4>1. Interactive Rebase</h4>
                <p>Use <code>git rebase -i HEAD~n</code> to squish, edit, or delete commits before merging features back into the production branch.</p>
                <h4>2. Conflict Resolution</h4>
                <p>When changes clash, Git highlights conflicting blocks. Wiping marker headers (<code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code>, <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>) and selecting the correct logical progression resolves conflicts.</p>
                <pre><code># Check current status
git status
# Add solved paths
git add resolved_file.js
# Complete rebase run
git rebase --continue</code></pre>
            `
        }
    };

    blogTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const blogId = trigger.getAttribute('data-id');
            const data = blogContentData[blogId];
            if (data) {
                document.getElementById('modal-blog-title').textContent = data.title;
                document.getElementById('modal-blog-category').textContent = data.category;
                document.getElementById('modal-blog-body').innerHTML = data.body;
                blogModal.classList.add('active');
            }
        });
    });

    if (blogClose) blogClose.addEventListener('click', () => blogModal.classList.remove('active'));
    if (blogCloseBtn) blogCloseBtn.addEventListener('click', () => blogModal.classList.remove('active'));

    // --- 10. RESUME MODAL & DOWNLOAD SIM ---
    const resumeModal = document.getElementById('resume-modal');
    const resumeClose = document.getElementById('resume-modal-close');
    const resumeCloseBtn = document.getElementById('resume-modal-close-btn');
    const downloadResumeBtn = document.getElementById('download-resume-btn');
    const viewResumeBtn = document.getElementById('view-resume-btn');
    const resumeDownloadModalBtn = document.getElementById('resume-modal-download-btn');

    function openResumeModal() {
        resumeModal.classList.add('active');
    }
    function closeResumeModal() {
        resumeModal.classList.remove('active');
    }

    if (viewResumeBtn) viewResumeBtn.addEventListener('click', openResumeModal);
    if (resumeClose) resumeClose.addEventListener('click', closeResumeModal);
    if (resumeCloseBtn) resumeCloseBtn.addEventListener('click', closeResumeModal);

    function triggerResumeDownload() {
        // Create virtual download element
        const link = document.createElement('a');
        link.href = '#';
        link.download = 'Bhumi_Singh_Resume.pdf';
        
        // Notify
        const notif = document.getElementById('contact-notification');
        const notifTitle = notif.querySelector('h4');
        const notifDesc = notif.querySelector('p');
        const notifIcon = notif.querySelector('i');

        notifIcon.className = 'fas fa-file-pdf';
        notifIcon.style.color = '#ff4a5a';
        notifTitle.textContent = "Resume Download Initialized";
        notifDesc.textContent = "PDF document successfully compiled.";
        
        notif.style.borderLeftColor = '#ff4a5a';
        notif.classList.add('active');
        setTimeout(() => notif.classList.remove('active'), 3500);
    }

    if (downloadResumeBtn) downloadResumeBtn.addEventListener('click', triggerResumeDownload);
    if (resumeDownloadModalBtn) resumeDownloadModalBtn.addEventListener('click', () => {
        closeResumeModal();
        triggerResumeDownload();
    });

    // --- 11. COMMAND PALETTE MODAL ---
    const cmdPaletteOverlay = document.getElementById('command-palette-overlay');
    const cmdTrigger = document.getElementById('cmd-palette-trigger');
    const cmdSearchInput = document.getElementById('cmd-search-input');
    const cmdResultsList = document.getElementById('cmd-results-list');
    const cmdItems = document.querySelectorAll('.cmd-item');
    let cmdActiveIndex = 0;

    function openCommandPalette() {
        cmdPaletteOverlay.classList.add('active');
        setTimeout(() => cmdSearchInput.focus(), 100);
        cmdActiveIndex = 0;
        updateSelectedCommand();
    }
    function closeCommandPalette() {
        cmdPaletteOverlay.classList.remove('active');
        cmdSearchInput.value = '';
        cmdItems.forEach(item => item.style.display = 'flex');
    }

    if (cmdTrigger) cmdTrigger.addEventListener('click', openCommandPalette);

    document.addEventListener('keydown', (e) => {
        // Ctrl+K opens palette
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (cmdPaletteOverlay.classList.contains('active')) {
                closeCommandPalette();
            } else {
                openCommandPalette();
            }
        }
        
        // Key navigation inside palette
        if (cmdPaletteOverlay.classList.contains('active')) {
            const visibleItems = Array.from(cmdItems).filter(item => item.style.display !== 'none');
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                cmdActiveIndex = (cmdActiveIndex + 1) % visibleItems.length;
                updateSelectedCommand(visibleItems);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                cmdActiveIndex = (cmdActiveIndex - 1 + visibleItems.length) % visibleItems.length;
                updateSelectedCommand(visibleItems);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (visibleItems[cmdActiveIndex]) {
                    visibleItems[cmdActiveIndex].click();
                }
            } else if (e.key === 'Escape') {
                closeCommandPalette();
            }
        }
    });

    // Filter command palette options
    if (cmdSearchInput) {
        cmdSearchInput.addEventListener('input', () => {
            const val = cmdSearchInput.value.toLowerCase().trim();
            cmdItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(val)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
            cmdActiveIndex = 0;
            updateSelectedCommand();
        });
    }

    function updateSelectedCommand(visibleItemsList) {
        const visible = visibleItemsList || Array.from(cmdItems).filter(item => item.style.display !== 'none');
        cmdItems.forEach(item => item.classList.remove('selected'));
        if (visible[cmdActiveIndex]) {
            visible[cmdActiveIndex].classList.add('selected');
            visible[cmdActiveIndex].scrollIntoView({ block: 'nearest' });
        }
    }

    // Execute actions based on Command Selection
    cmdItems.forEach(item => {
        item.addEventListener('click', () => {
            const action = item.getAttribute('data-action');
            const target = item.getAttribute('data-target');
            const val = item.getAttribute('data-val');

            closeCommandPalette();

            if (action === 'nav') {
                document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
            } else if (action === 'theme-accent') {
                setAccentHue(val);
                localStorage.setItem('theme-accent', val);
            } else if (action === 'terminal') {
                openTerminalConsole();
            } else if (action === 'resume') {
                triggerResumeDownload();
            }
        });
    });

    // Close on overlay click
    if (cmdPaletteOverlay) {
        cmdPaletteOverlay.addEventListener('click', (e) => {
            if (e.target === cmdPaletteOverlay) {
                closeCommandPalette();
            }
        });
    }

    // --- 12. TERMINAL SHELL INTERPRETER ---
    const terminalDrawer = document.getElementById('terminal-drawer');
    const terminalToggleTrigger = document.getElementById('terminal-toggle-trigger');
    const terminalCloseBtn = document.getElementById('terminal-close-btn');
    const terminalMinimizeBtn = document.getElementById('terminal-minimize-btn');
    const terminalShellInput = document.getElementById('terminal-shell-input');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalBody = document.getElementById('terminal-body');

    let commandHistory = [];
    let historyIndex = -1;

    function openTerminalConsole() {
        terminalDrawer.classList.add('active');
        setTimeout(() => terminalShellInput.focus(), 200);
    }
    function closeTerminalConsole() {
        terminalDrawer.classList.remove('active');
    }

    if (terminalToggleTrigger) {
        terminalToggleTrigger.addEventListener('click', () => {
            if (terminalDrawer.classList.contains('active')) {
                closeTerminalConsole();
            } else {
                openTerminalConsole();
            }
        });
    }
    if (terminalCloseBtn) terminalCloseBtn.addEventListener('click', closeTerminalConsole);
    if (terminalMinimizeBtn) terminalMinimizeBtn.addEventListener('click', closeTerminalConsole);

    // Shell prompt commands
    if (terminalShellInput) {
        terminalShellInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = terminalShellInput.value.trim();
                if (cmd) {
                    executeCommand(cmd);
                    commandHistory.push(cmd);
                    historyIndex = commandHistory.length;
                    terminalShellInput.value = '';
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    terminalShellInput.value = commandHistory[historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    terminalShellInput.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    terminalShellInput.value = '';
                }
            }
        });

        // Open Console shell via Alt + T shortcut
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key.toLowerCase() === 't') {
                e.preventDefault();
                if (terminalDrawer.classList.contains('active')) {
                    closeTerminalConsole();
                } else {
                    openTerminalConsole();
                }
            }
        });
    }

    function appendTerminalLine(text, type = '') {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        if (type) line.classList.add(type);
        line.innerHTML = text;
        terminalOutput.appendChild(line);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function executeCommand(inputString) {
        const prompt = `<span class="terminal-prompt">guest@bhumi:~$&nbsp;</span>${inputString}`;
        appendTerminalLine(prompt);
        
        const args = inputString.toLowerCase().trim().split(' ');
        const cmd = args[0];

        switch(cmd) {
            case 'help':
                appendTerminalLine('Available shell commands:');
                appendTerminalLine('  about      - Display background details about Bhumi');
                appendTerminalLine('  skills     - List skills and progress indices');
                appendTerminalLine('  projects   - Show project statistics');
                appendTerminalLine('  contact    - Print active contact coordinates');
                appendTerminalLine('  theme [c]  - Swap color accents: blue, purple, green, orange');
                appendTerminalLine('  clear      - Wipe shell logs');
                appendTerminalLine('  konami     - Manually engage Developer Mode');
                appendTerminalLine('  exit       - Close developer console');
                break;
            case 'clear':
                terminalOutput.innerHTML = '';
                break;
            case 'about':
                appendTerminalLine('Bhumi Singh - Aspiring SDE & AI Enthusiast.');
                appendTerminalLine('Currently pursuing B.Tech in Artificial Intelligence (2nd Year) at GNIOT.');
                appendTerminalLine('CGPA: 7.9. Driven by logic architectures and full stack integration.');
                break;
            case 'skills':
                appendTerminalLine('Core Technical Competencies:');
                appendTerminalLine('  Languages: Java, JavaScript, Python, SQL, HTML5, CSS3');
                appendTerminalLine('  Backend: Node.js, Express, Spring Boot, REST APIs, JDBC');
                appendTerminalLine('  Databases: MySQL, MongoDB, Firebase');
                break;
            case 'projects':
                appendTerminalLine('Featured Projects Catalog:');
                appendTerminalLine('  1. Gamified Education Platform (React, Node, Mongo) - SIH entry');
                appendTerminalLine('  2. NGO Transparency Portal (JS, Firebase, ChartJS) - Webathon winner');
                appendTerminalLine('  3. AI Tutor (Python, FastAPI, Streamlit)');
                appendTerminalLine('  4. Air Quality Prediction System (ML Regression)');
                break;
            case 'contact':
                appendTerminalLine('Coordinates:');
                appendTerminalLine('  Email: bhumi_2400526@gniot.net.in');
                appendTerminalLine('  Phone: +91 8879260494');
                appendTerminalLine('  LinkedIn: linkedin.com/in/bhumi-singh-97818830b');
                break;
            case 'theme':
                if (args[1]) {
                    const color = args[1];
                    let hue = '270';
                    if (color === 'purple') hue = '270';
                    else if (color === 'blue') hue = '220';
                    else if (color === 'green') hue = '145';
                    else if (color === 'orange') hue = '25';
                    else {
                        appendTerminalLine(`Unknown accent color: ${color}`, 'text-error');
                        break;
                    }
                    setAccentHue(hue);
                    localStorage.setItem('theme-accent', hue);
                    appendTerminalLine(`Accent theme updated to ${color}.`, 'text-info');
                } else {
                    appendTerminalLine('Syntax: theme [purple|blue|green|orange]', 'text-warning');
                }
                break;
            case 'konami':
                appendTerminalLine('Bypassing verification cores...', 'text-warning');
                setTimeout(() => {
                    closeTerminalConsole();
                    engageMatrixRain();
                }, 1000);
                break;
            case 'sudo':
                if (args[1] === 'rm' && args[2] === '-rf') {
                    appendTerminalLine('WARNING: guest user lacks authorization codes to delete root directories.', 'text-error');
                } else {
                    appendTerminalLine('guest user is not in the sudoers file. This incident will be reported.', 'text-error');
                }
                break;
            case 'exit':
                closeTerminalConsole();
                break;
            default:
                appendTerminalLine(`Command not found: ${cmd}. Type 'help' for directories.`, 'text-error');
        }
    }

    // --- 13. EASTER EGG KONAMI CODE & MATRIX RAIN ---
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiPosition = 0;

    document.addEventListener('keydown', (e) => {
        const requiredKey = konamiCode[konamiPosition];
        if (e.key === requiredKey) {
            konamiPosition++;
            if (konamiPosition === konamiCode.length) {
                engageMatrixRain();
                konamiPosition = 0;
            }
        } else {
            konamiPosition = 0;
        }
    });

    const matrixOverlay = document.getElementById('matrix-overlay');
    const matrixCanvas = document.getElementById('matrix-canvas');
    const matrixExit = document.getElementById('matrix-exit-btn');
    let matrixInterval;

    function engageMatrixRain() {
        if (!matrixOverlay || !matrixCanvas) return;
        
        matrixOverlay.classList.add('active');
        const ctx = matrixCanvas.getContext('2d');
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;

        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$@#%&";
        const fontSize = 16;
        const columns = matrixCanvas.width / fontSize;
        const rainDrops = [];

        for (let x = 0; x < columns; x++) {
            rainDrops[x] = 1;
        }

        function drawRain() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

            ctx.fillStyle = '#39ff14'; // Matrix neon green
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < rainDrops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

                if (rainDrops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            }
        }

        matrixInterval = setInterval(drawRain, 30);
    }

    function exitMatrixRain() {
        matrixOverlay.classList.remove('active');
        clearInterval(matrixInterval);
    }

    if (matrixExit) matrixExit.addEventListener('click', exitMatrixRain);

    // --- 14. CONTACT FORM FRONTEND VALIDATION ---
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const subjectInput = document.getElementById('form-subject');
    const messageInput = document.getElementById('form-message');
    const notification = document.getElementById('contact-notification');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            
            // Name validation
            if (nameInput.value.trim().length < 2) {
                nameInput.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                nameInput.parentElement.classList.remove('invalid');
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                emailInput.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                emailInput.parentElement.classList.remove('invalid');
            }

            // Subject validation
            if (subjectInput.value.trim().length === 0) {
                subjectInput.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                subjectInput.parentElement.classList.remove('invalid');
            }

            // Message validation
            if (messageInput.value.trim().length < 10) {
                messageInput.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                messageInput.parentElement.classList.remove('invalid');
            }

            if (isValid) {
                // Submit Form (Simulation)
                const submitText = document.getElementById('btn-submit-text');
                const btn = contactForm.querySelector('button[type="submit"]');
                
                btn.disabled = true;
                submitText.textContent = "Transmitting...";
                
                setTimeout(() => {
                    // Show Notification popup
                    const notifTitle = notification.querySelector('h4');
                    const notifDesc = notification.querySelector('p');
                    const notifIcon = notification.querySelector('i');

                    notifIcon.className = 'fas fa-check-circle';
                    notifIcon.style.color = '#28c76f';
                    notifTitle.textContent = "Message Transmitted!";
                    notifDesc.textContent = "Thank you. Bhumi will connect back with you soon.";
                    notification.style.borderLeftColor = '#28c76f';
                    notification.classList.add('active');
                    
                    // Reset Form
                    contactForm.reset();
                    submitText.textContent = "Send Message";
                    btn.disabled = false;

                    // Remove notification after delay
                    setTimeout(() => {
                        notification.classList.remove('active');
                    }, 4000);
                }, 1500);
            }
        });

        // Event listeners to remove validation flags on typing
        [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim().length > 0) {
                    input.parentElement.classList.remove('invalid');
                }
            });
        });
    }

    // --- 15. DYNAMIC LOCALIZATION (ENGLISH / HINDI) ---
    const langToggleBtn = document.getElementById('lang-toggle-btn');
    const langMenu = document.getElementById('lang-menu');
    const langOptions = document.querySelectorAll('.lang-option');
    const currentLangLabel = document.getElementById('current-lang-label');

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenu.classList.toggle('active');
        });
        document.addEventListener('click', () => langMenu.classList.remove('active'));
    }

    const translations = {
        en: {
            "hero-greeting": "Hi, I'm Bhumi Singh",
            "hero-title-prefix": "Aspiring",
            "hero-description": "2nd year B.Tech student in Artificial Intelligence at GNIOT. Building robust backend applications with Java & Spring Boot, combined with highly interactive, modern web frontends.",
            "btn-download-resume": "Download Resume",
            "btn-view-resume": "View Resume",
            "btn-contact": "Contact Me"
        },
        hi: {
            "hero-greeting": "नमस्ते, मैं भूमि सिंह हूँ",
            "hero-title-prefix": "महत्वाकांक्षी",
            "hero-description": "GNIOT में आर्टिफिशियल इंटेलिजेंस में बी.टेक द्वितीय वर्ष की छात्रा। जावा और स्प्रिंग बूट के साथ मजबूत बैकएंड एप्लिकेशन का निर्माण, और अत्यधिक इंटरैक्टिव वेब फ्रंटएंड का संयोजन।",
            "btn-download-resume": "बायोडाटा डाउनलोड करें",
            "btn-view-resume": "बायोडाटा देखें",
            "btn-contact": "संपर्क करें"
        }
    };

    const selectorTranslations = {
        // Nav Links
        '.nav-menu li:nth-child(1) a': { en: 'Home', hi: 'होम' },
        '.nav-menu li:nth-child(2) a': { en: 'About', hi: 'मेरे बारे में' },
        '.nav-menu li:nth-child(3) a': { en: 'Skills', hi: 'कौशल' },
        '.nav-menu li:nth-child(4) a': { en: 'Projects', hi: 'परियोजनाएं' },
        '.nav-menu li:nth-child(5) a': { en: 'Timeline', hi: 'समयरेखा' },
        '.nav-menu li:nth-child(6) a': { en: 'Certifications', hi: 'प्रमाणपत्र' },
        '.nav-menu li:nth-child(7) a': { en: 'Blogs', hi: 'ब्लॉग' },
        '.nav-menu li:nth-child(8) a': { en: 'Contact', hi: 'संपर्क' },
        
        // Section Headings
        '#dashboard .section-title': { en: '<i class="fas fa-chart-pie"></i> Bhumi\'s Metrics & Stats', hi: '<i class="fas fa-chart-pie"></i> भूमि के आंकड़े और स्थिति' },
        '#services .section-title': { en: '<i class="fas fa-concierge-bell"></i> What I Offer', hi: '<i class="fas fa-concierge-bell"></i> मेरी सेवाएं' },
        '#about .section-title': { en: '<i class="fas fa-user"></i> About Me', hi: '<i class="fas fa-user"></i> मेरे बारे में' },
        '#skills .section-title': { en: '<i class="fas fa-tools"></i> Skills Explorer', hi: '<i class="fas fa-tools"></i> कौशल अन्वेषक' },
        '#projects .section-title': { en: '<i class="fas fa-project-diagram"></i> Featured Projects', hi: '<i class="fas fa-project-diagram"></i> चुनिंदा परियोजनाएं' },
        '#experience .section-title': { en: '<i class="fas fa-history"></i> Experience & Education', hi: '<i class="fas fa-history"></i> अनुभव और शिक्षा' },
        '#achievements .section-title': { en: '<i class="fas fa-trophy"></i> Achievements & Profiles', hi: '<i class="fas fa-trophy"></i> उपलब्धियां और प्रोफाइल' },
        '#certifications .section-title': { en: '<i class="fas fa-stamp"></i> Certifications', hi: '<i class="fas fa-stamp"></i> प्रमाणपत्र' },
        '#gallery .section-title': { en: '<i class="fas fa-images"></i> Event Gallery', hi: '<i class="fas fa-images"></i> इवेंट गैलरी' },
        '#testimonials .section-title': { en: '<i class="fas fa-comments"></i> Mentor & Classmate Testimonials', hi: '<i class="fas fa-comments"></i> मेंटर और सहपाठियों के प्रशंसापत्र' },
        '#blogs .section-title': { en: '<i class="fas fa-book"></i> Technical Blogs', hi: '<i class="fas fa-book"></i> तकनीकी ब्लॉग' },
        '#contact .section-title': { en: '<i class="fas fa-envelope-open"></i> Let\'s Connect', hi: '<i class="fas fa-envelope-open"></i> आइए संपर्क करें' },
        
        // Theme Customizer
        '.theme-customizer h4': { en: 'Customize Theme', hi: 'थीम बदलें' },
        '.theme-customizer .customizer-section:nth-child(2) p': { en: 'Accent Color', hi: 'असर रंग' },
        '.theme-customizer .customizer-section:nth-child(3) p': { en: 'Mode', hi: 'मोड' },
        '.theme-customizer .customizer-section:nth-child(4) p': { en: 'Visitor Stats', hi: 'दर्शक संख्या' },
        
        // Hero subcard stats
        '.hero-stats-subcard .subcard-stat:nth-child(1) .stat-label': { en: 'CGPA', hi: 'सीजीपीए' },
        '.hero-stats-subcard .subcard-stat:nth-child(2) .stat-label': { en: 'Projects', hi: 'परियोजनाएं' },
        '.hero-stats-subcard .subcard-stat:nth-child(3) .stat-label': { en: 'Internships', hi: 'इंटर्नशिप' },
        
        // Dashboard cards
        '.dashboard-grid .stat-card:nth-child(1) p': { en: 'Total Projects Completed', hi: 'कुल पूर्ण परियोजनाएं' },
        '.dashboard-grid .stat-card:nth-child(2) p': { en: 'Completed Internships', hi: 'पूर्ण इंटर्नशिप' },
        '.dashboard-grid .stat-card:nth-child(3) p': { en: 'Global Certifications', hi: 'वैश्विक प्रमाणपत्र' },
        '.dashboard-grid .stat-card:nth-child(4) p': { en: 'Technologies & Tools Mastered', hi: 'मास्टर्ड तकनीक और उपकरण' },
        '.dashboard-grid .stat-card:nth-child(5) p': { en: 'Coding Questions Solved', hi: 'हल किए गए कोडिंग प्रश्न' },
        
        // What's new & learning headings
        '.info-split-grid .split-card:nth-child(1) h4': { en: 'What\'s New', hi: 'क्या नया है' },
        '.info-split-grid .split-card:nth-child(2) h4': { en: 'Currently Learning', hi: 'वर्तमान में सीख रहे हैं' },
        
        // Currently Learning list
        '.currently-learning-grid .learning-item:nth-child(1) h5': { en: 'Java Full Stack', hi: 'जावा फुल स्टैक' },
        '.currently-learning-grid .learning-item:nth-child(2) h5': { en: 'Spring Boot', hi: 'स्प्रिंग बूट' },
        '.currently-learning-grid .learning-item:nth-child(3) h5': { en: 'React.js', hi: 'रिएक्ट.जेएस' },
        '.currently-learning-grid .learning-item:nth-child(4) h5': { en: 'Data Structures & Algorithms', hi: 'डेटा संरचनाएं और एल्गोरिदम' },
        
        // Services Descriptions
        '.services-grid .service-card:nth-child(1) h3': { en: 'Frontend Development', hi: 'फ्रंटएंड डेवलपमेंट' },
        '.services-grid .service-card:nth-child(1) p': { en: 'Creating highly responsive, mobile-first, and semantic user interfaces with HTML5, CSS3, modern Vanilla Javascript, and React frameworks.', hi: 'HTML5, CSS3, आधुनिक वेनिला जावास्क्रिप्ट और रिएक्ट फ्रेमवर्क के साथ अत्यधिक उत्तरदायी, मोबाइल-फर्स्ट और सिमेंटिक यूजर इंटरफेस बनाना।' },
        '.services-grid .service-card:nth-child(2) h3': { en: 'Java Development', hi: 'जावा डेवलपमेंट' },
        '.services-grid .service-card:nth-child(2) p': { en: 'Writing solid, robust object-oriented code, designing database adapters with JDBC, and engineering clean command line systems and backend logic.', hi: 'ठोस, मजबूत ऑब्जेक्ट-ओरिएंटेड कोड लिखना, JDBC के साथ डेटाबेस एडेप्टर डिजाइन करना, और स्वच्छ कमांड लाइन सिस्टम और बैकएंड लॉजिक तैयार करना।' },
        '.services-grid .service-card:nth-child(3) h3': { en: 'Full Stack Integration', hi: 'फुल स्टैक इंटीग्रेशन' },
        '.services-grid .service-card:nth-child(3) p': { en: 'Connecting web client layouts to database endpoints via Express/Node.js or RESTful APIs, securing transactions and managing state.', hi: 'Express/Node.js या RESTful API के माध्यम से डेटाबेस एंडपॉइंट्स से वेब क्लाइंट लेआउट को जोड़ना, लेनदेन को सुरक्षित करना और स्थिति का प्रबंधन करना।' },
        
        // About Story
        '.about-bio h3': { en: 'My Story', hi: 'मेरी कहानी' },
        '.about-bio p:nth-of-type(1)': { en: 'I am a second-year student pursuing a Bachelor of Technology in Computer Science (Artificial Intelligence) at GNIOT, Greater Noida. My technical journey began with structural OOP concepts in Java, and I have since expanded into modern full stack architectures.', hi: 'मैं ग्रेटर नोएडा के GNIOT से कंप्यूटर साइंस (आर्टिफिशियल इंटेलिजेंस) में बैचलर ऑफ टेक्नोलॉजी का द्वितीय वर्ष का छात्र हूं। मेरी तकनीकी यात्रा जावा में संरचनात्मक OOP अवधारणाओं के साथ शुरू हुई, और तब से मैंने आधुनिक फुल स्टैक आर्किटेक्चर में विस्तार किया है।' },
        '.about-bio p:nth-of-type(2)': { en: 'I thrive on turning logic puzzles into functioning software. Whether it\'s coding interfaces or tuning relational database connections, I focus on performance, writing readable code, and expanding my skill horizons daily.', hi: 'मैं लॉजिक पहेली को काम करने वाले सॉफ्टवेयर में बदलने पर ध्यान देता हूँ। चाहे वह कोडिंग इंटरफेस हो या रिलेशनल डेटाबेस कनेक्शन को ट्यून करना, मैं प्रदर्शन, पठनीय कोड लिखने और दैनिक कौशल क्षितिज का विस्तार करने पर ध्यान केंद्रित करता हूं।' },
        '.about-interests h4': { en: 'Interests', hi: 'रुचियां' },
        '.about-interests span:nth-child(1)': { en: '<i class="fas fa-robot"></i> Artificial Intelligence', hi: '<i class="fas fa-robot"></i> आर्टिफिशियल इंटेलिजेंस' },
        '.about-interests span:nth-child(2)': { en: '<i class="fas fa-network-wired"></i> API Architectures', hi: '<i class="fas fa-network-wired"></i> एपीआई आर्किटेक्चर' },
        '.about-interests span:nth-child(3)': { en: '<i class="fas fa-gamepad"></i> Gamified Systems', hi: '<i class="fas fa-gamepad"></i> गेमीफाइड सिस्टम' },
        '.about-interests span:nth-child(4)': { en: '<i class="fas fa-users-cog"></i> Tech Events', hi: '<i class="fas fa-users-cog"></i> टेक इवेंट्स' },
        
        // About Academic timelines
        '.about-timeline h3': { en: 'Academic & Growth Roadmap', hi: 'शैक्षणिक और विकास रोडमैप' },
        '.timeline-v-item:nth-child(1) .timeline-v-desc h5': { en: 'Started B.Tech (AI)', hi: 'बी.टेक (एआई) शुरू किया' },
        '.timeline-v-item:nth-child(1) .timeline-v-desc p': { en: 'Initiated Computer Science foundations, standard data representations, and introductory OOP concepts at GNIOT.', hi: 'GNIOT में कंप्यूटर साइंस फाउंडेशन, मानक डेटा प्रतिनिधित्व और प्रारंभिक OOP अवधारणाओं की शुरुआत की।' },
        '.timeline-v-item:nth-child(2) .timeline-v-desc h5': { en: 'Java Development', hi: 'जावा डेवलपमेंट' },
        '.timeline-v-item:nth-child(2) .timeline-v-desc p': { en: 'Deep dive into Java Standard Library, inheritance paradigms, concurrency, SQL schemas, and JDBC connections.', hi: 'जावा स्टैंडर्ड लाइब्रेरी, इनहेरिटेंस प्रतिमानों, समवर्तीता, SQL स्कीमा और JDBC कनेक्शन में गहरा गोता लगाया।' },
        '.timeline-v-item:nth-child(3) .timeline-v-desc h5': { en: 'Full Stack Development', hi: 'फुल स्टैक डेवलपमेंट' },
        '.timeline-v-item:nth-child(3) .timeline-v-desc p': { en: 'Expanding skills in web frameworks (Node.js, Express, React), asynchronous Javascript, and database mapping.', hi: 'वेब फ्रेमवर्क (Node.js, Express, React), एसिंक्रोनस जावास्क्रिप्ट और डेटाबेस मैपिंग में कौशल का विस्तार करना।' },
        '.timeline-v-item:nth-child(4) .timeline-v-desc h5': { en: 'Preparing for SDE Roles', hi: 'एसडीई भूमिकाओं की तैयारी' },
        '.timeline-v-item:nth-child(4) .timeline-v-desc p': { en: 'Polishing data structures, algorithmic design patterns, systems architecture, and preparing for placements.', hi: 'डेटा संरचनाओं, एल्गोरिथम डिजाइन पैटर्न, सिस्टम आर्किटेक्चर को पॉलिश करना और प्लेसमेंट की तैयारी करना।' },
        
        // Skills Stack Info
        '.skills-helper p': { en: '<i class="fas fa-info-circle"></i> <strong>Interactive Stack Explorer:</strong> Click any technology tag to inspect which projects use it!', hi: '<i class="fas fa-info-circle"></i> <strong>इंटरैक्टिव स्टैक एक्सप्लोरर:</strong> यह देखने के लिए किसी भी तकनीक टैग पर क्लिक करें कि कौन सी परियोजनाएं इसका उपयोग करती हैं!' },
        '.skills-categories-pane .skills-group:nth-child(1) h4': { en: 'Languages', hi: 'भाषाएं' },
        '.skills-categories-pane .skills-group:nth-child(2) h4': { en: 'Frontend', hi: 'फ्रंटएंड' },
        '.skills-categories-pane .skills-group:nth-child(3) h4': { en: 'Backend', hi: 'बैकएंड' },
        '.skills-categories-pane .skills-group:nth-child(4) h4': { en: 'Databases', hi: 'डेटाबेस' },
        '.skills-categories-pane .skills-group:nth-child(5) h4': { en: 'Tools', hi: 'उपकरण' },
        '.skill-progress-pane h4': { en: 'Skill Competencies', hi: 'कौशल योग्यता' },
        
        // Projects Sequence, Filters & Buttons
        '.projects-timeline-indicator h5': { en: '<i class="far fa-clock"></i> Project Creation Sequence', hi: '<i class="far fa-clock"></i> परियोजना निर्माण अनुक्रम' },
        '#project-filters .filter-btn:nth-child(1)': { en: 'All', hi: 'सभी' },
        '#project-filters .filter-btn:nth-child(2)': { en: 'Java', hi: 'जावा' },
        '#project-filters .filter-btn:nth-child(3)': { en: 'Web', hi: 'वेब' },
        '#project-filters .filter-btn:nth-child(4)': { en: 'JavaScript', hi: 'जावास्क्रिप्ट' },
        '#project-filters .filter-btn:nth-child(5)': { en: 'AI', hi: 'एआई' },
        '#project-filters .filter-btn:nth-child(6)': { en: 'Full Stack', hi: 'फुल स्टैक' },
        '#project-search': { en: 'Search projects by name, technologies, categories...', hi: 'परियोजनाओं को नाम, तकनीक, श्रेणियों द्वारा खोजें...' },
        
        '#projects-grid .project-card[data-id="p1"] h3': { en: 'Gamified Education Platform', hi: 'गेमीफाइड शिक्षा मंच' },
        '#projects-grid .project-card[data-id="p1"] .project-desc-short': { en: 'Created an offline-ready, gamified e-learning system with quizzes, badges, and bandwidth optimizations for remote students.', hi: 'दूरदराज के छात्रों के लिए क्विज़, बैज और बैंडविड्थ अनुकूलन के साथ एक ऑफ़लाइन-तैयार, गेमीफाइड ई-लर्निंग सिस्टम बनाया।' },
        '#projects-grid .project-card[data-id="p2"] h3': { en: 'NGO Transparency Platform', hi: 'एनजीओ डोनेशन मंच' },
        '#projects-grid .project-card[data-id="p2"] .project-desc-short': { en: 'Built a clear tracking portal demonstrating NGO fund allocations using Chart.js visualizations and real-time Firebase syncing.', hi: 'Chart.js विज़ुअलाइज़ेशन और रीयल-टाइम फायरबेस सिंकिंग का उपयोग करके एनजीओ फंड आवंटन को प्रदर्शित करने वाला एक स्पष्ट पोर्टल बनाया।' },
        '#projects-grid .project-card[data-id="p3"] h3': { en: 'AI Tutor For Remote India', hi: 'दूरदराज भारत के लिए एआई ट्यूटर' },
        '#projects-grid .project-card[data-id="p3"] .project-desc-short': { en: 'Intelligent learning assistant capable of processing documents offline, running localized index searches for remote students.', hi: 'दूरदराज के छात्रों के लिए दस्तावेज़ों को ऑफ़लाइन संसाधित करने, स्थानीयकृत अनुक्रमणिका खोज चलाने में सक्षम बुद्धिमान शिक्षण सहायक।' },
        '#projects-grid .project-card[data-id="p4"] h3': { en: 'Air Quality Prediction System', hi: 'वायु गुणवत्ता भविष्यवाणी प्रणाली' },
        '#projects-grid .project-card[data-id="p4"] .project-desc-short': { en: 'A regression analyzer mapping air particulate indices using historical pollution feeds to project predictive local maps.', hi: 'ऐतिहासिक प्रदूषण फीड का उपयोग करके वायु प्रदूषण सूचकांकों का मानचित्रण करने वाला एक प्रतिगमन विश्लेषक जो भविष्य कहनेवाला स्थानीय मानचित्रों को प्रोजेक्ट करता है।' },
        '#projects-grid .project-card[data-id="p5"] h3': { en: 'Local Job Hiring App', hi: 'स्थानीय नौकरी भर्ती ऐप' },
        '#projects-grid .project-card[data-id="p5"] .project-desc-short': { en: 'Designed and prototyped a matching engine connecting local skilled labor to dynamic job listings around Greater Noida.', hi: 'ग्रेटर नोएडा के आसपास व्यक्तिगत नौकरी लिस्टिंग से स्थानीय कुशल श्रमिकों को जोड़ने वाले एक मिलान इंजन को डिजाइन और प्रोटोटाइप किया।' },
        
        '#projects-grid .btn-project-details': { en: 'Details <i class="fas fa-info-circle"></i>', hi: 'विवरण <i class="fas fa-info-circle"></i>' },
        '.read-blog-trigger': { en: 'Read Full Article <i class="fas fa-arrow-right"></i>', hi: 'पूरा लेख पढ़ें <i class="fas fa-arrow-right"></i>' },
        
        // Experience Timelines
        '.timeline-container:nth-child(1) .timeline-heading': { en: '<i class="fas fa-briefcase"></i> Internships', hi: '<i class="fas fa-briefcase"></i> इंटर्नशिप' },
        '.timeline-container:nth-child(2) .timeline-heading': { en: '<i class="fas fa-graduation-cap"></i> Academics', hi: '<i class="fas fa-graduation-cap"></i> अकादमिक' },
        
        // Internship milestones
        '.timeline-container:nth-child(1) .timeline-branch-item:nth-child(1) h4': { en: 'Technova Internship', hi: 'टेक्नोवा इंटर्नशिप' },
        '.timeline-container:nth-child(1) .timeline-branch-item:nth-child(1) .role-subtitle': { en: 'Lead Developer Intern', hi: 'लीड डेवलपर इंटर्न' },
        '.timeline-container:nth-child(1) .timeline-branch-item:nth-child(1) p': { en: 'Engineered core user registration pathways, database access modules using JDBC, and UI state routing. Contributed to building portal dashboards and user controls.', hi: 'JDBC का उपयोग करके कोर यूजर रजिस्ट्रेशन पाथवे, डेटाबेस एक्सेस मॉड्यूल और UI स्टेट राउटिंग का निर्माण किया। पोर्टल डैशबोर्ड और यूजर कंट्रोल के निर्माण में योगदान दिया।' },
        '.timeline-container:nth-child(1) .timeline-branch-item:nth-child(2) h4': { en: 'Java Internship', hi: 'जावा इंटर्नशिप' },
        '.timeline-container:nth-child(1) .timeline-branch-item:nth-child(2) .role-subtitle': { en: 'Backend Systems Intern', hi: 'बैकएंड सिस्टम इंटर्न' },
        '.timeline-container:nth-child(1) .timeline-branch-item:nth-child(2) p': { en: 'Refined object structures in relational databases, optimized MySQL queries, wrote transaction safety layers, and created automated CLI data generators.', hi: 'रिलेशनल डेटाबेस में ऑब्जेक्ट संरचनाओं को परिष्कृत किया, MySQL प्रश्नों को अनुकूलित किया, लेनदेन सुरक्षा परतें लिखीं और स्वचालित CLI डेटा जनरेटर बनाए।' },
        '.timeline-container:nth-child(1) .timeline-branch-item:nth-child(3) h4': { en: 'Web Development Internship', hi: 'वेब डेवलपमेंट इंटर्नशिप' },
        '.timeline-container:nth-child(1) .timeline-branch-item:nth-child(3) .role-subtitle': { en: 'UI Assistant Intern', hi: 'यूआई सहायक इंटर्न' },
        '.timeline-container:nth-child(1) .timeline-branch-item:nth-child(3) p': { en: 'Learned responsive layout structures, asynchronous script integration, styling systems, and worked on optimizing landing page scripts for fast mobile performance.', hi: 'उत्तरदायी लेआउट संरचनाएं, एसिंक्रोनस स्क्रिप्ट एकीकरण, स्टाइलिंग सिस्टम सीखे और तेज मोबाइल प्रदर्शन के लिए लैंडिंग पेज स्क्रिप्ट को अनुकूलित करने पर काम किया।' },
        
        // Education milestones
        '.timeline-container:nth-child(2) .timeline-branch-item:nth-child(1) h4': { en: 'B.Tech (CS - Artificial Intelligence)', hi: 'बी.टेक (सीएस - आर्टिफिशियल इंटेलिजेंस)' },
        '.timeline-container:nth-child(2) .timeline-branch-item:nth-child(1) .role-subtitle': { en: 'Greater Noida Institute of Technology', hi: 'ग्रेटर नोएडा इंस्टीट्यूट ऑफ टेक्नोलॉजी' },
        '.timeline-container:nth-child(2) .timeline-branch-item:nth-child(1) p': { en: 'Focusing on Data Structures & Algorithms, Database Management Systems, Neural Networks, and corporate skill methodologies. Cumulative CGPA: <strong>7.9</strong>.', hi: 'डेटा संरचनाओं और एल्गोरिदम, डेटाबेस प्रबंधन प्रणाली, न्यूरल नेटवर्क और कॉर्पोरेट कौशल पद्धतियों पर ध्यान केंद्रित कर रहे हैं। संचयी सीजीपीए: <strong>7.9</strong>।' },
        '.timeline-container:nth-child(2) .timeline-branch-item:nth-child(2) h4': { en: '12th Grade (Senior Secondary)', hi: '12वीं कक्षा (वरिष्ठ माध्यमिक)' },
        '.timeline-container:nth-child(2) .timeline-branch-item:nth-child(2) .role-subtitle': { en: 'Lady Khatun Marium School, Navi Mumbai', hi: 'लेडी खातून मरियम स्कूल, नवी मुंबई' },
        '.timeline-container:nth-child(2) .timeline-branch-item:nth-child(2) p': { en: 'Studied Physics, Chemistry, Mathematics, and Computer Science fields, developing a foundational passion for software logic.', hi: 'भौतिकी, रसायन विज्ञान, गणित और कंप्यूटर विज्ञान क्षेत्रों का अध्ययन किया, जिससे सॉफ्टवेयर तर्क के लिए एक बुनियादी जुनून विकसित हुआ।' },
        '.timeline-container:nth-child(2) .timeline-branch-item:nth-child(3) h4': { en: '10th Grade (Secondary School)', hi: '10वीं कक्षा (माध्यमिक स्कूल)' },
        '.timeline-container:nth-child(2) .timeline-branch-item:nth-child(3) .role-subtitle': { en: 'Radcliffe School, Navi Mumbai', hi: 'रेडक्लिफ स्कूल, नवी मुंबई' },
        '.timeline-container:nth-child(2) .timeline-branch-item:nth-child(3) p': { en: 'Excelled in science and math curricula, participating in various science exhibitions and logical reasoning tests.', hi: 'विज्ञान और गणित के पाठ्यक्रम में उत्कृष्ट प्रदर्शन किया, विभिन्न विज्ञान प्रदर्शनियों और तार्किक तर्क परीक्षणों में भाग लिया।' },
        
        // Highlights & coding
        '.achievements-panel h3': { en: 'Highlights', hi: 'मुख्य उपलब्धियां' },
        '.achievements-panel .achievement-row:nth-child(2) h5': { en: 'Smart India Hackathon', hi: 'स्मार्ट इंडिया हैकाथॉन' },
        '.achievements-panel .achievement-row:nth-child(2) p': { en: 'Shortlisted entry for our comprehensive Gamified Education system tailored for rural connectivity gaps.', hi: 'ग्रामीण संपर्क अंतराल के लिए अनुकूलित हमारे व्यापक गेमीफाइड शिक्षा प्रणाली के लिए शॉर्टलिस्ट की गई प्रविष्टि।' },
        '.achievements-panel .achievement-row:nth-child(3) h5': { en: 'Webathon (Tech Club GNIOT)', hi: 'वेबाथॉन (टेक क्लब GNIOT)' },
        '.achievements-panel .achievement-row:nth-child(3) p': { en: 'Awarded in the **Top 15** projects globally for building the NGO Donation transparency tracker.', hi: 'एनजीओ डोनेशन पारदर्शिता ट्रैकर बनाने के लिए वैश्विक स्तर पर शीर्ष 15 परियोजनाओं में सम्मानित।' },
        '.achievements-panel .achievement-row:nth-child(4) h5': { en: 'Ms Classy Award', hi: 'सुश्री क्लासी पुरस्कार' },
        '.achievements-panel .achievement-row:nth-child(4) p': { en: 'Named the **Best Dressed Female** in GNIOT\'s student events (2025 and 2026 runs).', hi: 'GNIOT के छात्र कार्यक्रमों (2025 और 2026 रन) में सर्वश्रेष्ठ पोशाक वाली महिला नामित।' },
        '.coding-profiles-panel h3': { en: 'Coding Profiles', hi: 'कोडिंग प्रोफाइल' },
        
        // Certifications
        '.certifications-grid .cert-card[data-cert="si"] h4': { en: 'Smart India Hackathon', hi: 'स्मार्ट इंडिया हैकाथॉन' },
        '.certifications-grid .cert-card[data-cert="si"] .org': { en: 'Ministry of Education, India', hi: 'शिक्षा मंत्रालय, भारत' },
        '.certifications-grid .cert-card[data-cert="wa"] h4': { en: 'Webathon Finalist', hi: 'वेबाथॉन फाइनलिस्ट' },
        '.certifications-grid .cert-card[data-cert="wa"] .org': { en: 'Tech Club GNIOT', hi: 'टेक क्लब GNIOT' },
        '.certifications-grid .cert-card[data-cert="tc"] h4': { en: 'TechClasher Participation', hi: 'टेकक्लैशर भागीदारी' },
        '.certifications-grid .cert-card[data-cert="tc"] .org': { en: 'GNIOT Computer Society', hi: 'GNIOT कंप्यूटर सोसाइटी' },
        '.certifications-grid .cert-card[data-cert="cd"] h4': { en: 'CSDC Corporate Skills', hi: 'CSDC कॉर्पोरेट कौशल' },
        '.certifications-grid .cert-card[data-cert="cd"] .org': { en: 'Corporate Skill Development Centre', hi: 'कॉर्पोरेट कौशल विकास केंद्र' },
        
        // Gallery info
        '.gallery-grid .gallery-item-card:nth-child(1) .gallery-info h5': { en: 'Smart India Hackathon', hi: 'स्मार्ट इंडिया हैकाथॉन' },
        '.gallery-grid .gallery-item-card:nth-child(1) .gallery-info p': { en: 'Working on the offline synchronizer module.', hi: 'ऑफ़लाइन सिंक्रोनाइज़र मॉड्यूल पर काम करना।' },
        '.gallery-grid .gallery-item-card:nth-child(2) .gallery-info h5': { en: 'Webathon Award Presentation', hi: 'वेबाथॉन पुरस्कार प्रस्तुति' },
        '.gallery-grid .gallery-item-card:nth-child(2) .gallery-info p': { en: 'Receiving top 15 validation among 200+ students.', hi: '200+ छात्रों में शीर्ष 15 मान्यता प्राप्त करना।' },
        '.gallery-grid .gallery-item-card:nth-child(3) .gallery-info h5': { en: 'Corporate Workshop', hi: 'कॉर्पोरेट कार्यशाला' },
        '.gallery-grid .gallery-item-card:nth-child(3) .gallery-info p': { en: 'Discussing clean database abstractions and SQL tuning.', hi: 'स्वच्छ डेटाबेस एब्स्ट्रैक्शन और SQL ट्यूनिंग पर चर्चा करना।' },
        
        // Testimonial cards
        '.testimonial-card:nth-child(1) .quote': { en: '"Bhumi showed exceptional debugging capabilities during the SIH project structure phase. She organized the database schema efficiently and helped wrap the code into neat modules under pressure."', hi: '"भूमि ने SIH परियोजना संरचना चरण के दौरान असाधारण डिबगिंग क्षमताएं दिखाईं। उसने डेटाबेस स्कीमा को कुशलतापूर्वक व्यवस्थित किया और दबाव में कोड को साफ मॉड्यूल में लपेटने में मदद की।"' },
        '.testimonial-card:nth-child(1) .author-details h5': { en: 'Prof. K. Sharma', hi: 'प्रो. के. शर्मा' },
        '.testimonial-card:nth-child(1) .author-details span': { en: 'Hackathon Project Mentor, GNIOT', hi: 'हैकाथॉन प्रोजेक्ट मेंटर, GNIOT' },
        '.testimonial-card:nth-child(2) .quote': { en: '"Collaborating with Bhumi on the Job Hiring layout was seamless. She translates Figma diagrams to structured code easily and has a thorough grasp of CSS variables and flex coordinates."', hi: '"नौकरी भर्ती लेआउट पर भूमि के साथ सहयोग करना सहज था। वह फिग्मा आरेखों को आसानी से संरचित कोड में अनुवादित करती है और उसे सीएसएस चर और फ्लेक्स निर्देशांकों की पूरी समझ है।"' },
        '.testimonial-card:nth-child(2) .author-details h5': { en: 'Amit Verma', hi: 'अमित वर्मा' },
        '.testimonial-card:nth-child(2) .author-details span': { en: 'Classmate & TechClasher Partner', hi: 'सहपाठी और टेकक्लैशर पार्टनर' },
        
        // Blogs
        '.blogs-grid .blog-card[data-blog-id="b1"] h3': { en: 'Understanding Java OOP Paradigms', hi: 'जावा ओओपी प्रतिमानों को समझना' },
        '.blogs-grid .blog-card[data-blog-id="b1"] .blog-excerpt': { en: 'Deep-dive into inheritance, poly-routing, dynamic binding, and encapsulation structures with code templates...', hi: 'कोड टेम्प्लेट के साथ इनहेरिटेंस, पॉली-राउटिंग, डायनेमिक बाइंडिंग और एनकैप्सुलेशन संरचनाओं में गहरा गोता लगाएं...' },
        '.blogs-grid .blog-card[data-blog-id="b2"] h3': { en: 'Relational MySQL Basics', hi: 'रिलेशनल MySQL मूल बातें' },
        '.blogs-grid .blog-card[data-blog-id="b2"] .blog-excerpt': { en: 'Master foreign keys, joining clauses, query execution strategies, and JDBC driver synchronization mechanisms...', hi: 'विदेशी कुंजियों, क्लॉज़ में शामिल होने, क्वेरी निष्पादन रणनीतियों और जेडीबीसी ड्राइवर सिंक्रनाइज़ेशन तंत्र में महारत हासिल करें...' },
        '.blogs-grid .blog-card[data-blog-id="b3"] h3': { en: 'Efficient DOM Manipulation', hi: 'कुशल DOM हेरफेर' },
        '.blogs-grid .blog-card[data-blog-id="b3"] .blog-excerpt': { en: 'Exploring custom event loops, layout reflow, visual render pipelines, and writing responsive animations...', hi: 'कस्टम इवेंट लूप, लेआउट रिफ्लो, विज़ुअल रेंडर पाइपलाइनों की खोज और उत्तरदायी एनिमेशन लिखना...' },
        '.blogs-grid .blog-card[data-blog-id="b4"] h3': { en: 'Git Commands Cheat Sheet', hi: 'गिट कमांड्स चीट शीट' },
        '.blogs-grid .blog-card[data-blog-id="b4"] .blog-excerpt': { en: 'A developer\'s guide to git branch merging, tracking upstream remotes, rebasing pathways, and solving conflicts...', hi: 'गिट शाखा विलय, अपस्ट्रीम रिमोट की ट्रैकिंग, पाथवे रीबेस करना, और संघर्षों को हल करने के लिए एक डेवलपर गाइड...' },
        
        // Contact details
        '.contact-details-subcard .info-block:nth-child(1) p': { en: 'Greater Noida, Uttar Pradesh, India', hi: 'ग्रेटर नोएडा, उत्तर प्रदेश, भारत' },
        '.contact-details-subcard .info-block:nth-child(3) p a': { en: 'Connect on LinkedIn', hi: 'लिंक्डइन पर जुड़ें' },
        '.mock-map-card h5': { en: '📍 Greater Noida Region', hi: '📍 ग्रेटर नोएडा क्षेत्र' },
        
        // Contact form labels
        '.contact-form-card label[for="form-name"]': { en: 'Name', hi: 'नाम' },
        '.contact-form-card label[for="form-email"]': { en: 'Email', hi: 'ईमेल' },
        '.contact-form-card label[for="form-subject"]': { en: 'Subject', hi: 'विषय' },
        '.contact-form-card label[for="form-message"]': { en: 'Message', hi: 'संदेश' },
        '#btn-submit-text': { en: 'Send Message', hi: 'संदेश भेजें' }
    };

    langOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            const lang = opt.getAttribute('data-lang');
            langOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            currentLangLabel.textContent = lang.toUpperCase();
            
            // Translate data-i18n elements
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (translations[lang] && translations[lang][key]) {
                    el.textContent = translations[lang][key];
                }
            });
            
            function hasHTMLMarkup(value) {
                return /<[^>]+>/.test(value);
            }

            // Translate by Selector rules
            for (const selector in selectorTranslations) {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    const val = selectorTranslations[selector][lang];
                    if (val) {
                        if (selector === '#project-search') {
                            el.placeholder = val;
                        } else if (hasHTMLMarkup(val)) {
                            el.innerHTML = val;
                        } else {
                            el.textContent = val;
                        }
                    }
                });
            }
            
            // Update typing effect words dynamically
            if (lang === 'hi') {
                words = ["जावा फुल स्टैक डेवलपर", "आर्टिफिशियल इंटेलिजेंस उत्साही", "सॉफ्टवेयर इंजीनियरिंग छात्रा"];
            } else {
                words = ["Java Full Stack Developer", "AI Enthusiast", "Software Engineering Student"];
            }
            
            langMenu.classList.remove('active');
        });
    });

    // Mobile Navbar Hamburg click handler
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Scroll active navigation highlight
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 250) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
});
