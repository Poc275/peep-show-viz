import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import * as PIXI from "pixi.js";
import { BulgePinchFilter } from "pixi-filters";
import Logo from "./img/bg-texture.png";

function SplashLogo(props) {
    let [bulgeFilter, setBulgeFilter] = useState(null);

    useEffect(() => {
        const app = new PIXI.Application({
            width: 1500,
            height: 844,
            backgroundColor: 0x0B2816,
        });
        // swap Pixi.js timer for GSAP timer
        app.ticker.stop();
        gsap.ticker.add(() => {
            app.ticker.update();
        });

        // add Pixi.js canvas to document
        document.getElementById("splash-logo").appendChild(app.view);

        async function fetchTexture() {
            const texture = await PIXI.Texture.fromURL(Logo);
            const logo = new PIXI.Sprite(texture);
            logo.x = -200;
            logo.y = 50;

            // bulge filter
            const filter = new BulgePinchFilter({
                center: [0.5, 0.5],
                radius: 200,
                strength: 0
            });
            logo.filters = [filter];
            setBulgeFilter(filter);

            // add sprite to stage
            app.stage.addChild(logo);
        }
        fetchTexture();
    }, []);

    // animate bulge effect hook
    useEffect(() => {
        if(props.bulge) {
            const tl = gsap.timeline();
            tl.to(bulgeFilter, {
                duration: 1,
                strength: '+= 1',
                repeat: 1,
                yoyo: true
            });
        }
    }, [bulgeFilter, props.bulge]);

    return <div id="splash-logo"></div>
}

export default SplashLogo;