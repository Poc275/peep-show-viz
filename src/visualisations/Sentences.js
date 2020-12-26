import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as d3 from "d3";
import SentencesChart from "./SentencesChart";
import Averages from "./Averages";
import InternalProportion from "./InternalProportion";
import "./Sentences.css";
import TopNouns from "./TopNouns";

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
    const [topNounDatasets, setTopNounDatasets] = useState([]);

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

        async function fetchTopNounData(url) {
            d3.json(url).then(data => {
                for(let i = 1; i <= 6; i++) {
                    const markTopNouns = data["Mark"][`Episode_${i}`];
                    const jezTopNouns = data["Jeremy"][`Episode_${i}`];
                    
                    setTopNounDatasets(prevDatasets => [...prevDatasets, [markTopNouns]]);
                    setTopNounDatasets(prevDatasets => [...prevDatasets, [jezTopNouns]]);
                }
            });
        }
        
        fetchSentenceData(`${process.env.PUBLIC_URL}/data/mark-vs-jez/mark-vs-jez-words-s${series}.csv`);
        fetchTopNounData(`${process.env.PUBLIC_URL}/data/mark-vs-jez/top-nouns-s${series}.json`);
    }, [series]);

    
    return (
        <>
            { datasets.map((d, idx) => <SentencesChart key={idx} data={d[0]} index={idx} />) }
            { datasets.map((d, idx) => <Averages key={idx} data={d[0]} />) }
            { datasets.map((d, idx) => <InternalProportion key={idx} data={d[0]} />) }
            { topNounDatasets.map((d, idx) => <TopNouns key={idx} topNounData={d[0]} />) }
        </>
    );
}

export default Sentences;
