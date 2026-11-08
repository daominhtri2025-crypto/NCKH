<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

use AnToanSo\Http\Request;
use AnToanSo\Http\Routes;

Routes::build()->handle(Request::fromGlobals())->send();
