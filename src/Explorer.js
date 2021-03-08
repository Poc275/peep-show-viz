import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import * as d3 from "d3";
// import gsap from "gsap";
// import ScrollTrigger from "gsap/ScrollTrigger";
import "intersection-observer";
import scrollama from "scrollama";

import ChordDiagram from "./visualisations/chord/ChordDiagram";
import ChordDiagramTutorial from "./visualisations/chord/ChordDiagramTutorial";
import WordSearch from "./visualisations/words/WordSearch";
import Locations from "./visualisations/locations/Locations";
import Timeline from "./visualisations/timeline/Timeline";
import Sentences from "./visualisations/sentences/Sentences";
import Sentiment from "./visualisations/sentiment/Sentiment";
import Stats from "./visualisations/stats/Stats";
import SentenceAnnotation from "./visualisations/sentences/SentenceAnnotation";
import ReferenceData from "./reference/ReferenceData";
import SentenceAnnotations from "./visualisations/sentences/SentenceAnnotations";
import SentimentAnnotations from "./visualisations/sentiment/SentimentAnnotations";
import WordAnnotations from "./visualisations/words/WordAnnotations";
import "./Explorer.css";


function Explorer() {
    const referenceData = new ReferenceData();
    const sentenceAnnotationsData = new SentenceAnnotations();
    const sentimentAnnotationsData = new SentimentAnnotations();
    const wordAnnotationData = new WordAnnotations();

    const [visualisation, setVisualisation] = useState(null);
    const [dataStep, setDataStep] = useState(0);
    const [showVisual, setShowVisual] = useState("none");
    
    const [seriesSummary, setSeriesSummary] = useState("");
    
    const [chordTutorial, setChordTutorial] = useState("");
    const [chordAnnotations, setChordAnnotations] = useState("");

    const [sentenceAnnotations, setSentenceAnnotations] = useState("");
    const [audioAnnotations, setAudioAnnotations] = useState([]);

    // ref for the sentiment component (gives us access to its group function)
    const sentimentRef = useRef();
    const [sentimentAnnotations, setSentimentAnnotations] = useState("");
    const [sentimentSelectedCharacter, setSentimentSelectedCharacter] = useState("Mark");

    const [wordAnnotations, setWordAnnotations] = useState("");

    const { series } = useParams();

    // annotations hook
    useEffect(() => {
        setSeriesSummary(referenceData.seriesSummaries[series - 1]);

        setChordTutorial(referenceData.chordTutorial[series - 1]);
        setChordAnnotations(referenceData.chordAnnotations[series - 1]);

        setSentenceAnnotations(sentenceAnnotationsData.sentenceAnnotations[series - 1]);
        setAudioAnnotations(sentenceAnnotationsData.audioAnnotations.filter(a => a.series === series));

        setSentimentAnnotations(sentimentAnnotationsData.characterSentiments[series - 1]);

        setWordAnnotations(wordAnnotationData.annotations[series - 1]);
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
                component = <Sentiment ref={sentimentRef} />
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
        const chordDiagramTutorial = new ChordDiagramTutorial();
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
            // console.log(res);
            const scrolledDataStep = res.element.dataset.step;
            const trigger = res.element.dataset.trigger;
            step.classed("is-active", (d, i) => i === res.index);

            if(scrolledDataStep !== dataStep) {
                // change displayed visualisation
                setDataStep(res.element.dataset.step);
                getVisualisation(res.element.dataset.step - 1);
            }

            switch(trigger) {
                case "chord-tut-1":
                    chordDiagramTutorial.tutorialOne();
                    setShowVisual("block");
                    break;

                case "chord-tut-2":
                    chordDiagramTutorial.tutorialTwo();
                    break;

                case "chord-tut-3":
                    chordDiagramTutorial.tutorialThree(series);
                    break;

                case "chord-tut-4":
                    chordDiagramTutorial.tutorialFour();
                    break;

                case "chord-tut-5":
                    chordDiagramTutorial.tutorialFive();
                    break;

                case "words-intro":
                    d3.selectAll(".top-word")
                        .style("opacity", 0);

                    d3.select("#search-results")
                        .style("opacity", 0);

                    d3.select("#search-input")
                        .style("opacity", 0);
                    break;

                case "words-reveal":
                    d3.selectAll(".top-word")
                        .transition()
                        .delay((d, i) => i * 200)
                        .duration(500)
                        .ease(d3.easeLinear)
                        .style("opacity", 1)
                        .style("pointer-events", "all");
                    break;

                case "word-search-reveal":
                    d3.select(".word-search-top-words")
                        .transition()
                        .style("display", "none");

                    d3.select("#search-results")
                        .transition()
                        .duration(500)
                        .style("opacity", 1);

                    d3.select("#search-input")
                        .transition()
                        .duration(500)
                        .style("opacity", 1);
                    break;

                case "mark-vs-jez":
                    // if scrolling back up then reset opacity
                    if(res.direction === "up") {
                        d3.selectAll(".num-words-bar")
                            .transition()
                            .duration(1000)
                            .style("opacity", 1);
                    }
                    break;

                case "sentence-annotation":
                    const sentenceIndex = res.element.dataset.sentence;
                    // highlight this specific sentence
                    d3.selectAll(".num-words-bar")
                        .transition()
                        .duration(500)
                        .style("opacity", (d, i) => {
                            // only == as custom "data-" attribute is a string
                            if(d.index == sentenceIndex) {
                                return 1;
                            } else {
                                return 0.25;
                            }
                        });
                    break;

                case "mark-sentiment":
                    // highlight Mark's sentence bubbles
                    d3.selectAll(".sentiment-circle")
                        .transition()
                        .duration(500)
                        .style("opacity", 0.25);

                    d3.selectAll(".sentiment-circle.mark")
                        .classed("focus", true)
                        .transition()
                        .duration(500)
                        .style("opacity", 1);
                    break;

                case "sentiment-grouped":
                    // now we can invoke the group function inside the Sentiment component 
                    // thanks to the useRef/useImperativeHandle hooks
                    sentimentRef.current.showGroupedData();
                    break;

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
    }, [audioAnnotations]);

    // character selection change in sentiment viz
    useEffect(() => {
        d3.selectAll(".sentiment-circle")
            .transition()
            .duration(500)
            .style("opacity", 0.25);

        d3.selectAll(`.sentiment-circle.${sentimentSelectedCharacter.replaceAll(' ', '-').replace("'", "").toLowerCase()}`)
            .classed("focus", true)
            .transition()
            .duration(500)
            .style("opacity", 1);

    }, [sentimentSelectedCharacter]);

    const filterSentimentBubbles = (e) => {
        setSentimentSelectedCharacter(e.target.dataset.character);
        // remove selected class from previous selection and add to current
        const elements = document.getElementsByClassName("sentiment-avatar");
        Array.prototype.forEach.call(elements, el => el.classList.remove("selected"));
        e.target.classList.add("selected");
    };

    return (
        <main>
            <section id="scrolly">
                <article>
                    {/* Conversation (chords) Section */}
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


                    {/* Words Section */}
                    <div className="step" data-step="2" data-trigger="words-intro">
                        <h1>Words</h1>
                        <p>Now let's break down the sentences into individual words and look at how they are used throughout the series.</p>
                    </div>

                    <div className="step" data-step="2" data-trigger="words-reveal">
                        <p>Here are the top ten words used most in the series. Common words have been ignored to try and make the analysis 
                            more interesting. Hover over them to see who said what.
                        </p>
                        <p>{wordAnnotations}</p>
                    </div>

                    <div className="step" data-step="2" data-trigger="word-search-reveal">
                        <p>You can now use the search feature to look for your own words to see where they appear in the series. This will show every line from 
                            the series where that word appears, who said it to whom and where it was said.
                        </p>
                    </div>



                    {/* Locations Section */}
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


                    {/* Mark v Jez sentences chart */}
                    <div className="step" data-step="5" data-trigger="mark-vs-jez">
                        <h1>Mark vs Jez</h1>
                        <p>Let's focus in on Mark and Jez now, looking at how their lines compare with each other.</p>
                        <p>Each horizontal bar represents a line spoken by Mark and Jez for each episode. The width of the bar 
                            indicates the number of words in the line with the colour highlighting if it was 
                            spoken <span style={{ borderBottom: "3px solid dodgerblue"}}>aloud</span> or <span style={{ borderBottom: "3px solid tomato"}}>"internally"</span>. From 
                            the number of bars we can also see who had the most lines per episode.
                        </p>
                        <p>The horizontal "ticks" below represent the average number of words per <span className="bold">sentence</span> where each tick equals one word. {sentenceAnnotations[0]}</p>
                        <p>The circles visualise the ratio of internal versus external lines. {sentenceAnnotations[1]}</p>
                        <p>Finally, the words show the top five most common nouns utterred by each character per episode. {sentenceAnnotations[2]}</p>
                    </div>

                    {
                        audioAnnotations.map((a, idx) => {
                            return (
                                <div key={idx} className="step" data-step="5" data-trigger="sentence-annotation" data-sentence={a.index}>
                                    <SentenceAnnotation annotation={a} />
                                </div>
                            )
                        })
                    }

                    { /* Sentiment Analysis */}
                    <div className="step" data-step="6">
                        <h1>Sentiment</h1>
                        <p>Now let's delve a level deeper by breaking the lines down into individual sentences.</p>
                        <p>Here, each bubble represents a sentence from the script, where the size of the bubble represents the number of words in the sentence. Sentiment analysis has 
                            been performed on each sentence and the bubble positioned ranging from a positive sentiment at the top, to a negative sentiment at the bottom, staggered 
                            to prevent any overlaps.
                        </p>
                        <p>Hover over the bubbles to see the sentence info. It also highlights all of the sentences spoken by that particular character.</p>
                    </div>

                    <div className="step" data-step="6" data-trigger="mark-sentiment">
                        <p>Here we have highlighted just Mark's sentences. As you can see it is hard to infer an overall sentiment. This is especially true for 
                            the main characters as we watch their journey through life and the wide gamut of emotions that come with it.
                        </p>
                        <p>Feel free to highlight other characters below and see if you can deduce an overall positive or negative sentiment.</p>
                        <div>
                            {
                                referenceData.seriesCharacters[series - 1].map(c => 
                                    <div className={c === "Mark" ? "sentiment-avatar selected" : "sentiment-avatar"} data-character={c} 
                                        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/avatars/${c.replaceAll(' ', '-').replace("'", "").toLowerCase()}.jpg)` }}
                                        title={c} onClick={filterSentimentBubbles}>
                                    </div>
                                )
                            }
                        </div>
                    </div>

                    <div className="step" data-step="6" data-trigger="sentiment-grouped">
                        <p>Now let's group all of the sentences together by character and get an overall sentiment average. {sentimentAnnotations}</p>
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
