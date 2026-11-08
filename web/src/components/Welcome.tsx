interface Props {
  onNewParticipant: () => void;
  onHaveCode: () => void;
}

export default function Welcome({ onNewParticipant, onHaveCode }: Props) {
  return (
    <section className="card welcome">
      <p className="eyebrow">Dự án nghiên cứu khoa học học đường</p>
      <h1>Chào em, hãy cùng học cách giữ an toàn khi dùng điện thoại!</h1>
      <p className="lead">
        Em sẽ gặp các tình huống giống thật: cuộc gọi lạ, tin nhắn trúng thưởng, đường link đáng ngờ.
        Em chọn cách xử lý, nhận giải thích ngay và rút ra bài học cho mình.
      </p>

      <div className="stack">
        <button className="btn btn-primary btn-xl" onClick={onNewParticipant}>
          Em chưa có mã học sinh
        </button>
        <button className="btn btn-ghost btn-xl" onClick={onHaveCode}>
          Em đã có mã, đăng nhập
        </button>
      </div>

      <p className="fineprint">
        Chương trình chỉ dành cho học sinh tham gia nghiên cứu có phụ huynh và nhà trường đồng ý.
      </p>
    </section>
  );
}
