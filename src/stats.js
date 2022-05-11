import { Button, Typography } from "@mui/material"
import { useSelector, useDispatch } from "react-redux"
import { resetStats } from "./redux"

function Card({ children }) {
  return (
    <div className="flex flex-col items-center justify-center px-4">
      {children}
    </div>
  )
}

export default function Stats() {
  const numPlayed = useSelector(state => state.stats.numPlayed)
  const dispatch = useDispatch()
  return (
    <>
      <div className="flex p-10">
        <Card>
          <Typography variant="h4">{numPlayed}</Typography>
          <Typography>Played</Typography>
        </Card>
        <Card>
          <Typography variant="h4">{numPlayed}</Typography>
          <Typography>Played</Typography>
        </Card>
        <Card>
          <Typography variant="h4">{numPlayed}</Typography>
          <Typography>Played</Typography>
        </Card>
        <Card>
          <Typography variant="h4">{numPlayed}</Typography>
          <Typography>Played</Typography>
        </Card>
      </div>
      <Button onClick={() => dispatch(resetStats())}>Reset Stats</Button>
    </>
  )
}
