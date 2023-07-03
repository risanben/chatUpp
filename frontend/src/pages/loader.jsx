
import { useEffect, useState } from 'react'
import { Comment } from 'react-loader-spinner'

export function Loader() {
    let intervalId
    const [progressWidth, setWidth] = useState(10)

    useEffect(() => {
        startProgress();
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [progressWidth]); // Add progressWidth as a dependency


    function startProgress() {
        intervalId = setInterval(handleProgress, 300);
    }

    function handleProgress() {
        setWidth(prevWidth => {
            if (prevWidth < 100) {
                return prevWidth + 10;
            } else {
                return 10;
            }
        });
    }

    return (
        <section className="loader flex justify-center align-center">
            <div className="container flex column align-center justify-center">
                <Comment
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="comment-loading"
                    wrapperStyle={{}}
                    wrapperClass="comment-wrapper"
                    color="#fff"
                    backgroundColor="#00a8845f"
                />

                <div className="progress-bar">
                    <div className="progress" style={{ width: `${progressWidth}%` }}></div>
                </div>

                <div className='head'>WebChat</div>
                <div className='txt'>Chat with the people you like most</div>
            </div>
        </section>
    )
}