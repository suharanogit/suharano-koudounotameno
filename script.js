document.addEventListener('DOMContentLoaded', () => {
    // 画面要素の取得
    const screens = {
        greeting: document.getElementById('greetingScreen'),
        goal: document.getElementById('goalScreen'),
        preTask: document.getElementById('preTaskScreen'),
        inTask: document.getElementById('inTaskScreen'),
        postTask: document.getElementById('postTaskScreen'),
        levelUp: document.getElementById('levelUpScreen'),
        farewell: document.getElementById('farewellScreen')
    };

    // グローバルな画面遷移関数
    function showScreen(screenId) {
        Object.values(screens).forEach(screen => {
            screen.classList.remove('active');
        });
        screens[screenId].classList.add('active');
    }

    // 画面固有の要素
    const greetingElement = document.getElementById('greeting');
    const datetimeElement = document.getElementById('datetime');
    const toGoalBtn = document.getElementById('toGoalBtn');
    const toPreTaskBtnFromGoal = document.getElementById('toPreTaskBtnFromGoal');

    const memoTask = document.getElementById('memoTask');
    const memoTime = document.getElementById('memoTime');
    const memoBarrier = document.getElementById('memoBarrier');
    const memoMeasure = document.getElementById('memoMeasure');
    const copyPreTaskMemoBtn = document.getElementById('copyPreTaskMemoBtn');
    const preTaskCopyConfirmation = document.getElementById('preTaskCopyConfirmation');
    const startTaskBtn = document.getElementById('startTaskBtn');

    // 難易度（不安度）関連要素
    const anxietyButtonsContainer = document.querySelector('.anxiety-buttons-container');
    const selectedAnxietyLevelInput = document.getElementById('selectedAnxietyLevel');

    const endTaskBtn = document.getElementById('endTaskBtn');

    const feedbackMemo = document.getElementById('feedbackMemo');
    const copyFeedbackMemoBtn = document = document.getElementById('copyFeedbackMemoBtn');
    const postTaskCopyConfirmation = document.getElementById('postTaskCopyConfirmation');
    const continueBtn = document.getElementById('continueBtn');
    const finishBtn = document.getElementById('finishBtn');

    // NEW: 始めに戻るボタン
    const backToStartBtn = document.getElementById('backToStartBtn'); 

    // 経験値・レベル関連の要素
    const currentLevelSpan = document.getElementById('currentLevel');
    const currentExpSpan = document.getElementById('currentExp');
    const nextLevelExpSpan = document.getElementById('nextLevelExp');
    const expBar = document.getElementById('expBar');
    const expGainMessage = document.getElementById('expGainMessage');
    const levelUpTransitionMessage = document.getElementById('levelUpTransitionMessage');
    const levelUpDisplayMessage = document.getElementById('levelUpDisplayMessage');
    const toPostTaskFromLevelUpBtn = document.getElementById('toPostTaskFromLevelUpBtn');

    // 経験値・レベルの初期値と定義
    let userLevel = parseInt(localStorage.getItem('userLevel')) || 1;
    let userExp = parseInt(localStorage.getItem('userExp')) || 0;
    const expNeededForLevel = [
        0, // レベル1 (0からスタート)
        100, // レベル2
        250, // レベル3 (前レベルから150増)
        450, // レベル4 (前レベルから200増)
        700, // レベル5 (前レベルから250増)
        1000, // レベル6 (前レベルから300増)
        // 必要に応じて追加。expNeededForLevel[level-1] でアクセス
    ];
    // 不安度に応じた経験値計算ロジック
    function calculateExp(anxiety) {
        anxiety = parseInt(anxiety);
        if (isNaN(anxiety) || anxiety < 0 || anxiety > 10) {
            return 0;
        }
        return anxiety * 10;
    }


    // ユーザー情報の更新と表示
    function updateUserInfo() {
        const nextExpThreshold = expNeededForLevel[userLevel] || (userLevel * 200);
        
        currentLevelSpan.textContent = userLevel;
        currentExpSpan.textContent = userExp;
        nextLevelExpSpan.textContent = nextExpThreshold;

        const expPercentage = (userExp / nextExpThreshold) * 100;
        expBar.style.width = `${Math.min(expPercentage, 100)}%`;
        
        localStorage.setItem('userLevel', userLevel);
        localStorage.setItem('userExp', userExp);
    }

    // 経験値の追加とレベルアップ判定
    function addExp(exp) {
        userExp += exp;
        expGainMessage.textContent = `${exp}の経験値を獲得しました！`;
        levelUpTransitionMessage.textContent = '';

        let leveledUp = false;
        while (userExp >= (expNeededForLevel[userLevel] || Infinity)) {
            userExp -= expNeededForLevel[userLevel];
            userLevel++;
            levelUpTransitionMessage.textContent = `レベルが ${userLevel} に上がりました！おめでとうございます！`;
            levelUpDisplayMessage.textContent = `レベルが ${userLevel} に上がりました！`;
            leveledUp = true;
        }
        updateUserInfo();
        return leveledUp;
    }

    // 初期表示でユーザー情報を更新
    updateUserInfo();

    // 日付と時刻、時間帯に応じた挨拶文の表示
    function updateDateTimeAndGreeting() {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString();
        const day = now.getDate().toString();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const weekday = ["日", "月", "火", "水", "木", "金", "土"][now.getDay()];

        datetimeElement.textContent = `${month}月${day}日(${weekday}) ${hours}時${minutes}分です`;

        const hour = now.getHours();
        let greeting = "";
        // 現在時刻の取得と分数の処理
        const currentMinutes = now.getMinutes();

        if (hour >= 5 && (hour < 10 || (hour === 10 && currentMinutes < 30))) { 
            greeting = "おはようございます";
        } else if ((hour >= 10 && (hour > 10 || currentMinutes >= 30)) && hour < 17) {
            greeting = "こんにちは";
        } else {
            greeting = "こんばんは";
        }
        greetingElement.textContent = `${greeting}！`;
    }

    // 初期表示と1分ごとの更新
    updateDateTimeAndGreeting();
    setInterval(updateDateTimeAndGreeting, 60000);

    // --- クリックによる画面遷移イベントリスナー ---

    // 挨拶画面から目標画面へ
    toGoalBtn.addEventListener('click', () => {
        showScreen('goal');
    });

    // 目標画面からタスク前儀式画面へ
    toPreTaskBtnFromGoal.addEventListener('click', () => {
        showScreen('preTask');
        memoTask.focus();
    });

    // 不安度ボタンの生成とイベントリスナー設定
    function generateAnxietyButtons() {
        for (let i = 0; i <= 10; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.classList.add('anxiety-btn');
            button.dataset.value = i;
            anxietyButtonsContainer.appendChild(button);

            button.addEventListener('click', () => {
                document.querySelectorAll('.anxiety-btn').forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');
                selectedAnxietyLevelInput.value = button.dataset.value;
            });
        }
    }
    generateAnxietyButtons();


    // タスク前メモコピーボタンのクリックイベント
    copyPreTaskMemoBtn.addEventListener('click', async () => {
        const memoContent = `
取り組むこと: ${memoTask.value}
予測時間: ${memoTime.value}
考えられる障壁: ${memoBarrier.value}
対策: ${memoMeasure.value}
不安度: ${selectedAnxietyLevelInput.value || '未選択'}
獲得予定ポイント: ${calculateExp(selectedAnxietyLevelInput.value || 0)}
        `.trim();
        try {
            await navigator.clipboard.writeText(memoContent);
            preTaskCopyConfirmation.style.display = 'block';
            setTimeout(() => {
                preTaskCopyConfirmation.style.display = 'none';
            }, 3000);
        } catch (err) {
                console.error('タスク前メモのコピーに失敗しました:', err);
                alert('タסק前メモのコピーに失敗しました。手動でコピーしてください。');
            }
        });

    // 「タスク開始」ボタンのクリックイベント
    startTaskBtn.addEventListener('click', () => {
        if (selectedAnxietyLevelInput.value === '') {
            alert('タスクの不安度を選択してください！');
            return;
        }
        showScreen('inTask');
    });

    // 「タスク終了」ボタンのクリックイベント (タスク中画面からフィードバック画面へ)
    endTaskBtn.addEventListener('click', () => {
        const anxietyValue = parseInt(selectedAnxietyLevelInput.value);
        const gainedExp = calculateExp(anxietyValue);
        const leveledUp = addExp(gainedExp);

        if (leveledUp) {
            showScreen('levelUp');
        } else {
            showScreen('postTask');
            feedbackMemo.focus();
        }
    });

    // レベルアップ画面からフィードバック画面へ
    toPostTaskFromLevelUpBtn.addEventListener('click', () => {
        showScreen('postTask');
        feedbackMemo.focus();
    });

    // フィードバックメモコピーボタンのクリックイベント
    copyFeedbackMemoBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(feedbackMemo.value);
            postTaskCopyConfirmation.style.display = 'block';
            setTimeout(() => {
                postTaskCopyConfirmation.style.display = 'none';
            }, 3000);
        } catch (err) {
            console.error('フィードバックのコピーに失敗しました:', err);
            alert('フィードバックのコピーに失敗しました。手動でコピーしてください。');
        }
    });

    // 「別のタスクを行う」ボタンのクリックイベント (最初の画面に戻る)
    continueBtn.addEventListener('click', () => {
        // 各入力欄をクリア
        memoTask.value = '';
        memoTime.value = '';
        memoBarrier.value = '';
        memoMeasure.value = '';
        feedbackMemo.value = '';
        selectedAnxietyLevelInput.value = '';
        document.querySelectorAll('.anxiety-btn').forEach(btn => btn.classList.remove('selected'));

        // メッセージをクリア
        expGainMessage.textContent = '';
        levelUpTransitionMessage.textContent = '';
        levelUpDisplayMessage.textContent = '';

        // 最初の挨拶画面に戻る
        showScreen('greeting');
    });

    // 「アプリを終了する」ボタンのクリックイベント (自動クローズを削除)
    finishBtn.addEventListener('click', () => {
        showScreen('farewell');
        // setTimeout(() => { // 自動クローズしないため削除
        //     window.close();
        // }, 3000);
    });

    // NEW: 終わり画面から最初の挨拶画面へ戻るボタン
    backToStartBtn.addEventListener('click', () => {
        // アプリの状態をリセット
        memoTask.value = '';
        memoTime.value = '';
        memoBarrier.value = '';
        memoMeasure.value = '';
        feedbackMemo.value = '';
        selectedAnxietyLevelInput.value = '';
        document.querySelectorAll('.anxiety-btn').forEach(btn => btn.classList.remove('selected'));

        expGainMessage.textContent = '';
        levelUpTransitionMessage.textContent = '';
        levelUpDisplayMessage.textContent = '';

        showScreen('greeting'); // 最初の画面に戻る
    });

});