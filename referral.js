document.addEventListener("DOMContentLoaded", () => {

    const AGENTS_KEY = "cheryPinetownAgents";
    const LEADS_KEY = "cheryPinetownLeads";


    /* =====================================
       ELEMENTS
    ===================================== */

    const agentSelect =
        document.getElementById("agentSelect");

    const agentPreview =
        document.getElementById("agentPreview");

    const previewName =
        document.getElementById("previewName");

    const previewCode =
        document.getElementById("previewCode");

    const customerName =
        document.getElementById("customerName");

    const customerPhone =
        document.getElementById("customerPhone");

    const vehicleInterest =
        document.getElementById("vehicleInterest");

    const generateMessage =
        document.getElementById("generateMessage");

    const referralMessage =
        document.getElementById("referralMessage");

    const copyMessage =
        document.getElementById("copyMessage");

    const sendWhatsApp =
        document.getElementById("sendWhatsApp");

    const searchAgent =
        document.getElementById("searchAgent");

    const referralTableBody =
        document.getElementById("referralTableBody");


    /* =====================================
       STORAGE
    ===================================== */

    function getAgents() {

        try {

            const agents =
                JSON.parse(
                    localStorage.getItem(AGENTS_KEY)
                );

            return Array.isArray(agents)
                ? agents
                : [];

        } catch (error) {

            console.error(
                "Could not load agents:",
                error
            );

            return [];

        }

    }


    function getLeads() {

        try {

            const leads =
                JSON.parse(
                    localStorage.getItem(LEADS_KEY)
                );

            return Array.isArray(leads)
                ? leads
                : [];

        } catch (error) {

            console.error(
                "Could not load leads:",
                error
            );

            return [];

        }

    }


    /* =====================================
       HTML ESCAPE
    ===================================== */

    function escapeHtml(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =====================================
       INITIALS
    ===================================== */

    function getInitials(name) {

        if (!name) {
            return "?";
        }

        const parts =
            name.trim().split(/\s+/);

        if (parts.length === 1) {
            return parts[0]
                .substring(0, 2)
                .toUpperCase();
        }

        return (
            parts[0].charAt(0) +
            parts[parts.length - 1].charAt(0)
        ).toUpperCase();

    }


    /* =====================================
       LOAD AGENT DROPDOWN
    ===================================== */

    function loadAgentDropdown() {

        const agents =
            getAgents();

        const activeAgents =
            agents.filter(
                agent =>
                    String(agent.status)
                        .toLowerCase() === "active"
            );


        agentSelect.innerHTML = `
            <option value="">
                Select sales agent
            </option>
        `;


        activeAgents.forEach(agent => {

            const option =
                document.createElement("option");

            option.value =
                agent.id;

            option.textContent =
                `${agent.name} — ${agent.referralCode}`;

            agentSelect.appendChild(option);

        });

    }


    /* =====================================
       SELECT AGENT
    ===================================== */

    agentSelect.addEventListener(
        "change",
        () => {

            const agents =
                getAgents();

            const agent =
                agents.find(
                    item =>
                        item.id === agentSelect.value
                );


            if (!agent) {

                previewName.textContent =
                    "No agent selected";

                previewCode.textContent =
                    "Referral code will appear here";

                return;

            }


            previewName.textContent =
                agent.name;

            previewCode.textContent =
                `Referral Code: ${agent.referralCode}`;

        }
    );


    /* =====================================
       CALCULATE AGENT LEADS
    ===================================== */

    function getAgentLeads(agent) {

        const leads =
            getLeads();

        return leads.filter(lead => {

            if (
                lead.referral &&
                lead.referral.agentId
            ) {

                return (
                    lead.referral.agentId ===
                    agent.id
                );

            }


            if (
                lead.referral &&
                lead.referral.referralCode
            ) {

                return (
                    lead.referral.referralCode ===
                    agent.referralCode
                );

            }


            return false;

        });

    }


    /* =====================================
       SUMMARY
    ===================================== */

    function updateSummary() {

        const agents =
            getAgents();

        const leads =
            getLeads();


        const activeAgents =
            agents.filter(
                agent =>
                    String(agent.status)
                        .toLowerCase() === "active"
            );


        const referralCodes =
            agents.filter(
                agent =>
                    agent.referralCode
            );


        const whatsappReferrals =
            leads.filter(
                lead =>
                    lead.leadSource ===
                    "whatsapp_referral"
            );


        const referredLeads =
            leads.filter(
                lead =>
                    lead.referral &&
                    (
                        lead.referral.agentId ||
                        lead.referral.referralCode
                    )
            );


        document.getElementById(
            "activeAgents"
        ).textContent =
            activeAgents.length;


        document.getElementById(
            "referralCodes"
        ).textContent =
            referralCodes.length;


        document.getElementById(
            "whatsappReferrals"
        ).textContent =
            whatsappReferrals.length;


        document.getElementById(
            "referredLeads"
        ).textContent =
            referredLeads.length;

    }


    /* =====================================
       RENDER TABLE
    ===================================== */

    function renderTable(searchTerm = "") {

        const agents =
            getAgents();

        const filteredAgents =
            agents.filter(agent => {

                const search =
                    searchTerm
                        .toLowerCase()
                        .trim();

                if (!search) {
                    return true;
                }

                return (
                    String(agent.name)
                        .toLowerCase()
                        .includes(search) ||

                    String(agent.referralCode)
                        .toLowerCase()
                        .includes(search)
                );

            });


        if (filteredAgents.length === 0) {

            referralTableBody.innerHTML = `
                <tr>
                    <td
                        colspan="7"
                        class="empty-state"
                    >
                        No sales agents found.
                    </td>
                </tr>
            `;

            return;

        }


        referralTableBody.innerHTML =
            filteredAgents.map(agent => {

                const agentLeads =
                    getAgentLeads(agent);


                const sold =
                    agentLeads.filter(
                        lead =>
                            String(lead.status)
                                .toLowerCase() === "sold"
                    ).length;


                const status =
                    String(agent.status)
                        .toLowerCase();


                return `

                    <tr>

                        <td>

                            <div class="agent-cell">

                                <div class="table-avatar">
                                    ${escapeHtml(
                                        getInitials(agent.name)
                                    )}
                                </div>

                                <div>

                                    <strong>
                                        ${escapeHtml(
                                            agent.name
                                        )}
                                    </strong>

                                    <span>
                                        ${escapeHtml(
                                            agent.id
                                        )}
                                    </span>

                                </div>

                            </div>

                        </td>


                        <td>

                            <span class="referral-code">
                                ${escapeHtml(
                                    agent.referralCode
                                )}
                            </span>

                        </td>


                        <td>
                            ${escapeHtml(
                                agent.phone || "-"
                            )}
                        </td>


                        <td>
                            ${agentLeads.length}
                        </td>


                        <td>
                            ${sold}
                        </td>


                        <td>

                            <span
                                class="status ${
                                    status === "active"
                                        ? "active"
                                        : "inactive"
                                }"
                            >
                                ${escapeHtml(
                                    agent.status
                                )}
                            </span>

                        </td>


                        <td>

                            <button
                                type="button"
                                class="table-action"
                                data-agent-id="${escapeHtml(
                                    agent.id
                                )}"
                            >
                                Use Code
                            </button>

                        </td>

                    </tr>

                `;

            }).join("");

    }


    /* =====================================
       USE CODE BUTTON
    ===================================== */

    referralTableBody.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-agent-id]"
                );


            if (!button) {
                return;
            }


            const agentId =
                button.dataset.agentId;


            agentSelect.value =
                agentId;


            agentSelect.dispatchEvent(
                new Event("change")
            );


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


    /* =====================================
       GENERATE MESSAGE
    ===================================== */

    generateMessage.addEventListener(
        "click",
        () => {

            const agents =
                getAgents();

            const agent =
                agents.find(
                    item =>
                        item.id ===
                        agentSelect.value
                );


            if (!agent) {

                alert(
                    "Please select a sales agent first."
                );

                agentSelect.focus();

                return;

            }


            const name =
                customerName.value.trim();


            const vehicle =
                vehicleInterest.value;


            let message =
                "Hi";


            if (name) {
                message += ` ${name}`;
            }


            message += ` 👋\n\n`;


            message +=
                "I would like to assist you with your vehicle enquiry at Chery Pinetown.";


            if (vehicle) {

                message +=
                    `\n\nVehicle of interest: ${vehicle}`;

            }


            message +=
                `\n\nYour enquiry is being referred through ${agent.name}.`;


            message +=
                `\nReferral Code: ${agent.referralCode}`;


            message +=
                "\n\nFor more information, please contact Chery Pinetown.";


            message +=
                "\n\nThank you.";


            referralMessage.value =
                message;

        }
    );


    /* =====================================
       NORMALISE PHONE
    ===================================== */

    function normaliseWhatsAppNumber(phone) {

        let number =
            String(phone || "")
                .replace(/\D/g, "");


        if (number.startsWith("0")) {

            number =
                "27" +
                number.substring(1);

        }


        if (
            !number.startsWith("27") &&
            number.length === 9
        ) {

            number =
                "27" + number;

        }


        return number;

    }


    /* =====================================
       SEND WHATSAPP
    ===================================== */

    sendWhatsApp.addEventListener(
        "click",
        () => {

            const message =
                referralMessage.value.trim();


            if (!message) {

                alert(
                    "Generate the referral message first."
                );

                return;

            }


            const customerNumber =
                normaliseWhatsAppNumber(
                    customerPhone.value
                );


            let whatsappUrl;


            if (customerNumber) {

                whatsappUrl =
                    `https://wa.me/${customerNumber}?text=${encodeURIComponent(
                        message
                    )}`;

            } else {

                whatsappUrl =
                    `https://wa.me/?text=${encodeURIComponent(
                        message
                    )}`;

            }


            window.open(
                whatsappUrl,
                "_blank"
            );

        }
    );


    /* =====================================
       COPY MESSAGE
    ===================================== */

    copyMessage.addEventListener(
        "click",
        async () => {

            const message =
                referralMessage.value.trim();


            if (!message) {

                alert(
                    "Generate the referral message first."
                );

                return;

            }


            try {

                await navigator.clipboard.writeText(
                    message
                );


                const originalText =
                    copyMessage.textContent;


                copyMessage.textContent =
                    "Copied!";


                setTimeout(
                    () => {

                        copyMessage.textContent =
                            originalText;

                    },
                    1500
                );


            } catch (error) {

                alert(
                    "Unable to copy the message."
                );

            }

        }
    );


    /* =====================================
       SEARCH
    ===================================== */

    searchAgent.addEventListener(
        "input",
        () => {

            renderTable(
                searchAgent.value
            );

        }
    );


    /* =====================================
       INITIALISE
    ===================================== */

    loadAgentDropdown();

    updateSummary();

    renderTable();

});