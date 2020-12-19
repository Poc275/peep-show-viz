import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import * as d3 from "d3";

function Locations() {
    const [data, setData] = useState(null);
    const chart = useRef(null);
    const { series } = useParams();

    // fetch data hook
    useEffect(() => {
        async function fetchLocationData(url) {
            // await fetch(url).then(res => res.json()).then(json => setData(json));
            d3.csv(url).then(data => setData(data));
        }
        // fetchLocationData(`${process.env.PUBLIC_URL}/data/location-data-time-order-series-${series}.json`);
        fetchLocationData(`${process.env.PUBLIC_URL}/data/test.csv`);
    }, [series]);

    // initialise chord diagram hook
    useEffect(() => {
        const margin = {
            top: 10,
            right: 30,
            bottom: 20, 
            left: 50
        };
        const height = 500 - margin.top - margin.bottom;
        const width = 800 - margin.left - margin.right;
        const svg = d3.select(chart.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        if(data) {
            // const { locationData, locations } = data;
            // const subgroups = ["lines"];
            // const groups = d3.map(locationData, d => d.loc).keys();
            
            // console.log(subgroups);
            // console.log(groups);

            const locations = data.columns.slice(1);

            // x axis
            const x = d3.scaleLinear()
                .domain([0, 150])
                .range([0, width]);

            // y axis
            const y = d3.scaleBand()
                .domain([1, 2, 3, 4, 5, 6])
                .range([height, 0]);

            // append axes
            svg.append("g")
                .call(d3.axisBottom(x));

            svg.append("g")
                .call(d3.axisLeft(y));

            const colour = d3.scaleOrdinal()
                .domain(locations)
                .range(d3.schemeCategory10);

            const stackedData = d3.stack()
                .keys(locations)
                (data);

            // console.log(stackedData);
            
            svg.append("g")
                .selectAll("g")
                .data(stackedData)
                .enter().append("g")
                        .attr("fill", d => colour(d.key))
                        .classed("bar-group", true)
                    .selectAll("rect")
                    .data(d => d, d => d.data)
                    .enter().append("rect")
                        .attr("x", d => x(d[0]))
                        .attr("y", (d, i) => y(i + 1))
                        .attr("height", y.bandwidth())
                        .attr("width", d => x(d[1]) - x(d[0]))
                        .classed("bar", true)
                        .attr("id", (d, i) => locations[i]);
        }

        // effect cleanup function
        return () => {
            // clean up svg when unmounting
            svg.selectAll("*").remove();
        }
    }, [data]);

    const sortByLocation = (event) => {
        const margin = {
            top: 10,
            right: 30,
            bottom: 20, 
            left: 50
        };
        const height = 500 - margin.top - margin.bottom;
        const width = 800 - margin.left - margin.right;
        
        // x axis
        const x = d3.scaleLinear()
            .domain([0, 150])
            .range([0, width]);

        // y axis
        const y = d3.scaleBand()
            .domain([1, 2, 3, 4, 5, 6])
            .range([height, 0]);

        const groups = d3.selectAll("g.bar-group")
            .data(d3.stack().keys(data.columns.slice(1)).order(d3.stackOrderAscending)(data));
            // .attr("fill", d => colour(d.key))
        // .transition().duration(500);

        const bars = groups.selectAll(".bar")
            .data(d => d)
            .enter().append("rect")
                .attr("x", d => x(d[0]))
                .attr("y", (d, i) => y(i + 1))
                .attr("height", y.bandwidth())
                .attr("width", d => x(d[1]) - x(d[0]));
    };
    
    return (
        <>
            <svg ref={chart}></svg>
            <button onClick={sortByLocation}>Sort by Location</button>
        </>
    );
}

export default Locations;
