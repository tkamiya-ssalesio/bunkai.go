const MODES = {
    TITLE: 'title',
    INTRO: 'intro',
    PRACTICE: 'practice',
    TIME_ATTACK: 'timeAttack',
    SURVIVAL: 'survival',
    SCORE_ATTACK: 'scoreAttack'
};

let currentMode = MODES.TITLE;
let currentLevel = 1;
let currentProblem = null;

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

// Intro States (Refactored for Basic First then Trouble)
let currentIntroStep = 1;
const introTexts = [
    "「たすきがけ」は、<span class='math-intro'>ax^2+bx+c</span> を因数分解するパズルです！<br>例として <span class='math-intro'>3x^2 - 10x + 8</span> を考えましょう。<br><small>※ <span class='math-intro'>x^2</span>の係数（ここでは<span class='math-intro'>3</span>）は常にプラスにしておくのがコツです。</small>",
    "まず、<span class='math-intro'>x^2</span>の係数「<span class='math-intro'>3</span>」と、定数項「<span class='math-intro'>8</span>」になるペアを探して縦に並べます。<br>今回は <span class='math-intro'>(3, 1)</span> と <span class='math-intro'>(-4, -2)</span> を並べてみます。",
    "次に、斜めに掛け算（たすきがけ）をします！<br><span class='math-intro'>3 \\times (-2) = -6</span><br><span class='math-intro'>1 \\times (-4) = -4</span>",
    "掛けた結果を足し合わせます。<br><span class='math-intro'>(-4) + (-6) = -10</span><br>真ん中の係数「<span class='math-intro'>-10</span>」と一致しました！🎉",
    "一致したら、そのまま横に読み取ってカッコに入れます。<br>上の段から <span class='math-intro'>(3x - 4)</span>、下の段から <span class='math-intro'>(x - 2)</span> となります！",
    "完成！ <span class='math-intro'>(3x - 4)(x - 2)</span> が正解です。<br>仕組みは分かりましたか？",
    "<strong>【うまくいかない時①：ペアを変える】</strong><br>例えば <span class='math-intro'>8</span> を <span class='math-intro'>(-1, -8)</span> と分けてみると、和が <span class='math-intro' style='color:var(--apple-red);'>-25</span> で不一致です。<br>このような時は、別の素因数のペアを探りましょう。",
    "<strong>【うまくいかない時②：上下を入れ替える】</strong><br><span class='math-intro'>(-2, -4)</span> と並べると、和が <span class='math-intro' style='color:var(--apple-red);'>-14</span>。<br>数字が惜しい時は、右側の上下をクルッと入れ替えてみましょう。",
    "<strong>【うまくいかない時③：符号を変える】</strong><br><span class='math-intro'>(4, 2)</span> と並べると和が <span class='math-intro' style='color:var(--apple-red);'>+10</span>。符号だけ逆ですね！<br>この場合、右側のペアの符号を両方「マイナス」に反転させます。"
];

// DOM
const titleScreen = document.getElementById('title-screen');
const mainHeader = document.getElementById('main-header');
const backToTitleBtn = document.getElementById('back-to-title-btn');
const menuBtns = document.querySelectorAll('.menu-btn');

const introContainer = document.getElementById('intro-container');
const problemContainer = document.getElementById('problem-container');
const statsContainer = document.getElementById('stats-container');
const levelSelectorContainer = document.getElementById('level-selector-container');
const promptText = document.getElementById('prompt-text');
const inputArea = document.getElementById('input-area');
const hintText = document.getElementById('hint-text');
const actionsContainer = document.getElementById('actions-container');
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
const inputs = [inputP, inputQ, inputR, inputS];
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

function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    return b === 0 ? a : gcd(b, a % b);
}

function generateProblem() {
    let p, q, r, s, a, b, c;
    let valid = false;
    let pMax, qMax;
    if (currentLevel === 1) { pMax = 3; qMax = 4; }
    else if (currentLevel === 2) { pMax = 5; qMax = 7; }
    else { pMax = 9; qMax = 12; }

    while (!valid) {
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
        if (gcd(a, gcd(b, c)) === 1) valid = true;
    }
    currentProblem = { p, q, r, s, a, b, c };
    displayEquation(a, b, c);
    autoCheckEnabled = true;
}

function displayEquation(a, b, c) {
    let eq = "";
    if (a === 1) eq += "x^2";
    else if (a === -1) eq += "-x^2";
    else eq += `${a}x^2`;
    if (b !== 0) {
        if (b === 1) eq += " + x";
        else if (b === -1) eq += " - x";
        else if (b > 0) eq += ` + ${b}x`;
        else eq += ` - ${Math.abs(b)}x`;
    }
    if (c !== 0) {
        if (c > 0) eq += ` + ${c}`;
        else eq += ` - ${Math.abs(c)}`;
    }
    katex.render(eq, equationDisplay, { throwOnError: false, displayMode: true });
}

function startMode() {
    isGameOver = false;
    isAnimating = false;
    clearInterval(taTimerInterval);
    clearInterval(saTimerInterval);
    resetInputs();
    hideFeedback();

    if (currentMode === MODES.TITLE) {
        titleScreen.classList.remove('hidden');
        mainHeader.classList.add('hidden');
        introContainer.classList.add('hidden');
        problemContainer.classList.add('hidden');
        statsContainer.classList.add('hidden');
        levelSelectorContainer.classList.add('hidden');
        inputArea.classList.add('hidden');
        hintText.classList.add('hidden');
        actionsContainer.classList.add('hidden');
        return;
    }

    titleScreen.classList.add('hidden');
    mainHeader.classList.remove('hidden');
    
    if (currentMode === MODES.INTRO) {
        introContainer.classList.remove('hidden');
        problemContainer.classList.add('hidden');
        statsContainer.classList.add('hidden');
        levelSelectorContainer.classList.add('hidden');
        inputArea.classList.add('hidden');
        hintText.classList.add('hidden');
        actionsContainer.classList.add('hidden');
        introDotsContainer.innerHTML = introTexts.map(() => '<span class="dot"></span>').join('');
        currentIntroStep = 1;
        renderIntroStep(currentIntroStep);
        return;
    }

    introContainer.classList.add('hidden');
    problemContainer.classList.remove('hidden');
    statsContainer.classList.remove('hidden');
    inputArea.classList.remove('hidden');
    hintText.classList.remove('hidden');
    actionsContainer.classList.remove('hidden');
    promptText.textContent = "次の方程式を因数分解しなさい";
    checkBtn.textContent = "判定する";
    inputs.forEach(i => i.disabled = false);

    if (currentMode === MODES.PRACTICE) {
        levelSelectorContainer.classList.remove('hidden');
        practiceStreak = 0;
    } else if (currentMode === MODES.TIME_ATTACK) {
        levelSelectorContainer.classList.remove('hidden');
        taQuestionsDone = 0;
        taStartTime = Date.now();
        taTimerInterval = setInterval(updateStatsUI, 100);
    } else if (currentMode === MODES.SURVIVAL) {
        levelSelectorContainer.classList.add('hidden');
        currentLevel = 1;
        svHp = 3;
        svStage = 1;
    } else if (currentMode === MODES.SCORE_ATTACK) {
        levelSelectorContainer.classList.remove('hidden');
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
    introStepDesc.innerHTML = introTexts[step - 1];
    document.querySelectorAll('#intro-step-desc .math-intro').forEach(el => {
        katex.render(el.textContent, el, { throwOnError: false });
    });

    if (step === 6) {
        introNextBtn.classList.add('hidden-btn');
        introTroubleBtn.classList.remove('hidden-btn');
        introPracticeBtn.classList.remove('hidden-btn');
    } else {
        introNextBtn.classList.remove('hidden-btn');
        introTroubleBtn.classList.add('hidden-btn');
        introPracticeBtn.classList.add('hidden-btn');
    }

    const dots = introDotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
        if (idx < step) dot.classList.add('active');
        else dot.classList.remove('active');
    });

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
    if (step === 5 || step === 6) finalAnswer.classList.remove('hidden-step');

    if (step === 4 || step >= 7) sumBox.classList.add('pulse');
    else sumBox.classList.remove('pulse');

    introPrevBtn.disabled = (step === 1);
    introNextBtn.textContent = (step >= 9) ? '練習をはじめる' : '次へ';
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
    const p = parseInt(inputP.value), q = parseInt(inputQ.value), r = parseInt(inputR.value), s = parseInt(inputS.value);
    if (isNaN(p) || isNaN(q) || isNaN(r) || isNaN(s)) {
        showFeedback("すべての枠に入力してください", "error");
        return;
    }
    const { p: cp, q: cq, r: cr, s: cs } = currentProblem;
    const ok1 = (p === cp && q === cq && r === cr && s === cs);
    const ok2 = (p === cr && q === cs && r === cp && s === cq);
    const ok3 = (p === -cp && q === -cq && r === -cr && s === -cs);
    const ok4 = (p === -cr && q === -cs && r === -cp && s === -q);
    if (ok1 || ok2 || ok3 || ok4) handleCorrect();
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

function handleIncorrect() {
    autoCheckEnabled = false;
    if (currentMode === MODES.PRACTICE) { practiceStreak = 0; showFeedback("不正解…", "error"); }
    else if (currentMode === MODES.TIME_ATTACK) { taStartTime -= 3000; showFeedback("不正解… +3秒ペナルティ", "error"); }
    else if (currentMode === MODES.SURVIVAL) {
        svHp--;
        updateStatsUI();
        if (svHp <= 0) { endSurvival(); return; }
        showFeedback("不正解… ライフ減少", "error");
    } else if (currentMode === MODES.SCORE_ATTACK) { saCombo = 0; showFeedback("不正解… コンボリセット", "error"); }
    updateStatsUI();
    setTimeout(() => { if (!isAnimating && !isGameOver) hideFeedback(); }, 2000);
}

function triggerConfetti() {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#007AFF', '#34C759', '#FFCC00', '#FF3B30'] });
}

function showResultScreen(title, subtitle) {
    isGameOver = true;
    hideFeedback();
    inputArea.classList.add('hidden');
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
function resetInputs() { inputs.forEach(i => i.value = ''); }

// Events
checkBtn.addEventListener('click', checkAnswer);

menuBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentMode = e.currentTarget.dataset.mode;
        startMode();
    });
});

backToTitleBtn.addEventListener('click', () => {
    currentMode = MODES.TITLE;
    startMode();
});

document.querySelectorAll('input[name="level"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (isAnimating || isGameOver) return;
        currentLevel = parseInt(e.target.value);
        startMode();
    });
});
inputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        if (isGameOver || isAnimating || !autoCheckEnabled) return;
        const p = parseInt(inputP.value);
        const q = parseInt(inputQ.value);
        const r = parseInt(inputR.value);
        const s = parseInt(inputS.value);
        if (!isNaN(p) && !isNaN(q) && !isNaN(r) && !isNaN(s)) {
            checkAnswer();
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (index < inputs.length - 1) inputs[index + 1].focus();
            else checkAnswer();
        }
    });
});
introPrevBtn.addEventListener('click', () => {
    if (currentIntroStep > 1) { currentIntroStep--; renderIntroStep(currentIntroStep); }
});
introNextBtn.addEventListener('click', () => {
    if (currentIntroStep === 5) {
        currentIntroStep++;
        renderIntroStep(currentIntroStep);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, colors: ['#007AFF', '#34C759'] });
    } else if (currentIntroStep < introTexts.length) {
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
