import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as d3 from "d3";
import "./Sentiment.css";

function Sentiment() {
    const chart = useRef(null);
    const { series } = useParams();
    const [data, setData] = useState(null);
    const schema = (d) => {
        return {
          neg: +d.neg,
          neu: +d.neu,
          pos: +d.pos,
          compound: +d.compound,
          sentence: d.sentence,
          episode: +d.episode,
          speaker: d.speaker,
          length: +d.length,
          index: +d.index
        }
      };

    // fetch data hook
    useEffect(() => {
        async function fetchSentimentData(url) {
            d3.csv(url, schema).then(data => setData(data));
        }
        fetchSentimentData(`${process.env.PUBLIC_URL}/data/sentiment/S${series}_Sentiment.csv`);
    }, [series]);

    // initialise chart hook
    useEffect(() => {
        const collisionRad = 0.5;
        const margin = {
            top: 50,
            right: 100,
            bottom: 50, 
            left: 100
        };
        const height = 500 - margin.top - margin.bottom;
        const width = 1200 - margin.left - margin.right;
        const svg = d3.select(chart.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        if(data) {
            const x = d3.scaleBand()
                .domain([1, 2, 3, 4, 5, 6])
                .range([0, width])
                .paddingInner(40);

            const y = d3.scaleLinear()
                .domain([1, -1])
                .range([0, height]);

            // draw axes
            const xAxisDraw = d3.axisBottom(x)
                .tickFormat((d, i) => `Episode ${i + 1}`)
                .tickPadding(20)
                .tickSize(-height)
                .tickSizeOuter(0);

            svg.append("g")
                .attr("class", "xaxis")
                .attr("transform", `translate(${-x.bandwidth() / 2}, ${height})`)
                .call(xAxisDraw);

            const yAxisDraw = d3.axisLeft(y)
                .tickValues([1, 0, -1])
                .tickFormat((d, i) => ["Positive", "Neutral", "Negative"][i])
                .tickPadding(20)
                // .tickSize(-width)
                .tickSizeOuter(0);

            svg.append("g")
                .attr("class", "yaxis")
                .call(yAxisDraw);

            // tick handler
            const ticked = (e) => {
                svg.selectAll(".sentiment-circle")
                    .transition()
                    // .ease(d3.easeCircle)
                    .delay((d, i) => i * 1)
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
                    .style("fill", "#69b3a2");
            };

            // mouse handlers
            const mouseover = (event, data) => {
                const tip = d3.select(".tooltip");

                tip.style("left", `${event.clientX + 15}px`)
                    .style("top", `${event.clientY}px`)
                    .transition()
                    .style("opacity", 0.8);

                tip.html(data.sentence);

                // highlight all sentences by that person
                svg.selectAll(`.sentiment-circle.${data.speaker.replace(' ', '-').toLowerCase()}`)
                    .style("fill", "#f00");
            };

            const mousemove = (event) => {
                d3.select(".tooltip")
                    .style("left", `${event.clientX + 15}px`)
                    .style("top", `${event.clientY}px`);
            };
              
            const mouseout = (event, data) => {
                d3.select(".tooltip")
                    .transition()
                    .style("opacity", 0);

                svg.selectAll(`.sentiment-circle.${data.speaker.replace(' ', '-').toLowerCase()}`)
                    .style("fill", "#69b3a2");
            };

            // simulation - adds x and y attributes to the data
            const simulation = d3.forceSimulation(data)
                .velocityDecay(0.2)
                .force("x", d3.forceX(d => x(d.episode)).strength(0.02))
                .force("y", d3.forceY(d => y(d.compound)).strength(0.02))
                .force("collide", d3.forceCollide().radius(d => Math.sqrt(d.length + collisionRad)).iterations(2))
                // .on("tick", ticked);

            // draw circles
            svg.selectAll(".sentiment-circle")
                .data(data, d => d.index)
                .enter()
                .append("circle")
                .attr("cx", d => x(d.episode))
                .attr("cy", d => y(d.compound))
                .attr("r", d => Math.sqrt(d.length))
                .attr("class", d => `sentiment-circle ${d.speaker.replace(' ', '-').toLowerCase()}`)
                .style("fill", "#333")
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
    
    return (
        <>
            <svg ref={chart}></svg>
            <div className="tooltip"></div>
        </>
    );
}

export default Sentiment;