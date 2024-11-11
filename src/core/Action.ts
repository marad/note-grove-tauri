
export type action = () => void;

export interface Action {
    name: string;
    description: string;
    action: action;
}

export function createAction(name: string, action: action): Action {
    return {
        name,
        description: "",
        action
    }
}

export function createActionWithDesc(name: string, description: string, action: action): Action {
    return {
        name,
        description,
        action
    }
}
