document.addEventListener('DOMContentLoaded', () => {
    // ======================================================
    // 1. 画面要素の取得と初期設定
    // ======================================================
    const screens = {
        greeting: document.getElementById('greetingScreen'),
        statusSelection: document.getElementById('statusSelectionScreen'),
        meaningConfirmation: document.getElementById('meaningConfirmationScreen'),
        valuesConfirmation: document.getElementById('valuesConfirmationScreen'),
        ambiguousGoal: document.getElementById('ambiguousGoalScreen'),
        weeklyProgress: document.getElementById('weeklyProgressScreen'),
        preTask: document.getElementById('preTaskScreen'),
        inTask: document.getElementById('inTaskScreen'),
        levelUp: document.getElementById('levelUpScreen'),
        progressAnimation: document.getElementById('progressAnimationScreen'),
        anxietyConsultation: document.getElementById('anxietyConsultationScreen'),
        otherAppAccess: document.getElementById('otherAppAccessScreen'),
        // restOrProceed: document.getElementById('restOrProceedScreen'), // HTMLでコメントアウトしたのでここもコメントアウト
        rest: document.getElementById('restScreen'),
        progressConfirmation: document.getElementById('progressConfirmationScreen'),
    };

    // グローバルにアクセスするDOM要素
    const greetingElement = document.getElementById('greeting');
    const datetimeElement = document.getElementById('datetime');

    // 経験値・レベル関連の要素
    const currentLevelSpan = document.getElementById('currentLevel');
    const currentExpSpan = document.getElementById('currentExp');
    const nextLevelExpSpan = document.getElementById('nextLevelExp');
    const expBar = document.getElementById('expBar');
    const expGainMessage = document.getElementById('expGainMessage');
    const levelUpTransitionMessage = document.getElementById('levelUpTransitionMessage');
    const levelUpDisplayMessage = document.getElementById('levelUpDisplayMessage');

    // preTaskScreen
    const selectedEventDisplay = document.getElementById('selectedEventDisplay');
    const anxietyLevelSelect = document.getElementById('anxietyLevelSelect');
    const memoTime = document.getElementById('memoTime');

    // weeklyProgressScreen
    const addNewEventBtn = document.getElementById('addNewEventBtn');
    const eventListContainer = document.getElementById('eventListContainer');
    const toPreTaskBtnFromWeekly = document.getElementById('toPreTaskBtnFromWeekly');
    const viewProgressBtn = document.getElementById('viewProgressBtn');

    // inTaskScreen
    const currentTaskDisplay = document.getElementById('currentTaskDisplay');
    const elapsedTimeCounter = document.getElementById('elapsedTimeCounter');

    // progressConfirmationScreen
    const completedCountSpan = document.getElementById('completedCount');
    const totalExpDisplaySpan = document.getElementById('totalExpDisplay');
    const completedEventsList = document.getElementById('completedEventsList');

    // イベント追加モーダル
    const addEventModal = document.getElementById('addEventModal');
    const modalEventNameInput = document.getElementById('modalEventName');
    const modalEventDeadlineInput = document.getElementById('modalEventDeadline');
    const modalEventAmountInput = document.getElementById('modalEventAmount');
    const saveEventBtn = document.getElementById('saveEventBtn');
    const closeModalButton = addEventModal.querySelector('.close-button');

    // 完了した量を記録モーダル
    const recordCompletedAmountModal = document.getElementById('recordCompletedAmountModal');
    const completedAmountEventNameDisplay = document.getElementById('completedAmountEventNameDisplay');
    const modalCompletedAmountInput = document.getElementById('modalCompletedAmount');
    const saveCompletedAmountBtn = document.getElementById('saveCompletedAmountBtn');
    const closeRecordModalButton = recordCompletedAmountModal.querySelector('.close-record-modal');

    // 進捗アニメーション画面
    const progressAnimationEventName = document.getElementById('progressAnimationEventName');
    const progressAnimationBar = document.getElementById('progressAnimationBar');
    const progressAnimationPercentage = document.getElementById('progressAnimationPercentage');
    const progressAnimationAmountText = document.getElementById('progressAnimationAmountText');
    const toRestBtnFromAnimation = document.getElementById('toRestBtnFromAnimation');
    const toWeeklyProgressBtnFromAnimation = document.getElementById('toWeeklyProgressBtnFromAnimation');

    // levelUpScreen に新しく追加したボタン
    const levelUpToRestBtn = document.getElementById('levelUpToRestBtn');
    const levelUpToWeeklyProgressBtn = document.getElementById('levelUpToWeeklyProgressBtn');

    // ⑫別アプリページ (otherAppAccessScreen) のDOM要素
    const appTypeSelectionGrid = document.getElementById('appTypeSelectionGrid');
    const accessResearchBtn = document.getElementById('accessResearchBtn');
    const accessOtherAppBtn = document.getElementById('accessOtherAppBtn');
    const researchAppsSection = document.getElementById('researchApps');
    const otherAppsSection = document.getElementById('otherApps');

    // 各ボタン
    const statusMorningBtn = document.getElementById('statusMorningBtn');
    const statusEventBtn = document.getElementById('statusEventBtn');
    const statusAnxietyBtn = document.getElementById('statusAnxietyBtn');
    const statusOtherAppBtn = document.getElementById('statusOtherAppBtn');
    const statusRestBtn = document.getElementById('statusRestBtn');

    const toValuesBtn = document.getElementById('toValuesBtn');
    const toAmbiguousGoalBtn = document.getElementById('toAmbiguousGoalBtn');
    const toWeeklyProgressFromAmbiguousBtn = document.getElementById('toWeeklyProgressFromAmbiguousBtn');

    const startTaskBtn = document.getElementById('startTaskBtn');
    const endTaskBtn = document.getElementById('endTaskBtn');

    const toWeeklyProgressBtnFromRest = document.getElementById('toWeeklyProgressBtnFromRest');

    // ★追加: グローバル戻るボタンのDOM要素
    const globalBackButton = document.getElementById('global-back-button');

    // ★削除: 各画面ごとの「戻る」ボタンのDOM要素はHTMLから削除されたため、ここも削除
    // const backToStatusSelectionFromMeaningBtn = document.getElementById('backToStatusSelectionFromMeaningBtn');
    // const backToMeaningBtn = document.getElementById('backToMeaningBtn');
    // const backToValuesBtn = document.getElementById('backToValuesBtn');
    // const backToStatusSelectionFromWeeklyBtn = document.getElementById('backToStatusSelectionFromWeeklyBtn');
    // const backToWeeklyFromPreTaskBtn = document.getElementById('backToWeeklyFromPreTaskBtn');
    // const backToWeeklyProgressBtnFromProgress = document.getElementById('backToWeeklyProgressBtnFromProgress');
    // const backToStatusSelectionFromRestBtn = document.getElementById('backToStatusSelectionFromRestBtn');
    // const backToStatusSelectionFromAnxietyBtn = document.getElementById('backToStatusSelectionFromAnxietyBtn');
    // const backToStatusSelectionFromOtherAppBtn = document.getElementById('backToStatusSelectionFromOtherAppBtn');
    // const backToStatusSelectionFromInTaskBtn = document.getElementById('backToStatusSelectionFromInTaskBtn');
    // const backToStatusSelectionFromAnimationBtn = document.getElementById('backToStatusSelectionFromAnimationBtn');
    // const backToStatusSelectionFromLevelUpBtn = document.getElementById('backToStatusSelectionFromLevelUpBtn');


    // アプリケーションの状態変数
    let userLevel = parseInt(localStorage.getItem('userLevel')) || 1;
    let userExp = parseInt(localStorage.getItem('userExp')) || 0;
    let selectedAnxietyLevel = 0;
    let currentSelectedEvent = null;
    let userEvents = [];
    let eventObjectBeingCompleted = null;
    let taskStartTime = null;
    let elapsedTimeInterval = null;
    let notificationTimerId = null; // 通知タイマーのID

    // ★追加: 画面履歴を保存する配列
    let screenHistory = [];
    let currentScreenId = ''; // 現在表示されている画面のID

    try {
        const storedEvents = JSON.parse(localStorage.getItem('userEvents'));
        if (Array.isArray(storedEvents)) {
            userEvents = storedEvents.map(event => {
                const parsedAmount = parseAmountString(event.amount || '');
                const parsedCompletedAmount = parseAmountString(event.completedAmount || '');
                return {
                    name: typeof event === 'string' ? event : event.name || '不明なイベント',
                    completed: event.completed || false,
                    addedDate: event.addedDate || new Date().toISOString().split('T')[0],
                    gainedExp: event.gainedExp || 0,
                    completedDate: event.completedDate || null,
                    deadline: event.deadline || null,
                    amount: event.amount || null,
                    parsedAmount: parsedAmount,
                    completedAmount: event.completedAmount || null,
                    parsedCompletedAmount: parsedCompletedAmount,
                    actualElapsedTimeMinutes: event.actualElapsedTimeMinutes || 0
                };
            });
        }
    } catch (e) {
        console.error("Failed to parse userEvents from localStorage:", e);
        userEvents = [];
    }

    // ======================================================
    // 2. 画面遷移と共通ユーティリティ関数
    // ======================================================

    /**
     * 指定された画面を表示し、他の画面を非表示にする
     * @param {string} screenId - 表示する画面のID (screensオブジェクトのキー)
     * @param {boolean} isBackAction - 戻るボタンによる遷移かどうか (履歴に追加しないため)
     */
    function showScreen(screenId, isBackAction = false) {
        Object.values(screens).forEach(screen => {
            screen.classList.remove('active');
            // 非アクティブな画面は完全に非表示にする
            screen.style.visibility = 'hidden'; 
        });

        // アクティブな画面を表示
        const targetScreen = screens[screenId];
        targetScreen.style.visibility = 'visible'; // まず表示を有効にする
        targetScreen.classList.add('active'); // その後activeクラスを付与してopacityを1にする

        // 画面が切り替わったときに最上部にスクロール
        targetScreen.scrollTop = 0; // ターゲット画面自体をスクロール
        document.body.scrollTop = 0; // bodyのスクロールをリセット
        document.documentElement.scrollTop = 0; // htmlのスクロールをリセット

        // ★履歴管理ロジック
        if (!isBackAction) { // 戻るアクションでない場合のみ履歴に追加
            if (currentScreenId && currentScreenId !== screenId) { // 同じ画面への遷移や初回起動時以外
                screenHistory.push(currentScreenId);
            }
        }
        currentScreenId = screenId; // 現在の画面を更新

        // ★グローバル戻るボタンの表示/非表示制御
        // 戻るボタンを非表示にする画面のIDを配列で管理 (例: 最初の挨拶画面、状況選択画面)
        const screensWithoutBackButton = ['greeting', 'statusSelection']; 
        if (screensWithoutBackButton.includes(screenId)) {
            globalBackButton.style.display = 'none';
        } else {
            globalBackButton.style.display = 'block'; // または 'inline-block'
        }

        // タスク実行画面以外に遷移したらタイマーを停止・リセット
        if (screenId !== 'inTask') {
            if (elapsedTimeInterval) {
                clearInterval(elapsedTimeInterval);
                elapsedTimeInterval = null;
            }
            if (elapsedTimeCounter) {
                elapsedTimeCounter.textContent = '00:00:00';
            }
        }
        
        // 画面が切り替わったら通知タイマーをクリア (無効化)
        if (notificationTimerId) {
            clearTimeout(notificationTimerId);
            notificationTimerId = null;
            console.log("通知タイマーをクリアしました。");
        }
        
        // otherAppAccessScreenに遷移する際は、アプリ選択画面を初期表示
        if (screenId === 'otherAppAccess') {
            if (appTypeSelectionGrid) appTypeSelectionGrid.style.display = 'grid'; // メインの選択ボタングリッドを表示
            if (researchAppsSection) researchAppsSection.style.display = 'none';
            if (otherAppsSection) otherAppsSection.style.display = 'none';
        }
    }

    /**
     * 日付と時刻、時間帯に応じた挨拶文を更新表示する
     */
    function updateDateTimeAndGreeting() {
        const now = new Date();
        const month = (now.getMonth() + 1).toString();
        const day = now.getDate().toString();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const weekday = ["日", "月", "火", "水", "木", "金", "土"][now.getDay()];

        datetimeElement.textContent = `${month}月${day}日(${weekday}) ${hours}時${minutes}分です`;

        const hour = now.getHours();
        const currentMinutes = now.getMinutes();
        let greeting = "";
        let userName = "諏原さん";

        if (hour >= 5 && (hour < 10 || (hour === 10 && currentMinutes < 30))) {
            greeting = `${userName}！おはようございます！`;
        } else if ((hour >= 10 && (hour > 10 || currentMinutes >= 30)) && hour < 17) {
            greeting = `${userName}！こんにちは！`;
        } else {
            greeting = `${userName}！こんばんは！`;
        }
        greetingElement.textContent = greeting;
    }

    /**
     * ドロップダウンリストのオプションを生成する
     */
    function populateAnxietyLevelSelect() {
        anxietyLevelSelect.innerHTML = '<option value="">選択してください</option>';
        for (let i = 0; i <= 10; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            anxietyLevelSelect.appendChild(option);
        }
    }

    /**
     * 文字列から数値と単位をパースするヘルパー関数
     * 例: "100分" -> 100, "5ページ" -> 5, "2時間" -> 2
     * @param {string} amountStr - 量を表す文字列
     * @returns {number} パースされた数値。パースできない場合は0。
     */
    function parseAmountString(amountStr) {
        if (!amountStr) return 0;
        const match = amountStr.match(/^(\d+(\.\d+)?)/);
        return match ? parseFloat(match[1]) : 0;
    }

    /**
     * 秒数をHH:MM:SS形式にフォーマットする
     * @param {number} totalSeconds - 合計秒数
     * @returns {string} フォーマットされた時間文字列
     */
    function formatTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (num) => num.toString().padStart(2, '0');
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }


    // ======================================================
    // 3. 経験値・レベルシステム
    // ======================================================

    /**
     * レベルアップに必要な経験値を計算する関数
     * @param {number} level - 現在のレベル
     * @returns {number} 次のレベルに必要な経験値
     */
    function getExpNeededForNextLevel(level) {
        if (level === 1) return 100;
        if (level === 2) return 250;
        if (level === 3) return 450;
        if (level === 4) return 700;
        if (level === 5) return 1000;
        return 1000 + (level - 5) * 300;
    }

    /**
     * ユーザーのレベルと経験値を更新し、表示を更新する
     */
    function updateUserInfo() {
        const nextExpThreshold = getExpNeededForNextLevel(userLevel);

        currentLevelSpan.textContent = userLevel;
        currentExpSpan.textContent = userExp;
        nextLevelExpSpan.textContent = nextExpThreshold;

        const expPercentage = (userExp / nextExpThreshold) * 100;
        expBar.style.width = `${Math.min(expPercentage, 100)}%`;

        localStorage.setItem('userLevel', userLevel);
        localStorage.setItem('userExp', userExp);
    }

    /**
     * 経験値を追加し、レベルアップ判定を行う
     * @param {number} exp - 追加する経験値
     * @returns {boolean} レベルアップしたかどうか
     */
    function addExp(exp) {
        userExp += exp;
        let leveledUp = false;
        while (userExp >= getExpNeededForNextLevel(userLevel)) {
            userExp -= getExpNeededForNextLevel(userLevel);
            userLevel++;
            levelUpDisplayMessage.textContent = `レベルが ${userLevel} に上がりました！`;
            leveledUp = true;
        }
        updateUserInfo();
        return leveledUp;
    }

    /**
     * 不安度、予測時間、実測時間に基づいて経験値を計算する新しい関数
     * @param {number} anxiety - 0から10までの不安度
     * @param {number} predictedTimeMinutes - 予測時間（分）
     * @param {number} actualTimeMinutes - 実測時間（分）
     * @returns {number} 獲得経験値
     */
    function calculateExpWithTime(anxiety, predictedTimeMinutes, actualTimeMinutes) {
        anxiety = parseInt(anxiety);
        if (isNaN(anxiety) || anxiety < 0 || anxiety > 10) {
            anxiety = 0;
        }

        const baseExp = (anxiety + 1) * 15;

        let timeBonus = 0;
        if (predictedTimeMinutes > 0 && actualTimeMinutes > 0) {
            const timeDifferenceRatio = (predictedTimeMinutes - actualTimeMinutes) / predictedTimeMinutes;

            if (timeDifferenceRatio >= 0) {
                timeBonus = baseExp * 0.5 * timeDifferenceRatio;
            } else {
                timeBonus = baseExp * 0.3 * timeDifferenceRatio;
            }
        }
        
        return Math.max(10, Math.round(baseExp + timeBonus));
    }


    // ======================================================
    // 4. イベント管理 (weeklyProgressScreen & progressConfirmationScreen 関連)
    // ======================================================

    /**
     * ユーザーイベントリストをLocalStorageに保存する
     */
    function saveUserEvents() {
        localStorage.setItem('userEvents', JSON.stringify(userEvents));
    }

    /**
     * 指定されたイベントのアイコンを返す
     * @param {string} eventName - イベント名
     * @returns {string} アイコンの絵文字
     */
    function getEventIcon(eventName) {
        if (typeof eventName !== 'string' || !eventName) {
            return '❓';
        }
        if (eventName.includes('資料作成')) return '📝';
        if (eventName.includes('読書')) return '📚';
        if (eventName.includes('運動')) return '🏃';
        if (eventName.includes('勉強')) return '🧠';
        if (eventName.includes('掃除')) return '🧹';
        if (eventName.includes('ミーティング')) return '🤝';
        if (eventName.includes('メール')) return '✉️';
        if (eventName.includes('休憩')) return '☕';
        return '✨';
    }

    /**
     * イベントリストをDOMに表示する (新しいカードデザイン)
     * weeklyProgressScreenでは未完了のイベントのみ表示
     */
    function renderEventList() {
        eventListContainer.innerHTML = '';

        const incompleteEvents = userEvents.filter(event => !event.completed);

        if (incompleteEvents.length === 0) {
            eventListContainer.innerHTML = '<p style="color:#666; font-size:0.9em; text-align:center; padding: 20px 0;">未完了のイベントはありません。<br>「＋新しいイベントを追加」で作成しましょう。</p>';
            toPreTaskBtnFromWeekly.style.display = 'none';
            currentSelectedEvent = null;
        } else {
            incompleteEvents.forEach((eventObj, index) => {
                const eventItem = document.createElement('div');
                eventItem.classList.add('event-item', 'goal-card');

                let progressBarWidth = '0%';
                let progressBarColor = '#ffc107';
                let progressPercentageText = '0%';
                let statusText = '未開始';

                if (eventObj.parsedAmount > 0) {
                    const progress = (eventObj.parsedCompletedAmount / eventObj.parsedAmount) * 100;
                    progressBarWidth = `${Math.min(progress, 100)}%`;
                    progressPercentageText = `${Math.round(progress)}%`;
                    statusText = '進行中';
                    if (progress >= 100) {
                        progressBarColor = '#28a745';
                        statusText = '完了可能';
                    } else if (progress > 0) {
                        progressBarColor = '#007bff';
                    }
                }

                const deadlineText = eventObj.deadline ? `期限: ${eventObj.deadline}` : '';
                const amountText = eventObj.amount ? `目標: ${eventObj.amount}` : '';
                const completedAmountText = eventObj.parsedCompletedAmount > 0 ? `完了: ${eventObj.completedAmount || '0'}${eventObj.amount ? eventObj.amount.replace(/^(\d+(\.\d+)?)/, '') : ''}` : '';

                const detailsParts = [deadlineText, amountText, completedAmountText].filter(Boolean);
                const optionalDetails = detailsParts.length > 0 ? ` (${detailsParts.join(' | ')})` : '';


                eventItem.innerHTML = `
                    <div class="goal-icon">${getEventIcon(eventObj.name)}</div>
                    <div class="goal-details">
                        <h3>${eventObj.name}</h3>
                        <p class="goal-period">${statusText} ${optionalDetails}</p>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${progressBarWidth}; background-color: ${progressBarColor};"></div>
                            <span class="progress-percentage">${progressPercentageText}</span>
                        </div>
                    </div>
                    <input type="radio" id="event-${index}" name="selectedEvent" value="${eventObj.name}">
                    <label for="event-${index}" class="radio-label"></label>
                `;
                eventListContainer.appendChild(eventItem);

                const radioButton = eventItem.querySelector(`input[type="radio"]`);
                eventItem.addEventListener('click', () => {
                    radioButton.checked = true;
                    currentSelectedEvent = eventObj.name;
                    highlightSelectedEvent(eventItem);
                    toPreTaskBtnFromWeekly.style.display = 'block';
                });
                radioButton.addEventListener('change', () => {
                    currentSelectedEvent = eventObj.name;
                    highlightSelectedEvent(eventItem);
                    toPreTaskBtnFromWeekly.style.display = 'block';
                });
            });

            if (currentSelectedEvent) {
                const selectedRadio = eventListContainer.querySelector(`input[value="${currentSelectedEvent}"]`);
                if (selectedRadio && selectedRadio.closest('.event-item')) {
                    highlightSelectedEvent(selectedRadio.closest('.event-item'));
                    toPreTaskBtnFromWeekly.style.display = 'block';
                } else {
                    currentSelectedEvent = null;
                    toPreTaskBtnFromWeekly.style.display = 'none';
                }
            } else {
                toPreTaskBtnFromWeekly.style.display = 'none';
            }
        }
    }

    /**
     * 選択されたイベントアイテムをハイライトする
     * @param {HTMLElement} selectedItem - 選択されたイベントアイテムのDOM要素
     */
    function highlightSelectedEvent(selectedItem) {
        document.querySelectorAll('.event-item').forEach(item => {
            item.classList.remove('selected');
        });
        if (selectedItem) {
            selectedItem.classList.add('selected');
        }
    }

    /**
     * 完了済みイベントリストを表示する (進捗確認画面用)
     */
    function renderCompletedEvents() {
        completedEventsList.innerHTML = '';
        const completed = userEvents.filter(event => event.completed);

        if (completed.length === 0) {
            completedEventsList.innerHTML = '<p style="color:#666; font-size:0.9em; text-align:center;">まだ完了したイベントはありません。</p>';
        }

        let totalExpEarned = 0;

        completed.sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate));

        completed.forEach(eventObj => {
            totalExpEarned += eventObj.gainedExp || 0;
            const eventItem = document.createElement('div');
            eventItem.classList.add('completed-event-item');

            const deadlineText = eventObj.deadline ? `期限: ${eventObj.deadline}` : '';
            const amountText = eventObj.amount ? `目標: ${eventObj.amount}` : '';
            const completedAmountText = eventObj.completedAmount ? `完了: ${eventObj.completedAmount}` : '';
            const actualTimeText = eventObj.actualElapsedTimeMinutes ? `実測: ${eventObj.actualElapsedTimeMinutes}分` : '';


            const detailsParts = [deadlineText, amountText, completedAmountText, actualTimeText].filter(Boolean);
            const optionalDetails = detailsParts.length > 0 ? ` (${detailsParts.join(' | ')})` : '';


            eventItem.innerHTML = `
                <span class="icon">${getEventIcon(eventObj.name)}</span>
                <div class="details">
                    <div class="event-name">${eventObj.name}</div>
                    <div class="event-date">完了日: ${eventObj.completedDate || 'N/A'}${optionalDetails}</div>
                </div>
                <div class="event-exp">+${eventObj.gainedExp || 0} Exp</div>
            `;
            completedEventsList.appendChild(eventItem);
        });

        completedCountSpan.textContent = completed.length;
        totalExpDisplaySpan.textContent = totalExpEarned;
    }

    // モーダルの表示・非表示を管理する関数
    function showModal(modalElement) {
        modalElement.style.display = 'flex'; // Flexboxで表示
        setTimeout(() => {
            modalElement.classList.add('active');
        }, 10); // 短い遅延
    }

    function hideModal(modalElement) {
        modalElement.classList.remove('active');
        setTimeout(() => {
            modalElement.style.display = 'none';
        }, 300); // CSSのtransition時間 (0.3s) と合わせる
    }


    // ======================================================
    // 5. イベントリスナーの設定
    // ======================================================

    updateUserInfo();
    updateDateTimeAndGreeting();
    populateAnxietyLevelSelect();

    // 初期表示
    showScreen('greeting', false); // 初回は履歴に追加しない
    setTimeout(() => {
        showScreen('statusSelection', false); // 2秒後にステータス選択画面へ（これも履歴に追加しない）
    }, 2000);

    // ★グローバル戻るボタンのイベントリスナー
    globalBackButton.addEventListener('click', () => {
        if (screenHistory.length > 0) {
            const prevScreenId = screenHistory.pop(); // 履歴から前の画面IDを取得
            showScreen(prevScreenId, true); // 前の画面へ戻る (isBackAction = true)
        } else {
            // 履歴がない場合（通常は発生しないはずだが、念のため初期画面に戻す）
            showScreen('statusSelection', true); 
        }
    });

    // --- ②状況確認画面からの遷移 ---
    statusMorningBtn.addEventListener('click', () => {
        showScreen('meaningConfirmation');
    });

    statusEventBtn.addEventListener('click', () => {
        showScreen('ambiguousGoal');
    });

    statusAnxietyBtn.addEventListener('click', () => {
        showScreen('anxietyConsultation');
    });

    statusOtherAppBtn.addEventListener('click', () => {
        showScreen('otherAppAccess');
    });

    statusRestBtn.addEventListener('click', () => {
        showScreen('rest');
    });


    // --- ③文章表示ページからの遷移 ---
    toValuesBtn.addEventListener('click', () => {
        showScreen('valuesConfirmation');
    });

    toAmbiguousGoalBtn.addEventListener('click', () => {
        showScreen('ambiguousGoal');
    });


    // --- ④曖昧目標ページからの遷移 ---
    toWeeklyProgressFromAmbiguousBtn.addEventListener('click', () => {
        renderEventList();
        showScreen('weeklyProgress');
    });


    // --- ⑤イベント管理ページ (リスト表示部分)でのイベント操作 ---
    addNewEventBtn.addEventListener('click', () => {
        showModal(addEventModal);
        modalEventNameInput.value = '';
        modalEventDeadlineInput.value = '';
        modalEventAmountInput.value = '';
        modalEventNameInput.focus();
    });

    closeModalButton.addEventListener('click', () => {
        hideModal(addEventModal);
    });

    closeRecordModalButton.addEventListener('click', () => {
        hideModal(recordCompletedAmountModal);
    });

    window.addEventListener('click', (event) => {
        if (event.target === addEventModal) {
            hideModal(addEventModal);
        }
        if (event.target === recordCompletedAmountModal) {
            hideModal(recordCompletedAmountModal);
        }
    });

    saveEventBtn.addEventListener('click', () => {
        const eventName = modalEventNameInput.value.trim();
        const eventDeadline = modalEventDeadlineInput.value;
        const eventAmount = modalEventAmountInput.value.trim();
        const parsedEventAmount = parseAmountString(eventAmount);

        if (!eventName) {
            alert('イベント名を入力してください！');
            return;
        }
        if (eventAmount && parsedEventAmount <= 0) {
            alert('量/目標は0より大きい数値を入力してください。単位も含むことができます (例: 100分)。');
            return;
        }

        userEvents.push({
            name: eventName,
            completed: false,
            addedDate: new Date().toISOString().split('T')[0],
            gainedExp: 0,
            completedDate: null,
            deadline: eventDeadline || null,
            amount: eventAmount || null,
            parsedAmount: parsedEventAmount,
            completedAmount: null,
            parsedCompletedAmount: 0,
            actualElapsedTimeMinutes: 0
        });
        saveUserEvents();
        renderEventList();
        hideModal(addEventModal);
    });

    toPreTaskBtnFromWeekly.addEventListener('click', () => {
        if (!currentSelectedEvent) {
            alert('イベントを選択してください！');
            return;
        }
        selectedEventDisplay.value = currentSelectedEvent;
        memoTime.value = '';
        anxietyLevelSelect.value = '';
        showScreen('preTask');
        anxietyLevelSelect.focus();
    });

    viewProgressBtn.addEventListener('click', () => {
        renderCompletedEvents();
        showScreen('progressConfirmation');
    });


    startTaskBtn.addEventListener('click', () => {
        const anxietyValue = anxietyLevelSelect.value;
        const predictedTime = parseFloat(memoTime.value);

        if (!anxietyValue || anxietyValue === "") {
            alert('抵抗感を選択してください！');
            return;
        }
        if (isNaN(predictedTime) || predictedTime <= 0) {
            alert('予測時間は正の数値を入力してください！');
            return;
        }

        selectedAnxietyLevel = parseInt(anxietyValue);
        currentTaskDisplay.textContent = currentSelectedEvent;
        taskStartTime = new Date();

        if (elapsedTimeInterval) {
            clearInterval(elapsedTimeInterval);
        }
        
        let secondsElapsed = 0;
        elapsedTimeCounter.textContent = formatTime(secondsElapsed);

        elapsedTimeInterval = setInterval(() => {
            secondsElapsed = Math.floor((new Date() - taskStartTime) / 1000);
            elapsedTimeCounter.textContent = formatTime(secondsElapsed);
        }, 1000);

        showScreen('inTask');
    });

    endTaskBtn.addEventListener('click', () => {
        if (!taskStartTime) {
            alert("エラー: タスク開始時刻が記録されていません。");
            return;
        }
        if (elapsedTimeInterval) {
            clearInterval(elapsedTimeInterval);
            elapsedTimeInterval = null;
        }

        const taskEndTime = new Date();
        const elapsedTimeMs = taskEndTime - taskStartTime;
        const elapsedTimeMinutes = Math.round(elapsedTimeMs / (1000 * 60));

        showModal(recordCompletedAmountModal);
        completedAmountEventNameDisplay.textContent = `イベント: 「${currentSelectedEvent}」`;
        modalCompletedAmountInput.value = '';
        modalCompletedAmountInput.focus();

        const eventToUpdateIndex = userEvents.findIndex(event => event.name === currentSelectedEvent && !event.completed);
        if (eventToUpdateIndex !== -1) {
            eventObjectBeingCompleted = userEvents[eventToUpdateIndex];
            eventObjectBeingCompleted.predictedTimeMinutes = parseFloat(memoTime.value);
            eventObjectBeingCompleted.actualElapsedTimeMinutes = elapsedTimeMinutes;
        } else {
            console.error("完了しようとしているイベントが見つかりません。");
            eventObjectBeingCompleted = null;
        }
    });

    saveCompletedAmountBtn.addEventListener('click', () => {
        const currentInputAmountStr = modalCompletedAmountInput.value.trim();
        const currentInputAmountNum = parseAmountString(currentInputAmountStr);

        if (currentInputAmountNum <= 0) {
            alert('完了した量を正しく入力してください。');
            return;
        }

        if (!eventObjectBeingCompleted) {
            alert('エラー: 処理中のイベントが見つかりません。');
            hideModal(recordCompletedAmountModal);
            resetAndGoToGreeting();
            return;
        }

        eventObjectBeingCompleted.parsedCompletedAmount = (eventObjectBeingCompleted.parsedCompletedAmount || 0) + currentInputAmountNum;
        const unitMatch = (eventObjectBeingCompleted.amount || '').match(/(\D+)$/);
        const unit = unitMatch ? unitMatch[1] : '';
        eventObjectBeingCompleted.completedAmount = `${eventObjectBeingCompleted.parsedCompletedAmount}${unit}`;

        let isTaskCompleted = false;

        if (eventObjectBeingCompleted.parsedAmount > 0) {
            if (eventObjectBeingCompleted.parsedCompletedAmount >= eventObjectBeingCompleted.parsedAmount) {
                isTaskCompleted = true;
            }
        } else {
            isTaskCompleted = true; // 目標量が設定されていない場合は、量を記録したら完了とみなす
        }

        const gainedExp = calculateExpWithTime(
            selectedAnxietyLevel,
            eventObjectBeingCompleted.predictedTimeMinutes,
            eventObjectBeingCompleted.actualElapsedTimeMinutes
        );

        const leveledUp = addExp(gainedExp); // 経験値を追加し、レベルアップ判定を行う

        if (isTaskCompleted) {
            eventObjectBeingCompleted.completed = true;
            eventObjectBeingCompleted.gainedExp = gainedExp;
            eventObjectBeingCompleted.completedDate = new Date().toISOString().split('T')[0];
        } else {
            // タスクが未完了の場合でも、獲得経験値を加算し続ける
            eventObjectBeingCompleted.gainedExp += gainedExp; 
        }

        saveUserEvents();

        hideModal(recordCompletedAmountModal);

        // 必ずprogressAnimationScreenを表示
        showScreen('progressAnimation');
        progressAnimationEventName.textContent = `イベント: 「${eventObjectBeingCompleted.name}」`;
        expGainMessage.textContent = `+${gainedExp} Exp獲得！`;

        let currentProgress = 0;
        if (eventObjectBeingCompleted.parsedAmount > 0) {
            currentProgress = (eventObjectBeingCompleted.parsedCompletedAmount / eventObjectBeingCompleted.parsedAmount) * 100;
        } else if (isTaskCompleted) {
            currentProgress = 100;
        }

        // アニメーションの初期化
        progressAnimationBar.style.width = '0%';
        progressAnimationPercentage.textContent = '0%';
        progressAnimationAmountText.textContent = `完了: ${eventObjectBeingCompleted.completedAmount || '0'} / 目標: ${eventObjectBeingCompleted.amount || 'なし'}`;

        // 少し遅延させてアニメーションを開始
        setTimeout(() => {
            progressAnimationBar.style.width = `${Math.min(currentProgress, 100)}%`;
            progressAnimationPercentage.textContent = `${Math.round(currentProgress)}%`;

            // プログレスバーの色変更
            if (currentProgress >= 100) {
                progressAnimationBar.style.backgroundColor = '#28a745'; // 完了色
            } else if (currentProgress > 0) {
                progressAnimationBar.style.backgroundColor = '#007bff'; // 進行中色
            } else {
                progressAnimationBar.style.backgroundColor = '#ffc107'; // 未開始色
            }
        }, 100); // 短いディレイでアニメーション開始

        // アニメーション完了後に次の画面へ遷移 (2.5秒後)
        setTimeout(() => {
            if (leveledUp) {
                showScreen('levelUp'); // レベルアップ画面へ
            } else {
                // レベルアップしない場合はprogressAnimationScreenにとどまる
                // ユーザーは画面上のボタンで次の行動を選択する
            }
            selectedAnxietyLevel = 0;
            currentSelectedEvent = null;
            taskStartTime = null;
            eventObjectBeingCompleted = null;
        }, 2500); // アニメーションが完了するのに十分な時間 (例: 2.5秒)
    });

    // --- ⑦メッセージページ (進捗アニメーション) からの遷移 ---
    toRestBtnFromAnimation.addEventListener('click', () => {
        showScreen('rest');
    });

    toWeeklyProgressBtnFromAnimation.addEventListener('click', () => {
        renderEventList(); // イベントリストを更新してから遷移
        showScreen('weeklyProgress');
    });


    // --- ⑧レベルアップ画面からの遷移 ---
    levelUpToRestBtn.addEventListener('click', () => {
        showScreen('restScreen');
    });
    levelUpToWeeklyProgressBtn.addEventListener('click', () => {
        renderEventList(); // イベントリストを更新してから遷移
        showScreen('weeklyProgress');
    });


    // --- ⑩休憩ページからの遷移 ---
    toWeeklyProgressBtnFromRest.addEventListener('click', () => {
        renderEventList();
        showScreen('weeklyProgress');
    });

    // ⑫別アプリページ内の選択肢ボタンのイベントリスナー
    accessResearchBtn.addEventListener('click', () => {
        if (appTypeSelectionGrid) appTypeSelectionGrid.style.display = 'none';
        if (researchAppsSection) researchAppsSection.style.display = 'grid';
        if (otherAppsSection) otherAppsSection.style.display = 'none';
    });

    accessOtherAppBtn.addEventListener('click', async () => {
        if (appTypeSelectionGrid) appTypeSelectionGrid.style.display = 'none';
        if (researchAppsSection) researchAppsSection.style.display = 'none';
        if (otherAppsSection) otherAppsSection.style.display = 'grid';

        if (Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                alert('通知の許可がありません。アプリに戻る時間になっても通知できません。');
                return;
            }
        } else if (Notification.permission === 'denied') {
            alert('通知がブロックされています。ブラウザ設定から通知を許可してください。');
            return;
        }

        const notificationDelayMinutes = 15;
        console.log(`${notificationDelayMinutes}分後に通知をスケジュールしました。`);

        if (notificationTimerId) {
            clearTimeout(notificationTimerId);
        }

        notificationTimerId = setTimeout(() => {
            if (Notification.permission === 'granted') {
                new Notification('儀式アプリからのお知らせ', {
                    body: `${notificationDelayMinutes}分経過しました。\nそろそろ儀式アプリに戻りましょう！`,
                    icon: 'You are free.png',
                    vibrate: [200, 100, 200]
                });
            }
            notificationTimerId = null;
        }, notificationDelayMinutes * 60 * 1000);
    });

    // アプリケーションの状態をリセットして挨拶画面に戻る共通関数
    function resetAndGoToGreeting() {
        if (modalEventNameInput) modalEventNameInput.value = '';
        if (modalEventDeadlineInput) modalEventDeadlineInput.value = '';
        if (modalEventAmountInput) modalEventAmountInput.value = '';
        if (modalCompletedAmountInput) modalCompletedAmountInput.value = '';
        memoTime.value = '';
        anxietyLevelSelect.value = '';
        currentSelectedEvent = null;
        taskStartTime = null;
        eventObjectBeingCompleted = null;
        renderEventList();

        expGainMessage.textContent = '';
        levelUpDisplayMessage.textContent = '';
        updateUserInfo();

        updateDateTimeAndGreeting();
        showScreen('greeting');
        setTimeout(() => {
            showScreen('statusSelection');
        }, 2000);

        if (notificationTimerId) {
            clearTimeout(notificationTimerId);
            notificationTimerId = null;
            console.log("通知タイマーをクリアしました。");
        }
    }
});