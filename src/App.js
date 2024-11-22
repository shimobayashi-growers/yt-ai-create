import { useState } from "react";
import openai from "./lib/openai";
import Markdown from "react-markdown";

// 精度をあげるためのプロンプト
const prompt = `
#命令文

あなたは様々なジャンルの歌詞を手掛けている有名な作詞家です。

以下の#条件に従って歌詞を作成してください。

#条件

・出力は下記に示す#出力 の通りに生成する。

・歌詞は下記に示す#入力 の通りに生成する。

#入力

・ジャンル：ワークアウト、EDM、BGM

・ターゲット層：全年代

・曲及び歌詞の雰囲気：激しめ、ノリが良い

・歌詞の内容：筋トレが捗るような曲調

・言語：英語

・歌詞に含めて欲しい単語

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
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // レビューボタンを押した処理
  const review = async () => {
    setIsLoading(true);
    const messages = [
      {
        role: "user",
        content: prompt + content,
      },
    ];
    const result = await openai.completion(messages);
    setResult(result);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center">
      <header className="flex w-full max-w-5xl justify-between items-center py-4 px-6">
        <h1 className="text-2xl font-bold text-blue-900">AI Code Reviewer</h1>
      </header>
      <main className="flex w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden h-[70vh]">
        <div className="flex flex-col w-1/2 h-full bg-gray-900 overflow-y-auto">
          <div className="flex-1 p-4 text-white">
            <textarea
              onChange={(e) => {
                setContent(e.target.value);
              }}
              className="h-full w-full bg-transparent text-white resize-none outline-none"
            />
          </div>
          <button
            onClick={review}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "レビュー中..." : "レビューする"}
          </button>
        </div>
        <div className="flex flex-col w-1/2 h-full items-center justify-center">
          <div className="p-4 overflow-y-auto w-full">
            {isLoading ? (
              "レビュー中..."
            ) : (
              <Markdown className="markdown">{result}</Markdown>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
