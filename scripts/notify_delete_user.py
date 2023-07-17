from arcgis.gis import GIS
from datetime import datetime, timedelta

gis = GIS("home")

today = datetime.now().date()
sourceusers = gis.users.search(max_users=1000)
ignore_list = ['org_admin']
for user in sourceusers:
    if not user.role in ignore_list:
        last_login = user.lastLogin
        last_login_datetime = datetime.fromtimestamp(last_login / 1000)
        last_login_days_difference = (today - last_login_datetime.date()).days
        if last_login_days_difference > 1000:
            #envoyer courriel
        if last_login_days_difference > 1500:
            #user.delete()
