<?php

declare(strict_types=1);

namespace AnToanSo\Controllers;

use AnToanSo\Http\Request;
use AnToanSo\Http\Response;
use AnToanSo\Support\Container;

final class Module1Controller
{
    /** GET /api/module1 */
    public function overview(Request $request): Response
    {
        $participant = Container::participants()->authenticate($request);
        return Response::json(Container::module1()->overview($participant));
    }

    /** GET /api/module1/scenarios/{id} */
    public function show(Request $request, array $params): Response
    {
        Container::participants()->authenticate($request);
        return Response::json(Container::module1()->show($params['id']));
    }

    /** POST /api/module1/scenarios/{id}/answer  body: {choice_index, response_ms?} */
    public function answer(Request $request, array $params): Response
    {
        $participant = Container::participants()->authenticate($request);
        $body = $request->json();
        $result = Container::module1()->answer(
            $participant,
            $params['id'],
            $body['choice_index'] ?? null,
            $body['response_ms'] ?? null,
        );
        return Response::json($result, 201);
    }
}
