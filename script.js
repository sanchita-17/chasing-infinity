const API_URL = "http://127.0.0.1:8000";

async function analyzeContract(file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch(`${API_URL}/upload`, {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Contract analysis failed");
        }

        console.log("AI Analysis:", data.analysis);

        displayAnalysis(data.analysis);

    } catch (error) {
        console.error("Error:", error);
        alert("Failed to analyze contract: " + error.message);
    }
}


function displayAnalysis(analysis) {

    const analysisPanel = document.querySelector(".ai-analysis");

    if (!analysisPanel) {
        console.error("AI Analysis panel not found in HTML.");
        return;
    }

    analysisPanel.innerHTML = `
        <div class="analysis-result">
            <h3>🤖 AI Contract Analysis</h3>
            <div class="analysis-text">
                ${formatAnalysis(analysis)}
            </div>
        </div>
    `;
}


function formatAnalysis(text) {

    return text
        .replace(/\n/g, "<br>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}
