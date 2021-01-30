import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
// import * as d3Annotation from "d3-svg-annotation";
import ReferenceData from "../../reference/ReferenceData";
import { min } from "lodash";

function SentencesChart(props) {
    const chart = useRef(null);
    const { data, index, maxLines } = props;
    const speaker = index % 2 === 0 ? "Mark" : "Jeremy";
    const episode = Math.floor((index / 2) + 1);

    // initialise viz hook
    useEffect(() => {
        const referenceData = new ReferenceData();

        const margin = {
            top: 60,
            right: 0,
            bottom: 10, 
            left: 50
        };
        const height = 700 - margin.top - margin.bottom;
        const width = 100 - margin.left - margin.right;
        const svg = d3.select(chart.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        if(data) {
            // x axis
            const x = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.NumWords)])
                .range([0, width]);

            // range of indices for the y scale
            const range = [];
            // each episode will have a different starting index, so get that first
            const minIdx = d3.min(data, d => d.index);
            // set scale to the longest number of lines spoken throughout the series
            // this way we can also visualise how who spoke the most lines per episode
            for(let i = minIdx; i <= minIdx + maxLines; i++) {
                range.push(i);
            }

            const y = d3.scaleBand()
                .domain(range)
                .range([0, height]);
                // .padding(6);

            // append axes
            const xAxis = d3.axisTop(x)
                .ticks(1)
                .tickValues([""])
                .tickSize(-height - margin.top - margin.bottom)
                // .tickSizeInner(0)
                .tickSizeOuter(0);

            svg.append("g")
                // .attr("transform", "translate(0," + height + ")")
                .attr("class", "axis")
                .call(xAxis);

            // svg.append("g")
            //     .call(d3.axisLeft(y));

            svg.selectAll(".num-words-bar")
                .data(data)
                .enter()
                .append("rect")
                    .attr("x", 0)
                    .attr("y", d => y(d.index))
                    .attr("width", 0)
                    // .attr("width", d => x(d.NumWords))
                    .attr("height", y.step() * 0.8)
                    // .attr("height", 4)
                    .attr("class", "num-words-bar")
                    .attr("id", (d, i) => `sentence-${d.index}`)
                    .attr("fill", d => d.Internal ? "tomato" : "dodgerblue")
                    // .style("opacity", 0.25)
                    .on("mouseover", function(d, i) { d3.select(this).attr("opacity", "0.25") })
                    .on("mouseout", function(d, i) { d3.select(this).attr("opacity", "1") })
                    .on("click", function(d, i) { console.log(i, d) })  // for debugging
                    .transition()
                    .duration(2000)
                    .attr("transform", (d) => {
                        let width = x(d.NumWords);
                        return `translate(-${width / 2}, 0)`
                    })
                    .attr("width", d => x(d.NumWords));

             // Draw header.
            const header = svg.append('g')
                .attr('class', 'bar-header')
                .attr('transform', `translate(0,${-margin.top * 0.6})`)
                .attr("text-anchor", "middle")
                .append('text');

            header.append('tspan').text(speaker);

            header.append('tspan')
                .attr('x', 0)
                .attr('dy', '1.5em')
                .style('font-size', '0.6em')
                .style('fill', '#555')
                .text(`${referenceData.episodeTitles[episode - 1]}`);
        }

        // effect cleanup function
        return () => {
            // clean up svg when unmounting
            svg.selectAll("*").remove();
        }
    }, [data]);

    
    return (
        <svg ref={chart}></svg>
    );
}

export default SentencesChart;
