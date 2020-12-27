import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function SentencesChart(sentenceData) {
    const chart = useRef(null);
    const { data, index } = sentenceData;
    const speaker = index % 2 === 0 ? "Mark" : "Jeremy";
    const episode = Math.floor((index / 2) + 1);

    // initialise viz hook
    useEffect(() => {
        const margin = {
            top: 60,
            right: 50,
            bottom: 20, 
            left: 50
        };
        const height = 800 - margin.top - margin.bottom;
        const width = 150 - margin.left - margin.right;
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

            const range = [];
            const minIdx = d3.min(data, d => d.index);
            for(let i = minIdx; i <= minIdx + 293; i++) {
                range.push(i);
            }

            // y axis (293 is largest num of words spoken)
            const y = d3.scaleBand()
                // .domain(data.map(d => d.index))
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
                    .attr("width", d => x(d.NumWords))
                    .attr("height", y.step())
                    // .attr("height", 2)
                    .attr("class", "num-words-bar")
                    .attr("transform", (d) => {
                        let width = x(d.NumWords);
                        return `translate(-${width / 2}, 0)`
                    })
                    .attr("fill", d => d.Internal ? "tomato" : "dodgerblue")
                    .on("mouseover", function(d, i) { d3.select(this).attr("opacity", "0.25") })
                    .on("mouseout", function(d, i) { d3.select(this).attr("opacity", "1") });

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
                .style('font-size', '0.8em')
                .style('fill', '#555')
                .text(`Episode ${episode}`);
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
