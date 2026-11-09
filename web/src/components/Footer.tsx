/** Thông tin đề tài và tác giả, hiển thị ở mọi màn hình. */
export default function Footer() {
  return (
    <footer className="site-footer" aria-labelledby="footer-title">
      <div className="footer-inner">
        <h2 id="footer-title" className="footer-title">Thông tin đề tài</h2>

        <div className="footer-grid">
          <section className="footer-block">
            <h3>Học sinh thực hiện</h3>
            <ol className="footer-list">
              <li>Trần Cảnh Phúc</li>
              <li>Cù Hoàng Linh Trúc</li>
            </ol>
            <p><span className="footer-label">Lớp:</span> 9/1</p>
            <p><span className="footer-label">Trường:</span> THCS Hoàng Sa, phân hiệu Lý Tự Trọng</p>
          </section>

          <section className="footer-block">
            <h3>Giáo viên hướng dẫn</h3>
            <p>Thầy/Cô: <strong>Hoàng Thị Bảo Oanh</strong></p>
          </section>

          <section className="footer-block footer-wide">
            <h3>Hướng dẫn sử dụng</h3>
            <ul className="footer-list footer-steps">
              <li>Kích hoạt thẻ mã do giáo viên phát, hoặc đăng nhập bằng mã học sinh đã kích hoạt.</li>
              <li>Làm khảo sát đầu vào trước, rồi lần lượt thực hiện các hoạt động.</li>
              <li>Mọi thắc mắc về nội dung đề tài, xin liên hệ giáo viên hướng dẫn.</li>
            </ul>
          </section>
        </div>

        <p className="footer-note">© Đề tài nghiên cứu khoa học học sinh · An Toàn Số Học Đường</p>
      </div>
    </footer>
  );
}
