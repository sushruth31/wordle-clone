import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Keyboard from "./keyboard";
import useKeyInput from "./useKeyInput";

let wordOfTheDay = "hello";

const getKey = (rowI, cellI) => `${rowI} ${cellI}`;

export default function Grid() {
  const [currentRow, setCurrentRow] = useState(0);
  const [currentSquareinRow, setCurrentSqaureInRow] = useState(-1);
  const [gridMap, setGridMap] = useState(new Map());
  const [keyEvent, setKey] = useState(null);
  const [attempts, setAttempts] = useState(new Map());

  //gridmap: "0 1" => 'k'

  //attemptsMap: 0 => [{letter: 'b', isInWord: true; correctIndex: true}, {}]

  const checkIfMatch = enteredWord => {
    //add the attempt to the attempts map

    const isLetterInWord = () => {};
    const isCorrectIndex = () => {};

    //create array of objects value for map
    let val = [];
    for (let i = 0; i < enteredWord; i++) {
      let letter = enteredWord[i];
      val.push({
        letter,
        isInWord: isLetterInWord(),
        correctIndex: isCorrectIndex(),
      });
    }

    setAttempts(attempts => {
      let attemptsCopy = new Map([...attempts]);
      attemptsCopy.set(currentRow.val);
    });
  };

  const handleEnter = () => {
    //first check if we have 5 letters
    let map = [...gridMap];
    let letters = [];

    for (let i = 0; i < map.length; i++) {
      let row = Number(map[i][0].split("")[0]);
      let letter = map[i][1];
      if (row === currentRow) {
        letters.push(letter);
      }
    }

    if (letters.length !== 5) return;

    //now get the word
    let enteredWord = letters.join("");

    checkIfMatch(enteredWord, wordOfTheDay);

    // setCurrentRow(r => r + 1);
    // setCurrentSqaureInRow(-1);
  };

  const mapSet = (rowI, cellI, val) => {
    setGridMap(new Map(gridMap.set(getKey(rowI, cellI), val)));
  };

  useEffect(() => {
    if (!keyEvent) return;
    let key = keyEvent.target.innerText;

    //filter out anything not a letter
    if (!isNaN(Number(key)) || key.length !== 1 || !key.match(/[a-z]/i)) return;

    setCurrentSqaureInRow(p => {
      if (p < 4) {
        //update grid map
        mapSet(currentRow, p + 1, key);
        return p + 1;
      } else {
      }
    });
  }, [keyEvent]);

  useEffect(() => {
    console.log({ gridMap, currentSquareinRow });
  }, [gridMap]);

  const handleDelete = () => {
    if (currentSquareinRow < 0) return;
    let mapCopy = new Map([...gridMap]);
    //delete the current row and cell from the map
    mapCopy.delete(getKey(currentRow, currentSquareinRow));
    //update our current position
    setCurrentSqaureInRow(p => p - 1);
    setGridMap(mapCopy);
  };

  return (
    <>
      {[...Array(6)].map((_, rowI) => (
        <div key={rowI} className="flex">
          {[...Array(5)].map((_, cellI) => (
            <div
              key={cellI}
              className="border-[1px] m-1 border-gray-500 h-[60px] w-[60px] flex items-center justify-center"
            >
              <Typography color="white" variant="h4">
                {gridMap.get(getKey(rowI, cellI))}
              </Typography>
            </div>
          ))}
        </div>
      ))}
      <Keyboard
        setKey={e => setKey(e)}
        handleEnter={handleEnter}
        handleDelete={handleDelete}
      />
    </>
  );
}
