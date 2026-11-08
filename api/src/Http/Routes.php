<?php

declare(strict_types=1);

namespace AnToanSo\Http;

use AnToanSo\Controllers\Module1Controller;
use AnToanSo\Controllers\Module2Controller;
use AnToanSo\Controllers\ParticipantController;

/**
 * Bảng định tuyến của toàn bộ API. Các module mới được thêm vào đây.
 */
final class Routes
{
    public static function build(): Router
    {
        $router = new Router();

        $router->add('GET', '/health', static fn (Request $r) => Response::json(['ok' => true]));

        $participants = new ParticipantController();
        $router->add('POST', '/participants', [$participants, 'register']);
        $router->add('POST', '/session', [$participants, 'login']);
        $router->add('DELETE', '/session', [$participants, 'logout']);
        $router->add('GET', '/me', [$participants, 'me']);

        $module1 = new Module1Controller();
        $router->add('GET', '/module1', [$module1, 'overview']);
        $router->add('GET', '/module1/scenarios/{id}', [$module1, 'show']);
        $router->add('POST', '/module1/scenarios/{id}/answer', [$module1, 'answer']);

        $module2 = new Module2Controller();
        $router->add('GET', '/module2', [$module2, 'overview']);
        $router->add('POST', '/module2/items/{id}/answer', [$module2, 'answer']);

        return $router;
    }
}
