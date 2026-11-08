<?php

declare(strict_types=1);

namespace AnToanSo\Controllers;

use AnToanSo\Http\Request;
use AnToanSo\Http\Response;
use AnToanSo\Support\Container;

final class AssessmentController
{
    /** GET /api/assessments — trạng thái các giai đoạn và các module đã hoàn thành. */
    public function status(Request $request): Response
    {
        $participant = Container::participants()->authenticate($request);
        return Response::json(Container::assessments()->status($participant));
    }

    /** GET /api/assessments/{phase} */
    public function show(Request $request, array $params): Response
    {
        $participant = Container::participants()->authenticate($request);
        return Response::json(Container::assessments()->phaseView($participant, $params['phase']));
    }

    /** POST /api/assessments/{phase}/items/{id}/answer  body: {answer_index | answer_value, response_ms?} */
    public function answer(Request $request, array $params): Response
    {
        $participant = Container::participants()->authenticate($request);
        $body = $request->json();
        $result = Container::assessments()->answer(
            $participant,
            $params['phase'],
            $params['id'],
            $body['answer_index'] ?? null,
            $body['answer_value'] ?? null,
            $body['response_ms'] ?? null,
        );
        return Response::json($result, 201);
    }
}
