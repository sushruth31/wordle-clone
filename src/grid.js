import { Alert, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Keyboard from "./keyboard";
import useLocalStorageState from "./uselocalstoragestate";
import wordList from "word-list-json";

export const colorMap = new Map(
  Object.entries({
    green: "#538c4d",
    orange: "#b59f3a",
    gray: "#3a3a3c",
  })
);

const myWordList = wordList.filter(word => word.length === 5);

const wordOfTheDay = "hello";
//my word is 'haehjl'

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
  const [currentSquareinRow, setCurrentSqaureInRow] = useState(-1);
  const [gridMap, setGridMap] = useLocalStorageState("gridmap", new Map());
  const [isGameOver, setIsGameOver] = useState(null);
  const [wordNotInDict, setWordNotInDict] = useState(false);
  const [currentRow, setCurrentRow] = useState(gridMap.size);

  //  console.log(gridMap);

  //memoize keyboard colors so it doesnt update until row changes

  let keyboardColors = useMemo(() => {
    let map = new Map();

    for (let i = 0; i < gridMap.size; ++i) {
      let row = gridMap.get(i);
      for (let [_, { color, ltr }] of row.entries()) {
        if (map.get(ltr) === "green") {
          continue;
        }
        map.set(ltr, color);
      }
    }

    return map;
  }, [currentRow]); //a => color

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

    setGridMap(p => new Map(p).set(currentRow, ltrMap), true);

    //update keybaord colors. if green preserve. anything else overwrite

    //check if word is a winner
    if (isWinner(ltrMap)) {
      return handleWin();
    }
  }

  const handleEnter = () => {
    //first check if we have 5 letters
    let row = new Map(gridMap.get(currentRow)); //map(ltrI => {color: green, ltr: a})
    let letters = [];

    for (let i = 0; i < row.size; ++i) {
      let ltr = row.get(i).ltr;
      letters.push(ltr);
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
    setCurrentRow(p => p + 1);
    setCurrentSqaureInRow(-1);
  };

  function updateGridMap(pos, ltr) {
    setGridMap(p => {
      let ltrMap = new Map(p.get(currentRow)); // map (ltri => {color: ...})
      let objCopy = ltrMap.get(pos);
      ltrMap.set(pos, { ...objCopy, ltr });

      return new Map(p.set(currentRow, ltrMap));
    });
  }

  function handleKey(key) {
    if (!key || isGameOver) return;

    //filter out anything not a letter
    if (!isNaN(Number(key)) || key.length !== 1 || !key.match(/[a-z]/i)) return;

    setCurrentSqaureInRow(p => {
      if (p < 4) {
        //update grid map
        let newPos = p + 1;
        updateGridMap(newPos, key);
        return newPos;
      }
      return p;
    });
  }

  const handleDelete = () => {
    if (currentSquareinRow < 0) return;
    //todo update grid map

    setGridMap(p => {
      let mapCopy = new Map(p);
      let ltrMap = new Map(mapCopy.get(currentRow));
      ltrMap.delete(currentSquareinRow);
      return mapCopy.set(currentRow, ltrMap);
    });

    //update our current position
    setCurrentSqaureInRow(p => p - 1);
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
              let color = gridMap.get(rowI)?.get(ltrI)?.color;
              color = colorMap.get(color);
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
                    {gridMap.get(rowI)?.get(ltrI)?.ltr}
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
