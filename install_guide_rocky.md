# ArcGIS Enterprise Rocky Install Guide

1. [Prepare the machine for the installation](#1--prepare-the-machine-for-the-installation)
2. [Download the certificate and setup auto-renew](#2--download-certbot-the-certificate-and-setup-auto-renew)
3. [Run the chef script](#3--run-the-chef-script)
4. [Notebook server installation](#4--notebook-server-installation)
5. [Setup the website and homepage](#5--setup-the-website-and-homepage)

---------------------------------------------

## 1.  Prepare the machine for the installation
From your computer, ssh into the machine
```
ssh dti-a-idul@machine.ip.adress
```
Update and reboot
```
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
Inside the cookbooks folder, add necessary cookbooks from chef
```
cd arcgis-cookbook/cookbooks/arcgis-enterprise
```
Downloading the missing cookbooks (using Berkshelf)
```
cd ~/repos/arcgis-cookbook/cookbooks/arcgis-enterprise
berks install
mv ~/.berkshelf/cookbooks/* ~/repos/arcgis-cookbook/cookbooks
```
Rename every file
```
cd ~/repos/arcgis-cookbook/cookbooks
mv limits-* limits
mv hostsfile-* hostsfile
mv windows-* windows
mv windows_firewall-* windows_firewall
mv ms_dotnet-* ms_dotnet
mv nfs-* nfs
mv java_properties-* java_properties
mv aws-* aws
mv seven_zip-* seven_zip
mv line-* line
mv openssl-* openssl
mv tomcat-* tomcat
mv iptables-* iptables
mv s3_file-* s3_file
mv tar-* tar
mv apt-* apt
mv esri-iis-* esri-iis
mv esri-tomcat-* esri-tomcat
```
Make sure that you have all the required tar and license files available (in /media/data/bkp_ArcGIS_files/)
- ArcGIS_Server_Linux_109_177864.tar.gz
- ArcGIS_Web_Adaptor_Java_Linux_109_177888.tar.gz
- apache-tomcat-9.x.x.tar.gz (will be downloaded from the internet if not present in the local ArcGIS software repository)
- openjdk-11_linux-x64_bin.tar.gz (will be downloaded from the internet if not present in the local ArcGIS software repository)

After following the globus guide to setup an endpoint on the machine,
transfer bkp_ArcGIS_files from Valeria to /opt

Make sure to have the authorization_files located at the right place
```
cd /opt/bkp_ArcGIS_files
sudo mkdir -p /opt/software/authorization_files/10.9
sudo cp ArcGIS_Enterprise_Portal_X.json /opt/software/authorization_files/10.9
sudo cp EducationSiteArcGISServerEnterprise_ArcGISServer_X.prvc /opt/software/authorization_files/10.9
```
Make sure the arcgis-enterprise-primary.json auth file match these files.

ArcGIS software repository directory is specified by arcgis.repository.archives attribute. By default it is set to local directory /opt/software/archives on Linux. However, it is recommended to create an ArcGIS software repository located on a separate file server that is accessible from all the machines in the deployment for the user account used to run Chef client.

Enable running sudo without password for the user running the Chef client.
Create the file structure
```
sudo mkdir /data/gisdata
sudo mkdir /opt/tomcat_arcgis/
```
Give rights to user
```
sudo chown arcgis /data/gisdata
sudo chmod 755 /data/gisdata
sudo chown arcgis /opt/tomcat_arcgis/
sudo chmod 755 /opt/tomcat_arcgis
```

## 2.  Download certbot, the certificate and setup auto-renew
#### Downloading the certificate

Installing certbot and openssl
```
sudo dnf install snapd

sudo systemctl enable --now snapd.socket
sudo ln -s /var/lib/snapd/snap /snap
sudo snap install core
sudo snap install --classic certbot
sudo dnf install openssl
```
Request Certificate using certbot
```
sudo /snap/bin/certbot certonly --standalone -d www.foretclimat.ca
```

#### Setup autorenewing script and credentials script
Locate the chef script you will need to use and move it to ~/repos
```
cp ~/repos/foretclimat/chef-json/* ~/repos/arcgis-cookbook/
```
Modify scripts/credentials.sh to choose the certificate password and the admin account password
```
cd ~/repos/foretclimat
sudo chmod 755 scripts/credentials.sh
sudo vi scripts/credentials.sh
```
Download jq (for the script), edit CERT_PW and ADMIN_PW in credentials.sh and execute it (it will edit the right attributes in the right files)
```
sudo dnf install jq
cd ~/repos/arcgis-cookbook/
~/repos/foretclimat/scripts/credentials.sh
```
Prepare script to convert cert to pkcs12 https://github.com/StormWindStudios/OpenSSL-Notes/blob/master/letsencrypt_autopfx.md
```
sudo mkdir -p /etc/letsencrypt/renewal-hooks/deploy
sudo cp ~/repos/foretclimat/scripts/auto_pfx.sh /etc/letsencrypt/renewal-hooks/deploy
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/auto_pfx.sh
```
[You will need to use certbot with webroot after running the chef script for autorenewing to work](#change-certbot-with-webroot)

Force renewal. It will run the script used to format the certificate
```
sudo /snap/bin/certbot --force-renewal
```

## 3.  Run the chef script
```
cd ~/repos/arcgis-cookbook
sudo chef-client -z -j arcgis-enterprise-primary.json
```
You might want to set SELinux to permissive https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/using_selinux/changing-selinux-states-and-modes_using-selinux

SELinux might cause some issues and the script might crash. You might need to do things like this:

```
sudo chmod 755 /media/data/arcgis/portal/startportal.sh
sudo chmod 755 /media/data/arcgis/webadaptor10.9/java/tools/arcgis-wareg.jar
sudo ausearch -c '(ortal.sh)' --raw | audit2allow -M my-ortalsh
sudo  semodule -X 300 -i my-ortalsh.pp
```
You can run the script but if you need to kill it before the end, you should reboot the machine. 
Also, make sure that the hostname is the one expected in the license file.
## 4.  Notebook server installation
Prepare the archives
```
sudo mkdir /media/data/setups/10.9
tar -xf /media/data/bkp_ArcGIS_files/ArcGIS_Notebook_Server_Linux_1091_180226.tar.gz -C /media/data/setups/10.9
```
Make sure that you have all the required tar files available (in /media/data/bkp_ArcGIS_files/)
- ArcGIS_Notebook_Docker_Advanced_109_177823.tar.gz
- ArcGIS_Notebook_Docker_Standard_109_177822.tar.gz
- ArcGIS_Notebook_Server_Linux_109_177908.tar.gz
- ArcGIS_Notebook_Server_Samples_Data_Linux_109_177914.tar.gz
- ArcGISNotebookServerAdvanced_ArcGISServer_1178969.prvc (authorization file)

Change docker's directory if needed (https://enterprise.arcgis.com/en/notebook/latest/install/linux/install-docker-for-arcgis-notebook-server.htm)
and change file size limit for docker to work properly
```
ulimit -Sn 65535
```
Grab the authorization file
```
sudo cp /media/data/bkp_ArcGIS_files/ArcGISNotebookServerAdvanced_ArcGISServer_1178969.prvc /opt/software/authorization_files/10.9/notebook_server.prvc
```
Copy the custom docker image to the location specified in notebook_server.json
```
sudo cp ~/repos/foretclimat/notebook/ArcGIS_Notebook_Docker_Advanced_Passerelle.tar.gz /media/data/bkp_ArcGIS_files/
```
Installs Notebook Server, autorizes and creates site
```
sudo chef-client -z -j notebook-server.json
```
Installs Web Adaptor if not already installed, registers notebook with the WA
```
sudo chef-client -z -j arcgis-notebook-server-webadaptor.json
```
Federates Notebook with Enteprise Portal (PORT 7443 MUST BE OPEN)
```
sudo chef-client -z -j notebook-server-federation.json
```
Change the Image ID for advanced notebook to pick the custom one
```
sudo cp ~/repos/foretclimat/notebook/runtime.json /arcgis/notebookserver/framework/etc/factory/runtimes/Advanced/runtime.json
```
Change the image ID with the custom Advanced ID
```
docker images --no-trunc
sudo vi /gisdata/notebookserver/config-store/notebookruntimes/X #Where X is the numbers corresponding to the advanced notebook
```
## 5.  Setup the website and homepage
Create redirect to /portal/home
```
cd /opt/tomcat_arcgis/webapps
sudo mkdir ROOT
sudo sh -c "echo '<% response.sendRedirect(\"https://www.foretclimat.ca/portal/home/index.html\"); %>' > ROOT/index.jsp"
sudo chown -R arcgis ROOT
sudo chmod 755 -R ROOT
```
Copy the files into /arcgis/portal/framework/webapps/arcgis#home/ also changes index to home
```
sudo mv /arcgis/portal/framework/webapps/arcgis#home/index.html /arcgis/portal/framework/webapps/arcgis#home/home.html
sudo cp ~/repos/foretclimat/pages/* /arcgis/portal/framework/webapps/arcgis#home/
sudo cp -r ~/repos/foretclimat/media /arcgis/portal/framework/webapps/arcgis#home/
```
#### Change certbot with webroot
Changes from standalone to webroot of the arcgis server. Otherwise it cannot renew because the port is in use.
```
sudo /snap/bin/certbot certonly --webroot --agree-tos -d www.foretclimat.ca -w /opt/tomcat_arcgis/webapps/ROOT
```
#### Schedule notebook task
As arcgis user create the following directory
```
mkdir /gisdata/notebookserver/directories/arcgisworkspace/arcgisdata
```
Go to https://www.foretclimat.ca/portal/home/notebook/manager.html > Directories

Click on "+ Register Data Directory"

Name: data
Path: /gisdata/notebookserver/directories/arcgisworkspace/arcgisdata

Bind the data folder to the media
```
mkdir /arcgis/portal/framework/webapps/arcgis#home/media/graphs/
mount --bind /gisdata/notebookserver/directories/arcgisworkspace/arcgisdata /arcgis/portal/framework/webapps/arcgis#home/media/graphs
```

Then, import the notebook used for the homepage graphs.

After having saved the notebook,  the "Tasks" button becomes available in the top ribbon of the notebook editor.

Click on "Create Task", enter a Title and hit "Next".

For "Repeat Type" pick "Day". For "Time" pick "4:00 AM"
Make sure it is never ending and updates the notebook on completion.