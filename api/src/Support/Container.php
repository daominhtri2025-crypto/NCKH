<?php

declare(strict_types=1);

namespace AnToanSo\Support;

use AnToanSo\Repositories\AssessmentRepository;
use AnToanSo\Repositories\ClassRepository;
use AnToanSo\Repositories\EventRepository;
use AnToanSo\Repositories\ParticipantRepository;
use AnToanSo\Services\AssessmentCatalog;
use AnToanSo\Services\AssessmentExportService;
use AnToanSo\Services\AssessmentService;
use AnToanSo\Services\ChecklistCatalog;
use AnToanSo\Services\DomainCatalog;
use AnToanSo\Services\Module1Service;
use AnToanSo\Services\Module2Service;
use AnToanSo\Services\Module3Service;
use AnToanSo\Services\TeacherService;
use AnToanSo\Repositories\TeacherRepository;
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

    public static function module2(): Module2Service
    {
        return self::$instances['module2'] ??= new Module2Service(
            new DomainCatalog(dirname(__DIR__, 2) . '/content/module2_domains.json'),
            new EventRepository(),
        );
    }

    public static function module3(): Module3Service
    {
        return self::$instances['module3'] ??= new Module3Service(
            new ChecklistCatalog(dirname(__DIR__, 2) . '/content/module3_checklist.json'),
            new EventRepository(),
        );
    }

    public static function assessments(): AssessmentService
    {
        return self::$instances['assessments'] ??= new AssessmentService(
            self::assessmentCatalog(),
            new AssessmentRepository(),
            self::module1(),
            self::module2(),
            self::module3(),
        );
    }

    public static function exporter(): AssessmentExportService
    {
        return self::$instances['exporter'] ??= new AssessmentExportService(self::assessmentCatalog());
    }

    private static function assessmentCatalog(): AssessmentCatalog
    {
        return self::$instances['assessmentCatalog'] ??= new AssessmentCatalog(
            dirname(__DIR__, 2) . '/content/assessment_items.json'
        );
    }

    public static function teachers(): TeacherService
    {
        return self::$instances['teachers'] ??= new TeacherService(new TeacherRepository());
    }

    public static function reset(): void
    {
        self::$instances = [];
    }
}
