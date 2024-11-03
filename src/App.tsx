import "./App.css";
import { useState } from "react";
import { Stream } from "./Stream";
import { Note } from "./core/Note";
import { Search } from "./search/Search";
import { Action } from "./core/Action";
import { SearchController } from "./search/SearchController";

class AppController {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  selectedIndex: number = 0;
  setSelectedIndex: (index: number) => void;

  constructor(initialNotes: Note[]) {
    const [notes, setNotes] = useState<Array<Note>>(initialNotes);
    this.notes = notes;
    this.setNotes = setNotes;
    const [selectedIndex, setSelectedIndex] = useState(0);
    this.selectedIndex = selectedIndex;
    this.setSelectedIndex = setSelectedIndex;
  }

  updateNoteContent(index: number, content: string) {
    this.setNotes(this.notes.map((note, idx) => {
      if (idx == index) {
        return new Note(note.name, content);
      } else {
        return note
      }
    }))
  }
}

function App() {
  const ctl = new AppController([
    new Note(
      "test.note",
      "Hello World!"
    ),
    new Note(
      "different.note",
      "That is another one"
    )
  ]);

  const searchCtl = new SearchController();
  // const [searchResults, setSearchResults] = useState<Action[]>([]);
  // const [searchVisible, setSearchVisible] = useState(false);

  const actions = [
    new Action("First action", "description", () => { console.log("First action") }),
    new Action("Second action", "another description", () => { console.log("Second action") }),
    new Action("Third", "", () => { console.log("Third action") }),
  ];

  return (
    <main className="container mx-auto">
      <Stream 
        notes={ctl.notes} 
        onUpdateNote={(idx,content) => ctl.updateNoteContent(idx,content)}
        />

        <Search controller={searchCtl} />
      <button onClick={() => searchCtl.startActionSearch(actions)}>Search actions</button>
      <button onClick={() => searchCtl.startYestNo(
        "Are you sure?", 
        () => { console.log("Yes") }, 
        () => { console.log("No") }
      )}>Yes/No</button>
      <button onClick={() => searchCtl.startInput("What's your age?", (age) => { console.log("Your age is", age) })}>Get input</button>
    </main>
  );
}

export default App;
