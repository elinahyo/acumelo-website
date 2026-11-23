// Rebuild the published repository from its editable sources; no dependencies.
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
const root = path.resolve(import.meta.dirname, '..');
const [html, css, data, script] = await Promise.all(['source.html','styles.css','content.js','site.js'].map(p=>fs.readFile(path.join(root,p),'utf8')));
const ctx = {window:{}}; vm.runInNewContext(data,ctx,{timeout:1000});
const inlineData = 'window.ACUMELO = ' + JSON.stringify(ctx.window.ACUMELO).replace(/</g,'\\u003c') + ';';
const preparedHtml = html.replace(/((?:src|href)="assets\/brand\/[^"?]+)\?[^\"]*(")/g,'$1$2');
const output = preparedHtml.replace('<link rel="stylesheet" href="styles.css">','<style>\n'+css+'\n</style>')
  .replace('<script defer src="content.js"></script>','').replace('<script defer src="site.js"></script>','')
  .replace('</body>','<script>\n'+inlineData+'\n</script>\n<script>\n'+script+'\n</script>\n</body>');
await fs.writeFile(path.join(root,'index.html'),output);
console.log('Rebuilt index.html. Videos remain separate on-demand assets.');
