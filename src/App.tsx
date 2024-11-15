import "./App.css";
import { useEffect, useMemo, useState } from "react";
import { Stream } from "./Stream";
import { Note, createNote, Root } from "./core/Root";
import { createAction, createActionWithDesc } from "./core/Action";
import { YesNoDialog } from "./search/YesNoDialog";
import { InputDialog } from "./search/InputDialog";
import { writeTextFile, readTextFile, readDir } from "@tauri-apps/plugin-fs";
import { appLocalDataDir, homeDir, dataDir, executableDir, runtimeDir, resolve} from "@tauri-apps/api/path";
import { data } from "autoprefixer";
import { Config, loadConfig } from "./core/Config";

enum Dialog {
  None,
  YesNo,
  Input
}

interface AppState {
  config: Config,
  roots: Root[],
  activeRootIndex: number;
}

function activeRoot(state: AppState) {
  return state.roots[state.activeRootIndex]
}


function createAppState(config: Config): AppState {
  if (config.roots.length == 0) {
    throw "Config should contain at least one root definition.";
  }
  return {
    config,
    roots: config.roots.map((rootCfg) => new Root(rootCfg.name, rootCfg.color, rootCfg.path)),
    activeRootIndex: 0
  }
}

function App() {
  const [state, setState] = useState<AppState>()
  useEffect(() => {
    resolve('../config.toml')
      .then(loadConfig)
      .then(createAppState)
      .then(setState);
    return () => { }
  }, []);


  const [notes, setNotes] = useState<Array<Note>>([]);
  // useEffect(() => {

  //   if (state != undefined) {
  //     activeRoot(state).listNotes()
  //       .then((listing) => listing.map((id) => activeRoot(state).openNote(id)))
  //       .then(setNotes)
      
  //   }

  // }, [state])


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

    console.log(await resolve('.'));

    if (state != undefined) {
      (await activeRoot(state).listNotes()).forEach((value) => {
        console.log(value);
      });
    }
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
