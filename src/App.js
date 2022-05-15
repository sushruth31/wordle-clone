import { useState } from "react"
import "./App.css"
import Grid from "./grid"
import Header from "./header"
import useLocalStorageState from "./uselocalstoragestate"
import Modal from "./modal"
import RenderChildren from "./rendermodalchildren"

export const SCREENTYPES = {
  STATS: "stats",
  INSTRUCTIONS: "instructions",
  SETTINGS: "settings",
}

export default function App() {
  const resetMap = () => setGridKey(p => p + 1)
  const [gridMap, setGridMap, clear] = useLocalStorageState(
    "gridmap",
    new Map(),
    resetMap
  )
  const [gridKey, setGridKey] = useState(0)
  const [modalState, setModalState] = useState({
    isOpen: false,
    coverOrModal: "cover",
    screen: SCREENTYPES.SETTINGS,
  })

  const openCover = params => () => {
    setModalState(p => ({
      isOpen: !p.isOpen,
      coverOrModal: params.coverOrModal,
      screen: params.screen,
    }))
  }

  const closeModal = () =>
    setModalState(p => ({
      ...p,
      isOpen: false,
    }))

  return (
    <>
      <Modal
        coverOrModal={modalState.coverOrModal}
        isOpen={modalState.isOpen}
        closeModal={closeModal}
      >
        <RenderChildren
          closeModal={closeModal}
          modalState={modalState}
          setModalState={setModalState}
        />
      </Modal>
      <Header openCover={openCover} clear={clear} />

      <Grid key={gridKey} gridMap={gridMap} setGridMap={setGridMap} />
    </>
  )
}
