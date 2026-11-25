"""Original vector decoration for Acumelo; no third-party game artwork."""
from pathlib import Path
out=Path(__file__).resolve().parent.parent/'assets'/'studio';out.mkdir(parents=True,exist_ok=True)
icons={
 'workflow':('#78c8ff','#3458ca','<rect x="16" y="16" width="12" height="12" rx="4"/><rect x="37" y="35" width="12" height="12" rx="4"/><path d="M28 22h9a6 6 0 0 1 6 6v7M37 41h-9a6 6 0 0 1-6-6v-7" fill="none" stroke="currentColor" stroke-width="5"/>'),
 'strategy':('#ffe398','#cb8d24','<path d="M20 16v34" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M23 16h23l-5 8 5 8H23z"/><path d="M30 42h16M30 49h10" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
 'design':('#ffade5','#b349a1','<path d="m39 15 11 10-23 24-13 3 3-13z"/><path d="m18 40 8 8M35 20l10 10" stroke="#833d89" stroke-width="4"/><circle cx="18" cy="21" r="4"/>'),
 'analytics':('#8ff1df','#188b82','<path d="M16 45V32h8v13zm12 0V23h8v22zm12 0V14h8v31z"/><path d="M15 50h34" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
 'marketing':('#ffc19b','#df6847','<path d="M14 27h13l21-11v32L27 37H14z"/><path d="m21 37 3 14h8l-4-14"/><path d="M51 25v14" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
 'development':('#c9b0ff','#7951ce','<path d="m24 22-11 10 11 10m16-20 11 10-11 10M35 18l-6 28" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>')
}
for key,(light,dark,paths) in icons.items():
 svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 68"><defs><linearGradient id="g" x2=".2" y2="1"><stop stop-color="{light}"/><stop offset="1" stop-color="{dark}"/></linearGradient></defs><rect x="3" y="7" width="58" height="58" rx="18" fill="{dark}" stroke="#34305a" stroke-width="3"/><rect x="3" y="2" width="58" height="58" rx="18" fill="url(#g)" stroke="{light}" stroke-width="3"/><path d="M13 8Q32 2 51 8" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/><g fill="#fff8e7" color="#fff8e7" transform="translate(0 -1)">{paths}</g></svg>'''
 (out/f'field-{key}.svg').write_text(svg,encoding='utf-8')
floating=''
for key,x,y,angle,scale in [('workflow',85,280,-16,1.5),('strategy',580,165,12,1.35),('design',590,430,15,1.5),('analytics',95,565,-10,1.4),('marketing',440,685,-12,1.1),('development',245,110,-8,1.3)]:
 # Inline original art keeps the hero self-contained and avoids external SVG image dependencies.
 light,dark,paths=icons[key]
 floating+=f'<g transform="translate({x} {y}) rotate({angle}) scale({scale})"><rect x="2" y="8" width="64" height="64" rx="20" fill="#101737"/><rect width="64" height="64" rx="20" fill="{dark}" stroke="{light}" stroke-width="4"/><path d="M12 8h40" stroke="{light}" stroke-width="4" stroke-linecap="round"/><g fill="#fff7e6" color="#fff7e6">{paths}</g></g>'
stage=f'''<svg xmlns="http://www.w3.org/2000/svg" width="800" height="900" viewBox="0 0 800 900"><defs>
<radialGradient id="halo"><stop stop-color="#a28ef5" stop-opacity=".45"/><stop offset="1" stop-color="#51439a" stop-opacity="0"/></radialGradient>
<linearGradient id="arch" x2="1" y2="1"><stop stop-color="#cab5ff"/><stop offset=".35" stop-color="#8762d2"/><stop offset="1" stop-color="#473883"/></linearGradient>
<linearGradient id="gold" x2=".3" y2="1"><stop stop-color="#fff0bb"/><stop offset=".45" stop-color="#f4c46b"/><stop offset="1" stop-color="#a76f3f"/></linearGradient>
<linearGradient id="screen" x2=".4" y2="1"><stop stop-color="#548de8"/><stop offset="1" stop-color="#233476"/></linearGradient>
<linearGradient id="desk" x2="0" y2="1"><stop stop-color="#c4b3e9"/><stop offset="1" stop-color="#706199"/></linearGradient>
</defs><ellipse cx="415" cy="435" rx="390" ry="400" fill="url(#halo)"/>
<g opacity=".5" fill="none" stroke="#b3c5ff"><ellipse cx="410" cy="460" rx="300" ry="315" stroke-width="2" stroke-dasharray="4 16"/><ellipse cx="410" cy="460" rx="345" ry="235" transform="rotate(-30 410 460)" stroke-opacity=".25" stroke-width="3"/></g>
<ellipse cx="405" cy="760" rx="260" ry="50" fill="#0c1436" opacity=".7"/>
<path d="M175 648 410 555 653 652v63L410 816 175 710z" fill="#403963" stroke="#9a84c7" stroke-width="5"/>
<path d="m175 648 235-95 243 99-243 103z" fill="url(#desk)" stroke="#d0bdf3" stroke-width="5"/>
<path d="M219 648V349a185 185 0 0 1 370 0v299l-45 21V349a140 140 0 0 0-280 0v319z" fill="url(#arch)" stroke="#dbbfff" stroke-width="5"/>
<path d="M249 655V350a155 155 0 0 1 310 0v305" fill="none" stroke="url(#gold)" stroke-width="13"/>
<path d="M279 642V353a125 125 0 0 1 250 0v289z" fill="#182755"/>
<rect x="255" y="310" width="310" height="260" rx="29" fill="#131e48" transform="rotate(-5 410 440)"/>
<g transform="rotate(-5 410 440)"><rect x="250" y="296" width="310" height="260" rx="29" fill="url(#screen)" stroke="#9dcaff" stroke-width="6"/>
<path d="M256 345h298" stroke="#abcfff" stroke-width="3" opacity=".65"/><g fill="#e1ecff"><circle cx="278" cy="322" r="6"/><circle cx="300" cy="322" r="6"/><circle cx="322" cy="322" r="6"/></g>
<path d="m342 382-37 36 37 36m112-72 37 36-37 36m-37-88-31 101" fill="none" stroke="#fff1bc" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="294" y="490" width="94" height="12" rx="6" fill="#9cded5"/><rect x="404" y="490" width="70" height="12" rx="6" fill="#a8bfff"/><rect x="294" y="515" width="153" height="10" rx="5" fill="#789de3"/></g>
<path d="m360 591 61-23 54 22-61 25z" fill="#d2e3ff" stroke="#8399d0" stroke-width="4"/><path d="M360 591v27l54 27 61-30v-25l-61 25z" fill="#647eb9"/><path d="m287 690 125-47 108 43-125 50z" fill="#272955" stroke="#c9b6ee" stroke-width="5"/>
{floating}<g fill="#ffe7a4"><path d="m635 326 4 13 13 4-13 4-4 13-4-13-13-4 13-4z"/><path d="m180 192 3 9 9 3-9 3-3 9-3-9-9-3 9-3z"/></g><g fill="#a7dbff"><circle cx="175" cy="475" r="5"/><circle cx="574" cy="620" r="6"/><circle cx="460" cy="117" r="4"/></g></svg>'''
(out/'creative-stage.svg').write_text(stage,encoding='utf-8')
print('Created six original field icons and one decorative studio stage.')
