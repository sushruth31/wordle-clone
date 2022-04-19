import "./App.css";
import Grid from "./grid";
import Header from "./header";

export default function App() {
  return (
    <>
      <Header />
      <div className="flex items-center justify-center h-screen flex-col">
        <Grid />
      </div>
    </>
  );
}
