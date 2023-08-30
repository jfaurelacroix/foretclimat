import smtplib, ssl
from arcgis.gis import GIS
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

gis = GIS("home")

today = datetime.now().date()
sourceusers = gis.users.search(max_users=1000)
ignore_list = ['org_admin']
for user in sourceusers:
    if not user.role in ignore_list:
        last_login = user.lastLogin
        last_login_datetime = datetime.fromtimestamp(last_login / 1000)
        last_login_days_difference = (today - last_login_datetime.date()).days
        if last_login_days_difference == 1000:
            sender_email = "info@foretclimat.ca"
            receiver_email = user.email
            password = "password"########################################

            message = MIMEMultipart("alternative")
            message["Subject"] = "[ACTION REQUISE] Réactivation de votre compte utilisateur"
            message["From"] = sender_email
            message["To"] = receiver_email
            text = """\
                Cher utilisateur de la Passerelle,
                
                Nous avons remarqué que votre compte utilisateur n'a pas été utilisé depuis une période prolongée.
                Pour garantir la sécurité de nos utilisateurs et la performance de notre système, nous avons décidé de mettre en place une politique de suppression des comptes inactifs.
                Si vous souhaitez garder votre compte sur www.foretclimat.ca, nous vous prions de bien vouloir vous connecter dans les 30 prochains jours :
                https://www.foretclimat.ca/portal/home/signin.html
                
                Dans le cas contraire, votre compte et son contenu sera supprimé.
                
                Merci de votre compréhension,
                
                L'équipe Forêt-Climat.
                """
            part1 = MIMEText(text, "plain")
            message.attach(part1)

            context = ssl.create_default_context()
            
            with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
                server.login(sender_email, password)
                server.sendmail(
                    sender_email, receiver_email, message.as_string()
                )
        if last_login_days_difference > 1030:
            #user.delete()
            print "delete"
