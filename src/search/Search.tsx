import { useState, useEffect, useRef, useCallback } from "react";
import { Action } from "../core/Action";
import useOutsideClick from "../hooks/useOutsideClick";

export interface SearchState {
    selectedIndex: number,
    query: string
}

interface SearchProps {
    initialQuery: string,
    results: Action[],
    prompt: string|null,
    onCloseRequest: () => void,
    onSearch: (query: string) => void,
}

export function Search({ 
    initialQuery = "" ,
    results = [],
    prompt = null,
    onCloseRequest = ()=>{},
    onSearch = (_: string)=>{},
}: SearchProps) {

    const [state, updateState] = useState<SearchState>({ query: initialQuery, selectedIndex: 0 });
    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    useOutsideClick(wrapperRef, () => {
        onCloseRequest();
    });

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [inputRef]);

    function selectNext(state: SearchState, results: Action[]): SearchState {
        var index = state.selectedIndex + 1;
        if (index >= results.length) {
            index = results.length - 1;
        }
        return { ...state, selectedIndex: index };
    }

    function selectPrev(state: SearchState): SearchState {
        var index = state.selectedIndex - 1;
        if (index < 0) {
            index = 0;
        }
        return { ...state, selectedIndex: index };
    }

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.type == 'keydown' && event.key == "j" && event.ctrlKey) {
            updateState(selectNext(state, results));
            event.stopPropagation();
        }
        if (event.type == 'keydown' && event.key == "k" && event.ctrlKey) {
            updateState(selectPrev(state));
            event.stopPropagation();
        }
        if (event.type == 'keydown' && event.key == "Enter") {
            if (state.selectedIndex >= 0 && state.selectedIndex < results.length) {
                results[state.selectedIndex].action();
                onCloseRequest();
            }
            event.stopPropagation();
        }
        if (event.type == 'keydown' && event.key == "Escape") {
            onCloseRequest();
            event.stopPropagation();
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    useEffect(() => onSearch(state.query), [state.query])

    const resultsView = results.map((act, idx) => {
        var classes = "border-l-2 px-2 py-1 cursor-pointer";
        if (idx == state.selectedIndex) {
            classes += " bg-zinc-600";
        }

        return <li 
            key={idx}
            className={classes}
            data-index={idx}
            onClick={() => {
                act.action()
                onCloseRequest()
            }}
        >
            <h3 className="">
                {act.name}
            </h3>
            <h4 className="text-gray-400/80">
                {act.description}
            </h4>
        </li>
    });

    return (
        <div id="search-dialog"
            className={`fixed z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4`}>
            <div
                className="relative top-20 mx-auto shadow-xl rounded-md bg-zinc-700 max-w-md p-1 flex flex-col"
                ref={wrapperRef}>
                {prompt ?
                    <h1 className="p-1 text-lg py-2">
                        {prompt}
                    </h1> : null
                }
                <input
                    type="text"
                    value={state.query}
                    onChange={(event) => {
                        updateState({ ...state, query: event.target.value });
                    }}
                    ref={inputRef}
                    className="w-full px-3 py-2 focus:outline-none rounded-sm" />
                <ul className="w-full px-3 py-2 flex flex-col gap-2">
                    {resultsView}
                </ul>
            </div>
        </div>
    );
}
