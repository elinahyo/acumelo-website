import fs from 'node:fs';
import {films,members,fields,productionRules} from './blueprint.mjs';
fs.writeFileSync(new URL('./production.json',import.meta.url),JSON.stringify({films,members,fields,productionRules},null,2));
console.log(`${films.length} films / ${films.filter(f=>f.scope==='instructor').length} instructor-field assignments`);
