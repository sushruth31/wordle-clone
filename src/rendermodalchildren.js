import { SCREENTYPES } from "./App"
import { IconButton, Typography } from "@mui/material"
import { Close } from "@mui/icons-material"
import Stats from "./stats"

export default function RenderChildren({ modalState, closeModal }) {
  switch (modalState.screen) {
    case SCREENTYPES.INSTRUCTIONS:
      return (
        <>
          <div className="flex items-center w-screen mt-16 justify-between px-10">
            <div></div>
            <div className="text-white text-lg">
              <b>HOW TO PLAY</b>
            </div>
            <IconButton onClick={closeModal} size="large">
              <Close className="text-white" />
            </IconButton>
          </div>
          <p className="text-white">
            Guess the WORDLE in six tries. Each guess must be a valid
            five-letter word. Hit the enter button to submit. After each guess,
            the color of the tiles will change to show how close your guess was
            to the word.
          </p>
        </>
      )

    case SCREENTYPES.STATS:
      return (
        <>
          <div className="flex w-full items-center justify-end">
            <IconButton onClick={closeModal} size="large">
              <Close className="text-white" />
            </IconButton>
          </div>
          <div className="w-full flex flex-col justify-center items-center">
            <Typography variant="h5">STATISTICS</Typography>
            <Stats />
          </div>
        </>
      )

    default:
      return null
  }
}
