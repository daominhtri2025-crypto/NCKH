<?php

declare(strict_types=1);

namespace AnToanSo\Controllers;

use AnToanSo\Http\Request;
use AnToanSo\Http\Response;
use AnToanSo\Support\Container;

final class Module3Controller
{
    /** GET /api/module3 */
    public function overview(Request $request): Response
    {
        $participant = Container::participants()->authenticate($request);
        Container::assessments()->assertPreDone($participant);
        return Response::json(Container::module3()->overview($participant));
    }

    /** POST /api/module3/steps/{id}/complete  body: {quiz_choice, practiced, response_ms?} */
    public function completeStep(Request $request, array $params): Response
    {
        $participant = Container::participants()->authenticate($request);
        Container::assessments()->assertPreDone($participant);
        $body = $request->json();
        $result = Container::module3()->completeStep(
            $participant,
            $params['id'],
            $body['quiz_choice'] ?? null,
            $body['practiced'] ?? null,
            $body['response_ms'] ?? null,
        );
        return Response::json($result, 201);
    }

    /** POST /api/module3/lab  body: {best_band: "weak"|"fair"|"strong"} — không nhận mật khẩu. */
    public function lab(Request $request): Response
    {
        $participant = Container::participants()->authenticate($request);
        Container::assessments()->assertPreDone($participant);
        $body = $request->json();
        if (array_key_exists('password', $body)) {
            // Chặn cứng: không bao giờ chấp nhận mật khẩu trên máy chủ, kể cả do nhầm lẫn khi phát triển.
            return Response::json(['error' => 'Máy chủ không nhận mật khẩu.'], 422);
        }
        return Response::json(Container::module3()->recordLab($participant, $body['best_band'] ?? null), 201);
    }
}
