from PIL import Image, ImageDraw, ImageFont
W,H=3200,1800
NAVY=(20,45,92); ORG=(224,123,0); CARD=(238,242,248); BG=(250,250,248); GREY=(90,100,115); WHITE=(255,255,255); INK=(30,38,52); LINE=(190,200,215); LORG=(253,236,214)
FB='/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'; FR='/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'
F=lambda p,s: ImageFont.truetype(p,s)
def wrap(d,text,font,maxw):
    words=text.split(); lines=[]; cur=''
    for w in words:
        t=(cur+' '+w).strip()
        if d.textlength(t,font=font)<=maxw: cur=t
        else: lines.append(cur); cur=w
    if cur: lines.append(cur)
    return lines
def header(d,title,sub,use):
    d.text((W/2,95),title,font=F(FB,80),fill=NAVY,anchor='mm')
    d.text((W/2,180),sub,font=F(FR,46),fill=GREY,anchor='mm')
    d.rectangle([W/2-160,225,W/2+160,231],fill=ORG)
    # tags
    f=F(FB,30)
    t1='THEO KẾ HOẠCH'; w1=d.textlength(t1,font=f)+44
    d.rounded_rectangle([70,262,70+w1,314],radius=26,outline=ORG,width=5,fill=WHITE); d.text((92,288),t1,font=f,fill=ORG,anchor='lm')
    t2='Ví dụ minh họa dùng SỐ GIẢ để học cách tính, không phải dữ liệu thật'; f2=F(FR,32)
    d.text((70+w1+30,288),t2,font=f2,fill=GREY,anchor='lm')
    d.text((W-70,288),use,font=F(FB,32),fill=NAVY,anchor='rm')
def steps_panel(d,x0,x1,top,bot,when,steps):
    d.rounded_rectangle([x0,top,x1,bot],radius=44,fill=CARD)
    y=top+34
    d.text((x0+40,y),'KHI NÀO DÙNG',font=F(FB,34),fill=ORG); y+=48
    for ln in wrap(d,when,F(FR,42),x1-x0-80): d.text((x0+40,y),ln,font=F(FR,42),fill=INK); y+=54
    y+=14; d.line([x0+40,y,x1-40,y],fill=LINE,width=3); y+=26
    d.text((x0+40,y),'CÁCH THỰC HIỆN',font=F(FB,34),fill=ORG); y+=56
    fb=F(FR,42)
    for i,s in enumerate(steps,1):
        d.ellipse([x0+40,y,x0+104,y+64],fill=NAVY); d.text((x0+72,y+32),str(i),font=F(FB,36),fill=WHITE,anchor='mm')
        yy=y
        for ln in wrap(d,s,fb,x1-x0-190): d.text((x0+125,yy),ln,font=fb,fill=INK); yy+=52
        y=max(y+64,yy)+62
        if i<len(steps): d.polygon([(x0+72,y-22),(x0+56,y-48),(x0+88,y-48)],fill=ORG)
def table(d,x,y,widths,head,rows,rh=70,fs=36,orgcols=(),boldfirst=False,hl=None):
    tw=sum(widths)
    d.rounded_rectangle([x,y,x+tw,y+rh],radius=14,fill=NAVY)
    cx=x
    for w,h in zip(widths,head):
        d.text((cx+w/2,y+rh/2),h,font=F(FB,fs-4),fill=WHITE,anchor='mm'); cx+=w
    yy=y+rh
    for r,row in enumerate(rows):
        d.rectangle([x,yy,x+tw,yy+rh],fill=WHITE if r%2==0 else (246,248,252))
        cx=x
        for c,(w,v) in enumerate(zip(widths,row)):
            col=ORG if c in orgcols else INK
            f=F(FB,fs) if (c in orgcols or (boldfirst and c==0)) else F(FR,fs)
            d.text((cx+w/2,yy+rh/2),str(v),font=f,fill=col,anchor='mm'); cx+=w
        yy+=rh
    cx=x
    for w in widths[:-1]:
        cx+=w; d.line([cx,y+rh,cx,yy],fill=LINE,width=2)
    return yy
def resultbox(d,x0,x1,y,lines,bigline=None):
    h=40+len(lines)*52+(70 if bigline else 0)
    d.rounded_rectangle([x0,y,x1,y+h],radius=30,fill=NAVY)
    yy=y+28
    if bigline: d.text(((x0+x1)/2,yy+30),bigline,font=F(FB,60),fill=(255,190,90),anchor='mm'); yy+=70
    for ln in lines: d.text((x0+40,yy),ln,font=F(FR,38),fill=WHITE); yy+=52
    return y+h
def foot(d,text):
    d.rounded_rectangle([70,1640,W-70,1750],radius=28,fill=ORG)
    ls=wrap(d,text,F(FB,36),W-240); y0=1695-(len(ls)-1)*22
    for i,ln in enumerate(ls): d.text((W/2,y0+i*44),ln,font=F(FB,36),fill=WHITE,anchor='mm')
def base(title,sub,use):
    im=Image.new('RGB',(W,H),BG); d=ImageDraw.Draw(im); header(d,title,sub,use); return im,d
def ex_panel(d,x0,x1,top,bot,label):
    d.rounded_rectangle([x0,top,x1,bot],radius=44,fill=WHITE,outline=LINE,width=4)
    d.text((x0+40,top+30),label,font=F(FB,36),fill=NAVY)
    return top+100
def fit(ws,total=1630):
    k=total/sum(ws); return [int(w*k) for w in ws]
TOP=340; BOT=1600; LX1=1380; RX0=1420; RX1=W-70
# ---------- 1 Wilcoxon
def wilcoxon():
    im,d=base('WILCOXON SIGNED-RANK','So sánh điểm trước và sau của CÙNG MỘT học sinh','Dùng cho Q1, Q3 và cặp trước – theo dõi của Q2')
    steps_panel(d,70,LX1,TOP,BOT,'Hai lần đo trên cùng một nhóm học sinh, muốn biết điểm có thay đổi không. Điểm kiến thức 0–10 (Q1), điểm hành vi 1–4 (Q3).',
      ['Với mỗi em, tính hiệu = điểm sau − điểm trước','Bỏ các em có hiệu bằng 0 (không đổi)','Lấy giá trị tuyệt đối của hiệu, xếp hạng từ nhỏ đến lớn (bằng nhau thì lấy hạng trung bình)','Cộng hạng của các em tăng (W+) và các em giảm (W−)','Lấy số nhỏ hơn làm thống kê W, rồi tra giá trị p'])
    y=ex_panel(d,RX0,RX1,TOP,BOT,'VÍ DỤ: 8 học sinh, điểm kiến thức (số giả)')
    rows=[[1,4,7,'+3','5'],[2,5,6,'+1','1,5'],[3,6,6,'0','bỏ'],[4,3,5,'+2','3,5'],[5,7,9,'+2','3,5'],[6,5,5,'0','bỏ'],[7,6,10,'+4','6'],[8,4,5,'+1','1,5']]
    yy=table(d,RX0+40,y,fit([200,260,260,260,400]),['Em','Trước','Sau','Hiệu','Hạng |hiệu|'],rows,rh=84,fs=42,orgcols=(4,))
    resultbox(d,RX0+40,RX1-40,yy+30,['6 em còn lại đều tăng: W+ = 21, W− = 0','Cỡ mẫu nhỏ nên tính p chính xác'],'W = 0  →  p ≈ 0,031')
    foot(d,'Cách đọc: p < 0,05 → điểm sau khác điểm trước. Luôn kèm kích thước hiệu ứng r = Z/√N để biết khác biệt lớn hay nhỏ.')
    im.save('/tmp/claude-0/info/kd1_wilcoxon.png',optimize=True)
# ---------- 2 Friedman
def friedman():
    im,d=base('FRIEDMAN','So sánh điểm ở BA MỐC của cùng một nhóm học sinh','Dùng cho Q2 (trước, sau, 28 ngày sau)')
    steps_panel(d,70,LX1,TOP,BOT,'Ba lần đo (trước, sau, 28 ngày sau) trên cùng một nhóm. Trả lời: ba mốc có khác nhau không?',
      ['Với mỗi em, xếp hạng 3 điểm của chính em đó từ 1 đến 3','Cộng hạng theo từng mốc trên toàn bộ học sinh','So ba tổng hạng: nếu khác nhau nhiều thì có khác biệt giữa ba mốc','Nếu có ý nghĩa: so từng cặp bằng Wilcoxon (nên điều chỉnh mức ý nghĩa, ví dụ α/3)'])
    y=ex_panel(d,RX0,RX1,TOP,BOT,'VÍ DỤ: 5 học sinh, điểm (hạng trong ngoặc) (số giả)')
    rows=[[1,'4  (1)','7  (3)','6  (2)'],[2,'5  (1)','6  (2,5)','6  (2,5)'],[3,'6  (1,5)','6  (1,5)','8  (3)'],[4,'3  (1)','5  (2,5)','5  (2,5)'],[5,'7  (1)','9  (2,5)','9  (2,5)']]
    yy=table(d,RX0+40,y,fit([200,420,420,420]),['Em','Trước','Sau','28 ngày'],rows,rh=100,fs=42)
    d.rectangle([RX0+40,yy,RX1-40,yy+100],fill=LORG)
    ws=fit([200,420,420,420]); d.text((RX0+40+ws[0]/2,yy+50),'Tổng hạng',font=F(FB,34),fill=INK,anchor='mm')
    xs=[RX0+40+ws[0]+ws[1]/2,RX0+40+ws[0]+ws[1]+ws[2]/2,RX0+40+ws[0]+ws[1]+ws[2]+ws[3]/2]
    for xx,v in zip(xs,['5,5','12','12,5']): d.text((xx,yy+50),v,font=F(FB,52),fill=ORG,anchor='mm')
    resultbox(d,RX0+40,RX1-40,yy+150,['Tổng hạng của "Trước" thấp hẳn so với hai mốc còn lại','(với cỡ mẫu rất nhỏ như vậy, thực tế dùng bảng chính xác)'],'χ² ≈ 7,6  →  p ≈ 0,02')
    foot(d,'Cách đọc: Friedman chỉ nói "có khác biệt ở đâu đó giữa ba mốc". Muốn biết cặp nào khác, so từng cặp bằng Wilcoxon (có điều chỉnh mức ý nghĩa).')
    im.save('/tmp/claude-0/info/kd2_friedman.png',optimize=True)
# ---------- 3 Mann-Whitney
def mw():
    im,d=base('MANN-WHITNEY','So sánh HAI NHÓM học sinh khác nhau (không ghép cặp)','Dùng cho Q4 (dùng gợi ý và không dùng gợi ý)')
    steps_panel(d,70,LX1,TOP,BOT,'Hai nhóm độc lập: nhóm DÙNG gợi ý đọc tên miền và nhóm KHÔNG dùng. So độ chính xác khi phân loại địa chỉ.',
      ['Chia hai nhóm theo một quy tắc chốt trước (ví dụ: dùng gợi ý ở ít nhất một địa chỉ)','Gộp cả hai nhóm, xếp hạng độ chính xác của mọi học sinh từ nhỏ đến lớn','Cộng hạng riêng từng nhóm','Tính U = tổng hạng của nhóm − n(n+1)/2; U nhỏ nghĩa là hai nhóm tách biệt','Đọc p và kích thước hiệu ứng r'])
    y=ex_panel(d,RX0,RX1,TOP,BOT,'VÍ DỤ: độ chính xác (%) của 8 học sinh (số giả)')
    wcol=[410,375]
    d.text((RX0+40,y),'Nhóm DÙNG gợi ý (4 em)',font=F(FB,34),fill=NAVY)
    yy1=table(d,RX0+40,y+44,wcol,['Chính xác (%)','Hạng'],[[60,'2'],[70,'3,5'],[50,'1'],[80,'5,5']],rh=84,fs=42,orgcols=(1,))
    xb=RX0+40+785+50
    d.text((xb,y),'Nhóm KHÔNG dùng (4 em)',font=F(FB,34),fill=NAVY)
    table(d,xb,y+44,wcol,['Chính xác (%)','Hạng'],[[80,'5,5'],[90,'7'],[70,'3,5'],[100,'8']],rh=84,fs=42,orgcols=(1,))
    yy=yy1+28
    d.text((RX0+40,yy),'Tổng hạng:',font=F(FB,38),fill=INK)
    d.text((RX0+250,yy),'12',font=F(FB,52),fill=ORG); d.text((xb,yy),'Tổng hạng:',font=F(FB,38),fill=INK); d.text((xb+210,yy),'24',font=F(FB,52),fill=ORG)
    resultbox(d,RX0+40,RX1-40,yy+100,['U = 12 − 4×5/2 = 2','Mỗi nhóm chỉ có 4 người nên p lớn: chưa đủ cơ sở kết luận','(đây là bài học về cỡ mẫu)'],'U = 2  →  p ≈ 0,11')
    foot(d,'Cách đọc: nếu p < 0,05 thì độ chính xác của hai nhóm khác nhau. Chỉ là mối liên hệ, KHÔNG chứng minh gợi ý làm tăng độ chính xác.')
    im.save('/tmp/claude-0/info/kd3_mannwhitney.png',optimize=True)
# ---------- 4 Spearman
def spearman():
    im,d=base('SPEARMAN','Đo mức hai đại lượng ĐI CÙNG NHAU của mỗi học sinh','Dùng cho Q4 (số lần dùng gợi ý và độ chính xác)')
    steps_panel(d,70,LX1,TOP,BOT,'Mỗi học sinh có hai số: số lần dùng gợi ý (x) và độ chính xác khi phân loại (y). Hỏi: x và y có đi cùng nhau không?',
      ['Xếp hạng riêng các giá trị x, rồi xếp hạng riêng các giá trị y','Tính hệ số tương quan trên các thứ hạng, được ρ nằm từ −1 đến +1','Đọc ρ: gần +1 cùng chiều, gần −1 ngược chiều, gần 0 là không liên quan','Đọc p và cỡ mẫu để biết mối liên hệ có đáng tin không'])
    y=ex_panel(d,RX0,RX1,TOP,BOT,'VÍ DỤ: 6 học sinh (số giả)')
    rows=[[1,0,60,1,2],[2,1,55,2,1],[3,2,70,3,3],[4,3,75,4,4],[5,4,80,5,5],[6,5,90,6,6]]
    yy=table(d,RX0+40,y,fit([180,300,300,260,260]),['Em','Lần dùng gợi ý (x)','Chính xác % (y)','Hạng x','Hạng y'],rows,rh=84,fs=42,orgcols=(3,4))
    resultbox(d,RX0+40,RX1-40,yy+30,['Hạng x và hạng y gần như trùng nhau','→ hai đại lượng đi cùng chiều (trong dữ liệu giả này)'],'ρ ≈ 0,94  →  p ≈ 0,005')
    # scale bar
    sy=yy+30+230
    d.text((RX0+40,sy-4),'Thang ρ:',font=F(FB,34),fill=NAVY)
    bx0=RX0+260; bx1=RX1-90
    d.rounded_rectangle([bx0,sy+6,bx1,sy+30],radius=12,fill=(220,226,236))
    for v,lab in [(-1,'−1 ngược chiều'),(0,'0 không liên quan'),(1,'+1 cùng chiều')]:
        xx=bx0+(v+1)/2*(bx1-bx0); d.ellipse([xx-12,sy+6,xx+12,sy+30],fill=NAVY)
        d.text((xx,sy+70),lab,font=F(FR,30),fill=INK,anchor=('lm' if v==-1 else ('rm' if v==1 else 'mm')))
    foot(d,'LUÔN NHỚ: tương quan KHÔNG phải nhân quả. Em dùng gợi ý nhiều có thể là em thấy khó nên mới dùng, nên báo cáo chỉ diễn giải là mối liên hệ.')
    im.save('/tmp/claude-0/info/kd4_spearman.png',optimize=True)
wilcoxon(); friedman(); mw(); spearman()
