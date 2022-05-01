import { Alert, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Keyboard from "./keyboard";
import wordList from "word-list-json";

const myWordList = wordList.filter(word => word.length === 5);

const wordOfTheDay = "hello";
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

function useLocalStorageState(key, initialState) {
  const [state, setter] = useState(
    JSON.parse(localStorage.getItem(key)) || initialState
  );
  console.log(state);

  const newSetter = newValOrCb => {
    setter(state => {
      let newState = state;
      if (typeof newValOrCb === "function") {
        newState = newValOrCb(state);
      }
      localStorage.setItem(key, JSON.stringify(newState));
      return newState;
    });
  };

  return [state, newSetter];
}

export default function Grid() {
  const [currentSquareinRow, setCurrentSqaureInRow] = useState(-1);
  const [gridMap, setGridMap] = useState(new Map());
  const [attempts, setAttempts] = useState(new Map());
  const [isGameOver, setIsGameOver] = useState(null);
  const [wordNotInDict, setWordNotInDict] = useState(false);

  let currentRow = attempts.size;

  let keyboardColors = new Map(); //a => color

  for (let i = 0; i < attempts.size; ++i) {
    let row = attempts.get(i);
    for (let [_, { color, ltr }] of row.entries()) {
      if (keyboardColors.get(ltr) === "green") {
        continue;
      }
      keyboardColors.set(ltr, color);
    }
  }

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

    //check if word is in dict
    if (
      !myWordList.some(
        word => word.toUpperCase() === letters.join("").toUpperCase()
      )
    ) {
      console.log("word not in dict");
      //this value is getting set to NaN after some rerenders so just as a precatution
      setCurrentSqaureInRow(4);
      return setWordNotInDict(true);
    }
    //add to attempts
    addToAttempts(letters);

    //go to next row and reset pos to 0
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

  //clear out message
  useEffect(() => {
    let timeout;
    if (wordNotInDict) {
      timeout = setTimeout(() => {
        setWordNotInDict(false);
      }, 1000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [wordNotInDict]);

  return (
    <>
      {wordNotInDict && (
        <Alert icon={false} className="mt-10">
          <b>Word not in list</b>
        </Alert>
      )}
      <div className="fixed bottom-72">
        {[...Array(6)].map((_, rowI) => (
          <div key={rowI} className="flex">
            {[...Array(5)].map((_, ltrI) => {
              let color = attempts.get(rowI)?.get(ltrI)?.color;
              return (
                <div
                  key={ltrI}
                  style={{
                    backgroundColor: color === "gray" ? "transparent" : color,
                  }}
                  className={
                    "border-[1px] m-1 border-gray-500 h-[60px] w-[60px] flex items-center justify-center"
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
      </div>
      <Keyboard
        keyboardColors={keyboardColors}
        handleEnter={handleEnter}
        handleDelete={handleDelete}
        handleKey={handleKeyWrapper(handleKey)}
      />
    </>
  );
}
