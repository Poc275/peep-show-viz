import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import SplashLogo from "./SplashLogo";
import "./Splash.css";

function Splash() {
    const history = useHistory();
    const [enterPressed, setEnterPressed] = useState(false);

    const splashBtnOnClick = (e) => {
        // set enter pressed for bulge animation in SplashLogo
        setEnterPressed(true);

        // play intermission tune
        const audioElement = new Audio(`${process.env.PUBLIC_URL}/audio/peepshow.mp3`);
        audioElement.addEventListener('loadeddata', () => {
            audioElement.play();
        });

        // when audio has finished navigate to main page
        audioElement.addEventListener('ended', () => {
            history.push("1/explore");
        });
    };

    return (
        <div id="splash-body">
            <span id="release-ribbon"><a href="https://poc275.me/peep-show/#alpha">Alpha - Find out more</a></span>

            <SplashLogo bulge={enterPressed} />

            <div id="splash-panel">
                <h1>A Data Visualisation Journey</h1>
                <blockquote>
                    <p><FontAwesomeIcon icon={faQuoteLeft} size="2x" /> Don't give me mottoes, Jeremy, I want figures, data.</p>
                    <footer>
                        <cite>&mdash; Mark Corrigan, Series 3 - Shrooming.</cite>
                    </footer>
                </blockquote>
                <p>Using transcripts from all nine series of Peep Show, this site analyses and visualises characters&rsquo; interactions, lines, words and other interesting 
                    facts from the show.
                </p>
                <p>Requires a minimum 1920x1080 resolution with sound enabled for the best experience.</p>
                <p>
                    <button id="splash-enter-btn" onClick={splashBtnOnClick}>
                        <span id="splash-enter-bg"></span>
                        <span id="splash-enter-text">Enter</span>
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Splash;