<?php

namespace App\Http\Middleware;

use App\Http\Controllers\LocaleController;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = session("locale", $request->cookie("locale", config("app.locale", "en")));

        if (!array_key_exists($locale, LocaleController::SUPPORTED_LOCALES)) {
            $locale = config("app.locale", "en");
        }

        App::setLocale($locale);

        return $next($request);
    }
}
