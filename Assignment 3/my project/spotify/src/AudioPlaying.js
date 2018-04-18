import React from "react";

function AudioPlaying({ track }) {
    return (
        <div>
            <audio controls src={track.preview_url} />
        </div>
    );
}

export default AudioPlaying;

