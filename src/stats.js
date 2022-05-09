let data = [
  {
    type: "numPlayed",
    label: "Played",
    value: 10,
  },
]

export default function Stats() {
  return <div className="px-10">{JSON.stringify(data, null, 2)}</div>
}
