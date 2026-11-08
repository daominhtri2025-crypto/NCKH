<?php

declare(strict_types=1);

namespace AnToanSo\Controllers;

use AnToanSo\Http\Request;
use AnToanSo\Http\Response;
use AnToanSo\Support\Container;

final class Module2Controller
{
    /** GET /api/module2 */
    public function overview(Request $request): Response
    {
        $participant = Container::participants()->authenticate($request);
        return Response::json(Container::module2()->overview($participant));
    }

    /** POST /api/module2/items/{id}/answer  body: {verdict: "official"|"fake", response_ms?, hint_used?} */
    public function answer(Request $request, array $params): Response
    {
        $participant = Container::participants()->authenticate($request);
        $body = $request->json();
        $result = Container::module2()->answer(
            $participant,
            $params['id'],
            $body['verdict'] ?? null,
            $body['response_ms'] ?? null,
            $body['hint_used'] ?? null,
        );
        return Response::json($result, 201);
    }
}
