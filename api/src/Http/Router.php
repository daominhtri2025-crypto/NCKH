<?php

declare(strict_types=1);

namespace AnToanSo\Http;

use AnToanSo\Support\HttpException;
use Closure;
use Throwable;

/**
 * Bộ định tuyến tối giản: khớp mẫu đường dẫn có tham số dạng {tên}.
 */
final class Router
{
    /** @var list<array{method:string,regex:string,handler:callable}> */
    private array $routes = [];

    public function add(string $method, string $pattern, callable $handler): void
    {
        $regex = '#^' . preg_replace('#\{([a-zA-Z_][a-zA-Z0-9_]*)\}#', '(?P<$1>[^/]+)', $pattern) . '$#';
        $this->routes[] = ['method' => strtoupper($method), 'regex' => $regex, 'handler' => $handler];
    }

    public function handle(Request $request): Response
    {
        try {
            return $this->dispatch($request);
        } catch (HttpException $e) {
            return Response::json(['error' => $e->getMessage()], $e->status);
        } catch (Throwable $e) {
            error_log((string) $e);
            return Response::json(['error' => 'Lỗi máy chủ. Vui lòng thử lại sau.'], 500);
        }
    }

    private function dispatch(Request $request): Response
    {
        Security::guard($request);

        $pathMatched = false;
        foreach ($this->routes as $route) {
            if (!preg_match($route['regex'], $request->path, $matches)) {
                continue;
            }
            $pathMatched = true;
            if ($route['method'] !== $request->method) {
                continue;
            }
            $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
            $result = ($route['handler'])($request, $params);
            if (!$result instanceof Response) {
                throw new \LogicException('Handler phải trả về Response.');
            }
            return $result;
        }

        throw new HttpException($pathMatched ? 405 : 404, $pathMatched ? 'Phương thức không được hỗ trợ.' : 'Không tìm thấy đường dẫn.');
    }
}
