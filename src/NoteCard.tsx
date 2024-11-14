import { Note } from './core/Root';
import './NoteCard.css'

interface NoteCardProps {
    note: Note,
    onUpdateContent: (newContent: string) => void,
}

export function NoteCard({note, onUpdateContent}: NoteCardProps) {
    const lines = note.content.split("\n").length
    return (
        <div className='isolate rounded-md shadow-sm bg-zinc-700 p-2 flex flex-col text-slate-200'>
            <h1 className='text-lg'>
                {note.id}
            </h1>
            <p>
                <textarea
                    className='w-full h-full rounded-sm resize-none dark:bg-zinc-700 focus:outline-none'
                    rows={lines}
                    value={note.content}
                    onChange={ (event) => onUpdateContent(event.currentTarget.value)}
                > </textarea>
            </p>
        </div>
    )
}