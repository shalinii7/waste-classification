const API_URL = "http://127.0.0.1:5000";

const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const previewImage = document.getElementById('previewImage');
const resultArea = document.getElementById('resultArea');

if(uploadArea){
    uploadArea.addEventListener('click', () => fileInput.click());
}
if(fileInput){
    fileInput.addEventListener('change', handleFile);
}

function handleFile() {
    const file = fileInput.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        if(preview) preview.classList.remove('hidden');
        if(uploadArea) uploadArea.classList.add('hidden');
        if(resultArea){
            resultArea.innerHTML = `<p>🤖 AI Analyzing... Please wait</p>`;
            resultArea.classList.remove('hidden');
        }
        uploadImage(file);
    };
    reader.readAsDataURL(file);
}

async function uploadImage(file) {
    const form = new FormData();
    form.append('image', file);
    const uid = localStorage.getItem('user_id') || localStorage.getItem('userId') || 1;
    form.append('user_id', uid);

    try {
        console.log("Sending to", API_URL + "/predict");
        const res = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            body: form
        });

        const data = await res.json();
        console.log("Backend Response:", data);

        if (!res.ok) {
            resultArea.innerHTML = `<p style="color:red;">Error: ${data.error}</p><button onclick="location.reload()">Try Again</button>`;
            return;
        }

        const result = data.plain_preview || data;

        if (!result.predicted_class) {
            resultArea.innerHTML = `<p style="color:red;">Invalid response: ${JSON.stringify(data).substring(0,200)}</p>`;
            return;
        }

        resultArea.innerHTML = `
            <div style="padding:15px; border:2px solid green; border-radius:10px; background:#e8f5e9;">
                <h2 style="color:green; margin:0;">✅ ${result.predicted_class.toUpperCase()}</h2>
                <p style="font-size:18px;">Confidence: <b>${result.confidence}%</b></p>
                <p style="font-size:16px;">♻️ <b>Tip:</b> ${result.recycling_tip}</p>
                ${data.encrypted ? `<p style="font-size:12px; color:blue; margin-top:10px;">🔒 Encrypted API: YES<br><span style="font-size:10px; word-break:break-all;">${data.data.substring(0,80)}...</span></p>` : ''}
                <hr>
                <p style="font-size:13px;">All probabilities:<br>${Object.entries(result.all_probabilities || {}).map(([k,v])=>`${k}:${v.toFixed(1)}%`).join(' | ')}</p>
                <button onclick="location.reload()" style="margin-top:10px; padding:10px 20px; background:green; color:white; border:none; border-radius:5px; cursor:pointer;">Classify Another Image</button>
            </div>
        `;
        resultArea.classList.remove('hidden');

    } catch (err) {
        console.error("Fetch error:", err);
        // THIS IS THE POPUP YOU SEE - now we show real error
        resultArea.innerHTML = `
            <p style="color:red;"><b>Cannot connect to backend!</b><br>${err.message}<br><br>
            1. Is backend running on port 5000?<br>
            2. Check terminal 1 shows "Running on http://127.0.0.1:5000"</p>
            <button onclick="location.reload()">Retry</button>
        `;
        resultArea.classList.remove('hidden');
        // Don't alert popup anymore
    }
}

// For register/login pages if they use fetch
async function registerUser(username, email, password){
    const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({username, email, password})
    });
    return res.json();
}
async function loginUser(email, password){
    const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({email, password})
    });
    return res.json();
}