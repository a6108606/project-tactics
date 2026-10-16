"""Reference-driven Ryuu form study. Rebuilds owned meshes in calibrated master.
Authoring coordinates below are in 1/4.65 of the measured total height (1.85 m).
Front contours follow the original sheet; all depth/back surfaces are inferred.
No source illustration is used as character geometry or as a projected texture.
"""
import bpy, bmesh, math, json, hashlib, sys
from pathlib import Path
from mathutils import Vector, Matrix
ROOT=Path(__file__).resolve().parents[1]
S=1.85/4.65
TAG='phase:03_forms'
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'CH_Ryuu_master.blend'))
bpy.context.preferences.filepaths.save_version=0
for ob in list(bpy.data.objects):
    if ob.get('owner')==TAG: bpy.data.objects.remove(ob,do_unlink=True)
LOW=bpy.data.collections['LOW']
for c in ('REF','HIGH','COLLISION'):
    bpy.data.collections[c].hide_render=True
COUNT={}
def name(n):
    COUNT[n]=COUNT.get(n,0)+1
    return 'CH_Ryuu_'+n+('_%02d'%COUNT[n] if COUNT[n]>1 else '')
def group(n,parent=None):
    ob=bpy.data.objects.new(n,None);LOW.objects.link(ob);ob.parent=parent;ob['owner']=TAG;return ob
root=group('Ryuu_forms')
body=group('body',root)
head=group('head',root)
hairs=group('hair_spikes',head)
equipment=group('equipment',root)
leather=group('equip_leather',equipment)
band=group('equip_bandana',head)
sash=group('equip_sash',equipment)
def material(n,h,r=.7,metal=0):
    m=bpy.data.materials.get(n) or bpy.data.materials.new(n);m.use_nodes=True
    rgb=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    linear=[v/12.92 if v<.04045 else ((v+.055)/1.055)**2.4 for v in rgb]
    m.diffuse_color=(*linear,1)
    p=m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value=(*linear,1)
    p.inputs['Roughness'].default_value=r;p.inputs['Metallic'].default_value=metal
    return m
M={k:material('base_'+k,v,r) for k,v,r in [
 ('skin','F1BC85',.48),('hair','C7D5B4',.62),('clothing1','51315D',.87),
 ('clothing2','B0434E',.85),('clothing3','46394B',.73)]}
M.update({k:material('fixed_'+k,v,r,metal) for k,v,r,metal in [
 ('leather','694832',.52,0),('edge','3D2D29',.7,0),('stitch','987246',.68,0),
 ('gold','CB963F',.31,.65),('bandana','573568',.8,0),('pattern','AA3B52',.85,0),
 ('white','FFF4DC',.4,0),('iris','C58627',.36,0),('iris_edge','653F23',.5,0),
 ('pupil','251C24',.4,0),('glint','FFFFFF',.22,0),('mouth','793E36',.65,0),
 ('ear','C98764',.6,0)]})
def finish(o,n,mat,parent):
    o.name=name(n);o.parent=parent;o['owner']=TAG
    o.data.materials.clear();o.data.materials.append(mat)
    for p in o.data.polygons:p.use_smooth=True
    for c in list(o.users_collection):c.objects.unlink(o)
    LOW.objects.link(o)
    return o
def mesh(n,vs,fs,mat,parent):
    d=bpy.data.meshes.new(name(n+'_mesh'));d.from_pydata([tuple(Vector(v)*S) for v in vs],[],fs);d.update()
    bm=bmesh.new();bm.from_mesh(d);bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(d);bm.free()
    ob=bpy.data.objects.new(n,d);LOW.objects.link(ob)
    return finish(ob,n,mat,parent)
def ell(n,loc,scale,mat,parent,seg=32):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg,ring_count=20,location=Vector(loc)*S)
    o=bpy.context.object;o.scale=Vector(scale)*S
    bpy.ops.object.transform_apply(location=True,rotation=False,scale=True)
    return finish(o,n,mat,parent)
def curve(n,pts,r,mat,parent,sharp=False):
    c=bpy.data.curves.new(n,'CURVE');c.dimensions='3D';c.resolution_u=2 if len(pts)>12 else 8;c.bevel_depth=r*S;c.bevel_resolution=2;c.use_fill_caps=True
    sp=c.splines.new('BEZIER');sp.bezier_points.add(len(pts)-1)
    for b,p in zip(sp.bezier_points,pts):
        b.co=Vector(p)*S;b.handle_left_type=b.handle_right_type='VECTOR' if sharp else 'AUTO'
    ob=bpy.data.objects.new(n,c);LOW.objects.link(ob)
    bpy.ops.object.select_all(action='DESELECT');ob.select_set(True);bpy.context.view_layer.objects.active=ob;bpy.ops.object.convert(target='MESH')
    return finish(ob,n,mat,parent)
def cat(rows,t):
    i=min(int(t),len(rows)-2);u=t-i
    a=rows[max(i-1,0)];b=rows[i];c=rows[i+1];d=rows[min(i+2,len(rows)-1)]
    return [ .5*((2*q)+(-p+r)*u+(2*p-5*q+4*r-s)*u*u+(-p+3*q-3*r+s)*u*u*u) for p,q,r,s in zip(a,b,c,d)]
def loft(n,rows,mat,parent,fold=0,N=40,steps=5):
    vs=[];nr=(len(rows)-1)*steps+1
    for j in range(nr):
        x,y,z,rx,ry=cat(rows,j/steps)
        for i in range(N):
            a=math.tau*i/N
            f=1+fold*(.65*math.cos(5*a+z*2.2)+.35*math.cos(9*a-z*3))
            vs.append((x+rx*math.cos(a)*f,y+ry*math.sin(a)*f,z))
    fs=[tuple(reversed(range(N)))]
    for j in range(nr-1):
        for i in range(N):fs.append((j*N+i,j*N+(i+1)%N,(j+1)*N+(i+1)%N,(j+1)*N+i))
    fs.append(tuple((nr-1)*N+i for i in range(N)))
    return mesh(n,vs,fs,mat,parent)
def tube(n,pts,radii,mat,parent,depth=1,N=20,steps=6):
    rows=[[*p,r] for p,r in zip(pts,radii)];vs=[];nr=(len(rows)-1)*steps+1
    for j in range(nr):
        t=j/steps;p=cat(rows,t);before=Vector(cat(rows,max(0,t-.01))[:3]);after=Vector(cat(rows,min(len(rows)-1,t+.01))[:3])
        tangent=(after-before).normalized();u=tangent.cross(Vector((0,1,0))).normalized()
        if u.length<.01:u=Vector((1,0,0))
        v=tangent.cross(u).normalized()
        for i in range(N):
            a=math.tau*i/N
            vs.append(tuple(Vector(p[:3])+p[3]*(math.cos(a)*u+math.sin(a)*depth*v)))
    fs=[tuple(reversed(range(N)))]
    for j in range(nr-1):
        for i in range(N):fs.append((j*N+i,j*N+(i+1)%N,(j+1)*N+(i+1)%N,(j+1)*N+i))
    fs.append(tuple((nr-1)*N+i for i in range(N)))
    return mesh(n,vs,fs,mat,parent)
def panel(n,pts,mat,parent,thick=.018):
    ob=mesh(n,pts,[tuple(range(len(pts)))],mat,parent)
    sol=ob.modifiers.new('Woven thickness','SOLIDIFY');sol.thickness=thick*S
    bev=ob.modifiers.new('Soft bound edge','BEVEL');bev.width=.008*S;bev.segments=3
    return ob
def ribbon(n,centres,widths,mat,parent):
    # Curved cloth strip, separate visible front/back, tapered swallowtail.
    rows=[[*p,w] for p,w in zip(centres,widths)];vs=[];fs=[]
    steps=6;nr=(len(rows)-1)*steps+1
    for j in range(nr):
        x,y,z,w=cat(rows,j/steps)
        for k in range(5):
            q=k/4*2-1
            vs.append((x+w*q,y+.025*(1-q*q)*math.sin(j*.3),z+.025*q))
    for j in range(nr-1):
        for k in range(4):fs.append((j*5+k,j*5+k+1,(j+1)*5+k+1,(j+1)*5+k))
    ob=mesh(n,vs,fs,mat,parent);sol=ob.modifiers.new('Cloth thickness','SOLIDIFY');sol.thickness=.012*S
    return ob
# Body proportions from source/target front concept; depth inferred.
loft('Torso',[(.04,0,2.2,.28,.19),(.025,0,2.36,.26,.18),(-.025,0,2.58,.3,.195),(-.05,0,2.86,.37,.23),(-.04,0,3.03,.35,.21),(-.03,0,3.10,.22,.15)],M['skin'],body)
tube('Neck',[(-.03,.04,2.99),(0,.025,3.16),(0,.015,3.28)],[.15,.145,.15],M['skin'],body)
# Subtle collarbones, not disconnected chest spheres.
for side in (-1,1):
    curve('Clavicle',[(0,-.198,2.94),(side*.13,-.228,2.96),(side*.28,-.17,2.99)],.014,M['skin'],body)
# Original lowered arms, slightly asymmetric silhouette.
for side in (-1,1):
    shoulder=(side*.39-.04,0,2.98);elbow=(side*.59-.04,-.02,2.63);wrist=(side*.69-.02,-.15,2.27)
    tube('Arm',[shoulder,(side*.5-.04,0,2.83),elbow,(side*.63-.03,-.07,2.47),wrist],[.17,.155,.115,.14,.092],M['skin'],body)
    ell('Shoulder',shoulder,(.16,.17,.17),M['skin'],body)
    # Hand anatomy uses mirrored thumb side, curled fingers with visible tips.
    cx=side*.70-.02
    ell('Palm',(cx,-.17,2.17),(.11,.105,.145),M['skin'],body)
    ell('Glove',(cx,-.14,2.20),(.116,.09,.11),M['clothing3'],body)
    for f in range(4):
        x=cx+(f-1.5)*.05
        tube('Finger',[(x,-.205,2.2),(x,-.26,2.15),(x,-.25,2.09),(x,-.20,2.075)],[.032,.033,.03,.024],M['skin'],body,N=12,steps=3)
    tube('Thumb',[(cx-side*.085,-.17,2.23),(cx-side*.12,-.24,2.18),(cx-side*.075,-.275,2.14)],[.047,.045,.035],M['skin'],body,N=16,steps=4)
# Lower body retained beneath garments.
ell('Pelvis',(.035,0,2.12),(.37,.22,.28),M['skin'],body)
def pant_front(rows,x,z):
    for i in range(len(rows)-1):
        if rows[i][2]<=z<=rows[i+1][2]:
            cx,cy,_,rx,ry=cat(rows,i+(z-rows[i][2])/(rows[i+1][2]-rows[i][2]));break
    else:cx,cy,_,rx,ry=rows[0]
    a=-math.acos(max(-.99,min(.99,(x-cx)/rx)))
    f=1+.105*(.65*math.cos(5*a+z*2.2)+.35*math.cos(9*a-z*3))
    return cy+ry*math.sin(a)*f
PANTS={}
for side in (-1,1):
    x=side*.30+.025
    footx=side*.39+.025
    tube('Leg',[(x,0,2.12),(x+side*.07,0,1.42),(footx,.015,.65),(footx,-.035,.28)],[.20,.15,.115,.09],M['skin'],body)
    rows=[(footx,0,1.03,.15,.17),(x+side*.065,0,1.13,.24,.25),(x+side*.08,.015,1.36,.33,.33),(x+side*.04,0,1.69,.365,.34),(x,0,2.0,.30,.26),(x*.65,0,2.23,.245,.22)]
    PANTS[side]=rows
    loft('Trouser',rows,M['clothing1'],body,fold=.105,N=40,steps=5)
    # Ankle wrap overlaps skin smoothly.
    loft('Ankle_links',[(footx,-.005,.30,.105,.12),(footx,-.005,.36,.12,.132),(footx,0,.46,.13,.13),(footx,0,.52,.12,.12)],M['clothing3'],body,fold=.055,N=24,steps=3)
    ell('Foot',(footx,-.15,.17),(.145,.27,.108),M['skin'],body)
    ell('Sandal_sole',(footx,-.17,.073),(.167,.30,.06),M['edge'],body)
    for f in range(5):
        xx=footx+(f-2)*.05
        ell('Toe',(xx,-.365+abs(f-1)*.013,.135),(.031,.063,.045 if f else .05),M['skin'],body,seg=16)
    for y in (-.22,-.08):
        curve('Sandal_strap',[(footx-.145,y,.16),(footx-.09,y-.015,.245),(footx+.065,y-.015,.256),(footx+.14,y,.17)],.036,M['clothing3'],body)
    # Tapered knee leather band following pants.
    loft('Knee_cuff',[(footx,0,1.04,.175,.193),(footx,0,1.09,.197,.214),(footx,0,1.16,.23,.244)],M['leather'],leather,N=32,steps=3)
    for z,rx,ry in [(1.05,.18,.2),(1.15,.227,.244)]:
        pts=[(footx+rx*math.cos(a),ry*math.sin(a),z) for a in [math.tau*i/32 for i in range(33)]]
        curve('Cuff_binding',pts,.012,M['edge'],leather)
    # Large flat angular insignia (a sewn metallic-colour motif, not a tubular spiral).
    xx=x;zz=1.58;yy=-.345
    glyph=[(-.13,-.04),(-.13,.12),(.025,.20),(.12,.1),(.04,.04),(.015,.09),(-.055,.06),(-.055,-.015),(.09,-.08),(.16,-.01),(.19,-.065),(.1,-.16)]
    panel('Trouser_insignia',[(xx+u,pant_front(rows,xx+u,zz+v)-.04,zz+v) for u,v in glyph],M['gold'],leather,thick=.003)
# Vest: shaped shoulder/side surfaces leave chest and abdomen open.
for side in (-1,1):
    panel('Vest_front',[(side*.10-.03,-.19,3.10),(side*.30-.04,-.22,3.04),(side*.35-.04,-.21,2.83),(side*.29-.03,-.24,2.69),(side*.10-.03,-.27,2.72),(side*.14-.03,-.27,2.88)],M['clothing3'],body,.03)
    panel('Vest_side',[(side*.30-.04,-.19,3.04),(side*.38-.04,.02,2.95),(side*.3-.03,.20,2.75),(side*.29-.03,-.21,2.69)],M['clothing3'],body,.03)
    curve('Vest_seam',[(side*.13-.03,-.18,3.10),(side*.20-.03,-.25,2.88),(side*.16-.03,-.235,2.72),(side*.29-.03,-.225,2.69)],.012,M['edge'],body)
for side in (-1,1):
    panel('Raised_collar',[(side*.13,-.08,3.22),(side*.22,.035,3.20),(side*.30,.08,3.0),(side*.13,-.15,3.06)],M['clothing3'],body,.025)
panel('Vest_back',[(-.32,.2,3.02),(.27,.2,3.02),(.27,.22,2.73),(-.28,.22,2.73)],M['clothing3'],body,.025)
loft('Waist_textile',[(.03,0,2.18,.39,.25),(.025,0,2.30,.34,.23)],M['clothing2'],body,fold=.03)
# Diagonal curved leather belts around waist; proper full circumference.
def belt(n,z,tilt,width,rx,ry):
    vs=[];N=64
    for j in range(2):
        for i in range(N):
            a=math.tau*i/N
            vs.append((.03+rx*math.cos(a),ry*math.sin(a),z+tilt*math.cos(a)+(j-.5)*width))
    fs=[(i,(i+1)%N,(i+1)%N+N,i+N) for i in range(N)]
    ob=mesh(n,vs,fs,M['leather'],leather)
    sol=ob.modifiers.new('Belt leather thickness','SOLIDIFY');sol.thickness=.025*S
    for sign in (-1,1):
        curve('Belt_edge',[(.03+rx*math.cos(a),ry*math.sin(a)-.002,z+tilt*math.cos(a)+sign*width*.44) for a in [math.tau*i/64 for i in range(65)]],.008,M['stitch'],leather)
belt('Belt_upper',2.29,.08,.13,.39,.259)
belt('Belt_cross',2.19,-.12,.13,.425,.274)
def diamond(n,cx,cy,cz,r):
    curve(n,[(cx-r,cy,cz),(cx,cy-.012,cz+r),(cx+r,cy,cz),(cx,cy-.012,cz-r),(cx-r,cy,cz)],.023,M['gold'],leather,True)
diamond('Buckle',.1,-.3,2.29,.13)
panel('Buckle_inset',[(.03,-.305,2.29),(.1,-.307,2.37),(.17,-.305,2.29),(.1,-.307,2.21)],M['pattern'],leather)
for x in (-.31,-.19,.25,.36):
    ell('Belt_rivet',(x,-.22 if abs(x)>.28 else -.266,2.29+x*.18),(.016,.012,.016),M['gold'],leather,seg=12)
curve('Pendant_chain',[(.06,-.306,2.18),(.01,-.33,2.06),(.04,-.347,1.95)],.012,M['gold'],leather)
diamond('Pendant',.04,-.35,1.90,.06)
# Shoulder caps are partial shells, not solid ellipsoid blobs.
for side in (-1,1):
    cx=side*.37-.04;vs=[];fs=[];N=32;J=10
    for j in range(J):
        phi=.06+j/(J-1)*2.05
        for i in range(N):
            a=math.tau*i/N
            vs.append((cx+.23*math.sin(phi)*math.cos(a),.245*math.sin(phi)*math.sin(a),2.99+.21*math.cos(phi)-side*.12*(.23*math.sin(phi)*math.cos(a))))
    for j in range(J-1):
        for i in range(N):fs.append((j*N+i,j*N+(i+1)%N,(j+1)*N+(i+1)%N,(j+1)*N+i))
    ob=mesh('Pauldron',vs,fs,M['leather'],leather);sol=ob.modifiers.new('Leather plate','SOLIDIFY');sol.thickness=.026*S
    curve('Pauldron_edge',vs[(J-1)*N:]+[vs[(J-1)*N]],.015,M['edge'],leather)
    curve('Pauldron_seam',[(cx-.16,-.165,3.10),(cx,-.23,3.13),(cx+.16,-.165,3.10)],.012,M['stitch'],leather)
    # Two bracer shells follow the forearm centreline.
    a=(side*.68-.02,-.14,2.28);b=(side*.61-.03,-.04,2.56)
    tube('Bracer',[a,b],[.15,.172],M['leather'],leather,depth=.88,N=32,steps=3)
    for p,r in [(a,.155),(b,.177)]:
        tube('Bracer_edge',[(p[0],p[1],p[2]-.018),(p[0],p[1],p[2]+.018)],[r,r],M['edge'],leather,N=24,steps=2)
    diamond('Bracer_metal',side*.65-.025,-.215,2.40,.057)
    tube('Upper_arm_band',[(side*.52-.04,-.005,2.78),(side*.54-.04,-.005,2.72)],[.145,.137],M['clothing3'],body,N=24,steps=3)
# Cloth tails hang behind, readable from front and actual volumes in profile.
ribbon('Hip_sash',[(.32,-.08,2.28),(.49,-.13,2.06),(.64,-.10,1.77),(.74,-.07,1.42),(.65,-.01,1.18)],[.08,.14,.17,.13,.005],M['pattern'],sash)
ribbon('Hip_inner',[(.28,.19,2.27),(.46,.25,1.98),(.64,.22,1.61),(.64,.20,1.12)],[.06,.15,.13,.003],M['pattern'],sash)
# Head fitted through smooth cross sections: flatter face, tapering jaw, round cranium.
HEADROWS=[(0,-.025,3.10,.025,.045),(0,-.005,3.16,.16,.17),(0,.015,3.28,.285,.26),(0,.018,3.47,.405,.31),(0,.025,3.68,.43,.325),(0,.035,3.84,.395,.31),(0,.035,3.98,.26,.24),(0,.035,4.045,.025,.025)]
def headprofile(z):
    for i in range(len(HEADROWS)-1):
        if HEADROWS[i][2]<=z<=HEADROWS[i+1][2]:
            # smooth section interpolation by z with local monotone linear lookup at dense resolution
            return cat(HEADROWS,i+(z-HEADROWS[i][2])/(HEADROWS[i+1][2]-HEADROWS[i][2]))
    return HEADROWS[0 if z<3.1 else -1]
def facey(x,z):
    _,cy,_,rx,ry=headprofile(z)
    return cy-ry*max(.01,1-(x/max(rx,.025))**2)**.30
vs=[];fs=[];N=64;J=56
for j in range(J):
    z=3.10+j/(J-1)*.945;_,cy,_,rx,ry=headprofile(z)
    for i in range(N):
        a=math.tau*i/N;x=rx*math.cos(a)
        yy=cy+ry*math.copysign(abs(math.sin(a))**.6,math.sin(a))
        vs.append((x,yy,z))
for j in range(J-1):
    for i in range(N):fs.append((j*N+i,j*N+(i+1)%N,(j+1)*N+(i+1)%N,(j+1)*N+i))
fs.extend([tuple(reversed(range(N))),tuple((J-1)*N+i for i in range(N))])
mesh('Face',vs,fs,M['skin'],head)
for side in (-1,1):
    ell('Ear',(side*.405,.015,3.45),(.095,.065,.135),M['skin'],head)
    ell('Ear_concha',(side*.435,-.04,3.455),(.044,.015,.079),M['ear'],head,seg=24)
# Surface patches are fitted to the actual face, never protruding eyeball spheres.
def patch(n,outline,mat,offset=.006):
    cx=sum(x for x,z in outline)/len(outline);cz=sum(z for x,z in outline)/len(outline)
    vs=[(cx,facey(cx,cz)-offset,cz)]+[(x,facey(x,z)-offset,z) for x,z in outline]
    return mesh(n,vs,[(0,i+1,(i+1)%len(outline)+1) for i in range(len(outline))],mat,head)
def ellipse(n,cx,cz,rx,rz,mat,offset):
    return patch(n,[(cx+rx*math.cos(i*math.tau/40),cz+rz*math.sin(i*math.tau/40)) for i in range(40)],mat,offset)
for side in (-1,1):
    cx=side*.187;cz=3.49
    outline=[]
    for i in range(48):
        a=i*math.tau/48;u=math.cos(a);v=math.sin(a)
        outline.append((cx+.135*u,cz+(.117 if v>0 else .084)*v*(.8+.2*abs(v))+side*.15*.135*u))
    patch('Eye_white',outline,M['white'],.008)
    ellipse('Iris_rim',cx+side*.012,cz,.083,.097,M['iris_edge'],.011)
    ellipse('Iris',cx+side*.012,cz-.005,.074,.088,M['iris'],.014)
    ellipse('Pupil',cx+side*.012,cz+.006,.034,.069,M['pupil'],.017)
    ellipse('Catchlight',cx-.015,cz+.043,.015,.020,M['glint'],.021)
    ellipse('Catchlight_small',cx+.035,cz-.035,.006,.009,M['glint'],.021)
    upper=outline[:25]
    curve('Upper_eyelid',[(x,facey(x,z)-.012,z) for x,z in upper[::3]],.009,M['pupil'],head)
    lower=outline[24:]+[outline[0]]
    curve('Lower_eyelid',[(x,facey(x,z)-.01,z) for x,z in lower[::4]],.005,M['mouth'],head)
    brow=[(cx-side*.10,3.65),(cx,3.68),(cx+side*.11,3.665)]
    curve('Eyebrow',[(x,facey(x,z)-.016,z) for x,z in brow],.010,M['edge'],head)
# Small wedge nose blends into face, narrow smile with fitted teeth.
tube('Nose',[(0,facey(0,3.46)+.012,3.46),(0,facey(0,3.35)-.014,3.35),(0,facey(0,3.33)-.021,3.33)],[.015,.025,.016],M['skin'],head,depth=.6,N=16,steps=4)
mouth=[(-.13,3.267),(-.07,3.25),(.015,3.25),(.13,3.28),(.10,3.23),(.025,3.205),(-.065,3.218)]
patch('Smile_open',mouth,M['mouth'],.009)
patch('Smile_teeth',[(-.115,3.263),(-.05,3.25),(.035,3.255),(.117,3.274),(.084,3.245),(.015,3.232),(-.06,3.239)],M['white'],.013)
curve('Lower_lip',[(-.08,facey(-.08,3.215)-.009,3.215),(0,facey(0,3.201)-.012,3.201),(.07,facey(.07,3.221)-.009,3.221)],.006,M['ear'],head)
# Curved tapered hair masses, controlled asymmetry in silhouette.
ell('Hair_cap',(0,.06,3.91),(.435,.34,.27),M['hair'],hairs)
ell('Hair_nape',(0,.19,3.63),(.40,.23,.30),M['hair'],hairs)
locks=[
 [(-.17,.05,3.96),(-.40,.035,4.07),(-.66,.04,4.08),(-.79,.10,4.16),.17],
 [(-.15,.03,4.02),(-.38,.04,4.20),(-.59,.06,4.30),(-.67,.12,4.44),.18],
 [(-.04,.055,4.05),(-.22,.06,4.28),(-.39,.10,4.46),(-.44,.13,4.59),.18],
 [(.04,.10,4.02),(.03,.10,4.30),(-.11,.12,4.52),(-.14,.15,4.65),.17],
 [(.18,.12,4.00),(.27,.10,4.22),(.22,.13,4.44),(.18,.18,4.55),.16],
 [(.30,.12,3.97),(.45,.10,4.12),(.52,.13,4.29),(.48,.19,4.40),.16],
 [(.34,.08,3.86),(.55,.06,3.94),(.66,.12,4.07),(.67,.19,4.18),.15],
 [(-.27,.03,3.91),(-.49,.02,3.92),(-.63,.07,3.90),(-.72,.15,3.92),.14],
 [(.35,.10,3.76),(.47,.07,3.78),(.58,.12,3.84),(.66,.17,3.93),.12],
 # Front bangs sweep diagonally, leave the forehead band and both eyes legible.
 [(.20,-.10,4.11),(-.02,-.22,4.07),(-.30,-.32,3.89),(-.43,-.32,3.63),.17],
 [(.06,-.12,4.14),(-.20,-.23,4.10),(-.44,-.26,3.99),(-.58,-.23,3.89),.14],
 [(.31,-.10,4.04),(.23,-.25,3.96),(.19,-.34,3.85),(.12,-.36,3.76),.115],
 [(-.35,-.08,3.92),(-.43,-.19,3.73),(-.40,-.20,3.48),(-.32,-.15,3.29),.12],
 [(.35,-.09,3.92),(.44,-.18,3.75),(.42,-.18,3.54),(.35,-.10,3.32),.105],
]
for i,entry in enumerate(locks):
    p=entry[:4];w=entry[4]
    tube('Hair_lock',p,[w*.6,w,w*.35,.0008],M['hair'],hairs,depth=.28,N=16,steps=8)
# Back clumps inferred, overlap nape and leave neck clear.
for side in (-1,1):
    for j in range(3):
        tube('Nape_lock',[(side*.22,.23,3.89-j*.10),(side*.37,.32,3.78-j*.10),(side*.40,.33,3.64-j*.12),(side*.31,.27,3.48-j*.13)],[.10,.14,.10,.002],M['hair'],hairs,depth=.5,N=12,steps=5)
# Band wraps fitted forehead; all its colors fixed independent of hair recoloring.
loft('Headband',[(0,.026,3.73,.437,.335),(0,.027,3.80,.423,.335),(0,.027,3.89,.376,.307)],M['bandana'],band,N=64,steps=4)
for side in (-1,1):
    curve('Band_motif',[(side*.31,-.238,3.77),(side*.20,-.285,3.85),(side*.08,-.308,3.78)],.018,M['pattern'],band,True)
ell('Band_knot',(-.38,.23,3.71),(.11,.08,.09),M['bandana'],band)
ribbon('Band_tail_long',[(-.38,.23,3.71),(-.60,.27,3.51),(-.73,.29,3.20),(-.88,.31,2.91),(-.83,.34,2.68)],[.05,.14,.13,.12,.002],M['bandana'],band)
ribbon('Band_tail_short',[(-.38,.25,3.71),(-.57,.34,3.55),(-.76,.36,3.41),(-.94,.39,3.23)],[.04,.12,.14,.001],M['bandana'],band)
# Small head tilt around neck, including ears, hair, eyes and band.
pivot=Vector((0,0,3.17))*S
rot=Matrix.Rotation(math.radians(-6),4,'Y')
for ob in list(LOW.objects):
    parent=ob.parent;belongs=False
    while parent:
        if parent==head:belongs=True;break
        parent=parent.parent
    if belongs and ob.type=='MESH':
        for v in ob.data.vertices:v.co=pivot+rot@(v.co-pivot)
# Broader stance and airy trouser silhouette measured against the original crop.
for ob in list(LOW.objects):
    if ob.type!='MESH':continue
    for v in ob.data.vertices:
        z=v.co.z/S
        weight=max(0,min(1,(2.65-z)/1.2))
        v.co.x *= 1+.27*weight
        if z<2.4:
            v.co.z += .10*S*max(0,1-abs(z-2.25)/.85)
# All reference/control elements stay out of export.
root['status']='forms-study-awaiting-review'
root['inferred']='All depth, back, soles, covered surfaces. Static unrigged form study.'
for ob in list(LOW.objects):
    if ob.type=='MESH':
        # Normalize normals for double-sided thin cloth and consistent glTF shading.
        ob.data.update()
# Neutral portable studio. PBR in browser uses the exported material roles.
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=32;scene.cycles.use_denoising=True
scene.render.resolution_x=800;scene.render.resolution_y=1000;scene.render.resolution_percentage=100
scene.render.film_transparent=True
scene.view_settings.view_transform='AgX'
if not scene.world:scene.world=bpy.data.worlds.new('Forms world')
scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.65,.68,.75,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.5
for n,loc,power,size in [('Key',(-3,-4,6),430,4),('Fill',(3,-2,3),140,3),('Rim',(1,3,5),300,3)]:
    d=bpy.data.lights.new(n,'AREA');d.energy=power;d.shape='DISK';d.size=size
    ob=bpy.data.objects.new(n,d);scene.collection.objects.link(ob);ob['owner']=TAG;ob.location=loc;ob.rotation_euler=(Vector((0,0,.95))-ob.location).to_track_quat('-Z','Y').to_euler()
d=bpy.data.cameras.new('FormsCamera');cam=bpy.data.objects.new('FormsCamera',d);scene.collection.objects.link(cam);cam['owner']=TAG
d.type='ORTHO';d.ortho_scale=2.13;scene.camera=cam
def setcam(az,el=8):
    a=math.radians(az);e=math.radians(el)
    cam.location=(6*math.sin(a)*math.cos(e),-6*math.cos(a)*math.cos(e),.96+6*math.sin(e))
    cam.rotation_euler=(Vector((0,0,.96))-cam.location).to_track_quat('-Z','Y').to_euler()
setcam(-25)
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'CH_Ryuu_master.blend'))
bpy.ops.object.select_all(action='DESELECT')
for ob in LOW.objects:ob.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(ROOT/'exports'/'ryuu-forms.glb'),export_format='GLB',use_selection=True,export_apply=True,export_extras=True)
stats={'status':'forms-study-awaiting-review','units':'meters','height_target':1.85,'rigged':False,'textures':False,'source':'ref/original-sheet.png','target':'ref/target.png','files':{}}
for p in [ROOT/'exports'/'ryuu-forms.glb',ROOT/'CH_Ryuu_master.blend']:
    stats['files'][p.name]=hashlib.sha256(p.read_bytes()).hexdigest()
stats['mesh_objects']=sum(ob.type=='MESH' for ob in LOW.objects)
stats['triangles_base']=sum(len(p.vertices)-2 for ob in LOW.objects if ob.type=='MESH' for p in ob.data.polygons)
(ROOT/'exports'/'manifest.json').write_text(json.dumps(stats,indent=2)+'\n')
# Default one review; --all additionally makes front/profile/back evidence.
views=[('threequarter',-25)]
if '--all' in sys.argv:views += [('front',0),('side',90),('back',180)]
for view,az in views:
    setcam(az);scene.render.filepath=str(ROOT/'review'/('material_'+view+'.png'));bpy.ops.render.render(write_still=True)
print('FORM STUDY',json.dumps(stats))
