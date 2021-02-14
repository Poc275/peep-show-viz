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
                .tickFormat((d, i) => referenceData.episodeTitles[i + 1][i])
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
                console.log(event);
                console.log(data);

                const speaker = data.speaker.replace(' ', '-').toLowerCase();
                const tip = d3.select(".tooltip");

                // work out position for tooltip so it doesn't venture off screen
                const xPos = data.episode === 6 ? event.offsetX + 400 : event.clientX;
                const yPos = event.clientY > 700 ? event.clientY - 300 : event.clientY;
                console.log(yPos);

                tip.style("left", `${xPos}px`)
                    .style("top", `${yPos}px`)
                    .style("border-top", `60px solid ${referenceData.characterColours[data.speaker]}`)
                    .transition()
                    .style("opacity", 0.9);

                tip.select(".tooltip-avatar").style("background-image", `url('${process.env.PUBLIC_URL}/avatars/${speaker}.jpg')`);

                tip.select(".tooltip-text").html(data.sentence);

                // highlight all sentences by that person
                svg.selectAll(`.sentiment-circle.${speaker}`)
                    .style("fill", "#f00");
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

                svg.selectAll(`.sentiment-circle.${data.speaker.replace(' ', '-').toLowerCase()}`)
                    .style("fill", referenceData.seriesColours[series]);
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
                .style("fill", referenceData.seriesColours[series])
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
            <div className="tooltip">
                {/* <img src="" alt="character avatar" className="tooltip-avatar" /> */}
                <div className="tooltip-avatar"></div>
                <p className="tooltip-text"></p>
            </div>
        </>
    );
}

export default Sentiment;