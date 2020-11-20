import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import "./Welcome.css";

function Welcome() {

    useEffect(() => {
        const tl = gsap.timeline();

        // rotate the cube by 450 deg
        tl.to(document.querySelector(".loader__cube"), {
            duration: 1.5,
            ease: "power2.inOut",
            rotation: "+= 450",
            transformOrigin: "center center"
        });

        // shrink the line (height = 0)
        tl.to(document.querySelector(".loader__line"), {
            data: { name: "Line (shrink)" },
            duration: 1.5,
            ease: "none",
            height: 0
        }, 0);

        // hide the loader after a delay of 1.4 seconds
        tl.to(document.querySelector(".loader"), {
            data: { name: "Loader (hide)" },
            duration: 1,
            opacity: 0
        }, 1.4);
        
        tl.to(document.querySelector(".loader"), {
            data: { name: "Loader (hide)" },
            duration: 1,
            zIndex: -1
        }, 3);

        // animate vertical line separators
        document.querySelectorAll(".section__line").forEach((line) => {
            const animTime = 0.1 * (Math.floor(Math.random() * (10 - 4) + 4));
            
            tl.to(line, animTime, {
                ease: "power1.in",
                top: 0
            }, 1);
        });

        // section titles
        document.querySelectorAll(".section__title-overlay").forEach((title) => {  
            tl.to(title, 1, {
              ease: "power1.in",
              left: "100%"
            }, 2);
        });

        // section image overlays
        document.querySelectorAll(".section__overlay").forEach((section) => {  
            tl.to(section, 1, {
              ease: "power1.inOut",
              left: "100%"
            }, 2.5);
        });
    }, []);

    return (
        <div className="welcome-body">
            <div className="wrapper">
                <div className="loader" id="js-loader">
                    <div className="loader__cube" id="js-loader-cube"></div>
                    <div className="loader__line" id="js-loader-line"></div>
                </div>

                <div id="sections" className="sections">

                    <div className="section section--first">
                        <div className="section__line"></div>
                        <div className="section__img section__img--first"></div>
                        <div className="section__overlay"></div>
                        <h2 className="section__title">Series One</h2>
                        <div className="section__title-overlay"></div>
                    </div>

                    <div className="section section--second">
                        <div className="section__line"></div>
                        <div className="section__img section__img--second"></div>
                        <div className="section__overlay"></div>
                        <h2 className="section__title">Series Two</h2>
                        <div className="section__title-overlay"></div>
                    </div>

                    <div className="section section--third">
                        <div className="section__line"></div>
                        <div className="section__img section__img--third"></div>
                        <div className="section__overlay"></div>
                        <h2 className="section__title">Series Two</h2>
                        <div className="section__title-overlay"></div>
                    </div>

                    <div className="section section--second">
                        <div className="section__line"></div>
                        <div className="section__img section__img--second"></div>
                        <div className="section__overlay"></div>
                        <h2 className="section__title">Series Two</h2>
                        <div className="section__title-overlay"></div>
                    </div>

                    <div className="section section--second">
                        <div className="section__line"></div>
                        <div className="section__img section__img--second"></div>
                        <div className="section__overlay"></div>
                        <h2 className="section__title">Series Two</h2>
                        <div className="section__title-overlay"></div>
                    </div>

                    <div className="section section--second">
                        <div className="section__line"></div>
                        <div className="section__img section__img--second"></div>
                        <div className="section__overlay"></div>
                        <h2 className="section__title">Series Two</h2>
                        <div className="section__title-overlay"></div>
                    </div>

                    <div className="section section--second">
                        <div className="section__line"></div>
                        <div className="section__img section__img--second"></div>
                        <div className="section__overlay"></div>
                        <h2 className="section__title">Series Two</h2>
                        <div className="section__title-overlay"></div>
                    </div>

                    <div className="section section--second">
                        <div className="section__line"></div>
                        <div className="section__img section__img--second"></div>
                        <div className="section__overlay"></div>
                        <h2 className="section__title">Series Two</h2>
                        <div className="section__title-overlay"></div>
                    </div>

                    <div className="section section--second">
                        <div className="section__line"></div>
                        <div className="section__img section__img--second"></div>
                        <div className="section__overlay"></div>
                        <h2 className="section__title">Series Two</h2>
                        <div className="section__title-overlay"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Welcome;