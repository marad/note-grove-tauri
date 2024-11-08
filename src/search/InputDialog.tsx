import { useState } from "react";
import { Search } from "./Search";
import { Action } from "../core/Action";

interface Props {
    initialInput?: string,
    prompt: string,
    onCloseRequest?:  () => void,
    onAccept: (input:string) => void,
    onCancel?: () => void,
};

export function InputDialog({
    prompt,
    initialInput = "",
    onCloseRequest = () => {},
    onAccept = (input:string) => { onCloseRequest() },
    onCancel = () => { onCloseRequest() },
}: Props) {
    const [input, setInput] = useState(initialInput)
    return (
        <Search
            prompt={prompt}
            results={[
                new Action("Accept", "", () => onAccept(input)),
                new Action("Cancel", "", onCancel)
            ]}
            initialQuery={initialInput}
            onSearch={setInput}
            onCloseRequest={onCloseRequest}
            />
    )
}