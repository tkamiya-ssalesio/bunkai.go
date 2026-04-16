const MODES = {
    CATEGORY_SELECT: 'category_select',
    MODE_SELECT: 'mode_select',
    INTRO: 'intro',
    PRACTICE: 'practice',
    TIME_ATTACK: 'timeAttack',
    SURVIVAL: 'survival',
    SCORE_ATTACK: 'scoreAttack'
};

let currentMode = MODES.CATEGORY_SELECT;
let currentCategory = 1; // 1: Basic, 2: Standard, 3: Advanced
let currentProblem = null;
let currentSelectedPattern = '';

let isAnimating = false;
let isGameOver = false;

let practiceStreak = 0;
let taStartTime = 0;
let taTimerInterval = null;
let taQuestionsDone = 0;
let svHp = 3;
let svStage = 1;
let saScore = 0;
let saTimeLeft = 60;
let saCombo = 0;
let saTimerInterval = null;
let autoCheckEnabled = true;
let userRequestedPatternSelect = false;

// Intro States (Refactored for Basic First then Trouble)
let currentIntroStep = 1;
const introData = {
    1: [
        "中学の因数分解は、<span class='math-intro'>x^2+(a+b)x+ab</span> の形を見つけるパズルです。<br>例として <span class='math-intro'>x^2 - 2x - 8</span> を考えましょう。",
        "まず、一番右の数字（定数項）の「<span class='math-intro'>-8</span>」に注目します。<br>掛けて <span class='math-intro'>-8</span> になる2つの数のペアを探します。",
        "候補は <span class='math-intro'>(1, -8), (-1, 8), (2, -4), (-2, 4)</span> などがありますね。",
        "次に、そのペアを足した結果が真ん中の係数「<span class='math-intro'>-2</span>」になるか調べます。<br><span class='math-intro'>2 + (-4) = -2</span>！ <span class='math-intro'>(2, -4)</span> のペアが正解です！",
        "見つけたペアを、そのままカッコの中に入れます。<br><span class='math-intro'>(x + 2)(x - 4)</span> となります！",
        "これが正解です。<br>『足して真ん中、掛けて右端』を見つけるのが基本ルールです！"
    ],
    2: [
        "「たすきがけ」は、<span class='math-intro'>ax^2+bx+c</span> を因数分解するパズルです！<br>例として <span class='math-intro'>3x^2 - 10x + 8</span> を考えましょう。<br><small>※ <span class='math-intro'>x^2</span>の係数（ここでは<span class='math-intro'>3</span>）は常にプラスにしておくのがコツです。</small>",
        "まず、<span class='math-intro'>x^2</span>の係数「<span class='math-intro'>3</span>」と、定数項「<span class='math-intro'>8</span>」になるペアを探して縦に並べます。<br>今回は <span class='math-intro'>(3, 1)</span> と <span class='math-intro'>(-4, -2)</span> を並べてみます。",
        "次に、斜めに掛け算（たすきがけ）をします！<br><span class='math-intro'>3 \\times (-2) = -6</span><br><span class='math-intro'>1 \\times (-4) = -4</span>",
        "掛けた結果を足し合わせます。<br><span class='math-intro'>(-4) + (-6) = -10</span><br>真ん中の係数「<span class='math-intro'>-10</span>」と一致しました！🎉",
        "一致したら、そのまま横に読み取ってカッコに入れます。<br>上の段から <span class='math-intro'>(3x - 4)</span>、下の段から <span class='math-intro'>(x - 2)</span> となります！",
        "完成！ <span class='math-intro'>(3x - 4)(x - 2)</span> が正解です。<br>仕組みは分かりましたか？",
        "<strong>【うまくいかない時①：ペアを変える】</strong><br>例えば <span class='math-intro'>8</span> を <span class='math-intro'>(-1, -8)</span> と分けてみると、和が <span class='math-intro' style='color:var(--apple-red);'>-25</span> で不一致です。<br>このような時は、別の素因数のペアを探りましょう。",
        "<strong>【うまくいかない時②：上下を入れ替える】</strong><br><span class='math-intro'>(-2, -4)</span> と並べると、和が <span class='math-intro' style='color:var(--apple-red);'>-14</span>。<br>数字が惜しい時は、右側の上下をクルッと入れ替えてみましょう。",
        "<strong>【うまくいかない時③：符号を変える】</strong><br><span class='math-intro'>(4, 2)</span> と並べると和が <span class='math-intro' style='color:var(--apple-red);'>+10</span>。符号だけ逆ですね！<br>この場合、右側のペアの符号を両方「マイナス」に反転させます。"
    ],
    3: [
        "数学Ⅱでは、「3次式の因数分解公式」を活用します。<br>このアプリでは2種類の型が登場します。",
        "① 【和・差の3乗の型】 <span class='math-intro'>(A+B)^3 = A^3 + 3A^2B + 3AB^2 + B^3</span><br>たとえば <span class='math-intro'>8x^3 + 12x^2 + 6x + 1</span> を見たら…",
        "両端に注目！ <span class='math-intro'>8x^3</span> は <span class='math-intro'>(2x)^3</span>、<span class='math-intro'>1</span> は <span class='math-intro'>1^3</span>ですね。<br>公式に当てはめると、実は <span class='math-intro'>(2x + 1)^3</span> になります。",
        "② 【3乗の和・差の型】 <span class='math-intro'>A^3 \\pm B^3 = (A \\pm B)(A^2 \\mp AB + B^2)</span><br>たとえば <span class='math-intro'>27x^3 - 8</span> を見たら…",
        "これも両端が3乗になっています。<span class='math-intro'>(3x)^3 - 2^3</span> です。<br>公式に当てはめると <span class='math-intro'>(3x - 2)(9x^2 + 6x + 4)</span> となります！",
        "3次式は『両端が何の3乗になっているか』を見抜くのが最大のコツです！<br>さあ、公式の形を見抜く練習をしてみましょう。"
    ],
    4: [
        "高次方程式（3次や4次）の因数分解では、「因数定理」が活躍します！<br>ある数 <span class='math-intro'>a</span> を代入して式が <span class='math-intro'>0</span> になるなら、<span class='math-intro'>(x - a)</span> で割り切れます。",
        "例えば <span class='math-intro'>x^3 - 2x^2 - x + 2</span> の場合、<span class='math-intro'>x=1</span> を代入すると <span class='math-intro'>1 - 2 - 1 + 2 = 0</span> になりますね！",
        "つまり、この式は <span class='math-intro'>(x - 1)</span> を因数に持つことが分かります。<br>見つけたら、組立除法や割り算で残りの部分を計算します。",
        "残った2次式部分がさらに因数分解できる場合は、<span class='math-intro'>(x-1)(x-2)(x+1)</span> のように1次式3つになります。",
        "定数項の「約数（±の数）」を代入して <span class='math-intro'>0</span> になる数を見つけるのがカギです！<br>では、トレーニングをはじめましょう。"
    ]
};

// DOM
const categoryScreen = document.getElementById('category-screen');
const modeScreen = document.getElementById('mode-screen');
const selectedCategoryTitle = document.getElementById('selected-category-title');
const categoryBtns = document.querySelectorAll('.category-btn');
const modeBtns = document.querySelectorAll('.mode-btn');
const backToCategoryBtn = document.getElementById('back-to-category-btn');
const mainHeader = document.getElementById('main-header');
const backToTitleBtn = document.getElementById('back-to-title-btn');

const introContainer = document.getElementById('intro-container');
const problemContainer = document.getElementById('problem-container');
const statsContainer = document.getElementById('stats-container');
const promptText = document.getElementById('prompt-text');
const patternSelector = document.getElementById('pattern-selector');
const backToPatternBtn = document.getElementById('back-to-pattern-btn');

const introVisual1 = document.getElementById('intro-visual-1');
const introCat1Eq1 = document.getElementById('intro-cat1-eq1');
const introCat1Eq2 = document.getElementById('intro-cat1-eq2');

const introVisual2 = document.getElementById('intro-visual-2');

const introVisual3 = document.getElementById('intro-visual-3');
const introVisual4 = document.getElementById('intro-visual-4');
const introCat3Formula = document.getElementById('intro-cat3-formula');
const introCat3Example = document.getElementById('intro-cat3-example');
const introCat3Answer = document.getElementById('intro-cat3-answer');
const patternBtns = document.querySelectorAll('.pattern-btn');
const inputAreaStandard = document.getElementById('input-area-standard');
const inputAreaSquare = document.getElementById('input-area-square');
const inputAreaCube = document.getElementById('input-area-cube');
const inputAreaCubicSum = document.getElementById('input-area-cubic-sum');
const hintText = document.getElementById('hint-text');
const actionsContainer = document.getElementById('actions-container');
const autoCheckToggle = document.getElementById('auto-check-toggle');
const autoCheckCheckbox = document.getElementById('auto-check-checkbox');
const equationDisplay = document.getElementById('equation-display');

const introStepDesc = document.getElementById('intro-step-desc');
const introNavBtns = document.getElementById('intro-nav-btns');
const introPrevBtn = document.getElementById('intro-prev-btn');
const introNextBtn = document.getElementById('intro-next-btn');
const introTroubleBtn = document.getElementById('intro-trouble-btn');
const introPracticeBtn = document.getElementById('intro-practice-btn');
const introDotsContainer = document.getElementById('intro-dots');

const inputP = document.getElementById('input-p');
const inputQ = document.getElementById('input-q');
const inputR = document.getElementById('input-r');
const inputS = document.getElementById('input-s');
const inputsStandard = [inputP, inputQ, inputR, inputS];
const inputSqP = document.getElementById('input-sq-p');
const inputSqQ = document.getElementById('input-sq-q');
const inputsSquare = [inputSqP, inputSqQ];
const inputCbP = document.getElementById('input-cb-p');
const inputCbQ = document.getElementById('input-cb-q');
const inputsCube = [inputCbP, inputCbQ];
const inputCbsP = document.getElementById('input-cbs-p');
const inputCbsQ = document.getElementById('input-cbs-q');
const inputCbsR = document.getElementById('input-cbs-r');
const inputCbsS = document.getElementById('input-cbs-s');
const inputCbsT = document.getElementById('input-cbs-t');
const inputsCubicSum = [inputCbsP, inputCbsQ, inputCbsR, inputCbsS, inputCbsT];

const inputAreaThreeLin = document.getElementById('input-area-three-lin');
const inputAreaFourLin = document.getElementById('input-area-four-lin');
const inputAreaTwoLinOneQuad = document.getElementById('input-area-two-lin-one-quad');
const inputAreaTwoQuad = document.getElementById('input-area-two-quad');

const inputsThreeLin = [
    document.getElementById('input-3l-a'), document.getElementById('input-3l-b'),
    document.getElementById('input-3l-c'), document.getElementById('input-3l-d'),
    document.getElementById('input-3l-e'), document.getElementById('input-3l-f')
];
const inputsFourLin = [
    document.getElementById('input-4l-a'), document.getElementById('input-4l-b'),
    document.getElementById('input-4l-c'), document.getElementById('input-4l-d'),
    document.getElementById('input-4l-e'), document.getElementById('input-4l-f'),
    document.getElementById('input-4l-g'), document.getElementById('input-4l-h')
];
const inputsTwoLinOneQuad = [
    document.getElementById('input-2l1q-a'), document.getElementById('input-2l1q-b'),
    document.getElementById('input-2l1q-c'), document.getElementById('input-2l1q-d'),
    document.getElementById('input-2l1q-e'), document.getElementById('input-2l1q-f'), document.getElementById('input-2l1q-g')
];
const inputsTwoQuad = [
    document.getElementById('input-2q-a'), document.getElementById('input-2q-b'), document.getElementById('input-2q-c'),
    document.getElementById('input-2q-d'), document.getElementById('input-2q-e'), document.getElementById('input-2q-f')
];

const checkBtn = document.getElementById('check-btn');
const feedbackMessage = document.getElementById('feedback-message');

// Tutorial specific elements
const introC1 = document.getElementById('intro-c1');
const introC2 = document.getElementById('intro-c2');
const introC3 = document.getElementById('intro-c3');
const introC4 = document.getElementById('intro-c4');
const introSumVal = document.getElementById('intro-sum-val');
const introRes1 = document.getElementById('intro-res1');
const introRes2 = document.getElementById('intro-res2');

function normalizeFactor(f) {
    let lead = f.find(v => v !== 0) || 1;
    if (lead < 0) return { sign: -1, f: f.map(v => -v) };
    return { sign: 1, f: f.slice() };
}

function compareFactorSets(user, target) {
    let uSign = 1;
    let tSign = 1;
    let uNorm = user.map(f => {
        let n = normalizeFactor(f);
        uSign *= n.sign;
        return n.f;
    });
    let tNorm = target.map(f => {
        let n = normalizeFactor(f);
        tSign *= n.sign;
        return n.f;
    });
    if (uSign !== tSign) return false;
    let uStr = uNorm.map(f => f.join(',')).sort().join('|');
    let tStr = tNorm.map(f => f.join(',')).sort().join('|');
    return uStr === tStr;
}

function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    return b === 0 ? a : gcd(b, a % b);
}

function generateRandomLinear() {
    let a = Math.random() < 0.5 ? 1 : 2;
    if (Math.random() < 0.3) a = -a; // sometimes negative leading
    a = a === 0 ? 1 : a;
    let b = Math.floor(Math.random() * 7) - 3; // -3 to 3
    if (b === 0) b = 1;
    let g = gcd(a, b);
    return [a/g, b/g]; // relatively prime
}

function generateRandomQuad() {
    let a = Math.random() < 0.5 ? 1 : 2;
    let c = Math.floor(Math.random() * 5) - 2;
    if (c === 0) c = 1;
    let b = Math.floor(Math.random() * 5) - 2;
    // ensure doesn't factor easily
    while(b*b - 4*a*c >= 0) {
        c = (c > 0) ? c + 1 : c - 1;
        if(Math.abs(c) > 5) { c = 1; a = 2; b = 1; }
    }
    return [a, b, c];
}

function generateProblem() {
    let p, q, r, s, t, a, b, c;
    let valid = false;

    while (!valid) {
        if (currentCategory === 1) { // 🔰 Junior High
            p = 1; r = 1;
            q = Math.floor(Math.random() * 11) - 5;
            s = Math.floor(Math.random() * 11) - 5;
            if (q === 0 || s === 0) continue;
            a = 1; b = q + s; c = q * s;
            currentProblem = { p, q, r, s, a, b, c, degree: 2 };
            if (q === s) currentProblem.pattern = 'square';
            else currentProblem.pattern = 'standard';
            valid = true;
        } else if (currentCategory === 2) { // ⚔️ Tasukigake Standard
            let pMax = 5, qMax = 7;
            p = Math.floor(Math.random() * pMax) + 1;
            r = Math.floor(Math.random() * pMax) + 1;
            if (p === 1 && r === 1) continue; 
            const qChoices = [];
            for (let i = -qMax; i <= qMax; i++) if (i !== 0) qChoices.push(i);
            q = qChoices[Math.floor(Math.random() * qChoices.length)];
            s = qChoices[Math.floor(Math.random() * qChoices.length)];
            a = p * r;
            b = p * s + q * r;
            c = q * s;
            if (gcd(a, gcd(b, c)) === 1) {
                currentProblem = { p, q, r, s, a, b, c, degree: 2 };
                if ((p === r && q === s) || (p === -r && q === -s)) currentProblem.pattern = 'square';
                else currentProblem.pattern = 'standard';
                valid = true;
            }
        } else if (currentCategory === 3) { // 🔥 Math II Cubics
            const isSumOfCubes = Math.random() > 0.5;
            p = Math.floor(Math.random() * 3) + 1;
            q = Math.floor(Math.random() * 7) - 3;
            if (q === 0 || gcd(p, q) !== 1) continue; // 共通因数を持つ問題を排除
            if (isSumOfCubes) {
                currentProblem = { 
                    p: p, q: q, r: p*p, s: -p*q, t: q*q,
                    coef3: p*p*p, coef2: 0, coef1: 0, coef0: q*q*q,
                    degree: 3, pattern: 'cubic-sum'
                };
            } else {
                currentProblem = {
                    p: p, q: q,
                    coef3: p*p*p, coef2: 3*p*p*q, coef1: 3*p*q*q, coef0: q*q*q,
                    degree: 3, pattern: 'cube'
                };
            }
            valid = true;
        } else if (currentCategory === 4) {
            let degree = Math.random() < 0.5 ? 3 : 4;
            if (degree === 3) {
                let type = Math.random() < 0.4 ? 'cubic-sum' : 'three-lin'; 
                if (type === 'three-lin') {
                    let f1 = generateRandomLinear(), f2 = generateRandomLinear(), f3 = generateRandomLinear();
                    let a1=f1[0], b1=f1[1], a2=f2[0], b2=f2[1], a3=f3[0], b3=f3[1];
                    let coef3 = a1*a2*a3;
                    let coef2 = a1*a2*b3 + a1*b2*a3 + b1*a2*a3;
                    let coef1 = a1*b2*b3 + b1*a2*b3 + b1*b2*a3;
                    let coef0 = b1*b2*b3;
                    currentProblem = { degree: 3, coef3, coef2, coef1, coef0, pattern: 'three-lin', targetFactors: [f1, f2, f3] };
                } else {
                    let f1 = generateRandomLinear(), f2 = generateRandomQuad();
                    let a1=f1[0], b1=f1[1], a2=f2[0], b2=f2[1], c2=f2[2];
                    let coef3 = a1*a2;
                    let coef2 = a1*b2 + b1*a2;
                    let coef1 = a1*c2 + b1*b2;
                    let coef0 = b1*c2;
                    currentProblem = { degree: 3, coef3, coef2, coef1, coef0, pattern: 'cubic-sum', targetFactors: [f1, f2] };
                }
            } else {
                let r = Math.random();
                if (r < 0.33) {
                    let f1 = generateRandomLinear(), f2 = generateRandomLinear(), f3 = generateRandomLinear(), f4 = generateRandomLinear();
                    let c2_1 = f1[0]*f2[0], c1_1 = f1[0]*f2[1] + f1[1]*f2[0], c0_1 = f1[1]*f2[1];
                    let c2_2 = f3[0]*f4[0], c1_2 = f3[0]*f4[1] + f3[1]*f4[0], c0_2 = f3[1]*f4[1];
                    let coef4 = c2_1 * c2_2, coef3 = c2_1 * c1_2 + c1_1 * c2_2;
                    let coef2 = c2_1 * c0_2 + c1_1 * c1_2 + c0_1 * c2_2;
                    let coef1 = c1_1 * c0_2 + c0_1 * c1_2, coef0 = c0_1 * c0_2;
                    currentProblem = { degree: 4, coef4, coef3, coef2, coef1, coef0, pattern: 'four-lin', targetFactors: [f1, f2, f3, f4] };
                } else if (r < 0.66) {
                    let f1 = generateRandomLinear(), f2 = generateRandomLinear(), f3 = generateRandomQuad();
                    let c2_1 = f1[0]*f2[0], c1_1 = f1[0]*f2[1] + f1[1]*f2[0], c0_1 = f1[1]*f2[1];
                    let a2=f3[0], b2=f3[1], c_2=f3[2];
                    let coef4 = c2_1 * a2, coef3 = c2_1 * b2 + c1_1 * a2;
                    let coef2 = c2_1 * c_2 + c1_1 * b2 + c0_1 * a2;
                    let coef1 = c1_1 * c_2 + c0_1 * b2, coef0 = c0_1 * c_2;
                    currentProblem = { degree: 4, coef4, coef3, coef2, coef1, coef0, pattern: 'two-lin-one-quad', targetFactors: [f1, f2, f3] };
                } else {
                    let f1 = generateRandomQuad(), f2 = generateRandomQuad();
                    let a1=f1[0], b1=f1[1], c1=f1[2], a2=f2[0], b2=f2[1], c2=f2[2];
                    let coef4 = a1*a2, coef3 = a1*b2 + b1*a2;
                    let coef2 = a1*c2 + b1*b2 + c1*a2, coef1 = b1*c2 + c1*b2, coef0 = c1*c2;
                    currentProblem = { degree: 4, coef4, coef3, coef2, coef1, coef0, pattern: 'two-quad', targetFactors: [f1, f2] };
                }
            }
            valid = true;
        }
    }
    
    if (currentMode !== MODES.INTRO && currentMode !== MODES.CATEGORY_SELECT && currentMode !== MODES.MODE_SELECT && !isGameOver) {
        if (!userRequestedPatternSelect) {
            patternSelector.classList.remove('hidden');
            inputAreaStandard.classList.add('hidden');
            inputAreaSquare.classList.add('hidden');
            inputAreaCube.classList.add('hidden');
            inputAreaCubicSum.classList.add('hidden');
            inputAreaThreeLin.classList.add('hidden');
            inputAreaFourLin.classList.add('hidden');
            inputAreaTwoLinOneQuad.classList.add('hidden');
            inputAreaTwoQuad.classList.add('hidden');
            actionsContainer.classList.add('hidden');
            hintText.classList.add('hidden');
            backToPatternBtn.classList.add('hidden');
        } else {
            // パターン選択済みの場合はそのまま入力エリア表示を想定
            actionsContainer.classList.remove('hidden');
        }
    }
    
    displayEquation(currentProblem);
    
    // ゲームモードは常に自動判定、練習モードはチェックボックスに依存
    if (currentMode === MODES.PRACTICE) {
        autoCheckEnabled = autoCheckCheckbox.checked;
        autoCheckToggle.classList.remove('hidden');
        if (autoCheckEnabled) {
            checkBtn.classList.add('hidden');
        } else {
            checkBtn.classList.remove('hidden');
        }
    } else {
        autoCheckEnabled = true;
        autoCheckToggle.classList.add('hidden');
        checkBtn.classList.add('hidden');
    }
}

function displayEquation(prob) {
    let eq = "";
    if (prob.degree === 2) {
        const {a, b, c} = prob;
        if (a === 1) eq += "x^2"; else if (a === -1) eq += "-x^2"; else eq += `${a}x^2`;
        if (b !== 0) { if (b === 1) eq += " + x"; else if (b === -1) eq += " - x"; else if (b > 0) eq += ` + ${b}x`; else eq += ` - ${Math.abs(b)}x`; }
        if (c !== 0) { if (c > 0) eq += ` + ${c}`; else eq += ` - ${Math.abs(c)}`; }
    } else if (prob.degree === 3) {
        const {coef3, coef2, coef1, coef0} = prob;
        if (coef3 === 1) eq += "x^3"; else if (coef3 === -1) eq += "-x^3"; else eq += `${coef3}x^3`;
        if (coef2 !== 0) { if (coef2 === 1) eq += " + x^2"; else if (coef2 === -1) eq += " - x^2"; else if (coef2 > 0) eq += ` + ${coef2}x^2`; else eq += ` - ${Math.abs(coef2)}x^2`; }
        if (coef1 !== 0) { if (coef1 === 1) eq += " + x"; else if (coef1 === -1) eq += " - x"; else if (coef1 > 0) eq += ` + ${coef1}x`; else eq += ` - ${Math.abs(coef1)}x`; }
        if (coef0 !== 0) { if (coef0 > 0) eq += ` + ${coef0}`; else eq += ` - ${Math.abs(coef0)}`; }
    } else if (prob.degree === 4) {
        const {coef4, coef3, coef2, coef1, coef0} = prob;
        if (coef4 === 1) eq += "x^4"; else if (coef4 === -1) eq += "-x^4"; else eq += `${coef4}x^4`;
        if (coef3 !== 0) { if (coef3 === 1) eq += " + x^3"; else if (coef3 === -1) eq += " - x^3"; else if (coef3 > 0) eq += ` + ${coef3}x^3`; else eq += ` - ${Math.abs(coef3)}x^3`; }
        if (coef2 !== 0) { if (coef2 === 1) eq += " + x^2"; else if (coef2 === -1) eq += " - x^2"; else if (coef2 > 0) eq += ` + ${coef2}x^2`; else eq += ` - ${Math.abs(coef2)}x^2`; }
        if (coef1 !== 0) { if (coef1 === 1) eq += " + x"; else if (coef1 === -1) eq += " - x"; else if (coef1 > 0) eq += ` + ${coef1}x`; else eq += ` - ${Math.abs(coef1)}x`; }
        if (coef0 !== 0) { if (coef0 > 0) eq += ` + ${coef0}`; else eq += ` - ${Math.abs(coef0)}`; }
    }
    katex.render(eq, equationDisplay, { throwOnError: false, displayMode: true });
}

function startMode() {
    isGameOver = false;
    isAnimating = false;
    userRequestedPatternSelect = false;
    clearInterval(taTimerInterval);
    clearInterval(saTimerInterval);
    resetInputs();
    hideFeedback();

    if (currentMode === MODES.CATEGORY_SELECT) {
        categoryScreen.classList.remove('hidden');
        modeScreen.classList.add('hidden');
        mainHeader.classList.add('hidden');
        introContainer.classList.add('hidden');
        problemContainer.classList.add('hidden');
        statsContainer.classList.add('hidden');
        inputAreaStandard.classList.add('hidden');
        inputAreaSquare.classList.add('hidden');
        inputAreaCube.classList.add('hidden');
        inputAreaCubicSum.classList.add('hidden');
        inputAreaThreeLin.classList.add('hidden');
        inputAreaFourLin.classList.add('hidden');
        inputAreaTwoLinOneQuad.classList.add('hidden');
        inputAreaTwoQuad.classList.add('hidden');
        patternSelector.classList.add('hidden');
        hintText.classList.add('hidden');
        actionsContainer.classList.add('hidden');
        backToPatternBtn.classList.add('hidden');
        return;
    }

    if (currentMode === MODES.MODE_SELECT) {
        categoryScreen.classList.add('hidden');
        modeScreen.classList.remove('hidden');
        mainHeader.classList.add('hidden');
        introContainer.classList.add('hidden');
        problemContainer.classList.add('hidden');
        statsContainer.classList.add('hidden');
        inputAreaStandard.classList.add('hidden');
        inputAreaSquare.classList.add('hidden');
        inputAreaCube.classList.add('hidden');
        inputAreaCubicSum.classList.add('hidden');
        inputAreaThreeLin.classList.add('hidden');
        inputAreaFourLin.classList.add('hidden');
        inputAreaTwoLinOneQuad.classList.add('hidden');
        inputAreaTwoQuad.classList.add('hidden');
        patternSelector.classList.add('hidden');
        hintText.classList.add('hidden');
        actionsContainer.classList.add('hidden');
        backToPatternBtn.classList.add('hidden');
        
        let titleText = "🔰 中学復習";
        if (currentCategory === 2) titleText = "⚔️ たすきがけ";
        if (currentCategory === 3) titleText = "🔥 数学Ⅱ";
        if (currentCategory === 4) titleText = "🌟 因数定理";
        selectedCategoryTitle.textContent = titleText;
        return;
    }

    categoryScreen.classList.add('hidden');
    modeScreen.classList.add('hidden');
    mainHeader.classList.remove('hidden');
    
    // パターンボタンの制限を適用
    patternBtns.forEach(btn => {
        if (btn.dataset.cat === String(currentCategory)) btn.style.display = 'block';
        else btn.style.display = 'none';
    });
    
    if (currentMode === MODES.INTRO) {
        introContainer.classList.remove('hidden');
        problemContainer.classList.add('hidden');
        statsContainer.classList.add('hidden');
        inputAreaStandard.classList.add('hidden');
        inputAreaSquare.classList.add('hidden');
        inputAreaCube.classList.add('hidden');
        inputAreaCubicSum.classList.add('hidden');
        inputAreaThreeLin.classList.add('hidden');
        inputAreaFourLin.classList.add('hidden');
        inputAreaTwoLinOneQuad.classList.add('hidden');
        inputAreaTwoQuad.classList.add('hidden');
        hintText.classList.add('hidden');
        actionsContainer.classList.add('hidden');
        patternSelector.classList.add('hidden');
        backToPatternBtn.classList.add('hidden');
        currentIntroStep = 1;
        renderIntroStep(currentIntroStep);
        return;
    }

    introContainer.classList.add('hidden');
    problemContainer.classList.remove('hidden');
    statsContainer.classList.remove('hidden');
    inputAreaStandard.classList.add('hidden');
    inputAreaSquare.classList.add('hidden');
    inputAreaCube.classList.add('hidden');
    inputAreaCubicSum.classList.add('hidden');
    hintText.classList.add('hidden');
    actionsContainer.classList.add('hidden');
    patternSelector.classList.remove('hidden');
    backToPatternBtn.classList.add('hidden');
    
    promptText.textContent = "次の方程式を因数分解しなさい";
    checkBtn.textContent = "判定する";
    inputsStandard.forEach(i => i.disabled = false);
    inputsSquare.forEach(i => i.disabled = false);
    inputsCube.forEach(i => i.disabled = false);
    inputsCubicSum.forEach(i => i.disabled = false);

    if (currentMode === MODES.PRACTICE) {
        practiceStreak = 0;
    } else if (currentMode === MODES.TIME_ATTACK) {
        taQuestionsDone = 0;
        taStartTime = Date.now();
        taTimerInterval = setInterval(updateStatsUI, 100);
    } else if (currentMode === MODES.SURVIVAL) {
        svHp = 3;
        svStage = 1;
        // Survival starts at chosen category logic (no longer auto upgrading levels for now)
    } else if (currentMode === MODES.SCORE_ATTACK) {
        saScore = 0;
        saTimeLeft = 60;
        saCombo = 0;
        saTimerInterval = setInterval(() => {
            if (isGameOver) return;
            saTimeLeft--;
            updateStatsUI();
            if (saTimeLeft <= 0) endScoreAttack();
        }, 1000);
    }
    updateStatsUI();
    generateProblem();
}

function renderIntroStep(step) {
    const texts = introData[currentCategory];
    introStepDesc.innerHTML = texts[step - 1];
    document.querySelectorAll('#intro-step-desc .math-intro').forEach(el => {
        katex.render(el.textContent, el, { throwOnError: false });
    });

    const isLastStep = step === texts.length;
    const isTroubleStart = (currentCategory === 2 && step === 6);

    introPrevBtn.disabled = (step === 1);

    if (isLastStep && currentCategory !== 2) {
        introNextBtn.classList.add('hidden-btn');
        introTroubleBtn.classList.add('hidden-btn');
        introPracticeBtn.classList.remove('hidden-btn');
    } else if (isTroubleStart) {
        introNextBtn.classList.add('hidden-btn');
        introTroubleBtn.classList.remove('hidden-btn');
        introPracticeBtn.classList.remove('hidden-btn');
    } else {
        introNextBtn.classList.remove('hidden-btn');
        introTroubleBtn.classList.add('hidden-btn');
        introPracticeBtn.classList.add('hidden-btn');
    }

    introDotsContainer.innerHTML = texts.map((_, i) => `<span class="dot ${i < step ? 'active' : ''}"></span>`).join('');

    introVisual1.classList.add('hidden');
    introVisual2.classList.add('hidden');
    introVisual3.classList.add('hidden');
    introVisual4.classList.add('hidden');

    if (currentCategory === 1) {
        introVisual1.classList.remove('hidden');
        renderCat1Intro(step);
    } else if (currentCategory === 2) {
        introVisual2.classList.remove('hidden');
        renderCat2Intro(step);
    } else if (currentCategory === 3) {
        introVisual3.classList.remove('hidden');
        renderCat3Intro(step);
    } else if (currentCategory === 4) {
        introVisual4.classList.remove('hidden');
    }
}

function renderCat1Intro(step) {
    if (step <= 2) {
        katex.render("x^2 - 2x \\textcolor{#FF3B30}{- 8}", introCat1Eq1, { throwOnError: false, displayMode: true });
        introCat1Eq2.innerHTML = "";
    } else if (step === 3) {
        katex.render("\\textcolor{#FF3B30}{- 8} \\to (1, -8), (2, -4) \\dots", introCat1Eq1, { throwOnError: false, displayMode: true });
        introCat1Eq2.innerHTML = "";
    } else if (step === 4) {
        katex.render("x^2 \\textcolor{#007AFF}{- 2}x \\textcolor{#FF3B30}{- 8}", introCat1Eq1, { throwOnError: false, displayMode: true });
        katex.render("2 + (-4) = \\textcolor{#007AFF}{-2}", introCat1Eq2, { throwOnError: false, displayMode: true });
    } else if (step >= 5) {
        katex.render("x^2 - 2x - 8", introCat1Eq1, { throwOnError: false, displayMode: true });
        katex.render("(x + 2)(x - 4)", introCat1Eq2, { throwOnError: false, displayMode: true });
    }
}

function renderCat2Intro(step) {
    if (step <= 6) {
        introC2.textContent = "-4"; introC4.textContent = "-2";
        introRes1.textContent = "-4"; introRes2.textContent = "-6";
        introSumVal.textContent = "-10";
        introSumVal.parentElement.className = "t-res step-el highlight success-sum";
    } else if (step === 7) {
        introC2.textContent = "-1"; introC4.textContent = "-8";
        introRes1.textContent = "-1"; introRes2.textContent = "-24";
        introSumVal.textContent = "-25";
        introSumVal.parentElement.className = "t-res step-el highlight fail-sum";
    } else if (step === 8) {
        introC2.textContent = "-2"; introC4.textContent = "-4";
        introRes1.textContent = "-2"; introRes2.textContent = "-12";
        introSumVal.textContent = "-14";
        introSumVal.parentElement.className = "t-res step-el highlight fail-sum";
    } else if (step === 9) {
        introC2.textContent = "4"; introC4.textContent = "2";
        introRes1.textContent = "4"; introRes2.textContent = "6";
        introSumVal.textContent = "+10";
        introSumVal.parentElement.className = "t-res step-el highlight fail-sum";
    }

    const step1Els = [introC1, introC2, introC3, introC4];
    const step2Els = [document.querySelector('.tasuki-grid .t-cross'), ...document.querySelectorAll('.tasuki-grid .t-arrow'), introRes1, introRes2];
    const sumBox = document.getElementById('intro-sum-box');
    const finalAnswer = document.getElementById('intro-final-answer');

    step1Els.forEach(el => el.classList.add('hidden-step'));
    step2Els.forEach(el => el.classList.add('hidden-step'));
    sumBox.classList.add('hidden-step');
    finalAnswer.classList.add('hidden-step');

    if (step >= 2) step1Els.forEach(el => el.classList.remove('hidden-step'));
    if (step >= 3) step2Els.forEach(el => el.classList.remove('hidden-step'));
    if (step >= 4) sumBox.classList.remove('hidden-step');
    if (step >= 5 && step <= 6) finalAnswer.classList.remove('hidden-step');

    if (step === 4 || step >= 7) sumBox.classList.add('pulse');
    else sumBox.classList.remove('pulse');
}

function renderCat3Intro(step) {
    if (step === 1) {
        introCat3Formula.innerHTML = "";
        introCat3Example.innerHTML = "";
        introCat3Answer.innerHTML = "";
    } else if (step === 2) {
        katex.render("(A+B)^3 = A^3 + 3A^2B + 3AB^2 + B^3", introCat3Formula, { throwOnError: false, displayMode: true });
        katex.render("8x^3 + 12x^2 + 6x + 1", introCat3Example, { throwOnError: false, displayMode: true });
        introCat3Answer.innerHTML = "";
    } else if (step === 3) {
        katex.render("(A+B)^3 = A^3 + 3A^2B + 3AB^2 + B^3", introCat3Formula, { throwOnError: false, displayMode: true });
        katex.render("\\textcolor{#FF3B30}{8x^3} + 12x^2 + 6x + \\textcolor{#FF3B30}{1}", introCat3Example, { throwOnError: false, displayMode: true });
        katex.render("(2x + 1)^3", introCat3Answer, { throwOnError: false, displayMode: true });
    } else if (step === 4) {
        katex.render("A^3 \\pm B^3 = (A \\pm B)(A^2 \\mp AB + B^2)", introCat3Formula, { throwOnError: false, displayMode: true });
        katex.render("27x^3 - 8", introCat3Example, { throwOnError: false, displayMode: true });
        introCat3Answer.innerHTML = "";
    } else if (step >= 5) {
        katex.render("A^3 \\pm B^3 = (A \\pm B)(A^2 \\mp AB + B^2)", introCat3Formula, { throwOnError: false, displayMode: true });
        katex.render("\\textcolor{#FF3B30}{27x^3} - \\textcolor{#FF3B30}{8}", introCat3Example, { throwOnError: false, displayMode: true });
        katex.render("(3x - 2)(9x^2 + 6x + 4)", introCat3Answer, { throwOnError: false, displayMode: true });
    }
}

function updateStatsUI() {
    if (currentMode === MODES.INTRO) return;
    if (currentMode === MODES.PRACTICE) {
        statsContainer.innerHTML = `🔥 連勝: <span class="val">${practiceStreak}</span>`;
    } else if (currentMode === MODES.TIME_ATTACK) {
        if (!isGameOver) {
            const sec = ((Date.now() - taStartTime) / 1000).toFixed(1);
            statsContainer.innerHTML = `⏱️ <span class="val">${sec}s</span> <span style="margin-left:12px;font-size:14px;color:var(--apple-text-secondary);">残り ${10 - taQuestionsDone}問</span>`;
        }
    } else if (currentMode === MODES.SURVIVAL) {
        const hearts = '❤️'.repeat(svHp) + '🤍'.repeat(3 - svHp);
        statsContainer.innerHTML = `HP: <span style="letter-spacing:2px;">${hearts}</span> <span style="margin-left:12px;font-size:14px;color:var(--apple-text-secondary);">Stage <span class="val">${svStage}</span></span>`;
    } else if (currentMode === MODES.SCORE_ATTACK) {
        const mult = 1 + (saCombo * 0.2);
        const timeClass = saTimeLeft <= 10 ? 'val danger' : 'val';
        statsContainer.innerHTML = `⏱️ <span class="${timeClass}">${saTimeLeft}s</span> <span style="margin-left:16px;">⭐ <span class="val">${saScore}</span> <span style="font-size:14px;color:var(--apple-text-secondary);">(x${mult.toFixed(1)})</span></span>`;
    }
}

function checkAnswer() {
    if (isGameOver) { startMode(); return; }
    if (isAnimating) return;
    
    // 現在選択されているインターフェースを基に入力値を取り出し、不足があればエラー
    if (currentSelectedPattern === 'square') {
        const sqP = parseInt(inputSqP.value), sqQ = parseInt(inputSqQ.value);
        if (isNaN(sqP) || isNaN(sqQ)) { showFeedback("すべての枠に入力してください", "error"); return; }
    } else if (currentSelectedPattern === 'standard') {
        const bP = parseInt(inputP.value), bQ = parseInt(inputQ.value), bR = parseInt(inputR.value), bS = parseInt(inputS.value);
        if (isNaN(bP) || isNaN(bQ) || isNaN(bR) || isNaN(bS)) { showFeedback("すべての枠に入力してください", "error"); return; }
    } else if (currentSelectedPattern === 'cube') {
        const cP = parseInt(inputCbP.value), cQ = parseInt(inputCbQ.value);
        if (isNaN(cP) || isNaN(cQ)) { showFeedback("すべての枠に入力してください", "error"); return; }
    } else if (currentSelectedPattern === 'cubic-sum') {
        const csP = parseInt(inputCbsP.value), csQ = parseInt(inputCbsQ.value), csR = parseInt(inputCbsR.value), csS = parseInt(inputCbsS.value), csT = parseInt(inputCbsT.value);
        if (isNaN(csP) || isNaN(csQ) || isNaN(csR) || isNaN(csS) || isNaN(csT)) { showFeedback("すべての枠に入力してください", "error"); return; }
    } else if (currentSelectedPattern === 'three-lin') {
        if (inputsThreeLin.some(i => isNaN(parseInt(i.value)))) { showFeedback("すべての枠に入力してください", "error"); return; }
    } else if (currentSelectedPattern === 'four-lin') {
        if (inputsFourLin.some(i => isNaN(parseInt(i.value)))) { showFeedback("すべての枠に入力してください", "error"); return; }
    } else if (currentSelectedPattern === 'two-lin-one-quad') {
        if (inputsTwoLinOneQuad.some(i => isNaN(parseInt(i.value)))) { showFeedback("すべての枠に入力してください", "error"); return; }
    } else if (currentSelectedPattern === 'two-quad') {
        if (inputsTwoQuad.some(i => isNaN(parseInt(i.value)))) { showFeedback("すべての枠に入力してください", "error"); return; }
    }

    // ① すべての入力が終わった段階で、まずは「型（パターン）」が合っているか判定する
    if (currentSelectedPattern !== currentProblem.pattern) {
        showFeedback("型が違います！", "error");
        // サクサクモードならボタンを隠す状態を維持したいが、再入力を促す。
        if (!autoCheckEnabled) {
             actionsContainer.classList.remove('hidden');
        }
        setTimeout(() => {
            if (!isGameOver) {
                hideFeedback();
                // 型が違う場合は、元の型選択UIへペナルティなしで戻す
                inputAreaStandard.classList.add('hidden');
                inputAreaSquare.classList.add('hidden');
                inputAreaCube.classList.add('hidden');
                inputAreaCubicSum.classList.add('hidden');
                inputAreaThreeLin.classList.add('hidden');
                inputAreaFourLin.classList.add('hidden');
                inputAreaTwoLinOneQuad.classList.add('hidden');
                inputAreaTwoQuad.classList.add('hidden');
                hintText.classList.add('hidden');
                actionsContainer.classList.add('hidden');
                patternSelector.classList.remove('hidden');
                backToPatternBtn.classList.add('hidden');
                resetInputs();
                userRequestedPatternSelect = false;
            }
        }, 1500);
        return;
    }

    // ② 型が合っていれば、具体的な数値の採点に移行する
    const { pattern } = currentProblem;
    let isCorrect = false;

    if (currentCategory === 4) {
        let userFactors = [];
        if (currentSelectedPattern === 'three-lin') {
            for(let i=0; i<3; i++) userFactors.push([parseInt(inputsThreeLin[i*2].value), parseInt(inputsThreeLin[i*2+1].value)]);
        } else if (currentSelectedPattern === 'four-lin') {
            for(let i=0; i<4; i++) userFactors.push([parseInt(inputsFourLin[i*2].value), parseInt(inputsFourLin[i*2+1].value)]);
        } else if (currentSelectedPattern === 'two-lin-one-quad') {
            userFactors.push([parseInt(inputsTwoLinOneQuad[0].value), parseInt(inputsTwoLinOneQuad[1].value)]);
            userFactors.push([parseInt(inputsTwoLinOneQuad[2].value), parseInt(inputsTwoLinOneQuad[3].value)]);
            userFactors.push([parseInt(inputsTwoLinOneQuad[4].value), parseInt(inputsTwoLinOneQuad[5].value), parseInt(inputsTwoLinOneQuad[6].value)]);
        } else if (currentSelectedPattern === 'two-quad') {
            userFactors.push([parseInt(inputsTwoQuad[0].value), parseInt(inputsTwoQuad[1].value), parseInt(inputsTwoQuad[2].value)]);
            userFactors.push([parseInt(inputsTwoQuad[3].value), parseInt(inputsTwoQuad[4].value), parseInt(inputsTwoQuad[5].value)]);
        } else if (currentSelectedPattern === 'cubic-sum') {
            userFactors.push([parseInt(inputsCubicSum[0].value), parseInt(inputsCubicSum[1].value)]);
            userFactors.push([parseInt(inputsCubicSum[2].value), parseInt(inputsCubicSum[3].value), parseInt(inputsCubicSum[4].value)]);
        }
        if (compareFactorSets(userFactors, currentProblem.targetFactors)) isCorrect = true;
    } else if (pattern === 'square') {
        const p = parseInt(inputSqP.value), q = parseInt(inputSqQ.value);
        if ((p === currentProblem.p && q === currentProblem.q) || (p === -currentProblem.p && q === -currentProblem.q)) isCorrect = true;
    } else if (pattern === 'standard') {
        const p = parseInt(inputP.value), q = parseInt(inputQ.value), r = parseInt(inputR.value), s = parseInt(inputS.value);
        const { p: cp, q: cq, r: cr, s: cs } = currentProblem;
        const ok1 = (p === cp && q === cq && r === cr && s === cs);
        const ok2 = (p === cr && q === cs && r === cp && s === cq);
        const ok3 = (p === -cp && q === -cq && r === -cr && s === -cs);
        const ok4 = (p === -cr && q === -cs && r === -cp && s === -cq);
        if (ok1 || ok2 || ok3 || ok4) isCorrect = true;
    } else if (pattern === 'cube') {
        const p = parseInt(inputCbP.value), q = parseInt(inputCbQ.value);
        if ((p === currentProblem.p && q === currentProblem.q) || (p === -currentProblem.p && q === -currentProblem.q)) isCorrect = true;
    } else if (pattern === 'cubic-sum') {
        const p = parseInt(inputCbsP.value), q = parseInt(inputCbsQ.value), r = parseInt(inputCbsR.value), s = parseInt(inputCbsS.value), t = parseInt(inputCbsT.value);
        if ((p === currentProblem.p && q === currentProblem.q && r === currentProblem.r && s === currentProblem.s && t === currentProblem.t) || 
            (p === -currentProblem.p && q === -currentProblem.q && r === currentProblem.r && s === currentProblem.s && t === currentProblem.t)) isCorrect = true;
    }
    
    if (isCorrect) handleCorrect();
    else handleIncorrect();
}

function handleCorrect() {
    isAnimating = true;
    if (currentMode === MODES.PRACTICE) practiceStreak++;
    else if (currentMode === MODES.TIME_ATTACK) {
        taQuestionsDone++;
        if (taQuestionsDone >= 10) { updateStatsUI(); triggerConfetti(); endTimeAttack(); return; }
    } else if (currentMode === MODES.SURVIVAL) {
        svStage++;
        if (svStage === 4) currentLevel = 2;
        if (svStage >= 8) currentLevel = 3;
    } else if (currentMode === MODES.SCORE_ATTACK) {
        saCombo++;
        saScore += Math.floor(100 * (1 + (saCombo * 0.2)));
        saTimeLeft += 2;
    }
    updateStatsUI();
    showFeedback("正解！", "success");
    triggerConfetti();
    setTimeout(() => {
        resetInputs();
        generateProblem();
        hideFeedback();
        isAnimating = false;
        if (!isGameOver) inputP.focus();
    }, currentMode === MODES.TIME_ATTACK ? 800 : 1200);
}

function handleIncorrect(customMsg = "不正解…") {
    if (!autoCheckEnabled) {
        actionsContainer.classList.remove('hidden');
    }
    if (currentMode === MODES.PRACTICE) { practiceStreak = 0; showFeedback(customMsg, "error"); }
    else if (currentMode === MODES.TIME_ATTACK) { taStartTime -= 3000; showFeedback(customMsg + " +3秒ペナルティ", "error"); }
    else if (currentMode === MODES.SURVIVAL) {
        svHp--;
        updateStatsUI();
        if (svHp <= 0) { endSurvival(); return; }
        showFeedback(customMsg + " ライフ減少", "error");
    } else if (currentMode === MODES.SCORE_ATTACK) { saCombo = 0; showFeedback(customMsg + " コンボリセット", "error"); }
    updateStatsUI();
    setTimeout(() => { if (!isAnimating && !isGameOver) hideFeedback(); }, 2000);
}

function triggerConfetti() {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#007AFF', '#34C759', '#FFCC00', '#FF3B30'] });
}

function showResultScreen(title, subtitle) {
    isGameOver = true;
    hideFeedback();
    inputAreaStandard.classList.add('hidden');
    inputAreaSquare.classList.add('hidden');
    inputAreaCube.classList.add('hidden');
    inputAreaCubicSum.classList.add('hidden');
    patternSelector.classList.add('hidden');
    hintText.classList.add('hidden');
    promptText.textContent = "結果発表";
    equationDisplay.innerHTML = `<div class="result-title">${title}</div><div class="result-subtitle">${subtitle}</div>`;
    checkBtn.textContent = "もう一度プレイ";
}

function endTimeAttack() {
    clearInterval(taTimerInterval);
    const sec = ((Date.now() - taStartTime) / 1000).toFixed(1);
    let rank = 'C';
    if (sec < 45) rank = 'S';
    else if (sec < 70) rank = 'A';
    else if (sec < 100) rank = 'B';
    showResultScreen(`Rank ${rank}`, `クリアタイム: ${sec}秒`);
}

function endSurvival() { showResultScreen("Game Over", `到達ステージ: ${svStage}`); }
function endScoreAttack() { clearInterval(saTimerInterval); showResultScreen("Time Up!", `最終スコア: ${saScore} pts`); }

function showFeedback(text, type) { feedbackMessage.textContent = text; feedbackMessage.className = `feedback ${type}`; }
function hideFeedback() { feedbackMessage.className = `feedback hidden`; }
function resetInputs() {
    inputsStandard.forEach(i => i.value = '');
    inputsSquare.forEach(i => i.value = '');
    inputsCube.forEach(i => i.value = '');
    inputsCubicSum.forEach(i => i.value = '');
    inputsThreeLin.forEach(i => i.value = '');
    inputsFourLin.forEach(i => i.value = '');
    inputsTwoLinOneQuad.forEach(i => i.value = '');
    inputsTwoQuad.forEach(i => i.value = '');
}

// Events
checkBtn.addEventListener('click', checkAnswer);

categoryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentCategory = parseInt(e.currentTarget.dataset.category);
        currentMode = MODES.MODE_SELECT;
        startMode();
    });
});

modeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentMode = e.currentTarget.dataset.mode;
        startMode();
    });
});

backToCategoryBtn.addEventListener('click', () => {
    currentMode = MODES.CATEGORY_SELECT;
    startMode();
});

backToTitleBtn.addEventListener('click', () => {
    currentMode = MODES.CATEGORY_SELECT;
    startMode();
});

backToPatternBtn.addEventListener('click', () => {
    if (isGameOver || isAnimating) return;
    inputAreaStandard.classList.add('hidden');
    inputAreaSquare.classList.add('hidden');
    inputAreaCube.classList.add('hidden');
    inputAreaCubicSum.classList.add('hidden');
    inputAreaThreeLin.classList.add('hidden');
    inputAreaFourLin.classList.add('hidden');
    inputAreaTwoLinOneQuad.classList.add('hidden');
    inputAreaTwoQuad.classList.add('hidden');
    hintText.classList.add('hidden');
    actionsContainer.classList.add('hidden');
    patternSelector.classList.remove('hidden');
    backToPatternBtn.classList.add('hidden');
    resetInputs();
    userRequestedPatternSelect = false;
});
patternBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (isGameOver || isAnimating) return;
        const chosen = e.currentTarget.dataset.pattern;
        currentSelectedPattern = chosen;
        
        // どの型を選んでも、まずは入力UIを表示する
        patternSelector.classList.add('hidden');
        if (chosen === 'square') inputAreaSquare.classList.remove('hidden');
        else if (chosen === 'cube') inputAreaCube.classList.remove('hidden');
        else if (chosen === 'cubic-sum') inputAreaCubicSum.classList.remove('hidden');
        else if (chosen === 'three-lin') inputAreaThreeLin.classList.remove('hidden');
        else if (chosen === 'four-lin') inputAreaFourLin.classList.remove('hidden');
        else if (chosen === 'two-lin-one-quad') inputAreaTwoLinOneQuad.classList.remove('hidden');
        else if (chosen === 'two-quad') inputAreaTwoQuad.classList.remove('hidden');
        else inputAreaStandard.classList.remove('hidden');
        hintText.classList.remove('hidden');
        
        if (chosen === 'square') inputSqP.focus();
        else if (chosen === 'cube') inputCbP.focus();
        else if (chosen === 'cubic-sum') inputCbsP.focus();
        else if (chosen === 'three-lin') inputsThreeLin[0].focus();
        else if (chosen === 'four-lin') inputsFourLin[0].focus();
        else if (chosen === 'two-lin-one-quad') inputsTwoLinOneQuad[0].focus();
        else if (chosen === 'two-quad') inputsTwoQuad[0].focus();
        else inputP.focus();
        
        userRequestedPatternSelect = true;
        
        actionsContainer.classList.remove('hidden');
        backToPatternBtn.classList.remove('hidden');
        if (currentMode === MODES.PRACTICE) {
            autoCheckToggle.classList.remove('hidden');
            if (autoCheckCheckbox.checked) {
                checkBtn.classList.add('hidden');
            } else {
                checkBtn.classList.remove('hidden');
            }
        } else {
            autoCheckToggle.classList.add('hidden');
            checkBtn.classList.add('hidden');
        }
    });
});

autoCheckCheckbox.addEventListener('change', (e) => {
    autoCheckEnabled = e.target.checked;
    if (autoCheckEnabled) {
        checkBtn.classList.add('hidden');
        // On turning auto-check ON, maybe trigger check if all filled
        let allFilled = true;
        let activeInputs;
        if (currentSelectedPattern === 'square') activeInputs = inputsSquare;
        else if (currentSelectedPattern === 'standard') activeInputs = inputsStandard;
        else if (currentSelectedPattern === 'cube') activeInputs = inputsCube;
        else if (currentSelectedPattern === 'cubic-sum') activeInputs = inputsCubicSum;
        else if (currentSelectedPattern === 'three-lin') activeInputs = inputsThreeLin;
        else if (currentSelectedPattern === 'four-lin') activeInputs = inputsFourLin;
        else if (currentSelectedPattern === 'two-lin-one-quad') activeInputs = inputsTwoLinOneQuad;
        else if (currentSelectedPattern === 'two-quad') activeInputs = inputsTwoQuad;
        else return;

        if (activeInputs) {
             activeInputs.forEach(i => { if (isNaN(parseInt(i.value))) allFilled = false; });
             if (allFilled && !isGameOver && !isAnimating) checkAnswer();
        }
    } else {
        checkBtn.classList.remove('hidden');
    }
});

const bindInputListeners = (inputsList) => {
    inputsList.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (isGameOver || isAnimating || !autoCheckEnabled) return;
            let allFilled = true;
            inputsList.forEach(i => { if (isNaN(parseInt(i.value))) allFilled = false; });
            if (allFilled) checkAnswer();
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (index < inputsList.length - 1) inputsList[index + 1].focus();
                else checkAnswer();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                if (index < inputsList.length - 1) inputsList[index + 1].focus();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                if (index > 0) inputsList[index - 1].focus();
            }
        });
    });
};

bindInputListeners(inputsStandard);
bindInputListeners(inputsSquare);
bindInputListeners(inputsCube);
bindInputListeners(inputsCubicSum);
bindInputListeners(inputsThreeLin);
bindInputListeners(inputsFourLin);
bindInputListeners(inputsTwoLinOneQuad);
bindInputListeners(inputsTwoQuad);
introPrevBtn.addEventListener('click', () => {
    if (currentIntroStep > 1) { currentIntroStep--; renderIntroStep(currentIntroStep); }
});
introNextBtn.addEventListener('click', () => {
    const limits = { 1: 6, 2: 9, 3: 6, 4: 5 };
    const maxSteps = limits[currentCategory];
    
    // 中学・数IIはステップ最大に到達したら終了処理（紙吹雪など）
    if (currentCategory !== 2 && currentIntroStep === maxSteps - 1) {
        currentIntroStep++;
        renderIntroStep(currentIntroStep);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, colors: ['#007AFF', '#34C759'] });
    } else if (currentCategory === 2 && currentIntroStep === 5) {
        currentIntroStep++;
        renderIntroStep(currentIntroStep);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, colors: ['#007AFF', '#34C759'] });
    } else if (currentIntroStep < maxSteps) {
        currentIntroStep++;
        renderIntroStep(currentIntroStep);
    } else {
        currentMode = MODES.PRACTICE;
        startMode();
    }
});

introTroubleBtn.addEventListener('click', () => {
    currentIntroStep = 7;
    renderIntroStep(currentIntroStep);
});
introPracticeBtn.addEventListener('click', () => {
    currentMode = MODES.PRACTICE;
    startMode();
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.intro-example-title .math-intro, .intro-final-answer .math-intro, .intro-final-answer .math-intro').forEach(el => {
        katex.render(el.textContent, el, { throwOnError: false });
    });
    startMode();
});
