import "./App.css";
import { useState } from "react";
import { Stream } from "./Stream";
import { Note } from "./core/Note";
import { Search } from "./search/Search";
import { Action } from "./core/Action";

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

  const [searchResults, setSearchResults] = useState<Action[]>([]);
  const [searchVisible, setSearchVisible] = useState(false);

  const searchOpts = {
    searchFn: (query: string) => {
      return [
        new Action("First action", "description", () => {console.log("First action")}),
        new Action("Second action", "another description", () => {console.log("Second action")}),
        new Action("Third", "", () => {console.log("Third action")}),
      ].filter(action => {
        return action.name.indexOf(query) >= 0
      });
    }
  };

  return (
    <main className="container mx-auto">
      <Stream 
        notes={ctl.notes} 
        onUpdateNote={(idx,content) => ctl.updateNoteContent(idx,content)}
        />

        <Search
          results={searchResults}
          visible={searchVisible}
          onClose={() => setSearchVisible(false)}
          onSearch={(query) => setSearchResults(searchOpts.searchFn(query))}
        />
      <button onClick={() => setSearchVisible(true)}>Search</button>
    </main>
  );
}

export default App;
