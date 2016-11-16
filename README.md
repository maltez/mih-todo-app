# Make It Happen App

"Make It Happen" - is an online app, which helps you to plan your days and achieve more. When signing up to "Make It Happen", online organizer will get a schedule that is powerful & flexible enough to help you get much more done. This is an online calendar based solution for your total time management. Handy for tracking your progress and maintain life balance between family, health, friends and career.

## Initial steps if you prefer to run application using Virtual Box
### Configurations below should be made once:
1. Download and install Virtual Box  https://www.virtualbox.org/wiki/Downloads 
2. Download and install Extensions for Virtual box  https://www.virtualbox.org/wiki/Downloads 
3. Download and install Vagrant  https://www.vagrantup.com/downloads.html 
4. Clone Git repository into local machine:

```bash
git clone https://git.epam.com/anna_pavlova/epmkhrdmh.git
```

### Configurations below should be made each time you want to run application locally
1. Open repository folder and locate MIH/VM 
2. Run command "vagrant up" 

```bash
vagrant up
```

Please, note: 

> If you have the error 'Vagrant could not detect VirtualBox' try changing environment variable "VBOX_MSI_INSTALL_PATH" to "VBOX_INSTALL_PATH."

 
> If you are a Windows 10 user, you may have the error "The VirtualBox VM was created with a user that doesn't match the current user running Vagrant.". In this case locate MIH\VM\.vagrant\machines\default\virtualbox and edit creator_uid file (set 0). 

 
> If you need to shut down VM run command "vagrant halt"


3. Run command “vagrant ssh”.
 
```bash
vagrant ssh
```

You will see "Welcome to your Vagrant-built virtual machine".

> If you have the error 'ssh executable not found in any directories in the %PATH%' make sure you have path to Git bin, which contains ssh.exe in the PATH environment variable. (C:\Users\User_Name\AppData\Local\Programs\Git\usr\bin)

4. Locate cd ../../app

```bash
cd ../../app
grunt
```

Once a web server is started - open  http://localhost:3000/ in browser.

## Initial steps if you prefer to run application on your machine directly
### System Configuration
1. Configurations below should be made only once on a system level to install all necessary software.
Download and Install NodeJS from official site. Once installed - you should be able to run the following in command prompt:

```bash
node -v
npm -v
```

2. Download MongoDB from official site. Once downloaded - you should unzip it to somewhere locally. Make sure the following files are in place:
* d:\mongodb\bin\mongod.exe
* d:\mongodb\bin\mongo.exe

3. Install Grunt globally from command:

```bash
npm install -g grunt-cli
```

### Git Configuration
Configurations below should be made once to download the codebase from remote repository.
Clone Git repository into local machine:

```bash
git clone https://git.epam.com/anna_pavlova/epmkhrdmh.git
```

### Running Application
Configurations below should be made each time you want to run application locally:
1. Install all necessary NodeJS dependencies (not necessary to run each time):

```bash
npm install
```

2. Start database server:
> Ensure that your PATH variable in Environment Variables includes path to MongoDB Server bin (e.g. C:\Program Files\MongoDB\Server\3.2\bin)

```bash
mongod --dbpath d:/mongodb/data
```

3. Start web server:

```bash
grunt
```

Once web server will be started - you should be able to hit http://localhost:3000/ in browser.