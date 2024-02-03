import { useState, useEffect } from "react";
import "./Tetris.css"
function Tetris () {
    // Create a state variable called isRunning and set it to false when the page loads
    // When they click the start button, we'll use setIsRunning to set it to true
    const [isRunning, setIsRunning] = useState(false);
    // Our game board will be 20x10 and it fills the array with nothing at the start.
    const [grid, setGrid] = useState(Array(20).fill(null).map(() => Array(10).fill(null)));
    // State for which block is currently falling
    const [fallingBlock, setFallingBlock] = useState({
        position: { x: 3, y: 0 }, // Coordinates for this block
        color: 'blue',
        shape: [
            [1],
            [1],
            [1],
            [1],
            [1] // Representing a line block
        ],
    });
    
    // The code in the useEffect will run whenever isRunning changes
    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            blockDrop();
        }, (1000));
        
        return () => clearInterval(interval);
        
    }, [isRunning]); // Reacting only to changes in the grid might not be sufficient if fallingBlock's shape or position affects logic.

    function handleClick() {
        setIsRunning(true);
    }

    function getNewBlock() {
        let newShape;
        const colors = ['orange', 'blue', 'red'];
        const shapes = [
            [[1, 1, 1, 1]],
            [
                [1],
                [1],
                [1],
                [1]
            ]
        ]

        newShape = {
            color: colors[Math.floor(Math.random() * colors.length)],
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            position: { x: 3, y: 0 }
        }

        console.log(newShape);
        setFallingBlock(newShape);
    }

    function blockDrop() {
        setFallingBlock(prevBlock => {
            // Calculate the new position first
            const newY = prevBlock.position.y + 1;
            let collision = false;
            prevBlock.shape.forEach((row, rowIndex) => {
                row.forEach((cell, cellIndex) => {
                    if (cell) {
                        const gridX = prevBlock.position.x + cellIndex;
                        const gridY = prevBlock.position.y + rowIndex + 1; // Check the next row down
                        if (gridY >= 20 || (grid[gridY] && grid[gridY][gridX] !== null)) {
                            collision = true;
                        }
                    }
                })
            })
            if (collision) {
                // Update the grid to include the block since it's stopping
                setGrid(prevGrid => {
                    const newGrid = prevGrid.map(row => [...row]); // Deep copy the grid
                    prevBlock.shape.forEach((row, rowIndex) => {
                        row.forEach((cell, cellIndex) => {
                            if (cell) { // If part of the block shape
                                const gridY = prevBlock.position.y + rowIndex;
                                const gridX = prevBlock.position.x + cellIndex;
                                if (newGrid[gridY] && newGrid[gridY][gridX] !== undefined) {
                                    newGrid[gridY][gridX] = prevBlock.color; // Update the grid cell to block's color
                                }
                            }
                        });
                    });
                    console.log(newGrid);
                    return newGrid; // Return the updated grid
                });
                return {
                    position: {x: 3, y: 0},
                    color: 'orange',
                    shape: [
                        [1, 1, 1, 1]
                    ],
                }
            } else {
                // If block hasn't stopped, update its position
                return {
                    ...prevBlock,
                    position: { ...prevBlock.position, y: newY }
                };
            }
        });
    }

    function checkForMatches(grid) {
        // console.log(grid);
        if (!grid || !grid.length || !grid[0]) {
            console.error("Grid is not initialized properly.");
            return; // Exit the function to avoid further errors
        }        
        // Variable to hold the coordinates {x,y} of which blocks to clear
        let toClear = [];

        // Check the rows for matches
        // Loops through each row
        for (let y = 0; y < grid.length; y++) {
            // Loops through the columns of the current row.
            for (let x = 0; x <= grid[x].length - 5; x++) {
                let match = true;
                // Loops through each block and compares it to the next
                for (let i = 0; i < 4; i++) {
                    if (grid[y][x + i] === null || grid[y][x + i] !== grid[y][x + i + 1]) {
                        match = false;
                        break;
                    } 
                }
                if (match) {
                    for (let i = 0; i < 5; i++) {
                        toClear.push({ x: x + i, y: y});
                    }
                }
            }
        }

        // For columns
        for (let x = 0; x < grid[0].length; x++) {
            for (let y = 0; y <= grid.length - 5; y++) {
                let match = true;
                for (let i = 0; i < 4; i++) {
                    if (grid[y + 1][x] === null || grid[y + 1][x] !== grid[y + i + 1][x]) {
                        match = false;
                        break;
                    } 
                }
                if (match) {
                    for (let i = 0; i < 5; i++) {
                        toClear.push({ x: x, y: y + 1});
                    }
                }
            }
        }

        toClear.forEach(position => {
            grid[position.y][position.x] = null;
        });

        return grid;
    }

    return (
        <div>
            <div className="blackBackground">
                <div className="grid">
                    {grid.map((row, rowIndex) => (
                        <div key={rowIndex} className="row">
                            {row.map((cell, cellIndex) => {
                                let cellClass = cell; // Default to cell's stored value
                                // Check if this cell is part of the falling block
                                if (fallingBlock && fallingBlock.shape) {
                                fallingBlock.shape.forEach((shapeRow, shapeRowIndex) => {
                                    shapeRow.forEach((shapeCell, shapeCellIndex) => {
                                        if (
                                            shapeCell &&
                                            rowIndex === fallingBlock.position.y + shapeRowIndex &&
                                            cellIndex === fallingBlock.position.x + shapeCellIndex
                                        ) {
                                            cellClass = fallingBlock.color;
                                        }
                                    });
                                });
                                }
                                else {
                                    console.error("fallingblock.shape or fallingblock is not defined");
                                    console.log("Here it is: ", fallingBlock);
                                }
                                return <div key={cellIndex} className={`box ${cellClass || 'empty'}`}></div>;
                            })}
                        </div>
                    ))}
                </div>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rubik+Doodle+Shadow&display=swap" />
                {!isRunning &&
                    <button onClick={handleClick} class="start">Start</button>
                }
                <button onClick={() => checkForMatches(grid)}>TEST FOR MATCHES</button>
                <button onClick={() => getNewBlock()}>GET NEW BLOCK</button>
            </div>
        </div>
    )
    
//     return (
//         <div className="blackBackground">
//         {position < 22 && (
//         <div>
//             <div className="darkblueContainertwo" style={{ top: `${position * 30}px`}}>
//                 <div className="box darkblue"></div>
//                 <div className="box darkblue"></div>
//                 <div className="box orange"></div>
//             </div>
//             <div className="darkblueContainertwo" style={{ top: `${(position + 1.5 ) * 30}px`}}>
//                 <div className="box darkblue"></div>
//                 <div className="box darkblue"></div>
//                 <div className="box orange"></div>
//             </div>
//             <div className="darkblueContainertwo" style={{ top: `${(position + 3 ) * 30}px`}}>
//                 <div className="box darkblue"></div>
//                 <div className="box darkblue"></div>
//                 <div className="box orange"></div>
//             </div>
//         </div>
//         )}
//     {/* When isRunning is not true, render the start button */}
//     {!isRunning && 
//     <div class="startContainer"> 
//     <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rubik+Doodle+Shadow&display=swap" />
//         <button onClick={handleClick} class="start">Start</button>
//     </div>  
//     }  
    
//     <div>
//         {position < 20 ? 
//     <div className="darkblueContainer">
//         <div className="box darkblue"></div>
//         <div className="box darkblue"></div>
//         <div className="box orange"></div>
//         <div className="box black"></div>
//         <div className="box green"></div>
//         <div className="box green"></div>
//         <div className="box red"></div>
//         <div className="box red"></div>
//         <div className="box purple"></div>
//         <div className="box black"></div>
//     </div>
//         :
//     <div>
//     </div>
//         } 
//     <div className="darkblueContainer">
//         <div className="box darkblue"></div>
//         <div className="box darkblue"></div>
//         <div className="box orange"></div>
//         <div className="box orange"></div>
//         <div className="box orange"></div>
//         <div className="box green"></div>
//         <div className="box black"></div>
//         <div className="box red"></div>
//         <div className="box red"></div>
//         <div className="box orange"></div>
//     </div>
// </div>
//     </div>   
   
//     )
}

export default Tetris