import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import * as d3 from "d3";
import LocationRadialBubbleChart from "./LocationRadialBubbleChart";

function Locations() {
    const [data, setData] = useState(null);
    const [longest, setLongest] = useState(0);
    const { series } = useParams();

    // fetch data hook
    useEffect(() => {
        async function fetchLocationData(url) {
            d3.json(url).then(data => {
                setData(data)
                // get length of longest locations
                setLongest(d3.max(Object.values(data).map(d => d.length)));
            });
        }
        fetchLocationData(`${process.env.PUBLIC_URL}/data/locations/S${series}_Locations.json`);
    }, [series]);
    
    return (
        <>
            { data && longest ? Object.keys(data).map(d => <LocationRadialBubbleChart data={data[d]} longest={longest} />) : null }
        </>
    );
}

export default Locations;
