import wordList from "word-list-json"
import { shuffle } from "./utils"
const NUM_COLS = 5

export const myWordList = shuffle(
  wordList.filter(word => word.length === NUM_COLS)
)
