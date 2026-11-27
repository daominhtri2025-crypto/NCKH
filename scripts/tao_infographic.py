from PIL import Image, ImageDraw, ImageFont
import sys
W,H=3200,1800
NAVY=(20,45,92); ORG=(224,123,0); CARD=(238,242,248); BG=(250,250,248); GREY=(90,100,115); WHITE=(255,255,255)
FB='/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'; FR='/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'
F=lambda p,s: ImageFont.truetype(p,s)
EN=dict(
 title='SAFE DIGITAL SCHOOL: A RESEARCH PROCESS IN 5 STAGES',
 sub='A web-based practice system for recognizing online scams, for lower secondary students',
 foot='All data anonymous. Research ID cannot be used to log in.',
 cards=[
  dict(t='SURVEY & NEED',b=['3 questionnaires: students and teachers','n = 100 per questionnaire'],h=[('52%','have an acquaintance who was scammed online'),('4.61 / 5','need to learn scam recognition')],ic='mag'),
  dict(t='SYSTEM DESIGN',b=['3 practice activities, incl. Scenario Playground','16-item instrument: 10 knowledge + 6 behavior items','Two separate codes: login card code XXXX-XXXX and research ID R...'],h=[('10 + 6','')],ic='gear'),
  dict(t='TECHNICAL & SECURITY CHECKS',b=['321/321 integration tests passed','14/14 unit tests passed','23-step user flow passed','Exported CSV content verified by automated tests','No personal identity collected'],h=[('321/321','')],ic='shield'),
  dict(t='DATA PROCESSING & STATISTICS',b=['Survey: consent filter, Mean / SD / %','Anonymous pairing across time points via research ID','Planned non-parametric tests: Wilcoxon (Q1, Q3), Friedman (Q2), Mann-Whitney / Spearman (Q4)'],h=[('Q1 - Q4','')],ic='bars'),
  dict(t='THREE TIME POINTS & EXPANSION',b=['Same 16 items at every time point','Longitudinal data will be collected and analyzed in the expansion phase'],h=[('3 time points','')],ic='cal',tl=['Before','After','28 days later']),
 ])
VI=dict(
 title='AN TOÀN SỐ HỌC ĐƯỜNG: QUÁ TRÌNH NGHIÊN CỨU 5 CHẶNG',
 sub='Hệ thống web thực hành nhận diện lừa đảo trực tuyến cho học sinh trung học cơ sở',
 foot='Toàn bộ dữ liệu ẩn danh. Mã nghiên cứu không dùng để đăng nhập.',
 cards=[
  dict(t='KHẢO SÁT & NHU CẦU',b=['3 phiếu khảo sát: học sinh và giáo viên','n = 100 mỗi phiếu'],h=[('52%','có người quen từng bị lừa qua mạng'),('4,61 / 5','nhu cầu học nhận diện lừa đảo')],ic='mag'),
  dict(t='THIẾT KẾ HỆ THỐNG',b=['3 hoạt động thực hành, có Sân chơi tình huống','Bộ 16 câu: 10 kiến thức + 6 hành vi','Hai mã tách biệt: mã thẻ đăng nhập XXXX-XXXX và mã nghiên cứu R...'],h=[('10 + 6','')],ic='gear'),
  dict(t='KIỂM CHỨNG KỸ THUẬT & BẢO MẬT',b=['321/321 kiểm tra tích hợp đạt','14/14 kiểm thử đơn vị đạt','23 bước luồng người dùng đạt','Nội dung tệp CSV xuất ra được kiểm thử tự động','Không thu thông tin định danh'],h=[('321/321','')],ic='shield'),
  dict(t='XỬ LÝ SỐ LIỆU & THỐNG KÊ',b=['Khảo sát: lọc phiếu đồng ý, trung bình / SD / %','Ghép cặp ẩn danh giữa các mốc qua mã nghiên cứu','Kiểm định phi tham số theo kế hoạch: Wilcoxon (Q1, Q3), Friedman (Q2), Mann-Whitney / Spearman (Q4)'],h=[('Q1 - Q4','')],ic='bars'),
  dict(t='BA THỜI ĐIỂM & MỞ RỘNG',b=['Cùng bộ 16 câu ở mọi thời điểm','Dữ liệu theo dõi dọc sẽ được thu thập và phân tích ở giai đoạn mở rộng'],h=[('3 thời điểm','')],ic='cal',tl=['Trước','Sau','28 ngày sau']),
 ])
def wrap(d,text,font,maxw):
    words=text.split(); lines=[]; cur=''
    for w in words:
        t=(cur+' '+w).strip()
        if d.textlength(t,font=font)<=maxw: cur=t
        else: lines.append(cur); cur=w
    if cur: lines.append(cur)
    return lines
def icon(d,kind,cx,cy,s,col):
    w=max(6,s//10)
    if kind=='mag':
        d.ellipse([cx-s*0.5,cy-s*0.5,cx+s*0.15,cy+s*0.15],outline=col,width=w); d.line([cx+s*0.1,cy+s*0.1,cx+s*0.5,cy+s*0.5],fill=col,width=w*2)
    elif kind=='gear':
        import math
        for k in range(8):
            a=k*math.pi/4; d.line([cx+math.cos(a)*s*0.38,cy+math.sin(a)*s*0.38,cx+math.cos(a)*s*0.55,cy+math.sin(a)*s*0.55],fill=col,width=w*2)
        d.ellipse([cx-s*0.4,cy-s*0.4,cx+s*0.4,cy+s*0.4],outline=col,width=w); d.ellipse([cx-s*0.15,cy-s*0.15,cx+s*0.15,cy+s*0.15],outline=col,width=w)
    elif kind=='shield':
        pts=[(cx-s*0.45,cy-s*0.5),(cx+s*0.45,cy-s*0.5),(cx+s*0.45,cy),(cx,cy+s*0.55),(cx-s*0.45,cy)]
        d.polygon(pts,outline=col,width=w); d.line([cx-s*0.2,cy,cx-s*0.03,cy+s*0.2,cx+s*0.25,cy-s*0.2],fill=col,width=w)
    elif kind=='bars':
        for i,hh in enumerate((0.4,0.8,0.6)):
            x=cx-s*0.45+i*s*0.35; d.rectangle([x,cy+s*0.5-s*hh,x+s*0.25,cy+s*0.5],outline=col,width=w)
    elif kind=='cal':
        d.rounded_rectangle([cx-s*0.5,cy-s*0.45,cx+s*0.5,cy+s*0.5],radius=s//10,outline=col,width=w); d.line([cx-s*0.5,cy-s*0.15,cx+s*0.5,cy-s*0.15],fill=col,width=w)
        d.line([cx-s*0.25,cy-s*0.6,cx-s*0.25,cy-s*0.3],fill=col,width=w); d.line([cx+s*0.25,cy-s*0.6,cx+s*0.25,cy-s*0.3],fill=col,width=w)
def build(D,out):
    im=Image.new('RGB',(W,H),BG); d=ImageDraw.Draw(im)
    d.text((W/2,110),D['title'],font=F(FB,78),fill=NAVY,anchor='mm')
    d.text((W/2,200),D['sub'],font=F(FR,44),fill=GREY,anchor='mm')
    d.rectangle([W/2-160,245,W/2+160,251],fill=ORG)
    m=70; gap=95; cw=(W-2*m-4*gap)/5; top=330; bot=1620
    for i,c in enumerate(D['cards']):
        x0=m+i*(cw+gap); x1=x0+cw
        d.rounded_rectangle([x0,top,x1,bot],radius=44,fill=CARD)
        # badge
        d.ellipse([x0+36,top-52,x0+36+104,top+52],fill=NAVY); d.text((x0+88,top),str(i+1),font=F(FB,64),fill=WHITE,anchor='mm')
        icon(d,c['ic'],x1-85,top+10,84,NAVY)
        y=top+95
        for ln in wrap(d,c['t'],F(FB,46),cw-80):
            d.text((x0+40,y),ln,font=F(FB,46),fill=NAVY); y+=58
        y+=8; d.line([x0+40,y,x1-40,y],fill=(190,200,215),width=3); y+=26
        fb=F(FR,40)
        for b in c['b']:
            ls=wrap(d,b,fb,cw-105)
            d.ellipse([x0+42,y+16,x0+57,y+31],fill=ORG)
            for ln in ls:
                d.text((x0+75,y),ln,font=fb,fill=(30,38,52)); y+=52
            y+=18
        if 'tl' in c:
            ty=y+70; xs=[x0+80,(x0+x1)/2,x1-100]
            d.line([xs[0],ty,xs[2],ty],fill=NAVY,width=6)
            for xx,lb in zip(xs,c['tl']):
                d.ellipse([xx-16,ty-16,xx+16,ty+16],fill=ORG); d.multiline_text((xx,ty+34),lb.replace('28 days later','28 days\nlater').replace('28 ngày sau','28 ngày\nsau'),font=F(FB,32),fill=NAVY,anchor='ma',align='center',spacing=6)
        # highlights at bottom
        hs=c['h']
        def hh(val,cap):
            fs=96 if len(val)<=8 else 76
            n=len(wrap(d,cap,F(FR,32),cw-80)) if cap else 0
            return fs+4+(n*38+18 if cap else 0)
        hy=bot-44-sum(hh(v,cp) for v,cp in hs)
        for val,cap in hs:
            fs=96 if len(val)<=8 else 76
            d.text((x0+40,hy),val,font=F(FB,fs),fill=ORG); hy+=fs+4
            if cap:
                for ln in wrap(d,cap,F(FR,32),cw-80):
                    d.text((x0+40,hy),ln,font=F(FR,32),fill=GREY); hy+=38
                hy+=18
        # arrow
        if i<4:
            ax0=x1+16; ax1=x1+gap-16; ay=(top+bot)/2
            d.line([ax0,ay,ax1-18,ay],fill=NAVY,width=14); d.polygon([(ax1,ay),(ax1-34,ay-30),(ax1-34,ay+30)],fill=NAVY)
    d.text((W/2,1715),D['foot'],font=F(FR,38),fill=GREY,anchor='mm')
    im.save(out,optimize=True)
build(EN,'/tmp/claude-0/info/infographic_en.png'); build(VI,'/tmp/claude-0/info/infographic_vi.png')
