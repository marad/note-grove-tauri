import "./App.css";
import { useState } from "react";
import { Stream } from "./Stream";
import { Note } from "./core/Note";
import { Search, SearchController } from "./search/Search";


class AppController {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  selectedIndex: number = 0;
  setSelectedIndex: (index: number) => void;

  search: SearchController = new SearchController();

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


  return (
    <main className="container mx-auto">
      <Stream 
        notes={ctl.notes} 
        onUpdateNote={(idx,content) => ctl.updateNoteContent(idx,content)}
        />
        <button onClick={() => ctl.search.setVisible(true)}> Przycisk</button>
      <Search controller={ctl.search}/>
    </main>
  );
}

export default App;
