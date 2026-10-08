/* =====================================================
   LEXIGUARD FRONTEND
   Sample contract + simulated AI analysis
===================================================== */


/* =====================================================
   SAMPLE FINDINGS
===================================================== */

const findings = [

    {
        id: "LIABILITY_001",

        title: "Liability Cap",

        category: "LIABILITY",

        severity: "Critical",

        description:
            "Vendor liability is completely unlimited.",

        original:
            "The Vendor shall be liable for all losses, damages and claims arising from the services without limitation.",

        problem:
            "Unlimited liability can expose the organization to potentially uncapped financial losses.",

        expectation:
            "Vendor liability should be subject to an agreed monetary cap, normally tied to fees paid during a defined period.",

        corrected:
            "The Vendor's aggregate liability shall not exceed the total fees paid under this Agreement during the preceding twelve months.",

        confidence:
            "High"
    },


    {
        id: "PAYMENT_001",

        title: "Payment Terms",

        category: "PAYMENT",

        severity: "High",

        description:
            "The contract requires payment within only seven days.",

        original:
            "Payment shall be made within 7 days of receipt of invoice.",

        problem:
            "The proposed seven-day payment period is shorter than the organization's standard payment window.",

        expectation:
            "The preferred payment period is thirty days from receipt of a valid invoice.",

        corrected:
            "Payment shall be made within 30 days of receipt of a valid invoice.",

        confidence:
            "High"
    },


    {
        id: "RENEWAL_001",

        title: "Automatic Renewal",

        category: "RENEWAL",

        severity: "High",

        description:
            "The agreement automatically renews for another year.",

        original:
            "This Agreement shall automatically renew for successive one-year periods unless either party provides notice of non-renewal.",

        problem:
            "Automatic renewal can unintentionally extend the organization's contractual commitment.",

        expectation:
            "Renewal should require explicit written confirmation from the parties.",

        corrected:
            "Renewal shall require written confirmation from both parties at least thirty days before expiry.",

        confidence:
            "High"
    },


    {
        id: "IP_001",

        title: "Work Product Ownership",

        category: "INTELLECTUAL PROPERTY",

        severity: "Critical",

        description:
            "The vendor retains ownership of work created for the Company.",

        original:
            "All intellectual property created by the Vendor shall remain the exclusive property of the Vendor.",

        problem:
            "The organization may lose ownership or control over work product specifically created under the agreement.",

        expectation:
            "Work product created specifically for the organization should be assigned to the organization.",

        corrected:
            "All work product and intellectual property specifically created for the Company under this Agreement shall be owned by the Company upon creation.",

        confidence:
            "Medium"
    }

];


/* =====================================================
   STATE
===================================================== */

let selectedFinding = null;

let acceptedRedlines = [];

let rejectedRedlines = [];


/* =====================================================
   DOM
===================================================== */

const analyzeButton =
    document.getElementById("analyzeButton");

const results =
    document.getElementById("results");

const loading =
    document.getElementById("loading");

const findingsList =
    document.getElementById("findingsList");

const contractViewer =
    document.getElementById("contractViewer");


/* =====================================================
   ANALYZE BUTTON
===================================================== */

analyzeButton.addEventListener(
    "click",
    function () {

        showLoading();

        /*
         * This is intentionally simulated for now.
         *
         * Later:
         *
         * 1. Upload PDF/DOCX to FastAPI
         * 2. Extract text
         * 3. Send text to /analyze
         * 4. Send findings to /ai-review
         */

        setTimeout(
            function () {

                hideLoading();

                showResults();

            },
            1500
        );

    }
);


/* =====================================================
   SHOW RESULTS
===================================================== */

function showResults() {

    results.classList.remove("hidden");

    calculateRisk();

    renderFindings();

    renderContract();

    clearAIReview();

    results.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =====================================================
   RISK CALCULATION
===================================================== */

function calculateRisk() {

    let critical = 0;

    let high = 0;

    let medium = 0;

    let low = 0;


    findings.forEach(
        function (finding) {

            const severity =
                finding.severity.toLowerCase();


            if (severity === "critical") {

                critical++;

            }
            else if (severity === "high") {

                high++;

            }
            else if (severity === "medium") {

                medium++;

            }
            else {

                low++;

            }

        }
    );


    const score =
        Math.min(
            100,
            critical * 25 +
            high * 15 +
            medium * 8 +
            low * 3
        );


    document.getElementById(
        "riskScore"
    ).textContent = score;


    document.getElementById(
        "scoreBar"
    ).style.width =
        score + "%";


    document.getElementById(
        "criticalCount"
    ).textContent =
        critical;


    document.getElementById(
        "highCount"
    ).textContent =
        high;


    document.getElementById(
        "findingCount"
    ).textContent =
        findings.length;


    const riskLevel =
        document.getElementById(
            "riskLevel"
        );


    let level = "Low";


    if (critical > 0) {

        level = "Critical";

    }
    else if (high > 0) {

        level = "High";

    }
    else if (medium > 0) {

        level = "Medium";

    }


    riskLevel.textContent =
        level;


    riskLevel.className =
        "";


    if (level === "Critical") {

        riskLevel.classList.add(
            "critical-text"
        );

    }
    else if (level === "High") {

        riskLevel.classList.add(
            "high-text"
        );

    }
    else if (level === "Medium") {

        riskLevel.classList.add(
            "medium-text"
        );

    }
    else {

        riskLevel.classList.add(
            "low-text"
        );

    }

}


/* =====================================================
   RENDER FINDINGS
===================================================== */

function renderFindings() {

    findingsList.innerHTML = "";


    findings.forEach(
        function (finding, index) {

            const severity =
                finding.severity.toLowerCase();


            const item =
                document.createElement("div");


            item.className =
                "finding";


            item.dataset.index =
                index;


            item.innerHTML = `

                <div class="finding-top">

                    <span
                        class="risk-dot ${severity}">
                    </span>

                    <span class="finding-title">
                        ${escapeHTML(finding.title)}
                    </span>

                    <span
                        class="finding-severity ${severity}">
                        ${finding.severity.toUpperCase()}
                    </span>

                </div>

                <p>
                    ${escapeHTML(finding.description)}
                </p>

            `;


            item.addEventListener(
                "click",
                function () {

                    selectFinding(index);

                }
            );


            findingsList.appendChild(item);

        }
    );

}


/* =====================================================
   SELECT FINDING
===================================================== */

function selectFinding(index) {

    selectedFinding =
        findings[index];


    document
        .querySelectorAll(".finding")
        .forEach(
            function (item) {

                item.classList.remove(
                    "selected"
                );

            }
        );


    const item =
        document.querySelector(
            `.finding[data-index="${index}"]`
        );


    if (item) {

        item.classList.add(
            "selected"
        );

    }


    showAIReview(
        selectedFinding
    );


    highlightClause(
        selectedFinding
    );

}


/* =====================================================
   RENDER CONTRACT
===================================================== */

function renderContract() {

    contractViewer.innerHTML = `

        <h3>
            VENDOR SERVICE AGREEMENT
        </h3>

        <h4>
            1. SERVICES
        </h4>

        <p>
            The Vendor shall provide software development and
            maintenance services to the Company according to
            the requirements agreed between the parties.
        </p>


        <h4>
            2. LIABILITY
        </h4>

        <p>
            The Vendor shall be liable for all losses,
            damages and claims arising from the services
            <span
                class="risky-clause"
                data-finding="LIABILITY_001"
            >
                without limitation
            </span>.
        </p>


        <h4>
            3. PAYMENT
        </h4>

        <p>
            Payment shall be made within
            <span
                class="risky-clause"
                data-finding="PAYMENT_001"
            >
                7 days
            </span>
            of receipt of invoice.
        </p>


        <h4>
            4. AUTOMATIC RENEWAL
        </h4>

        <p>
            This Agreement shall
            <span
                class="risky-clause"
                data-finding="RENEWAL_001"
            >
                automatically renew
            </span>
            for successive one-year periods unless either
            party provides notice of non-renewal.
        </p>


        <h4>
            5. INTELLECTUAL PROPERTY
        </h4>

        <p>
            All intellectual property created by the Vendor
            shall remain the
            <span
                class="risky-clause"
                data-finding="IP_001"
            >
                exclusive property of the Vendor
            </span>.
        </p>


        <h4>
            6. CONFIDENTIALITY
        </h4>

        <p>
            Each party agrees to keep confidential information
            private and shall not disclose such information
            to third parties.
        </p>


        <h4>
            7. DATA PROTECTION
        </h4>

        <p>
            The Vendor may process Company data as required
            to provide the services.
        </p>


        <h4>
            8. GOVERNING LAW
        </h4>

        <p>
            This Agreement shall be governed by applicable law.
        </p>


        <h4>
            9. TERMINATION
        </h4>

        <p>
            Either party may terminate this Agreement with
            seven days' notice.
        </p>


        <h4>
            10. AUDIT
        </h4>

        <p>
            The Company may request reasonable information
            from the Vendor regarding performance of the services.
        </p>

    `;


    document
        .querySelectorAll(".risky-clause")
        .forEach(
            function (clause) {

                clause.addEventListener(
                    "click",
                    function () {

                        const id =
                            clause.dataset.finding;


                        const index =
                            findings.findIndex(
                                function (finding) {

                                    return finding.id === id;

                                }
                            );


                        if (index !== -1) {

                            selectFinding(index);

                        }

                    }
                );

            }
        );

}


/* =====================================================
   AI REVIEW
===================================================== */

function showAIReview(finding) {

    document
        .getElementById("aiEmpty")
        .classList.add("hidden");


    document
        .getElementById("aiReview")
        .classList.remove("hidden");


    document.getElementById(
        "aiSeverity"
    ).textContent =
        finding.severity.toUpperCase();


    document.getElementById(
        "aiCategory"
    ).textContent =
        finding.category;


    document.getElementById(
        "aiTitle"
    ).textContent =
        finding.title;


    document.getElementById(
        "aiProblem"
    ).textContent =
        finding.problem;


    document.getElementById(
        "aiExpectation"
    ).textContent =
        finding.expectation;


    document.getElementById(
        "aiClause"
    ).textContent =
        finding.corrected;


    document.getElementById(
        "aiConfidence"
    ).textContent =
        finding.confidence;


    const severity =
        finding.severity.toLowerCase();


    const severityElement =
        document.getElementById(
            "aiSeverity"
        );


    severityElement.className = "";


    if (severity === "critical") {

        severityElement.style.color =
            "var(--red)";

    }
    else if (severity === "high") {

        severityElement.style.color =
            "var(--orange)";

    }
    else {

        severityElement.style.color =
            "var(--yellow)";

    }


    document.getElementById(
        "decisionMessage"
    ).textContent = "";


    document.getElementById(
        "decisionMessage"
    ).className =
        "decision-message";

}


/* =====================================================
   CLEAR AI
===================================================== */

function clearAIReview() {

    document
        .getElementById("aiEmpty")
        .classList.remove("hidden");


    document
        .getElementById("aiReview")
        .classList.add("hidden");

}


/* =====================================================
   HIGHLIGHT CLAUSE
===================================================== */

function highlightClause(finding) {

    document
        .querySelectorAll(".risky-clause")
        .forEach(
            function (clause) {

                clause.classList.remove(
                    "selected-clause"
                );

            }
        );


    const clause =
        document.querySelector(
            `.risky-clause[data-finding="${finding.id}"]`
        );


    if (clause) {

        clause.classList.add(
            "selected-clause"
        );


        clause.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }

}


/* =====================================================
   ACCEPT REDLINE
===================================================== */

document.getElementById(
    "acceptButton"
).addEventListener(
    "click",
    function () {

        if (!selectedFinding) {

            return;

        }


        const clause =
            document.querySelector(
                `.risky-clause[data-finding="${selectedFinding.id}"]`
            );


        if (!clause) {

            showDecision(
                "This redline has already been applied.",
                "accepted"
            );

            return;

        }


        /*
         * THIS IS THE IMPORTANT PART.
         *
         * The original risky text is actually
         * replaced by the suggested clause.
         */

        clause.textContent =
            selectedFinding.corrected;


        clause.classList.remove(
            "risky-clause",
            "selected-clause"
        );


        clause.classList.add(
            "accepted-clause"
        );


        clause.removeAttribute(
            "data-finding"
        );


        acceptedRedlines.push(
            selectedFinding.id
        );


        showDecision(
            "✓ Redline accepted by human reviewer.",
            "accepted"
        );

    }
);


/* =====================================================
   REJECT REDLINE
===================================================== */

document.getElementById(
    "rejectButton"
).addEventListener(
    "click",
    function () {

        if (!selectedFinding) {

            return;

        }


        rejectedRedlines.push(
            selectedFinding.id
        );


        showDecision(
            "Redline rejected. Original clause retained.",
            "rejected"
        );

    }
);


/* =====================================================
   DECISION MESSAGE
===================================================== */

function showDecision(
    message,
    type
) {

    const element =
        document.getElementById(
            "decisionMessage"
        );


    element.textContent =
        message;


    element.className =
        "decision-message " +
        type;

}


/* =====================================================
   READ ALOUD
===================================================== */

document.getElementById(
    "readButton"
).addEventListener(
    "click",
    function () {

        if (
            !("speechSynthesis" in window)
        ) {

            alert(
                "Your browser does not support read aloud."
            );

            return;

        }


        speechSynthesis.cancel();


        const text =
            document.getElementById(
                "contractViewer"
            ).innerText;


        const speech =
            new SpeechSynthesisUtterance(
                text
            );


        const language =
            document.getElementById(
                "languageSelect"
            ).value;


        if (language === "ta") {

            speech.lang = "ta-IN";

        }
        else if (language === "hi") {

            speech.lang = "hi-IN";

        }
        else if (language === "te") {

            speech.lang = "te-IN";

        }
        else {

            speech.lang = "en-IN";

        }


        speech.rate = 0.9;


        speechSynthesis.speak(
            speech
        );

    }
);


/* =====================================================
   ADD FILE
===================================================== */

document.getElementById(
    "addFileButton"
).addEventListener(
    "click",
    function () {

        /*
         * Placeholder for the future upload system.
         */

        alert(
            "File upload will be connected to the LexiGuard backend soon."
        );

    }
);


/* =====================================================
   NAVIGATION
===================================================== */

document
    .querySelectorAll(".nav-item")
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const section =
                        button.dataset.section;


                    switchSection(
                        section
                    );


                    document
                        .querySelectorAll(".nav-item")
                        .forEach(
                            function (item) {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                    button.classList.add(
                        "active"
                    );

                }
            );

        }
    );


/* =====================================================
   SWITCH SECTION
===================================================== */

function switchSection(
    section
) {

    document
        .querySelectorAll(".page-section")
        .forEach(
            function (page) {

                page.classList.remove(
                    "active"
                );

            }
        );


    const target =
        document.getElementById(
            section + "Section"
        );


    if (target) {

        target.classList.add(
            "active"
        );

    }

}


/* =====================================================
   LANGUAGE
===================================================== */

document.getElementById(
    "languageSelect"
).addEventListener(
    "change",
    function () {

        /*
         * Interface translation can be connected later.
         */

        console.log(
            "Selected language:",
            this.value
        );

    }
);


/* =====================================================
   LOADING
===================================================== */

function showLoading() {

    loading.classList.remove(
        "hidden"
    );

}


function hideLoading() {

    loading.classList.add(
        "hidden"
    );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
