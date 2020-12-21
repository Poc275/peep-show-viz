import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import * as d3 from "d3";

function Timeline() {
    const [data, setData] = useState(null);
    const chart = useRef(null);
    const { series } = useParams();
    const [initialisedSvg, setInitialisedSvg] = useState(null);
    const [xAxisFunction, setXAxisFunction] = useState(null);
    const [yAxisFunction, setYAxisFunction] = useState(null);

    // fetch data hook
    useEffect(() => {
        async function fetchTimelineData(url) {
            d3.json(url).then(data => setData(data));
        }
        fetchTimelineData(`${process.env.PUBLIC_URL}/data/timelines/timelines_s${series}.json`);
    }, [series]);

    // initialise viz hook
    useEffect(() => {
        const margin = {
            top: 10,
            right: 30,
            bottom: 20, 
            left: 100
        };
        const height = 800 - margin.top - margin.bottom;
        const width = 1200 - margin.left - margin.right;
        const svg = d3.select(chart.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        setInitialisedSvg(svg);

        if(data) {
            const { timelines, markers } = data;

            // x axis
            const x = d3.scaleLinear()
                .domain([1, d3.max(timelines, d => d.end)])
                .range([0, width]);
            
            // setting a function in a useState hook will evaluate the function and 
            // use the return value as the initial state, so instead wrap in an anonymous function
            setXAxisFunction(() => x);

            // y axis
            const y = d3.scaleBand()
                .domain(timelines.map(d => d.name))
                .range([0, height])
                .padding(1);

            setYAxisFunction(() => y);

            // append axes
            const xAxis = d3.axisBottom(x)
                .tickValues(markers)
                .tickFormat((d, i) => `Episode ${i + 1}`)
                .tickSize(-height);

            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .call(d3.axisLeft(y));

            // lollipop lines
            svg.selectAll("lollipop-line")
                .data(timelines)
                .enter()
                .append("line")
                    .attr("x1", d => x(d.start))
                    .attr("x2", d => x(d.end))
                    .attr("y1", d => y(d.name))
                    .attr("y2", d => y(d.name))
                    .attr("class", "lollipop-line")
                    .attr("stroke", "grey")
                    .attr("stroke-width", "1px");
            
            // lollipop circles
            svg.selectAll("lollipop-circle")
                .data(timelines)
                .enter()
                .append("circle")
                    .attr("cx", d => x(d.start))
                    .attr("cy", d => y(d.name))
                    .attr("r", 6)
                    .attr("class", "lollipop-circle")
                    .style("fill", "#69b3a2");
        }

        // effect cleanup function
        return () => {
            // clean up svg when unmounting
            svg.selectAll("*").remove();
        }
    }, [data]);

    
    const timelinePerEpisode = (e) => {
        const lines = initialisedSvg.selectAll(".lollipop-line")
            .data(data.episodeTimelines);

        console.log(lines);

        lines.enter()
            .append("line")
            .merge(lines)
            .transition()
            .duration(2000)
                .attr("x1", d => xAxisFunction(d.start))
                .attr("x2", d => xAxisFunction(d.end))
                .attr("y1", d => yAxisFunction(d.name))
                .attr("y2", d => yAxisFunction(d.name))
                .attr("class", "lollipop-line")
                .attr("stroke", "red")
                .attr("stroke-width", "1px");
        
        lines.exit().remove();

        const circles = initialisedSvg.selectAll(".lollipop-circle")
            .data(data.episodeTimelines);

        circles.enter()
            .append("circle")
            .merge(circles)
            .transition()
            .duration(2000)
                .attr("cx", d => xAxisFunction(d.start))
                .attr("cy", d => yAxisFunction(d.name))
                .attr("r", 6)
                .attr("class", "lollipop-circle")
                .style("fill", "blue");

        circles.exit().remove();
    };

    
    return (
        <>
            <svg ref={chart}></svg>
            <button onClick={timelinePerEpisode}>Per Episode</button>
        </>
    );
}

export default Timeline;
