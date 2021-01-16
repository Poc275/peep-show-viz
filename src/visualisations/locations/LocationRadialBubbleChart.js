import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function LocationRadialBubbleChart(props) {
    const chart = useRef(null);
    const { data, longest } = props;

    // initialise chart hook
    useEffect(() => {
        const margin = {
            top: 10,
            right: 10,
            bottom: 10, 
            left: 10
        };
        const height = 250 - margin.top - margin.bottom;
        const width = 250 - margin.left - margin.right;
        const svg = d3.select(chart.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + (margin.left + width / 2) + "," + (margin.top + height / 2) + ")");

        if(data) {
            const maxRadius = 100;
            const padding = 10;
            const bubbleSizeFudge = 5;
            const locations = data.flatMap(d => Object.keys(d));
            const locationLengths = data.flatMap(d => Object.values(d));
            const uniqueLocations = locations.reduce((a, b) => {
                if(a.indexOf(b) < 0) {
                    a.push(b);
                }
                return a;
            }, []);

            const locationRadii = {};
            uniqueLocations.forEach((loc, idx) => locationRadii[loc] = maxRadius - idx * padding);

            // event handlers
            const mouseover = (event, data) => {
                d3.select(event.currentTarget).style("fill-opacity", 1);
            };

            const mouseout = (event, data) => {
                d3.select(event.currentTarget).style("fill-opacity", 0.7);
            };
            
            // make each chart use 360deg or normalise to longest episode?
            // const theta = 2 * Math.PI / locations.length;
            const theta = 2 * Math.PI / longest;
            const arcGenerator = d3.arc()
                .innerRadius(0)
                .outerRadius(d => d)
                .startAngle(0)
                .endAngle(theta * locations.length - theta);

            // grid arcs
            svg.selectAll(".grid-loc-arc")
                .data(Object.values(locationRadii))
                .enter()
                .append("path")
                .attr("d", (d) => {
                    const arc = arcGenerator(d);
                    // just the arcs, not the line "caps"
                    return arc.split("L")[0];
                })
                .attr("class", "grid-loc-arc")
                .attr("fill", "none")
                .attr("stroke", "#999")
                .style("stroke-dasharray", ("10,3"))
                .style("stroke-opacity", 0.3);

            // colour scheme
            const colours = d3.scaleOrdinal(d3.schemeCategory10).domain(uniqueLocations);

            // bubbles
            svg.selectAll('.loc-circle')
                .data(locations)
                .enter()
                .append("circle")
                .attr("r", (d, i) => Math.sqrt(locationLengths[i] * bubbleSizeFudge))
                .attr("cx", (d, i) => locationRadii[d] * Math.cos(i * theta))
                .attr("cy", (d, i) => locationRadii[d] * Math.sin(i * theta))
                .attr("class", "loc-circle")
                .attr("fill", d => colours(d))
                .attr("transform", "rotate(-90)")
                .style("fill-opacity", 0.7)
                .style("mix-blend-mode", "color-burn")
                .on("mouseover", mouseover)
                .on("mouseout", mouseout);

            
        }

        // effect cleanup function
        return () => {
            // clean up svg when unmounting
            svg.selectAll("*").remove();
        }
    }, [data, longest]);
    
    return (
        <svg ref={chart} style={{ display: "inline-block" }}></svg>
    );
}

export default LocationRadialBubbleChart;
