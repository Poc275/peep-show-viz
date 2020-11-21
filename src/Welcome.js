import React, { useEffect } from "react";
import { gsap } from "gsap";
import { useHistory, useLocation } from "react-router-dom";
import "./Welcome.css";

function Welcome() {
    const history = useHistory();
    let location = useLocation();

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

    const goToSeries = (series) => {
        // console.log(series);
        // const tl = gsap.timeline({
        //     onComplete: () => { history.push(`${series}/explore`); }
        // });

        // document.querySelectorAll(".section").forEach((section) => {
        //     const sectionHeight = section.offsetHeight;
        //     const animDelay = ((Math.floor(Math.random() * (10 - 4) + 4)) * 0.1);

        //     tl.to(section, 1, { ease: "power2.easeInOut", top: `-=${sectionHeight}` }, animDelay);
        //     tl.to(section, 0.5, { opacity: 0 }, animDelay + 0.1);
        // });

        history.push(`${series}/explore`);
    }

    return (
        <div className="welcome-body">
            <div className="wrapper">
                <div className="loader" id="js-loader">
                    <div className="loader__cube" id="js-loader-cube"></div>
                    <div className="loader__line" id="js-loader-line"></div>
                </div>

                <div id="sections" className="sections">

                    <div className="section section--first" onClick={() => goToSeries(1)}>
                        <div className="section__line"></div>
                        <div className="section__img section__img--first"></div>
                        <div className="section__overlay"></div>
                        <h2 className="section__title">1</h2>
                        <div className="section__title-overlay"></div>
                    </div>

                    <div className="section section--second" onClick={() => goToSeries(2)}>
                        <div className="section__line"></div>
                        <div className="section__img section__img--second"></div>
                        <div className="section__overlay"></div>
                        <h2 className="section__title">2</h2>
                        <div className="section__title-overlay"></div>
                    </div>

                    <div className="section section--third" onClick={() => goToSeries(3)}>
                        <div className="section__line"></div>
                        <div className="section__img section__img--third"></div>
                        <div className="section__overlay"></div>
                        <h2 className="section__title">3</h2>
                        <div className="section__title-overlay"></div>
                    </div>

                    <div className="section section--fourth" onClick={() => goToSeries(4)}>
                        <div className="section__line"></div>
                        <div className="section__img section__img--fourth"></div>
                        <div className="section__overlay"></div>
                        <h2 className="section__title">4</h2>
                        <div className="section__title-overlay"></div>
                    </div>

                    <div className="section section--fifth" onClick={() => goToSeries(5)}>
                        <div className="section__line"></div>
                        <div className="section__img section__img--fifth"></div>
                        <div className="section__overlay"></div>
                        <h2 className="section__title">5</h2>
                        <div className="section__title-overlay"></div>
                    </div>

                    <div className="section section--sixth" onClick={() => goToSeries(6)}>
                        <div className="section__line"></div>
                        <div className="section__img section__img--sixth"></div>
                        <div className="section__overlay"></div>
                        <h2 className="section__title">6</h2>
                        <div className="section__title-overlay"></div>
                    </div>

                    <div className="section section--seventh" onClick={() => goToSeries(7)}>
                        <div className="section__line"></div>
                        <div className="section__img section__img--seventh"></div>
                        <div className="section__overlay"></div>
                        <h2 className="section__title">7</h2>
                        <div className="section__title-overlay"></div>
                    </div>

                    <div className="section section--eighth" onClick={() => goToSeries(8)}>
                        <div className="section__line"></div>
                        <div className="section__img section__img--eighth"></div>
                        <div className="section__overlay"></div>
                        <h2 className="section__title">8</h2>
                        <div className="section__title-overlay"></div>
                    </div>

                    <div className="section section--ninth" onClick={() => goToSeries(9)}>
                        <div className="section__line"></div>
                        <div className="section__img section__img--ninth"></div>
                        <div className="section__overlay"></div>
                        <h2 className="section__title">9</h2>
                        <div className="section__title-overlay"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Welcome;