responses = {
    "main_menu": {
        "question": "What can I help you with? Options: Billing, Onboarding, Support",
        "options": [
            {"billing_menu": "Billing"},
            {"onboarding_menu": "Onboarding"},
            {"support_menu": "Support"}
        ],
    },
    "billing_menu": {
        "question": "What billing issue do you need help with? Options: View Invoice, Update Payment Method, Refund Request",
        "options": [
            {"view_invoice": "View Invoice"},
            {"update_payment_method": "Update Payment Method"},
            {"refund_request": "Refund Request"}
        ],
    },
    "onboarding_menu": {
        "question": "What onboarding assistance do you need? Options: Account Setup, Data Import, Integrations",
        "options": [
            {"account_setup": "Account Setup"},
            {"data_import": "Data Import"},
            {"integrations_menu": "Integrations"}
        ],
    },
    "support_menu": {
        "question": "What support issue do you need help with? Options: Troubleshooting, Report a Bug, Contact Support Team",
        "options": [
            {"troubleshooting_menu": "Troubleshooting"},
            {"report_bug": "Report a Bug"},
            {"contact_support_team": "Contact Support Team"}
        ],
    },
    "view_invoice": {
        "question": "Can you please provide your invoice number?",
        "options": [],
    },
    "update_payment_method": {
        "question": "To update your payment method, go to Settings > Billing. Would you like more guidance?",
        "options": [],
    },
    "refund_request": {
        "question": "I can assist with a refund. Can you provide the transaction ID or invoice number?",
        "options": [],
    },
    "account_setup": {
        "question": "Have you verified your email address yet?",
        "options": [],
    },
    "data_import": {
        "question": "I can guide you through importing your data. What type of data are you working with?",
        "options": [],
    },
    "integrations_menu": {
        "question": "Which integration are you looking to set up? Options: CRM Tools, Communication Tools",
        "options": [
            {"crm_tools": "CRM Tools"},
            {"communication_tools": "Communication Tools"}
        ],
    },
    "crm_tools": {
        "question": "We support tools like Salesforce and HubSpot. Would you like help setting them up?",
        "options": [],
    },
    "communication_tools": {
        "question": "We support Slack, Microsoft Teams, and others. Which one do you need help with?",
        "options": [],
    },
    "troubleshooting_menu": {
        "question": "What issue are you experiencing? Options: Login Issues, Feature Not Working, Performance Problems",
        "options": [
            {"login_issues": "Login Issues"},
            {"feature_not_working": "Feature Not Working"},
            {"performance_problems": "Performance Problems"}
        ],
    },
    "report_bug": {
        "question": "Can you provide a brief description of the issue?",
        "options": [],
    },
    "contact_support_team": {
        "question": "Would you like to connect with our support team via email or live chat?",
        "options": [],
    },
    "login_issues": {
        "question": "Are you receiving an error message? If so, can you share it?",
        "options": [],
    },
    "feature_not_working": {
        "question": "Which feature is not working as expected?",
        "options": [],
    },
    "performance_problems": {
        "question": "Is the platform slow or unresponsive in specific areas?",
        "options": [],
    },
}

def get_responses():
    return responses