// Native After Effects composition builder. No external images/plugins required.
// Run through File > Scripts > Run Script File. Creates a NEW project only if none exists.
(function(){
app.beginUndoGroup('Acumelo motion study');
if(!app.project)app.newProject();
var c=app.project.items.addComp('ACUMELO / Kinetic type study',1920,1080,1,5,30);
var bg=c.layers.addSolid([.03,.06,.13],'Midnight background',1920,1080,1,5);
var words=['CREATE.','CONNECT.','MAKE IT REAL.'];
for(var i=0;i<words.length;i++){
 var t=c.layers.addText(words[i]);var p=t.property('Source Text'),d=p.value;d.fontSize=i===2?110:160;d.fillColor=i===1?[1,.37,.27]:[.95,.93,.85];p.setValue(d);
 t.property('Position').setValue([180,340+i*220]);
 var opacity=t.property('Opacity');opacity.setValueAtTime(i*.6,0);opacity.setValueAtTime(i*.6+.4,100);
 var pos=t.property('Position');pos.setValueAtTime(i*.6,[180,400+i*220]);pos.setValueAtTime(i*.6+.7,[180,340+i*220]);
}
var ring=c.layers.addShape();ring.name='Animated orbital stroke';
var g=ring.property('Contents').addProperty('ADBE Vector Group');var ellipse=g.property('Contents').addProperty('ADBE Vector Shape - Ellipse');ellipse.property('Size').setValue([500,500]);
var stroke=g.property('Contents').addProperty('ADBE Vector Graphic - Stroke');stroke.property('Color').setValue([.2,.45,1]);stroke.property('Stroke Width').setValue(26);
ring.property('Position').setValue([1500,400]);ring.property('Scale').expression='s=100+12*Math.sin(time*2); [s,s]';
c.openInViewer();app.endUndoGroup();
})();
