import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as d3 from "d3";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./WordSearch.css";
import SearchResult from "./SearchResult";

function WordSearch() {
    const { series } = useParams();
    const [data, setData] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [topWords, setTopWords] = useState(null);
    const [topWordUsage, setTopWordUsage] = useState(null);
    const [topWordSaidBy, setTopWordSaidBy] = useState(null);

    // fetch data hook
    useEffect(() => {
        async function fetchWordData(url) {
            d3.csv(url).then(data => setData(data));
        }
        fetchWordData(`${process.env.PUBLIC_URL}/data/S${series}_Lines.csv`);
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

    // animation hook
    // useEffect(() => {
    //     gsap.registerPlugin(ScrollTrigger);

    //     gsap.to(".top-word", {
    //         scrollTrigger: "#top-words",
    //         opacity: 1,
    //         duration: 3,
    //     });

    //     gsap.timeline({
    //         scrollTrigger: {
    //             trigger: ".container",
    //             // start: "center center",
    //             // end: "bottom top",
    //             scrub: true,
    //             pin: true,
    //         }
    //     });

    //     // gsap.to("#search-input", {
    //     //     scrollTrigger: "#top-words",
    //     //     display: "initial",
    //     //     duration: 3,
    //     //     delay: 3
    //     // });
    // }, [topWords]);

    const searchOnChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const showTopWordUsage = (event) => {
        const word = event.target.outerText.trim();
        const usage = topWords[word];
        setTopWordUsage(usage);

        const saidBy = [];
        for(const person in usage.who) {
            saidBy.push({
                saidBy: person,
                total: usage.who[person]
            });
        }
        setTopWordSaidBy(saidBy);
    };

    const clearTopWordUsage = (event) => {
        setTopWordUsage(null);
        setTopWordSaidBy(null);
    };

    return (
        <>
            <div className="container">
                <div id="top-words">
                    <p>Top words</p>
                    <h1>
                        {topWords ? Object.keys(topWords).map((word, idx) => {
                            return (
                                <span key={idx} className="top-word" onMouseOver={showTopWordUsage} onMouseLeave={clearTopWordUsage}>{word} </span>
                            );
                        }) : null}
                    </h1>
                    {
                        topWordUsage ? <p>Used {topWordUsage.total} times</p> : <p></p>
                    }
                    {
                        topWordSaidBy ? <p>Said by {topWordSaidBy.map(w => `${w.saidBy} ${w.total} times `)}</p> : <p></p>
                    }
                </div>
            </div>

            <div id="search-results">
                {searchResults.map((res, idx) => <SearchResult key={idx} res={res} />)}
            </div>

            <div id="search-input">
                <input 
                    type="text" 
                    name="search" 
                    placeholder="Search for a word or phrase"
                    value={searchTerm}
                    onChange={searchOnChange}
                />
                <label htmlFor="search">Search for a word or phrase</label>
            </div>
        </>
    );
}

export default WordSearch;
