import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as d3 from "d3";
import chroma from "chroma-js";
import ReferenceData from "../../reference/ReferenceData";
import "./Lines.css";

function Lines() {
    const chart = useRef(null);
    const { series } = useParams();
    const [data, setData] = useState(null);
    const schema = (d) => {
        return {
            index: +d.index,
            Season: +d.Season,
            Episode: +d.Episode,
            NumLines: +d.NumLines
        }
    };

    // fetch data hook
    useEffect(() => {
        async function fetchNumLinesData(url) {
            d3.csv(url, schema).then(data => setData(data));
        }
        fetchNumLinesData(`${process.env.PUBLIC_URL}/data/stats/num_lines.csv`);
    }, []);

    // initialise chart hook
    useEffect(() => {
        const referenceData = new ReferenceData();
        const episodeTitles = Object.values(referenceData.episodeTitles).flatMap(x => x);
        const seriesColour = referenceData.seriesColours[series - 1];

        const margin = {
            top: 100,
            right: 20,
            bottom: 150, 
            left: 100
        };
        const height = 900 - margin.top - margin.bottom;
        const width = 1300 - margin.left - margin.right;
        const svg = d3.select(chart.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        if(data) {
            const x = d3.scaleBand()
                .domain(data.map(d => d.index))
                .range([0, width])
                .paddingInner(1);

            // y range taken from https://chezvoila.com/blog/yaxis/: b = 3c - a / 2
            // where b is the min scale value, c is the min data value and a is the max scale value
            const min = d3.min(data, d => d.NumLines);
            // round max to the nearest hundred (as max lines in data is 392)
            const max = Math.ceil(d3.max(data, d => d.NumLines) / 100) * 100;
            const b = (3 * min - max) / 2;
            const y = d3.scaleLinear()
                .domain([b, max])
                .range([height, 0]);

            // draw axes
            const xAxisDraw = d3.axisBottom(x)
                .tickFormat((d, i) => episodeTitles[i])
                .tickPadding(20)
                .tickSize(-height)
                .tickSizeOuter(0);

            svg.append("g")
                .attr("class", "lines-xaxis")
                .attr("transform", `translate(0, ${height})`)
                .call(xAxisDraw)
                .call(g => g.select(".domain").remove())
                .selectAll("text")
                    .attr("y", 0)
                    .attr("x", 9)
                    .attr("dy", ".35em")
                    .attr("transform", "rotate(90)")
                    .style("text-anchor", "start");

            const yAxisDraw = d3.axisLeft(y)
                .tickPadding(20)
                .tickSize(-width)
                .tickSizeOuter(0);

            svg.append("g")
                .attr("class", "lines-yaxis")
                .call(yAxisDraw)
                .call(g => g.select(".domain").remove());

            // mouse handlers
            const mouseover = (event, data) => {
                const tip = d3.select(".lines-tooltip");
                const episodeTitle = referenceData.episodeTitles[data.Season][data.Episode - 1];
                const seriesColour = referenceData.seriesColours[data.Season - 1];
                const tooltipHtml = `<p style="border-bottom: 3px solid ${seriesColour}">${episodeTitle}</p>
                    <small>Series ${data.Season}, Episode ${data.Episode}</small>
                    <p>${data.NumLines} lines</p>`;

                tip.style("left", `${event.clientX + 20}px`)
                    .style("top", `${event.clientY}px`)
                    .transition()
                    .style("opacity", 0.9);

                tip.select(".lines-tooltip-text").html(tooltipHtml);
            };

            const mouseout = (event, data) => {
                d3.select(".lines-tooltip")
                    .transition()
                    .style("opacity", 0);
            };

            // using a path for a single line (can't colour it separately though...)
            // const lineGen = d3.line().x(d => x(d.index)).y(d => y(d.NumLines));
            // svg.append("path")
            //     .attr("class", "num-lines")
            //     .transition()
            //     .attr("d", d => lineGen(data))
            //     .style("fill", "none")
            //     .style("stroke", "#333");

            // use separate line elements instead
            // need to pair the data to get the start/end co-ordinates of the line
            const pairedData = d3.pairs(data);

            svg.selectAll(".num-lines")
                .data(pairedData)
                .enter()
                .append("line")
                .attr("class", "num-lines")
                .attr("x1", d => x(d[0].index))
                .attr("x2", d => x(d[1].index))
                .attr("y1", d => y(d[0].NumLines))
                .attr("y2", d => y(d[1].NumLines))
                .style("fill", "none")
                .style("stroke", d => d[0].Season === +series ? seriesColour : chroma(seriesColour).brighten().alpha(0.5).hex())
                .style("stroke-width", 2);

            // add dots
            svg.selectAll(".num-lines-dots")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", d => x(d.index))
                .attr("cy", d => y(d.NumLines))
                .attr("r", 5)
                .style("stroke", "none")
                .style("fill", d => d.Season === +series ? seriesColour : chroma(seriesColour).brighten().alpha(0.5).hex())
                .on("mouseover", mouseover)
                .on("mouseout", mouseout);
        }

        // effect cleanup function
        return () => {
            // clean up svg when unmounting
            svg.selectAll("*").remove();
        }
    }, [data, series]);
    
    return (
        <>
            <svg ref={chart}></svg>
            <div className="lines-tooltip">
                <p className="lines-tooltip-text"></p>
            </div>
        </>
    );
}

export default Lines;