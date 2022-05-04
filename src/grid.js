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
  const [currentRow, setCurrentRow] = useState(gridMap.size);
  const [numberOfMessages, setNumberOfMessages] = useState(0);
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    if (!numberOfMessages) return;
    for (let i = 0; i < numberOfMessages; ++i) {
      let id = setTimeout(() => {
        setNumberOfMessages(p => {
          if (p > 0) {
            return p - 1;
          }
          return p;
        });
      }, 500);
    }
  }, [numberOfMessages]);

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

  function isWinner() {
    //if all colors are green on last row return true
    let lastRow = gridMap.get(gridMap.size - 1);
    if (!gridMap.size) return false;
    if ([...lastRow.entries()].every(([_, { color }]) => color === "green")) {
      return true;
    }
    return false;
  }

  const delay = time => new Promise(resolve => setTimeout(resolve, time));

  async function addToAttempts(enteredWord) {
    //add the attempt to the attempts map
    //attemptsMap: 0 => map(ltrIdx: {color: green, ltr: 'a'})
    let ltrMap = new Map();
    //add the colors for each ltr in map

    for (let i = 0; i < enteredWord.length; ++i) {
      let ltr = enteredWord[i].toUpperCase();
      ltrMap.set(i, { color: findColor(i, ltr), ltr });
    }

    for (let i = 0; i < ltrMap.size; ++i) {
      let o = ltrMap.get(i);
      setGridMap(p => {
        let mapCopy = new Map(p);
        return mapCopy.set(currentRow, mapCopy.get(currentRow).set(i, o));
      }, i === ltrMap.size - 1);
      await delay(200);
    }

    //add one letter at a time
  }

  useEffect(() => {
    //check if word is a winner
    if (isWinner(gridMap)) {
      console.log("you win");
      setIsGameOver({ outcome: "You Win!" });
    }

    if (gridMap.size === 6) {
      setIsGameOver({ outcome: "You Suck!" });
    }
  }, [currentRow]);

  const handleEnter = async () => {
    if (isGameOver || isRendering) return;
    setIsRendering(true);
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
      //this value is getting set to NaN after some rerenders so just as a precatution
      setCurrentSqaureInRow(4);
      return setNumberOfMessages(p => p + 1);
    }
    //add to attempts
    await addToAttempts(letters);

    //go to next row and reset pos to 0
    setCurrentRow(p => p + 1);
    setCurrentSqaureInRow(-1);
    setIsRendering(false);
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
    if (!key || isGameOver || isRendering) return;

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
    if (currentSquareinRow < 0 || isGameOver || isRendering) return;
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

  return (
    <>
      {isGameOver && (
        <Alert style={{ zIndex: 5000 }} icon={false} className="fixed top-16">
          <b>{isGameOver.outcome}</b>
        </Alert>
      )}

      {!!numberOfMessages && (
        <>
          {[...Array(numberOfMessages)].map((_, i) => (
            <Alert
              className="mb-10"
              key={i}
              style={{ zIndex: 5000 }}
              icon={false}
            >
              <b>Word Not In List</b>
            </Alert>
          ))}
        </>
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
