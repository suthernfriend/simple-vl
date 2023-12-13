import {readFile} from "fs/promises";

import {parse} from "yaml";

async function run() {
    const file = await readFile("./src/assets/saarland.yaml");
    const data = parse(file.toString());


    for (const id in data.motions) {
        const motion = data.motions[id];

        console.log(`${id};${motion.title};${motion.presenter}`);
        console.log(`;${motion.link};`);
        console.log(`;Debatte`);
        console.log(`;"Nachfrage\nGibt es Änderungsanträge?"`);
        console.log(`;"Offene Abstimmung\nStimmt ihr dem Antrag zu?"`);
        console.log(``);
    }
}

run().catch(console.error);
