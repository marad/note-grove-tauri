import { Note } from "./core/Note";
import { NoteCard } from "./NoteCard";
import './Stream.css';

interface StreamProps {
    notes: Array<Note>,
    onUpdateNote: (index: number, content: string) => void
}

export function Stream({notes, onUpdateNote}: StreamProps) {

    const items = notes.map((note, index) =>
        <NoteCard 
            note={note} 
            onUpdateContent={(newContent) => {
                onUpdateNote(index, newContent)
            }}
            />
    );

    return (
        <div className="flex flex-col gap-3">
            {items}
        </div>
    );
}