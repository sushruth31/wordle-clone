import { Button } from "@mui/material";
let row1 = "qwertyuiop";
let row2 = "asdfghjkl";
let row3 = "zxcvbnm";
let keyboardRows = [row1, row2, row3];

export default function Keyboard({
  handleKey,
  handleKeyWrapper,
  handleDelete,
  handleEnter,
}) {
  return (
    <div className="mt-10">
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

              let funcMap = new Map([
                [isEnter, handleEnter],
                [isDelete, handleDelete],
              ]);

              return (
                <Button
                  key={ltr}
                  style={{ minWidth: 40 }}
                  variant="outlined"
                  onClick={funcMap.get(true) ?? handleKeyWrapper(handleKey)}
                >
                  {ltr}
                </Button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
