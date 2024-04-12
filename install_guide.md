# ArcGIS Enterprise Rocky Install Guide

1. [Prepare the machine for the installation](#1--prepare-the-machine-for-the-installation)
2. [Choose and encrypt the passwords](#2--setup-credentials)
3. [Run the chef script](#3--run-the-chef-script)
4. [Notebook server installation](#4--notebook-server-installation)
5. [Setup the website and homepage](#5--setup-the-website-and-homepage)
6. [Patching](#6--patching)
---------------------------------------------

## 1.  Prepare the machine for the installation
From your computer, ssh into the machine
```
ssh dti-a-idul@machine.ip.adress
```
Install Java, update and reboot
```
sudo yum install java-1.8.0-openjdk-devel
sudo dnf update
sudo dnf install epel-release
sudo dnf upgrade
sudo reboot
```
Create the user used in the arcgis script
```
sudo useradd -m arcgis
sudo passwd arcgis
```
Install chef. type password when prompted.
Make sure to have the right version
```
curl https://omnitruck.chef.io/install.sh | sudo bash -s -- -P chefdk -c stable -v 4.13.3
```
Install git if not already installed:
```
sudo dnf install git
```

Create a folder for your repos and cd into it
```
mkdir repos
cd repos
```
Clone the git repos (Forêt-Climat and Esri's cookbooks)
```
git clone https://github.com/jfaurelacroix/foretclimat
git clone https://github.com/Esri/arcgis-cookbook
```
Inside the cookbooks folder, copy the cookbooks from the foretclimat repo
```
cd arcgis-cookbook/cookbooks/
sudo cp -rf ~/repos/foretclimat/cookbooks/ .
sudo chown arcgis . -R
sudo chgrp arcgis . -R
```
Make sure that you have all the required tar and license files available (in /opt/bkp_ArcGIS_files/)
- ArcGIS_Server
- ArcGIS_Datastore
- ArcGIS_Portal
- ArcGIS_Portal_WebStyles
- ArcGIS_Web_Adaptor_Java_Linux
- apache-tomcat-9.x.x.tar.gz (will be downloaded from the internet if not present in the local ArcGIS software repository)
- openjdk-11_linux-x64_bin.tar.gz (will be downloaded from the internet if not present in the local ArcGIS software repository)

After following the globus guide to setup an endpoint on the machine,
transfer bkp_ArcGIS_files from Valeria to /opt

Make sure to have the authorization_files located at the right place
```
cd /opt/software/bkp_ArcGIS_files
sudo mkdir /opt/software/authorization_files/
```
Make sure the arcgis-enterprise-primary.json auth file match these files.

ArcGIS software repository directory is specified by arcgis.repository.archives attribute. By default it is set to local directory /opt/software/archives on Linux. However, it is recommended to create an ArcGIS software repository located on a separate file server that is accessible from all the machines in the deployment for the user account used to run Chef client.

Enable running sudo without password for the user running the Chef client.
Create the file structure
```
sudo mkdir /data/gisdata
```
Give rights to user
```
sudo chown arcgis /data/gisdata
sudo chmod 700 /data/gisdata
sudo chown arcgis -R /opt/software/
```
Change the limits for the user arcgis
```
sudo vi /etc/security/limits.conf
```
Add the following lines:
```
#arcgis soft nofile 65535
#arcgis hard nofile 65535
```
## 2. Setup credentials
Locate the chef script you will need to use and move it to ~/repos
```
cp ~/repos/foretclimat/chef-json/* ~/repos/arcgis-cookbook/
```
Download jq. It's a tool to edit JSON 
```
sudo dnf install jq
```
Make credentials.sh executable and execute it. It will create a copy of each JSON as an encrypted file but the passwords will be there.
Ready to be decrypted and used with chef-client
```
cd ~/repos/arcgis-cookbook/
sudo chmod 700 ~/repos/foretclimat/scripts/credentials.sh
~/repos/foretclimat/scripts/credentials.sh
```


## 3.  Run the chef script
Enter the encryption password. It will decrypt the JSON, execute the installation and remove the decrypted file.
```
cd ~/repos/arcgis-cookbook
openssl enc -d -aes-256-cbc -salt -in arcgis-enterprise-primary.enc -out decrypted.json -pbkdf2 && sudo chef-client -z -j decrypted.json && rm decrypted.json
```
You might want to set SELinux to permissive https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/using_selinux/changing-selinux-states-and-modes_using-selinux

SELinux might cause some issues and the script might crash. You might need to do things like this:

You can run the script but if you need to kill it before the end, you should reboot the machine. 
Also, make sure that the hostname is the one expected in the license file.

## 4.  Notebook server installation
Prepare the archives
```
tar -xf /opt/software/bkp_ArcGIS_files/ArcGIS_Notebook_Server_Linux_109_177908.tar.gz -C /opt/software/setups/10.9
```
Make sure that you have all the required tar files available (in /media/data/bkp_ArcGIS_files/)
- ArcGIS_Notebook_Docker_Advanced_109_177823.tar.gz
- ArcGIS_Notebook_Docker_Standard_109_177822.tar.gz
- ArcGIS_Notebook_Server_Linux_109_177908.tar.gz
- ArcGIS_Notebook_Server_Samples_Data_Linux_109_177914.tar.gz
- ArcGISNotebookServerAdvanced_ArcGISServer_1178969.prvc (authorization file)

Change docker's directory if needed (https://enterprise.arcgis.com/en/notebook/latest/install/linux/install-docker-for-arcgis-notebook-server.htm)

Download the docker cookbook
```
cd ~/repos/arcgis-cookbook
knife supermarket download docker 4.9.0
tar -xzf docker-4.9.0.tar.gz
mv docker cookbooks && rm docker-4.9.0.tar.gz
```
Installs Notebook Server, autorizes and creates site
```
openssl enc -d -aes-256-cbc -salt -in notebook-server.enc -out decrypted.json -pbkdf2 && sudo chef-client -z -j decrypted.json && rm decrypted.json
```
Installs Web Adaptor if not already installed, registers notebook with the WA
```
openssl enc -d -aes-256-cbc -salt -in arcgis-notebook-server-webadaptor.enc -out decrypted.json -pbkdf2 && sudo chef-client -z -j decrypted.json && rm decrypted.json
```
Federates Notebook with Enteprise Portal (PORT 7443 MUST BE OPEN)
```
openssl enc -d -aes-256-cbc -salt -in notebook-server-federation.enc -out decrypted.json -pbkdf2 && sudo chef-client -z -j decrypted.json && rm decrypted.json
```
<!---
Change the Image ID for advanced notebook to pick the custom one
```
sudo cp ~/repos/foretclimat/notebook/runtime.json /opt/arcgis/notebookserver/framework/etc/factory/runtimes/Advanced/
```
Change the image ID with the custom Advanced ID
```
docker images --no-trunc
sudo vi /data/gisdata/notebookserver/config-store/notebookruntimes/X #Where X is the numbers corresponding to the advanced notebook
```
-->
Setup notebook to use the GPUs.
```
sudo dnf install -y nvidia-container-toolkit-base
sudo nvidia-ctk runtime configure --runtime=docker
```
If you get an error message that /etc/docker/daemon.json doesn't exist,
```
sudo vi /etc/docker/daemon.json
```
add "{}", save and quit. Retry nvidia-ctk configure.
```
sudo yum install nvidia-docker2
sudo systemctl restart docker
sudo docker run --rm --runtime=nvidia --gpus all nvidia/cuda:11.6.2-base-ubuntu20.04 nvidia-smi
```
You should now see GPUs informations.

Now for AGS Notebook to use nvidia, you need to follow steps 4 to 9 here : 
https://enterprise.arcgis.com/en/notebook/latest/administer/linux/configure-arcgis-notebook-server-to-use-gpus.htm
## 5.  Setup the website and homepage
Create redirect to /portal/home
```
sudo mkdir /opt/tomcat_arcgis/webapps/ROOT
sudo sh -c "echo '<% response.sendRedirect(\"https://www.foretclimat.ca/portal/home/index.html\"); %>' > /opt/tomcat_arcgis/webapps/ROOT/index.jsp"
sudo chown -R tomcat_arcgis /opt/tomcat_arcgis/webapps/ROOT
sudo chmod 700 -R /opt/tomcat_arcgis/webapps/ROOT
```
Copy the files into /opt/arcgis/portal/framework/webapps/arcgis#home/ also changes index to home
```
sudo mv /opt/arcgis/portal/framework/webapps/arcgis#home/index.html /opt/arcgis/portal/framework/webapps/arcgis#home/home.html
sudo cp -r ~/repos/foretclimat/pages/* /opt/arcgis/portal/framework/webapps/arcgis#home/
sudo cp -r ~/repos/foretclimat/media /opt/arcgis/portal/framework/webapps/arcgis#home/
sudo chown -R arcgis /opt/arcgis/portal/framework/webapps/arcgis#home/
sudo chmod 700 -R /opt/arcgis/portal/framework/webapps/arcgis#home/
```
Add the error pages to the site
```
sudo cp ~/repos/foretclimat/errorpages /opt/tomcat_arcgis/
sudo chmod 700 /opt/tomcat_arcgis/errorpages/ -R
sudo chown tomcat_arcgis /opt/tomcat_arcgis/errorpages/ -R
sudo chgrp tomcat_arcgis /opt/tomcat_arcgis/errorpages/ -R
sudo cp ~/repos/foretclimat/errorpages /opt/arcgis/portal/webapps/arcgis#home
```
Modify tomcat's config to use the error pages.
Add the following line to "/opt/tomcat_arcgis/conf/server.xml" inside 
<Host name="localhost"  appBase="webapps"unpackWARs="true" autoDeploy="true"> </Host>
at the end of the file.
```
<Valve className="org.apache.catalina.valves.ErrorReportValve" errorCode.404="/opt/tomcat_arcgis/errorpages/404.html"/>
```
Change web.xml and web_endeavour.xml for errorpages to work at /portal/home/X
Add
```
<error-page>
    <error-code>404</error-code>
    <location>/errorpages/404.html</location>
</error-page>
```
inside <web-app></web-app> for both files.

Allow proxy for ArcGIS Portal to work correctly with the items:

Go to https://www.foretclimat.ca/portal/portaladmin
After entering the admin credentials, Go to Security > Config > Update Security Configuration
(https://www.foretclimat.ca/portal/portaladmin/security/config/update)
and add this: 
```
,"allowedProxyHosts":"www.foretclimat.ca,fclim-pr-srv01.l.ul.ca
```
Then "Update Configuration" and it is done


#### Change the portal directories.
First, copy the current directory to the new one.
```
cp -r /opt/arcgis/portal/usr/arcgisportal /data/gisdata
```
Then visit https://fclim-pr-srv01.l.ul.ca/portal/portaladmin/system/directories
and change each directory to /data/gisdata/arcgisportal/NAME_OF_DIR
Wait for the portal to restart between each change.

#### Schedule notebook task
As arcgis user create the following directory
```
mkdir /data/gisdata/notebookserver/directories/arcgisworkspace/arcgisdata
```
Go to https://www.foretclimat.ca/portal/home/notebook/manager.html > Directories

Click on "+ Register Data Directory"

Name: data
Path: /data/gisdata/notebookserver/directories/arcgisworkspace/arcgisdata

Bind the data folder to the media
```
mkdir /opt/arcgis/portal/framework/webapps/arcgis#home/media/graphs/
sudo mount --bind /data/gisdata/notebookserver/directories/arcgisworkspace/arcgisdata /opt/arcgis/portal/framework/webapps/arcgis#home/media/graphs
```

Then, import the notebook used for the homepage graphs.

After having saved the notebook,  the "Tasks" button becomes available in the top ribbon of the notebook editor.

Click on "Create Task", enter a Title and hit "Next".

For "Repeat Type" pick "Day". For "Time" pick "4:00 AM"
Make sure it is never ending and updates the notebook on completion.
## Patching
Esri releases patches frequently. Do NOT install these as root.
### Locate the patchnotification tool
```
cd /path/to/arcgis/datastore/tools/patchnotification
```
### Check if patches are available
```

```
### Set a temp download folder for patches
```
./patchnotification -c -d /path/to/patchtmp
```
### Install security patches in console mode 
```
./patchnotification -i sec -c
```

### Install all patches in console mode 
```
./patchnotification -i all -c
```