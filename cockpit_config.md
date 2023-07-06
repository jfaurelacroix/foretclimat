# Cockpit Session Recording setup guide (Oracle Linux)

#### Documentation https://cockpit-project.org/guide/latest/guide

Make sure you have all the right packages installed :
```
sudo yum install tlog
sudo yum install cockpit-session-recording
sudo systemctl start cockpit.socket
sudo systemctl enable cockpit.socket
```

Activate sssd session-recording for every user
```
sudo vi /etc/sssd/conf.d/sssd-session-recording.conf
```
Copy and paste :
```
[session_recording]
scope = all
```
As root, give SELinux Permission to cockpit
```
sudo su
mkdir /root/cockpit-selinux
cd /root/cockpit-selinux
ausearch -c 'cockpit-session' --raw | audit2allow -M my-cockpitsession
semodule -X 300 -i my-cockpitsession.pp
```

Enable cockpit with the firewall to make the site accessible
```
sudo firewall-cmd --add-service=cockpit
sudo firewall-cmd --add-service=cockpit --permanent
```
You can now use Cockpit:
https://fclim-pr-srv01.l.ul.ca:9090/
Accès au Grafana: (Browse > Dossier Forêt-Climat)
https://ul-val-pr-mon.l.ul.ca:3000/?orgId=1
### OPTIONAL
Configure the cockpit website with these options:
https://cockpit-project.org/guide/latest/cockpit.conf.5.html
```
sudo vi /etc/cockpit/cockpit.conf
```

