import React from "react";
import "./SearchResult.css";

function SearchResult(props) {
    const speakerImg = `${props.res.Speaker.trim().replace(" ", "-").replace("'", "").toLowerCase()}.jpg`;
    const listenerImg = `${props.res.To.trim().replace(" ", "-").replace("'", "").toLowerCase()}.jpg`;

    return (
        <>
            <div className="search-result">
                <div className="avatar" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/avatars/${speakerImg})` }}></div>
                <p>{props.res.Line.trim()}</p>
                <div className="avatar" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/avatars/${listenerImg})` }}></div>
            </div>
            <small>Episode {props.res.Episode} - {props.res.Location}</small>
        </>
        
    );
}

export default SearchResult;
