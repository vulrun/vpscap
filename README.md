# VPSCAP
**Virtual Private Server Control Admin Panel** (`vpscap`) is a lightweight and efficient admin panel designed to manage VPS configurations, tweak NGINX settings, and run applications with PM2 – all from one centralized interface.

---
## 🚀 Prerequisites
Ensure the following are installed on your system before proceeding:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)
- [PM2](https://pm2.keymetrics.io/) (install with `npm install -g pm2`)
- [NGINX](https://www.nginx.com/) (for web server management)

---
## 📦 Installation
Follow these steps to install and run **vpscap**:

### 1. Clone the Repository

Clone the project from GitHub:
```bash
git clone git@github.com:vulrun/vpscap.git
```

Switch into main code directory
```bash
cd vpscap/
```


## 🔧 Configuration & Setup
### 2. Set Up the Admin User (Required)
Initialize the application by creating the admin user:

```bash
npm run setup-admin-user
```
> You’ll be prompted to enter admin credentials (email/password).
This creates a user for accessing the control panel dashboard.


### 3. Tweak NGINX Configuration (Required)
Apply performance and security optimizations to your NGINX setup:

```bash
npm run tweak-nginx-conf
```
⚠️ Important: This will backup existing nginx current configuration and create an new NGINX config.



### 4. Set Up Automatic Certificate Renewal (Recommended)
To ensure your certificates are automatically renewed daily, run the following script:
```bash
npm run setup-renew-cert
```
This command adds a cron job that triggers a daily request to your local renewal endpoint:
`0 0 * * * curl -s http://localhost:3010/api/public/renew-certs`

⚠️ Important: If you are using an another port, please run manually
```bash
(crontab -l; echo \"0 0 * * * curl -s http://localhost:<port-number>/api/public/renew-certs\") | crontab -
```




### 5. Start the Application with PM2
Run the application in the background using PM2:
```bash
npm run pm2:start
```

**OR**

To run in normal/regular mode:
```bash
npm run app:start
```

You can monitor and manage the process using PM2:
```bash
pm2 list         # View running processes
pm2 logs         # Show real-time logs
pm2 restart all  # Restart all PM2-managed apps
```


---
## 🔄 Updating vpscap
To update the application with the latest code from the repository, run the following commands from inside the project directory:

Switch to your code directory:
```
cd vpscap/
```
Pull the latest changes from the **dist** branch:
```
npm run git:sync
```
Reload the app instance using PM2:
```
npm run pm2:reload
```
> 💡 Ensure you are on the correct production branch: `dist`



---
## 🌐 Accessing the Admin Panel
Once started, the control panel should be available at:

```
http://<your-server-ip>:3010
```
> You can customize the port and environment settings in the `.env` file or by running `npm run setup-admin-user`
 
---
## 🔒 Production Tips
* Set up a domain name pointing to your server.
* Use NGINX as a reverse proxy with HTTPS.
* Use a firewall to restrict unwanted access.


--- 
### 📄 License
This project is licensed under the [MIT License](#).


---
### 🤝 Contributions
Feel free to fork, improve, or submit issues and pull requests!


---
>Let me know if you’d like help adding environment variable instructions, Docker support, or screenshots to the README.
