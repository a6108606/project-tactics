"""Ryuu: authored volumetric study, NOT a reconstruction extracted from the PNG.
Run with Blender 4.5: blender -b --python production/build_ryuu.py
Coordinates: Z up, face toward -Y. All proportions are explicit editable inputs.
"""
import bpy, math, pathlib, json, hashlib
from mathutils import Vector

ROOT = pathlib.Path(__file__).resolve().parents[1]
bpy.context.preferences.filepaths.save_version = 0
PALETTE = {'skin':'F1BC85','hair':'C7D5B4','clothing1':'51315D','clothing2':'B0434E','clothing3':'46394B'}

def material(name, hexcolor, metallic=0):
    m=bpy.data.materials.new(name); m.diffuse_color=(*[int(hexcolor[i:i+2],16)/255 for i in (0,2,4)],1)
    m.use_nodes=True; p=m.node_tree.nodes.get('Principled BSDF')
    # Hex inputs are sRGB, Blender shader colors are linear.
    rgb=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in m.diffuse_color[:3]]
    p.inputs['Base Color'].default_value=(*rgb,1); p.inputs['Roughness'].default_value=.82
    p.inputs['Metallic'].default_value=metallic
    return m

def group(name, parent=None):
    o=bpy.data.objects.new(name,None); bpy.context.collection.objects.link(o); o.parent=parent; return o

def finish(o,name,mat,parent,smooth=True):
    o.name=name; o.parent=parent; o.data.materials.append(mat)
    for p in o.data.polygons:p.use_smooth=smooth
    return o

def ell(name, loc, scale, mat, parent, rot=None, seg=24):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg,ring_count=16,location=loc)
    o=bpy.context.object; o.scale=scale
    if rot:o.rotation_euler=rot
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    return finish(o,name,mat,parent)

def mesh(name,vs,fs,mat,parent,smooth=False):
    d=bpy.data.meshes.new(name);d.from_pydata(vs,[],fs);d.update()
    o=bpy.data.objects.new(name,d);bpy.context.collection.objects.link(o)
    return finish(o,name,mat,parent,smooth)

def loft(name,rings,mat,parent,n=16,smooth=True):
    # rings are center xyz + x/y radii, with alternating folds for cloth.
    vs=[]
    for x,y,z,rx,ry in rings:
        for i in range(n):
            a=i*2*math.pi/n; fold=1+.035*math.cos(4*a)
            vs.append((x+math.cos(a)*rx*fold,y+math.sin(a)*ry*fold,z))
    fs=[tuple(reversed(range(n)))]
    for j in range(len(rings)-1):
        for i in range(n):fs.append((j*n+i,j*n+(i+1)%n,(j+1)*n+(i+1)%n,(j+1)*n+i))
    fs.append(tuple((len(rings)-1)*n+i for i in range(n)))
    return mesh(name,vs,fs,mat,parent,smooth)

def stroke(name,pts,radius,mat,parent):
    c=bpy.data.curves.new(name,'CURVE');c.dimensions='3D';c.resolution_u=16;c.bevel_depth=radius;c.bevel_resolution=3
    s=c.splines.new('BEZIER');s.bezier_points.add(len(pts)-1)
    for b,p in zip(s.bezier_points,pts):b.co=p;b.handle_left_type='VECTOR' if name in ('buckle','trouser_emblem') else 'AUTO';b.handle_right_type=b.handle_left_type
    o=bpy.data.objects.new(name,c);bpy.context.collection.objects.link(o);o.parent=parent;o.data.materials.append(mat)
    bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.convert(target='MESH');o.select_set(False)
    return o

def between(name,a,b,r1,r2,mat,parent):
    a,b=Vector(a),Vector(b);v=b-a
    bpy.ops.mesh.primitive_cone_add(vertices=16,radius1=r1,radius2=r2,depth=v.length,location=(a+b)/2)
    o=bpy.context.object;o.rotation_euler=v.to_track_quat('Z','Y').to_euler()
    bevel=o.modifiers.new('Soft crafted edges','BEVEL');bevel.width=.035;bevel.segments=2
    bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=bevel.name)
    return finish(o,name,mat,parent)

def blade_leaf(name,points,widths,depth,mat,parent):
    # Swept diamond cross section, closed volumetric lock of hair / cloth tip.
    vs=[]
    for j,(p,w) in enumerate(zip(points,widths)):
        p=Vector(p); tangent=Vector(points[min(j+1,len(points)-1)])-Vector(points[max(0,j-1)])
        side=tangent.cross(Vector((0,1,0))).normalized()
        if side.length<.1:side=Vector((1,0,0))
        vs.extend([tuple(p+side*w),tuple(p+Vector((0,-depth*w,0))),tuple(p-side*w),tuple(p+Vector((0,depth*w,0)))])
    fs=[(3,2,1,0)]
    for j in range(len(points)-1):
        for k in range(4):fs.append((j*4+k,j*4+(k+1)%4,(j+1)*4+(k+1)%4,(j+1)*4+k))
    fs.append(tuple((len(points)-1)*4+k for k in range(4)))
    return mesh(name,vs,fs,mat,parent,False)

def panel(name,points,mat,parent,thickness=.025):
    o=mesh(name,points,[tuple(range(len(points)))],mat,parent)
    s=o.modifiers.new('Real cloth thickness','SOLIDIFY');s.thickness=thickness
    b=o.modifiers.new('Bound edges','BEVEL');b.width=.012;b.segments=2
    bpy.context.view_layer.objects.active=o
    for mod in list(o.modifiers):bpy.ops.object.modifier_apply(modifier=mod.name)
    return o

def build(base):
    bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
    for m in list(bpy.data.materials):bpy.data.materials.remove(m)
    M={k:material('base_'+k,v) for k,v in PALETTE.items()}
    M.update({k:material('fixed_'+k,v) for k,v in {'leather':'563A2B','edge':'30282D','gold':'BD8841','bandana':'603872','pattern':'A33555','cream':'FFF1D4','iris':'A4541B','pupil':'221D23','glint':'FFFFFF','steel':'839398','mouth':'923D3A'}.items()})
    root=group('Ryuu_'+base);root['status']='proposal-awaiting-art-approval';root['source_sha256']='8d7e17983eee6b29abea9e7f4a52b87eb32a8c74771442591ad846913a475c20'
    body=group('body',root);female=base=='feminine';width=.9 if female else 1
    # Open, complete body under the removable equipment.
    loft('torso',[(0,0,1.92,.26*width,.19),(0,0,2.1,.25*width,.18),(0,0,2.38,.34*width,.205),(0,0,2.59,.36*width,.21),(0,0,2.67,.24,.17)],M['skin'],body)
    between('neck',(0,0,2.6),(0,0,2.9),.14,.15,M['skin'],body)
    for s in (-1,1):
        x=s*.25
        # Wide asymmetric folds taper into a fitted calf cuff.
        loft('baggy_trouser',[(x,0,1.02,.17,.17),(x+s*.025,.015,1.2,.25,.26),(x+s*.05,.015,1.52,.3,.31),(x,0,1.85,.27,.245),(x*.75,0,2.03,.225,.22)],M['clothing1'],body,n=12,smooth=False)
        between('calf',(x+s*.08,0,.43),(x+s*.015,0,1.18),.105,.13,M['skin'],body)
        ell('foot',(x+s*.09,-.12,.2),(.15,.265,.115),M['skin'],body)
        ell('sole',(x+s*.09,-.12,.105),(.17,.28,.065),M['edge'],body)
        for z in (.4,.53):
            loft('ankle_wrap',[(x+s*.08,0,z-.06,.119,.135),(x+s*.08,0,z+.04,.12,.135)],M['clothing3'],body)
        stroke('sandal_strap',[(x+s*.09-.135,-.15,.19),(x+s*.09,-.22,.3),(x+s*.09+.135,-.15,.19)],.048,M['clothing3'],body)
        # Separate toes, lightly modeled, under the forward sandal strap.
        for j in range(4):ell('toe',(x+s*.09-.085+j*.056,-.325,.18),(.034,.058,.047),M['skin'],body,seg=12)
        a=(s*.37*width,0,2.51); b=(s*.57,-.005,2.16); c=(s*.65,-.13,1.85)
        between('upper_arm',b,a,.115,.15,M['skin'],body);ell('elbow',b,(.119,.12,.13),M['skin'],body)
        between('forearm',c,b,.1,.115,M['skin'],body)
        ell('palm',(s*.66,-.15,1.75),(.12,.095,.15),M['skin'],body)
        for j in range(3):ell('finger',(s*.66+(j-1)*.054,-.205,1.7),(.033,.05,.075),M['skin'],body,seg=12)
        ell('thumb',(s*.57,-.21,1.79),(.055,.065,.07),M['skin'],body,seg=12)
        # Base vest: narrow fronts preserve bare abdomen in the canonical outfit.
        panel('vest_front',[(s*.13,-.205,2.64),(s*.34*width,-.155,2.57),(s*.29*width,-.198,2.29),(s*.14,-.22,2.31)],M['clothing3'],body)
        panel('vest_back',[(s*.04,.197,2.62),(s*.29,.17,2.55),(s*.25,.19,2.26),(s*.04,.20,2.28)],M['clothing3'],body)
    if female:
        panel('chest_garment',[(-.29,-.2,2.56),(-.10,-.231,2.47),(0,-.235,2.45),(.10,-.231,2.47),(.29,-.2,2.56),(.26,-.22,2.36),(-.26,-.22,2.36)],M['clothing3'],body)
    loft('base_waist_wrap',[(0,0,1.96,.41,.24),(0,0,2.085,.36,.22)],M['clothing2'],body)
    # Soft waist textile peeking out from under the leather belt.
    for s in (-1,1):
        panel('base_sash',[(s*.12,-.245,2.04),(s*.39,-.18,2.03),(s*.48,-.2,1.65),(s*.24,-.30,1.78)],M['clothing2'],body)
    faces=group('faces',root)
    for variant in ('soft','angular'):
        f=group('face_'+variant,faces);f['variant_family']='face';f['variant_id']=variant
        # Shape changes affect jaw and cheek geometry, not color or hair.
        rx=.405 if female else .43
        rings=[(0,-.055,2.78,.12,.13),(0,-.035,2.84,.24 if variant=='soft' else .19,.235),(0,0,3.02,rx*.88,.31),(0,0,3.23,rx,.345),(0,.025,3.47,rx*.94,.31),(0,.03,3.65,.28,.22),(0,.03,3.7,.06,.05)]
        loft('head_'+variant,rings,M['skin'],f,n=32)
        for s in (-1,1):
            ell('ear',(s*rx,0,3.12),(.105,.075,.14),M['skin'],f)
            ell('ear_inner',(s*(rx+.018),-.063,3.12),(.046,.018,.082),M['mouth'],f)
            ex=s*.185
            def eye_patch(name,cx,cz,rx,rz,offset,mat):
                vs=[]
                def pt(x,z):
                    return (x,-.345*math.sqrt(max(.06,1-(x/.447)**2))-offset+.03*(z-3.2)**2,z)
                vs.append(pt(cx,cz))
                for k in range(40):
                    a=k*math.tau/40; x=cx+rx*math.cos(a); z=cz+rz*math.sin(a)+s*.12*(x-cx)
                    vs.append(pt(x,z))
                mesh(name,vs,[(0,k+1,(k+1)%40+1) for k in range(40)],mat,f,True)
            eye_patch('eye_outline',ex,3.18,.117,.137,.014,M['edge'])
            eye_patch('eye_white',ex,3.177,.103,.12,.018,M['cream'])
            eye_patch('iris',ex+s*.01,3.173,.064,.103,.023,M['iris'])
            eye_patch('pupil',ex+s*.01,3.179,.029,.074,.028,M['pupil'])
            eye_patch('shine',ex-.021,3.218,.019,.028,.032,M['glint'])
            eye_patch('small_shine',ex+.026,3.135,.008,.012,.032,M['glint'])
            stroke('brow',[(ex-s*.10,-.321,3.38),(ex,-.346,3.4),(ex+s*.09,-.307,3.375)],.015,M['edge'],f)
        ell('nose',(0,-.331,3.06),(.038,.04,.037),M['skin'],f,seg=16)
        stroke('smile',[(-.105,-.286,2.99),(-.03,-.313,2.957),(.04,-.31,2.963),(.10,-.29,2.997)],.012,M['mouth'],f)
        stroke('smile_light',[(-.074,-.304,2.988),(0,-.321,2.972),(.065,-.311,2.99)],.008,M['cream'],f)
    hairs=group('hairs',root)
    for variant in ('spikes','swept'):
        h=group('hair_'+variant,hairs);h['variant_family']='hair';h['variant_id']=variant
        ell('hair_cap',(0,.075,3.52),(.455,.355,.36),M['hair'],h)
        ell('hair_nape',(0,.2,3.27),(.395,.24,.34),M['hair'],h)
        # Individually swept, asymmetric locks; no rotationally repeated crown.
        locks=[(-.35,3.55,-.62,3.63),(-.36,3.68,-.65,3.85),(-.25,3.8,-.53,4.07),(-.08,3.86,-.25,4.23),(.09,3.87,.08,4.3),(.26,3.8,.3,4.13),(.38,3.71,.54,4.0),(.4,3.58,.66,3.78),(.4,3.46,.61,3.52)]
        for i,(x,z,tx,tz) in enumerate(locks):
            if female:tz=3.6+(tz-3.6)*.35;tx*=.85
            if variant=='swept':tz-=.12;tx+=.12
            y=.07+(i%3)*.07
            blade_leaf('crown_lock',[(x*.7,y,3.6+(z-3.6)*.6),(x,y-.025,z),(tx*.92,y,tz-.09),(tx,y+.04,tz)],[.09,.16,.07,.001],.65,M['hair'],h)
        for s in (-1,1):
            blade_leaf('temple_lock',[(s*.35,-.10,3.58),(s*.43,-.21,3.34),(s*(.32 if female else .39),-.18,2.94)],[.14,.13,.002],.6,M['hair'],h)
            for j in range(3):
                blade_leaf('back_lock',[(s*.26,.23,3.58-j*.12),(s*.43,.3,3.43-j*.13),(s*.38,.25,3.1-j*.13)],[.15,.14,.002],.8,M['hair'],h)
        for i,(x,z) in enumerate([(-.32,3.31),(-.2,3.53),(.28,3.49)]):
            if variant=='swept':z-=.13; x+=.13
            blade_leaf('fringe',[(x+.16,-.16,3.81),(x+.07,-.29,3.66),(x-.02,-.35,3.58),(x-.13,-.375,z)],[.11,.16,.10,.001],.44,M['hair'],h)
        if female:
            ell('topknot',(0,.23,3.96),(.23,.22,.23),M['hair'],h)
            for i in range(5):
                a=i*1.3;blade_leaf('topknot_tip',[(0,.23,3.97),(.16*math.cos(a),.23+.12*math.sin(a),4.08),(.29*math.cos(a),.23+.24*math.sin(a),4.15)],[.11,.1,.002],.7,M['hair'],h)
    eq=group('equipment',root)
    leather=group('equip_leather',eq)
    for s in (-1,1):
        ell('pauldron',(s*.36,-.005,2.56),(.24,.245,.12),M['leather'],leather,rot=(0,s*.37,0))
        stroke('shoulder_trim',[(s*.18,-.19,2.6),(s*.37,-.22,2.63),(s*.55,-.13,2.51)],.025,M['gold'],leather)
        for j in range(3):ell('shoulder_rivet',(s*(.25+j*.1),-.223,2.61-j*.03),(.023,.013,.023),M['gold'],leather,seg=12)
        between('bracer',(s*.645,-.12,1.88),(s*.592,-.035,2.09),.14,.155,M['leather'],leather)
        for z in (1.9,2.08):
            between('bracer_binding',(s*.62,-.08,z-.025),(s*.62,-.08,z+.025),.157,.157,M['gold'],leather)
        loft('knee_leather',[(s*.27,0,.94,.18,.19),(s*.27,0,1.07,.19,.21)],M['leather'],leather)
        # Angular gold emblem follows the trouser surface.
        stroke('trouser_emblem',[(s*.28-.1,-.277,1.58),(s*.28,-.3,1.7),(s*.28+.1,-.277,1.58),(s*.28,-.3,1.46),(s*.28-.06,-.3,1.55)],.021,M['gold'],leather)
    loft('belt',[(0,0,1.985,.43,.26),(0,0,2.09,.405,.25)],M['leather'],leather)
    for x in (-.32,-.22,.22,.32):ell('belt_stud',(x,-.252,2.04),(.018,.017,.018),M['gold'],leather,seg=12)
    # Diamond buckle: actual raised metal frame.
    stroke('buckle',[(-.11,-.28,2.03),(0,-.29,2.15),(.11,-.28,2.03),(0,-.29,1.91),(-.11,-.28,2.03)],.026,M['gold'],leather)
    ell('buckle_gem',(0,-.29,2.03),(.05,.025,.07),M['pattern'],leather)
    stroke('belt_pendant',[(0,-.28,1.95),(.02,-.29,1.83),(0,-.31,1.72)],.013,M['gold'],leather)
    band=group('equip_bandana',eq)
    # Front band sits above the brows; continuous volume around the head.
    loft('headband',[(0,.025,3.43,.447,.35),(0,.025,3.57,.438,.345)],M['bandana'],band,n=40)
    for s in (-1,1):
        stroke('headband_motif',[(s*.26,-.28,3.47),(s*.15,-.32,3.53),(s*.06,-.333,3.47)],.013,M['pattern'],band)
    ell('bandana_knot',(-.36,.24,3.4),(.12,.1,.1),M['bandana'],band)
    for i in range(2):
        blade_leaf('bandana_tail',[(-.36,.24,3.4),(-.55-i*.08,.28,3.18),(-.62-i*.1,.24,2.96),(-.48-i*.22,.3,2.72-i*.18)],[.05,.12,.09,.002],.22,M['bandana'],band)
    sash=group('equip_sash',eq)
    for s in (-1,1):
        panel('long_hip_panel',[(s*.30,.13,2.04),(s*.43,.12,2),(s*.57,.13,1.48),(s*.51,.18,1.1),(s*.34,.16,1.36)],M['pattern'],sash)
    sword=group('equip_dagger',eq)
    # A short, independently colored blade at the left hip.
    between('dagger_grip',(-.42,.16,2.12),(-.55,.18,2.46),.045,.045,M['leather'],sword)
    between('dagger_guard',(-.57,.16,2.08),(-.29,.16,2.17),.035,.035,M['gold'],sword)
    blade_leaf('steel_blade',[(-.43,.16,2.12),(-.35,.17,1.9),(-.13,.18,1.35)],[.085,.075,.002],.35,M['steel'],sword)
    # All variant groups export; the application selects one per family.
    bpy.ops.object.select_all(action='DESELECT')
    for o in bpy.data.objects:
        if o.type in ('MESH','EMPTY'):o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=str(ROOT/'models'/f'ryuu-{base}.glb'),export_format='GLB',use_selection=True,export_extras=True,export_yup=True)
    # Keep only the canonical variants visible for offline review.
    for o in bpy.data.objects:
        if o.parent and o.parent.name in ('face_angular','hair_swept'):o.hide_render=True
    return root

def review_scene(base):
    scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=32
    scene.cycles.use_denoising=True;scene.render.resolution_x=900;scene.render.resolution_y=1000;scene.render.resolution_percentage=100
    scene.world.color=(.23,.23,.23);scene.view_settings.view_transform='Standard'
    floor=material('review_floor','EEE7D7');bpy.ops.mesh.primitive_plane_add(size=200);bpy.context.object.data.materials.append(floor)
    for name,loc,power,size in [('Key',(-4,-6,8),450,5),('Fill',(4,-3,5),200,5),('Rim',(2,4,6),400,4)]:
        d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape='DISK';d.size=size
        o=bpy.data.objects.new(name,d);bpy.context.collection.objects.link(o);o.location=loc;o.rotation_euler=(Vector((0,0,2))-o.location).to_track_quat('-Z','Y').to_euler()
    d=bpy.data.cameras.new('Review');cam=bpy.data.objects.new('Review',d);bpy.context.collection.objects.link(cam)
    cam.location=(5,-10,5);cam.rotation_euler=(Vector((0,0,2.1))-cam.location).to_track_quat('-Z','Y').to_euler();d.type='ORTHO';d.ortho_scale=4.9;scene.camera=cam
    scene.render.filepath=str(ROOT/'models'/f'ryuu-{base}-review.png')
    bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'models'/f'ryuu-{base}.blend'))
    bpy.ops.render.render(write_still=True)

for base in ('masculine','feminine'):
    build(base);review_scene(base)
manifest={'schema_version':1,'status':'proposal-awaiting-art-approval','generator':'production/build_ryuu.py','blender':bpy.app.version_string,'source':'../../../content/art/characters/reference-v2/references/ryuu.png','source_sha256':'8d7e17983eee6b29abea9e7f4a52b87eb32a8c74771442591ad846913a475c20','bases':['masculine','feminine'],'faces':['soft','angular'],'hair':['spikes','swept'],'colors':{k:'#'+v for k,v in PALETTE.items()},'equipment':['leather','bandana','sash','dagger'],'reconstruction':'All mesh surfaces are authored interpretations, including hidden regions. Not extracted original geometry. No rig or animation.','files':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in (ROOT/'models').glob('*') if p.suffix in ('.glb','.blend','.png')}}
(ROOT/'models'/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
