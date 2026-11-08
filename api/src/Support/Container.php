<?php

declare(strict_types=1);

namespace AnToanSo\Support;

use AnToanSo\Repositories\ClassRepository;
use AnToanSo\Repositories\EventRepository;
use AnToanSo\Repositories\ParticipantRepository;
use AnToanSo\Services\Module1Service;
use AnToanSo\Services\ParticipantService;
use AnToanSo\Services\ScenarioCatalog;

/**
 * Nơi khởi tạo dịch vụ dùng chung (thay cho khung DI, đủ cho quy mô dự án).
 */
final class Container
{
    /** @var array<string,object> */
    private static array $instances = [];

    public static function participants(): ParticipantService
    {
        return self::$instances['participants'] ??= new ParticipantService(
            new ParticipantRepository(),
            new ClassRepository(),
        );
    }

    public static function module1(): Module1Service
    {
        return self::$instances['module1'] ??= new Module1Service(
            new ScenarioCatalog(dirname(__DIR__, 2) . '/content/module1_scenarios.json'),
            new EventRepository(),
        );
    }

    public static function reset(): void
    {
        self::$instances = [];
    }
}
