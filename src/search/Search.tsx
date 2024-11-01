import { useState } from "react";

export class SearchController {
    visible: boolean;
    setVisible: (visible: boolean) => void;

    constructor() {
        const [visible, setVisible] = useState(true);
        this.visible = visible;
        this.setVisible = setVisible;
    }
}

interface SearchProps {
    controller: SearchController
}

function SearchDialog({controller}: SearchProps) {
    return (
        <div id="search-dialog"
            className="fixed z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4">
            <div className="relative top-40 mx-auto shadow-xl rounded-md bg-zinc-700 max-w-md p-4">
                This is my modal
            </div>
        </div>
    );
}

export function Search({controller}: SearchProps) {
    if (controller.visible) {
        return <SearchDialog controller={controller}/>
    } else {
        return (<span></span>);
    }
}