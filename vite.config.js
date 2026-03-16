import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import Anthropic from '@anthropic-ai/sdk'

export default defineConfig(({ mode }) => {
  // .env ファイルの読み込み（VITE_ プレフィックス不要のキーも読む）
  const env = loadEnv(mode, process.cwd(), '')

  return {
    server: {
      host: true,
    },
    plugins: [
      react(),

      // ─── Claude Vision API ミドルウェア ─────────────────────────────
      {
        name: 'anthropic-screenshot-api',
        configureServer(server) {
          server.middlewares.use('/api/analyze-screenshot', async (req, res, next) => {
            if (req.method !== 'POST') return next()

            let body = ''
            req.on('data', (chunk) => { body += chunk })
            req.on('end', async () => {
              try {
                const { imageBase64, mediaType, apiKey: bodyApiKey } = JSON.parse(body)
                // .env の環境変数 → リクエストボディ の順で API キーを探す
                const apiKey = process.env.ANTHROPIC_API_KEY || env.ANTHROPIC_API_KEY || bodyApiKey

                if (!apiKey) {
                  res.statusCode = 500
                  res.setHeader('Content-Type', 'application/json')
                  return res.end(JSON.stringify({
                    ok: false,
                    error: 'NO_API_KEY',
                  }))
                }

                const client = new Anthropic({ apiKey })
                const response = await client.messages.create({
                  model: 'claude-opus-4-6',
                  max_tokens: 2048,
                  messages: [{
                    role: 'user',
                    content: [
                      {
                        type: 'image',
                        source: { type: 'base64', media_type: mediaType, data: imageBase64 },
                      },
                      {
                        type: 'text',
                        text: `このSNSアナリティクスのスクリーンショットを詳しく分析してください。TikTok・Instagram Reels・YouTube Shortsなど動画投稿の分析画面の場合は、動画パフォーマンス指標（再生数・離脱率・おすすめ率など）を特に詳しく抽出してください。

必ず以下のJSON形式のみで返答してください（マークダウンのコードブロックや追加テキストは一切不要です）：
{
  "platform": "プラットフォーム名（TikTok/Instagram/X/YouTube など）",
  "period": "分析期間（読み取れた場合）",
  "summary": "4〜5文の全体的な分析コメント。何がよかったか・悪かったかを含めて日本語で",
  "metrics": [
    {
      "name": "指標名（日本語）",
      "value": "表示値（元の表記のまま）",
      "numericValue": 数値のみ（変換できない場合は0）,
      "change": "変化量（なければ空文字）",
      "changePct": "変化率（なければ空文字）",
      "trend": "up または down または stable",
      "unit": "単位（人・回・%など）"
    }
  ],
  "videoMetrics": {
    "hasVideoData": true または false（動画指標が存在するか）,
    "playCount": "再生数（表示値、なければ空文字）",
    "followerViewRate": "フォロワーによる視聴割合（%、なければ空文字）",
    "nonFollowerViewRate": "非フォロワーによる視聴割合＝おすすめ流入率（%、なければ空文字）",
    "dropOffRate2s": "2〜3秒以内の離脱率（%、なければ空文字）",
    "completionRate": "完視聴率（%、なければ空文字）",
    "avgWatchTime": "平均視聴時間（秒・分など、なければ空文字）",
    "likeRate": "いいね率（%、なければ空文字）",
    "shareRate": "シェア率（%、なければ空文字）",
    "commentRate": "コメント率（%、なければ空文字）",
    "reachSource": "リーチ元の内訳（おすすめ/フォロワー/ハッシュタグなど、読み取れた場合）"
  },
  "performanceVerdict": {
    "rating": "good または average または poor（総合評価）",
    "goodReasons": [
      "うまくいっていた点1（具体的な数値を含めて）",
      "うまくいっていた点2"
    ],
    "badReasons": [
      "改善が必要な点1（具体的な数値を含めて）",
      "改善が必要な点2"
    ],
    "keyFactor": "パフォーマンスを最も左右した要因（1文で）"
  },
  "chartData": {
    "title": "グラフのタイトル",
    "labels": ["ラベル1", "ラベル2"],
    "values": [数値1, 数値2]
  },
  "insights": [
    "洞察1（具体的な数値を含む）",
    "洞察2",
    "洞察3"
  ],
  "recommendations": [
    "改善アクション1（具体的に。次の投稿でどうすればよいか）",
    "改善アクション2",
    "改善アクション3"
  ]
}

動画指標（再生数・離脱率・おすすめ率・完視聴率）が画像にある場合は必ず抽出してください。chartDataはグラフ・時系列データがある場合のみ。ない場合は labels と values を空配列にしてください。`,
                      },
                    ],
                  }],
                })

                const text = response.content[0].text
                // マークダウンのコードブロックを除去
                const cleaned = text
                  .replace(/^```json\s*/m, '')
                  .replace(/^```\s*/m, '')
                  .replace(/```\s*$/m, '')
                  .trim()

                const data = JSON.parse(cleaned)

                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ ok: true, data }))
              } catch (e) {
                console.error('[analyze-screenshot]', e.message)
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ ok: false, error: e.message }))
              }
            })
          })
        },
      },
    ],
  }
})
