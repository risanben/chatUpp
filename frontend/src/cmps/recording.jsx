import { useEffect, useState } from 'react';
import { useAudioRecorder } from 'react-audio-voice-recorder'

export function Recording() {

    const {
        startRecording,
        stopRecording,
        togglePauseResume,
        recordingBlob,
        isRecording,
        isPaused,
        recordingTime,
        mediaRecorder
    } = useAudioRecorder()

    const [isFirst, setIsFirst] = useState(true)
    const [mediaBlob, setMediaBlob] = useState(null)


    

    return (
        <section className="recorder">
            recorder
            <div onClick={stopRecording}>stop</div>
            {mediaBlob && <audio src={mediaBlob}></audio>}
        </section>
    )
}