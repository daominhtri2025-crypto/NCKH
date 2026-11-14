import { PROJECT } from '../lib/project';

/** Thông tin đề tài và tác giả, hiển thị ở các màn hình của học sinh. */
export default function Footer() {
  return (
    <footer className="mt-12 border-t border-line bg-surface no-print" aria-labelledby="footer-title">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h2 id="footer-title" className="m-0 text-sm font-bold tracking-wider text-ink-soft uppercase">
          Thông tin đề tài
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-6 text-sm text-ink-soft sm:grid-cols-3">
          <section>
            <h3 className="m-0 mb-1.5 text-sm font-bold text-ink">Học sinh thực hiện</h3>
            <ol className="m-0 list-none space-y-0.5 p-0">
              {PROJECT.students.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ol>
            <p className="mt-2 mb-0">
              <span className="font-semibold text-ink">Lớp:</span> {PROJECT.grade}
            </p>
            <p className="m-0">
              <span className="font-semibold text-ink">Trường:</span> {PROJECT.school}
            </p>
          </section>

          <section>
            <h3 className="m-0 mb-1.5 text-sm font-bold text-ink">Giáo viên hướng dẫn</h3>
            <p className="m-0">
              Thầy/Cô: <strong className="text-ink">{PROJECT.advisor}</strong>
            </p>
          </section>

          <section>
            <h3 className="m-0 mb-1.5 text-sm font-bold text-ink">Hướng dẫn sử dụng</h3>
            <ul className="m-0 list-disc space-y-1 pl-5">
              <li>Kích hoạt thẻ mã do giáo viên phát, hoặc đăng nhập bằng mã học sinh đã kích hoạt.</li>
              <li>Làm khảo sát đầu vào trước, rồi lần lượt thực hiện các hoạt động.</li>
              <li>Mọi thắc mắc về đề tài, xin liên hệ giáo viên hướng dẫn.</li>
            </ul>
          </section>
        </div>

        <p className="mt-6 mb-0 border-t border-line pt-4 text-xs text-ink-soft">
          © Đề tài nghiên cứu khoa học học sinh · {PROJECT.name}
        </p>
      </div>
    </footer>
  );
}
