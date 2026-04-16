# BUNKAI.go

> **English description follows Japanese.**

因数分解の「型」を極めるための、ゲーム感覚で学べるWeb＆モバイル対応トレーニングアプリケーションです。中学生から高校生まで、それぞれの習熟度に合わせた最適なトレーニング環境を提供します。

## 🎯 アプリの目的
因数分解は直感力とパターン認識（型を見抜く力）が鍵になります。本アプリは、紙とペンに縛られず、すき間時間で「因数分解の型に気づくスピード」を圧倒的に向上させるために開発しました。

## ✨ 主な機能と学習カテゴリ

### 📚 4つの学習カテゴリ
1. **🔰 中学復習 (基本の2次式)**
   「足して真ん中、掛けて右端」の基本パズル。基礎を固めます。
2. **⚔️ たすきがけ (標準の2次式)**
   高校数学の壁。「たすきがけ」の試行錯誤をシミュレートしながらマスターできます。
3. **🔥 数学Ⅱ (3次式の公式)**
   (A±B)³ や A³±B³ の公式の「形」を見抜く特訓を行います。
4. **🌟 因数定理 (高次方程式)**
   f(a)=0 となる a の値を見つけ、3次以上の式を次々と分解していく実践的なトレーニングです。

### 🎮 多彩なゲームモード
*   **📖 やり方を学ぶ（導入モード）:** アニメーション付きで因数分解の仕組みをステップバイステップで解説します。
*   **♾️ 練習モード:** 自分のペースで問題を解き続けます。
*   **⏱️ タイムアタック:** 10問正解するまでの最速タイムを競います。
*   **❤️ サバイバル:** 3つのライフを守りながら、ステージを進めていく緊張感のあるモード。
*   **🔥 スコアアタック:** 60秒間でどれだけスコアを稼げるか挑戦！コンボでスコアが倍増します。

---

## 🚀 更新履歴 / Update Log

### v1.1.0 
**【UI/UX Improvements】**
*   **練習モード用 手動/自動判定の切り替え:** 練習モードではデフォルトで手動採点（「判定する」ボタンを押すまで待機）となり、見直しができるようになりました。また、「☑ 自動採点」スイッチをオンにすると、即時判定モード（サクサク進行）に切り替わります。
*   **ゲームモードのスピード特化:** タイムアタックやサバイバル等のゲームモードは、常に「全枠入力で即時判定」される仕様に統一しました。
*   **「型の選び直し」機能の追加:** 問題画面から、いつでも「◀ 型を選び直す」ボタンでパターンの選び直し（戻る）ができるようになりました。

### v1.0.0
*   BUNKAI.go 初期βバージョン リリース
*   4つのカテゴリ＋5つのゲームモードの基本実装とUI構築

---

<br>

# BUNKAI.go (English)

A gamified web and mobile training application designed to help you master the "patterns" of factorization. It provides tailored training environments suited for everyone, from junior high to high school students.

## 🎯 App Objective
Intuition and pattern recognition are key to mastering factorization. This app was developed to drastically improve your "speed in recognizing factorization patterns" during your spare time, without being tied down to paper and pens.

## ✨ Core Features & Learning Categories

### 📚 4 Learning Categories
1. **🔰 Junior High Review (Basic Quadratics)**
   The basic "sum to the middle, multiply to the end" puzzle to solidify your foundation.
2. **⚔️ Tasukigake (Standard Quadratics)**
   Master the "cross-multiplication method" by simulating the trial-and-error process. 
3. **🔥 Math II (Cubic Formulas)**
   Train to spot the shapes of standard cubic formulas like (A±B)³ and A³±B³.
4. **🌟 Factor Theorem (Higher-degree Equations)**
   Practical training to find values of 'a' where f(a)=0 and sequentially factorize polynomials of degree 3 and higher.

### 🎮 Diverse Game Modes
*   **📖 Learn the Basics (Intro Mode):** Step-by-step animated tutorials explaining the mechanics of factorization.
*   **♾️ Practice Mode:** Solve problems at your own pace at an endless rate.
*   **⏱️ Time Attack:** Compete for the fastest time to correctly answer 10 questions.
*   **❤️ Survival:** A tense mode where you must clear stages while protecting your 3 lives.
*   **🔥 Score Attack:** Challenge yourself to earn the highest score within 60 seconds! Chain combos to multiply your points.

---

## 🚀 Update Log

### v1.1.0 (Latest Release)
**[UI/UX Improvements based on Beta Feedback]**
*   **Manual/Auto Evaluation Toggle for Practice Mode:** Practice mode now evaluates manually by default (waiting until you press the "Judge" button), giving you time to double-check your work. You can switch to instant-evaluation by simply toggling the "Auto Eval" switch.
*   **Speed Optimized Game Modes:** All game modes (Time Attack, Survival, Score Attack) are now locked to instant-evaluation the moment all boxes are filled, ensuring maximum immersion and flow.
*   **"Reselect Pattern" Button:** Added a handy "◀ Reselect Pattern" button in the problem view, allowing users to safely backtrack and choose a different factorization template.

### v1.0.0
*   Initial Beta Release of BUNKAI.go
*   Implemented 4 categories, 5 game modes, and the core UI system.

---

## 🛠 Tech Stack
*   HTML5 / CSS3 (Vanilla)
*   JavaScript (ES6+)
*   KaTeX (Math equation rendering)
*   canvas-confetti (Visual effects)
