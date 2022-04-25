import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Keyboard from "./keyboard";

let wordOfTheDay = "hello";
//my word is 'haehjl'

const getKey = (rowI, cellI) => `${rowI} ${cellI}`;

function findIndexes(
  ltr,
  ltrI,
  wordToMatch = [...wordOfTheDay].map(l => l.toUpperCase()),
  res = []
) {
  if (!wordToMatch.includes(ltr)) {
    return res;
  }

  //we have a match. get the key of the match
  let perfectMatch = false;
  let index = wordToMatch.findIndex((l, i) => {
    if (i === ltrI) perfectMatch = true;
    return l === ltr;
  });

  res.push({ index, perfectMatch });

  //change the entry to blank character so it gets ignored on next call

  wordToMatch[index] = "";
  //call again untill all matches are found
  return findIndexes(ltr, ltrI, wordToMatch, res);
}

export default function Grid() {
  const [currentRow, setCurrentRow] = useState(0);
  const [currentSquareinRow, setCurrentSqaureInRow] = useState(-1);
  const [gridMap, setGridMap] = useState(new Map());
  const [attempts, setAttempts] = useState(new Map());
  const [keyEvent, setKey] = useState(null);

  //gridmap: "0 1" => 'k'

  //attemptsMap: 0 => [{letter: 'b', index: [0, 1] }, {}]

  function handleWin() {
    console.log("you win");
  }

  function isWinner(attempt) {
    //first check if any index prop has length of 0

    if (attempt.some(o => !o.indexes.length)) {
      return false;
    }

    let enteredLetters = attempt
      .map(o => o.letter)
      .map(ltr => ltr.toUpperCase())
      .join("");
    for (let i = 0; i < enteredLetters.length; i++) {
      if (enteredLetters[i] !== wordOfTheDay[i].toUpperCase()) {
        return false;
      }
    }
    return true;
  }

  function addToAttempts(enteredWord) {
    //add the attempt to the attempts map

    //create array of objects value for map
    let val = [];
    for (let i = 0; i < enteredWord.length; i++) {
      let letter = enteredWord[i].toUpperCase();

      val.push({
        letter,
        indexes: findIndexes(letter, i),
      });
    }

    //check if word is a winner

    if (isWinner(val)) {
      return handleWin();
    }

    setAttempts(attempts => new Map(attempts).set(currentRow, val));
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

  // useEffect(() => {
  //   console.log({ gridMap, currentSquareinRow });
  // }, [gridMap]);

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
          {[...Array(5)].map((_, cellI) => {
            let addClass = "";
            let attempt = attempts.get(rowI)?.[cellI]?.indexes;
            console.log(attempt);
            if (attempt?.length > 0) {
              addClass += "bg-orange-500";
              //check if perfect match now
              let perfectMatch = attempt.find(
                o => o.index === cellI
              )?.perfectMatch;
              if (perfectMatch) {
                addClass = "bg-green-500";
              }
            }
            return (
              <div
                key={cellI}
                className={
                  "border-[1px] m-1 border-gray-500 h-[60px] w-[60px] flex items-center justify-center" +
                  " " +
                  addClass
                }
              >
                <Typography color="white" variant="h4">
                  {gridMap.get(getKey(rowI, cellI))}
                </Typography>
              </div>
            );
          })}
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
