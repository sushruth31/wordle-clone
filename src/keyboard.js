import { colorMap } from "./grid";
let row1 = "qwertyuiop";
let row2 = "asdfghjkl";
let row3 = "zxcvbnm";
let keyboardRows = [row1, row2, row3];

export default function Keyboard({
  handleKey,
  handleDelete,
  handleEnter,
  keyboardColors,
}) {
  return (
    <div className="mt-10 fixed bottom-10">
      {keyboardRows.map((row, rowI) => {
        row = row.split("");
        if (rowI === 2) {
          row.unshift("enter");
          row.push("delete");
        }
        return (
          <div
            key={rowI}
            className="flex items-center justify-center w-screen p-1"
          >
            {row.map((ltr, ltrI) => {
              let isEnter = rowI === 2 && ltrI === 0;
              let isDelete = rowI === 2 && ltrI === row.length - 1;
              let color = keyboardColors.get(ltr.toUpperCase());
              color = colorMap.get(color);

              return (
                <button
                  className={`p-1 m-1 rounded h-14 text-white`}
                  key={ltr}
                  style={{
                    minWidth: 40,
                    backgroundColor: color ?? "gray",
                  }}
                  variant="outlined"
                  onClick={
                    isEnter ? handleEnter : isDelete ? handleDelete : handleKey
                  }
                >
                  {ltr.toUpperCase()}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
