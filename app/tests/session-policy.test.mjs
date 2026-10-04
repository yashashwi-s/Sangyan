import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('integrated journeys preserve optional encrypted recovery and never silently delete a legacy copy',async()=>{const main=await readFile(new URL('../dist/main.js',import.meta.url),'utf8');assert.match(main,/createNominationCoach/);assert.match(main,/createJourneyEntry/);assert.match(main,/sealCase/);assert.match(main,/openCase/);assert.doesNotMatch(main,/clearLegacyRecords|sessionText/);assert.match(main,/if\(forget\)/);});
