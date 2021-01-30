import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as d3 from "d3";
import SentencesChart from "./SentencesChart";
import Averages from "./Averages";
import InternalProportion from "./InternalProportion";
import TopNouns from "./TopNouns";
import "./Sentences.css";

function Sentences() {
    const schema = (d) => {
        return {
            index: +d.index,
            Episode: +d.Episode,
            Speaker: d.Speaker,
            Internal: d.Internal === "True" ? true : false,
            NumWords: +d.NumWords,
            // Sentences: d.Sentences
            Lines: d.Lines
        }
    };

    const { series } = useParams();
    const [datasets, setDatasets] = useState([]);
    const [topNounDatasets, setTopNounDatasets] = useState([]);

    // fetch data hook
    useEffect(() => {
        async function fetchSentenceData(url) {
            const episodeDatasets = [];

            d3.csv(url, schema).then(data => {
                for(let i = 1; i <= 6; i++) {
                    episodeDatasets.push(data.filter(s => s.Speaker === "Mark" && s.Episode === i));
                    episodeDatasets.push(data.filter(s => s.Speaker === "Jeremy" && s.Episode === i));
                }
                setDatasets(episodeDatasets);
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
        
        fetchSentenceData(`${process.env.PUBLIC_URL}/data/sentences/lines-s${series}.csv`);
        fetchTopNounData(`${process.env.PUBLIC_URL}/data/sentences/top-nouns-s${series}.json`);
    }, [series]);

    return (
        <>
            { /* pass max number of lines to sentences chart to visualise the difference in number of lines spoken in each episode */ }
            { datasets.map((d, idx) => <SentencesChart key={idx} data={d} index={idx} maxLines={d3.max(datasets.map(d => d.length))} />) }
            { datasets.map((d, idx) => <Averages key={idx} data={d} />) }
            { datasets.map((d, idx) => <InternalProportion key={idx} data={d} />) }
            { topNounDatasets.map((d, idx) => <TopNouns key={idx} topNounData={d[0]} />) }
        </>
    );
}

export default Sentences;
