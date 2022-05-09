import Animater from "./animater"

export default function Modal({ closeModal, children, isOpen, coverOrModal }) {
  if (!isOpen) {
    return null
  }
  if (coverOrModal === "cover") {
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
    )
  }

  return (
    <div
      onClick={closeModal}
      style={{ zIndex: 1000 }}
      className="fixed flex justify-center items-center h-screen w-screen bg-[#000000c4] top-0 left-0"
    >
      <Animater
        onClick={e => e.stopPropagation()}
        initial={{ y: 500, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 500, opacity: 0 }}
        style={{ zIndex: 10000 }}
        className="fixed w-96 bg-zinc-900 flex items-center p-2 rounded-xl flex-col text-white"
      >
        {children}
      </Animater>
    </div>
  )
}
