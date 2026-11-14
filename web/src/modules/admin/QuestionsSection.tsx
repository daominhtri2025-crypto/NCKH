import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '../../lib/api';
import Icon from '../../components/icons';
import Modal from '../../components/Modal';
import { Alert, Badge, Button, Card, Field, PageTitle, TextInput, cx, inputClass } from '../../components/ui';

interface Question {
  id: string;
  instrument: 'knowledge' | 'behavior';
  topic: string;
  question: string;
  options?: string[];
  correct?: number;
  reverse?: boolean;
}

interface VersionInfo {
  version: string;
  created_at: string;
  active: boolean;
  items: number;
}

interface QuestionSet {
  version: string;
  title: string;
  behavior_scale: string[];
  items: Question[];
  versions: VersionInfo[];
  note: string;
}

interface QuestionForm {
  id: string;
  instrument: 'knowledge' | 'behavior';
  topic: string;
  question: string;
  options: string[];
  correct: number;
  reverse: boolean;
}

const EMPTY_FORM: QuestionForm = {
  id: '', instrument: 'knowledge', topic: 'm1', question: '', options: ['', '', '', ''], correct: 0, reverse: false,
};

type Dialog = { mode: 'add' } | { mode: 'edit'; item: Question };

/** Quản lý bộ câu hỏi khảo sát. Mỗi thay đổi tạo phiên bản mới; máy chủ kiểm tra cuối cùng. */
export default function QuestionsSection() {
  const [questions, setQuestions] = useState<QuestionSet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [form, setForm] = useState<QuestionForm>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Question | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setQuestions(await api.get<QuestionSet>('/admin/questions'));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Không tải được câu hỏi.');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function openAdd() {
    setFormError(null);
    setForm(EMPTY_FORM);
    setDialog({ mode: 'add' });
  }

  function openEdit(item: Question) {
    setFormError(null);
    setForm({
      id: item.id,
      instrument: item.instrument,
      topic: item.topic,
      question: item.question,
      options: item.options ?? ['', '', '', ''],
      correct: item.correct ?? 0,
      reverse: item.reverse ?? false,
    });
    setDialog({ mode: 'edit', item });
  }

  /** Gửi biểu mẫu. Giao diện chỉ gửi đúng trường của từng loại câu. */
  async function save() {
    setFormError(null);
    const body: Record<string, unknown> = { topic: form.topic.trim(), question: form.question.trim() };
    if (dialog?.mode === 'add') {
      body.id = form.id.trim();
      body.instrument = form.instrument;
    }
    if (form.instrument === 'knowledge') {
      body.options = form.options.map((o) => o.trim()).filter((o) => o !== '');
      body.correct = form.correct;
    } else {
      body.reverse = form.reverse;
    }
    setBusy(true);
    try {
      if (dialog?.mode === 'add') {
        await api.post('/admin/questions', body);
      } else if (dialog?.mode === 'edit') {
        const { id: _ignored, instrument: _kind, ...patch } = body;
        await api.put(`/admin/questions/${encodeURIComponent(dialog.item.id)}`, patch);
      }
      setDialog(null);
      await load();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Không lưu được câu hỏi.');
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setBusy(true);
    setError(null);
    try {
      await api.delete(`/admin/questions/${encodeURIComponent(toDelete.id)}`);
      setToDelete(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Thao tác không thành công.');
      setToDelete(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <PageTitle
        title={questions ? questions.title : 'Bộ câu hỏi khảo sát'}
        subtitle={
          questions ? (
            <>Phiên bản hiện hành: <code className="font-mono font-bold">{questions.version}</code>. Mỗi thay đổi tạo một phiên bản mới; học sinh đã làm dở giữ phiên bản cũ nên dữ liệu đã thu thập vẫn so sánh được.</>
          ) : undefined
        }
        actions={<Button variant="primary" icon="plus" onClick={openAdd} disabled={!questions || busy}>Thêm câu hỏi</Button>}
      />

      {error && <Alert>{error}</Alert>}
      {!questions && !error && <p className="py-16 text-center text-ink-soft">Đang tải câu hỏi…</p>}

      {questions && (
        <>
          {questions.note && <Card className="p-4 text-sm text-ink-soft">{questions.note}</Card>}

          {(['knowledge', 'behavior'] as const).map((kind) => {
            const rows = questions.items.filter((i) => i.instrument === kind);
            return (
              <section key={kind} aria-label={kind === 'knowledge' ? 'Câu kiến thức' : 'Câu hành vi'} className="grid grid-cols-1 gap-3">
                <h2 className="m-0 flex items-center gap-2 text-lg font-extrabold text-ink">
                  {kind === 'knowledge' ? 'Kiến thức' : 'Hành vi'} <Badge tone="brand">{rows.length} câu</Badge>
                </h2>
                <ul className="m-0 grid grid-cols-1 list-none gap-3 p-0">
                  {rows.map((i) => (
                    <li key={i.id}>
                      <Card className="flex flex-col gap-3 p-4 transition hover:shadow-pop sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="mb-1.5 flex flex-wrap items-center gap-2">
                            <code className="rounded-md bg-brand-soft px-2 py-0.5 font-mono text-sm font-bold text-brand">{i.id}</code>
                            <Badge>{i.topic.toUpperCase()}</Badge>
                            {i.reverse && <Badge tone="warn">Đảo chiều</Badge>}
                          </div>
                          <p className="m-0 font-medium text-ink">{i.question}</p>
                          {i.options && (
                            <ul className="mt-2 mb-0 grid grid-cols-1 list-none gap-1 p-0 text-sm">
                              {i.options.map((o, idx) => (
                                <li key={idx} className={cx('flex items-start gap-2', i.correct === idx ? 'font-semibold text-ok' : 'text-ink-soft')}>
                                  <span className="mt-0.5 shrink-0">{i.correct === idx ? <Icon name="circleCheck" size={16} /> : <span className="inline-block size-4 rounded-full border border-line" />}</span>
                                  {o}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="flex shrink-0 gap-1.5">
                          <Button size="sm" icon="edit" disabled={busy} onClick={() => openEdit(i)}>Sửa</Button>
                          <Button size="sm" variant="danger" icon="trash" disabled={busy} onClick={() => setToDelete(i)}>Xóa</Button>
                        </div>
                      </Card>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}

          <Card className="p-5">
            <details>
              <summary className="cursor-pointer text-sm font-semibold text-brand">Lịch sử phiên bản ({questions.versions.length})</summary>
              <ul className="mt-3 mb-0 grid grid-cols-1 list-none gap-1.5 p-0 text-sm text-ink-soft">
                {questions.versions.map((v) => (
                  <li key={v.version}>
                    <code className="font-mono font-bold text-ink">{v.version}</code> · {v.items} câu · {v.created_at}
                    {v.active && <Badge tone="ok" className="ml-2">hiện hành</Badge>}
                  </li>
                ))}
              </ul>
            </details>
          </Card>
        </>
      )}

      {dialog && (
        <Modal
          title={dialog.mode === 'add' ? 'Thêm câu hỏi' : `Sửa câu ${dialog.item.id}`}
          confirmLabel={dialog.mode === 'add' ? 'Thêm' : 'Lưu thay đổi'}
          busy={busy}
          onConfirm={save}
          onCancel={() => setDialog(null)}
        >
          <form className="grid grid-cols-1 gap-3" onSubmit={(e) => { e.preventDefault(); void save(); }}>
            {dialog.mode === 'add' ? (
              <>
                <Field label="Mã câu" hint="Chữ thường, số, gạch ngang.">
                  <TextInput value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} required maxLength={60} />
                </Field>
                <Field label="Loại câu">
                  <select className={inputClass} value={form.instrument} onChange={(e) => setForm({ ...form, instrument: e.target.value as 'knowledge' | 'behavior' })}>
                    <option value="knowledge">Kiến thức (có đáp án đúng)</option>
                    <option value="behavior">Hành vi (thang 1-4)</option>
                  </select>
                </Field>
              </>
            ) : (
              <p className="m-0 text-sm text-ink-soft">Mã và loại câu không đổi được sau khi tạo.</p>
            )}
            <Field label="Chủ đề" hint="m1, m2, m3 hoặc chủ đề khác.">
              <TextInput value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} required maxLength={20} />
            </Field>
            <Field label="Nội dung câu hỏi">
              <textarea className={inputClass} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required maxLength={400} rows={3} />
            </Field>
            {form.instrument === 'knowledge' ? (
              <fieldset className="m-0 grid grid-cols-1 gap-2 border-0 p-0">
                <legend className="mb-1 text-sm font-semibold text-ink">Lựa chọn (2 đến 4, chọn đáp án đúng)</legend>
                {form.options.map((o, idx) => (
                  <label key={idx} className="flex items-center gap-2.5">
                    <input type="radio" name="correct" checked={form.correct === idx} onChange={() => setForm({ ...form, correct: idx })} className="size-5 shrink-0 accent-[var(--brand)]" />
                    <TextInput
                      aria-label={`Lựa chọn ${idx + 1}`}
                      value={o}
                      maxLength={200}
                      onChange={(e) => {
                        const next = [...form.options];
                        next[idx] = e.target.value;
                        setForm({ ...form, options: next });
                      }}
                    />
                  </label>
                ))}
              </fieldset>
            ) : (
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-3">
                <input type="checkbox" checked={form.reverse} onChange={(e) => setForm({ ...form, reverse: e.target.checked })} className="mt-0.5 size-5 shrink-0 accent-[var(--brand)]" />
                <span className="text-sm font-semibold text-ink">Câu đảo chiều (điểm được tính 5 trừ mức trả lời)</span>
              </label>
            )}
            {formError && <Alert>{formError}</Alert>}
          </form>
        </Modal>
      )}

      {toDelete && (
        <Modal title="Xóa câu hỏi?" confirmLabel="Xóa" danger busy={busy} onConfirm={confirmDelete} onCancel={() => setToDelete(null)}>
          <p className="m-0">Câu <code className="font-mono font-bold">{toDelete.id}</code> sẽ bị bỏ khỏi phiên bản hiện hành. Các phiên bản cũ và dữ liệu đã thu thập vẫn được giữ.</p>
        </Modal>
      )}
    </div>
  );
}
