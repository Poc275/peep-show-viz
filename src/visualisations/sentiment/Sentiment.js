import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as d3 from "d3";
import chroma from "chroma-js";
import ReferenceData from "../../reference/ReferenceData";
import "./Sentiment.css";

// using forwardRef in order to gain access to the 'ref' object that is assigned using the 'ref' prop 
// inside the Explorer component which will allow us to access functions in this component inside Explorer.
const Sentiment = forwardRef((props, ref) => {
    const referenceData = new ReferenceData();
    const chart = useRef(null);
    const { series } = useParams();
    const [data, setData] = useState(null);
    const [groupedData, setGroupedData] = useState(null);
    const [svg, setSvg] = useState(null);
    const [x, setX] = useState(null);
    const [y, setY] = useState(null);
    const [yAxisDraw, setYAxisDraw] = useState(null);
    const [finished, setFinished] = useState(false);
    const schema = (d) => {
        return {
            id: +d.id,
            neg: +d.neg,
            neu: +d.neu,
            pos: +d.pos,
            compound: +d.compound,
            sentence: d.sentence,
            episode: +d.episode,
            speaker: d.speaker,
            length: +d.length,
        }
    };

    // fetch data hook
    useEffect(() => {
        async function fetchSentimentData(url) {
            d3.csv(url, schema).then(data => setData(data));
        }
        fetchSentimentData(`${process.env.PUBLIC_URL}/data/sentiment/S${series}_Sentiment.csv`);
    }, [series]);

    const groupData = () => {
        const episodeData = d3.group(data, d => d.episode);
        // for each episode/speaker, get the average sentiment score
        const episodeSentiment = Array.from(episodeData, ([key, val]) => d3.rollup(episodeData.get(key), v => d3.mean(v, d => d.compound), d => d.speaker));
        
        // restructure as per the raw data for ease of visualisation
        const restructuredData = [];
        episodeSentiment.map((es, idx) => {
            es.forEach((val, key) => {
                restructuredData.push({
                    compound: val,
                    episode: idx + 1,
                    speaker: key,
                    id: key + idx
                });
            });
        });

        setGroupedData(restructuredData);
    };

    // initialise chart hook
    useEffect(() => {
        const margin = {
            top: 20,
            right: 60,
            bottom: 50,
            left: 150
        };
        const height = 850;
        const width = 1100;
        const svg = d3.select(chart.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        setSvg(svg);

        // schema results in a dataset of NaNs even if dataset doesn't exist, so check for this before rendering
        if(data && data[0].sentence) {
            // group data
            groupData();

            const x = d3.scaleBand()
                .domain([1, 2, 3, 4, 5, 6])
                .range([0, width])
                .paddingInner(10);

            const y = d3.scaleLinear()
                .domain([1, -1])
                .range([0, height]);

            setX(() => x);
            setY(() => y);

            // draw axes
            const xAxisDraw = d3.axisBottom(x)
                // .tickFormat((d, i) => `Episode ${i + 1}`)
                .tickFormat((d, i) => referenceData.episodeTitles[series][i])
                .tickPadding(20)
                .tickSize(-height)
                .tickSizeOuter(0);

            svg.append("g")
                .attr("class", "xaxis")
                .attr("transform", `translate(${-x.bandwidth() / 2}, ${height})`)
                .call(xAxisDraw);

            const yAxisDraw = d3.axisLeft(y)
                .tickValues([1, 0, -1])
                .tickFormat((d, i) => ["🙂", "😐", "🙁"][i])
                .tickPadding(20)
                // .tickSize(-width)
                .tickSizeOuter(0);

            setYAxisDraw(() => yAxisDraw);

            svg.append("g")
                .attr("class", "yaxis")
                .attr("transform", `translate(${-margin.left / 2},0)`)
                .call(yAxisDraw);

            // tick handler
            const ticked = (e) => {
                svg.selectAll(".sentiment-circle")
                    // .transition()
                    // .ease(d3.easeCircle)
                    // .delay((d, i) => i * 1)
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y);
                    // .style("fill", "#69b3a2");
            };

            // mouse handlers
            const mouseover = (event, data) => {
                // console.log(event);
                // console.log(data);

                const speaker = data.speaker.replaceAll(' ', '-').replace("'", "").toLowerCase();
                const tip = d3.select(".tooltip");

                // work out position for tooltip so it doesn't venture off screen
                const xPos = data.episode === 6 ? event.offsetX + 400 : event.clientX;
                const yPos = event.clientY > 700 ? event.clientY - 300 : event.clientY;

                tip.style("left", `${xPos}px`)
                    .style("top", `${yPos}px`)
                    .style("border-top", `60px solid ${referenceData.characterColours[data.speaker]}`)
                    .transition()
                    .style("opacity", 0.9);

                tip.select(".tooltip-avatar").style("background-image", `url('${process.env.PUBLIC_URL}/avatars/${speaker}.jpg')`);

                tip.select(".tooltip-text").html(data.sentence);

                // highlight all sentences by that person
                // unless we're in focus mode in which case we don't want to interfere with the current display
                if(svg.selectAll(".sentiment-circle.focus").empty()) {
                    svg.selectAll(".sentiment-circle")
                        .transition()
                        .duration(500)
                        .style("opacity", 0.25);

                    svg.selectAll(`.sentiment-circle.${speaker}`)
                        .transition()
                        .duration(500)
                        .style("opacity", "1");
                }
            };

            const mousemove = (event, data) => {
                // work out position for tooltip so it doesn't venture off screen
                const xPos = data.episode === 6 ? event.offsetX + 400 : event.clientX;
                const yPos = event.clientY > 700 ? event.clientY - 300 : event.clientY;

                d3.select(".tooltip")
                    .style("left", `${xPos}px`)
                    .style("top", `${yPos}px`);
            };
              
            const mouseout = (event, data) => {
                d3.select(".tooltip")
                    .transition()
                    .style("opacity", 0);

                // re-highlight all elements if we're not in focus mode
                // otherwise we can leave the display as is
                if(svg.selectAll(".sentiment-circle.focus").empty()) {
                    svg.selectAll(".sentiment-circle")
                        .transition()
                        .duration(500)
                        .style("opacity", 1);
                }
            };

            // simulation - adds x and y attributes to the data
            const collisionRad = 5;
            const fudgeFactor = 2;
            d3.forceSimulation(data)
                .velocityDecay(0.2)
                .force("x", d3.forceX(d => x(d.episode)).strength(0.02))
                .force("y", d3.forceY(d => y(d.compound)).strength(0.02))
                .force("collide", d3.forceCollide().radius(d => Math.sqrt(d.length * fudgeFactor + collisionRad)))
                .on("tick", ticked)
                .on("end", setFinished(true));
                // .stop()
                // .tick(50);

            // draw circles
            svg.selectAll(".sentiment-circle")
                .data(data, d => d.id)
                .enter()
                .append("circle")
                .attr("cx", d => x(d.episode))
                .attr("cy", d => y(d.compound))
                .attr("r", d => Math.sqrt(d.length * fudgeFactor))
                .attr("class", d => `sentiment-circle ${d.speaker.replaceAll(' ', '-').replace("'", "").toLowerCase()}`)
                // .attr("class", "sentiment-circle")
                .style("fill", referenceData.seriesColours[series - 1])
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseout", mouseout);
        }

        // effect cleanup function
        return () => {
            // clean up svg when unmounting
            svg.selectAll("*").remove();
        }
    }, [data]);

    // useImperativeHandle hook means the component will be extended with 
    // whatever we return from the callback passed as the 2nd argument
    useImperativeHandle(ref, () => ({
        // we return our grouping functionality as this will be invoked 
        // inside the Explorer component once it scrolls into place
        showGroupedData() {
            if(svg) {
                const t = d3.transition().delay(1000).duration(3000);
                const collisionRad = 1;
                const fudgeFactor = 2;

                // transition axis
                // update y axis domain (add 10% to make sure bubbles don't get cropped)
                const newDomain = d3.extent(groupedData, d => d.compound);
                const min = newDomain[0] + newDomain[0] * 0.1;
                const max = newDomain[1] + newDomain[1] * 0.1;
                y.domain([max, min]);
                // update tick value positions before redrawing
                yAxisDraw.tickValues([max, 0, min]);
                svg.select(".yaxis")
                    .transition()
                    .duration(2000)
                    .call(yAxisDraw);

                // add defs for avatars
                const patterns = svg.append("defs").selectAll("patterns")
                    .data(referenceData.seriesCharacters[series - 1])
                    .enter().append("pattern")
                    .attr("id", d => d.replaceAll(' ', '-').replace("'", ""))
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("gradientUnits", "userSpaceOnUse")
                    .attr("height", 40)
                    .attr("width", 40);

                // append images to pattern defs
                patterns.append("image")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("height", 40)
                    .attr("width", 40)
                    .attr("xlink:href", d => `${process.env.PUBLIC_URL}/avatars/${d.replaceAll(' ', '-').replace("'", "").toLowerCase()}.jpg`);

                const ticked = (e) => {
                    svg.selectAll(".sentiment-circle")
                        .transition()
                        // .ease(d3.easeCircle)
                        // .delay((d, i) => i * 1)
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y);
                        // .style("fill", "#69b3a2");

                    // remember to update connector lines as well!
                    svg.selectAll(".sentiment-connector")
                        .attr("x1", d => d[0].x)
                        .attr("x2", d => d[1].x)
                        .attr("y1", d => d[0].y)
                        .attr("y2", d => d[1].y);
                };

                // function which draws lines between a characters average episode sentiment
                const drawLines = () => {
                    const speakerGroups = d3.group(groupedData, d => d.speaker);
                    // ignore any speakers who only appeared in a single episode
                    for(let speaker of speakerGroups.keys()) {
                        if(speakerGroups.get(speaker).length === 1) {
                            speakerGroups.delete(speaker);
                        }
                    }

                    // pair data for lines
                    const dataset = [];
                    for(let speaker of speakerGroups.keys()) {
                        const data = speakerGroups.get(speaker);
                        const pairedData = d3.pairs(data);
                        dataset.push(pairedData);
                    }

                    svg.selectAll(".sentiment-connector")
                        .data(dataset.flatMap(el => el))
                        .enter()
                        .append("line")
                        .attr("class", d => `sentiment-connector ${d[0].speaker.replaceAll(' ', '-').replace("'", "").toLowerCase()}`)
                        .attr("x1", d => d[0].x)
                        .attr("x2", d => d[1].x)
                        .attr("y1", d => d[0].y)
                        .attr("y2", d => d[1].y)
                        .style("fill", "none")
                        .style("stroke", d => chroma(referenceData.characterColours[d[0].speaker]).alpha(0.25).hex())
                        .style("stroke-width", 2);
                }

                d3.forceSimulation(groupedData)
                    .velocityDecay(0.1)
                    .force("x", d3.forceX(d => x(d.episode)).strength(0.2))
                    .force("y", d3.forceY(d => y(d.compound)).strength(0.2))
                    .force("collide", d3.forceCollide().radius(d => 21))
                    .on("tick", ticked)
                    .on("end", drawLines())
                    .tick(70);

                // mouse handlers for grouped data
                const mouseover = (event, data) => {
                    const speaker = data.speaker.replaceAll(" ", "-").replace("'", "").toLowerCase();
                    const tip = d3.select(".tooltip");

                    // work out position for tooltip so it doesn't venture off screen
                    const xPos = data.episode === 6 ? event.offsetX + 400 : event.clientX;
                    const yPos = event.clientY > 700 ? event.clientY - 300 : event.clientY;

                    const tooltipText = `<h2>${data.speaker}</h2><p>Average Sentiment<br />${data.compound.toFixed(2)}</p>`;

                    tip.style("left", `${xPos}px`)
                        .style("top", `${yPos}px`)
                        .style("border-top", `60px solid ${referenceData.characterColours[data.speaker]}`)
                        .transition()
                        .style("opacity", 0.9);

                    tip.select(".tooltip-avatar").style("background-image", `url('${process.env.PUBLIC_URL}/avatars/${speaker}.jpg')`);

                    tip.select(".tooltip-text").html(tooltipText);

                    // highlight this person
                    svg.selectAll(".sentiment-circle")
                        .transition()
                        .style("opacity", 0.25);
                    svg.selectAll('.sentiment-connector')
                        .transition()
                        .style("opacity", 0.25);

                    svg.selectAll(`.sentiment-circle.${speaker}`)
                        .transition()
                        .style("opacity", 1);
                    svg.selectAll(`.sentiment-connector.${speaker}`)
                        .transition()
                        .style("stroke", d => chroma(referenceData.characterColours[d[0].speaker]).alpha(1).hex())
                        .style("opacity", 1);
                };

                const mousemove = (event, data) => {
                    // work out position for tooltip so it doesn't venture off screen
                    const xPos = data.episode === 6 ? event.offsetX + 400 : event.clientX;
                    const yPos = event.clientY > 700 ? event.clientY - 300 : event.clientY;

                    d3.select(".tooltip")
                        .style("left", `${xPos}px`)
                        .style("top", `${yPos}px`);
                };
                
                const mouseout = (event, data) => {
                    d3.select(".tooltip")
                        .transition()
                        .style("opacity", 0);

                    svg.selectAll(".sentiment-circle")
                        .transition()
                        .style("opacity", 1);

                    svg.selectAll(".sentiment-connector")
                        .transition()
                        .style("stroke", d => chroma(referenceData.characterColours[d[0].speaker]).alpha(0.25).hex())
                        .style("opacity", 1);
                };

                svg.selectAll(".sentiment-circle")
                    .data(groupedData, d => d.id)
                    .join(
                        enter => {
                            enter.append("circle")
                                .attr("cx", d => x(d.episode))
                                .attr("cy", d => y(d.compound))
                                .attr("r", 20)
                                .attr("class", d => `sentiment-circle ${d.speaker.replaceAll(' ', '-').replace("'", "").toLowerCase()}`)
                                // .style("fill", "#f00");
                                .style("fill", d => `url(#${d.speaker.replaceAll(' ', '-').replace("'", "")})`)
                                .style("stroke", d => referenceData.characterColours[d.speaker])
                                .style("stroke-width", 3)
                                .on("mouseover", mouseover)
                                .on("mousemove", mousemove)
                                .on("mouseout", mouseout);
                        },
                        update => { update.style("opacity", 0).remove() },
                        // update => {
                        //     update.call(update => update.transition(t)
                        //         .style("opacity", 0)
                        //         .remove());
                        // },
                        exit => { exit.style("opacity", 0).remove() }
                        // exit => {
                        //     exit.call(exit => exit.transition(t)
                        //         .attr("opacity", 0)
                        //         .remove());
                        // }
                    );
            }
        }
    }));
    
    return (
        <>
            <svg ref={chart}></svg>
            {/* <p>{finished ? "Simulation finished" : "Simulation running"}</p> */}
            <div className="tooltip">
                <div className="tooltip-avatar"></div>
                <p className="tooltip-text"></p>
            </div>
        </>
    );
});

export default Sentiment;