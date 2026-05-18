<?php

namespace App\Http\Controllers;

use App\Models\Postcode;
use App\Models\Prefecture;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostcodeController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        $code = $request->input('postcode', '');

        // Remove non-digit characters
        $code = preg_replace('/\D/', '', $code);

        if (empty($code)) {
            return response()->json(['error' => 'Postcode is required.'], 422);
        }

        // ゼロ埋め対応: ユーザー入力を複数パターンで検索
        // 例: "0600000" → そのまま / "600000"(先頭ゼロ除去) / "0600000"(7桁ゼロ埋め)
        $postcode = Postcode::where('postcode', $code)->first();

        if (!$postcode) {
            // 先頭ゼロを除去して検索（DB側がゼロなしの場合）
            $stripped = ltrim($code, '0');
            if ($stripped !== $code && !empty($stripped)) {
                $postcode = Postcode::where('postcode', $stripped)->first();
            }
        }

        if (!$postcode) {
            // 7桁にゼロ埋めして検索（ユーザーがゼロを省略した場合）
            $padded = str_pad($code, 7, '0', STR_PAD_LEFT);
            if ($padded !== $code) {
                $postcode = Postcode::where('postcode', $padded)->first();
            }
        }

        if (!$postcode) {
            // 後方一致で検索（最終手段）
            $stripped = ltrim($code, '0');
            if (!empty($stripped)) {
                $postcode = Postcode::where('postcode', 'like', "%{$stripped}")->first();
            }
        }

        if (!$postcode) {
            return response()->json(['error' => 'Postcode not found.'], 404);
        }

        // Find matching prefecture by name
        $prefecture = Prefecture::where('display_name', $postcode->prefecture)->first();

        return response()->json([
            'prefecture_id' => $prefecture?->id,
            'prefecture_name' => $postcode->prefecture,
            'city' => $postcode->city,
            'local' => $postcode->local,
        ]);
    }
}
