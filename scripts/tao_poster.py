import re
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE, XL_LABEL_POSITION
NAVY=RGBColor(0x14,0x2D,0x5C); ORG=RGBColor(0xE0,0x7B,0x00); INK=RGBColor(0x22,0x2B,0x3A)
GREY=RGBColor(0x5A,0x64,0x73); LIGHT=RGBColor(0xEE,0xF2,0xF8); LINE=RGBColor(0xC9,0xD3,0xE3); WHITE=RGBColor(255,255,255)
FONT='Arial'
prs=Presentation(); prs.slide_width=Inches(13.333); prs.slide_height=Inches(7.5)
blank=prs.slide_layouts[6]
def runs(p,text,size,color=INK,bold=False,italic=False):
    for i,part in enumerate(re.split(r'\*\*(.+?)\*\*',text)):
        if not part: continue
        r=p.add_run(); r.text=part; f=r.font; f.name=FONT; f.size=Pt(size); f.italic=italic
        key=i%2==1
        f.bold=bold or key; f.color.rgb=ORG if key else color
def tb(s,x,y,w,h,paras,size=18,color=INK,align=PP_ALIGN.LEFT,anchor=MSO_ANCHOR.TOP,bold=False,italic=False,space=4,bullet=False):
    box=s.shapes.add_textbox(Inches(x),Inches(y),Inches(w),Inches(h)); tf=box.text_frame; tf.word_wrap=True
    tf.margin_left=tf.margin_right=Inches(0.05); tf.margin_top=tf.margin_bottom=Inches(0.03); tf.vertical_anchor=anchor
    for i,t in enumerate(paras if isinstance(paras,list) else [paras]):
        p=tf.paragraphs[0] if i==0 else tf.add_paragraph(); p.alignment=align; p.space_after=Pt(space)
        runs(p,('• '+t) if bullet else t,size,color,bold,italic)
    return box
def rect(s,x,y,w,h,fill=LIGHT,line=None,shape=MSO_SHAPE.RECTANGLE):
    r=s.shapes.add_shape(shape,Inches(x),Inches(y),Inches(w),Inches(h))
    r.fill.solid(); r.fill.fore_color.rgb=fill
    if line: r.line.color.rgb=line; r.line.width=Pt(1)
    else: r.line.fill.background()
    r.shadow.inherit=False
    return r
def head(s,title,sub=None):
    tb(s,0.6,0.3,12.1,0.8,title,size=36,color=NAVY,bold=True)
    rect(s,0.65,1.05,12.0,0.04,fill=ORG)
    if sub: tb(s,0.6,1.12,12.1,0.5,sub,size=18,color=GREY)
def sec(s,x,y,w,text):
    tb(s,x,y,w,0.45,text,size=22,color=NAVY,bold=True)
def cap(s,x,y,w,text): tb(s,x,y,w,0.5,text,size=14,color=GREY,italic=True)
CAP_SHOT='Ảnh chụp màn hình sản phẩm (dữ liệu mẫu), do học sinh tự thực hiện.'
CAP_CHART='Biểu đồ tạo bằng Microsoft PowerPoint từ số liệu khảo sát, do học sinh tự thực hiện.'

# ---------- Trang 1
s=prs.slides.add_slide(blank)
tb(s,0.6,0.35,12.1,1.0,'AN TOÀN SỐ HỌC ĐƯỜNG',size=48,color=NAVY,bold=True,align=PP_ALIGN.CENTER)
tb(s,0.6,1.3,12.1,0.5,'Hệ thống web thực hành nhận diện **lừa đảo trực tuyến** cho học sinh THCS',size=22,color=INK,align=PP_ALIGN.CENTER)
rect(s,0.65,1.85,12.0,0.04,fill=ORG)
tb(s,0.6,1.92,12.1,0.45,'Lĩnh vực dự thi: Công nghệ thông tin – An toàn thông tin trong giáo dục',size=18,color=GREY,align=PP_ALIGN.CENTER)
rect(s,0.6,2.5,5.9,3.15,fill=LIGHT); rect(s,6.85,2.5,5.9,3.15,fill=LIGHT)
sec(s,0.75,2.55,5.6,'MỤC TIÊU')
tb(s,0.75,3.0,5.6,2.5,['**Vấn đề:** học sinh dùng mạng thường xuyên nhưng ít được **thực hành** nhận diện lừa đảo, và việc học hiếm khi được **đo**.',
 '**Câu hỏi nghiên cứu:** kiến thức và hành vi an toàn có thay đổi sau khi học không, và có **duy trì sau 28 ngày** không?',
 '**Mục tiêu:** công cụ **thực hành + đo lường** mà **không thu thông tin định danh** học sinh.'],size=16,space=6)
sec(s,7.0,2.55,5.6,'PHƯƠNG PHÁP')
tb(s,7.0,3.0,5.6,2.5,['**Khảo sát thực trạng:** 3 phiếu (học sinh, giáo viên), 100 phiếu hợp lệ mỗi phiếu.',
 '**Sản phẩm:** hệ thống web với **3 hoạt động** thực hành.',
 '**Đo 3 thời điểm:** trước – sau – **28 ngày** sau, cùng bộ **16 câu** (10 kiến thức, 6 hành vi).',
 '**Công nghệ:** React + TypeScript, PHP, MySQL/MariaDB; kiểm thử tự động.'],size=16,space=5)
steps=['Kích hoạt thẻ','Đầu vào\n16 câu','3 hoạt động\nthực hành','Sau học\n16 câu','Chờ\n28 ngày','Theo dõi\n16 câu']
w=1.78; gap=0.264; x=0.6
for i,t in enumerate(steps):
    r=rect(s,x,5.85,w,0.85,fill=NAVY if i in (1,3,5) else WHITE,line=NAVY,shape=MSO_SHAPE.ROUNDED_RECTANGLE)
    tf=r.text_frame; tf.word_wrap=True; tf.vertical_anchor=MSO_ANCHOR.MIDDLE
    for j,ln in enumerate(t.split('\n')):
        p=tf.paragraphs[0] if j==0 else tf.add_paragraph(); p.alignment=PP_ALIGN.CENTER
        runs(p,ln,13,WHITE if i in (1,3,5) else NAVY,bold=True)
    if i<5: tb(s,x+w,6.05,gap,0.4,'›',size=22,color=ORG,bold=True,align=PP_ALIGN.CENTER)
    x+=w+gap
cap(s,0.6,6.8,12.1,'Sơ đồ do học sinh tự vẽ. Ô đậm là ba thời điểm đo; hệ thống khóa trình tự ở máy chủ.')

# ---------- Trang 2
s=prs.slides.add_slide(blank); head(s,'QUÁ TRÌNH THỰC HIỆN: 4 BƯỚC')
cards=[('1. Khảo sát thực trạng',['Thu thập **01/11/2026 – 11/11/2026**, ẩn danh.','3 phiếu × **100** bản hợp lệ.','Đo mức **tự tin**, kinh nghiệm gặp tin lừa đảo, nhu cầu học, rào cản của giáo viên.']),
 ('2. Thiết kế giải pháp',['Rút **6 yêu cầu**: học bằng tình huống, giải thích ngay, đo nhận thức và hành vi riêng.','Khóa trình tự ở máy chủ, **không thu danh tính**, chạy được trên điện thoại.']),
 ('3. Xây dựng 3 hoạt động',['**Sân chơi tình huống** · **Thám tử không gian mạng** · **Phòng thí nghiệm tài khoản**.','Nội dung tách khỏi mã nguồn, được kiểm tra tự động trước khi dùng.']),
 ('4. Kiểm thử, chạy thử',['**321** kiểm tra tích hợp, **14** kiểm thử đơn vị, **23** bước luồng người dùng: đều đạt.','Cài và chạy thử trên máy tính Windows khác theo hướng dẫn từng bước.'])]
x=0.6
for t,b in cards:
    rect(s,x,1.35,2.9,3.1,fill=LIGHT); tb(s,x+0.1,1.4,2.7,0.8,t,size=16,color=NAVY,bold=True)
    tb(s,x+0.1,2.15,2.7,2.3,b,size=14,space=5,bullet=True); x+=3.07
s.shapes.add_picture('san_choi.jpg',Inches(0.6),Inches(4.65),height=Inches(2.05)); cap(s,0.6,6.72,3.6,CAP_SHOT)
# bảng hoạt động
tbl=s.shapes.add_table(4,2,Inches(4.55),Inches(4.65),Inches(5.3),Inches(2.05)).table
tbl.columns[0].width=Inches(1.9); tbl.columns[1].width=Inches(3.4)
rows=[('Hoạt động','Nội dung'),('**Sân chơi tình huống**','5 tình huống: mạo danh, đòi mã **OTP**, trúng thưởng, nhờ chuyển tiền, trang giả'),
 ('**Thám tử không gian mạng**','Phân loại **12 địa chỉ** (5 thật, 7 giả); đọc tên miền **từ phải sang trái**'),
 ('**Phòng thí nghiệm tài khoản**','Thử **mật khẩu** ngay trên trình duyệt; checklist **quyền riêng tư** 8 bước')]
for i,(a,b) in enumerate(rows):
    for j,t in enumerate((a,b)):
        c=tbl.cell(i,j); c.fill.solid(); c.fill.fore_color.rgb=NAVY if i==0 else (WHITE if i%2 else LIGHT)
        c.margin_left=c.margin_right=Inches(0.06); c.margin_top=c.margin_bottom=Inches(0.02)
        tf=c.text_frame; tf.word_wrap=True; p=tf.paragraphs[0]
        runs(p,t,12 if i else 14,WHITE if i==0 else INK,bold=(i==0))
rect(s,10.1,4.65,2.65,2.05,fill=NAVY)
tb(s,10.2,4.7,2.45,0.4,'Bảo vệ quyền riêng tư',size=16,color=WHITE,bold=True)
tb(s,10.2,5.1,2.45,1.6,['Không thu họ tên, email, số điện thoại','**Hai mã tách biệt**: mã đăng nhập ≠ mã trong dữ liệu','Mật khẩu thử **không rời trình duyệt**'],size=13,color=WHITE,space=3,bullet=True)
cap(s,4.55,6.72,5.4,'Bảng do học sinh tự lập.')

# ---------- Trang 3
s=prs.slides.add_slide(blank); head(s,'KẾT QUẢ','Khảo sát thực trạng (n = 100 mỗi phiếu; số liệu tự báo cáo)')
kp=[('4,61 / 5','Học sinh cho là **rất cần thiết** phải học nhận diện lừa đảo'),('3,06 / 5','Mức **tự tin** của học sinh chỉ ở mức vừa phải'),
 ('52%','Học sinh có **người thân hoặc bạn bè** từng bị lừa qua mạng'),('47%','Giáo viên từng gặp **học sinh bị lừa** qua mạng')]
x=0.6
for n,t in kp:
    rect(s,x,1.7,2.9,1.3,fill=LIGHT); tb(s,x+0.05,1.72,2.8,0.6,n,size=30,color=ORG,bold=True,align=PP_ALIGN.CENTER)
    tb(s,x+0.1,2.3,2.7,0.7,t,size=13,align=PP_ALIGN.CENTER,space=0); x+=3.07
def chart(x,title,cats,vals):
    cd=CategoryChartData(); cd.categories=cats; cd.add_series('Điểm trung bình (thang 1–5)',vals)
    gf=s.shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED,Inches(x),Inches(3.0),Inches(4.1),Inches(2.15),cd); ch=gf.chart
    ch.has_legend=False; ch.has_title=True; ch.chart_title.text_frame.text=title
    r=ch.chart_title.text_frame.paragraphs[0].runs[0]; r.font.size=Pt(14); r.font.bold=True; r.font.name=FONT; r.font.color.rgb=NAVY
    va=ch.value_axis; va.minimum_scale=0; va.maximum_scale=5; va.major_unit=1; va.tick_labels.font.size=Pt(12); va.has_major_gridlines=True
    va.major_gridlines.format.line.color.rgb=LINE
    ch.category_axis.tick_labels.font.size=Pt(12)
    pl=ch.plots[0]; pl.gap_width=80; pl.has_data_labels=True; dl=pl.data_labels; dl.font.size=Pt(14); dl.font.bold=True; dl.number_format='0.00'; dl.number_format_is_linked=False; dl.position=XL_LABEL_POSITION.OUTSIDE_END
    pl.series[0].format.fill.solid(); pl.series[0].format.fill.fore_color.rgb=NAVY
    pt=pl.series[0].points[0]; pt.format.fill.solid(); pt.format.fill.fore_color.rgb=NAVY
    pt=pl.series[0].points[1]; pt.format.fill.solid(); pt.format.fill.fore_color.rgb=ORG
chart(0.6,'Học sinh (n = 100)',['Mức cần thiết','Mức tự tin'],(4.61,3.06)); cap(s,0.6,5.15,4.1,CAP_CHART)
chart(4.85,'Giáo viên (n = 100)',['Mức nguy cơ','Tự tin khi hướng dẫn'],(3.99,3.39)); cap(s,4.85,5.15,4.1,CAP_CHART)
s.shapes.add_picture('xuat_du_lieu.jpg',Inches(9.2),Inches(3.0),width=Inches(3.55)); cap(s,9.2,5.15,3.55,CAP_SHOT)
rect(s,0.6,6.05,5.9,1.2,fill=LIGHT)
tb(s,0.7,6.08,5.7,1.15,['**Sản phẩm:** 3 hoạt động, bộ 16 câu, 3 vai trò; kiểm thử **321/321**, **14/14**, **23/23** đạt.','Học sinh đánh giá **dễ dùng 4,27/5**, giải thích **rõ 4,25/5**.'],size=13,space=2)
rect(s,6.65,6.05,6.1,1.2,fill=WHITE,line=NAVY)
tb(s,6.75,6.08,5.9,1.15,['**Phải nói rõ:** dữ liệu đo **trước – sau – 28 ngày** trong hệ thống **chưa được thu thập**, nên **chưa kết luận** hiệu quả học tập.','Biểu mẫu khảo sát được sửa khi thu thập: điểm dễ dùng chỉ để tham khảo.'],size=13,space=2)

# ---------- Trang 4
s=prs.slides.add_slide(blank); head(s,'Ý NGHĨA VÀ KẾT LUẬN')
tbl=s.shapes.add_table(5,2,Inches(0.6),Inches(1.4),Inches(6.4),Inches(4.1)).table
tbl.columns[0].width=Inches(1.7); tbl.columns[1].width=Inches(4.7)
rows=[('Giá trị','Nội dung'),('**Học tập**','Học sinh **thực hành** thay vì chỉ đọc; có giải thích ngay sau mỗi lựa chọn'),
 ('**Đời sống**','Rèn thói quen: không đọc **OTP**, kiểm tra **tên miền**, dùng mật khẩu riêng'),
 ('**Khoa học**','Mô hình đo **tách nhận thức và hành vi**, 3 thời điểm, có bộ mã hóa dữ liệu dùng lại được'),
 ('**Quyền riêng tư**','Mô hình nghiên cứu với học sinh **không thu danh tính**')]
for i,(a,b) in enumerate(rows):
    for j,t in enumerate((a,b)):
        c=tbl.cell(i,j); c.fill.solid(); c.fill.fore_color.rgb=NAVY if i==0 else (WHITE if i%2 else LIGHT)
        c.vertical_anchor=MSO_ANCHOR.MIDDLE; c.margin_left=c.margin_right=Inches(0.1)
        runs(c.text_frame.paragraphs[0],t,18,WHITE if i==0 else INK,bold=(i==0)); c.text_frame.word_wrap=True
rect(s,7.3,1.4,5.45,2.2,fill=LIGHT); sec(s,7.4,1.43,5.2,'KẾT LUẬN')
tb(s,7.4,1.9,5.25,1.7,['Đã xây dựng **công cụ thực hành và đo lường** hoàn chỉnh, đạt toàn bộ kiểm thử.','Học sinh **cần học nhưng chưa tự tin**; giáo viên **cần học liệu hỗ trợ**.','**Hiệu quả học tập chưa được kiểm chứng.**'],size=15,space=3,bullet=True)
rect(s,7.3,3.75,5.45,1.75,fill=LIGHT); sec(s,7.4,3.78,5.2,'HƯỚNG PHÁT TRIỂN')
tb(s,7.4,4.23,5.25,1.25,['Thu dữ liệu **trước – sau – 28 ngày**, phân tích bằng kiểm định phi tham số.','Bộ câu hỏi **song song**; nhân rộng sang **lớp và trường khác**, có nhóm đối chứng.'],size=15,space=3,bullet=True)
rect(s,0.6,5.9,12.15,1.2,fill=NAVY)
tb(s,0.8,5.9,11.75,1.2,'Học để nhận ra, thực hành để nhớ, đo lường để biết có tiến bộ.',size=28,color=WHITE,bold=True,align=PP_ALIGN.CENTER,anchor=MSO_ANCHOR.MIDDLE)

cp=prs.core_properties; cp.title='Poster'; cp.author=''; cp.last_modified_by=''; cp.subject=''; cp.keywords=''; cp.comments=''
prs.save('poster.pptx'); print(len(prs.slides.__iter__.__self__._sldIdLst),'slides')
