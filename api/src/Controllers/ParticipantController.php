<?php

declare(strict_types=1);

namespace AnToanSo\Controllers;

use AnToanSo\Http\Request;
use AnToanSo\Http\Response;
use AnToanSo\Services\ParticipantService;
use AnToanSo\Support\Container;

final class ParticipantController
{
    /** POST /api/participants/claim — kích hoạt thẻ mã đã được phát cho lớp. */
    public function claim(Request $request): Response
    {
        $result = Container::participants()->claim($request->json());
        return Response::json([
            'participant' => ParticipantService::publicView($result['participant']),
            'message' => 'Đã kích hoạt thẻ. Hãy giữ thẻ để đăng nhập lại.',
        ], 201)->withHeader('Set-Cookie: ' . ParticipantService::sessionCookie($result['token'], $request->isHttps()));
    }

    /** POST /api/session — đăng nhập bằng mã đã kích hoạt. */
    public function login(Request $request): Response
    {
        $result = Container::participants()->login($request->json());
        return Response::json([
            'participant' => ParticipantService::publicView($result['participant']),
        ])->withHeader('Set-Cookie: ' . ParticipantService::sessionCookie($result['token'], $request->isHttps()));
    }

    /** DELETE /api/session — đăng xuất. */
    public function logout(Request $request): Response
    {
        Container::participants()->logout($request);
        return Response::json(['ok' => true])
            ->withHeader('Set-Cookie: ' . ParticipantService::clearCookie($request->isHttps()));
    }

    /** GET /api/me */
    public function me(Request $request): Response
    {
        $row = Container::participants()->authenticate($request);
        return Response::json(['participant' => ParticipantService::publicView($row)]);
    }
}
