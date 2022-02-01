# ![Logo](/public/images/logo.png)

A report that displays your YNAB transactions in a heatmap style to get a bird's eye view of your budget.

To learn more and see screenshots, you can access it by going [here](http://https://heatmapforynab.netlify.app/)

## Access Report Locally

The report is hosted at the link above but can be ran locally if desired. Below are some steps to get it up and running. They assume some basic understanding of using package managers and accessing files.

### Steps

1. Download the repo & extract the contents to a folder.
2. Run the below command in the root directory of the heatmap to install all of the required dependencies.

    ```node
    npm install
    ```

3. Navigate to the App.svelte file located in src folder and open it.
4. Change the code at the top of the file
    From this:

   ```javascript
   let debugMode = false;
   ```

    To this:

   ```javascript
   let debugMode = true;
   ```

    This enables debug mode
5. Next you will need a personal access token to access your account through the report. **Please note that this is saved only locally on your computer. I won't gain access to your token.
   * Created a folder in the root of the public folder named .vscode and in that folder create a file named accessToken.txt. This is where your Access Token will go once you have it.
   * Login to your YNAB account.
   * Click on the top left corner to open the menu and go to 'Account Settings'.
   * Scroll down to 'Developer Settings' and click on it.
   * Then on this screen click on the 'New Token' button. Put in your password and click the 'Generate' button.
   * Copy the Access Token that was generated and paste it into the accessToken.txt file.

6. Now just run the below command which will bring up an instance of the report running locally on your computer.

    ```node
    npm run dev
    ```
