/* =========================================================
   CHERY PINETOWN LEADS
   SALES AGENTS JAVASCRIPT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================================
           STORAGE
        ================================================= */

        const STORAGE_KEY =
            "cheryPinetownAgents";


        const LEADS_KEY =
            "cheryPinetownLeads";


        let editingAgentId =
            null;


        let selectedAgentId =
            null;



        /* =================================================
           ELEMENTS
        ================================================= */

        const addAgentButton =
            document.getElementById(
                "addAgentButton"
            );


        const agentModal =
            document.getElementById(
                "agentModal"
            );


        const closeAgentModal =
            document.getElementById(
                "closeAgentModal"
            );


        const cancelAgent =
            document.getElementById(
                "cancelAgent"
            );


        const agentForm =
            document.getElementById(
                "agentForm"
            );


        const agentsTableBody =
            document.getElementById(
                "agentsTableBody"
            );


        const agentSearch =
            document.getElementById(
                "agentSearch"
            );


        const agentStatusFilter =
            document.getElementById(
                "agentStatusFilter"
            );


        const agentDetailsModal =
            document.getElementById(
                "agentDetailsModal"
            );


        const closeDetailsModal =
            document.getElementById(
                "closeDetailsModal"
            );


        const closeDetailsBottom =
            document.getElementById(
                "closeDetailsBottom"
            );


        const editAgent =
            document.getElementById(
                "editAgent"
            );



        /* =================================================
           STORAGE FUNCTIONS
        ================================================= */

        function getAgents() {

            try {

                return (
                    JSON.parse(
                        localStorage.getItem(
                            STORAGE_KEY
                        )
                    ) || []
                );

            } catch (error) {

                console.error(
                    "Could not load agents:",
                    error
                );

                return [];

            }

        }


        function saveAgents(
            agents
        ) {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(
                    agents
                )
            );

        }


        function getLeads() {

            try {

                return (
                    JSON.parse(
                        localStorage.getItem(
                            LEADS_KEY
                        )
                    ) || []
                );

            } catch (error) {

                return [];

            }

        }



        /* =================================================
           GENERATE AGENT ID
        ================================================= */

        function generateAgentId() {

            return (
                "AG-" +
                Date.now() +
                "-" +
                Math.floor(
                    Math.random() * 900
                ) +
                100
            );

        }



        /* =================================================
           ESCAPE HTML
        ================================================= */

        function escapeHtml(
            value
        ) {

            if (
                value === null ||
                value === undefined
            ) {

                return "";

            }


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



        /* =================================================
           FORMAT MONEY
        ================================================= */

        function formatMoney(
            amount
        ) {

            return (
                "R" +
                Number(
                    amount || 0
                ).toLocaleString(
                    "en-ZA"
                )
            );

        }



        /* =================================================
           FORMAT DATE
        ================================================= */

        function formatDate(
            value
        ) {

            if (!value) {

                return "—";

            }


            const date =
                new Date(
                    value
                );


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return "—";

            }


            return date.toLocaleDateString(
                "en-ZA",
                {
                    day:
                        "2-digit",

                    month:
                        "short",

                    year:
                        "numeric"
                }
            );

        }



        /* =================================================
           GET AGENT STATISTICS
        ================================================= */

        function getAgentStats(
            agent
        ) {

            const leads =
                getLeads();


            const agentLeads =
                leads.filter(
                    lead => {

                        const referral =
                            lead.referral ||
                            {};


                        return (
                            referral.agentNumber ===
                            agent.phone ||
                            referral.referralCode ===
                            agent.referralCode
                        );

                    }
                );


            const sold =
                agentLeads.filter(
                    lead =>
                        lead.status ===
                        "sold"
                );


            let commission =
                0;


            sold.forEach(
                lead => {

                    commission +=
                        Number(
                            lead.commission?.amount ||
                            0
                        );

                }
            );


            return {

                leads:
                    agentLeads.length,

                sold:
                    sold.length,

                commission

            };

        }



        /* =================================================
           UPDATE SUMMARY
        ================================================= */

        function updateSummary() {

            const agents =
                getAgents();


            const total =
                agents.length;


            const active =
                agents.filter(
                    agent =>
                        agent.status ===
                        "active"
                ).length;


            let assignedLeads =
                0;


            let sold =
                0;


            agents.forEach(
                agent => {

                    const stats =
                        getAgentStats(
                            agent
                        );


                    assignedLeads +=
                        stats.leads;


                    sold +=
                        stats.sold;

                }
            );


            document.getElementById(
                "totalAgents"
            ).textContent =
                total;


            document.getElementById(
                "activeAgents"
            ).textContent =
                active;


            document.getElementById(
                "assignedLeads"
            ).textContent =
                assignedLeads;


            document.getElementById(
                "agentVehiclesSold"
            ).textContent =
                sold;

        }



        /* =================================================
           RENDER
        ================================================= */

        function renderAgents() {

            const agents =
                getAgents();


            updateSummary();


            const search =
                agentSearch.value
                    .trim()
                    .toLowerCase();


            const status =
                agentStatusFilter.value;


            const filtered =
                agents.filter(
                    agent => {


                        const searchable =
                            [

                                agent.name,

                                agent.phone,

                                agent.referralCode

                            ]
                            .join(" ")
                            .toLowerCase();


                        const matchesSearch =
                            !search ||
                            searchable.includes(
                                search
                            );


                        const matchesStatus =
                            status === "all" ||
                            agent.status ===
                            status;


                        return (
                            matchesSearch &&
                            matchesStatus
                        );

                    }
                );


            document.getElementById(
                "agentResultCount"
            ).textContent =
                filtered.length +
                (
                    filtered.length === 1
                        ? " agent"
                        : " agents"
                );


            if (
                filtered.length === 0
            ) {

                agentsTableBody.innerHTML = `

                    <tr>

                        <td
                            colspan="8"
                            class="table-empty"
                        >

                            ${
                                agents.length === 0
                                ? "No sales agents registered yet."
                                : "No agents match your search."
                            }

                        </td>

                    </tr>

                `;

                return;

            }


            agentsTableBody.innerHTML =
                filtered
                    .map(
                        agent =>
                            createAgentRow(
                                agent
                            )
                    )
                    .join("");


            attachAgentButtons();

        }



        /* =================================================
           CREATE ROW
        ================================================= */

        function createAgentRow(
            agent
        ) {

            const stats =
                getAgentStats(
                    agent
                );


            const status =
                agent.status ||
                "inactive";


            return `

                <tr>

                    <td>

                        <div class="agent-name-cell">

                            <strong>

                                ${escapeHtml(
                                    agent.name
                                )}

                            </strong>

                            <span>

                                ${escapeHtml(
                                    agent.agentId
                                )}

                            </span>

                        </div>

                    </td>


                    <td>

                        <span class="agent-phone">

                            ${escapeHtml(
                                agent.phone
                            )}

                        </span>

                    </td>


                    <td>

                        <span class="agent-code">

                            ${escapeHtml(
                                agent.referralCode
                            )}

                        </span>

                    </td>


                    <td>

                        <span class="agent-number">

                            ${stats.leads}

                        </span>

                    </td>


                    <td>

                        <span class="agent-number">

                            ${stats.sold}

                        </span>

                    </td>


                    <td>

                        <span class="agent-commission">

                            ${formatMoney(
                                stats.commission
                            )}

                        </span>

                    </td>


                    <td>

                        <span
                            class="
                                agent-status
                                agent-status-${escapeHtml(
                                    status
                                )}
                            "
                        >

                            ${
                                status === "active"
                                    ? "Active"
                                    : "Inactive"
                            }

                        </span>

                    </td>


                    <td>

                        <button
                            type="button"
                            class="view-agent"
                            data-agent-id="${escapeHtml(
                                agent.agentId
                            )}"
                        >
                            View
                        </button>

                    </td>

                </tr>

            `;

        }



        /* =================================================
           BUTTON EVENTS
        ================================================= */

        function attachAgentButtons() {

            document
                .querySelectorAll(
                    ".view-agent"
                )
                .forEach(
                    button => {

                        button.addEventListener(
                            "click",
                            () => {

                                openAgentDetails(
                                    button.dataset.agentId
                                );

                            }
                        );

                    }
                );

        }



        /* =================================================
           OPEN ADD MODAL
        ================================================= */

        function openAddModal() {

            editingAgentId =
                null;


            document.getElementById(
                "agentModalTitle"
            ).textContent =
                "Add Sales Agent";


            agentForm.reset();


            document.getElementById(
                "agentStatus"
            ).value =
                "active";


            clearErrors();


            agentModal.hidden =
                false;


            document.body.style.overflow =
                "hidden";

        }



        /* =================================================
           CLOSE FORM MODAL
        ================================================= */

        function closeFormModal() {

            agentModal.hidden =
                true;

            document.body.style.overflow =
                "";

            editingAgentId =
                null;

        }



        /* =================================================
           CLEAR ERRORS
        ================================================= */

        function clearErrors() {

            document.getElementById(
                "agentNameError"
            ).textContent =
                "";


            document.getElementById(
                "agentPhoneError"
            ).textContent =
                "";


            document.getElementById(
                "agentCodeError"
            ).textContent =
                "";

        }



        /* =================================================
           VALIDATE PHONE
        ================================================= */

        function validPhone(
            phone
        ) {

            const cleaned =
                phone.replace(
                    /\s+/g,
                    ""
                );


            return /^(\+27|0)[0-9]{9}$/
                .test(
                    cleaned
                );

        }



        /* =================================================
           SUBMIT AGENT
        ================================================= */

        agentForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                clearErrors();


                const name =
                    document.getElementById(
                        "agentFullName"
                    ).value.trim();


                const phone =
                    document.getElementById(
                        "agentPhone"
                    ).value.trim();


                const referralCode =
                    document.getElementById(
                        "agentReferralCode"
                    ).value
                    .trim()
                    .toUpperCase();


                const status =
                    document.getElementById(
                        "agentStatus"
                    ).value;


                const notes =
                    document.getElementById(
                        "agentNotes"
                    ).value.trim();


                let valid =
                    true;


                if (
                    name.length < 2
                ) {

                    document.getElementById(
                        "agentNameError"
                    ).textContent =
                        "Enter the agent's full name.";

                    valid =
                        false;

                }


                if (
                    !validPhone(
                        phone
                    )
                ) {

                    document.getElementById(
                        "agentPhoneError"
                    ).textContent =
                        "Enter a valid South African mobile number.";

                    valid =
                        false;

                }


                if (
                    referralCode.length < 3
                ) {

                    document.getElementById(
                        "agentCodeError"
                    ).textContent =
                        "Referral code must contain at least 3 characters.";

                    valid =
                        false;

                }


                const agents =
                    getAgents();


                const duplicateCode =
                    agents.some(
                        agent =>
                            agent.referralCode ===
                            referralCode &&
                            agent.agentId !==
                            editingAgentId
                    );


                if (
                    duplicateCode
                ) {

                    document.getElementById(
                        "agentCodeError"
                    ).textContent =
                        "This referral code is already being used.";

                    valid =
                        false;

                }


                if (!valid) {

                    return;

                }


                if (
                    editingAgentId
                ) {

                    const index =
                        agents.findIndex(
                            agent =>
                                agent.agentId ===
                                editingAgentId
                        );


                    if (
                        index !== -1
                    ) {

                        agents[index].name =
                            name;

                        agents[index].phone =
                            phone;

                        agents[index].referralCode =
                            referralCode;

                        agents[index].status =
                            status;

                        agents[index].notes =
                            notes;

                        agents[index].updatedAt =
                            new Date()
                                .toISOString();

                    }

                } else {

                    agents.unshift({

                        agentId:
                            generateAgentId(),

                        name,

                        phone,

                        referralCode,

                        status,

                        notes,

                        createdAt:
                            new Date()
                                .toISOString(),

                        updatedAt:
                            new Date()
                                .toISOString()

                    });

                }


                saveAgents(
                    agents
                );


                closeFormModal();


                renderAgents();


                alert(
                    editingAgentId
                        ? "Sales agent updated successfully."
                        : "Sales agent added successfully."
                );

            }
        );



        /* =================================================
           OPEN DETAILS
        ================================================= */

        function openAgentDetails(
            agentId
        ) {

            const agents =
                getAgents();


            const agent =
                agents.find(
                    item =>
                        item.agentId ===
                        agentId
                );


            if (!agent) {

                return;

            }


            selectedAgentId =
                agentId;


            const stats =
                getAgentStats(
                    agent
                );


            document.getElementById(
                "detailsAgentName"
            ).textContent =
                agent.name;


            document.getElementById(
                "profileAgentName"
            ).textContent =
                agent.name;


            document.getElementById(
                "profileAgentCode"
            ).textContent =
                agent.referralCode;


            document.getElementById(
                "profileAgentPhone"
            ).textContent =
                agent.phone;


            document.getElementById(
                "profileAgentReferral"
            ).textContent =
                agent.referralCode;


            document.getElementById(
                "profileAgentLeads"
            ).textContent =
                stats.leads;


            document.getElementById(
                "profileAgentSold"
            ).textContent =
                stats.sold;


            document.getElementById(
                "profileAgentCommission"
            ).textContent =
                formatMoney(
                    stats.commission
                );


            document.getElementById(
                "profileAgentDate"
            ).textContent =
                formatDate(
                    agent.createdAt
                );


            document.getElementById(
                "profileAgentNotes"
            ).textContent =
                agent.notes ||
                "No notes recorded.";


            const statusElement =
                document.getElementById(
                    "profileAgentStatus"
                );


            statusElement.textContent =
                agent.status === "active"
                    ? "Active"
                    : "Inactive";


            statusElement.className =
                "agent-status-badge " +
                (
                    agent.status === "active"
                        ? "active"
                        : "inactive"
                );


            const firstLetter =
                agent.name
                    .charAt(0)
                    .toUpperCase();


            document.querySelector(
                ".agent-avatar"
            ).textContent =
                firstLetter;


            agentDetailsModal.hidden =
                false;


            document.body.style.overflow =
                "hidden";

        }



        /* =================================================
           CLOSE DETAILS
        ================================================= */

        function closeAgentDetails() {

            agentDetailsModal.hidden =
                true;


            document.body.style.overflow =
                "";

            selectedAgentId =
                null;

        }



        /* =================================================
           EDIT AGENT
        ================================================= */

        editAgent.addEventListener(
            "click",
            () => {

                if (!selectedAgentId) {

                    return;

                }


                const agents =
                    getAgents();


                const agent =
                    agents.find(
                        item =>
                            item.agentId ===
                            selectedAgentId
                    );


                if (!agent) {

                    return;

                }


                closeAgentDetails();


                editingAgentId =
                    agent.agentId;


                document.getElementById(
                    "agentModalTitle"
                ).textContent =
                    "Edit Sales Agent";


                document.getElementById(
                    "agentFullName"
                ).value =
                    agent.name;


                document.getElementById(
                    "agentPhone"
                ).value =
                    agent.phone;


                document.getElementById(
                    "agentReferralCode"
                ).value =
                    agent.referralCode;


                document.getElementById(
                    "agentStatus"
                ).value =
                    agent.status;


                document.getElementById(
                    "agentNotes"
                ).value =
                    agent.notes ||
                    "";


                clearErrors();


                agentModal.hidden =
                    false;


                document.body.style.overflow =
                    "hidden";

            }
        );



        /* =================================================
           EVENTS
        ================================================= */

        addAgentButton.addEventListener(
            "click",
            openAddModal
        );


        closeAgentModal.addEventListener(
            "click",
            closeFormModal
        );


        cancelAgent.addEventListener(
            "click",
            closeFormModal
        );


        closeDetailsModal.addEventListener(
            "click",
            closeAgentDetails
        );


        closeDetailsBottom.addEventListener(
            "click",
            closeAgentDetails
        );


        agentModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    agentModal
                ) {

                    closeFormModal();

                }

            }
        );


        agentDetailsModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    agentDetailsModal
                ) {

                    closeAgentDetails();

                }

            }
        );


        agentSearch.addEventListener(
            "input",
            renderAgents
        );


        agentStatusFilter.addEventListener(
            "change",
            renderAgents
        );


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Escape"
                ) {

                    if (
                        !agentModal.hidden
                    ) {

                        closeFormModal();

                    }


                    if (
                        !agentDetailsModal.hidden
                    ) {

                        closeAgentDetails();

                    }

                }

            }
        );



        /* =================================================
           INITIAL LOAD
        ================================================= */

        renderAgents();


        console.log(
            "Chery Pinetown Sales Agents loaded."
        );

    }
);