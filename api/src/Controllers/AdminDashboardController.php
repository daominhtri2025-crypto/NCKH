<?php

declare(strict_types=1);

namespace AnToanSo\Controllers;

use AnToanSo\Http\Request;
use AnToanSo\Http\Response;
use AnToanSo\Services\SurveyAdminService;
use AnToanSo\Support\Container;
use AnToanSo\Support\HttpException;

/**
 * API quản trị dành cho tài khoản role = 'admin'.
 * Mọi hàm đều xác thực phiên giáo viên rồi kiểm tra role; sai quyền trả 403, chưa đăng nhập trả 401.
 */
final class AdminDashboardController
{
    /** GET /api/admin/teachers */
    public function listTeachers(Request $request): Response
    {
        $actor = $this->actor($request);
        return Response::json(['teachers' => Container::teachers()->adminListTeachers($actor)]);
    }

    /** POST /api/admin/teachers  body: {username, class_code, role} */
    public function createTeacher(Request $request): Response
    {
        $actor = $this->actor($request);
        $body = $request->json();
        $password = Container::teachers()->adminCreateTeacher(
            $actor,
            $body['username'] ?? null,
            $body['class_code'] ?? null,
            $body['role'] ?? 'teacher',
        );
        return $this->secret(['username' => strtolower(trim((string) $body['username'])), 'password' => $password], 201);
    }

    /** PUT /api/admin/teachers/{username}/password */
    public function resetPassword(Request $request, array $params): Response
    {
        $actor = $this->actor($request);
        $password = Container::teachers()->adminResetPassword($actor, (string) $params['username']);
        return $this->secret(['username' => strtolower((string) $params['username']), 'password' => $password]);
    }

    /** PUT /api/admin/teachers/{username}/status  body: {disabled: bool} */
    public function setStatus(Request $request, array $params): Response
    {
        $actor = $this->actor($request);
        $disabled = $request->json()['disabled'] ?? null;
        if (!is_bool($disabled)) {
            throw new HttpException(422, 'Trường disabled phải là true hoặc false.');
        }
        Container::teachers()->adminSetDisabled($actor, (string) $params['username'], $disabled);
        return Response::json(['username' => strtolower((string) $params['username']), 'disabled' => $disabled]);
    }

    /** GET /api/admin/questions */
    public function questions(Request $request): Response
    {
        $actor = $this->actor($request);
        return Response::json((new SurveyAdminService())->view($actor));
    }

    /** POST /api/admin/questions  body: {id, instrument, topic, question, options?, correct? | reverse?} */
    public function addQuestion(Request $request): Response
    {
        $actor = $this->actor($request);
        return Response::json((new SurveyAdminService())->addItem($actor, $request->json()), 201);
    }

    /** PUT /api/admin/questions/{id}  body: các trường cần sửa */
    public function updateQuestion(Request $request, array $params): Response
    {
        $actor = $this->actor($request);
        return Response::json((new SurveyAdminService())->updateItem($actor, (string) $params['id'], $request->json()));
    }

    /** DELETE /api/admin/questions/{id} */
    public function deleteQuestion(Request $request, array $params): Response
    {
        $actor = $this->actor($request);
        return Response::json((new SurveyAdminService())->deleteItem($actor, (string) $params['id']));
    }

    /** @return array<string,mixed> */
    private function actor(Request $request): array
    {
        $actor = Container::teachers()->authenticate($request);
        Container::teachers()->requireAdmin($actor);
        return $actor;
    }

    /** Mật khẩu chỉ được trả về một lần: không lưu cache trung gian. */
    private function secret(array $payload, int $status = 200): Response
    {
        return Response::json($payload, $status)->withHeader('Cache-Control: no-store');
    }
}
