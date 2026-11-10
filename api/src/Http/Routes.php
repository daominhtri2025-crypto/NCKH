<?php

declare(strict_types=1);

namespace AnToanSo\Http;

use AnToanSo\Controllers\AdminController;
use AnToanSo\Controllers\AdminDashboardController;
use AnToanSo\Controllers\AssessmentController;
use AnToanSo\Controllers\Module1Controller;
use AnToanSo\Controllers\Module2Controller;
use AnToanSo\Controllers\Module3Controller;
use AnToanSo\Controllers\ParticipantController;
use AnToanSo\Controllers\TeacherController;

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
        $router->add('POST', '/participants/claim', [$participants, 'claim']);
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

        $module3 = new Module3Controller();
        $router->add('GET', '/module3', [$module3, 'overview']);
        $router->add('POST', '/module3/steps/{id}/complete', [$module3, 'completeStep']);
        $router->add('POST', '/module3/lab', [$module3, 'lab']);

        $assessment = new AssessmentController();
        $router->add('GET', '/assessments', [$assessment, 'status']);
        $router->add('GET', '/assessments/{phase}', [$assessment, 'show']);
        $router->add('POST', '/assessments/{phase}/items/{id}/answer', [$assessment, 'answer']);

        $teacher = new TeacherController();
        $router->add('POST', '/teacher/session', [$teacher, 'login']);
        $router->add('DELETE', '/teacher/session', [$teacher, 'logout']);
        $router->add('GET', '/teacher/roster', [$teacher, 'roster']);
        $router->add('POST', '/teacher/cards', [$teacher, 'issueCards']);
        $router->add('POST', '/teacher/students/{code}/reissue', [$teacher, 'reissue']);

        $admin = new AdminController();
        $router->add('GET', '/admin/export/long.csv', [$admin, 'exportLong']);
        $router->add('GET', '/admin/export/wide.csv', [$admin, 'exportWide']);

        $dash = new AdminDashboardController();
        $router->add('GET', '/admin/teachers', [$dash, 'listTeachers']);
        $router->add('POST', '/admin/teachers', [$dash, 'createTeacher']);
        $router->add('PUT', '/admin/teachers/{username}/password', [$dash, 'resetPassword']);
        $router->add('PUT', '/admin/teachers/{username}/status', [$dash, 'setStatus']);
        $router->add('GET', '/admin/questions', [$dash, 'questions']);

        return $router;
    }
}
