import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import './ChordDiagram.css';

function ChordDiagram() {
    const [data, setData] = useState(null);
    const svgContainer = useRef(null);

    // fetch data hook
    useEffect(() => {
        async function fetchChordData(url) {
            await fetch(url).then(res => res.json()).then(json => setData(json));
        }
        fetchChordData(`${process.env.PUBLIC_URL}/data/chord-data-series-one.json`);
    }, []);

    // initialise chord diagram hook
    useEffect(() => {
        const height = 400;
        const width = 800;
        const outerRadius = Math.min(width, height) * 0.5 - 50;
        const innerRadius = outerRadius - 10;
        const ribbon = d3.ribbon().radius(innerRadius - 1).padAngle(1 / innerRadius);
        const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
        const chord = d3.chord()
            .padAngle(10 / innerRadius)
            .sortSubgroups(d3.descending)
            .sortChords(d3.descending);
        const formatValue = d3.format(".1~%");
        const svg = d3.select(svgContainer.current).attr("viewBox", [-width / 2, -height / 2, width, height]);

        if(data) {
            const { chordData, people } = data;
            const names = people.map(p => p.name);
            const colours = people.map(p => p.colour);
            const avatars = people.map(p => p.avatar);
            const totalLines = people.map(p => p.totalLines);
            const spokeTo = people.map(p => p.spokeTo);

            const tickStep = d3.tickStep(0, d3.sum(chordData.flat()), 50);
            const colour = d3.scaleOrdinal(names, colours);
            const ticks = d => {
                const k = (d.endAngle - d.startAngle) / d.value;
                return d3.range(0, d.value, tickStep).map(value => {
                    return {value, angle: value * k + d.startAngle};
                });
            };

            const chords = chord(chordData);
            const group = svg.append("g")
                    .attr("font-size", 10)
                    .attr("font-family", "sans-serif")
                .selectAll("g")
                .data(chords.groups)
                .join("g")
                    .attr("class", "group")
                .on("mouseover", fadeIn(0.1))
                .on("mouseout", fadeOut(0.8));

            group.append("path")
                .attr("class", "arc")
                .attr("id", d => `arc-${d.index}`)
                // .attr("stroke", d => colour(people[d.index]))
                .attr("stroke", "#000")
                .attr("stroke-width", "0.2")
                .attr("fill", d => colour(names[d.index]))
                .attr("d", arc);

            group.append("title")
                .text(d => `${names[d.index]}
                ${formatValue(d.value)}`);

            const groupTick = group.append("g")
                .selectAll("g")
                .data(ticks)
                .join("g")
                    .attr("transform", d => `rotate(${d.angle * 180 / Math.PI - 90}) translate(${outerRadius}, 0)`);

            groupTick.append("line")
                .attr("stroke", "currentColor")
                .attr("x2", 3)
                .style("stroke-width", 0.2);
                  
            groupTick.append("text")
                .attr("x", 8)
                .attr("dy", "0.35em")
                .attr("font-size", 5)
                .attr("transform", d => d.angle > Math.PI ? "rotate(180) translate(-16)" : null)
                .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
                .text(d => formatValue(d.value));

            // names
            // group.append("text")
            //     .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
            //     .attr("dy", ".35em")
            //     .attr("class", "titles")
            //     .attr("font-size", 8)
            //     .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
            //     .attr("transform", d => `rotate(${d.angle * 180 / Math.PI - 90})` + `translate(${innerRadius + 40})` + (d.angle > Math.PI ? "rotate(180)" : ""))
            //     .text(d => `${names[d.index]}`);

            // avatars
            const arcLabels = group.append("g")
                .each((d) => { d.angle = (d.startAngle + d.endAngle) / 2; })
                .attr("dy", ".35em")
                .attr("class", "titles")
                .attr("transform", d => "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" + "translate(" + (innerRadius + 50) + ", 10)" + (d.angle > Math.PI ? "rotate(180)" : ""));

            arcLabels.append("clipPath")
                    .attr("id", d => `avatar-clip-${d.index}`)
                .append("circle")
                    .attr("cx", 10)
                    .attr("cy", 10)
                    .attr("r", 9);

            // the images are rotated to make them vertical by reversing the label rotation (multiply by -1)
            arcLabels.append("image")
                .attr("width", 20)
                .attr("height", 20)
                .attr("href", d => `${process.env.PUBLIC_URL}/avatars/${avatars[d.index]}`)
                .attr("clip-path", d => `url(#avatar-clip-${d.index})`)
                .attr("transform-origin", "10 10")
                .attr("transform", d => "rotate(" + ((d.angle * 180 / Math.PI - 90) * -1) + ")" + (d.angle > Math.PI ? "rotate(180)" : ""));

            // add an avatar image border
            arcLabels.append("circle")
                .attr("cx", 10)
                .attr("cy", 10)
                .attr("r", 9)
                .style("fill", "none")
                .style("stroke", d => colours[d.index]);

            svg.append("g")
                    .attr("fill-opacity", 0.8)
                .selectAll("path")
                .data(chords)
                .join("path")
                    .style("mix-blend-mode", "multiply")
                    // .attr("fill", d => colour(people[d.source.index]))
                    .style("fill", d => "url(#chordGradient-" + d.source.index + "-" + d.target.index + ")")
                    // .style("stroke", d => d3.rgb(colour(people[d.source.index])).darker())
                    .style("stroke", "#000")
                    .style("stroke-width", "0.2")
                    .attr("class", "chord")
                    .attr("d", ribbon)
                .append("title")
                .text(d => `${formatValue(d.source.value)} ${names[d.target.index]} → ${names[d.source.index]}${d.source.index === d.target.index ? "" : 
                    `\n${formatValue(d.target.value)} ${names[d.source.index]} → ${names[d.target.index]}`}`);

            const grads = svg.append("defs").selectAll("linearGradient")
                .data(chords)
                .enter().append("linearGradient")
                // create a unique id per chord
                .attr("id", d => "chordGradient-" + d.source.index + "-" + d.target.index)
                // use entire SVG for setting locations instead of the object bounding box
                .attr("gradientUnits", "userSpaceOnUse")
                // calculate x and y pos of starting point of gradient which is the centre point of the chord
                // chords has a start and end angle for both the source and target of the chord, so the centre angle is:
                // (end angle - start angle) / 2
                // cosine gets you the x pos and sine the y pos
                // as d3 calculates angles from the vertical subtract it from a quarter of a circle (Math.PI / 2)
                .attr("x1", (d, i) => innerRadius * Math.cos((d.source.endAngle - d.source.startAngle) / 2 + d.source.startAngle - Math.PI / 2))
                .attr("y1", (d, i) => innerRadius * Math.sin((d.source.endAngle - d.source.startAngle) / 2 + d.source.startAngle - Math.PI / 2))
                // and the same for the end point of the gradient
                .attr("x2", (d, i) => innerRadius * Math.cos((d.target.endAngle - d.target.startAngle) / 2 + d.target.startAngle - Math.PI / 2))
                .attr("y2", (d, i) => innerRadius * Math.sin((d.target.endAngle - d.target.startAngle) / 2 + d.target.startAngle - Math.PI / 2));

            // assign the linear gradient colours
            // start (0%)
            grads.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", d => colours[d.source.index]);

            // end (100%)
            grads.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", d => colours[d.target.index]);

            // converts the people a person spoke to to a nicely formatted string for the info panel
            function spokeToString(spokeToArray) {
                return spokeToArray.map((listener) => {
                    const spokeToSuffix = listener[1] > 1 ? `${listener[1]} times` : "once";
                    return `${listener[0]} ${spokeToSuffix}`;
                }).join(" | ");
            }

            function fadeIn(opacity) {
                return function(d, i) {
                    // info panel...
                    d3.select("#info-name").transition().duration(200).delay(200).style("opacity", 1).text(names[i.index]);
                    d3.select("#info-total-lines").transition().duration(200).delay(200).style("opacity", 1).text(`${totalLines[i.index]} Lines`);
                    d3.select("#info-spoke-to").transition().duration(200).delay(200).style("opacity", 1).text(`Spoke To ${spokeToString(spokeTo[i.index])}`);

                    // chords...
                    const filteredIndices = new Set()
                    
                    svg.selectAll("path.chord")
                        .filter(function(d) {
                            // collect indices of people they spoke to so we can also 
                            // hide the arcs as well as the chords
                            filteredIndices.add(i.index);
                            if(d.source.index === i.index || d.target.index === i.index) {
                                filteredIndices.add(d.source.index);
                                filteredIndices.add(d.target.index);
                            }
                            
                            // fade out chords if the person didn't converse with them
                            if(d.source.index !== i.index && d.target.index !== i.index) {
                                return true;
                            }
                            return false;
                        })
                    .transition()
                    .style("stroke-opacity", opacity)
                    .style("fill-opacity", opacity);
                    
                    // get inverse selection of filteredIndices as 
                    // we will fade everything else out except these
                    const inverseFilteredIndices = [];
                    for(let i = 0; i < people.length; i++) {
                        if(!filteredIndices.has(i)) {
                            inverseFilteredIndices.push(i);
                        }
                    }
                    
                    // fade the arcs as well...
                    inverseFilteredIndices.forEach(index => {
                        svg.select("#arc-" + index)
                            .transition()
                            .style("stroke-opacity", opacity)
                            .style("fill-opacity", opacity);
                    });
                }
            }

            function fadeOut(opacity) {
                return function(d, i) {
                    // info panel...
                    d3.select("#info-name").transition().duration(200).delay(200).style("opacity", 1).text("Hover over the characters for more info");
                    d3.select("#info-total-lines").transition().duration(200).delay(200).style("opacity", 1).text("");
                    d3.select("#info-spoke-to").transition().duration(200).delay(200).style("opacity", 1).text("");

                    // chords...
                    const filteredIndices = new Set()
                    
                    svg.selectAll("path.chord")
                        .filter(function(d) {
                            // collect indices of people they spoke to so we can also 
                            // hide the arcs as well as the chords
                            filteredIndices.add(i.index);
                            if(d.source.index === i.index || d.target.index === i.index) {
                                filteredIndices.add(d.source.index);
                                filteredIndices.add(d.target.index);
                            }
                            
                            // fade out chords if the person didn't converse with them
                            if(d.source.index !== i.index && d.target.index !== i.index) {
                                return true;
                            }
                            return false;
                        })
                        .transition()
                        .style("stroke-opacity", opacity)
                        .style("fill-opacity", opacity);
                    
                    // get inverse selection of filteredIndices as 
                    // we will fade everything else out except these
                    const inverseFilteredIndices = [];
                    for(let i = 0; i < people.length; i++) {
                        if(!filteredIndices.has(i)) {
                            inverseFilteredIndices.push(i);
                        }
                    }
                    
                    // fade the arcs as well...
                    inverseFilteredIndices.forEach(index => {
                        svg.select("#arc-" + index)
                            .transition()
                            .style("stroke-opacity", opacity)
                            .style("fill-opacity", opacity);
                    });
                }
            }
        }

        // effect cleanup function
        return () => {
            // clean up svg when unmounting
            svg.selectAll("*").remove();
        }
    }, [data]);

    return (
        <div>
            <div id="info-panel">
                <h4>Script Analysis</h4>
                <p id="info-name">Hover over the characters for more info</p>
                <p id="info-total-lines"></p>
                <p id="info-spoke-to"></p>
            </div>

            <svg ref={svgContainer}></svg>
        </div>
    );
}

export default ChordDiagram;
