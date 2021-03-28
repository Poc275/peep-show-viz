import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as d3 from "d3";
import chroma from "chroma-js";
import ReferenceData from "../../reference/ReferenceData";
import "./Swears.css";

function Swears() {
    const chart = useRef(null);
    const { series } = useParams();
    const [data, setData] = useState(null);
    const schema = (d) => {
        return {
            index: +d.index,
            Season: +d.Season,
            Episode: +d.Episode,
            NumSwears: +d.NumSwears
        }
    };

    // fetch data hook
    useEffect(() => {
        async function fetchSwearData(url) {
            d3.csv(url, schema).then(data => setData(data));
        }
        fetchSwearData(`${process.env.PUBLIC_URL}/data/stats/swears.csv`);
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
                .paddingInner(0.2);

            // round max up to nearest 5
            const y = d3.scaleLinear()
                .domain([0, Math.ceil(d3.max(data, d => d.NumSwears) / 5) * 5])
                .range([height, 0]);

            // draw axes
            const xAxisDraw = d3.axisBottom(x)
                .tickFormat((d, i) => episodeTitles[i]);

            svg.append("g")
                .attr("class", "swears-xaxis")
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
                .tickSize(-width);

            // mouse handlers
            const mouseover = (event, data) => {
                const tip = d3.select(".swears-tooltip");
                const episodeTitle = referenceData.episodeTitles[data.Season][data.Episode - 1];
                const seriesColour = referenceData.seriesColours[data.Season - 1];
                const tooltipHtml = `<p style="border-bottom: 3px solid ${seriesColour}">${episodeTitle}</p>
                    <small>Series ${data.Season}, Episode ${data.Episode}</small>
                    <p>${data.NumSwears} swears</p>`;

                tip.style("left", `${event.clientX + 20}px`)
                    .style("top", `${event.clientY}px`)
                    .transition()
                    .style("opacity", 0.9);

                tip.select(".swears-tooltip-text").html(tooltipHtml);
            };

            const mousemove = (event, data) => {
                d3.select(".tooltip")
                    .style("left", `${event.clientX + 20}px`)
                    .style("top", `${event.clientY}px`);
            };

            const mouseout = (event, data) => {
                d3.select(".swears-tooltip")
                    .transition()
                    .style("opacity", 0);
            };


            // draw bars
            svg.selectAll(".swear-bar")
                .data(data, d => d.index)
                .enter()
                .append("rect")
                .attr("class", "swear-bar")
                .attr("x", d => x(d.index))
                .attr("y", d => y(0))
                .attr("width", x.bandwidth())
                .attr("height", 0)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseout", mouseout)
                .transition()
                .delay((d, i) => i * 20)
                .attr("y", d => y(d.NumSwears))
                .attr("height", d => height - y(d.NumSwears))
                .style("fill", d => d.Season === +series ? seriesColour : chroma(seriesColour).brighten().alpha(0.5).hex());

            // draw y axis on top of bars
            svg.append("g")
                .attr("class", "swears-yaxis")
                .call(yAxisDraw)
                .call(g => g.select(".domain").remove());
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
            <div className="swears-tooltip">
                <p className="swears-tooltip-text"></p>
            </div>
        </>
    );
}

export default Swears;