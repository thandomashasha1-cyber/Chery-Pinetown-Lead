
import { db } from "./firebase-config.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from
    "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


/* =========================================
   SETTINGS
========================================= */

const LEADS_COLLECTION = "leads";


/*
IMPORTANT:

Replace this with the real Chery Pinetown
WhatsApp number.

Example:

082 123 4567

becomes:

27821234567
*/

const dealershipWhatsApp = "27676236239";


/* =========================================
   VEHICLES
========================================= */

const vehicles = {

    "Tiggo 4": {
        model: "Tiggo 4",
        name: "Chery Tiggo 4",
        condition: "New"
    },

    "Tiggo 7": {
        model: "Tiggo 7",
        name: "Chery Tiggo 7",
        condition: "New"
    },

    "Tiggo 8": {
        model: "Tiggo 8",
        name: "Chery Tiggo 8",
        condition: "New"
    },

    "Tiggo 9": {
        model: "Tiggo 9",
        name: "Chery Tiggo 9",
        condition: "New"
    },

    "OMODA C5": {
        model: "OMODA C5",
        name: "OMODA C5",
        condition: "New"
    }

};


/* =========================================
   DOM
========================================= */

const leadForm =
    document.getElementById("leadForm");

const vehicleFilter =
    document.getElementById("vehicleFilter");

const selectedVehicle =
    document.getElementById("selectedVehicle");

const enquiryType =
    document.getElementById("enquiryType");

const referralCodeInput =
    document.getElementById("referralCode");

const formMessage =
    document.getElementById("formMessage");

const submitButton =
    document.getElementById("submitButton");

const successSection =
    document.getElementById("successSection");

const enquirySection =
    document.getElementById("enquiry");

const successLeadId =
    document.getElementById("successLeadId");

const successCustomer =
    document.getElementById("successCustomer");

const successVehicle =
    document.getElementById("successVehicle");

const successEnquiry =
    document.getElementById("successEnquiry");

const copyLeadButton =
    document.getElementById("copyLeadButton");

const newEnquiryButton =
    document.getElementById("newEnquiryButton");

const currentYear =
    document.getElementById("currentYear");


/* =========================================
   YEAR
========================================= */

if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}


/* =========================================
   URL PARAMETERS
========================================= */

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const vehicleFromURL =
    urlParams.get("vehicle");

const referralFromURL =
    urlParams.get("ref");


if (
    vehicleFromURL &&
    vehicles[vehicleFromURL]
) {

    selectedVehicle.value =
        vehicleFromURL;

}


if (referralFromURL) {

    referralCodeInput.value =
        referralFromURL
            .toUpperCase();

}


/* =========================================
   MESSAGE
========================================= */

function showFormMessage(
    message,
    type = "error"
) {

    formMessage.textContent =
        message;

    formMessage.className =
        `form-message ${type}`;

}


function clearFormMessage() {

    formMessage.textContent =
        "";

    formMessage.className =
        "form-message";

}


/* =========================================
   VEHICLE FILTER
========================================= */

if (vehicleFilter) {

    vehicleFilter.addEventListener(
        "change",
        () => {

            const filter =
                vehicleFilter.value;

            document
                .querySelectorAll(
                    ".vehicle-card"
                )
                .forEach(card => {

                    const category =
                        card.dataset.category;

                    if (
                        filter === "all" ||
                        category === filter
                    ) {

                        card.style.display =
                            "";

                    } else {

                        card.style.display =
                            "none";

                    }

                });

        }
    );

}


/* =========================================
   SELECT VEHICLE
========================================= */

function selectVehicle(
    vehicleName,
    enquiry
) {

    if (!vehicles[vehicleName]) {

        return;

    }

    selectedVehicle.value =
        vehicleName;

    if (enquiry) {

        enquiryType.value =
            enquiry;

    }

    enquirySection.hidden =
        false;

    successSection.hidden =
        true;

    enquirySection.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


/* =========================================
   QUOTE BUTTONS
========================================= */

document
    .querySelectorAll(".quote-button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                selectVehicle(
                    button.dataset.vehicle,
                    "quote"
                );

            }
        );

    });


/* =========================================
   TEST DRIVE BUTTONS
========================================= */

document
    .querySelectorAll(".test-button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                selectVehicle(
                    button.dataset.vehicle,
                    "test_drive"
                );

            }
        );

    });


/* =========================================
   WHATSAPP
========================================= */

document
    .querySelectorAll(".whatsapp-button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const vehicle =
                    button.dataset.vehicle;

                const referral =
                    referralCodeInput
                        ? referralCodeInput.value
                            .trim()
                            .toUpperCase()
                        : "";


                let message =
                    `Hi Chery Pinetown 👋

I am interested in the ${vehicle}.

Please send me the price, available options and finance information.`;


                if (referral) {

                    message +=
                        `

Referral Code: ${referral}`;

                }


                message +=
                    `

Thank you.`;


                const whatsappURL =
                    `https://wa.me/${dealershipWhatsApp}?text=${encodeURIComponent(message)}`;


                window.location.href =
                    whatsappURL;

            }
        );

    });


/* =========================================
   PHONE VALIDATION
========================================= */

function isValidSouthAfricanPhone(
    phone
) {

    const cleaned =
        phone.replace(
            /\s+/g,
            ""
        );


    return /^(\+27|0)[0-9]{9}$/
        .test(cleaned);

}


/* =========================================
   CLEAN PHONE
========================================= */

function cleanPhone(phone) {

    return phone
        .replace(
            /\s+/g,
            ""
        )
        .trim();

}


/* =========================================
   LEAD ID
========================================= */

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

    const random =
        Math.random()
            .toString(36)
            .substring(
                2,
                6
            )
            .toUpperCase();


    return `CH-PTN-${year}${month}${day}-${random}`;

}


/* =========================================
   ENQUIRY LABEL
========================================= */

function getEnquiryLabel(
    value
) {

    if (value === "quote") {

        return "Quote Request";

    }

    if (value === "test_drive") {

        return "Test Drive";

    }

    if (value === "information") {

        return "Information";

    }

    return value;

}


/* =========================================
   FIREBASE TIMEOUT
========================================= */

function withTimeout(
    promise,
    milliseconds
) {

    return Promise.race([

        promise,

        new Promise(
            (_, reject) => {

                setTimeout(
                    () => {

                        reject(
                            new Error(
                                "Firebase request timed out."
                            )
                        );

                    },
                    milliseconds
                );

            }
        )

    ]);

}


/* =========================================
   FORM SUBMISSION
========================================= */

if (leadForm) {

    leadForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            clearFormMessage();


            /* ==============================
               READ FORM
            ============================== */

            const fullName =
                document
                    .getElementById(
                        "fullName"
                    )
                    .value
                    .trim();


            const phone =
                document
                    .getElementById(
                        "phone"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "email"
                    )
                    .value
                    .trim();


            const vehicleName =
                selectedVehicle.value;


            const type =
                enquiryType.value;


            const city =
                document
                    .getElementById(
                        "city"
                    )
                    .value
                    .trim();


            const notes =
                document
                    .getElementById(
                        "notes"
                    )
                    .value
                    .trim();


            const referral =
                referralCodeInput.value
                    .trim()
                    .toUpperCase();


            /* ==============================
               VALIDATION
            ============================== */

            if (!fullName) {

                showFormMessage(
                    "Please enter your full name."
                );

                return;

            }


            if (!phone) {

                showFormMessage(
                    "Please enter your mobile number."
                );

                return;

            }


            if (
                !isValidSouthAfricanPhone(
                    phone
                )
            ) {

                showFormMessage(
                    "Please enter a valid South African mobile number."
                );

                return;

            }


            if (!vehicleName) {

                showFormMessage(
                    "Please select a vehicle."
                );

                return;

            }


            if (!type) {

                showFormMessage(
                    "Please select an enquiry type."
                );

                return;

            }


            if (
                email &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    .test(email)
            ) {

                showFormMessage(
                    "Please enter a valid email address."
                );

                return;

            }


            /* ==============================
               VEHICLE
            ============================== */

            const vehicle =
                vehicles[vehicleName];


            /* ==============================
               LEAD ID
            ============================== */

            const leadId =
                generateLeadId();


            const createdAt =
                new Date()
                    .toISOString();


            /* ==============================
               LEAD OBJECT
            ============================== */

            const lead = {

                leadId: leadId,

                id: leadId,

                status: "new",

                leadSource: "TikTok",


                customer: {

                    name: fullName,

                    phone:
                        cleanPhone(phone),

                    whatsapp:
                        cleanPhone(phone),

                    email: email,

                    province:
                        "KwaZulu-Natal",

                    city: city

                },


                vehicleInterest: {

                    model:
                        vehicle.model,

                    name:
                        vehicle.name,

                    condition:
                        vehicle.condition,

                    stockNumber: ""

                },


                referral: {

                    agentId: "",

                    agentName: "",

                    agentNumber: "",

                    referralCode:
                        referral

                },


                enquiry: {

                    type: type,

                    label:
                        getEnquiryLabel(
                            type
                        )

                },


                notes: notes,


                commission: {

                    amount: 0,

                    currency: "ZAR",

                    earned: false,

                    payoutStatus:
                        "not_earned",

                    soldAt: null

                },


                statusHistory: [

                    {

                        status: "new",

                        note:
                            "Lead submitted from public TikTok vehicle page.",

                        at: createdAt

                    }

                ],


                sourceDetails: {

                    platform: "TikTok",

                    vehicle:
                        vehicle.model,

                    referralCode:
                        referral,

                    landingPage:
                        window.location.href

                },

                /*
                Extra browser information
                useful for CRM reporting.
                */

                device: {

                    userAgent:
                        navigator.userAgent,

                    language:
                        navigator.language

                }

            };


            /* ==============================
               BUTTON STATE
            ============================== */

            submitButton.disabled =
                true;

            submitButton.textContent =
                "Submitting...";


            try {

                console.log(
                    "Submitting lead to Firebase...",
                    lead
                );


                /* ==============================
                   SEND TO FIRESTORE
                ============================== */

                const result =
                    await withTimeout(

                        addDoc(
                            collection(
                                db,
                                LEADS_COLLECTION
                            ),

                            {

                                ...lead,

                                createdAt:
                                    serverTimestamp(),

                                updatedAt:
                                    serverTimestamp()

                            }
                        ),

                        15000

                    );


                console.log(
                    "Firebase document created:",
                    result.id
                );


                /* ==============================
                   SUCCESS
                ============================== */

                successLeadId.textContent =
                    leadId;


                successCustomer.textContent =
                    fullName;


                successVehicle.textContent =
                    vehicle.name;


                successEnquiry.textContent =
                    getEnquiryLabel(
                        type
                    );


                leadForm.reset();


                successSection.hidden =
                    false;


                enquirySection.hidden =
                    true;


                successSection.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });


            } catch (error) {

                console.error(
                    "Lead submission failed:",
                    error
                );


                let message =
                    "The enquiry could not be submitted.";


                if (
                    error.message.includes(
                        "timed out"
                    )
                ) {

                    message =
                        "Firebase is taking too long to respond. Please check your Firebase configuration and internet connection.";

                }


                else if (
                    error.code ===
                    "permission-denied"
                ) {

                    message =
                        "Firebase denied the request. Your Firestore security rules need to allow lead creation.";

                }


                else if (
                    error.code ===
                    "failed-precondition"
                ) {

                    message =
                        "Firestore is not configured correctly. Please check that your Firestore database has been created.";

                }


                else if (
                    error.code ===
                    "unavailable"
                ) {

                    message =
                        "Firebase is temporarily unavailable. Please try again.";

                }


                else if (
                    error.code ===
                    "invalid-argument"
                ) {

                    message =
                        "The lead information is invalid. Please check the form.";

                }


                showFormMessage(
                    message
                );


                /*
                IMPORTANT:

                The button is restored here,
                so it can never remain stuck
                on "Submitting..."
                */

            } finally {

                submitButton.disabled =
                    false;

                submitButton.textContent =
                    "Submit Enquiry";

            }

        }
    );

}


/* =========================================
   COPY LEAD ID
========================================= */

if (copyLeadButton) {

    copyLeadButton.addEventListener(
        "click",
        async () => {

            const leadId =
                successLeadId.textContent;


            try {

                await navigator
                    .clipboard
                    .writeText(
                        leadId
                    );


                copyLeadButton.textContent =
                    "Copied ✓";


                setTimeout(
                    () => {

                        copyLeadButton.textContent =
                            "Copy Lead Reference";

                    },
                    2000
                );


            } catch (error) {

                console.error(
                    error
                );

            }

        }
    );

}


/* =========================================
   NEW ENQUIRY
========================================= */

if (newEnquiryButton) {

    newEnquiryButton.addEventListener(
        "click",
        () => {

            successSection.hidden =
                true;

            enquirySection.hidden =
                false;

            leadForm.reset();

            clearFormMessage();

            enquirySection.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        }
    );

}


/* =========================================
   STARTUP
========================================= */

console.log(
    "Chery Pinetown public page loaded."
);

console.log(
    "Firebase lead collection:",
    LEADS_COLLECTION
);

console.log(
    "Vehicle:",
    vehicleFromURL || "All"
);

console.log(
    "Referral:",
    referralFromURL || "None"
);

