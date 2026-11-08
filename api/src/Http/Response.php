<?php

declare(strict_types=1);

namespace AnToanSo\Http;

final class Response
{
    /** @var list<string> */
    private array $headers = [];

    /** @param array<string,mixed> $body */
    public function __construct(public readonly int $status, public readonly array $body)
    {
    }

    /** @param array<string,mixed> $body */
    public static function json(array $body, int $status = 200): self
    {
        return new self($status, $body);
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

    public function send(): void
    {
        http_response_code($this->status);
        header('Content-Type: application/json; charset=utf-8');
        header('X-Content-Type-Options: nosniff');
        header('Cache-Control: no-store');
        foreach ($this->headers as $line) {
            header($line, false);
        }
        echo json_encode($this->body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
}
