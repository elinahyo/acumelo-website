import fs from 'node:fs';
import path from 'node:path';

export const ffmpeg = process.env.FFMPEG_PATH || 'ffmpeg';

// Explicit licensed fonts retain the historical Windows typography.
// Liberation is the Linux fallback; output is not guaranteed pixel-identical.
export function registerFonts(fonts) {
  const overrides=[process.env.ACUMELO_FONT_REGULAR,process.env.ACUMELO_FONT_BOLD,process.env.ACUMELO_FONT_MONO];
  const windows=process.env.WINDIR ? path.join(process.env.WINDIR,'Fonts') : null;
  const candidates=[
    [windows&&path.join(windows,'arial.ttf'),'/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf','/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'],
    [windows&&path.join(windows,'arialbd.ttf'),'/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf','/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'],
    [windows&&path.join(windows,'consola.ttf'),'/usr/share/fonts/truetype/liberation2/LiberationMono-Regular.ttf','/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf']
  ];
  for(let i=0;i<candidates.length;i++){
    const file=overrides[i] || candidates[i].find(p=>p&&fs.existsSync(p));
    if(!file||!fs.existsSync(file))throw new Error('Install Liberation fonts or set ACUMELO_FONT_REGULAR, ACUMELO_FONT_BOLD and ACUMELO_FONT_MONO to font files.');
    fonts.registerFromPath(file,i===2?'Consolas':'Arial');
  }
}
