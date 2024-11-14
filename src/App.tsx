import "./App.css";
import { useState } from "react";
import { Stream } from "./Stream";
import { Note, createNote, Root } from "./core/Root";
import { createAction, createActionWithDesc } from "./core/Action";
import { YesNoDialog } from "./search/YesNoDialog";
import { InputDialog } from "./search/InputDialog";
import { writeTextFile, readTextFile, readDir } from "@tauri-apps/plugin-fs";
import { appLocalDataDir, homeDir } from "@tauri-apps/api/path";

enum Dialog {
  None,
  YesNo,
  Input
}

function App() {
  const root = new Root("test", "red", "$home/test");
  const [notes, setNotes] = useState<Array<Note>>([
    createNote(
      root,
      "test.note",
      "Hello World!"
    ),
    createNote(
      root,
      "different.note",
      "That is another one"
    )
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // const [searchResults, setSearchResults] = useState<Action[]>([]);
  // const [searchVisible, setSearchVisible] = useState(false);

  const [selectedDialog, setSelectedDialog] = useState(Dialog.None);


  function updateNoteContent(index: number, content: string) {
    setNotes(notes.map((note, idx) => {
      if (idx == index) {
        return {...note, content };
      } else {
        return note;
      }
    }))
  }

  const actions = [
    createActionWithDesc("First action", "description", () => { console.log("First action") }),
    createActionWithDesc("Second action", "another description", () => { console.log("Second action") }),
    createAction("Third", () => { console.log("Third action") }),
  ];


  async function testWrite() {
    const path = await homeDir();
    console.log(await homeDir());
    writeTextFile(path + '/test.txt', 'hello worldzzz');
  }

  async function testRead() {
    const listing = await readDir(await homeDir());
    listing.forEach(async (entry) => {
      console.log(entry.name);
    });

    const content = await readTextFile(await homeDir() + '/test.txt');
    console.log("Content:");
    console.log(content);
  }


  return (
    <main className="container mx-auto">
      <Stream
        notes={notes}
        onUpdateNote={(idx, content) => updateNoteContent(idx, content)}
      />

      <div id="dialog-wrapper">
      { selectedDialog == Dialog.Input &&
        <InputDialog
          prompt="What's your age?"
          onAccept={(input) => console.log("Input", input)}
          onCloseRequest={() => setSelectedDialog(Dialog.None)}
        />}
      
      { selectedDialog == Dialog.YesNo &&
        <YesNoDialog
          prompt="Are you sure?"
          onYes={() => console.log("Well, ok!")}
          onCloseRequest={() => setSelectedDialog(Dialog.None)}
        />}
      </div>
      <button onClick={() => setSelectedDialog(Dialog.YesNo)}>Show Yes/No</button>
      <button onClick={() => setSelectedDialog(Dialog.Input)}>Show input</button>
      <button onClick={() => testRead()}>FS</button>
      {/* <button onClick={() => searchCtl.startActionSearch(actions)}>Search actions</button> */}
    </main>
  );
}

export default App;
