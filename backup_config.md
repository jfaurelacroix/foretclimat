# Configuring backups and disaster recovery with AWS

## Webgisdr tool
Details on the tool.
https://enterprise.arcgis.com/en/portal/latest/administer/linux/create-web-gis-backup.htm

Details on each parameter for the properties file.
https://enterprise.arcgis.com/en/portal/latest/administer/linux/populate-webgisdr-tool-properties-file.htm

Create the directory as arcgis user
```
mkdir -p /data/gisdata/arcgisbackup/webgisdr
```
Setup a cronjob to backup once a week.
```
sudo crontab -e
25 3 * * 0 /opt/arcgis/portal/tools/webgisdr/webgisdr.sh --export -file ~/repos/foretclimat/webgisdr.properties
```