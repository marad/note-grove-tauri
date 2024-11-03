import { useState } from "react";
import { Action } from "../core/Action";
import { MatchingStrategy } from "../MatchingStrategy";

type SearchFn = (query: string) => Action[];
// I needed to add this "box" because of the way useState works
// I couldn't just set the function directly. I guess...
interface SearchFnBox {
    fn: SearchFn;
}

export class SearchController {
    searchResults: Action[];
    setSearchResults: (results: Action[]) => void;
    searchVisible: boolean;
    setSearchVisible: (visible: boolean) => void;
    searchFn: SearchFnBox;
    setSearchFn: (fn: SearchFnBox) => void;
    initialQuery: string;
    setInitialQuery: (query: string) => void;
    prompt: string;
    setPrompt: (prompt: string) => void;

    constructor() {
        const [searchResults, setSearchResults] = useState<Action[]>([]);
        this.searchResults = searchResults;
        this.setSearchResults = setSearchResults;

        const [searchVisible, setSearchVisible] = useState(false);
        this.searchVisible = searchVisible;
        this.setSearchVisible = setSearchVisible;

        const [searchFn, setSearchFn] = useState<SearchFnBox>({fn: (_:string) => []});
        this.searchFn = searchFn;
        this.setSearchFn = setSearchFn;

        const [initialQuery, setInitialQuery] = useState("");
        this.initialQuery = initialQuery;
        this.setInitialQuery = setInitialQuery;

        const [prompt, setPrompt] = useState("");
        this.prompt = prompt;
        this.setPrompt = setPrompt;
    }

    startInput(prompt: string, onInput: (input: string) => void) {
        this.startSearch((query: string) => {
            return [
                new Action("Submit", "", () => onInput(query)),
                new Action("Cancel", "", () => {})
            ];
        }, "", prompt);
    }

    startYestNo(prompt: string, onYes: () => void, onNo: () => void) {
        this.startSearch((query: string) => {
            return [
                new Action("Yes", "", onYes),
                new Action("No", "", onNo)
            ].filter(action => {
                return MatchingStrategy.fuzzy(action.name, query);
            });
        }, "", prompt);
    }

    startActionSearch(actions: Action[], initialQuery: string = "", prompt: string = "") {
        this.startSearch((query: string) => {
            return actions.filter(action => {
                return MatchingStrategy.fuzzy(action.name, query);
            });
        }, initialQuery);
    }

    startSearch(searchFn: (query: string) => Action[], initialQuery: string = "", prompt: string = "") {
        this.setSearchFn({fn: searchFn});
        this.setInitialQuery(initialQuery);
        this.setPrompt(prompt);
        this.setSearchResults(searchFn(initialQuery));
        this.showSearch();
    }

    search(query: string) {
        this.setSearchResults(this.searchFn.fn(query));
    }

    showSearch() {
        this.setSearchVisible(true);
    }

    hideSearch() {
        this.setSearchVisible(false);
    }
}