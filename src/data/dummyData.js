// ダミーデータ
// ─ accounts は App.jsx で localStorage 管理される「初期値」
// ─ customers も同様に平坦化して一元管理

export const initialAccounts = [
  {
    id: 1,
    name: 'アパレル用',
    handle: '@style_closet_jp',
    icon: '👗',
    color: 'from-pink-500 to-rose-500',
    bgLight: 'bg-pink-50',
    borderColor: 'border-pink-300',
    textColor: 'text-pink-600',
    badgeBg: 'bg-pink-100',
    goal: {
      monthlyRevenue: 500000,
      currentRevenue: 342000,
      monthlyDeals: 30,
    },
  },
  {
    id: 2,
    name: 'コスメ用',
    handle: '@beauty_glow_official',
    icon: '💄',
    color: 'from-purple-500 to-violet-500',
    bgLight: 'bg-purple-50',
    borderColor: 'border-purple-300',
    textColor: 'text-purple-600',
    badgeBg: 'bg-purple-100',
    goal: {
      monthlyRevenue: 300000,
      currentRevenue: 198000,
      monthlyDeals: 20,
    },
  },
  {
    id: 3,
    name: 'インテリア用',
    handle: '@home_decor_select',
    icon: '🏠',
    color: 'from-amber-500 to-orange-500',
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-600',
    badgeBg: 'bg-amber-100',
    goal: {
      monthlyRevenue: 200000,
      currentRevenue: 78000,
      monthlyDeals: 15,
    },
  },
];

export const phases = [
  {
    id: 'lead',
    label: '未接触（リード）',
    color: 'bg-slate-100 border-slate-300',
    headerColor: 'bg-slate-200',
    textColor: 'text-slate-700',
    dotColor: 'bg-slate-400',
  },
  {
    id: 'dm',
    label: 'DM対応中',
    color: 'bg-blue-50 border-blue-200',
    headerColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    dotColor: 'bg-blue-400',
  },
  {
    id: 'negotiation',
    label: '商談・提案中',
    color: 'bg-yellow-50 border-yellow-200',
    headerColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    dotColor: 'bg-yellow-400',
  },
  {
    id: 'closed',
    label: '成約（ゴール）',
    color: 'bg-green-50 border-green-200',
    headerColor: 'bg-green-100',
    textColor: 'text-green-700',
    dotColor: 'bg-green-400',
  },
];

// 全顧客を1つのフラット配列で管理（accountId で紐付け）
export const initialCustomers = [
  // ── アパレル用 (accountId: 1) ──────────────────────────────────────
  { id: 101, accountId: 1, name: 'tanaka_mika',    product: 'フラワープリントワンピース',   phase: 'lead',        amount: 12800, note: 'ストーリーでいいねあり',     date: '2026-03-10', createdBy: '管理者' },
  { id: 102, accountId: 1, name: 'yamada_yuki',    product: 'ニットカーディガン（ベージュ）', phase: 'lead',       amount: 8900,  note: 'フォロワー新規',           date: '2026-03-11', createdBy: '管理者' },
  { id: 103, accountId: 1, name: 'sato_hana',      product: 'デニムジャケット',             phase: 'dm',          amount: 15600, note: 'サイズ確認中',             date: '2026-03-09', createdBy: '管理者' },
  { id: 104, accountId: 1, name: 'ito_rina',       product: 'プリーツスカート',             phase: 'dm',          amount: 9800,  note: 'カラー変更希望',           date: '2026-03-08', createdBy: '管理者' },
  { id: 105, accountId: 1, name: 'suzuki_ai',      product: 'ロングコート（キャメル）',     phase: 'dm',          amount: 28000, note: '在庫確認待ち',             date: '2026-03-07', createdBy: '管理者' },
  { id: 106, accountId: 1, name: 'kato_nana',      product: 'レーストップス',               phase: 'negotiation', amount: 6800,  note: 'セット割提案済み',         date: '2026-03-06', createdBy: '管理者' },
  { id: 107, accountId: 1, name: 'nakamura_yui',   product: 'ニットセットアップ',           phase: 'negotiation', amount: 22000, note: '決済方法確認中',           date: '2026-03-05', createdBy: '管理者' },
  { id: 108, accountId: 1, name: 'kobayashi_mei',  product: 'フレアスカート',               phase: 'closed',      amount: 7800,  note: '発送済み',                 date: '2026-03-03', createdBy: '管理者' },
  { id: 109, accountId: 1, name: 'watanabe_emi',   product: 'シルクブラウス',               phase: 'closed',      amount: 14500, note: 'リピーター',               date: '2026-03-01', createdBy: '管理者' },
  { id: 110, accountId: 1, name: 'ikeda_riko',     product: 'チェックパンツ',               phase: 'closed',      amount: 11200, note: '口コミ投稿済み',           date: '2026-03-02', createdBy: '管理者' },

  // ── コスメ用 (accountId: 2) ──────────────────────────────────────
  { id: 201, accountId: 2, name: 'ogawa_sara',     product: 'ヒアルロン酸美容液',           phase: 'lead',        amount: 6800,  note: 'ハイライト視聴',           date: '2026-03-11', createdBy: '管理者' },
  { id: 202, accountId: 2, name: 'matsuda_kana',   product: 'BBクリームSPF50',             phase: 'lead',        amount: 3200,  note: 'タグ付けあり',             date: '2026-03-10', createdBy: '管理者' },
  { id: 203, accountId: 2, name: 'yamamoto_mio',   product: 'リップセット（3色）',          phase: 'dm',          amount: 4500,  note: 'カラーサンプル送付済み',   date: '2026-03-09', createdBy: '管理者' },
  { id: 204, accountId: 2, name: 'shimizu_aya',    product: 'クレンジングオイル',           phase: 'dm',          amount: 2800,  note: '肌質確認中',               date: '2026-03-08', createdBy: '管理者' },
  { id: 205, accountId: 2, name: 'inoue_noa',      product: 'グロウハイライター',           phase: 'negotiation', amount: 3600,  note: 'まとめ買い検討中',         date: '2026-03-07', createdBy: '管理者' },
  { id: 206, accountId: 2, name: 'kimura_saki',    product: 'スキンケアセット',             phase: 'negotiation', amount: 18000, note: 'トライアル提案済み',       date: '2026-03-06', createdBy: '管理者' },
  { id: 207, accountId: 2, name: 'hayashi_yuna',   product: 'マスカラ（ブラック）',         phase: 'closed',      amount: 2400,  note: '発送済み',                 date: '2026-03-04', createdBy: '管理者' },
  { id: 208, accountId: 2, name: 'saito_miku',     product: 'ファンデーションブラシ',       phase: 'closed',      amount: 5800,  note: '初回購入',                 date: '2026-03-02', createdBy: '管理者' },
  { id: 209, accountId: 2, name: 'tanabe_haru',    product: 'ナイトクリーム',               phase: 'closed',      amount: 8900,  note: '定期購入希望',             date: '2026-03-01', createdBy: '管理者' },

  // ── インテリア用 (accountId: 3) ──────────────────────────────────────
  { id: 301, accountId: 3, name: 'ueda_tomoko',    product: 'ウォールシェルフ（天然木）',   phase: 'lead',        amount: 12000, note: 'インテリア投稿に反応',     date: '2026-03-11', createdBy: '管理者' },
  { id: 302, accountId: 3, name: 'morita_keiko',   product: 'アロマディフューザー',         phase: 'lead',        amount: 7800,  note: 'フォロー新規',             date: '2026-03-10', createdBy: '管理者' },
  { id: 303, accountId: 3, name: 'nishimura_eri',  product: 'クッションカバーセット',       phase: 'dm',          amount: 4200,  note: 'サイズ確認中',             date: '2026-03-09', createdBy: '管理者' },
  { id: 304, accountId: 3, name: 'fujiwara_ami',   product: 'テーブルランプ（ゴールド）',   phase: 'negotiation', amount: 18500, note: '設置場所相談中',           date: '2026-03-08', createdBy: '管理者' },
  { id: 305, accountId: 3, name: 'endo_yukiko',    product: 'キャンドルセット',             phase: 'closed',      amount: 3600,  note: 'ギフト用',                 date: '2026-03-05', createdBy: '管理者' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SNS 運用管理 – 初期データ
// ─────────────────────────────────────────────────────────────────────────────

/** 投稿スケジュール */
export const initialPosts = [
  { id: 1, accountId: 1, title: 'スプリングワンピース紹介',    caption: '今季イチオシの春ワンピースが入荷しました🌸 フラワープリントがとっても可愛いです。数量限定なのでお早めに！', date: '2026-03-14', time: '18:00', status: 'scheduled', category: 'product',   createdBy: '管理者' },
  { id: 2, accountId: 1, title: '春の3way着回しコーデ提案',    caption: '1着で3通りの着こなし！買って損なしのニットカーデをご紹介します✨',                                    date: '2026-03-16', time: '12:00', status: 'draft',     category: 'styling',   createdBy: '管理者' },
  { id: 3, accountId: 1, title: 'フォロワー限定セール告知',     caption: 'フォロワーさん限定！明日から48時間限定セール開催🎉 DMでご注文ください',                                date: '2026-03-12', time: '20:00', status: 'published', category: 'campaign',  createdBy: '管理者' },
  { id: 4, accountId: 2, title: '新作ヒアルロン酸美容液レビュー', caption: '1週間使い続けた結果…肌のもちもち感が全然違う！詳しくレビューします💧',                             date: '2026-03-15', time: '19:00', status: 'scheduled', category: 'product',   createdBy: '管理者' },
  { id: 5, accountId: 2, title: '朝スキンケアルーティン5分版',  caption: '忙しい朝でもできる！5分で完結するスキンケアルーティンをご紹介🌿',                                    date: '2026-03-13', time: '21:00', status: 'published', category: 'lifestyle', createdBy: '管理者' },
  { id: 6, accountId: 3, title: '春インテリア模様替えビフォーアフター', caption: '春の気分で部屋を模様替え🌿 ウォールシェルフの飾り方も紹介します',                             date: '2026-03-17', time: '17:00', status: 'scheduled', category: 'lifestyle', createdBy: '管理者' },
];

/** ネタ帳（コンテンツアイデア） */
export const initialIdeas = [
  { id: 1, accountId: 1, title: 'ビフォーアフターコーデ',        category: 'styling',   memo: '同じ服でも小物次第で印象が変わることをリール動画で見せる',           tags: ['コーデ', '着回し'],    status: 'idea',  createdBy: '管理者' },
  { id: 2, accountId: 1, title: '購入者レビューまとめ投稿',      category: 'campaign',  memo: 'DMでいただいた感想をまとめて投稿（掲載許可取り済み）',               tags: ['口コミ', 'レビュー'],  status: 'draft', createdBy: '管理者' },
  { id: 3, accountId: 1, title: '色違い比較コンテンツ',          category: 'product',   memo: '同じシルエットで色が違う商品の比較。どちらが似合う？投票機能使用',   tags: ['カラー', '比較'],      status: 'idea',  createdBy: '管理者' },
  { id: 4, accountId: 2, title: '美容成分解説シリーズ',          category: 'product',   memo: 'ヒアルロン酸・レチノール・ナイアシンアミドをわかりやすく解説する教育系コンテンツ', tags: ['美容', '成分'],  status: 'idea',  createdBy: '管理者' },
  { id: 5, accountId: 2, title: 'やりがちNGスキンケア5選',       category: 'lifestyle', memo: '共感を得やすいネタ。洗顔後すぐ保湿しないなどあるあるを紹介',         tags: ['スキンケア', 'NG'],   status: 'draft', createdBy: '管理者' },
  { id: 6, accountId: 2, title: '季節別おすすめコスメ特集',      category: 'campaign',  memo: '春夏秋冬で4回に分けて投稿できるシリーズ企画',                         tags: ['季節', '特集'],        status: 'idea',  createdBy: '管理者' },
  { id: 7, accountId: 3, title: 'ウォールシェルフ飾り方3選',     category: 'lifestyle', memo: 'DIY感覚で楽しめる飾り方アイデア。保存数を稼ぎやすいコンテンツ',       tags: ['DIY', 'インテリア'],  status: 'done',  createdBy: '管理者' },
  { id: 8, accountId: 3, title: '1万円以下インテリア特集',        category: 'product',   memo: 'プチプラでもオシャレに見えるアイテムをまとめて紹介',                 tags: ['プチプラ', 'おすすめ'], status: 'idea', createdBy: '管理者' },
];

/** ハッシュタグセット */
export const initialHashtagSets = [
  { id: 1, accountId: 1, name: 'アパレル基本セット',  tags: ['#プチプラコーデ', '#今日のコーデ', '#ファッション好きな人と繋がりたい', '#コーデ', '#コーディネート', '#おしゃれさんと繋がりたい', '#ootd', '#fashion', '#instagood'], createdBy: '管理者' },
  { id: 2, accountId: 1, name: 'セール・キャンペーン用', tags: ['#セール', '#プライスダウン', '#期間限定', '#お得情報', '#アパレル通販', '#個人出品', '#値下げ'], createdBy: '管理者' },
  { id: 3, accountId: 2, name: 'コスメ基本セット',    tags: ['#コスメ', '#スキンケア', '#美容', '#美容好きな人と繋がりたい', '#コスメ好きな人と繋がりたい', '#skincare', '#beauty', '#メイク', '#化粧品'], createdBy: '管理者' },
  { id: 4, accountId: 2, name: 'スキンケア特化',      tags: ['#スキンケア', '#保湿', '#乾燥肌対策', '#毛穴ケア', '#美白', '#エイジングケア', '#基礎化粧品', '#美肌'], createdBy: '管理者' },
  { id: 5, accountId: 3, name: 'インテリア基本セット', tags: ['#インテリア', '#インテリア好きな人と繋がりたい', '#暮らし', '#丁寧な暮らし', '#部屋作り', '#模様替え', '#interior', '#homedecor'], createdBy: '管理者' },
];

/** フォロワー・エンゲージメント記録 */
export const initialEngagements = [
  { id: 1, accountId: 1, date: '2026-02-22', followers: 12050, likes: 360, comments: 19, notes: '' },
  { id: 2, accountId: 1, date: '2026-03-01', followers: 12200, likes: 380, comments: 22, notes: '' },
  { id: 3, accountId: 1, date: '2026-03-08', followers: 12380, likes: 420, comments: 31, notes: '春コーデが好評' },
  { id: 4, accountId: 1, date: '2026-03-12', followers: 12540, likes: 465, comments: 28, notes: 'セール告知でフォロー急増' },
  { id: 5, accountId: 2, date: '2026-02-22', followers: 8200,  likes: 270, comments: 15, notes: '' },
  { id: 6, accountId: 2, date: '2026-03-01', followers: 8400,  likes: 290, comments: 18, notes: '' },
  { id: 7, accountId: 2, date: '2026-03-08', followers: 8520,  likes: 310, comments: 24, notes: '' },
  { id: 8, accountId: 2, date: '2026-03-12', followers: 8640,  likes: 355, comments: 19, notes: 'スキンケアルーティンが好評' },
  { id: 9, accountId: 3, date: '2026-03-01', followers: 5200,  likes: 180, comments: 12, notes: '' },
  { id: 10, accountId: 3, date: '2026-03-12', followers: 5310, likes: 198, comments: 15, notes: '' },
];

/** アカウントコンセプト（ブランド戦略ドキュメント） */
export const initialConcepts = [
  {
    accountId: 1,
    target: '20〜35歳の女性。プチプラでおしゃれを楽しみたい方。毎日のコーデに悩んでいる方。',
    concept: 'プチプラでもスタイリッシュに。毎日のコーデをもっと楽しく、もっと自由に。',
    tone: 'フレンドリーで親しみやすく。難しい言葉は使わず、友達に話しかけるように。絵文字も積極的に使う。',
    pillars: ['コーデ提案', '新作・入荷情報', '着回し術', 'ビフォーアフター', 'フォロワーレビュー'],
    ngWords: '高級・ブランドとの比較、体型に関する否定的な表現、他アカウントの批判',
  },
  {
    accountId: 2,
    target: '20〜40代の美容意識が高い女性。スキンケアに悩みを持つ方。正しいケア方法を知りたい方。',
    concept: '正しいスキンケアで本来の美しさを引き出す。毎日の美容を、もっと科学的に・もっと楽しく。',
    tone: '信頼感のある専門的な言葉遣いで、でも難しすぎず。お姉さんが教えてあげるような親しみやすさ。',
    pillars: ['スキンケア成分解説', '新商品レビュー', 'ルーティン紹介', 'お悩み解決Q&A', '季節ケア'],
    ngWords: '効果の断言・誇大表現、他社商品の否定、医療的な診断に近い表現',
  },
  {
    accountId: 3,
    target: '25〜45歳の男女。インテリアにこだわりを持ちたい方。新居・模様替えを検討中の方。',
    concept: '毎日の暮らしをもっと心地よく。手軽に真似できるインテリアのアイデアを届ける。',
    tone: '落ち着いた丁寧な言葉遣い。生活の豊かさや質感を感じさせる表現。シンプルで読みやすく。',
    pillars: ['コーディネート提案', '商品紹介・レビュー', '模様替えアイデア', 'プチプラDIY', 'before/after'],
    ngWords: '',
  },
];

/** 返信・キャプションテンプレート */
export const initialTemplates = [
  { id: 1, accountId: 1, type: 'caption', title: '新作入荷告知',   content: '✨ 新作入荷しました！\n\n【商品名】が入荷しました🎉\n\n💗 カラー：\n📏 サイズ：S / M / L\n💰 価格：¥\n\nご購入はプロフィールのリンクから👆\nお気軽にDMでもどうぞ✉️\n\n#プチプラコーデ #今日のコーデ #新作', createdBy: '管理者' },
  { id: 2, accountId: 1, type: 'caption', title: 'コーデ紹介',     content: '今日のコーデ👗\n\n【アイテム説明】\n\n着回しポイントは【ポイント】！\nシンプルに見えて実はこだわりが詰まってます💕\n\n購入はプロフィールリンクから✨\n\n#今日のコーデ #コーデ #プチプラ #ootd', createdBy: '管理者' },
  { id: 3, accountId: 1, type: 'dm',      title: '価格問い合わせ返答', content: 'ご質問ありがとうございます😊\n【商品名】の価格は¥【価格】（税込）となっております。\n\nご購入をご希望の場合は、このDMにてお知らせください。\nよろしくお願いいたします✨', createdBy: '管理者' },
  { id: 4, accountId: 1, type: 'dm',      title: 'サイズ在庫確認返答', content: 'お問い合わせありがとうございます🙏\n【商品名】の在庫状況を確認いたします。\n少々お待ちください✨\n\nご希望のサイズを教えていただけますか？', createdBy: '管理者' },
  { id: 5, accountId: 2, type: 'caption', title: 'スキンケア紹介',  content: '今日のスキンケアルーティン✨\n\n💧 【手順1】\n💧 【手順2】\n💧 【手順3】\n\n【商品の特徴・こだわりポイント】\n\n使ってみたい方はプロフィールから🌿\n\n#スキンケア #美容 #skincare #保湿', createdBy: '管理者' },
  { id: 6, accountId: 2, type: 'dm',      title: '肌質相談返答',    content: 'ご相談ありがとうございます🌿\n\nお肌の状態を詳しく教えていただけますか？\n・乾燥 / 脂性 / 混合\n・気になるお悩み（毛穴・シミ・ニキビなど）\n\n状態に合わせたアイテムをご提案いたします😊', createdBy: '管理者' },
  { id: 7, accountId: 3, type: 'caption', title: 'インテリア紹介',  content: '【テーマ】のインテリアをご紹介🏠\n\n✔ 【ポイント1】\n✔ 【ポイント2】\n✔ 【ポイント3】\n\nプロフィールリンクから購入できます👆\n\n#インテリア #暮らし #丁寧な暮らし #interior', createdBy: '管理者' },
  { id: 8, accountId: 3, type: 'dm',      title: '商品問い合わせ返答', content: 'お問い合わせありがとうございます😊\n\n【商品名】についてですね。\n詳細をお伝えいたします：\n\n【商品詳細】\n\nご不明な点があればお気軽にご連絡ください✨', createdBy: '管理者' },
];
