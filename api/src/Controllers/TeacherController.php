<?php

declare(strict_types=1);

namespace AnToanSo\Controllers;

use AnToanSo\Http\Request;
use AnToanSo\Http\Response;
use AnToanSo\Services\TeacherService;
use AnToanSo\Support\Container;

final class TeacherController
{
    /** POST /api/teacher/session */
    public function login(Request $request): Response
    {
        $result = Container::teachers()->login($request->json());
        $cookie = sprintf('%s=%s; Path=/; Max-Age=%d; HttpOnly; SameSite=Lax%s',
            TeacherService::COOKIE, $result['token'], TeacherService::MAX_AGE, $request->isHttps() ? '; Secure' : '');
        return Response::json(['teacher' => $result['teacher']])->withHeader('Set-Cookie: ' . $cookie);
    }

    /** DELETE /api/teacher/session */
    public function logout(Request $request): Response
    {
        Container::teachers()->logout($request);
        return Response::json(['ok' => true])
            ->withHeader('Set-Cookie: ' . TeacherService::COOKIE . '=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax');
    }

    /** GET /api/teacher/roster */
    public function roster(Request $request): Response
    {
        $teacher = Container::teachers()->authenticate($request);
        return Response::json(Container::teachers()->roster($teacher));
    }
}
