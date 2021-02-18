import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as d3 from "d3";
import chroma from "chroma-js";
import ReferenceData from "../../reference/ReferenceData";

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
        const seriesColour = referenceData.seriesColours[series];

        const margin = {
            top: 50,
            right: 100,
            bottom: 150, 
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
                .domain(data.map(d => d.index))
                .range([0, width])
                .paddingInner(0.2);

            const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.NumSwears)])
                .range([height, 0]);

            // draw axes
            const xAxisDraw = d3.axisBottom(x)
                .tickFormat((d, i) => episodeTitles[i]);
                // .tickPadding(20)
                // .tickSize(-height)
                // .tickSizeOuter(0);

            svg.append("g")
                .attr("class", "xaxis")
                .attr("transform", `translate(0, ${height})`)
                .call(xAxisDraw)
                .selectAll("text")
                    .attr("y", 0)
                    .attr("x", 9)
                    .attr("dy", ".35em")
                    .attr("transform", "rotate(90)")
                    .style("text-anchor", "start");

            const yAxisDraw = d3.axisLeft(y);
                // .tickValues([1, 0, -1])
                // .tickFormat((d, i) => ["Positive", "Neutral", "Negative"][i])
                // .tickPadding(20)
                // .tickSize(-width)
                // .tickSizeOuter(0);

            svg.append("g")
                .attr("class", "yaxis")
                .call(yAxisDraw);


            // draw circles
            svg.selectAll(".swear-bar")
                .data(data, d => d.index)
                .enter()
                .append("rect")
                .attr("class", "swear-bar")
                .attr("x", d => x(d.index))
                .attr("y", d => y(0))
                .attr("width", x.bandwidth())
                .attr("height", 0)
                .transition()
                .delay((d, i) => i * 20)
                .attr("y", d => y(d.NumSwears))
                .attr("height", d => height - y(d.NumSwears))
                .style("fill", d => d.Season === +series ? seriesColour : chroma(seriesColour).brighten().alpha(0.5).hex());
        }

        // effect cleanup function
        return () => {
            // clean up svg when unmounting
            svg.selectAll("*").remove();
        }
    }, [data, series]);
    
    return (
        <svg ref={chart}></svg>
    );
}

export default Swears;