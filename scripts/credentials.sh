#!/bin/bash
prompt_cert_pw() {
    read -s -p "Enter the password for the certificate: " CERT_PW
	echo
	read -s -p "Confirm your password: " CONFIRM_PW
	echo

    if [[ "$CERT_PW" != "$CONFIRM_PW" ]]; then
        echo "Passwords do not match. Please try again."
        prompt_cert_pw
    fi
}

prompt_admin_pw() {
    read -s -p "Enter the password for the admin account: " ADMIN_PW
	echo
	read -s -p "Confirm your password: " CONFIRM_PW
	echo

    if [[ "$ADMIN_PW" != "$CONFIRM_PW" ]]; then
        echo "Passwords do not match. Please try again."
        prompt_admin_pw
    fi
}

prompt_enc_pw() {
    read -s -p "Enter the password for the encryption: " ENC_PW
	echo
	read -s -p "Confirm your password: " CONFIRM_PW
	echo

    if [[ "$ENC_PW" != "$CONFIRM_PW" ]]; then
        echo "Passwords do not match. Please try again."
        prompt_enc_pw
    fi
}

prompt_cert_pw
prompt_admin_pw
prompt_enc_pw

# change the passwords above
jq --arg passwd "$CERT_PW" '.tomcat.keystore_password = $passwd' arcgis-enterprise-primary.json > tmp.$$.json
jq --arg passwd "$ADMIN_PW" '.arcgis.server.admin_password = $passwd' tmp.$$.json > tmp2.$$.json && mv tmp2.$$.json tmp.$$.json
jq --arg passwd "$CERT_PW" '.arcgis.server.keystore_password = $passwd' tmp.$$.json > tmp2.$$.json && mv tmp2.$$.json tmp.$$.json
jq --arg passwd "$ADMIN_PW" '.arcgis.portal.admin_password = $passwd' tmp.$$.json > tmp2.$$.json && mv tmp2.$$.json tmp.$$.json 
jq --arg passwd "$CERT_PW" '.arcgis.portal.keystore_password = $passwd' tmp.$$.json > tmp2.$$.json && mv tmp2.$$.json tmp.$$.json 
openssl enc -aes-256-cbc -pass pass:"$ENC_PW" -salt -in tmp.$$.json -out arcgis-enterprise-primary.enc -pbkdf2
jq --arg passwd "$ADMIN_PW" '.arcgis.portal.admin_password = $passwd' notebook-server-federation.json > tmp.$$.json
jq --arg passwd "$ADMIN_PW" '.arcgis.notebook_server.admin_password = $passwd' tmp.$$.json > tmp2.$$.json && mv tmp2.$$.json tmp.$$.json 
openssl enc -aes-256-cbc -pass pass:"$ENC_PW" -salt -in tmp.$$.json -out notebook-server-federation.enc -pbkdf2
jq --arg passwd "$ADMIN_PW" '.arcgis.notebook_server.admin_password = $passwd' notebook-server.json > tmp.$$.json
openssl enc -aes-256-cbc -pass pass:"$ENC_PW" -salt -in tmp.$$.json -out notebook-server.enc -pbkdf2
jq --arg passwd "$ADMIN_PW" '.arcgis.notebook_server.admin_password = $passwd' arcgis-notebook-server-webadaptor.json > tmp.$$.json
jq --arg passwd "$CERT_PW" '.tomcat.keystore_password = $passwd' tmp.$$.json > tmp2.$$.json && mv tmp2.$$.json tmp.$$.json
openssl enc -aes-256-cbc -pass pass:"$ENC_PW" -salt -in tmp.$$.json -out arcgis-notebook-server-webadaptor.enc -pbkdf2
rm tmp.$$.json
# change renewal script
# sed -i "s/change.it/$CERT_PW/" ~/repos/foretclimat/scripts/auto_pfx.sh
