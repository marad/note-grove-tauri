
export type action = () => void;

export class Action {
    name: string;
    description: string;
    action: action;

    constructor(name: string, description: string, action: action) {
        this.name = name;
        this.description = description;
        this.action = action;
    };

    static create(name: string, action: action) {
        return new Action(name, "", action);
    }
}