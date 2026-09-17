/* =========================================================
   CHERY PINETOWN LEADS
   LEAD REGISTRATION JAVASCRIPT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================================
           ELEMENTS
        ================================================= */

        const leadForm =
            document.getElementById(
                "leadForm"
            );


        const leadReference =
            document.getElementById(
                "leadReference"
            );


        const successModal =
            document.getElementById(
                "successModal"
            );


        const generatedLeadId =
            document.getElementById(
                "generatedLeadId"
            );


        const copyLeadId =
            document.getElementById(
                "copyLeadId"
            );


        const leadNotes =
            document.getElementById(
                "leadNotes"
            );


        const characterCount =
            document.getElementById(
                "characterCount"
            );


        const clearForm =
            document.getElementById(
                "clearForm"
            );


        /* =================================================
           GENERATE LEAD ID
        ================================================= */

        function generateLeadId() {

            const date =
                new Date();


            const year =
                date.getFullYear();


            const month =
                String(
                    date.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                );


            const day =
                String(
                    date.getDate()
                ).padStart(
                    2,
                    "0"
                );


            const characters =
                "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";


            let randomCode =
                "";


            for (
                let i = 0;
                i < 4;
                i++
            ) {

                randomCode +=
                    characters[
                        Math.floor(
                            Math.random() *
                            characters.length
                        )
                    ];

            }


            return (
                "CH-PTN-" +
                year +
                month +
                day +
                "-" +
                randomCode
            );

        }


        /* =================================================
           INITIAL LEAD REFERENCE
        ================================================= */

        const currentLeadId =
            generateLeadId();


        if (leadReference) {

            leadReference.textContent =
                currentLeadId;

        }



        /* =================================================
           FIELD ERROR
        ================================================= */

        function showError(
            field,
            message
        ) {

            const group =
                field.closest(
                    ".form-group"
                );


            if (!group) {
                return;
            }


            group.classList.add(
                "has-error"
            );


            const error =
                group.querySelector(
                    ".field-error"
                );


            if (error) {

                error.textContent =
                    message;

            }

        }


        /* =================================================
           CLEAR FIELD ERROR
        ================================================= */

        function clearError(
            field
        ) {

            const group =
                field.closest(
                    ".form-group"
                );


            if (!group) {
                return;
            }


            group.classList.remove(
                "has-error"
            );


            const error =
                group.querySelector(
                    ".field-error"
                );


            if (error) {

                error.textContent =
                    "";

            }

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
           VALIDATE EMAIL
        ================================================= */

        function validEmail(
            email
        ) {

            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(
                    email
                );

        }



        /* =================================================
           VALIDATE FORM
        ================================================= */

        function validateForm() {

            let valid =
                true;


            const customerName =
                document.getElementById(
                    "customerName"
                );


            const customerPhone =
                document.getElementById(
                    "customerPhone"
                );


            const customerEmail =
                document.getElementById(
                    "customerEmail"
                );


            const vehicleModel =
                document.getElementById(
                    "vehicleModel"
                );


            const vehicleCondition =
                document.getElementById(
                    "vehicleCondition"
                );


            const leadSource =
                document.getElementById(
                    "leadSource"
                );


            /* CUSTOMER NAME */

            if (
                customerName.value.trim()
                    .length < 2
            ) {

                showError(
                    customerName,
                    "Please enter the customer's full name."
                );

                valid =
                    false;

            } else {

                clearError(
                    customerName
                );

            }


            /* PHONE */

            if (
                !validPhone(
                    customerPhone.value
                )
            ) {

                showError(
                    customerPhone,
                    "Enter a valid South African mobile number."
                );

                valid =
                    false;

            } else {

                clearError(
                    customerPhone
                );

            }


            /* EMAIL */

            if (
                customerEmail.value.trim() !== ""
                &&
                !validEmail(
                    customerEmail.value.trim()
                )
            ) {

                showError(
                    customerEmail,
                    "Enter a valid email address."
                );

                valid =
                    false;

            } else {

                clearError(
                    customerEmail
                );

            }


            /* VEHICLE */

            if (
                vehicleModel.value === ""
            ) {

                showError(
                    vehicleModel,
                    "Please select a vehicle."
                );

                valid =
                    false;

            } else {

                clearError(
                    vehicleModel
                );

            }


            /* CONDITION */

            if (
                vehicleCondition.value === ""
            ) {

                showError(
                    vehicleCondition,
                    "Please select vehicle condition."
                );

                valid =
                    false;

            } else {

                clearError(
                    vehicleCondition
                );

            }


            /* LEAD SOURCE */

            if (
                leadSource.value === ""
            ) {

                showError(
                    leadSource,
                    "Please select the lead source."
                );

                valid =
                    false;

            } else {

                clearError(
                    leadSource
                );

            }


            return valid;

        }



        /* =================================================
           COLLECT FORM DATA
        ================================================= */

        function collectLeadData(
            leadId
        ) {

            return {

                leadId:

                    leadId,


                createdAt:

                    new Date()
                        .toISOString(),


                updatedAt:

                    new Date()
                        .toISOString(),


                status:

                    "new",


                leadSource:

                    document
                        .getElementById(
                            "leadSource"
                        )
                        .value,


                customer: {

                    name:

                        document
                            .getElementById(
                                "customerName"
                            )
                            .value
                            .trim(),


                    phone:

                        document
                            .getElementById(
                                "customerPhone"
                            )
                            .value
                            .trim(),


                    whatsapp:

                        document
                            .getElementById(
                                "customerWhatsapp"
                            )
                            .value
                            .trim(),


                    email:

                        document
                            .getElementById(
                                "customerEmail"
                            )
                            .value
                            .trim(),


                    province:

                        document
                            .getElementById(
                                "province"
                            )
                            .value,


                    city:

                        document
                            .getElementById(
                                "city"
                            )
                            .value
                            .trim()

                },


                vehicleInterest: {

                    model:

                        document
                            .getElementById(
                                "vehicleModel"
                            )
                            .value,


                    condition:

                        document
                            .getElementById(
                                "vehicleCondition"
                            )
                            .value,


                    stockNumber:

                        document
                            .getElementById(
                                "stockNumber"
                            )
                            .value
                            .trim(),


                    purchaseTimeframe:

                        document
                            .getElementById(
                                "purchaseTimeframe"
                            )
                            .value

                },


                referral: {

                    referralCode:

                        document
                            .getElementById(
                                "referralCode"
                            )
                            .value
                            .trim(),


                    agentName:

                        document
                            .getElementById(
                                "agentName"
                            )
                            .value
                            .trim(),


                    agentNumber:

                        document
                            .getElementById(
                                "agentNumber"
                            )
                            .value
                            .trim()

                },


                notes:

                    document
                        .getElementById(
                            "leadNotes"
                        )
                        .value
                        .trim(),


                commission: {

                    amount:
                        0,

                    currency:
                        "ZAR",

                    earned:
                        false,

                    payoutStatus:
                        "not_earned",

                    soldAt:
                        null

                },


                statusHistory: [

                    {

                        status:
                            "new",

                        note:
                            "Lead registered",

                        at:
                            new Date()
                                .toISOString()

                    }

                ]

            };

        }



        /* =================================================
           SAVE TO LOCAL STORAGE
        ================================================= */

        function saveLead(
            lead
        ) {

            const existing =
                JSON.parse(
                    localStorage.getItem(
                        "cheryPinetownLeads"
                    )
                ) || [];


            existing.unshift(
                lead
            );


            localStorage.setItem(
                "cheryPinetownLeads",
                JSON.stringify(
                    existing
                )
            );

        }



        /* =================================================
           FORM SUBMIT
        ================================================= */

        if (leadForm) {

            leadForm.addEventListener(
                "submit",
                event => {

                    event.preventDefault();


                    if (
                        !validateForm()
                    ) {

                        const firstError =
                            document.querySelector(
                                ".has-error input, .has-error select, .has-error textarea"
                            );


                        if (firstError) {

                            firstError.focus();

                        }


                        return;

                    }


                    const newLeadId =
                        generateLeadId();


                    const lead =
                        collectLeadData(
                            newLeadId
                        );


                    saveLead(
                        lead
                    );


                    if (
                        generatedLeadId
                    ) {

                        generatedLeadId.textContent =
                            newLeadId;

                    }


                    if (
                        successModal
                    ) {

                        successModal.hidden =
                            false;

                        document.body.style.overflow =
                            "hidden";

                    }


                    console.log(
                        "Lead registered:",
                        lead
                    );

                }
            );

        }



        /* =================================================
           CHARACTER COUNTER
        ================================================= */

        if (
            leadNotes &&
            characterCount
        ) {

            leadNotes.addEventListener(
                "input",
                () => {

                    characterCount.textContent =
                        leadNotes.value.length +
                        " / 1000";

                }
            );

        }



        /* =================================================
           COPY LEAD ID
        ================================================= */

        if (copyLeadId) {

            copyLeadId.addEventListener(
                "click",
                async () => {

                    const id =
                        generatedLeadId.textContent;


                    try {

                        await navigator
                            .clipboard
                            .writeText(
                                id
                            );


                        copyLeadId.textContent =
                            "Copied!";


                        setTimeout(
                            () => {

                                copyLeadId.textContent =
                                    "Copy Lead ID";

                            },
                            1500
                        );


                    } catch (error) {

                        console.error(
                            "Could not copy Lead ID:",
                            error
                        );

                    }

                }
            );

        }



        /* =================================================
           CLEAR FORM
        ================================================= */

        if (clearForm) {

            clearForm.addEventListener(
                "click",
                () => {

                    setTimeout(
                        () => {

                            document
                                .querySelectorAll(
                                    ".form-group"
                                )
                                .forEach(
                                    group => {

                                        group.classList.remove(
                                            "has-error",
                                            "has-success"
                                        );

                                    }
                                );


                            if (characterCount) {

                                characterCount.textContent =
                                    "0 / 1000";

                            }

                        },
                        0
                    );

                }
            );

        }



        /* =================================================
           LIVE ERROR CLEARING
        ================================================= */

        document
            .querySelectorAll(
                ".form-group input, .form-group select, .form-group textarea"
            )
            .forEach(
                field => {

                    field.addEventListener(
                        "input",
                        () => {

                            clearError(
                                field
                            );

                        }
                    );


                    field.addEventListener(
                        "change",
                        () => {

                            clearError(
                                field
                            );

                        }
                    );

                }
            );



        /* =================================================
           CONSOLE
        ================================================= */

        console.log(
            "Lead registration page loaded."
        );

    }
);