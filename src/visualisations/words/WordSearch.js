import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as d3 from "d3";
import "./WordSearch.css";
import SearchResult from "./SearchResult";
import ReferenceData from "../../reference/ReferenceData";

function WordSearch() {
    const referenceData = new ReferenceData();
    const { series } = useParams();
    const [data, setData] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [topWords, setTopWords] = useState([]);
    const [topWordUsage, setTopWordUsage] = useState(null);
    const [topWordSaidBy, setTopWordSaidBy] = useState(null);
    const [seriesColour, setSeriesColour] = useState("#0C662D");

    // reference data hook
    useEffect(() => {
        setSeriesColour(referenceData.seriesColours[series - 1]);
    }, [series]);

    // fetch data hook
    useEffect(() => {
        async function fetchWordData(url) {
            d3.csv(url).then(data => setData(data));
        }
        fetchWordData(`${process.env.PUBLIC_URL}/data/lines/S${series}_Lines.csv`);
    }, [series]);

    // search hook
    useEffect(() => {
        if(data) {
            if(searchTerm.length >= 3) {
                const results = data.filter(({ Line }) => Line.trim().toLowerCase().includes(searchTerm));
                setSearchResults(results);
            }
        }
    }, [searchTerm, data]);

    // top words hook
    useEffect(() => {
        async function fetchTopWordsData(url) {
            await fetch(url).then(res => res.json()).then(json => setTopWords(json));
        }
        fetchTopWordsData(`${process.env.PUBLIC_URL}/data/words/top-words-analysis-s${series}.json`);
    }, [series]);

    const searchOnChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const showTopWordUsage = (event) => {
        // apply series colour underline to word on hover
        event.target.style.borderBottom = `5px solid ${seriesColour}`;

        const word = event.target.outerText.replace(',', '').trim();
        const usage = topWords[word];
        setTopWordUsage(usage);

        const saidBy = [];
        if(usage) {
            for(const person in usage.who) {
                saidBy.push({
                    saidBy: person,
                    total: usage.who[person]
                });
            }
        }
        setTopWordSaidBy(saidBy);
    };

    const clearTopWordUsage = (event) => {
        // clear underlined hover effect
        event.target.style.borderBottom = "none";
        setTopWordUsage(null);
        setTopWordSaidBy(null);
    };

    return (
        <div className="word-search-container">
            <h1 className="word-search-top-words">
                {topWords ? Object.keys(topWords).map((word, idx) => {
                    return (
                        <>
                            <span key={idx} className="top-word" onMouseOver={showTopWordUsage} onMouseLeave={clearTopWordUsage}>
                                {idx === 9 ? word : word + ','}</span>
                            <span> </span>
                        </>
                    );
                }) : null}
            </h1>
            {
                topWordUsage && topWordSaidBy ? 
                    <p>Said {topWordUsage.total} times by {topWordSaidBy.map((w, idx) => `${w.saidBy} (${w.total}) ${idx === topWordSaidBy.length - 1 ? '' : ', '}`)}</p> : 
                    <p></p>
            }

            <div id="search-input">
                <input style={{ borderBottom: `3px solid ${seriesColour}` }}
                    type="text" 
                    name="search" 
                    placeholder="Search for a word or phrase"
                    value={searchTerm}
                    onChange={searchOnChange}
                />
            </div>

            <div id="search-results">
                {searchResults.map((res, idx) => <SearchResult key={idx} res={res} />)}
            </div>
        </div>
    );
}

export default WordSearch;
