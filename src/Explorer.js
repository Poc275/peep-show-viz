import React, { useEffect, useState, useRef } from "react";
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
import ReferenceData from "./reference/ReferenceData";
import "./Explorer.css";

function Explorer() {
    const [visualisation, setVisualisation] = useState(null);
    const [dataStep, setDataStep] = useState(0);
    const [showVisual, setShowVisual] = useState("none");
    const [seriesSummary, setSeriesSummary] = useState("");
    const [chordTutorial, setChordTutorial] = useState("");
    const [chordAnnotations, setChordAnnotations] = useState("");
    const { series } = useParams();

    // series information hook
    useEffect(() => {
        const referenceData = new ReferenceData();
        setSeriesSummary(referenceData.seriesSummaries[series - 1]);
        setChordTutorial(referenceData.chordTutorial[series - 1]);
        setChordAnnotations(referenceData.chordAnnotations[series - 1]);
    }, [series]);

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
            offset: 0.3,
            // debug: true,
        })
        .onStepEnter((res) => {
            const scrolledDataStep = res.element.dataset.step;
            const trigger = res.element.dataset.trigger;
            step.classed("is-active", (d, i) => i === res.index);

            if(scrolledDataStep !== dataStep) {
                // change displayed visualisation
                setDataStep(res.element.dataset.step);
                getVisualisation(res.element.dataset.step - 1);
            }

            if(trigger === "chord-tut-1") {
                d3.select("#chord-viz")
                    .selectAll("path.chord")
                    .style("stroke-opacity", 0)
                    .style("fill-opacity", 0);

                d3.select("#chord-viz")
                    .selectAll("path.arc")
                    .style("stroke-opacity", 0)
                    .style("fill-opacity", 0);

                d3.select("#chord-viz")
                    .selectAll(".avatar")
                    .style("stroke-opacity", 0)
                    .style("fill-opacity", 0)
                    .style("opacity", 0);

                d3.select("#chord-viz")
                    .selectAll(".axis")
                    .style("stroke-opacity", 0)
                    .style("fill-opacity", 0)
                    .style("opacity", 0);

                setShowVisual("block");
            }

            if(trigger === "chord-tut-2") {
                d3.select("#chord-viz")
                    .select("path.arc")
                    .transition()
                    .duration(1000)
                    .style("stroke-opacity", 0.8)
                    .style("fill-opacity", 0.8);

                d3.select("#chord-viz")
                    .select(".axis")
                    .transition()
                    .duration(1000)
                    .style("stroke-opacity", 0.8)
                    .style("fill-opacity", 0.8)
                    .style("opacity", 0.8);

                d3.select("#chord-viz")
                    .select(".avatar")
                    .transition()
                    .duration(1000)
                    .style("stroke-opacity", 1)
                    .style("fill-opacity", 1)
                    .style("opacity", 1);
            }

            if(trigger === "chord-tut-3") {
                let selectId = "1";
                if(series === "3") {
                    // Mark is the third speaker in this series
                    selectId = "2";
                }
                else if(series === "6") {
                    // Jez is the third speaker in this series
                    selectId = "2";
                }

                d3.select("#chord-viz")
                    .select("path.chord")
                    .transition()
                    .duration(1000)
                    .style("stroke-opacity", 0.8)
                    .style("fill-opacity", 0.8);

                d3.select("#chord-viz")
                    .select(`#arc-${selectId}`)
                    .transition()
                    .duration(1000)
                    .style("stroke-opacity", 0.8)
                    .style("fill-opacity", 0.8);

                d3.select("#chord-viz")
                    .select(`#axis-${selectId}`)
                    .transition()
                    .duration(1000)
                    .style("stroke-opacity", 0.8)
                    .style("fill-opacity", 0.8)
                    .style("opacity", 0.8);

                d3.select("#chord-viz")
                    .select(`#avatar-${selectId}`)
                    .transition()
                    .duration(1000)
                    .style("stroke-opacity", 1)
                    .style("fill-opacity", 1)
                    .style("opacity", 1);

                if(series === "4") {
                    // select Jez as he's the third person in this series
                    d3.select("#chord-viz")
                        .select("#arc-2")
                        .transition()
                        .duration(1000)
                        .style("stroke-opacity", 0.8)
                        .style("fill-opacity", 0.8);

                    d3.select("#chord-viz")
                        .select("#axis-2")
                        .transition()
                        .duration(1000)
                        .style("stroke-opacity", 0.8)
                        .style("fill-opacity", 0.8)
                        .style("opacity", 0.8);

                    d3.select("#chord-viz")
                        .select("#avatar-2")
                        .transition()
                        .duration(1000)
                        .style("stroke-opacity", 1)
                        .style("fill-opacity", 1)
                        .style("opacity", 1);
                }

                if(series === "8") {
                    // select Mark as he's the third person in this series
                    d3.select("#chord-viz")
                        .select("#arc-2")
                        .transition()
                        .duration(1000)
                        .style("stroke-opacity", 0.8)
                        .style("fill-opacity", 0.8);

                    d3.select("#chord-viz")
                        .select("#axis-2")
                        .transition()
                        .duration(1000)
                        .style("stroke-opacity", 0.8)
                        .style("fill-opacity", 0.8)
                        .style("opacity", 0.8);

                    d3.select("#chord-viz")
                        .select("#avatar-2")
                        .transition()
                        .duration(1000)
                        .style("stroke-opacity", 1)
                        .style("fill-opacity", 1)
                        .style("opacity", 1);
                }
            }

            if(trigger === "chord-tut-4") {
                d3.select("#chord-viz")
                    .selectAll("path.chord")
                    .filter(function(d) {
                        // return internal thought chords only which are where the source and target are the same
                        // also just return mark and jez's mounds as some "Others" speak to each other too
                        // (Mark & Jez are always in the first 3 speakers i.e. index 0, 1, or 2)
                        return d.source.index === d.target.index && (d.source.index === 0 || d.source.index === 1 || d.source.index === 2);
                    })
                    .transition()
                    .duration(2000)
                    .ease(d3.easeLinear)
                    .style("stroke-opacity", 1)
                    .style("fill-opacity", 1);
            }

            if(trigger === "chord-tut-5") {
                d3.select("#chord-viz")
                    .selectAll("path.chord")
                    .transition()
                    .style("stroke-opacity", 1)
                    .style("fill-opacity", 1);

                d3.select("#chord-viz")
                    .selectAll("path.arc")
                    .transition()
                    .style("stroke-opacity", 1)
                    .style("fill-opacity", 1);

                d3.select("#chord-viz")
                    .selectAll(".avatar")
                    .transition()
                    .style("stroke-opacity", 1)
                    .style("fill-opacity", 1)
                    .style("opacity", 1);

                d3.select("#chord-viz")
                    .selectAll(".axis")
                    .transition()
                    .style("stroke-opacity", 1)
                    .style("fill-opacity", 1)
                    .style("opacity", 1);

                // now allow pointer events for hovering
                d3.select("#fig").style("pointer-events", "all");
            }
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
                        <h1>Series {series}</h1>                    
                        <p>{seriesSummary}</p>
                    </div>

                    <div className="step" data-step="1" data-trigger="chord-tut-1">
                        <h2>Conversations</h2>
                        <p>Let's visualise all of the conversations that took place in the series. We'll use a chord diagram to do this.</p>
                    </div>

                    <div className="step" data-step="1" data-trigger="chord-tut-2">
                        <p>Each "arc" represents a character from the series with the length of the arc representing the number of lines that character 
                            spoke. {chordTutorial.arc}</p>
                    </div>

                    <div className="step" data-step="1" data-trigger="chord-tut-3">
                        <p>The chords between the arcs visualise the number of lines spoken between characters. The thickness of the chord encodes the 
                            percentage of that character's overall lines that were spent speaking to that character. {chordTutorial.chords}</p>
                    </div>

                    <div className="step" data-step="1" data-trigger="chord-tut-4">
                        <p>Although chord diagrams are better at visualising asymmetrical patterns (conversations should be symmetrical 😏), you can still get 
                            an overall picture of who spoke to whom. An interesting aspect of the visual are the "mounds" which show how many "internal" thoughts 
                            Mark and Jez had. {chordTutorial.mounds}</p>
                    </div>

                    <div className="step" data-step="1" data-trigger="chord-tut-5">
                        <p>Now showing all characters in the series to complete the visual. Note minor characters who only have 1 or 2 lines, or characters that do 
                            not speak are gathered together under "Others" to keep the visual from becoming too cluttered. But don't worry, we'll explore these 
                            minor characters later on.
                        </p>

                        <p>{chordAnnotations}</p>

                        <p>Feel free to interact with the visualisation. Hover over the characters for more info and hover over the chords to see the percentages.</p>
                        <div id="info-panel">
                            <div id="info-avatar"></div>
                            {/* <p id="info-text">Hover over the characters for more info!</p> */}
                            <div id="info-col">
                                <h3 id="info-name"></h3>
                                <p id="info-total-lines"></p>
                                {/* <h4 id="info-spoke-to-heading">Spoke To</h4> */}
                                <p id="info-spoke-to"></p>
                            </div>
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

                <figure id="fig" style={{ display: showVisual }}>
                    {visualisation}
                </figure>
            </section>
        </main>
    );
}

export default Explorer;
