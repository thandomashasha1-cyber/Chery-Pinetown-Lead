
import { db } from "../public/js/firebase-config.js";

import {
    collection,
    getDocs,
    query,
    orderBy,
    doc,
    updateDoc,
    serverTimestamp
} from
    "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


/* =========================================
   SETTINGS
========================================= */

const LEADS_COLLECTION = "leads";


let leads = [];



/* =========================================
   DOM
========================================= */

const leadsTable =
    document.getElementById(
        "leadsTableBody"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const statusFilter =
    document.getElementById(
        "statusFilter"
    );

const vehicleFilter =
    document.getElementById(
        "vehicleFilter"
    );

const agentFilter =
    document.getElementById(
        "agentFilter"
    );



/* =========================================
   LOAD FIREBASE LEADS
========================================= */

async function loadLeads() {

    try {

        console.log(
            "Loading leads from Firebase..."
        );


        const leadsQuery =
            query(

                collection(
                    db,
                    LEADS_COLLECTION
                ),

                orderBy(
                    "createdAt",
                    "desc"
                )

            );


        const snapshot =
            await getDocs(
                leadsQuery
            );


        leads = [];


        snapshot.forEach(
            documentSnapshot => {

                const data =
                    documentSnapshot.data();


                leads.push({

                    firebaseId:
                        documentSnapshot.id,

                    ...data

                });

            }
        );


        console.log(
            "Firebase leads:",
            leads
        );


        renderLeads();

        updateSummary();


        populateFilters();


    } catch (error) {

        console.error(
            "Could not load Firebase leads:",
            error
        );


        if (leadsTable) {

            leadsTable.innerHTML = `

                <tr>

                    <td
                        colspan="9"
                        style="
                            text-align:center;
                            padding:30px;
                            color:#b91c1c;
                        "
                    >

                        Unable to load leads from Firebase.

                        <br><br>

                        <small>
                            ${escapeHTML(
                                error.message
                            )}
                        </small>

                    </td>

                </tr>

            `;

        }

    }

}



/* =========================================
   RENDER
========================================= */

function renderLeads() {

    if (!leadsTable) {

        console.warn(
            "leadsTableBody not found."
        );

        return;

    }


    let filtered =
        [...leads];


    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const status =
        statusFilter
            ? statusFilter.value
            : "all";


    const vehicle =
        vehicleFilter
            ? vehicleFilter.value
            : "all";


    const agent =
        agentFilter
            ? agentFilter.value
            : "all";



    /* ==============================
       SEARCH
    ============================== */

    if (search) {

        filtered =
            filtered.filter(
                lead => {

                    const name =
                        lead.customer
                            ?.name
                            ?.toLowerCase()
                            || "";


                    const phone =
                        lead.customer
                            ?.phone
                            ?.toLowerCase()
                            || "";


                    const leadId =
                        lead.leadId
                            ?.toLowerCase()
                            || "";


                    const agentName =
                        lead.referral
                            ?.agentName
                            ?.toLowerCase()
                            || "";


                    return (

                        name.includes(
                            search
                        )

                        ||

                        phone.includes(
                            search
                        )

                        ||

                        leadId.includes(
                            search
                        )

                        ||

                        agentName.includes(
                            search
                        )

                    );

                }
            );

    }



    /* ==============================
       STATUS
    ============================== */

    if (
        status &&
        status !== "all"
    ) {

        filtered =
            filtered.filter(
                lead =>
                    lead.status ===
                    status
            );

    }



    /* ==============================
       VEHICLE
    ============================== */

    if (
        vehicle &&
        vehicle !== "all"
    ) {

        filtered =
            filtered.filter(
                lead =>
                    lead.vehicleInterest
                        ?.model ===
                    vehicle
            );

    }



    /* ==============================
       AGENT
    ============================== */

    if (
        agent &&
        agent !== "all"
    ) {

        filtered =
            filtered.filter(
                lead =>
                    lead.referral
                        ?.agentName ===
                    agent
            );

    }



    /* ==============================
       EMPTY
    ============================== */

    if (
        filtered.length === 0
    ) {

        leadsTable.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    style="
                        text-align:center;
                        padding:35px;
                        color:#6b7280;
                    "
                >

                    No leads found.

                </td>

            </tr>

        `;

        return;

    }



    /* ==============================
       ROWS
    ============================== */

    leadsTable.innerHTML =
        filtered
            .map(
                lead =>
                    createLeadRow(
                        lead
                    )
            )
            .join("");

}



/* =========================================
   CREATE ROW
========================================= */

function createLeadRow(
    lead
) {

    const name =
        lead.customer
            ?.name ||
        "-";


    const phone =
        lead.customer
            ?.phone ||
        "-";


    const vehicle =
        lead.vehicleInterest
            ?.model ||
        "-";


    const agent =
        lead.referral
            ?.agentName ||
        "Unassigned";


    const source =
        lead.leadSource ||
        "Website";


    const status =
        lead.status ||
        "new";


    const created =
        formatDate(
            lead.createdAt
        );


    return `

        <tr>

            <td>

                <strong>
                    ${escapeHTML(
                        lead.leadId || "-"
                    )}
                </strong>

            </td>


            <td>

                <div>
                    ${escapeHTML(
                        name
                    )}
                </div>

                <small>
                    ${escapeHTML(
                        phone
                    )}
                </small>

            </td>


            <td>

                ${escapeHTML(
                    vehicle
                )}

            </td>


            <td>

                ${escapeHTML(
                    agent
                )}

            </td>


            <td>

                <span
                    class="source-badge"
                >
                    ${escapeHTML(
                        source
                    )}
                </span>

            </td>


            <td>

                <span
                    class="status-badge status-${escapeHTML(
                        status
                    )}"
                >

                    ${formatStatus(
                        status
                    )}

                </span>

            </td>


            <td>

                ${created}

            </td>


            <td>

                <button
                    type="button"
                    class="view-lead-button"
                    data-id="${escapeHTML(
                        lead.firebaseId
                    )}"
                >

                    View

                </button>

            </td>

        </tr>

    `;

}



/* =========================================
   SUMMARY
========================================= */

function updateSummary() {

    const total =
        leads.length;


    const newLeads =
        leads.filter(
            lead =>
                lead.status === "new"
        ).length;


    const testDrives =
        leads.filter(
            lead =>
                lead.status ===
                "test_drive"
        ).length;


    const approved =
        leads.filter(
            lead =>
                lead.status ===
                "approved"
        ).length;


    const sold =
        leads.filter(
            lead =>
                lead.status ===
                "sold"
        ).length;



    setText(
        "totalLeads",
        total
    );


    setText(
        "newLeads",
        newLeads
    );


    setText(
        "testDrives",
        testDrives
    );


    setText(
        "approvedLeads",
        approved
    );


    setText(
        "vehiclesSold",
        sold
    );

}



/* =========================================
   FILTERS
========================================= */

function populateFilters() {

    if (vehicleFilter) {

        const vehicles =
            [
                ...new Set(

                    leads
                        .map(
                            lead =>
                                lead.vehicleInterest
                                    ?.model
                        )
                        .filter(Boolean)

                )
            ];


        vehicleFilter.innerHTML = `

            <option value="all">
                All Vehicles
            </option>

            ${vehicles
                .map(
                    vehicle => `

                        <option
                            value="${escapeHTML(
                                vehicle
                            )}"
                        >

                            ${escapeHTML(
                                vehicle
                            )}

                        </option>

                    `
                )
                .join("")}

        `;

    }



    if (agentFilter) {

        const agents =
            [
                ...new Set(

                    leads
                        .map(
                            lead =>
                                lead.referral
                                    ?.agentName
                        )
                        .filter(Boolean)

                )
            ];


        agentFilter.innerHTML = `

            <option value="all">
                All Agents
            </option>

            ${agents
                .map(
                    agent => `

                        <option
                            value="${escapeHTML(
                                agent
                            )}"
                        >

                            ${escapeHTML(
                                agent
                            )}

                        </option>

                    `
                )
                .join("")}

        `;

    }

}



/* =========================================
   CHANGE STATUS
========================================= */

async function changeLeadStatus(
    firebaseId,
    newStatus
) {

    try {

        const leadRef =
            doc(
                db,
                LEADS_COLLECTION,
                firebaseId
            );


        await updateDoc(
            leadRef,
            {

                status:
                    newStatus,

                updatedAt:
                    serverTimestamp()

            }
        );


        await loadLeads();


    } catch (error) {

        console.error(
            "Status update failed:",
            error
        );

        alert(
            "Could not update the lead."
        );

    }

}



/* =========================================
   DATE
========================================= */

function formatDate(
    timestamp
) {

    if (!timestamp) {

        return "-";

    }


    let date;


    if (
        timestamp.toDate
    ) {

        date =
            timestamp.toDate();

    }

    else if (
        timestamp.seconds
    ) {

        date =
            new Date(
                timestamp.seconds *
                1000
            );

    }

    else {

        date =
            new Date(timestamp);

    }


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "-";

    }


    return date.toLocaleDateString(
        "en-ZA",
        {

            day: "2-digit",

            month: "short",

            year: "numeric"

        }
    );

}



/* =========================================
   STATUS LABEL
========================================= */

function formatStatus(
    status
) {

    const labels = {

        new: "New",

        contacted: "Contacted",

        qualified: "Qualified",

        "test drive":
            "Test Drive",

        test_drive:
            "Test Drive",

        quoted: "Quoted",

        finance: "Finance",

        approved: "Approved",

        sold: "Sold",

        lost: "Lost"

    };


    return (
        labels[status] ||
        status
    );

}



/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
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



/* =========================================
   SET TEXT
========================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}



/* =========================================
   SEARCH
========================================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderLeads
    );

}


if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        renderLeads
    );

}


if (vehicleFilter) {

    vehicleFilter.addEventListener(
        "change",
        renderLeads
    );

}


if (agentFilter) {

    agentFilter.addEventListener(
        "change",
        renderLeads
    );

}



/* =========================================
   VIEW BUTTON
========================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".view-lead-button"
            );


        if (!button) {

            return;

        }


        const firebaseId =
            button.dataset.id;


        const lead =
            leads.find(
                item =>
                    item.firebaseId ===
                    firebaseId
            );


        if (!lead) {

            return;

        }


        /*
        For now we show the lead
        information.

        We will connect this to
        your existing lead-details
        modal next.
        */

        alert(

            `Lead: ${lead.leadId}

Customer: ${lead.customer?.name || "-"}

Phone: ${lead.customer?.phone || "-"}

Vehicle: ${lead.vehicleInterest?.model || "-"}

Source: ${lead.leadSource || "-"}

Status: ${formatStatus(
    lead.status || "new"
)}

Agent: ${lead.referral?.agentName || "Unassigned"}`

        );

    }
);



/* =========================================
   START
========================================= */

loadLeads();

