import { Alert, Typography } from "@mui/material"
import { useEffect, useMemo, useState, useRef, createElement } from "react"
import Keyboard from "./keyboard"
import Animater from "./animater"
import { useAction, delay } from "./utils"
import { actions } from "./redux"
import { myWordList } from "./wordlist"
import { useSelector } from "react-redux"

const NUM_ROWS = 6
const NUM_COLS = 5

export const colorMap = new Map(
  Object.entries({
    green: "#538c4d",
    orange: "#b59f3a",
    gray: "#3a3a3c",
  })
)

//needs to be a function of current day

function findColor(ltrI, ltr, wordOfTheDay) {
  let _wordOfTheDay = wordOfTheDay
    .split("")
    .map(el => el.toUpperCase())
    .join("")

  //needs to be two seperate iterations

  for (let i = 0; i < _wordOfTheDay.length; ++i) {
    if (ltrI === i && ltr === _wordOfTheDay[i]) {
      return "green"
    }
  }

  for (let i = 0; i < wordOfTheDay.length; ++i) {
    if (_wordOfTheDay[i] === ltr) {
      return "orange"
    }
  }

  return "gray"
}

const handleKeyWrapper = fn => keyEvent =>
  fn(keyEvent.target.innerText.toUpperCase())

export default function Grid({ gridMap, setGridMap }) {
  //this should be loaded before gridmap
  const wordOfTheDay = useSelector(s => s.word.word)
  const [currentSquareinRow, setCurrentSqaureInRow] = useState(-1)
  const [isGameOver, setIsGameOver] = useState(null)
  const [currentRow, setCurrentRow] = useState(null)
  const [numberOfMessages, setNumberOfMessages] = useState(0)
  const [isRendering, setIsRendering] = useState(false)
  const [isError, setError] = useState(false)
  const [squareAnimating, setSquareAnimating] = useState(new Map())
  const addNumPlayed = useAction(actions.addNumPlayed)
  const addWin = useAction(actions.addWinThunk)
  const timeouts = useRef([])

  useEffect(() => {
    if (!numberOfMessages) {
      timeouts.current = timeouts.current.filter(clearTimeout)
    }
  }, [numberOfMessages])

  //set current row asynchronously to delay keyboard colors
  useEffect(() => {
    if (!gridMap.size) {
      return setCurrentRow(gridMap.size)
    }
    setIsRendering(true)
    //iterate through map setting animating squares and store in local gridmap state
    //squares animating should be
    async function populateMap(columnI) {
      if (columnI === gridMap.get(0).size) return
      let map = new Map()
      for (let i = 0; i < gridMap.size; ++i) {
        map.set(i, columnI)
      }
      setSquareAnimating(map)
      await delay(200)
      await populateMap(++columnI)
    }

    ;(async () => {
      await populateMap(0)
      setCurrentRow(gridMap.size)
      setIsRendering(false)
    })()
  }, [])

  useEffect(() => {
    //clear out errors and check all rows just to be safe
    setTimeout(() => {
      setError(false)
    }, 500)
  }, [isError])

  //memoize keyboard colors so it doesnt update until row changes

  let keyboardColors = useMemo(() => {
    let map = new Map()
    if (currentRow === null) return new Map()
    for (let i = 0; i < gridMap.size; ++i) {
      let row = gridMap.get(i)
      for (let [_, { color, ltr }] of row.entries()) {
        if (map.get(ltr) === "green") {
          continue
        }
        map.set(ltr, color)
      }
    }

    return map
  }, [currentRow]) //a => color

  //gridmap: "0 1" => 'k'

  function isWinner(optionalMap) {
    let map = optionalMap instanceof Map ? optionalMap : gridMap
    //if all colors are green on last row return true
    if (!map.size) return false
    let lastRow = map.get(map.size - 1)
    if ([...lastRow.entries()].every(([_, { color }]) => color === "green")) {
      return true
    }
    return false
  }

  async function addToAttempts(enteredWord) {
    //add the attempt to the attempts map
    //return an updated map
    //attemptsMap: 0 => map(ltrIdx: {color: green, ltr: 'a'})
    let ltrMap = new Map()
    //add the colors for each ltr in map

    for (let i = 0; i < enteredWord.length; ++i) {
      let ltr = enteredWord[i].toUpperCase()
      ltrMap.set(i, { color: findColor(i, ltr, wordOfTheDay), ltr })
    }

    //add one letter at a time
    for (let i = 0; i < ltrMap.size; ++i) {
      let o = ltrMap.get(i)
      setGridMap(p => {
        let mapCopy = new Map(p)
        return mapCopy.set(currentRow, mapCopy.get(currentRow).set(i, o))
      }, i === ltrMap.size - 1)
      setSquareAnimating(new Map().set(currentRow, i))
      await delay(200)
    }

    setSquareAnimating(new Map())
    //clear squares animating out
    return new Map(gridMap).set(currentRow, ltrMap)
  }

  //as effect so it can run on mount

  useEffect(() => {
    //check if word is a winner
    if (isWinner()) {
      console.log("you win")
      setIsGameOver({ outcome: "You Win!" })
    }

    if (gridMap.size === NUM_ROWS) {
      setIsGameOver({
        outcome: `You Suck! Word: ${wordOfTheDay.toUpperCase()} `,
      })
    }
  }, [currentRow])

  const handleEnter = async () => {
    //first check if we have 5 letters
    let row = new Map(gridMap.get(currentRow)) //map(ltrI => {color: green, ltr: a})
    let letters = []

    for (let i = 0; i < row.size; ++i) {
      let ltr = row.get(i).ltr
      letters.push(ltr)
    }

    if (isGameOver || isRendering || letters.length !== 5) return

    //check if word is in dict
    if (
      !myWordList.some(
        word => word.toUpperCase() === letters.join("").toUpperCase()
      )
    ) {
      //this value is getting set to NaN after some rerenders so just as a precatution
      setCurrentSqaureInRow(NUM_COLS - 1)
      setError(true)
      setNumberOfMessages(p => p + 1)
      return timeouts.current.push(
        setTimeout(() => setNumberOfMessages(p => p - 1), 1000)
      )
    }
    setIsRendering(true)
    //add to attempts
    let updatedMap = await addToAttempts(letters)

    //if we are on last row dispatch to num played
    if (currentRow === NUM_ROWS - 1) {
      addNumPlayed()
    }

    if (isWinner(updatedMap)) {
      addNumPlayed()
      addWin()
    }

    //go to next row and reset pos to 0
    setCurrentRow(p => p + 1)
    setCurrentSqaureInRow(-1)
    setIsRendering(false)
  }

  function updateGridMap(pos, ltr) {
    setGridMap(p => {
      let ltrMap = new Map(p.get(currentRow)) // map (ltri => {color: ...})
      let objCopy = ltrMap.get(pos)
      ltrMap.set(pos, { ...objCopy, ltr })

      return new Map(p.set(currentRow, ltrMap))
    })
  }

  function handleKey(key) {
    if (!key || isGameOver || isRendering) return

    //filter out anything not a letter
    if (!isNaN(Number(key)) || key.length !== 1 || !key.match(/[a-z]/i)) return

    setCurrentSqaureInRow(p => {
      if (p < 4) {
        //update grid map
        let newPos = p + 1
        updateGridMap(newPos, key)
        return newPos
      }
      return p
    })
  }

  const handleDelete = () => {
    if (currentSquareinRow < 0 || isGameOver || isRendering) return
    //todo update grid map

    setGridMap(p => {
      let mapCopy = new Map(p)
      let ltrMap = new Map(mapCopy.get(currentRow))
      ltrMap.delete(currentSquareinRow)
      return mapCopy.set(currentRow, ltrMap)
    })

    //update our current position
    setCurrentSqaureInRow(p => p - 1)
  }

  return (
    <div className="flex flex-col items-center justify-end h-screen p-10">
      {isGameOver && (
        <Alert style={{ zIndex: 5000 }} icon={false} className="fixed top-16">
          <b>{isGameOver.outcome}</b>
        </Alert>
      )}

      {!!numberOfMessages && (
        <div className="flex flex-col fixed top-10">
          {[...Array(numberOfMessages)].map((_, i) => (
            <Animater
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ marginTop: 20, zIndex: 5000 }}
            >
              <Alert key={i} icon={false}>
                <b>Word Not In List</b>
              </Alert>
            </Animater>
          ))}
        </div>
      )}
      <button onClick={addWin} className="text-white">
        {wordOfTheDay}
      </button>
      <div className="">
        {[...Array(NUM_ROWS)].map((_, rowI) => (
          <div
            key={rowI}
            style={{ display: "flex" }}
            className={isError && rowI === currentRow ? "shake" : ""}
          >
            {[...Array(NUM_COLS)].map((_, ltrI) => {
              let color = colorMap.get(gridMap.get(rowI)?.get(ltrI)?.color)
              let ltr = gridMap.get(rowI)?.get(ltrI)?.ltr
              return (
                <Square
                  isAnimating={squareAnimating.get(rowI) === ltrI}
                  key={ltrI}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  initial={{ y: 100, opacity: 0, scale: 0.5 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 100, opacity: 0, transition: { duration: 0.1 } }}
                  style={{
                    backgroundColor: color === "gray" ? "transparent" : color,
                  }}
                  className={
                    "border-2 m-1 h-[60px] border-zinc-600 w-[60px] flex items-center justify-center"
                  }
                >
                  <Typography color="white" variant="h4">
                    {ltr}
                  </Typography>
                </Square>
              )
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
    </div>
  )
}

function Square({ isRendering, children, isAnimating, ...props }) {
  return (
    <>{createElement(isAnimating ? Animater : "div", { ...props }, children)}</>
  )
}
