<?php

declare(strict_types=1);

namespace AnToanSo\Http;

final class Response
{
    /** @var list<string> */
    private array $headers = [];

    /** Nội dung thô (ví dụ CSV). Khi khác null, send() không mã hóa JSON. */
    private ?string $raw = null;
    private string $contentType = 'application/json; charset=utf-8';

    /** @param array<string,mixed> $body */
    public function __construct(public readonly int $status, public readonly array $body)
    {
    }

    /** @param array<string,mixed> $body */
    public static function json(array $body, int $status = 200): self
    {
        return new self($status, $body);
    }

    /** Tệp đính kèm dạng CSV (có BOM UTF-8 để Excel đọc đúng tiếng Việt). */
    public static function csv(string $content, string $filename, int $status = 200): self
    {
        $response = new self($status, []);
        $response->raw = "\xEF\xBB\xBF" . $content;
        $response->contentType = 'text/csv; charset=utf-8';
        return $response->withHeader('Content-Disposition: attachment; filename="' . $filename . '"');
    }

    public function withHeader(string $line): self
    {
        $this->headers[] = $line;
        return $this;
    }

    /** @return list<string> */
    public function headers(): array
    {
        return $this->headers;
    }

    public function rawBody(): ?string
    {
        return $this->raw;
    }

    public function send(): void
    {
        http_response_code($this->status);
        header('Content-Type: ' . $this->contentType);
        header('X-Content-Type-Options: nosniff');
        header('Cache-Control: no-store');
        foreach ($this->headers as $line) {
            header($line, false);
        }
        if ($this->raw !== null) {
            echo $this->raw;
            return;
        }
        echo json_encode($this->body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
}
