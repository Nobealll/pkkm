<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Illuminate\Database\QueryException;
use Illuminate\Auth\AuthenticationException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });

        // Handle API exceptions
        $this->renderable(function (Throwable $e, $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return $this->handleApiException($e);
            }
        });
    }

    /**
     * Handle API exceptions with consistent JSON responses
     *
     * @param Throwable $exception
     * @return \Illuminate\Http\JsonResponse
     */
    protected function handleApiException(Throwable $exception)
    {
        // Validation Exception
        if ($exception instanceof ValidationException) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $exception->errors()
            ], 422);
        }

        // Model Not Found Exception
        if ($exception instanceof ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak ditemukan',
                'error' => 'Resource yang Anda cari tidak tersedia'
            ], 404);
        }

        // Not Found Exception (404)
        if ($exception instanceof NotFoundHttpException) {
            return response()->json([
                'success' => false,
                'message' => 'Endpoint tidak ditemukan',
                'error' => 'URL yang Anda akses tidak tersedia'
            ], 404);
        }

        // Method Not Allowed Exception
        if ($exception instanceof MethodNotAllowedHttpException) {
            return response()->json([
                'success' => false,
                'message' => 'Method tidak diizinkan',
                'error' => 'HTTP method yang Anda gunakan tidak diizinkan untuk endpoint ini'
            ], 405);
        }

        // Database Query Exception
        if ($exception instanceof QueryException) {
            return response()->json([
                'success' => false,
                'message' => 'Database error',
                'error' => config('app.debug') 
                    ? $exception->getMessage() 
                    : 'Terjadi kesalahan pada database'
            ], 500);
        }

        // Authentication Exception
        if ($exception instanceof AuthenticationException) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
                'error' => 'Anda harus login untuk mengakses resource ini'
            ], 401);
        }

        // Default Exception
        return response()->json([
            'success' => false,
            'message' => 'Terjadi kesalahan pada server',
            'error' => config('app.debug') 
                ? $exception->getMessage() 
                : 'Internal Server Error'
        ], 500);
    }
}
