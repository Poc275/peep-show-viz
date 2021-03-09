import React from "react";
import { useParams } from "react-router-dom";
import "./SearchResult.css";
import ReferenceData from "../../reference/ReferenceData";

function SearchResult(props) {
    const { series } = useParams();
    const speakerImg = `${props.res.Speaker.trim().replace(" ", "-").replace("'", "").replace("é", "e").toLowerCase()}.jpg`;
    const listenerImg = `${props.res.To.trim().replace(" ", "-").replace("'", "").replace("é", "e").toLowerCase()}.jpg`;
    const refData = new ReferenceData();

    return (
        <>
            <div className="search-result">
                <div className="avatar" 
                     style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/avatars/${speakerImg})`, border: `3px solid ${refData.characterColours[props.res.Speaker]}` }}>
                </div>
                
                <p className="search-result-text">
                    {props.res.Line.trim()}
                </p>
                
                <div className="avatar" 
                     style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/avatars/${listenerImg})`, border: `3px solid ${refData.characterColours[props.res.To]}` }}>
                </div>
            </div>
            <small>Episode {props.res.Episode} - {refData.episodeTitles[series][props.res.Episode - 1]} @ {props.res.Location}</small>
        </>
        
    );
}

export default SearchResult;
