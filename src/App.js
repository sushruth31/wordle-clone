import { useState } from "react";
import "./App.css";
import Grid from "./grid";
import Header from "./header";
import useLocalStorageState from "./uselocalstoragestate";
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Animater from "./animater";

function Cover({ children, isOpen, coverOrModal }) {
  if (isOpen)
    return (
      <Animater
        initial={{ y: 500, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 500, opacity: 0 }}
        style={{ zIndex: 1000 }}
        className="fixed w-screen px-10 h-screen bg-zinc-900 flex items-center flex-col"
      >
        {children}
      </Animater>
    );
  return null;
}

export default function App() {
  const [gridMap, setGridMap, clear] = useLocalStorageState(
    "gridmap",
    new Map(),
    () => setGridKey(p => p + 1)
  );
  const [gridKey, setGridKey] = useState(0);
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Cover coverOrModal={"cover"} isOpen={isCoverOpen}>
        <div className="flex items-center w-screen mb-6 justify-between px-10">
          <div></div>
          <div className="text-white text-lg">
            <b>HOW TO PLAY</b>
          </div>
          <IconButton onClick={() => setIsCoverOpen(false)} size="large">
            <Close className="text-white" />
          </IconButton>
        </div>
        <p className="text-white">
          Guess the WORDLE in six tries. Each guess must be a valid five-letter
          word. Hit the enter button to submit. After each guess, the color of
          the tiles will change to show how close your guess was to the word.
        </p>
      </Cover>
      <Header openCover={() => setIsCoverOpen(true)} clear={clear} />
      <div className="flex items-center justify-center h-[100%] flex-col">
        <Grid key={gridKey} gridMap={gridMap} setGridMap={setGridMap} />
      </div>
    </>
  );
}
