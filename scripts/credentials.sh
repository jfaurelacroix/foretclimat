#!/bin/bash
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

CURR_DIR=$(pwd)
if [[ "$CURR_DIR" != "${HOME}/repos/arcgis-cookbook" ]]; then
        echo "Wrong directory. You must be in ~/repos/arcgis-cookbook"
		exit 1
fi

prompt_admin_pw
prompt_enc_pw

# changes the passwords above
jq --arg passwd "$ADMIN_PW" '.arcgis.server.admin_password = $passwd' arcgis-enterprise-primary.json > tmp.$$.json 
jq --arg passwd "$ADMIN_PW" '.arcgis.portal.admin_password = $passwd' tmp.$$.json > tmp2.$$.json && mv tmp2.$$.json tmp.$$.json 
openssl enc -aes-256-cbc -pass pass:"$ENC_PW" -salt -in tmp.$$.json -out arcgis-enterprise-primary.enc -pbkdf2
jq --arg passwd "$ADMIN_PW" '.arcgis.portal.admin_password = $passwd' notebook-server-federation.json > tmp.$$.json
jq --arg passwd "$ADMIN_PW" '.arcgis.notebook_server.admin_password = $passwd' tmp.$$.json > tmp2.$$.json && mv tmp2.$$.json tmp.$$.json 
openssl enc -aes-256-cbc -pass pass:"$ENC_PW" -salt -in tmp.$$.json -out notebook-server-federation.enc -pbkdf2
jq --arg passwd "$ADMIN_PW" '.arcgis.notebook_server.admin_password = $passwd' notebook-server.json > tmp.$$.json
openssl enc -aes-256-cbc -pass pass:"$ENC_PW" -salt -in tmp.$$.json -out notebook-server.enc -pbkdf2
jq --arg passwd "$ADMIN_PW" '.arcgis.notebook_server.admin_password = $passwd' arcgis-notebook-server-webadaptor.json > tmp.$$.json
openssl enc -aes-256-cbc -pass pass:"$ENC_PW" -salt -in tmp.$$.json -out arcgis-notebook-server-webadaptor.enc -pbkdf2
rm tmp.$$.json
# openssl enc -d -aes-256-cbc -salt -in arcgis-enterprise-primary.enc -out decrypted.json -pbkdf2 && chef-client -z -j decrypted.json && rm decrypted.json

