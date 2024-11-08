import "./App.css";
import { useState } from "react";
import { Stream } from "./Stream";
import { Note } from "./core/Note";
import { Search } from "./search/Search";
import { Action } from "./core/Action";
import { SearchController } from "./search/SearchController";
import { YesNoDialog } from "./search/YesNoDialog";

function App() {
  const [notes, setNotes] = useState<Array<Note>>([
    new Note(
      "test.note",
      "Hello World!"
    ),
    new Note(
      "different.note",
      "That is another one"
    )
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const searchCtl = new SearchController();
  // const [searchResults, setSearchResults] = useState<Action[]>([]);
  // const [searchVisible, setSearchVisible] = useState(false);


  function updateNoteContent(index: number, content: string) {
    setNotes(notes.map((note, idx) => {
      if (idx == index) {
        return new Note(note.name, content);
      } else {
        return note
      }
    }))
  }

  const actions = [
    new Action("First action", "description", () => { console.log("First action") }),
    new Action("Second action", "another description", () => { console.log("Second action") }),
    new Action("Third", "", () => { console.log("Third action") }),
  ];

  return (
    <main className="container mx-auto">
      <Stream
        notes={notes}
        onUpdateNote={(idx, content) => updateNoteContent(idx, content)}
      />

      <YesNoDialog 
        prompt="Are you sure?"
        onYes={() => console.log("Well, ok!")}
      />
      {/* <Search controller={searchCtl} /> */}
      {/* <button onClick={() => searchCtl.startActionSearch(actions)}>Search actions</button>
      <button onClick={() => searchCtl.startYestNo(
        "Are you sure?",
        () => { console.log("Yes") },
        () => { console.log("No") }
      )}>Yes/No</button>
      <button onClick={() => searchCtl.startInput("What's your age?", (age) => { console.log("Your age is", age) })}>Get input</button> */}
    </main>
  );
}

export default App;
