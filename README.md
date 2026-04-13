# TASUKI.go ✖️

[日本語 (Japanese)](#日本語) | [English](#english)

---

<a id="日本語"></a>
## 🇯🇵 日本語

**TASUKI.go** は、高校数学で学習する「たすきがけの因数分解 ($ax^2 + bx + c$) 」を、ゲーム感覚で直感的にマスターするための教育用Webアプリケーションです。生徒が「試行錯誤」の過程をポジティブに楽しめるように設計されています。

### ✨ 主な機能

*   📖 **やり方を学ぶ (インタラクティブ・チュートリアル)**
    - アニメーション付きでたすきがけの仕組みを視覚化します。
    - わざと間違えた例（符号ミス、数値ミスなど）と、そのリカバリー方法も実践形式で学べます。
*   ♾️ **練習モード (無限)**
    - 自分のペースでひたすら問題を解くモードです。難易度は3段階（Basic / Standard / Advanced）から選べます。
*   ⏱️ **タイムアタック**
    - 10問を解ききるまでのタイムを競うモードです。クリアするとS〜Cのランクが表示されます。
*   ❤️ **サバイバル**
    - ライフ（HP）3の状態で、ミスが許されない緊張感を味わいながらどこまで進めるかを競います。ステージ進行で難易度も上がります。
*   🔥 **スコアアタック**
    - 制限時間60秒以内にできるだけ多くのスコアを稼ぎます。連続正解でコンボボーナスが発生します！
*   ⚡ **オートチェック機能**
    - 4つの枠すべてに数字を入力した瞬間に自動で判定を行うため、テンポ良くプレイできます（ミスした後は修正できるように手動判定に切り替わります）。

### 🚀 使い方

特別なサーバーや環境構築は不要です。
リポジトリ内の `index.html` をブラウザで直接開くか、GitHub Pages などでホスティングするだけで、スマートフォンやPCからすぐに利用できます。

### 🛠️ 使用技術
- HTML5 / CSS3 / Vanilla JavaScript
- [KaTeX](https://katex.org/) (美しい数式レンダリングのため)
- [canvas-confetti](https://github.com/catdad/canvas-confetti) (正解時の紙吹雪演出のため)

**Author:** Toshiki Kamiya @ Shizuoka Salesio

---

<a id="english"></a>
## 🇺🇸 English

**TASUKI.go** is a gamified web educational application designed to help high school students master the "Tasuki-gake" (criss-cross method) for factorizing quadratic equations of the form $ax^2 + bx + c$. It turns mathematical trial-and-error into an engaging puzzle game.

### ✨ Key Features

*   📖 **Interactive Tutorial**
    - Visualizes the criss-cross factorization process step-by-step with smooth animations.
    - Includes a dedicated troubleshooting section to handle common mistakes (wrong signs, incorrect factors, etc.).
*   ♾️ **Infinite Practice Mode**
    - Practice at your own pace. Automatically generates problems across three difficulty levels (Basic, Standard, Advanced).
*   ⏱️ **Time Attack**
    - Speedrun mode! Solve 10 problems as fast as possible and receive a rank based on your completion time.
*   ❤️ **Survival Mode**
    - Start with 3 HP. See how far you can go without making mistakes as the difficulty progressively increases.
*   🔥 **Score Attack**
    - A 60-second frantic mode where consecutive correct answers build up a combo multiplier for massive scores!
*   ⚡ **Auto-Check System**
    - Answers are automatically verified the moment all 4 input fields are filled, ensuring a snappy and seamless gameplay loop.

### 🚀 Usage

No build tools or backend servers are required. 
Simply open `index.html` in any modern web browser or host it directly via GitHub Pages to start playing.

### 🛠️ Tech Stack
- HTML5 / CSS3 / Vanilla JavaScript
- [KaTeX](https://katex.org/) (For high-quality math rendering)
- [canvas-confetti](https://github.com/catdad/canvas-confetti) (For rewarding particle effects)

**Author:** Toshiki Kamiya @ Shizuoka Salesio
