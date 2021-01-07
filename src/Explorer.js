import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as d3 from "d3";
// import gsap from "gsap";
// import ScrollTrigger from "gsap/ScrollTrigger";
import "intersection-observer";
import scrollama from "scrollama";
import ChordDiagram from "./visualisations/chord/ChordDiagram";
import WordSearch from "./visualisations/words/WordSearch";
import Locations from "./visualisations/locations/Locations";
import Timeline from "./visualisations/timeline/Timeline";
import Sentences from "./visualisations/sentences/Sentences";
import Sentiment from "./visualisations/sentiment/Sentiment";
import Stats from "./visualisations/stats/Stats";
import "./Explorer.css";

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

    useEffect(() => {
        const main = d3.select("main");
        const scrolly = main.select("#scrolly");
        const figure = scrolly.select("figure");
        const article = scrolly.select("article");
        const step = article.selectAll(".step");

        // initialise the scrollama
        const scroller = scrollama();

        scroller.setup({
            step: "#scrolly article .step",
            offset: 0.3,    // sets the trigger to be half way down screen
            debug: true,
        })
        .onStepEnter((res) => {
            step.classed("is-active", (d, i) => i === res.index);
            figure.select("p").text(res.index + 1);
        });

        window.addEventListener("resize", () => {
            const stepHeight = Math.floor(window.innerHeight * 0.75);
            step.style("height", stepHeight + "px");

            const figureHeight = window.innerHeight / 2;
            const figureMarginTop = (window.innerHeight - figureHeight) / 2;

            figure
                .style("height", figureHeight + "px")
                .style("top", figureMarginTop + "px");

            scroller.resize();
        });

    }, []);

    return (
        <main>
            <section id="scrolly">
                <article>
                    <div className="step" data-step="1">
                        <p>STEP 1</p>
                    </div>

                    <div className="step" data-step="2">
                        <p>STEP 2</p>
                    </div>

                    <div className="step" data-step="3">
                        <p>STEP 3</p>
                    </div>

                    <div className="step" data-step="4">
                        <p>STEP 4</p>
                    </div>
                </article>

                <figure>
                    <p>0</p>
                </figure>
            </section>
        </main>
    );
}

export default Explorer;
