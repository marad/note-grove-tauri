
import { readTextFile } from '@tauri-apps/plugin-fs';
import toml from 'toml';


export interface RootConfig {
    name: string,
    path: string,
    color: string,
}

export interface Config {
    roots: RootConfig[];
}

export async function loadConfig(path: string): Promise<Config> {
    console.log("Loading config from:", path);
    const content = await readTextFile(path);
    return toml.parse(content);
}