import React from "react";
import "./SearchResult.css";
import ReferenceData from "../../reference/ReferenceData";

function SearchResult(props) {
    const speakerImg = `${props.res.Speaker.trim().replace(" ", "-").replace("'", "").toLowerCase()}.jpg`;
    const listenerImg = `${props.res.To.trim().replace(" ", "-").replace("'", "").toLowerCase()}.jpg`;
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
            <small>Episode {props.res.Episode} - {props.res.Location}</small>
        </>
        
    );
}

export default SearchResult;
