# shelly-vrm-battsoc
This was created to solve my own use case with an immersion heater and off-grid solar battery power.

This is a Shelly script to obtain Victron VRM battery SoC via the Victron API and switch a relay on the Shelly 1PM based on the returned SoC.
This can be used to activate an immersion heater, heat a hot-tub etc.
This script also installs 2 scheduled actions to start and stop the script at specified times on specified days if such scripts do NOT already exist. Once added these schedules can be edited from the Shelly cloud control panel. Should you wish not to install the scheduled events set the *installSchedules* CONFIG variable to *false*.

This script is installed onto the Shelly device and runs from there. There is no requirement therefore for Google Home / Amazon Alexa or other Home Automation systems.

If the script is unable to contact the Victron VRM and obtain the current battery SoC, the script will turn off the relay to prevent floor discharge of the battery. The script will continue to cycle at the specified interval and resume operation according to the rules specified in the CONFIG variables, once a connection is re-established with the VRM portal.

In the event of a script error, the default behaviour is to turn off the Shelly device relay to prevent floor discharge of the battery.


***To obtain a Victron VRM Long-Lived Access Token:***
-------------------------------------------------------

To obtain a Victron long-lived access token via the VRM portal, you'll need to log in to the VRM portal, navigate to Preferences, then Integrations, and finally Access tokens. From there, you can generate a new API access token. This token can then be used for authenticated API calls, and it's recommended to use it instead of login credentials for security. 
Here's a more detailed breakdown:

1.) Login to VRM Portal: Go to the VRM portal website (vrm.victronenergy.com) and log in using your VRM credentials. 

2.) Navigate to Access Tokens: Once logged in, go to Preferences > Integrations > Access tokens. 

3.) Generate a New Token: You'll be able to generate a new API access token from this page.

Ensure you copy the token when presented on screen. The token is only visible once. If you lose or fail to copy the token. You'll need to delete the old one and generate a new token. 

Keep the token secret and secure.

This process allows you to programmatically use the VRM API, which is more secure than using your username and password in each request.


***To obtain your Victron VRM installation ID***
------------------------------------------------

To obtain your Victron VRM installation ID, simply login to the Victron VRM online portal in a browser.
In the address bar of your browser you will see the path to your installation, it will look similar to:

https://vrm.victronenergy.com/installation/NNNNNN/dashboard

NNNNNN represents your VRM installation ID.

You will need to insert the Access Token and Installation ID into the CONFIG section of the script, at the relevant places.
