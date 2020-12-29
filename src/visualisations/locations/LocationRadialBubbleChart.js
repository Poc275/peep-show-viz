import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function LocationRadialBubbleChart(props) {
    const chart = useRef(null);
    const { data } = props;

    // initialise chart hook
    useEffect(() => {
        const margin = {
            top: 10,
            right: 10,
            bottom: 10, 
            left: 10
        };
        const height = 600 - margin.top - margin.bottom;
        const width = 600 - margin.left - margin.right;
        const svg = d3.select(chart.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + (margin.left + width / 2) + "," + (margin.top + height / 2) + ")");

        if(data) {
            const maxRadius = 200;
            const padding = 15;
            const bubbleSizeFudge = 2;
            const locations = data.flatMap(d => Object.keys(d));
            const locationLengths = data.flatMap(d => Object.values(d));
            const uniqueLocations = locations.reduce((a, b) => {
                if(a.indexOf(b) < 0) {
                    a.push(b);
                }
                return a;
            }, []);

            const locationRadii = new Object();
            uniqueLocations.forEach((loc, idx) => locationRadii[loc] = maxRadius - idx * padding);
            
            const theta = 2 * Math.PI / locations.length;
            const arcGenerator = d3.arc()
                .innerRadius(0)
                .outerRadius(d => d)
                .startAngle(0)
                .endAngle(Math.PI * 2);

            // grid arcs
            svg.selectAll(".grid-loc-arc")
                .data(Object.values(locationRadii))
                .enter()
                .append("path")
                .attr("d", arcGenerator)
                .attr("class", "grid-loc-arc")
                .attr("fill", "none")
                .attr("stroke", "#999");

            // colour scheme
            const colours = d3.scaleOrdinal(d3.schemeCategory10).domain(uniqueLocations);

            // bubbles
            svg.selectAll('.loc-circle')
                .data(locations)
                .enter()
                .append("circle")
                .attr("r", (d, i) => Math.sqrt(locationLengths[i]) * bubbleSizeFudge)
                .attr("cx", (d, i) => locationRadii[d] * Math.cos(i * theta))
                .attr("cy", (d, i) => locationRadii[d] * Math.sin(i * theta))
                .attr("class", "loc-circle")
                .attr("fill", d => colours(d))
                .attr("transform", "rotate(-90)");
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

export default LocationRadialBubbleChart;
