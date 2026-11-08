import { useMemo, useState } from 'react';
import { analyzePassword, bestBand, type StrengthBand } from './passwordStrength';

interface Props {
  /** Chỉ nhận mức đạt tốt nhất, KHÔNG nhận mật khẩu. */
  onComplete: (band: StrengthBand) => Promise<void>;
  completed: boolean;
}

const BAND_LABEL: Record<StrengthBand, string> = {
  weak: 'Yếu',
  fair: 'Trung bình',
  strong: 'Mạnh',
};

const MIN_TESTS = 3;

/**
 * Phòng thí nghiệm mật khẩu. TOÀN BỘ tính toán diễn ra trên trình duyệt.
 * Mật khẩu chỉ nằm trong state của component, không được gửi, lưu localStorage, hay ghi log.
 * Máy chủ chỉ nhận mức đạt tốt nhất (weak/fair/strong) khi học sinh hoàn thành phòng thí nghiệm.
 */
export default function PasswordLab({ onComplete, completed }: Props) {
  const [value, setValue] = useState('');
  const [reveal, setReveal] = useState(false);
  const [tests, setTests] = useState(0);
  const [best, setBest] = useState<StrengthBand | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(completed);
  const [error, setError] = useState<string | null>(null);

  const analysis = useMemo(() => (value.length > 0 ? analyzePassword(value) : null), [value]);

  function runTest() {
    if (!analysis) return;
    setTests((n) => n + 1);
    setBest((prev) => bestBand(prev, analysis.band));
  }

  async function finish() {
    if (best === null) return;
    setSubmitting(true);
    setError(null);
    try {
      await onComplete(best);
      setDone(true);
    } catch {
      setError('Không gửi được kết quả. Em thử lại sau nhé.');
    } finally {
      setSubmitting(false);
    }
  }

  const meterPercent = analysis
    ? Math.min(100, Math.round((analysis.effectiveEntropyBits / 60) * 100))
    : 0;

  return (
    <section className="lab">
      <div className="card privacy-note">
        <strong>🔒 Quyền riêng tư:</strong> mật khẩu em nhập chỉ được kiểm tra trên chính máy này.
        Không có mật khẩu nào được gửi đi hay lưu lại. Em có thể thử mật khẩu mẫu, không cần dùng mật khẩu thật.
      </div>

      <div className="card">
        <label className="field">
          <span>Nhập một mật khẩu mẫu để thử</span>
          <div className="pw-row">
            <input
              type={reveal ? 'text' : 'password'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoComplete="new-password"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              aria-describedby="pw-hint"
              placeholder="Ví dụ: ten-mon-yeu-thich-2030"
            />
            <button type="button" className="btn" onClick={() => setReveal((r) => !r)} aria-pressed={reveal}>
              {reveal ? 'Ẩn' : 'Hiện'}
            </button>
          </div>
        </label>
        <p id="pw-hint" className="small muted">Mẹo: hãy thử mật khẩu mẫu, không dùng mật khẩu thật của em.</p>

        {analysis && (
          <div className="meter-block" aria-live="polite">
            <div className={`meter band-${analysis.band}`}>
              <div className="meter-fill" style={{ width: `${meterPercent}%` }} />
            </div>
            <p className="meter-label">
              Mức: <strong>{BAND_LABEL[analysis.band]}</strong> · Entropy ước lượng sau khi trừ mẫu quen thuộc:{' '}
              <strong>{analysis.effectiveEntropyBits} bit</strong>
            </p>

            <dl className="facts">
              <div><dt>Độ dài</dt><dd>{analysis.length} ký tự</dd></div>
              <div><dt>Bảng ký tự</dt><dd>{analysis.poolSize}</dd></div>
              <div><dt>Entropy lý thuyết</dt><dd>{analysis.rawEntropyBits} bit</dd></div>
              <div><dt>Bẻ khóa (mô phỏng, băm nhanh)</dt><dd>{analysis.crackTime.offlineFastHash}</dd></div>
              <div><dt>Bẻ khóa (mô phỏng, trực tuyến có giới hạn)</dt><dd>{analysis.crackTime.onlineThrottled}</dd></div>
              <div><dt>Phổ biến trong danh sách mẫu</dt><dd>{analysis.isCommon ? 'Có' : 'Không'}</dd></div>
            </dl>

            <ul className="reasons">
              {analysis.reasons.map((r) => <li key={r}>{r}</li>)}
            </ul>

            <button type="button" className="btn btn-primary" onClick={runTest}>
              Ghi kết quả lần thử này
            </button>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Tiến trình thí nghiệm</h3>
        <p className="small">
          Đã thử <strong>{tests}</strong> mật khẩu mẫu. Mức cao nhất đạt được:{' '}
          <strong>{best ? BAND_LABEL[best] : 'chưa có'}</strong>.
        </p>
        <p className="small muted">Cần thử ít nhất {MIN_TESTS} mật khẩu để hoàn thành thí nghiệm.</p>

        {done ? (
          <p className="alert-ok" role="status">✅ Em đã hoàn thành phòng thí nghiệm này.</p>
        ) : (
          <button
            type="button"
            className="btn btn-primary btn-xl"
            onClick={finish}
            disabled={tests < MIN_TESTS || best === null || submitting}
          >
            {submitting ? 'Đang ghi nhận…' : 'Hoàn thành phòng thí nghiệm'}
          </button>
        )}
        {error && <p className="alert" role="alert">{error}</p>}
        <p className="small muted">Mức gửi lên máy chủ: {best ? BAND_LABEL[best] : '—'} (không kèm mật khẩu).</p>
      </div>
    </section>
  );
}
