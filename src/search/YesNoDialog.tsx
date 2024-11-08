import { useState } from "react";
import { Action } from "../core/Action";
import { Search } from "./Search";
import { MatchingStrategy } from "../MatchingStrategy";

interface Props {
    initialQuery?: string,
    prompt: string,
    onYes: () => void,
    onNo?:  () => void,
    onCloseRequest?: () => void,
};

export function YesNoDialog({
    prompt,
    initialQuery = "",
    onCloseRequest = () => {},
    onYes = () => { onCloseRequest() },
    onNo = () => { onCloseRequest() },
}: Props) {
    const [filter, setFilter] = useState(initialQuery)
    return (
        <Search
            prompt={prompt}
            results={[
                new Action("Yes", "", onYes),
                new Action("No", "", onNo)
            ].filter((action) => MatchingStrategy.fuzzy(action.name, filter))}
            initialQuery={filter}
            onSearch={setFilter}
            onCloseRequest={onCloseRequest}
            />
    );
}