"""Original Acumelo procedural 3D studies. Run in Blender 4.5, no downloaded assets."""
import bpy, math, os, sys, json
from mathutils import Vector
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT=os.path.join(ROOT,'assets','blender'); os.makedirs(OUT,exist_ok=True)
def mat(name,col,metal=0,rough=.35,emission=0):
    m=bpy.data.materials.new(name);m.diffuse_color=(*col,1);m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*col,1)
    p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough
    if emission:p.inputs['Emission Color'].default_value=(*col,1);p.inputs['Emission Strength'].default_value=emission
    return m
def obj(kind,loc,scale,material,rot=(0,0,0)):
    if kind=='cube':bpy.ops.mesh.primitive_cube_add(size=1,location=loc)
    elif kind=='sphere':bpy.ops.mesh.primitive_uv_sphere_add(segments=32,ring_count=16,location=loc)
    elif kind=='torus':bpy.ops.mesh.primitive_torus_add(major_radius=1,minor_radius=.28,major_segments=64,minor_segments=16,location=loc)
    elif kind=='cylinder':bpy.ops.mesh.primitive_cylinder_add(vertices=48,radius=1,depth=1,location=loc)
    else:bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1,radius=1,location=loc)
    o=bpy.context.object;o.scale=scale;o.rotation_euler=rot;o.data.materials.append(material)
    if kind!='ico':
        for p in o.data.polygons:p.use_smooth=True
    if kind=='cube':
        mod=o.modifiers.new('Precision bevel','BEVEL');mod.width=.07;mod.segments=4
        o.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
    return o
def area(loc,power,color,size):
    bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.data.energy=power;o.data.color=color;o.data.shape='DISK';o.data.size=size;o.rotation_euler=(Vector((0,0,1.3))-o.location).to_track_quat('-Z','Y').to_euler()
def camera(loc,target):
    bpy.ops.object.camera_add(location=loc);o=bpy.context.object;o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler();o.data.lens=48;bpy.context.scene.camera=o;return o
def setup():
    bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
    s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.samples=12;s.cycles.use_denoising=True
    try:
        prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='CUDA';prefs.get_devices()
        for d in prefs.devices:d.use=d.type!='CPU'
        s.cycles.device='GPU'
    except Exception:s.cycles.device='CPU'
    s.render.resolution_x=960;s.render.resolution_y=540;s.render.resolution_percentage=100
    s.render.image_settings.file_format='JPEG';s.render.image_settings.quality=90
    s.world.color=(.1,.1,.1);s.view_settings.view_transform='AgX'
    return s
records=[]
for kind in ['product','sculpture','gallery','islands']:
    s=setup(); blue=mat('Cobalt ceramic',(.025,.14,.8),.35);coral=mat('Coral satin',(.95,.19,.11),.2);cream=mat('Warm limestone',(.8,.76,.66));black=mat('Obsidian',(.015,.025,.05),.4);gold=mat('Brushed brass',(.7,.45,.13),.85);mint=mat('Luminous teal',(.02,.75,.65),.3,emission=.3)
    moving=[]
    if kind=='product':
        obj('cube',(0,0,-.25),(200,200,.4),cream);obj('cylinder',(0,0,.15),(1.65,1.65,.35),cream)
        body=obj('cube',(0,0,1.15),(1.55,.75,1.6),blue);body.name='Bottle / beveled body'
        obj('cylinder',(0,0,2.1),(.28,.28,.42),gold);obj('cube',(0,-.39,1.15),(.72,.025,.53),cream)
        for i in range(5):moving.append(obj('torus',(-1.8+i*.1,1.5,.65+i*.33),(.85,.85,.85),coral,rot=(math.pi/2,.3*i,0)))
        target=(0,0,1);radius=5.8;height=3
    elif kind=='sculpture':
        obj('cube',(0,0,-.3),(200,200,.5),black)
        for i in range(7):moving.append(obj('torus',(0,0,1.4),(.42+i*.19,)*3,coral if i%2 else gold,rot=(.25*i,.3*i,.2*i)))
        for i in range(18):obj('sphere',(2*math.cos(i),2*math.sin(i),.35+.2*(i%5)),(.06,)*3,mint)
        target=(0,0,1.3);radius=7;height=3.1
    elif kind=='gallery':
        obj('cube',(0,0,-.15),(18,18,.3),cream);obj('cube',(0,3,3),(16,.3,6),cream);obj('cube',(-4,0,3),(.3,7,6),cream)
        for i in range(7):obj('cube',(-3+i*.9,0,4.6),(.3,7,.25),cream)
        obj('cylinder',(0,0,.15),(1.4,1.4,.25),black)
        for i in range(4):moving.append(obj('torus',(0,0,1.8),(.55+i*.22,)*3,gold,rot=(math.pi/2,i*.6,0)))
        obj('cube',(3,1,.15),(1,4,.3),blue)
        target=(0,0,1.9);radius=8.5;height=3.3
    else:
        s.world.color=(.07,.04,.12)
        for i in range(13):
            x=(i%4-1.5)*2.7;y=(i//4-1.5)*2.5;z=.2*math.sin(i*2)
            obj('ico',(x,y,z),(1.2,1.2,1.8),black);obj('cylinder',(x,y,z+1),(1.0,1.0,.1),mint)
            obj('cube',(x,y,z+1.5),(.28,.28,1),blue)
        moving.append(obj('torus',(0,0,3.4),(.6,)*3,coral,rot=(.6,.2,0)))
        target=(0,0,1);radius=15;height=10
    area((1,-4,7),1400,(1,.83,.65),5);area((-4,1,4),1800,(.45,.65,1),4);area((4,3,6),2000,(1,.65,.45),3)
    cam=camera((radius,-radius*.65,height),target)
    dest=os.path.join(OUT,kind);os.makedirs(dest,exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,kind+'.blend'))
    for f in range(24):
        a=-.8+f/23*.4;cam.location=(radius*math.sin(a),-radius*math.cos(a),height);cam.rotation_euler=(Vector(target)-cam.location).to_track_quat('-Z','Y').to_euler()
        for j,o in enumerate(moving):o.rotation_euler.z+=.018*(j+1)
        s.render.filepath=os.path.join(dest,f'{f:03d}.jpg');bpy.ops.render.render(write_still=True)
    records.append({'id':kind,'renderer':'Blender 4.5 Cycles','frames':24,'resolution':[960,540],'original':True,'nativeProject':kind+'.blend'})
    print('ACUMELO_SCENE_DONE',kind,flush=True)
with open(os.path.join(OUT,'provenance.json'),'w') as f:json.dump(records,f,indent=2)
