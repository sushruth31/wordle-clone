import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Keyboard from "./keyboard";
import wordList from "./wordlist.json";

let wordOfTheDay = "hello";
//my word is 'haehjl'

const getKey = (rowI, cellI) => `${rowI} ${cellI}`;

function findColor(ltrI, ltr) {
  let _wordOfTheDay = wordOfTheDay
    .split("")
    .map(el => el.toUpperCase())
    .join("");

  //needs to be two seperate iterations

  for (let i = 0; i < _wordOfTheDay.length; ++i) {
    if (ltrI === i && ltr === _wordOfTheDay[i]) {
      return "green";
    }
  }

  for (let i = 0; i < wordOfTheDay.length; ++i) {
    if (_wordOfTheDay[i] === ltr) {
      return "orange";
    }
  }

  return "gray";
}

const handleKeyWrapper = fn => keyEvent =>
  fn(keyEvent.target.innerText.toUpperCase());

export default function Grid() {
  const [currentRow, setCurrentRow] = useState(0);
  const [currentSquareinRow, setCurrentSqaureInRow] = useState(-1);
  const [gridMap, setGridMap] = useState(new Map());
  const [attempts, setAttempts] = useState(new Map());
  const [isGameOver, setIsGameOver] = useState(null);
  const [keyboardColors, setKeyboardColors] = useState(new Map());

  //gridmap: "0 1" => 'k'

  function handleWin() {
    console.log("you win");
    setIsGameOver({ outcome: "win" });
  }

  function isWinner(ltrMap) {
    //if all colors are green return true
    return [...ltrMap].every(([_, { color }]) => color === "green");
  }

  function addToAttempts(enteredWord) {
    //add the attempt to the attempts map
    //attemptsMap: 0 => map(ltrIdx: {color: green, ltr: 'a'})
    let ltrMap = new Map();
    //add the colors for each ltr in map

    for (let i = 0; i < enteredWord.length; ++i) {
      let ltr = enteredWord[i].toUpperCase();
      ltrMap.set(i, { color: findColor(i, ltr), ltr });
    }

    //check if word is a winner

    setAttempts(p => new Map(p).set(currentRow, ltrMap));

    //update keybaord colors. if green preserve. anything else overwrite

    setKeyboardColors(p => {
      let prevState = new Map(p);

      for (let i = 0; i < ltrMap.size; ++i) {
        let { color, ltr } = ltrMap.get(i);
        if (prevState.get(ltr) !== "green") {
          prevState.set(ltr, color);
        }
      }

      return prevState;
    });

    if (isWinner(ltrMap)) {
      return handleWin();
    }
  }

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

    //add to attempts
    addToAttempts(letters);

    //go to next row and reset pos to 0
    setCurrentRow(r => r + 1);
    setCurrentSqaureInRow(-1);
  };

  const mapSet = (rowI, cellI, val) => {
    setGridMap(new Map(gridMap.set(getKey(rowI, cellI), val)));
  };

  function handleKey(key) {
    if (!key || isGameOver) return;

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
  }

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
          {[...Array(5)].map((_, ltrI) => {
            let color;
            let rowData = attempts.get(rowI);
            if (rowData) {
              color = rowData.get(ltrI).color;
            }
            if (color && color !== "gray") {
              color = `bg-${color}-500`;
            }
            return (
              <div
                key={ltrI}
                className={
                  "border-[1px] m-1 border-gray-500 h-[60px] w-[60px] flex items-center justify-center" +
                  " " +
                  color
                }
              >
                <Typography color="white" variant="h4">
                  {gridMap.get(getKey(rowI, ltrI))}
                </Typography>
              </div>
            );
          })}
        </div>
      ))}
      <Keyboard
        keyboardColors={keyboardColors}
        handleEnter={handleEnter}
        handleDelete={handleDelete}
        handleKey={handleKeyWrapper(handleKey)}
      />
    </>
  );
}
