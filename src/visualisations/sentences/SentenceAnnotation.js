import React, { useEffect, useState } from "react";
import * as d3 from "d3";

function SentenceAnnotation(props) {
    const { annotation } = props;
    const [isPlaying, setIsPlaying] = useState(false);

    const playAudio = () => {
        const audioElement = new Audio(`${process.env.PUBLIC_URL}/audio/${annotation.audio}`);

        audioElement.addEventListener('loadeddata', () => {
            // get existing width of sentence bar
            const width = d3.select(`#sentence-${annotation.index}`).node().getBoundingClientRect().width;
            // revert width to zero
            d3.select(`#sentence-${annotation.index}`)
                .attr("width", 0);

            audioElement.play();
            setIsPlaying(true);

            const intervalId = setInterval(function () {
                const percent = audioElement.currentTime / audioElement.duration * 100;
                const delta = audioElement.currentTime / audioElement.duration * width;

                // grow sentence bar width as audio plays
                d3.select(`#sentence-${annotation.index}`)
                    .attr("width", delta);

                // linear gradient progress bar on text
                d3.select(`#sound-clip-${annotation.index}`)
                    .style('background', 'linear-gradient(to right, rgb(30,144,255)' + ' ' + percent + '%,' + 'rgba(30,144,255,0.5)' + ' ' + (percent + 0.5) + '%)');
                
                if (audioElement.currentTime === audioElement.duration) {
                    clearInterval(intervalId);
                    setIsPlaying(false);
                }
            });
        });
    };

    return (
        <>
            <p>{annotation.annotation}</p>

            <p>
                <span className="sound-clip" id={`sound-clip-${annotation.index}`}>
                    <span className="sound-clip-control" onClick={playAudio}>
                        { isPlaying ? " ❙❙ " : " ▶ " }
                    </span>{annotation.sentence}
                </span>
            </p>
        </>
    );
}

export default SentenceAnnotation;
