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

    /** POST /api/teacher/cards  body: {count} — tạo thẻ mới cho lớp của giáo viên. */
    public function issueCards(Request $request): Response
    {
        $teacher = Container::teachers()->authenticate($request);
        $body = $request->json();
        $count = $body['count'] ?? null;
        if (!is_int($count)) {
            return Response::json(['error' => 'Số thẻ phải là số nguyên.'], 422);
        }
        $codes = Container::teachers()->issueCardsForTeacher($teacher, $count);
        return Response::json([
            'class_code' => $teacher['class_code'],
            'codes' => $codes,
            'note' => 'Thẻ mới dùng cho học sinh tham gia mới hoặc học sinh quên mã. Tiến độ cũ không chuyển sang thẻ mới.',
        ], 201);
    }

    /** POST /api/teacher/students/{code}/reissue — cấp lại thẻ cho học sinh của lớp mình (giữ tiến độ). */
    public function reissue(Request $request, array $params): Response
    {
        $teacher = Container::teachers()->authenticate($request);
        $newCode = Container::participants()->reissueCard(
            $params['code'],
            Container::teachers()->requireClass($teacher),
            'teacher',
            (int) $teacher['id'],
            $request->json()['ledger_confirmed'] ?? null,
        );
        return Response::json([
            'new_code' => $newCode,
            'note' => 'Mã cũ đã mất hiệu lực. Tiến độ của học sinh được giữ nguyên. Học sinh đăng nhập lại bằng mã mới.',
        ]);
    }
}
