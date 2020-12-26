import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function TopNouns(topNounData) {
    const chart = useRef(null);

    // initialise viz hook
    useEffect(() => {
        const margin = {
            top: 20,
            right: 50,
            bottom: 20, 
            left: 50
        };
        const height = 150 - margin.top - margin.bottom;
        const width = 150 - margin.left - margin.right;
        const svg = d3.select(chart.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.selectAll(".num-words-bar")
            .data(topNounData.topNounData)
            .enter()
            .append("text")
            .attr("x", 0)
            .attr("y", (d, i) => i * 20)
            .attr("fill", "#000")
            .attr("text-anchor", "middle")
            .text(d => d);

        // effect cleanup function
        return () => {
            // clean up svg when unmounting
            svg.selectAll("*").remove();
        }
    }, []);

    
    return (
        <svg ref={chart}></svg>
    );
}

export default TopNouns;
