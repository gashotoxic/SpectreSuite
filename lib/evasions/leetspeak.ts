// leetspeak.ts
// Reason: Implement a function to convert text to leetspeak

export function leetspeak(input: string): string {
    const leetMap: { [key: string]: string } = {
        'a': '4', 'b': '8', 'c': '(', 'd': '|)', 'e': '3', 'f': '|=', 'g': '6', 'h': '#', 'i': '1',
        'j': '_|', 'k': '|<', 'l': '1', 'm': '|\/|', 'n': '|\|', 'o': '0', 'p': '|*', 'q': '(_,)', 'r': '2',
        's': '5', 't': '7', 'u': '(_)', 'v': '\/', 'w': '\/\/', 'x': '><', 'y': '`/', 'z': '2'
    };

    return input.split('').map(char => leetMap[char.toLowerCase()] || char).join('');
}