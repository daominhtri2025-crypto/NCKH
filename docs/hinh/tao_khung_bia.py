from PIL import Image, ImageDraw
import math
DPI=300; mm=DPI/25.4; S=2
W,H=round(210*mm),round(297*mm)
NAVY=(20,45,92,255); NAVY2=(42,72,128,255)
GOLD=(176,132,32,255); GOLDL=(224,186,92,255); WHITE=(255,255,255,255)
m=lambda v:v*mm*S
img=Image.new('RGBA',(W*S,H*S),(0,0,0,0)); d=ImageDraw.Draw(img)
def rect(inset,w,col):
    d.rectangle([m(inset),m(inset),W*S-m(inset),H*S-m(inset)],outline=col,width=max(1,round(m(w))))
# --- khung viền kép dày–mỏng
rect(7.0,1.8,NAVY); rect(9.7,0.5,GOLD); rect(11.0,0.3,NAVY2)
rect(18.2,0.3,NAVY2); rect(19.5,0.5,GOLD); rect(20.8,1.4,NAVY)
# --- dải hạt và hình thoi giữa hai nhóm đường (cạnh)
def diamond(cx,cy,r,col):
    d.polygon([(cx,cy-r),(cx+r,cy),(cx,cy+r),(cx-r,cy)],fill=col)
def dot(cx,cy,r,col): d.ellipse([cx-r,cy-r,cx+r,cy+r],fill=col)
bandc=14.6
step=4.2
x=30.0
while x<210-30:
    for (px,py) in ((x,bandc),(x,297-bandc)):
        diamond(m(px),m(py),m(1.35),NAVY); dot(m(px),m(py),m(0.5),GOLDL)
    x+=step
    for (px,py) in ((x-step/2,bandc),(x-step/2,297-bandc)): dot(m(px),m(py),m(0.45),GOLD)
y=30.0
while y<297-30:
    for (px,py) in ((bandc,y),(210-bandc,y)):
        diamond(m(px),m(py),m(1.35),NAVY); dot(m(px),m(py),m(0.5),GOLDL)
    y+=step
    for (px,py) in ((bandc,y-step/2),(210-bandc,y-step/2)): dot(m(px),m(py),m(0.45),GOLD)
# --- hoa văn góc: vẽ cho góc trên-trái rồi lật sang ba góc còn lại
T=int(m(80))
tile=Image.new('RGBA',(T,T),(0,0,0,0)); t=ImageDraw.Draw(tile)
def tdot(cx,cy,r,col): t.ellipse([cx-r,cy-r,cx+r,cy+r],fill=col)
def tdia(cx,cy,r,col): t.polygon([(cx,cy-r),(cx+r,cy),(cx,cy+r),(cx-r,cy)],fill=col)
# nền trắng che khung ở vùng góc, rồi vẽ ô góc
t.rectangle([m(7.0),m(7.0),m(30),m(30)],fill=WHITE)
t.rectangle([m(7.0),m(7.0),m(30),m(30)],outline=NAVY,width=round(m(1.8)))
t.rectangle([m(9.7),m(9.7),m(27.3),m(27.3)],outline=GOLD,width=round(m(0.5)))
t.rectangle([m(11.0),m(11.0),m(26.0),m(26.0)],outline=NAVY2,width=round(m(0.3)))
rc=m(18.5)
tdot(rc,rc,m(6.2),NAVY); tdot(rc,rc,m(5.6),WHITE)
for k in range(12):
    a_=k*math.pi/6
    px=rc+m(3.9)*math.cos(a_); py=rc+m(3.9)*math.sin(a_)
    pts=[]
    for i in range(24):
        u=2*math.pi*i/24
        ex=m(1.9)*math.cos(u); ey=m(0.7)*math.sin(u)
        pts.append((px+ex*math.cos(a_)-ey*math.sin(a_),py+ex*math.sin(a_)+ey*math.cos(a_)))
    t.polygon(pts,fill=GOLD if k%2==0 else NAVY)
tdot(rc,rc,m(2.1),NAVY); tdot(rc,rc,m(1.35),GOLDL); tdot(rc,rc,m(0.6),NAVY)
# bốn góc nhỏ trang trí trên ô góc
for (px,py) in [(8.4,8.4),(28.6,8.4),(8.4,28.6),(28.6,28.6)]:
    tdia(m(px),m(py),m(0.0),GOLD)
# quạt cung tại góc trong của ô, hướng vào giữa trang
ox,oy=m(30),m(30)
def arc(r,w,col):
    t.arc([ox-m(r),oy-m(r),ox+m(r),oy+m(r)],0,90,fill=col,width=max(1,round(m(w))))
for r,w,col in [(5,0.9,NAVY),(7.2,0.4,GOLD),(9.4,0.4,NAVY2),(11.6,0.4,GOLD)]:
    arc(r,w,col)
for k in range(1,9):
    a_=math.radians(k*10)
    t.line([(ox+m(5)*math.cos(a_),oy+m(5)*math.sin(a_)),(ox+m(11.6)*math.cos(a_),oy+m(11.6)*math.sin(a_))],fill=GOLD,width=max(1,round(m(0.25))))
for k in range(9):
    a_=math.radians(k*10+5)
    tdot(ox+m(8.3)*math.cos(a_),oy+m(8.3)*math.sin(a_),m(0.5),NAVY)
# cành lá dọc hai cạnh trong, bắt đầu sau quạt
def leaf(cx0,cy0,L,Wd,ang,col):
    pts=[]
    for i in range(0,21):
        u=i/20; pts.append((-L/2+L*u, Wd*math.sin(math.pi*u)/2))
    for i in range(20,-1,-1):
        u=i/20; pts.append((-L/2+L*u,-Wd*math.sin(math.pi*u)/2))
    t.polygon([(cx0+px*math.cos(ang)-py*math.sin(ang),cy0+px*math.sin(ang)+py*math.cos(ang)) for px,py in pts],fill=col)
off=25.2
t.line([(m(44),m(off)),(m(74),m(off))],fill=GOLD,width=round(m(0.35)))
t.line([(m(off),m(44)),(m(off),m(74))],fill=GOLD,width=round(m(0.35)))
for k in range(6):
    p=44+k*5.0+2.5
    col=NAVY if k%2==0 else GOLD
    leaf(m(p),m(off)-m(1.7),m(4.4),m(1.5),math.radians(-30),col)
    leaf(m(p),m(off)+m(1.7),m(4.4),m(1.5),math.radians(30),col)
    leaf(m(off)-m(1.7),m(p),m(4.4),m(1.5),math.radians(120),col)
    leaf(m(off)+m(1.7),m(p),m(4.4),m(1.5),math.radians(60),col)
tdot(m(44),m(off),m(0.8),NAVY); tdot(m(off),m(44),m(0.8),NAVY)
tdia(m(76),m(off),m(0.9),GOLDL); tdia(m(off),m(76),m(0.9),GOLDL)
# lắp bốn góc
img.alpha_composite(tile,(0,0))
tr=tile.transpose(Image.FLIP_LEFT_RIGHT); img.alpha_composite(tr,(W*S-T,0))
bl=tile.transpose(Image.FLIP_TOP_BOTTOM); img.alpha_composite(bl,(0,H*S-T))
br=tile.transpose(Image.ROTATE_180); img.alpha_composite(br,(W*S-T,H*S-T))
# hình thoi giữa các cạnh
for cx0,cy0 in [(W*S/2,m(7.9)),(W*S/2,H*S-m(7.9)),(m(7.9),H*S/2),(W*S-m(7.9),H*S/2)]:
    d2=ImageDraw.Draw(img)
    d2.polygon([(cx0,cy0-m(3)),(cx0+m(3),cy0),(cx0,cy0+m(3)),(cx0-m(3),cy0)],fill=NAVY)
    d2.polygon([(cx0,cy0-m(1.8)),(cx0+m(1.8),cy0),(cx0,cy0+m(1.8)),(cx0-m(1.8),cy0)],fill=GOLDL)
img=img.resize((W,H),Image.LANCZOS)
img.save('/home/user/NCKH/docs/hinh/khung_bia.png',dpi=(DPI,DPI),optimize=True)
bg=Image.new('RGB',img.size,'white'); bg.paste(img,mask=img.split()[3])
bg.resize((W//4,H//4)).save('/tmp/claude-0/fr/prev.png')
bg.crop((0,0,round(75*mm),round(75*mm))).save('/tmp/claude-0/fr/corner.png')
