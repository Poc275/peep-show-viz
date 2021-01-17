import * as d3 from "d3";

class ChordDiagramTutorial {
    constructor() {
        this.tutorialOne = () => {
            d3.select("#chord-viz")
                .selectAll("path.chord")
                .style("stroke-opacity", 0)
                .style("fill-opacity", 0);

            d3.select("#chord-viz")
                .selectAll("path.arc")
                .style("stroke-opacity", 0)
                .style("fill-opacity", 0);

            d3.select("#chord-viz")
                .selectAll(".avatar")
                .style("stroke-opacity", 0)
                .style("fill-opacity", 0)
                .style("opacity", 0);

            d3.select("#chord-viz")
                .selectAll(".axis")
                .style("stroke-opacity", 0)
                .style("fill-opacity", 0)
                .style("opacity", 0);
        };

        this.tutorialTwo = () => {
            d3.select("#chord-viz")
                .select("path.arc")
                .transition()
                .duration(1000)
                .style("stroke-opacity", 0.8)
                .style("fill-opacity", 0.8);

            d3.select("#chord-viz")
                .select(".axis")
                .transition()
                .duration(1000)
                .style("stroke-opacity", 0.8)
                .style("fill-opacity", 0.8)
                .style("opacity", 0.8);

            d3.select("#chord-viz")
                .select(".avatar")
                .transition()
                .duration(1000)
                .style("stroke-opacity", 1)
                .style("fill-opacity", 1)
                .style("opacity", 1);
        };

        this.tutorialThree = (series) => {
            let selectId = "1";
            if(series === "3") {
                // Mark is the third speaker in this series
                selectId = "2";
            }
            else if(series === "6") {
                // Jez is the third speaker in this series
                selectId = "2";
            }

            d3.select("#chord-viz")
                .select("path.chord")
                .transition()
                .duration(1000)
                .style("stroke-opacity", 0.8)
                .style("fill-opacity", 0.8);

            d3.select("#chord-viz")
                .select(`#arc-${selectId}`)
                .transition()
                .duration(1000)
                .style("stroke-opacity", 0.8)
                .style("fill-opacity", 0.8);

            d3.select("#chord-viz")
                .select(`#axis-${selectId}`)
                .transition()
                .duration(1000)
                .style("stroke-opacity", 0.8)
                .style("fill-opacity", 0.8)
                .style("opacity", 0.8);

            d3.select("#chord-viz")
                .select(`#avatar-${selectId}`)
                .transition()
                .duration(1000)
                .style("stroke-opacity", 1)
                .style("fill-opacity", 1)
                .style("opacity", 1);

            if(series === "4") {
                // select Jez as he's the third person in this series
                d3.select("#chord-viz")
                    .select("#arc-2")
                    .transition()
                    .duration(1000)
                    .style("stroke-opacity", 0.8)
                    .style("fill-opacity", 0.8);

                d3.select("#chord-viz")
                    .select("#axis-2")
                    .transition()
                    .duration(1000)
                    .style("stroke-opacity", 0.8)
                    .style("fill-opacity", 0.8)
                    .style("opacity", 0.8);

                d3.select("#chord-viz")
                    .select("#avatar-2")
                    .transition()
                    .duration(1000)
                    .style("stroke-opacity", 1)
                    .style("fill-opacity", 1)
                    .style("opacity", 1);
            }

            if(series === "8") {
                // select Mark as he's the third person in this series
                d3.select("#chord-viz")
                    .select("#arc-2")
                    .transition()
                    .duration(1000)
                    .style("stroke-opacity", 0.8)
                    .style("fill-opacity", 0.8);

                d3.select("#chord-viz")
                    .select("#axis-2")
                    .transition()
                    .duration(1000)
                    .style("stroke-opacity", 0.8)
                    .style("fill-opacity", 0.8)
                    .style("opacity", 0.8);

                d3.select("#chord-viz")
                    .select("#avatar-2")
                    .transition()
                    .duration(1000)
                    .style("stroke-opacity", 1)
                    .style("fill-opacity", 1)
                    .style("opacity", 1);
            }
        };

        this.tutorialFour = () => {
            d3.select("#chord-viz")
                .selectAll("path.chord")
                .filter(function(d) {
                    // return internal thought chords only which are where the source and target are the same
                    // also just return mark and jez's mounds as some "Others" speak to each other too
                    // (Mark & Jez are always in the first 3 speakers i.e. index 0, 1, or 2)
                    return d.source.index === d.target.index && (d.source.index === 0 || d.source.index === 1 || d.source.index === 2);
                })
                .transition()
                .duration(2000)
                .ease(d3.easeLinear)
                .style("stroke-opacity", 1)
                .style("fill-opacity", 1);
        };

        this.tutorialFive = () => {
            d3.select("#chord-viz")
                .selectAll("path.chord")
                .transition()
                .style("stroke-opacity", 1)
                .style("fill-opacity", 1);

            d3.select("#chord-viz")
                .selectAll("path.arc")
                .transition()
                .style("stroke-opacity", 1)
                .style("fill-opacity", 1);

            d3.select("#chord-viz")
                .selectAll(".avatar")
                .transition()
                .style("stroke-opacity", 1)
                .style("fill-opacity", 1)
                .style("opacity", 1);

            d3.select("#chord-viz")
                .selectAll(".axis")
                .transition()
                .style("stroke-opacity", 1)
                .style("fill-opacity", 1)
                .style("opacity", 1);

            // now allow pointer events for hovering
            d3.select("#fig").style("pointer-events", "all");
        };
    }
}

export default ChordDiagramTutorial;