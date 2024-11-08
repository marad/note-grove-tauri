import "./App.css";
import { useState } from "react";
import { Stream } from "./Stream";
import { Note } from "./core/Note";
import { Action } from "./core/Action";
import { YesNoDialog } from "./search/YesNoDialog";
import { InputDialog } from "./search/InputDialog";

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

  // const [searchResults, setSearchResults] = useState<Action[]>([]);
  // const [searchVisible, setSearchVisible] = useState(false);

  const [yesNoVisible, setYesNoVisible] = useState(false);
  const [inputVisible, setInputVisible] = useState(false);



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

      { inputVisible ?
        <InputDialog
          prompt="What's your age?"
          onAccept={(input) => console.log("Input", input)}
          onCloseRequest={() => setInputVisible(false)}
        /> : null}
      
      { yesNoVisible ?
        <YesNoDialog
          prompt="Are you sure?"
          onYes={() => console.log("Well, ok!")}
          onCloseRequest={() => setYesNoVisible(false)}
        /> : null }
      <button onClick={() => setYesNoVisible(true)}>Show Yes/No</button>
      <button onClick={() => setInputVisible(true)}>Show input</button>
      {/* <button onClick={() => searchCtl.startActionSearch(actions)}>Search actions</button> */}
    </main>
  );
}

export default App;
