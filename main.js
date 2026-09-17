/* =========================================================
   CHERY PINETOWN LEADS
   MAIN DASHBOARD JAVASCRIPT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* ================================================
           CURRENT YEAR
        ================================================= */

        const currentYear =
            document.getElementById(
                "currentYear"
            );


        if (currentYear) {

            currentYear.textContent =
                new Date().getFullYear();

        }



        /* ================================================
           NAVIGATION
        ================================================= */

        const navigationLinks =
            document.querySelectorAll(
                ".main-navigation a"
            );


        navigationLinks.forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        navigationLinks.forEach(
                            item => {
                                item.classList.remove(
                                    "active"
                                );
                            }
                        );


                        link.classList.add(
                            "active"
                        );

                    }
                );

            }
        );



        /* ================================================
           SYSTEM STATUS
        ================================================= */

        const systemStatus =
            document.getElementById(
                "systemStatus"
            );


        if (systemStatus) {

            systemStatus.title =
                "Frontend is running successfully.";

        }



        /* ================================================
           DATABASE STATUS
        ================================================= */

        const databaseStatus =
            document.getElementById(
                "databaseStatus"
            );


        if (databaseStatus) {

            databaseStatus.textContent =
                "Not connected";

        }



        /* ================================================
           SUMMARY VALUES
        ================================================= */

        const values = {

            totalLeads: 0,

            newLeads: 0,

            testDrives: 0,

            approvedLeads: 0,

            soldLeads: 0,

            commissionTotal: 0

        };


        const totalLeads =
            document.getElementById(
                "totalLeads"
            );


        const newLeads =
            document.getElementById(
                "newLeads"
            );


        const testDrives =
            document.getElementById(
                "testDrives"
            );


        const approvedLeads =
            document.getElementById(
                "approvedLeads"
            );


        const soldLeads =
            document.getElementById(
                "soldLeads"
            );


        const commissionTotal =
            document.getElementById(
                "commissionTotal"
            );


        if (totalLeads) {

            totalLeads.textContent =
                values.totalLeads;

        }


        if (newLeads) {

            newLeads.textContent =
                values.newLeads;

        }


        if (testDrives) {

            testDrives.textContent =
                values.testDrives;

        }


        if (approvedLeads) {

            approvedLeads.textContent =
                values.approvedLeads;

        }


        if (soldLeads) {

            soldLeads.textContent =
                values.soldLeads;

        }


        if (commissionTotal) {

            commissionTotal.textContent =
                "R" +
                values.commissionTotal
                    .toLocaleString(
                        "en-ZA"
                    );

        }



        /* ================================================
           PIPELINE
        ================================================= */

        const pipelineElements = {

            new: "pipelineNew",

            contacted: "pipelineContacted",

            qualified: "pipelineQualified",

            testDrive: "pipelineTestDrive",

            quoted: "pipelineQuoted",

            finance: "pipelineFinance",

            approved: "pipelineApproved",

            sold: "pipelineSold"

        };


        Object.values(
            pipelineElements
        ).forEach(
            id => {

                const element =
                    document.getElementById(
                        id
                    );


                if (element) {

                    element.textContent =
                        "0";

                }

            }
        );



        /* ================================================
           REFERRAL SUMMARY
        ================================================= */

        const referralElements = {

            referredLeads:
                "referredLeads",

            referralSales:
                "referralSales",

            referralCommission:
                "referralCommission"

        };


        const referredLeads =
            document.getElementById(
                referralElements.referredLeads
            );


        const referralSales =
            document.getElementById(
                referralElements.referralSales
            );


        const referralCommission =
            document.getElementById(
                referralElements.referralCommission
            );


        if (referredLeads) {

            referredLeads.textContent =
                "0";

        }


        if (referralSales) {

            referralSales.textContent =
                "0";

        }


        if (referralCommission) {

            referralCommission.textContent =
                "R0";

        }



        /* ================================================
           RECENT LEADS
        ================================================= */

        const recentLeadsTable =
            document.getElementById(
                "recentLeadsTable"
            );


        if (recentLeadsTable) {

            recentLeadsTable.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        class="empty-table"
                    >

                        No leads registered yet.

                        <br>

                        <a
                            href="pages/register.html"
                            style="
                                color:#e30613;
                                font-weight:800;
                                display:inline-block;
                                margin-top:7px;
                            "
                        >
                            Register the first lead →

                        </a>

                    </td>

                </tr>

            `;

        }



        /* ================================================
           PAGE LOAD MESSAGE
        ================================================= */

        console.log(
            "Chery Pinetown Leads dashboard loaded."
        );


    }
);

