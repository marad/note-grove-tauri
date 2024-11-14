import { readDir, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { MatchingStrategy } from "../MatchingStrategy";

export type NoteId = string;

export interface Note {
    root: Root,
    id: NoteId;
    content: string;
}

export function createNote(root: Root, id: NoteId, content: string): Note {
    return { root, id, content };
}

export function updateNoteContent(note: Note, content: string): Note {
    return { ...note, content }
}

export class Root {
    name: string;
    color: string;
    path: string;

    constructor(name: string, color: string, path: string) {
        this.path = path;
        this.name = name;
        this.color = color;
    }

    idToPath(id: NoteId): string {
        return this.path + '/' + id + '.md';
    }

    pathToId(path: string): NoteId {
        const parts = path.split('/');
        const filename = parts[parts.length - 1];
        return filename.replace('.md$', '');
    }

    async listNotes(filter: string = ""): Promise<NoteId[]> {
        const listing = await readDir(this.path);
        return listing.map(entry => entry.name.replace('.md$', ''))
            .filter(id => MatchingStrategy.fuzzy(id, filter));
    } 

    async openNote(id: NoteId): Promise<Note> {
        const content = await readTextFile(this.idToPath(id));
        return {
            root: this,
            id,
            content
        }
    }

    async saveNoteContent(note: Note): Promise<void> {
        await writeTextFile(this.idToPath(note.id), note.content);
    }

}