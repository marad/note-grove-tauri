import { useState, useEffect, useRef, useCallback } from "react";
import { Action } from "../core/Action";

export interface SearchState {
    selectedIndex: number,
    query: string
}

function selectNext(state: SearchState, results: Action[]): SearchState {
    var index = state.selectedIndex + 1;
    if (index >= results.length) {
        index = results.length-1;
    }
    return {...state, selectedIndex: index};
}

function selectPrev(state: SearchState): SearchState {
    var index = state.selectedIndex - 1;
    if (index < 0) {
        index = 0;
    }
    return {...state, selectedIndex: index};
}

interface SearchProps {
    results: Action[],
    onClose?: () => void,
    onSearch?: (query: string) => void,
    visible: boolean,
    initialQuery?: string
}

export function Search({ results, onClose, visible, onSearch, initialQuery }: SearchProps) {
    const _onClose = onClose || (() => { });
    const _onSearch = onSearch || (() => { });
    const _initialQuery = initialQuery || "";

    const [state, updateState] = useState<SearchState>({ query: _initialQuery, selectedIndex: 0 });
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // focus the input when the dialog is shown
        if (visible && inputRef.current) {
            inputRef.current.focus();
        }
        // reset the query when the dialog is hidden
        if (!visible) {
            updateState({ query: "", selectedIndex: 0 });
        }
    }, [visible]);

    const handleKeyPress = useCallback((event: KeyboardEvent) => {
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
            _onClose();
            }
            event.stopPropagation();
        }
        if (event.type == 'keydown' && event.key == "Escape") {
            _onClose();
            event.stopPropagation();
        }
    }, [state, results]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    const resultsView = results.map((act, idx) => {
        var classes = "border-l-2 px-2 py-1";
        if (idx == state.selectedIndex) {
            classes += " bg-zinc-600";
        }

        return <li className={classes}>
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
            className={`fixed z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 ${visible ? '' : 'hidden'}`}>
            <div className="relative top-40 mx-auto shadow-xl rounded-md bg-zinc-700 max-w-md p-1 gap-3 flex flex-col">
                <input
                    type="text"
                    value={state.query}
                    onChange={(event) => {
                        const value = event.target.value;
                        _onSearch(value);
                        updateState({ ...state, query: value });
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
