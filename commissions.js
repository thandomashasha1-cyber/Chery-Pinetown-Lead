/* =========================================
   CHERY PINETOWN
   COMMISSION MANAGEMENT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const LEADS_KEY = "cheryPinetownLeads";
    const AGENTS_KEY = "cheryPinetownAgents";
    const COMMISSION_RATE_KEY = "cheryPinetownCommissionRate";

    const DEFAULT_COMMISSION = 2000;

    let leads = [];
    let agents = [];

    let commissionRate = DEFAULT_COMMISSION;

    let selectedSaleId = null;


    /* =========================================
       ELEMENTS
    ========================================= */

    const totalCommission =
        document.getElementById("totalCommission");

    const pendingCommission =
        document.getElementById("pendingCommission");

    const paidCommission =
        document.getElementById("paidCommission");

    const vehiclesSold =
        document.getElementById("vehiclesSold");

    const currentRate =
        document.getElementById("currentRate");

    const tableBody =
        document.getElementById("commissionTableBody");

    const emptyState =
        document.getElementById("emptyState");

    const commissionCount =
        document.getElementById("commissionCount");

    const searchInput =
        document.getElementById("commissionSearch");

    const paymentFilter =
        document.getElementById("paymentFilter");

    const agentFilter =
        document.getElementById("agentFilter");

    const resetFilters =
        document.getElementById("resetFilters");


    /* SETTINGS */

    const settingsModal =
        document.getElementById("settingsModal");

    const settingsButton =
        document.getElementById("settingsButton");

    const changeRateButton =
        document.getElementById("changeRateButton");

    const closeSettings =
        document.getElementById("closeSettings");

    const cancelSettings =
        document.getElementById("cancelSettings");

    const settingsForm =
        document.getElementById("commissionSettingsForm");

    const commissionRateInput =
        document.getElementById("commissionRate");


    /* SALE MODAL */

    const saleModal =
        document.getElementById("saleModal");

    const closeSale =
        document.getElementById("closeSale");

    const closeSaleButton =
        document.getElementById("closeSaleButton");

    const savePaymentStatus =
        document.getElementById("savePaymentStatus");

    const detailLeadId =
        document.getElementById("detailLeadId");

    const detailCustomer =
        document.getElementById("detailCustomer");

    const detailVehicle =
        document.getElementById("detailVehicle");

    const detailAgent =
        document.getElementById("detailAgent");

    const detailSoldDate =
        document.getElementById("detailSoldDate");

    const detailCommission =
        document.getElementById("detailCommission");

    const detailPaymentStatus =
        document.getElementById("detailPaymentStatus");


    /* =========================================
       STORAGE
    ========================================= */

    function loadData() {

        try {

            const storedLeads =
                localStorage.getItem(LEADS_KEY);

            const storedAgents =
                localStorage.getItem(AGENTS_KEY);

            const storedRate =
                localStorage.getItem(COMMISSION_RATE_KEY);


            leads = storedLeads
                ? JSON.parse(storedLeads)
                : [];

            agents = storedAgents
                ? JSON.parse(storedAgents)
                : [];


            if (storedRate !== null) {

                const parsedRate =
                    Number(storedRate);

                if (
                    Number.isFinite(parsedRate) &&
                    parsedRate >= 0
                ) {
                    commissionRate = parsedRate;
                }

            }

        } catch (error) {

            console.error(
                "Unable to load commission data:",
                error
            );

            leads = [];
            agents = [];

        }

    }


    function saveLeads() {

        localStorage.setItem(
            LEADS_KEY,
            JSON.stringify(leads)
        );

    }


    function saveCommissionRate() {

        localStorage.setItem(
            COMMISSION_RATE_KEY,
            String(commissionRate)
        );

    }


    /* =========================================
       HELPERS
    ========================================= */

    function escapeHTML(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function formatCurrency(amount) {

        const number =
            Number(amount) || 0;

        return new Intl.NumberFormat(
            "en-ZA",
            {
                style: "currency",
                currency: "ZAR",
                minimumFractionDigits: 2
            }
        ).format(number);

    }


    function formatDate(dateValue) {

        if (!dateValue) {
            return "—";
        }

        const date =
            new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "—";
        }

        return new Intl.DateTimeFormat(
            "en-ZA",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        ).format(date);

    }


    function getCustomerName(lead) {

        return (
            lead.customer?.name ||
            lead.customerName ||
            "Unknown Customer"
        );

    }


    function getVehicleName(lead) {

        return (
            lead.vehicleInterest?.model ||
            lead.vehicle?.model ||
            lead.vehicleModel ||
            "Vehicle"
        );

    }


    function getStockNumber(lead) {

        return (
            lead.vehicleInterest?.stockNumber ||
            lead.vehicle?.stockNumber ||
            lead.stockNumber ||
            ""
        );

    }


    function getAgentName(lead) {

        return (
            lead.referral?.agentName ||
            lead.agentName ||
            "Unassigned"
        );

    }


    function getAgentId(lead) {

        return (
            lead.referral?.agentId ||
            lead.agentId ||
            ""
        );

    }


    function getLeadId(lead) {

        return (
            lead.leadId ||
            lead.id ||
            "—"
        );

    }


    /* =========================================
       SOLD LEADS
    ========================================= */

    function getSoldLeads() {

        return leads.filter(lead => {

            return String(lead.status || "")
                .toLowerCase() === "sold";

        });

    }


    /* =========================================
       ENSURE COMMISSION
    ========================================= */

    function ensureCommissionRecord(lead) {

        if (!lead.commission) {

            lead.commission = {
                amount: commissionRate,
                currency: "ZAR",
                earned: true,
                payoutStatus: "pending",
                soldAt: new Date().toISOString()
            };

            return true;

        }


        let changed = false;


        if (
            lead.commission.amount === undefined ||
            lead.commission.amount === null
        ) {

            lead.commission.amount =
                commissionRate;

            changed = true;

        }


        if (!lead.commission.currency) {

            lead.commission.currency = "ZAR";

            changed = true;

        }


        if (lead.commission.earned !== true) {

            lead.commission.earned = true;

            changed = true;

        }


        if (!lead.commission.payoutStatus) {

            lead.commission.payoutStatus =
                "pending";

            changed = true;

        }


        if (!lead.commission.soldAt) {

            lead.commission.soldAt =
                lead.updatedAt ||
                new Date().toISOString();

            changed = true;

        }


        return changed;

    }


    function prepareSoldLeads() {

        let changed = false;

        const soldLeads =
            getSoldLeads();


        soldLeads.forEach(lead => {

            if (
                ensureCommissionRecord(lead)
            ) {
                changed = true;
            }

        });


        if (changed) {
            saveLeads();
        }

    }


    /* =========================================
       AGENT FILTER
    ========================================= */

    function populateAgentFilter() {

        const currentValue =
            agentFilter.value;

        agentFilter.innerHTML =
            `<option value="all">
                All Sales Agents
            </option>`;


        agents.forEach(agent => {

            if (!agent.id) {
                return;
            }

            const option =
                document.createElement("option");

            option.value =
                agent.id;

            option.textContent =
                agent.name || "Unnamed Agent";

            agentFilter.appendChild(option);

        });


        if (
            [...agentFilter.options]
                .some(option =>
                    option.value === currentValue
                )
        ) {

            agentFilter.value =
                currentValue;

        }

    }


    /* =========================================
       FILTER
    ========================================= */

    function getFilteredSales() {

        const search =
            searchInput.value
                .trim()
                .toLowerCase();

        const payment =
            paymentFilter.value;

        const selectedAgent =
            agentFilter.value;


        return getSoldLeads().filter(lead => {

            const customer =
                getCustomerName(lead);

            const vehicle =
                getVehicleName(lead);

            const agent =
                getAgentName(lead);

            const leadId =
                getLeadId(lead);

            const phone =
                lead.customer?.phone ||
                lead.customer?.whatsapp ||
                lead.phone ||
                "";


            const searchableText = [
                customer,
                vehicle,
                agent,
                leadId,
                phone,
                getStockNumber(lead)
            ]
                .join(" ")
                .toLowerCase();


            if (
                search &&
                !searchableText.includes(search)
            ) {
                return false;
            }


            const payoutStatus =
                lead.commission?.payoutStatus ||
                "pending";


            if (
                payment !== "all" &&
                payoutStatus !== payment
            ) {
                return false;
            }


            if (
                selectedAgent !== "all" &&
                getAgentId(lead) !== selectedAgent
            ) {
                return false;
            }


            return true;

        });

    }


    /* =========================================
       SUMMARY
    ========================================= */

    function updateSummary() {

        const soldLeads =
            getSoldLeads();


        let total = 0;
        let pending = 0;
        let paid = 0;


        soldLeads.forEach(lead => {

            const amount =
                Number(
                    lead.commission?.amount
                ) || 0;

            const payoutStatus =
                lead.commission?.payoutStatus ||
                "pending";


            total += amount;


            if (payoutStatus === "paid") {
                paid += amount;
            } else {
                pending += amount;
            }

        });


        totalCommission.textContent =
            formatCurrency(total);

        pendingCommission.textContent =
            formatCurrency(pending);

        paidCommission.textContent =
            formatCurrency(paid);

        vehiclesSold.textContent =
            soldLeads.length;

        currentRate.textContent =
            formatCurrency(commissionRate);

    }


    /* =========================================
       RENDER TABLE
    ========================================= */

    function renderTable() {

        const sales =
            getFilteredSales();


        tableBody.innerHTML = "";

        commissionCount.textContent =
            `${sales.length} ${
                sales.length === 1
                    ? "record"
                    : "records"
            }`;


        if (sales.length === 0) {

            emptyState.hidden = false;

            return;

        }


        emptyState.hidden = true;


        sales.sort((a, b) => {

            const dateA =
                new Date(
                    a.commission?.soldAt ||
                    a.updatedAt ||
                    a.createdAt ||
                    0
                );

            const dateB =
                new Date(
                    b.commission?.soldAt ||
                    b.updatedAt ||
                    b.createdAt ||
                    0
                );

            return dateB - dateA;

        });


        sales.forEach(lead => {

            const tr =
                document.createElement("tr");


            const leadId =
                getLeadId(lead);

            const customer =
                getCustomerName(lead);

            const vehicle =
                getVehicleName(lead);

            const stock =
                getStockNumber(lead);

            const agent =
                getAgentName(lead);

            const amount =
                Number(
                    lead.commission?.amount
                ) || 0;

            const payoutStatus =
                lead.commission?.payoutStatus ||
                "pending";

            const soldDate =
                lead.commission?.soldAt ||
                lead.updatedAt ||
                lead.createdAt;


            const paymentLabel =
                payoutStatus === "paid"
                    ? "Paid"
                    : "Pending";


            tr.innerHTML = `

                <td>

                    <div class="sale-id">
                        ${escapeHTML(leadId)}
                    </div>

                    <div class="sale-subtitle">
                        Completed sale
                    </div>

                </td>


                <td>

                    <div class="customer-name">
                        ${escapeHTML(customer)}
                    </div>

                </td>


                <td>

                    <div class="vehicle-name">
                        ${escapeHTML(vehicle)}
                    </div>

                    ${
                        stock
                            ? `
                                <div class="vehicle-stock">
                                    Stock: ${escapeHTML(stock)}
                                </div>
                              `
                            : ""
                    }

                </td>


                <td>

                    <div class="agent-name">
                        ${escapeHTML(agent)}
                    </div>

                </td>


                <td>

                    <div class="date-text">
                        ${formatDate(soldDate)}
                    </div>

                </td>


                <td>

                    <div class="commission-amount">
                        ${formatCurrency(amount)}
                    </div>

                </td>


                <td>

                    <span class="payment-status ${payoutStatus}">

                        <span class="payment-dot"></span>

                        ${paymentLabel}

                    </span>

                </td>


                <td>

                    <button
                        class="action-button"
                        type="button"
                        data-sale-id="${escapeHTML(leadId)}">

                        View

                    </button>

                </td>

            `;


            tableBody.appendChild(tr);

        });

    }


    /* =========================================
       RENDER
    ========================================= */

    function render() {

        updateSummary();

        populateAgentFilter();

        renderTable();

    }


    /* =========================================
       SETTINGS MODAL
    ========================================= */

    function openSettingsModal() {

        commissionRateInput.value =
            commissionRate;

        settingsModal.hidden = false;

        setTimeout(() => {
            commissionRateInput.focus();
        }, 50);

    }


    function closeSettingsModal() {

        settingsModal.hidden = true;

    }


    settingsButton.addEventListener(
        "click",
        openSettingsModal
    );


    changeRateButton.addEventListener(
        "click",
        openSettingsModal
    );


    closeSettings.addEventListener(
        "click",
        closeSettingsModal
    );


    cancelSettings.addEventListener(
        "click",
        closeSettingsModal
    );


    settingsModal.addEventListener(
        "click",
        event => {

            if (
                event.target === settingsModal
            ) {
                closeSettingsModal();
            }

        }
    );


    /* =========================================
       SAVE COMMISSION RATE
    ========================================= */

    settingsForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const newRate =
                Number(
                    commissionRateInput.value
                );


            if (
                !Number.isFinite(newRate) ||
                newRate < 0
            ) {

                alert(
                    "Please enter a valid commission amount."
                );

                return;

            }


            commissionRate =
                newRate;


            saveCommissionRate();


            closeSettingsModal();


            alert(
                `Commission rate updated to ${formatCurrency(
                    commissionRate
                )}.`
            );


            render();

        }
    );


    /* =========================================
       SALE DETAILS
    ========================================= */

    function findSaleById(id) {

        return getSoldLeads()
            .find(lead =>
                getLeadId(lead) === id
            );

    }


    function openSaleModal(lead) {

        if (!lead) {
            return;
        }


        selectedSaleId =
            getLeadId(lead);


        detailLeadId.textContent =
            getLeadId(lead);

        detailCustomer.textContent =
            getCustomerName(lead);

        detailVehicle.textContent =
            getVehicleName(lead);

        detailAgent.textContent =
            getAgentName(lead);

        detailSoldDate.textContent =
            formatDate(
                lead.commission?.soldAt ||
                lead.updatedAt ||
                lead.createdAt
            );


        detailCommission.textContent =
            formatCurrency(
                lead.commission?.amount || 0
            );


        detailPaymentStatus.value =
            lead.commission?.payoutStatus ||
            "pending";


        saleModal.hidden = false;

    }


    function closeSaleModal() {

        selectedSaleId = null;

        saleModal.hidden = true;

    }


    tableBody.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-sale-id]"
                );


            if (!button) {
                return;
            }


            const lead =
                findSaleById(
                    button.dataset.saleId
                );


            openSaleModal(lead);

        }
    );


    closeSale.addEventListener(
        "click",
        closeSaleModal
    );


    closeSaleButton.addEventListener(
        "click",
        closeSaleModal
    );


    saleModal.addEventListener(
        "click",
        event => {

            if (
                event.target === saleModal
            ) {
                closeSaleModal();
            }

        }
    );


    /* =========================================
       SAVE PAYMENT STATUS
    ========================================= */

    savePaymentStatus.addEventListener(
        "click",
        () => {

            if (!selectedSaleId) {
                return;
            }


            const lead =
                findSaleById(
                    selectedSaleId
                );


            if (!lead) {

                alert(
                    "The selected sale could not be found."
                );

                return;

            }


            if (!lead.commission) {

                lead.commission = {
                    amount: commissionRate,
                    currency: "ZAR",
                    earned: true,
                    payoutStatus: "pending",
                    soldAt:
                        lead.updatedAt ||
                        new Date().toISOString()
                };

            }


            lead.commission.payoutStatus =
                detailPaymentStatus.value;


            lead.updatedAt =
                new Date().toISOString();


            saveLeads();


            closeSaleModal();


            render();


            alert(
                detailPaymentStatus.value === "paid"
                    ? "Commission marked as PAID."
                    : "Commission marked as PENDING."
            );

        }
    );


    /* =========================================
       FILTER EVENTS
    ========================================= */

    searchInput.addEventListener(
        "input",
        renderTable
    );


    paymentFilter.addEventListener(
        "change",
        renderTable
    );


    agentFilter.addEventListener(
        "change",
        renderTable
    );


    resetFilters.addEventListener(
        "click",
        () => {

            searchInput.value = "";

            paymentFilter.value = "all";

            agentFilter.value = "all";

            renderTable();

        }
    );


    /* =========================================
       KEYBOARD
    ========================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }


            if (!settingsModal.hidden) {
                closeSettingsModal();
            }


            if (!saleModal.hidden) {
                closeSaleModal();
            }

        }
    );


    /* =========================================
       YEAR
    ========================================= */

    const year =
        document.getElementById(
            "currentYear"
        );

    if (year) {

        year.textContent =
            new Date().getFullYear();

    }


    /* =========================================
       INITIALIZE
    ========================================= */

    loadData();

    prepareSoldLeads();

    render();

});