import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ChordDiagram from './ChordDiagram';
import "./Explorer.css";
import WordSearch from "./WordSearch";
import Locations from "./visualisations/Locations";

function Explorer() {
    const { series } = useParams();
    const seriesColours = [
        "#0C662D",
        "#005E8D",
        "#A9251E",
        "#882373",
        "#F07122",
        "#29AB87",
        "#5147BB",
        "#AC0C59",
        "#150B41"
    ];

    // useEffect(() => {
    //     gsap.registerPlugin(ScrollTrigger);

    //     gsap.utils.toArray(".visualisation").forEach((visualisation, i) => {
    //         ScrollTrigger.create({
    //             trigger: visualisation,
    //             start: "top top",
    //             pin: true,
    //             pinSpacing: false,
    //         });
    //     });

    //     ScrollTrigger.create({
    //         snap: 1 / (gsap.utils.toArray(".visualisation").length - 1),
    //       });
    // }, []);

    return (
        <div id="explorer-container">
            <section className="visualisation" id="chord" style={{ background: `radial-gradient(#fff, 85%, ${seriesColours[series - 1]})` }}>
                <ChordDiagram />
            </section>

            <section className="visualisation" id="words" style={{ background: `radial-gradient(#fff, 85%, ${seriesColours[series - 1]})` }}>
                <WordSearch />
            </section>

            {/* <section className="visualisation" id="locations" style={{ background: `radial-gradient(#fff, 85%, ${seriesColours[series - 1]})` }}>
                <Locations />
            </section> */}
        </div>
    );
}

export default Explorer;
