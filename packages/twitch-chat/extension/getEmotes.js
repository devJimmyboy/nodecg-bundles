export class Emotes {
	emotes;
	constructor(emotes) {
		this.emotes = {
			PartyHat: 965738,
			EarthDay: 959018,
			TombRaid: 864205,
			PopCorn: 724216,
		};
	}

	indexesOf(text, code) {
		const result = [];
		let index = -1;

		while (true) {
			index = text.indexOf(code, index + 1);
			if (index === -1) break;
			result.push(index);
		}

		return result;
	}

	findEmotes(text, emotes) {
		const found = [];

		for (const code of Object.keys(emotes)) {
			for (const index of indexesOf(text, code)) {
				found[index] = code;
			}
		}

		return found;
	}

	getCharArray (text) {
    const emotes = getEmotes();
    const found = findEmotes(text, emotes);
    const charArray = [];

    for (let i = 0; i < text.length; i++) {
        if (found[i]) {
            // this is an emote
            const id = emotes[found[i]];
            charArray.push(id);
            i += (found[i].length - 1);
        } else {
            // this is text
            charArray.push(text[i]);
        }
    }

    return charArray;
}
}
