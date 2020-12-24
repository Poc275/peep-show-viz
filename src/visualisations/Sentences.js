import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as d3 from "d3";
import SentencesChart from "./SentencesChart";
import Averages from "./Averages";
import InternalProportion from "./InternalProportion";
import "./Sentences.css";

function Sentences() {
    const schema = (d) => {
        return {
            index: +d.index,
            Episode: +d.Episode,
            Speaker: d.Speaker,
            Internal: d.Internal === "True" ? true : false,
            NumWords: +d.NumWords
        }
    };

    const { series } = useParams();
    const [datasets, setDatasets] = useState([]);

    // fetch data hook
    useEffect(() => {
        async function fetchSentenceData(url) {
            d3.csv(url, schema).then(data => {
                for(let i = 1; i <= 6; i++) {
                    const markData = data.filter(s => s.Speaker === "Mark" && s.Episode === i);
                    const jezData = data.filter(s => s.Speaker === "Jeremy" && s.Episode === i);
                    
                    setDatasets(prevDatasets => [...prevDatasets, [markData]]);
                    setDatasets(prevDatasets => [...prevDatasets, [jezData]]);
                }
            });
        }
        
        fetchSentenceData(`${process.env.PUBLIC_URL}/data/mark-vs-jez/mark-vs-jez-words-s${series}.csv`);
    }, [series]);

    
    return (
        <>
            { datasets.map((d, idx) => <SentencesChart key={idx} data={d[0]} />) }
            { datasets.map((d, idx) => <Averages key={idx} data={d[0]} />) }
            { datasets.map((d, idx) => <InternalProportion key={idx} data={d[0]} />) }
        </>
    );
}

export default Sentences;
