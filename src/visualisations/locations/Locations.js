import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import * as d3 from "d3";
import LocationRadialBubbleChart from "./LocationRadialBubbleChart";

function Locations() {
    const [data, setData] = useState(null);
    const { series } = useParams();

    // fetch data hook
    useEffect(() => {
        async function fetchLocationData(url) {
            d3.json(url).then(data => setData(data));
        }
        fetchLocationData(`${process.env.PUBLIC_URL}/data/locations/S${series}_Locations.json`);
    }, [series]);
    
    return (
        <>
            <h2>Locations</h2>
            { data ? Object.keys(data).map(d => <LocationRadialBubbleChart data={data[d]} />) : null }
        </>
    );
}

export default Locations;
