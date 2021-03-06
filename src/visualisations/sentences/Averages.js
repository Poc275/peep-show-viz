import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function Averages(props) {
    const chart = useRef(null);
    const { data } = props;

    // initialise viz hook
    useEffect(() => {
        const margin = {
            top: 0,
            right: 0,
            bottom: 0, 
            left: 50
        };
        const height = 60 - margin.top - margin.bottom;
        const width = 100 - margin.left - margin.right;
        const svg = d3.select(chart.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        if(data) {
            // data is a number representing the average number of words per sentence
            // make a range between 1 and this number for a band scale
            const averageData = [];
            for(let i = 1; i <= data; i++) {
                averageData.push({
                    idx: i
                });
            }
            
            // x axis
            const x = d3.scaleLinear()
                .domain([0, 1])
                .range([0, width]);

            const y = d3.scaleBand()
                // .domain(averageData.map(d => d.idx))
                .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
                .range([height, 0]);

            // append axes
            const xAxis = d3.axisTop(x)
                .ticks(1)
                .tickValues([""])
                .tickSize(-height - margin.top - margin.bottom)
                // .tickSizeInner(0)
                .tickSizeOuter(0);

            svg.append("g")
                .attr("transform", "translate(0," + (-margin.top) + ")")
                .attr("class", "axis")
                .call(xAxis);

            svg.selectAll(".average-bars")
                .data(averageData)
                .enter()
                .append("rect")
                    .attr("x", 0)
                    .attr("y", d => y(d.idx))
                    .attr("width", d => x(0.5))
                    // .attr("height", y.step())
                    .attr("height", 2)
                    .attr("class", "average-bars")
                    .attr("transform", (d) => {
                        let width = x(0.5);
                        return `translate(-${width / 2}, 0)`
                    })
                    .attr("fill", "#333")
                    .on("mouseover", function(d, i) { d3.select(this).attr("opacity", "0.25") })
                    .on("mouseout", function(d, i) { d3.select(this).attr("opacity", "1") });
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

export default Averages;
