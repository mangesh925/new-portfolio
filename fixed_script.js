
function init() {
    gsap.registerPlugin(ScrollTrigger);

    // Mobile detection
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth < 1024;

    // Configure ScrollTrigger for mobile
    if (isMobile) {
        ScrollTrigger.normalizeScroll(true);
        ScrollTrigger.config({ 
            ignoreMobileResize: true,
            autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
        });
    }

    // Locomotive Scroll with mobile support
    const locoScroll = new LocomotiveScroll({
        el: document.querySelector(".main"),
        smooth: true,
        smoothMobile: true,  // Enable smooth scrolling on mobile
        tablet: {
            breakpoint: 0,
            smooth: true
        },
        smartphone: {
            smooth: true
        },
        getDirection: true,
        getSpeed: true,
        class: 'is-reveal',
        initClass: 'has-scroll-init',
        scrollingClass: 'has-scroll-scrolling',
        draggingClass: 'has-scroll-dragging',
        smoothClass: 'has-scroll-smooth',
        scrollbarClass: 'c-scrollbar'
    });

    locoScroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(".main", {
        scrollTop(value) {
            return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: document.querySelector(".main").style.transform ? "transform" : "fixed"
    });

    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();

    // Viewport height fix for mobile
    function updateVH() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    window.addEventListener('resize', updateVH);
    window.addEventListener('orientationchange', updateVH);
    updateVH();

    // Refresh ScrollTrigger on orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            ScrollTrigger.refresh();
            locoScroll.update();
        }, 500);
    });
}

init();

// Optimized cursor for desktop only
var crsr = document.querySelector(".cursor");
var main = document.querySelector(".main");

if (window.innerWidth >= 768) {
    document.addEventListener("mousemove", function(dets){
        crsr.style.left = dets.x + 20 + "px";
        crsr.style.top = dets.y + 20 + "px";
    });
}

// Initial animations - lighter on mobile
const isMobileDevice = window.innerWidth < 768;
if (!isMobileDevice) {
    gsap.from(".page1 h1,.page1 h2, .page1 p", {
        y: 10,
        rotate: 10,
        opacity: 0,
        delay: 0.3,
        duration: 0.7
    });
} else {
    // Simpler animation for mobile
    gsap.from(".page1 h1,.page1 h2, .page1 p", {
        y: 5,
        opacity: 0,
        delay: 0.2,
        duration: 0.5
    });
}

// Desktop-only complex animations
if (!isMobileDevice) {
    var tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".page1 h1",
            scroller: ".main",
            start: "top 27%",
            end: "top 0",
            scrub: 3
        }
    });

    tl.to(".page1 h1", {
        x: -100,
    }, "anim");

    tl.to(".page1 h2", {
        x: 100
    }, "anim");

    tl.to(".page1 #image", {
        width: "90%"
    }, "anim");
}

// Background color changes - works on all devices
var tl2 = gsap.timeline({
    scrollTrigger: {
        trigger: ".page1 h1",
        scroller: ".main",
        start: "top -115%",
        end: "top -120%",
        scrub: isMobileDevice ? 1 : 3
    }
});

tl2.to(".main", {
    backgroundColor: "#fff",
});

var tl3 = gsap.timeline({
    scrollTrigger: {
        trigger: ".page3 h1",
        scroller: ".main",
        start: "top 80%",
        end: "top 60%",
        scrub: isMobileDevice ? 1 : 3
    }
});

tl3.to(".main",{
    backgroundColor:"#0F0D0D"
});

// Box hover effects - desktop only
var boxes = document.querySelectorAll(".box");
if (window.innerWidth >= 768) {
    boxes.forEach(function(elem){
        elem.addEventListener("mouseenter",function(){
            var att = elem.getAttribute("data-image");
            crsr.style.width = "470px";
            crsr.style.height = "370px";
            crsr.style.borderRadius = "0";
            crsr.style.backgroundImage = `url(${att})`;
        });
        elem.addEventListener("mouseleave",function(){
            elem.style.backgroundColor = "transparent";
            crsr.style.width = "20px";
            crsr.style.height = "20px";
            crsr.style.borderRadius = "50%";
            crsr.style.backgroundImage = `none`;
        });
    });
}

// Navigation hover effects - desktop only
var h4 = document.querySelectorAll("#nav h4");
var purple = document.querySelector("#purple");
if (window.innerWidth >= 768) {
    h4.forEach(function(elem){
        elem.addEventListener("mouseenter",function(){
            purple.style.display = "block";   
            purple.style.opacity = "1";
        });
        elem.addEventListener("mouseleave",function(){
            purple.style.display = "none";   
            purple.style.opacity = "0";
        });
    });
}

// Performance optimization for mobile
if (isMobileDevice) {
    // Reduce animation frequency on mobile
    ScrollTrigger.config({
        syncInterval: 150, // Reduce from default 120
    });

    // Add passive event listeners for better performance
    document.addEventListener('touchstart', function(){}, {passive: true});
    document.addEventListener('touchmove', function(){}, {passive: true});
}

// Handle resize events
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
        if (window.locoScroll) {
            window.locoScroll.update();
        }
    }, 250);
});
