export class MatchingStrategy {
    static regex(entry: string, pattern: string): boolean {
        return new RegExp(pattern).test(entry);
    }

    static contains(entry: string, pattern: string): boolean {
        return entry.indexOf(pattern) >= 0;
    }

    static fuzzy(entry: string, pattern: string): boolean {
        let patternIdx = 0;
        let entryIdx = 0;
        while (patternIdx < pattern.length && entryIdx < entry.length) {
            if (pattern[patternIdx] === entry[entryIdx]) {
                patternIdx++;
            }
            entryIdx++;
        }
        return patternIdx === pattern.length;
    }
}