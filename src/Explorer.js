import { useParams } from "react-router-dom";
import ChordDiagram from './ChordDiagram';
import "./Explorer.css";

function Explorer() {
    const { series } = useParams();
    const seriesColours = [
        "#0C662D",
        "#005E8D",
        "#A9251E",
        "#882373",
        "#F07122",
        "#29AB87",
        "#5147BB",
        "#AC0C59",
        "#150B41"
    ];

    return (
        <div id="explorer-container" style={{ background: `radial-gradient(#fff, 85%, ${seriesColours[series - 1]})` }}>
            <ChordDiagram />
        </div>
    );
}

export default Explorer;
