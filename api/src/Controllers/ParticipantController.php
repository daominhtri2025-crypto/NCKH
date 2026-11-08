<?php

declare(strict_types=1);

namespace AnToanSo\Controllers;

use AnToanSo\Http\Request;
use AnToanSo\Http\Response;
use AnToanSo\Services\ParticipantService;
use AnToanSo\Support\Container;

final class ParticipantController
{
    /** POST /api/participants — đăng ký mới sau khi đồng ý tham gia. */
    public function register(Request $request): Response
    {
        $result = Container::participants()->register($request->json());
        return Response::json([
            'participant' => ParticipantService::publicView($result['participant']),
            'message' => 'Hãy ghi lại mã học sinh của em. Mã này dùng để đăng nhập lại.',
        ], 201)->withHeader('Set-Cookie: ' . ParticipantService::sessionCookie($result['token'], $request->isHttps()));
    }

    /** POST /api/session — đăng nhập bằng mã học sinh. */
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
