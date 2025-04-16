# shelly-vrm-battsoc
A shelly script to obtain Victron VRM battery SoC via the Victron API and switch a relay on the Shelly 1PM based on the returned SoC.
Also installs 2 scheduled actions to start and stop the script at specided times on specified days.

***To obtain a Victron VRM Long-Lived Access Token:***
-------------------------------------------------------

To obtain a Victron long-lived access token via the VRM portal, you'll need to log in to the VRM portal, navigate to Preferences, then Integrations, and finally Access tokens. From there, you can generate a new API access token. This token can then be used for authenticated API calls, and it's recommended to use it instead of login credentials for security. 
Here's a more detailed breakdown:

1.) Login to VRM Portal: Go to the VRM portal website (vrm.victronenergy.com) and log in using your VRM credentials. 

2.) Navigate to Access Tokens: Once logged in, go to Preferences > Integrations > Access tokens. 

3.) Generate a New Token: You'll be able to generate a new API access token from this page.

Ensure you copy the token when presented on screen. The token is only visible once. If you lose or fail to copy the token. You'll need to delete the old one and generate a new token. 

This process allows you to programmatically use the VRM API, which is more secure than using your username and password in each request. 


