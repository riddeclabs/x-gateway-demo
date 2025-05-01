# XGateway Pocket Casino Demo

This project demonstrates the capabilities of the XGateway payment gateway by simulating a simple pocket casino. Users can make deposits using the XGateway checkout page and then check if their deposit has been successfully processed.

## Features

* **Deposit Funds:** Integrates the XGateway checkout page to allow users to make simulated deposits into their casino account.
* **Check Deposit Status:** Provides a mechanism to query the status of a previously made deposit to confirm its successful processing.
* **Simple UI:** Offers a basic web interface for easy interaction with the demo features.


**Note:** This is a simplified demo and does not involve real money transactions or a fully functional casino. It focuses solely on showcasing the XGateway integration aspects.

## How to Use

1.  **Make a Deposit:**
    * On the web interface, you will find a section to make a deposit.
    * Enter a simulated deposit amount.
    * Click the "Deposit" button.
    * This will redirect you to a **simulated** XGateway checkout page. Observe the parameters being passed in the URL (this mimics how a real integration would work).
    * On the simulated checkout page, you can select a payment method and click "Pay" (this action is simulated and does not process any real payment).
    * You will be redirected back to the demo application with a simulated transaction ID.

2.  **Check Deposit Status:**
    * On the web interface, you will find a section to check the deposit status.
    * Enter the simulated transaction ID you received after the simulated checkout.
    * Click the "Check Status" button.
    * The application will simulate querying the XGateway API and display the status of the deposit (e.g., "Processing," "Success," "Failed").
  
## Important Notes

* **Simulation:** This demo uses a simulated XGateway checkout page. **No real financial transactions are involved.**
* **Security:** This demo is for illustrative purposes only and does not implement robust security measures. In a production environment, you must follow XGateway's security guidelines and best practices for handling sensitive data.
* **Error Handling:** The error handling in this demo is basic. A production application would require more comprehensive error management.
* **XGateway API:** This demo provides a basic illustration of how to interact with the XGateway checkout page and potentially its API for status checks. Refer to the official XGateway API documentation for detailed information on all available features and integration methods.

## Disclaimer

This project is intended for demonstration purposes only. Do not use this code in a production environment without proper security review and integration with the actual XGateway API.
