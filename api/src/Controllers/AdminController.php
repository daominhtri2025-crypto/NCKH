<?php

declare(strict_types=1);

namespace AnToanSo\Controllers;

use AnToanSo\Http\Request;
use AnToanSo\Http\Response;
use AnToanSo\Support\Container;
use AnToanSo\Support\Env;
use AnToanSo\Support\HttpException;

/**
 * Xuất dữ liệu nghiên cứu cho giáo viên. Yêu cầu tiêu đề X-Admin-Token khớp với ADMIN_TOKEN trong .env.
 * Nếu ADMIN_TOKEN để trống, chức năng bị tắt hoàn toàn.
 */
final class AdminController
{
    /** GET /api/admin/export/long.csv */
    public function exportLong(Request $request): Response
    {
        $this->authorize($request);
        return Response::csv(Container::exporter()->longCsv(), 'antoanso_long.csv');
    }

    /** GET /api/admin/export/wide.csv */
    public function exportWide(Request $request): Response
    {
        $this->authorize($request);
        return Response::csv(Container::exporter()->wideCsv(), 'antoanso_wide.csv');
    }

    private function authorize(Request $request): void
    {
        $expected = Env::get('ADMIN_TOKEN');
        if ($expected === '') {
            throw new HttpException(503, 'Chức năng xuất dữ liệu chưa được bật trên máy chủ.');
        }
        $given = (string) $request->header('x-admin-token');
        if ($given === '' || !hash_equals($expected, $given)) {
            throw new HttpException(401, 'Token quản trị không đúng.');
        }
    }
}
