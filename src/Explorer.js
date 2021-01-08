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
    const [visualisation, setVisualisation] = useState(<ChordDiagram />);
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

    const getVisualisation = (idx) => {
        let component;
        switch(idx) {
            case 0:
                component = <ChordDiagram />
                break;

            case 1:
                component = <WordSearch />
                break;

            case 2:
                component = <Locations />
                break;

            case 3:
                component = <Timeline />
                break;

            case 4:
                component = <Sentences />
                break;

            case 5:
                component = <Sentiment />
                break;

            case 6:
                component = <Stats />
                break;

            default:
                component = null;
        }

        setVisualisation(component);
    }

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
            offset: 0.1,
            debug: true,
        })
        .onStepEnter((res) => {
            step.classed("is-active", (d, i) => i === res.index);
            getVisualisation(res.index);
        });

        const handleResize = () => {
            // const stepHeight = Math.floor(window.innerHeight * 0.95);
            // step.style("height", stepHeight + "px");

            const figureHeight = window.innerHeight;
            // const figureMarginTop = (window.innerHeight - figureHeight) / 2;
            const figureMarginTop = 0;

            figure
                .style("height", figureHeight + "px")
                .style("top", figureMarginTop + "px");

            scroller.resize();
        };

        handleResize();
        window.addEventListener("resize", handleResize);
    }, []);

    return (
        <main>
            <section id="scrolly">
                <article>
                    <div className="step" data-step="1">
                        <h1>Conversations</h1>
                        <p>This chord diagram visualises who spoke with whom.</p>
                        <div id="info-panel">
                            <div id="info-avatar"></div>
                            <p id="info-text">Hover over the characters for more info!</p>
                            <h3 id="info-name"></h3>
                            <p id="info-total-lines"></p>
                            <h4 id="info-spoke-to-heading">Spoke To</h4>
                            <p id="info-spoke-to"></p>
                        </div>
                    </div>

                    <div className="step" data-step="2">
                        <h1>Words</h1>
                        <p>This chord diagram visualises who spoke with whom.</p>
                        <p>This chord diagram visualises who spoke with whom.</p>
                        <p>This chord diagram visualises who spoke with whom.</p>
                    </div>

                    <div className="step" data-step="3">
                        <h1>Locations</h1>
                        <p>This chord diagram visualises who spoke with whom.</p>
                        <p>This chord diagram visualises who spoke with whom.</p>
                        <p>This chord diagram visualises who spoke with whom.</p>
                    </div>

                    <div className="step" data-step="4">
                        <h1>Timeline</h1>
                        <p>This chord diagram visualises who spoke with whom.</p>
                        <p>This chord diagram visualises who spoke with whom.</p>
                        <p>This chord diagram visualises who spoke with whom.</p>
                    </div>

                    <div className="step" data-step="5">
                        <h1>Sentences</h1>
                        <p>This chord diagram visualises who spoke with whom.</p>
                        <p>This chord diagram visualises who spoke with whom.</p>
                        <p>This chord diagram visualises who spoke with whom.</p>
                    </div>

                    <div className="step" data-step="6">
                        <h1>Sentiment</h1>
                        <p>This chord diagram visualises who spoke with whom.</p>
                        <p>This chord diagram visualises who spoke with whom.</p>
                        <p>This chord diagram visualises who spoke with whom.</p>
                    </div>

                    <div className="step" data-step="7">
                        <h1>Stats</h1>
                        <p>This chord diagram visualises who spoke with whom.</p>
                        <p>This chord diagram visualises who spoke with whom.</p>
                        <p>This chord diagram visualises who spoke with whom.</p>
                        <p>This chord diagram visualises who spoke with whom.</p>
                    </div>
                </article>

                <figure>
                    {visualisation}
                </figure>
            </section>
        </main>
    );
}

export default Explorer;
