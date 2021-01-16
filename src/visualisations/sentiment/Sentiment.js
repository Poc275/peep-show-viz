import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as d3 from "d3";
import ReferenceData from "../../reference/ReferenceData";
import "./Sentiment.css";

function Sentiment() {
    const referenceData = new ReferenceData();
    const chart = useRef(null);
    const { series } = useParams();
    const [data, setData] = useState(null);
    const [groupedData, setGroupedData] = useState(null);
    const [svg, setSvg] = useState(null);
    const [x, setX] = useState(null);
    const [y, setY] = useState(null);
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
            // x: +d.x,
            // y: +d.y,
            // vy: +d.vy,
            // vx: +d.vx
        }
      };

    // fetch data hook
    useEffect(() => {
        async function fetchSentimentData(url) {
            d3.csv(url, schema).then(data => setData(data));
            // d3.json(url, schema).then(data => setData(data));
        }
        fetchSentimentData(`${process.env.PUBLIC_URL}/data/sentiment/S${series}_Sentiment.csv`);
        // fetchSentimentData(`${process.env.PUBLIC_URL}/data/sentiment/sentiment-force-s${series}.json`);
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
            right: 30,
            bottom: 50,
            left: 200
        };
        const height = 800;
        const width = 600;
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
                .range([0, width]);
                // .paddingInner(40);

            const y = d3.scaleLinear()
                .domain([1, -1])
                .range([0, height]);

            setX(() => x);
            setY(() => y);

            // draw axes
            const xAxisDraw = d3.axisBottom(x)
                // .tickFormat((d, i) => `Episode ${i + 1}`)
                .tickFormat((d, i) => referenceData.episodeTitles[i])
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
                const tip = d3.select(".tooltip");

                tip.style("left", `${event.offsetX + 15}px`)
                    .style("top", `${event.offsetY}px`)
                    .transition()
                    .style("opacity", 0.8);

                tip.html(data.sentence);

                // highlight all sentences by that person
                svg.selectAll(`.sentiment-circle.${data.speaker.replace(' ', '-').toLowerCase()}`)
                    .style("fill", "#f00");
            };

            const mousemove = (event) => {
                d3.select(".tooltip")
                    .style("left", `${event.offsetX + 15}px`)
                    .style("top", `${event.offsetY}px`);
            };
              
            const mouseout = (event, data) => {
                d3.select(".tooltip")
                    .transition()
                    .style("opacity", 0);

                svg.selectAll(`.sentiment-circle.${data.speaker.replace(' ', '-').toLowerCase()}`)
                    .style("fill", "#69b3a2");
            };

            // simulation - adds x and y attributes to the data
            const collisionRad = 1;
            const fudgeFactor = 2;
            const simulation = d3.forceSimulation(data)
                .velocityDecay(0.1)
                .force("x", d3.forceX(d => x(d.episode)).strength(0.02))
                .force("y", d3.forceY(d => y(d.compound)).strength(0.02))
                .force("collide", d3.forceCollide().radius(d => Math.sqrt(d.length * fudgeFactor + collisionRad)).iterations(1))
                .on("tick", ticked)
                .on("end", setFinished(true))
                // .stop()
                .tick(50);

            // draw circles
            svg.selectAll(".sentiment-circle")
                .data(data, d => d.id)
                .enter()
                .append("circle")
                .attr("cx", d => x(d.episode))
                .attr("cy", d => y(d.compound))
                .attr("r", d => Math.sqrt(d.length * fudgeFactor))
                .attr("class", d => `sentiment-circle ${d.speaker.replace(' ', '-').toLowerCase()}`)
                // .attr("class", "sentiment-circle")
                .style("fill", "#69b3a2")
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

    const showGroupedData = (e) => {
        const t = d3.transition().duration(3000);
        const collisionRad = 0.5;

        const ticked = (e) => {
            svg.selectAll(".sentiment-circle")
                .transition()
                // .ease(d3.easeCircle)
                .delay((d, i) => i * 1)
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
                // .style("fill", "#69b3a2");
        };

        svg.selectAll(".sentiment-circle")
            .data(groupedData, d => d.id)
            .join(
                enter => {
                    enter.append("circle")
                        .attr("cx", d => x(d.episode))
                        .attr("cy", d => y(d.compound))
                        .attr("r", 20)
                        .attr("class", "sentiment-circle")
                        .style("fill", "#f00");
                },
                update => {                    
                    update.style("fill", "brown")
                        // .call(update => update.transition(t)
                        //     .delay((d, i) => i * 2)
                        //     .attr("cx", d => x(d.episode))
                        //     .attr("cy", d => y(d.compound))
                        //     .attr("r", 20))
                            // .style("fill", "#f00"));
                },
                // exit => { exit.transition(t).style("opacity", 0).remove(); }
                exit => {
                    exit.style("fill", "brown")
                        .call(exit => exit.transition(t)
                            .attr("cy", 30)
                            .remove());
                }
            );

        // const simulation = d3.forceSimulation(groupedData)
        //     .velocityDecay(0.1)
        //     .force("x", d3.forceX(d => x(d.episode)).strength(0.02))
        //     .force("y", d3.forceY(d => y(d.compound)).strength(0.02))
        //     .force("collide", d3.forceCollide().radius(20 + collisionRad).iterations(1))
        //     .on("tick", ticked)
        //     .on("end", setFinished(true));
    };
    
    return (
        <>
            <svg ref={chart}></svg>
            <button id="groupDataBtn" onClick={showGroupedData} disabled={!finished}>Group Data</button>
            {/* <p>{finished ? "Simulation finished" : "Simulation running"}</p> */}
            <div className="tooltip"></div>
        </>
    );
}

export default Sentiment;