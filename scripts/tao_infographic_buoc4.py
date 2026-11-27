from PIL import Image, ImageDraw, ImageFont
W,H=3200,1800
NAVY=(20,45,92); ORG=(224,123,0); CARD=(238,242,248); BG=(250,250,248); GREY=(90,100,115); WHITE=(255,255,255); INK=(30,38,52); LINE=(190,200,215)
FB='/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'; FR='/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'
F=lambda p,s: ImageFont.truetype(p,s)
VI=dict(
 title='BƯỚC 4: XỬ LÝ SỐ LIỆU & THỐNG KÊ',
 sub='Từ dữ liệu thô đến phân tích thống kê, vẫn giữ ẩn danh',
 A=dict(h='A. KHẢO SÁT (Phiếu A, B, C)',tag='ĐÃ THỰC HIỆN',steps=[
  'Xuất tệp CSV từ biểu mẫu khảo sát',
  'Giữ các phiếu đã chọn "đồng ý": n = 100 mỗi phiếu',
  'Câu để trống: bỏ qua riêng câu đó, không điền thay',
  'Thang 1–5: tính trung bình và SD. Câu chọn: tính số người và %',
  'Lựa chọn của phiên bản trước: giữ nguyên, đánh dấu †'],
  chips=[('4,61','SD 0,58 · mức cần thiết'),('3,06','SD 1,19 · mức tự tin'),('52%','có người quen bị lừa')]),
 B=dict(h='B. DỮ LIỆU ĐO TRÊN HỆ THỐNG',tag='THEO KẾ HOẠCH',steps=[
  'Xuất CSV ẩn danh: dạng dài (mỗi dòng một câu trả lời) và dạng rộng (mỗi dòng một học sinh)',
  'Ghép cặp ẩn danh: cùng một mã nghiên cứu R... thì cùng một học sinh ở cả ba mốc',
  'Tính điểm: kiến thức 0–10; hành vi 1–4 (hai câu đảo chiều: 5 − mức)'],
  th=['Mã nghiên cứu','Trước','Sau','28 ngày'],row=['R...','kiến thức + hành vi','kiến thức + hành vi','kiến thức + hành vi'],
  note='Tệp xuất không có họ tên, email, số điện thoại, mã thẻ đăng nhập'),
 C=dict(h='C. KIỂM ĐỊNH PHI THAM SỐ',tag='THEO KẾ HOẠCH',rows=[
  ('Q1','Kiến thức: trước so với sau','Wilcoxon','H1'),
  ('Q2','Còn duy trì sau 28 ngày?','Wilcoxon (trước – theo dõi) · Friedman (3 mốc)','H2'),
  ('Q3','Hành vi: trước so với sau','Wilcoxon','H3'),
  ('Q4','Dùng gợi ý và độ chính xác','Mann-Whitney hoặc Spearman (chỉ là tương quan)','H4')],
  why='Vì sao phi tham số?',whys=['Điểm kiến thức chỉ có 11 giá trị (0–10)','Điểm hành vi là thang thứ bậc (1–4)','Mẫu lớp học nhỏ, không cần dữ liệu dạng chuẩn'],
  how='Chỉ dùng thứ hạng của dữ liệu'),
 foot='Mức ý nghĩa α = 0,05  ·  Kích thước hiệu ứng r = Z/√N  ·  Chỉ dùng các cặp dữ liệu đầy đủ  ·  Không điền thay giá trị thiếu',
 note='Đã thực hiện = tính trên số liệu khảo sát hiện có. Theo kế hoạch = quy trình đã xác định trước cho dữ liệu đo trên hệ thống.')
EN=dict(
 title='STEP 4: DATA PROCESSING & STATISTICS',
 sub='From raw data to statistical analysis, while staying anonymous',
 A=dict(h='A. SURVEY (Questionnaires A, B, C)',tag='DONE',steps=[
  'Export the CSV file from the survey form',
  'Keep responses with "consent given": n = 100 per questionnaire',
  'Blank answers: skipped for that item only, never filled in',
  '1-5 scales: Mean and SD. Choice items: counts and %',
  'Options from the earlier form version: kept and marked †'],
  chips=[('4.61','SD 0.58 · need to learn'),('3.06','SD 1.19 · confidence'),('52%','know a scam victim')]),
 B=dict(h='B. IN-SYSTEM MEASUREMENT DATA',tag='PLANNED',steps=[
  'Anonymous CSV export: long format (one row per answer) and wide format (one row per student)',
  'Anonymous pairing: the same research ID R... means the same student at all three time points',
  'Scoring: knowledge 0-10; behavior 1-4 (two reversed items: 5 − level)'],
  th=['Research ID','Before','After','28 days'],row=['R...','knowledge + behavior','knowledge + behavior','knowledge + behavior'],
  note='Exported files contain no name, email, phone number or login card code'),
 C=dict(h='C. NON-PARAMETRIC TESTS',tag='PLANNED',rows=[
  ('Q1','Knowledge: before vs after','Wilcoxon','H1'),
  ('Q2','Retained after 28 days?','Wilcoxon (before - follow-up) · Friedman (3 time points)','H2'),
  ('Q3','Behavior: before vs after','Wilcoxon','H3'),
  ('Q4','Hint use and accuracy','Mann-Whitney or Spearman (correlation only)','H4')],
  why='Why non-parametric?',whys=['Knowledge score has only 11 values (0-10)','Behavior score is an ordinal scale (1-4)','Small class samples; no normal distribution needed'],
  how='Uses ranks of the data only'),
 foot='Significance level α = 0.05  ·  Effect size r = Z/√N  ·  Complete pairs only  ·  No imputation of missing values',
 note='Done = computed on the existing survey data. Planned = procedure fixed in advance for the in-system measurement data.')
def wrap(d,text,font,maxw):
    words=text.split(); lines=[]; cur=''
    for w in words:
        t=(cur+' '+w).strip()
        if d.textlength(t,font=font)<=maxw: cur=t
        else: lines.append(cur); cur=w
    if cur: lines.append(cur)
    return lines
def tag(d,x,y,text,done):
    f=F(FB,30); w=d.textlength(text,font=f)+44
    if done: d.rounded_rectangle([x,y,x+w,y+52],radius=26,fill=NAVY); d.text((x+22,y+26),text,font=f,fill=WHITE,anchor='lm')
    else: d.rounded_rectangle([x,y,x+w,y+52],radius=26,outline=ORG,width=5,fill=WHITE); d.text((x+22,y+26),text,font=f,fill=ORG,anchor='lm')
    return w
def card(d,x0,x1,top,bot,head,tg,done):
    d.rounded_rectangle([x0,top,x1,bot],radius=44,fill=CARD)
    y=top+34
    for ln in wrap(d,head,F(FB,46),x1-x0-80):
        d.text((x0+40,y),ln,font=F(FB,46),fill=NAVY); y+=56
    tag(d,x0+40,y+6,tg,done); y+=82
    d.line([x0+40,y,x1-40,y],fill=LINE,width=3)
    return y+28
def build(D,out):
    im=Image.new('RGB',(W,H),BG); d=ImageDraw.Draw(im)
    d.text((W/2,100),D['title'],font=F(FB,84),fill=NAVY,anchor='mm')
    d.text((W/2,190),D['sub'],font=F(FR,46),fill=GREY,anchor='mm')
    d.rectangle([W/2-160,236,W/2+160,242],fill=ORG)
    m=70; gap=70; top=290; bot=1560
    wA,wB,wC=900,900,W-2*m-2*gap-1800
    xA=m; xB=xA+wA+gap; xC=xB+wB+gap
    # arrows between cards
    for xe in (xA+wA,xB+wB):
        ay=(top+bot)/2; d.polygon([(xe+gap-14,ay),(xe+14,ay-30),(xe+14,ay+30)],fill=NAVY)
    # --- A
    y=card(d,xA,xA+wA,top,bot,D['A']['h'],D['A']['tag'],True)
    fb=F(FR,38)
    for i,s in enumerate(D['A']['steps'],1):
        d.ellipse([xA+40,y,xA+40+64,y+64],fill=NAVY); d.text((xA+72,y+32),str(i),font=F(FB,36),fill=WHITE,anchor='mm')
        ls=wrap(d,s,fb,wA-190); yy=y+(64-len(ls)*46)/2 if len(ls)<2 else y
        for ln in ls: d.text((xA+125,yy),ln,font=fb,fill=INK); yy+=46
        y=max(y+64,yy)+44
        if i<len(D['A']['steps']): d.polygon([(xA+72,y-12),(xA+58,y-32),(xA+86,y-32)],fill=ORG)
    # chips
    cy=bot-210; cw=(wA-80-2*20)/3
    for k,(v,c) in enumerate(D['A']['chips']):
        cx=xA+40+k*(cw+20); d.rounded_rectangle([cx,cy,cx+cw,cy+170],radius=26,fill=WHITE)
        d.text((cx+cw/2,cy+52),v,font=F(FB,64),fill=ORG,anchor='mm')
        for j,ln in enumerate(wrap(d,c,F(FR,27),cw-30)): d.text((cx+cw/2,cy+105+j*32),ln,font=F(FR,27),fill=GREY,anchor='mm')
    # --- B
    y=card(d,xB,xB+wB,top,bot,D['B']['h'],D['B']['tag'],False)
    for i,s in enumerate(D['B']['steps'],1):
        d.ellipse([xB+40,y,xB+40+64,y+64],fill=NAVY); d.text((xB+72,y+32),str(i),font=F(FB,36),fill=WHITE,anchor='mm')
        ls=wrap(d,s,fb,wB-190); yy=y
        for ln in ls: d.text((xB+125,yy),ln,font=fb,fill=INK); yy+=46
        y=max(y+64,yy)+44
        if i<len(D['B']['steps']): d.polygon([(xB+72,y-12),(xB+58,y-32),(xB+86,y-32)],fill=ORG)
    # mini table
    ty=y+10; tw=wB-80; cols=[0.31,0.22,0.22,0.25]; xs=[xB+40]
    for c in cols: xs.append(xs[-1]+tw*c)
    d.rounded_rectangle([xB+40,ty,xB+40+tw,ty+70],radius=14,fill=NAVY)
    for k,t in enumerate(D['B']['th']): d.text(((xs[k]+xs[k+1])/2,ty+35),t,font=F(FB,27),fill=WHITE,anchor='mm')
    d.rectangle([xB+40,ty+70,xB+40+tw,ty+290],fill=WHITE)
    for k,t in enumerate(D['B']['row']):
        cx=(xs[k]+xs[k+1])/2
        if k==0: d.text((cx,ty+180),t,font=F(FB,44),fill=ORG,anchor='mm')
        else:
            for j,ln in enumerate(wrap(d,t,F(FR,28),(xs[k+1]-xs[k])-24)): d.text((cx,ty+140+j*34),ln,font=F(FR,28),fill=INK,anchor='mm')
    for xx in xs[1:-1]: d.line([xx,ty+70,xx,ty+290],fill=LINE,width=2)
    ny=ty+320
    for ln in wrap(d,D['B']['note'],F(FR,32),tw): d.text((xB+40,ny),ln,font=F(FR,32),fill=GREY); ny+=40
    # --- C
    y=card(d,xC,xC+wC,top,bot,D['C']['h'],D['C']['tag'],False)
    for q,what,test,h in D['C']['rows']:
        d.rounded_rectangle([xC+40,y,xC+wC-40,y+150],radius=24,fill=WHITE)
        d.rounded_rectangle([xC+60,y+25,xC+170,y+125],radius=18,fill=NAVY); d.text((xC+115,y+75),q,font=F(FB,48),fill=WHITE,anchor='mm')
        d.text((xC+195,y+22),what,font=F(FB,36),fill=NAVY)
        ty2=y+70
        for ln in wrap(d,test,F(FR,33),wC-290): d.text((xC+195,ty2),ln,font=F(FR,33),fill=INK); ty2+=38
        d.text((xC+wC-60,y+30),h,font=F(FB,34),fill=ORG,anchor='ra')
        y+=170
    y+=10; d.line([xC+40,y,xC+wC-40,y],fill=LINE,width=3); y+=22
    d.text((xC+40,y),D['C']['why'],font=F(FB,38),fill=NAVY); y+=56
    for w in D['C']['whys']:
        d.ellipse([xC+44,y+14,xC+59,y+29],fill=ORG)
        for ln in wrap(d,w,F(FR,34),wC-150): d.text((xC+75,y),ln,font=F(FR,34),fill=INK); y+=42
        y+=8
    d.text((xC+40,y+6),'→ '+D['C']['how'],font=F(FB,36),fill=ORG)
    # footer strip
    d.rounded_rectangle([m,1600,W-m,1690],radius=26,fill=NAVY)
    d.text((W/2,1645),D['foot'],font=F(FB,38),fill=WHITE,anchor='mm')
    d.text((W/2,1745),D['note'],font=F(FR,30),fill=GREY,anchor='mm')
    im.save(out,optimize=True)
build(VI,'/tmp/claude-0/info/buoc4_vi.png'); build(EN,'/tmp/claude-0/info/buoc4_en.png')
