// 預設背景資源

const vidNum = 1;
const imgNum = 5;
const voiceNum = 6;
const voiceL = [13,11,11,10,13,8];

let cgIndex = -1;
let preVoiceIndex = 0;
let audio = null;
let timer = null;

let defCG = 0;
let birthday = false;
let showDialog = true;
let showButton = true;
let lang = 0;
let volume = 50;

// 獲取元素
const videoElement = document.getElementById('background-video');
const imageElement = document.getElementById('background-image');
const button = document.getElementById('change-bg-button');
const chat = document.getElementById('chat');


// 更換背景的函數
function changeBackground(init) {
    if (init||showButton) {
        cgIndex = (cgIndex + 1) % (vidNum + imgNum); // 切換背景索引

        if (cgIndex < vidNum) {
            console.log("v");
            videoElement.src = `resource/video/${cgIndex}.webm`;
            videoElement.onloadeddata = () => {
                videoElement.play(); // 播放影片
                imageElement.style.display = 'none'; // 隱藏圖片
            };
        } else {
            console.log("i");
            if (audio!=null) {
                audio.pause();
                clearChat();
            }
            imageElement.src = `resource/image/${cgIndex}.png`;
            imageElement.style.display = 'block';
            videoElement.pause();
        }
    }
    
}

button.addEventListener('click', function () {changeBackground(false)});

// 當點擊影片背景時，播放音效
videoElement.addEventListener('click', function () {
    if (audio!=null) {
        audio.pause();
        clearChat();
    }

    let i;
    if (birthday) {
        i = voiceNum-1;
    }
    else {
        do {
            i = Math.floor(Math.random() * (voiceNum-1));
        }while(i==preVoiceIndex);
    }
    
    preVoiceIndex = i;
    audio = new Audio(`resource/voice/${preVoiceIndex}.mp3`);
    audio.volume = volume/100;

    if (showDialog) {
        chat.src = `resource/chat/${lang*voiceNum + preVoiceIndex}.png`;
        chat.style.display = 'block';
        chat.style.opacity = '1';
    
        // 短暫顯示後隱藏
        timer = setTimeout(() => {
            chat.style.opacity = '0'; // 平滑隱藏
            setTimeout(() => {
                chat.style.display = 'none'; // 完全隱藏
            }, 300); // 等待平滑效果完成
        }, voiceL[preVoiceIndex]*1000);
    }

    audio.play();
});

function clearChat() {
    clearTimeout(timer);
    chat.style.display = 'none';
}

window.wallpaperPropertyListener = {
    applyUserProperties: function (properties) {
        if (properties.cgdefaultcg) {
            defCG = properties.cgdefaultcg.value;
            videoElement.style.display = 'block';
            cgIndex = defCG-1;
            changeBackground(true);
        }
    
        if (properties.textbox) {
            showDialog = properties.textbox.value;
        }
    
        if (properties.button) {
            showButton = properties.button.value;
            if (showButton) {
                button.style.display = 'block';
            }
            else {
                button.style.display = 'none';
            }
        }
    
        if (properties.birthdayvoice) {
            birthday = properties.birthdayvoice.value;
        }
    
        if (properties.language) {
            lang = properties.language.value;
        }

        if (properties.cusvolume) {
            volume = properties.cusvolume.value;
        }
    }
};
