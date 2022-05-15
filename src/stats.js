import { Button, Paper, Typography } from "@mui/material"
import { useSelector, useDispatch } from "react-redux"
import { actions } from "./redux"
import { useAction } from "./utils"

function Card({ children }) {
  return (
    <Paper
      style={{ backgroundColor: "transparent", color: "white" }}
      elevation={1}
      className="px-4 h-full bg-transparent text-white items-center justify-center flex flex-col"
    >
      <div className="flex flex-col items-center justify-center">
        {children}
      </div>
    </Paper>
  )
}

const percent = (val, total) => {
  let percent = Math.round((val / total) * 100)
  if (isNaN(percent)) {
    return 0
  }
  return percent
}

function StatCard({ top, bottom }) {
  return (
    <Card>
      <Typography gutterBottom fontSize={30} variant="h4">
        {top}
      </Typography>
      <Typography fontSize={12} alignContent={"center"}>
        {bottom}
      </Typography>
    </Card>
  )
}

export default function Stats() {
  const numPlayed = useSelector(state => state.stats.numPlayed)
  const numWins = useSelector(state => state.stats.wins)
  const reset = useAction(actions.resetStats)
  return (
    <>
      <div className="h-40 flex p-10">
        <StatCard top={numPlayed} bottom={"Played"} />
        <StatCard top={percent(numWins, numPlayed)} bottom={"Win %"} />
        <StatCard top={percent(numWins, numPlayed)} bottom={"Win %"} />
        <StatCard top={percent(numWins, numPlayed)} bottom={"Win %"} />
      </div>
      <Button onClick={reset}>Reset Stats</Button>
    </>
  )
}
