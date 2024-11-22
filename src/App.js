import { useState } from "react";
import openai from "./lib/openai";
import Markdown from "react-markdown";

// 精度をあげるためのプロンプト
const instruction = `
#命令文

あなたは様々なジャンルの歌詞を手掛けている有名な作詞家です。

以下の#条件に従って歌詞を作成してください。
`;

const conditions = `
#条件

・出力は下記に示す#出力 の通りに生成する。

・歌詞は下記に示す#入力 の通りに生成する。
`;

const outputFormat = `
#出力
【タイトル】

【歌詞】

━━━１番━━━
[Intro] (イントロ)
[Verse] (Ａメロ)
[Bridge] (Ｂメロ)
[Chorus] (サビ)
━━━２番━━━
[Verse] (Ａメロ)
[Bridge] (Ｂメロ)
[Chorus] (サビ)
━━━３番━━━
[Bridge] (Ｃメロ) または [Solo] (ソロ)
[Chorus] (サビ)
[Outro] (アウトロ)
`;

function App() {
  // APIの結果を受け取る
  const [content, setContent] = useState("");
  const [genre, setGenre] = useState("ワークアウト、EDM、BGM"); // ジャンルのデフォルト値
  const [target, setTarget] = useState("全年代"); // ターゲットのデフォルト値
  const [mood, setMood] = useState("激しめ、ノリが良い"); // 曲の雰囲気のデフォルト値
  const [lyricsContent, setLyricsContent] = useState("筋トレが捗るような曲調"); // 歌詞の内容のデフォルト値
  const [keywords, setKeywords] = useState(""); // 含めて欲しい単語の状態
  const [language, setLanguage] = useState("英語"); // 言語のデフォルト値
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 作成ボタンを押した処理
  const review = async () => {
    setIsLoading(true);
    const messages = [
      {
        role: "user",
        content: `${instruction}
        ${conditions}
        ${outputFormat}
        #入力
        ・ジャンル：${genre}
        ・ターゲット層：${target}
        ・曲及び歌詞の雰囲気：${mood}
        ・歌詞の内容：${lyricsContent}
        ・歌詞に含めて欲しい単語：${keywords}
        ・言語：${language}
        ${content}`,
      },
    ];
    const result = await openai.completion(messages);
    setResult(result);
    setIsLoading(false);
  };

  // 結果をクリップボードにコピーする関数
  const copyToClipboard = () => {
    navigator.clipboard.writeText(result).then(() => {
      alert("結果がクリップボードにコピーされました！");
    });
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center">
      <header className="flex w-full max-w-5xl justify-between items-center py-4 px-6">
        <h1 className="text-2xl font-bold text-blue-900">
          Youtube Video Parts Create
        </h1>
      </header>
      <main className="flex w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden h-[70vh]">
        <div className="flex flex-col w-1/2 h-full bg-gray-900 p-4 overflow-y-auto">
          <div className="flex-1 text-white">
            <label className="mt-2 text-green-300">ジャンル</label>
            <input
              type="text"
              value={genre} // デフォルト値を設定
              onChange={(e) => setGenre(e.target.value)}
              className="mt-1 p-2 w-full bg-transparent text-white border-b border-white"
            />
            <label className="mt-4 text-green-300">ターゲット層</label>
            <input
              type="text"
              value={target} // デフォルト値を設定
              onChange={(e) => setTarget(e.target.value)}
              className="mt-1 p-2 w-full bg-transparent text-white border-b border-white"
            />
            <label className="mt-4 text-green-300">曲の雰囲気</label>
            <input
              type="text"
              value={mood} // デフォルト値を設定
              onChange={(e) => setMood(e.target.value)}
              className="mt-1 p-2 w-full bg-transparent text-white border-b border-white"
            />
            <label className="mt-4 text-green-300">歌詞の内容</label>
            <input
              type="text"
              value={lyricsContent} // デフォルト値を設定
              onChange={(e) => setLyricsContent(e.target.value)}
              className="mt-1 p-2 w-full bg-transparent text-white border-b border-white"
            />
            <label className="mt-4 text-green-300">含めて欲しい単語</label>
            <input
              type="text"
              value={keywords} // デフォルト値を設定
              onChange={(e) => setKeywords(e.target.value)}
              className="mt-1 p-2 w-full bg-transparent text-white border-b border-white"
            />
            <label className="mt-4 text-green-300">言語</label>
            <input
              type="text"
              value={language} // デフォルト値を設定
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-1 p-2 w-full bg-transparent text-white border-b border-white"
            />
          </div>
          <textarea
            onChange={(e) => {
              setContent(e.target.value);
            }}
            className="h-24 w-full bg-transparent text-white resize-none outline-none mt-4"
            placeholder="必要なら追加情報を入力してください"
          />
          <button
            onClick={review}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? "作成中..." : "作成する"}
          </button>
        </div>
        <div className="flex flex-col w-1/2 h-full items-center justify-center">
          <div className="p-4 overflow-y-auto w-full relative">
            {isLoading ? (
              "作成中..."
            ) : (
              <>
                <Markdown className="markdown">{result}</Markdown>
                {result && (
                  <button
                    onClick={copyToClipboard}
                    className="absolute top-4 right-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
                  >
                    結果をコピー
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
