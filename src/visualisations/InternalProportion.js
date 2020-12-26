import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function InteralProportion(sentenceData) {
    const chart = useRef(null);
    const { data } = sentenceData;

    // initialise viz hook
    useEffect(() => {
        const margin = {
            top: 20,
            right: 50,
            bottom: 20, 
            left: 50
        };
        const height = 100 - margin.top - margin.bottom;
        const width = 150 - margin.left - margin.right;
        const svg = d3.select(chart.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // append axes
        const x = d3.scaleLinear()
                .domain([0, 1])
                .range([0, width]);
                
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

        if(data) {
            const maxRadius = 350;
            const internalPercentage = data.filter(d => d.Internal).length / data.length;
            const externalPercentage = data.filter(d => d.Internal === false).length / data.length;

            const internalRadius = Math.sqrt(internalPercentage * maxRadius);
            const externalRadius = Math.sqrt(externalPercentage * maxRadius);
            
            const internalArc = d3.arc().innerRadius(0).outerRadius(internalRadius).startAngle(180 * (Math.PI / 180)).endAngle(360 * (Math.PI / 180));
            const externalArc = d3.arc().innerRadius(0).outerRadius(externalRadius).startAngle(0).endAngle(180 * (Math.PI / 180));

            svg.append("path")
                .attr("d", internalArc)
                .attr("fill", "tomato");

            svg.append("path")
                .attr("d", externalArc)
                .attr("fill", "dodgerblue");
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

export default InteralProportion;
