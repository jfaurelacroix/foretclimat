#!/bin/bash
# Taken from https://github.com/StormWindStudios/OpenSSL-Notes/blob/master/letsencrypt_autopfx.md
# Adjust these variables as necessary

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

# Where you want to final PKCS12 file to be stored.
CERT_PATH="/opt/tomcat_arcgis/cert.pfx"

prompt_cert_pw

# Path to LE files, RENEWED_LINEAGE provided by CertBot
PRIV_KEY_PEM="$RENEWED_LINEAGE/privkey.pem"
CERT_PEM="$RENEWED_LINEAGE/cert.pem"
CHAIN_PEM="$RENEWED_LINEAGE/chain.pem"

# If there's already a .pfx file, back it up
if [[ -f "$CERT_PATH" ]]; then
    now=`date +%Y-%m-%d-%T`
    sudo mv $CERT_PATH $CERT_PATH.bak.$now
fi

# Le Conversion
sudo openssl pkcs12 -export -out $CERT_PATH -inkey $PRIV_KEY_PEM -in $CERT_PEM -certfile $CHAIN_PEM -password pass:$CERT_PW

sudo chown arcgis /opt/tomcat_arcgis/cert.pfx
sudo chmod 700 /opt/tomcat_arcgis/cert.pfx
echo 'ssl certificate updated at /opt/tomcat_arcgis/cert.pfx'
