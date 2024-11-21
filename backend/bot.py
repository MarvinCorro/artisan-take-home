responses = {
  'billing': {
    'initial': [
      "What can I assist you with in billing? Options: 'View Invoice', 'Update Payment Method', 'Refund Request', 'Subscription Inquiry'."
    ],
    'options': {
      "View Invoice": [
        "Can you please provide your invoice number?",
        "You can view all your invoices in the Billing section of your account dashboard.",
        "Do you need a copy of the invoice sent to your email?"
      ],
      "Update Payment Method": [
        "To update your payment method, go to Settings > Billing.",
        "Would you like me to guide you through the process?",
        "Are you trying to switch between credit card and PayPal?"
      ],
      "Refund Request": [
        "I can assist with a refund. Can you provide the transaction ID or invoice number?",
        "Refund requests are usually processed within 5-7 business days.",
        "Would you like to know more about our refund policy?"
      ],
      "Subscription Inquiry": [
        "Your subscription is set to renew on [insert date]. Would you like to make changes?",
        "Would you like to upgrade or downgrade your current plan?",
        "Do you need help canceling your subscription?"
      ]
    }
  },
  'onboarding': {
    'initial': [
      "What can I help you with in onboarding? Options: 'Account Setup', 'Data Import', 'Integrations', '1:1 Session'."
    ],
    'options': {
      "Account Setup": [
        "Have you verified your email address yet?",
        "Let’s set up your profile. What’s the first piece of information you’d like to add?",
        "You can customize your settings under the Profile section. Want to explore it now?"
      ],
      "Data Import": [
        "I can guide you through importing your data. What type of data are you working with?",
        "Do you have a CSV file or would you like to connect to an existing platform?",
        "Need help mapping your data fields? I can assist."
      ],
      "Integrations": [
        "Which integration are you looking to set up first?",
        "We support tools like Salesforce, HubSpot, and Slack. Want to see the full list?",
        "Having trouble connecting? Let me troubleshoot with you."
      ],
      "1:1 Session": [
        "Our onboarding team offers personalized sessions. What time works best for you?",
        "Would you like to go over the platform’s key features in this session?",
        "I can help you book a session with our expert. Shall we proceed?"
      ]
    }
  },
  "support": {
    "initial": [
      "How can I assist you with support? Options: 'Troubleshooting', 'Report a Bug', 'Contact Support Team'."
    ],
    "options": {
      "Troubleshooting": [
        "What issue are you experiencing? Options: 'Login Issues', 'Feature Not Working', 'Performance Problems'.",
        {
          "Login Issues": [
            "Are you receiving an error message? If so, can you share it?",
            "Have you tried resetting your password? I can guide you through it.",
            "Are you having issues with two-factor authentication?"
          ],
          "Feature Not Working": [
            "Which feature is not working as expected?",
            "Can you describe what happens when you try to use the feature?",
            "Have you tried refreshing or clearing your browser cache?"
          ],
          "Performance Problems": [
            "Is the platform slow or unresponsive in specific areas?",
            "Are you using a supported browser? I can share a compatibility list.",
            "Let me check for known issues. Can you provide details of what’s happening?"
          ]
        }
      ],
      "Report a Bug": [
        "Can you provide a brief description of the issue?",
        "Do you have screenshots or steps to reproduce the bug?",
        "Our team will look into this. Would you like an update once it's resolved?"
      ],
      "Contact Support Team": [
        "Our support team is available 24/7. Would you like me to connect you?",
        "Would you prefer to email support or chat live?",
        "I can provide you with the support email or phone number. Which do you need?"
      ]
    }
  }
}

def get_responses():
    return responses