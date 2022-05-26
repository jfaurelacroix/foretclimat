#!/bin/bash
# Grep password values
CERT_PW=$(sed '1!d' passwords.txt)
ADMIN_PW=$(sed '2!d' passwords.txt)
# change the passwords in the files
jq --arg passwd "$CERT_PW" '.tomcat.keystore_password = $passwd' arcgis-enterprise-primary.json > tmp.$$.json && mv tmp.$$.json arcgis-enterprise-primary.json
jq --arg passwd "$ADMIN_PW" '.arcgis.server.admin_password = $passwd' arcgis-enterprise-primary.json > tmp.$$.json && mv tmp.$$.json arcgis-enterprise-primary.json
jq --arg passwd "$CERT_PW" '.arcgis.server.keystore_password = $passwd' arcgis-enterprise-primary.json > tmp.$$.json && mv tmp.$$.json arcgis-enterprise-primary.json
jq --arg passwd "$ADMIN_PW" '.arcgis.portal.admin_password = $passwd' arcgis-enterprise-primary.json > tmp.$$.json && mv tmp.$$.json arcgis-enterprise-primary.json
jq --arg passwd "$CERT_PW" '.arcgis.portal.keystore_password = $passwd' arcgis-enterprise-primary.json > tmp.$$.json && mv tmp.$$.json arcgis-enterprise-primary.json
# change renewal script
sed -i "s/change.it/$CERT_PW/" ./scripts/auto_pfx.sh