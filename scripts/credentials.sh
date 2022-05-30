#!/bin/bash
CERT_PW="change.it"
ADMIN_PW="change.it"
# change the passwords above
jq --arg passwd "$CERT_PW" '.tomcat.keystore_password = $passwd' arcgis-enterprise-primary.json > tmp.$$.json && mv tmp.$$.json arcgis-enterprise-primary.json
jq --arg passwd "$ADMIN_PW" '.arcgis.server.admin_password = $passwd' arcgis-enterprise-primary.json > tmp.$$.json && mv tmp.$$.json arcgis-enterprise-primary.json
jq --arg passwd "$CERT_PW" '.arcgis.server.keystore_password = $passwd' arcgis-enterprise-primary.json > tmp.$$.json && mv tmp.$$.json arcgis-enterprise-primary.json
jq --arg passwd "$ADMIN_PW" '.arcgis.portal.admin_password = $passwd' arcgis-enterprise-primary.json > tmp.$$.json && mv tmp.$$.json arcgis-enterprise-primary.json
jq --arg passwd "$CERT_PW" '.arcgis.portal.keystore_password = $passwd' arcgis-enterprise-primary.json > tmp.$$.json && mv tmp.$$.json arcgis-enterprise-primary.json
jq --arg passwd "$ADMIN_PW" '.arcgis.portal.admin_password = $passwd' notebook-server-federation.json > tmp.$$.json && mv tmp.$$.json notebook-server-federation.json
jq --arg passwd "$ADMIN_PW" '.arcgis.notebook_server.admin_password = $passwd' notebook-server-federation.json > tmp.$$.json && mv tmp.$$.json notebook-server-federation.json
# change renewal script
sed -i "s/change.it/$CERT_PW/" ./scripts/auto_pfx.sh