import { useState, useEffect } from "react";
import "./Tetris.css"
function Tetris () {
    // Create a state variable called isRunning and set it to false when the page loads
    // When they click the start button, we'll use setIsRunning to set it to true
    const [isRunning, setIsRunning] = useState(false);
    const [position, setPosition] = useState(0);
    // The code in the useEffect will run whenever isRunning changes
    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setPosition(prevPosition => {
                    if (prevPosition >= 22) {
                        clearInterval(interval);
                        return prevPosition;
                    }
                    return prevPosition + 1;
                });
            }, 1000);
        }
        // This return runs when the page changes or unloads
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isRunning]);
    function handleClick() {
        setIsRunning(true);
    }
    
    return (
        <div className="blackBackground">

<div className="darkblueContainertwo" style={{ top: `${position * 30}px`}}>
        <div className="box darkblue"></div>
        <div className="box darkblue"></div>
        <div className="box orange"></div>
        <div className="box black"></div>
        <div className="box green"></div>
        <div className="box green"></div>
        <div className="box red"></div>
        <div className="box red"></div>
        <div className="box purple"></div>
        <div className="box black"></div>
    </div>
    {/* When isRunning is not true, render the start button */}
    {!isRunning && 
    <div class="startContainer">
        <button onClick={handleClick} class="start">Start</button>
    </div>  
    }  
    
    <div>
    <div className="darkblueContainer">
        <div className="box darkblue"></div>
        <div className="box darkblue"></div>
        <div className="box orange"></div>
        <div className="box black"></div>
        <div className="box green"></div>
        <div className="box green"></div>
        <div className="box red"></div>
        <div className="box red"></div>
        <div className="box purple"></div>
        <div className="box black"></div>

    </div>
    
    <div className="darkblueContainer">
        <div className="box darkblue"></div>
        <div className="box darkblue"></div>
        <div className="box orange"></div>
        <div className="box orange"></div>
        <div className="box orange"></div>
        <div className="box green"></div>
        <div className="box black"></div>
        <div className="box red"></div>
        <div className="box red"></div>
        <div className="box orange"></div>
    </div>
</div>
    </div>   
   
    )
}

export default Tetris