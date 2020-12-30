import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ChordDiagram from "./visualisations/chord/ChordDiagram";
import "./Explorer.css";
import WordSearch from "./visualisations/words/WordSearch";
import Locations from "./visualisations/locations/Locations";
import Timeline from "./visualisations/timeline/Timeline";
import Sentences from "./visualisations/sentences/Sentences";
import Sentiment from "./visualisations/sentiment/Sentiment";

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
            <section className="visualisation" id="chord">
                <ChordDiagram />
            </section>

            <section className="visualisation" id="words">
                <WordSearch />
            </section>

            {/* style={{ background: `radial-gradient(#fff, 85%, ${seriesColours[series - 1]})` }} */}
            <section className="visualisation" id="locations">
                <Locations />
            </section>

            <section className="visualisation" id="words">
                <Timeline />
            </section>

            <section className="visualisation" id="words">
                <Sentences />
            </section>

            <section className="visualisation" id="sentiment">
                <Sentiment />
            </section>
        </div>
    );
}

export default Explorer;
