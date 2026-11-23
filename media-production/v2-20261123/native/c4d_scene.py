"""Cinema 4D 2024 Python study: editable MoGraph-style radial sculpture."""
import c4d, math, os
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
doc=c4d.documents.BaseDocument()
group=c4d.BaseObject(c4d.Onull);group.SetName('Acumelo / radial motion sculpture');doc.InsertObject(group)
for i in range(12):
    cube=c4d.BaseObject(c4d.Ocube);cube[c4d.PRIM_CUBE_LEN]=c4d.Vector(32,160,32)
    cube.SetAbsPos(c4d.Vector(math.cos(i*math.pi/6)*200,80,math.sin(i*math.pi/6)*200));cube.SetAbsRot(c4d.Vector(-i*math.pi/6,0,.15*i));cube.InsertUnder(group)
    cube.SetName('Radial element %02d'%i)
dest=os.path.join(root,'assets','acumelo-radial-sculpture.c4d')
ok=c4d.documents.SaveDocument(doc,dest,c4d.SAVEDOCUMENTFLAGS_0,c4d.FORMAT_C4DEXPORT)
print('ACUMELO_NATIVE_C4D_SAVED',ok,dest)
