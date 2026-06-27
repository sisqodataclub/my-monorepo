// resumesite/static/resumesite/script.js (Definitive Code with Conditional Execution)

// NOTE: This script relies on GSAP and LocomotiveScroll libraries being loaded in react_demo.html.

function locomotiveAnimation() {
    gsap.registerPlugin(ScrollTrigger);

    const locoScroll = new LocomotiveScroll({
        el: document.querySelector("#main"),
        smooth: true,
        tablet: { smooth: true },
        smartphone: { smooth: true }
    });

    locoScroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy("#main", {
        scrollTop(value) {
            return arguments.length
                ? locoScroll.scrollTo(value, 0, 0)
                : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight
            };
        }
    });

    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();
}

function loadingAnimation() {
    var tl = gsap.timeline();
    
    // Animate the main content scale
    tl.from("#page1", {
        opacity: 0,
        duration: 0.2,
        delay: 0.2
    });
    tl.from("#page1", {
        transform: "scaleX(0.7) scaleY(0.2) translateY(80%)",
        borderRadius: "150px",
        duration: 2,
        ease: "expo.out"
    });
    
    // Animate the navigation bar
    tl.from("nav", {
        opacity: 0,
        delay: -0.2
    });
    
    // Animate the text content (H1s, P, Divs) inside page1
    tl.from("#page1 h1, #page1 p, #page1-something h4", {
        opacity: 0,
        duration: 0.5,
        stagger: 0.2
    });
}

function navAnimation() {
    var nav = document.querySelector("nav");

    // Mouse Enter animation (Dropdown opens)
    nav.addEventListener("mouseenter", function () {
        let tl = gsap.timeline();

        tl.to("#nav-bottom", {
            height: "21vh",
            duration: 0.5
        });
        
        tl.to(".nav-part2 h5", {
            display: "block",
            duration: 0.1
        });
        
        tl.to(".nav-part2 h5 span", {
            y: 0,
            stagger: {
                amount: 0.5
            }
        });
    });
    
    // Mouse Leave animation (Dropdown closes)
    nav.addEventListener("mouseleave", function () {
        let tl = gsap.timeline();
        
        tl.to(".nav-part2 h5 span", {
            y: 25,
            stagger: {
                amount: 0.2
            }
        });
        
        tl.to(".nav-part2 h5", {
            display: "none",
            duration: 0.1
        });
        
        tl.to("#nav-bottom", {
            height: 0,
            duration: 0.2
        });
    });
}

function page2Animation() {
    var rightElems = document.querySelectorAll(".right-elem")

    rightElems.forEach(function (elem) {
        elem.addEventListener("mouseenter", function () {
            gsap.to(elem.childNodes[3], {
                opacity: 1,
                scale: 1
            })
        })
        elem.addEventListener("mouseleave", function () {
            gsap.to(elem.childNodes[3], {
                opacity: 0,
                scale: 0
            })
        })
        elem.addEventListener("mousemove", function (dets) {
            gsap.to(elem.childNodes[3], {
                x: dets.x - elem.getBoundingClientRect().x - 90,
                y: dets.y - elem.getBoundingClientRect().y - 215
            })
        })
    })
}

function page3VideoAnimation() {
    // --- 1. Main Theater Video Logic ---
    var page3Center = document.querySelector(".page3-center");
    var video = document.querySelector("#page3 video");

    // CRITICAL FIX: Check if elements exist before attaching listeners
    if (page3Center && video) {
        // Play video and scale up on play button click
        page3Center.addEventListener("click", function () {
            video.play();
            gsap.to(video, {
                transform: "scaleX(1) scaleY(1)",
                opacity: 1,
                borderRadius: 0
            });
        });
        

        // Pause video and scale down on video click
        video.addEventListener("click", function () {
            video.pause();
            gsap.to(video, {
                transform: "scaleX(0.7) scaleY(0)",
                opacity: 0,
                borderRadius: "30px"
            });
        });
        
    }


    // --- 2. Hover-to-Play Project Sections Logic (Page 4) ---
    var sections = document.querySelectorAll(".sec-right");

    sections.forEach(function (elem) {
        // Find the specific video element directly within the current section
        var hoverVideo = elem.querySelector('video'); 
        
        if (hoverVideo) { // Check if the video element was found
            // Play video on mouse enter
            elem.addEventListener("mouseenter", function () {
                hoverVideo.style.opacity = 1;
                hoverVideo.play();
            });
            
            // Pause/Reset video on mouse leave
            elem.addEventListener("mouseleave", function () {
                hoverVideo.style.opacity = 0;
                hoverVideo.load(); // Resets video to the start frame
            });
        }
    });
}

function page6Animations() {
    gsap.from("#btm6-part2 h4", {
        x: 0,
        duration: 1,
        scrollTrigger: {
            trigger: "#btm6-part2",
            scroller: "#main",
            start: "top 80%",
            end: "top 10%",
            scrub: true
        }
    })
}


// =========================================================
// 🛑 FINAL CONDITIONAL EXECUTION BLOCK (CRITICAL FIX) 🛑
// =========================================================

function initializeAnimations() {
    const reactRoot = document.querySelector("#react-root");
    
    // Check 1: Has React mounted any content yet? (Wait for content)
    if (!reactRoot || reactRoot.childElementCount === 0) {
        return setTimeout(initializeAnimations, 100);
    }
    
    // Check 2: Are we viewing the authenticated Dashboard? 
    // We check if the dashboard-container class (rendered by the Dashboard component) exists.
    const isDashboard = document.querySelector('.dashboard-container') !== null;
    
    // --- 1. Run Essential Setup (Always runs on all pages) ---
    locomotiveAnimation();
    navAnimation();
    
    // --- 2. Run Dramatic Entrance (ONLY for Landing Page / Logged Out) ---
    if (!isDashboard) {
        loadingAnimation();
    }
    
    // --- 3. Run Optional Page Animations ---
    // These functions must be called to attach their scroll/hover listeners
    // They are wrapped in a check to see if the element exists in the HTML
    if (document.querySelector("#page2")) {
        page2Animation();
    }
    if (document.querySelector("#page3")) { // Check for a general page3 element
        page3VideoAnimation();
    }
    if (document.querySelector("#page6")) { // Check for a general page6 element
        page6Animations();
    }
}

// Start the animation process shortly after the DOM loads
// This ensures the main animation loop starts immediately, waiting only for React.
setTimeout(initializeAnimations, 50);