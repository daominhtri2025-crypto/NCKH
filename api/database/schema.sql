-- =====================================================================
-- An Toàn Số Học Đường — Lược đồ MySQL 8.0 / MariaDB 10.6+ (InnoDB, utf8mb4)
-- Dữ liệu nghiên cứu được ẩn danh: không lưu họ tên, email hay số điện thoại học sinh.
-- =====================================================================

-- Lớp học do giáo viên đăng ký (bin/add_class.php).
CREATE TABLE IF NOT EXISTS classes (
  code        VARCHAR(40)  NOT NULL,
  name        VARCHAR(120) NOT NULL,
  school      VARCHAR(120) NOT NULL,
  created_at  DATETIME     NOT NULL,
  PRIMARY KEY (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Người tham gia nghiên cứu. Thẻ mã do nhóm kỹ thuật in theo lô (bin/issue_cards.php), trạng thái 'issued'.
-- Học sinh kích hoạt thẻ bằng cách nhập mã và đồng ý tham gia: trạng thái 'active', có consent và token.
-- token_hash là SHA-256 của cookie phiên; token gốc không bao giờ được lưu.
CREATE TABLE IF NOT EXISTS participants (
  id              BIGINT       NOT NULL AUTO_INCREMENT,
  code            CHAR(9)      NOT NULL,
  class_code      VARCHAR(40)  NOT NULL,
  status          ENUM('issued','active') NOT NULL,
  token_hash      CHAR(64)     NULL,
  consent_version VARCHAR(20)  NULL,
  consented_at    DATETIME     NULL,
  created_at      DATETIME     NOT NULL,
  claimed_at      DATETIME     NULL,
  last_seen_at    DATETIME     NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_participants_code (code),
  UNIQUE KEY uq_participants_token (token_hash),
  KEY idx_participants_class (class_code),
  CONSTRAINT fk_participants_class FOREIGN KEY (class_code) REFERENCES classes (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tài khoản giáo viên: chỉ xem tiến độ của lớp được gán, không xem câu trả lời.
-- Tài khoản do nhóm kỹ thuật tạo (bin/create_teacher.php). Không lưu họ tên giáo viên.
CREATE TABLE IF NOT EXISTS teachers (
  id            BIGINT       NOT NULL AUTO_INCREMENT,
  username      VARCHAR(60)  NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  class_code    VARCHAR(40)  NOT NULL,
  token_hash    CHAR(64)     NULL,
  created_at    DATETIME     NOT NULL,
  last_login_at DATETIME     NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_teachers_username (username),
  UNIQUE KEY uq_teachers_token (token_hash),
  CONSTRAINT fk_teachers_class FOREIGN KEY (class_code) REFERENCES classes (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Mọi lần trả lời tình huống đều được ghi lại (kể cả lần thử lại).
-- Điểm nghiên cứu chỉ tính trên attempt_no = 1 (lần trả lời đầu tiên).
CREATE TABLE IF NOT EXISTS module_events (
  id              BIGINT       NOT NULL AUTO_INCREMENT,
  participant_id  BIGINT       NOT NULL,
  module          TINYINT      NOT NULL,
  item_id         VARCHAR(60)  NOT NULL,
  attempt_no      SMALLINT     NOT NULL,
  choice_index    TINYINT      NOT NULL,
  is_safe         TINYINT(1)   NOT NULL,
  response_ms     INT          NULL,
  -- Module 2: học sinh có mở "Đọc từ phải sang trái" trước khi phân loại hay không (NULL với module khác).
  hint_used       TINYINT(1)   NULL,
  -- is_safe nghĩa là "trả lời đúng" với Module 2 (phân loại đúng tên miền).
  content_version VARCHAR(20)  NOT NULL,
  created_at      DATETIME     NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_events_attempt (participant_id, item_id, attempt_no),
  KEY idx_events_module (participant_id, module),
  CONSTRAINT fk_events_participant FOREIGN KEY (participant_id) REFERENCES participants (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Khảo sát tự báo cáo theo giai đoạn: pre (trước can thiệp), post (sau 3 module), delayed (theo dõi sau 4-6 tuần).
-- instrument = knowledge: is_correct có giá trị, answer_index là lựa chọn (0-based).
-- instrument = behavior: answer_value là mức 1-4, is_correct = NULL.
CREATE TABLE IF NOT EXISTS assessments_self (
  id              BIGINT       NOT NULL AUTO_INCREMENT,
  participant_id  BIGINT       NOT NULL,
  phase           ENUM('pre','post','delayed') NOT NULL,
  item_id         VARCHAR(60)  NOT NULL,
  instrument      ENUM('knowledge','behavior') NOT NULL,
  answer_index    TINYINT      NULL,
  answer_value    TINYINT      NULL,
  is_correct      TINYINT(1)   NULL,
  response_ms     INT          NULL,
  content_version VARCHAR(20)  NOT NULL,
  created_at      DATETIME     NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_assessment_item (participant_id, phase, item_id),
  KEY idx_assessment_phase (participant_id, phase),
  CONSTRAINT fk_assessment_participant FOREIGN KEY (participant_id) REFERENCES participants (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
