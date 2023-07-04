#!/usr/bin/python3
# -*- coding: utf-8 -*-

""" Auteur: Naïm Perreault
    Date de création: 2022-05-19
    Date de la mise à jour: 2023-06-28
    Version 1.0.

    Passerelle Forêt-Climat - Données météorologique MSC
"""
import sys, os, logging, arcpy, fnmatch, glob, gzip, keyring, shutil, subprocess
import pandas as pd
from datetime import date, datetime, timedelta
from urllib import request
from arcgis.features import FeatureLayerCollection
from arcgis.gis import GIS
from meteostat import Stations
# from copy import deepcopy


def main(status, user):   # status=["CreateService", "UpdateService]
    # %% Log file
    logging.basicConfig(filename="MSC.log", level=logging.INFO)
    log_format = "%Y-%m-%d %H:%M:%S"
    print("Début de la mise à jour... {0}".format(datetime.now().strftime(log_format)))
    logging.info("Début de la mise à jour... {0}".format(datetime.now().strftime(log_format)))

    # %% Script arguments
    pw = keyring.get_password("ArcGISOnline", user)

    # %% Répertoire de travail
    arcpy.env.overwriteOutput = True
    gdb_dir = r'D:\02_Passerelle_ForetClimat\01_Donnees\Meteo\MSC'
    gdb_name = "MSC.gdb"
    gdb_path = os.path.join(gdb_dir, gdb_name)
    if not arcpy.Exists(gdb_path):
        arcpy.CreateFileGDB_management(gdb_dir, gdb_name, "CURRENT")
    arcpy.env.workspace = gdb_path
    arcpy.env.scratchWorkspace = gdb_path

    # %% Fonctions SideScripts.py
    sys.path.append("/home/arcgis/repos/foretclimat/scripts")
    from SideScripts import reorder_columns, EditMode
    from FieldMapping import MSC_Daily_fms, MSC_Hourly_fms, MSC_Monthly_fms, MSC_Normals_fms

    # ------------------------------------------------------------------------------
    # %% Recuperation des stations
    print("Recuperation des stations")
    logging.info("Recuperation des stations")
    # ------------------------------------------------------------------------------
    stations = Stations()
    stations = stations.region("CA", "QC")
    stations = stations.nearby(47.32, -71.15)
    stations = stations.fetch(20)
    list_of_stations = ["71212", "71382", "71714"]  # FM(71212), Étape(71382), Quebec Jean Lesage International Airport(71714)
    stations = stations[stations.index.isin(list_of_stations)]
    stations.to_csv(os.path.join(gdb_dir, "MSC_Stations.csv"))

    # ------------------------------------------------------------------------------
    # %% Recuperation et decompression des donnees
    print("Recuperation et decompression des donnees")
    logging.info("Recuperation et decompression des donnees")
    # ------------------------------------------------------------------------------
    url = "https://bulk.meteostat.net/v2/"
    list_names = ["hourly", "daily", "monthly", "normals"]
    for station in list_of_stations:
        for file in list_names:
            request.urlretrieve(url + file + '/' + station + '.csv.gz', os.path.join(gdb_dir, 'MSC_' + file + '_' + station + '.csv.gz'))
    del station, file

    for file in os.listdir(gdb_dir):
        if file.endswith('.gz'):
            file = os.path.join(gdb_dir, file)
            with gzip.open(file, 'rb') as f_in:
                new_name = file[:-3]
                with open(new_name, 'wb') as f_out:
                    shutil.copyfileobj(f_in, f_out)
            os.remove(file)
    del file

    # ------------------------------------------------------------------------------
    # %% Structuration des donnees
    print("Structuration des donnees")
    logging.info("Structuration des donnees")
    # ------------------------------------------------------------------------------
    # %% Daily
    Daily_List = glob.glob(os.path.join(gdb_dir, "MSC_Daily*"))
    stock_data = pd.DataFrame()
    for file in Daily_List:
        df = pd.read_csv(file, header=None)
        df.columns = ["date", "tavg", "tmin", "tmax", "prcp", "snow", "wdir", "wspd", "wpgt", "pres", "tsun"]
        df['id'] = os.path.basename(file)[10:-4]
        df['combine'] = df["id"] + "_" + df["date"]
        stock_data = pd.concat((df, stock_data), axis=0)
        os.remove(file)
    del file
    stock_data = stock_data[stock_data['date'] < date.today().isoformat()]
    stock_data = reorder_columns(dataframe=stock_data, col_name="combine", position=0)
    stock_data.to_csv(os.path.join(gdb_dir, "MSC_Daily.csv"), index=False)

    # %% Hourly
    Hourly_List = glob.glob(os.path.join(gdb_dir, "MSC_Hourly*"))
    stock_data = pd.DataFrame()
    for file in Hourly_List:
        df = pd.read_csv(file, parse_dates={"date": [0, 1]}, header=None)
        df.columns = ["date", "temp", "dwpt", "rhum", "prcp", "snow", "wdir", "wspd", "wpgt", "pres", "tsun", "coco"]
        df['id'] = os.path.basename(file)[11:-4]
        df['combine'] = df['id'] + "_" + df['date'].astype(str)
        df['combine'] = df['combine'].str.replace(':00:00', '')
        df['combine'] = df['combine'].str.replace(' ', '-')
        stock_data = pd.concat((df, stock_data), axis=0)
        os.remove(file)
    del file
    stock_data = stock_data[stock_data['date'] < date.today().isoformat()]
    stock_data = reorder_columns(dataframe=stock_data, col_name="combine", position=0)
    stock_data.to_csv(os.path.join(gdb_dir, "MSC_Hourly.csv"), index=False)

    # %% Monthly
    Monthly_List = glob.glob(os.path.join(gdb_dir, "MSC_Monthly*"))
    stock_data = pd.DataFrame()
    for file in Monthly_List:
        df = pd.read_csv(file, header=None)
        df.columns = ["year", "month", "tavg", "tmin", "tmax", "prcp", "wspd", "pres", "tsun"]
        df['date'] = pd.to_datetime(df["year"].astype(str) \
                                    + "-" + df["month"].astype(str),
                                    format='%Y-%m')
        df['id'] = os.path.basename(file)[12:-4]
        df['combine'] = df['id'] + "_" + df['date'].astype(str)
        stock_data = pd.concat((df, stock_data), axis=0)
        os.remove(file)
    del file
    stock_data = reorder_columns(dataframe=stock_data, col_name="combine", position=0)
    stock_data = reorder_columns(dataframe=stock_data, col_name="date", position=1)
    stock_data.to_csv(os.path.join(gdb_dir, "MSC_Monthly.csv"), index=False)

    # %% Normals
    Normals_List = glob.glob(os.path.join(gdb_dir, "MSC_Normals*"))
    stock_data = pd.DataFrame()
    for file in Normals_List:
        df = pd.read_csv(file, header=None)
        df.columns = ["start", "end", "month", "tmin", "tmax", "prcp", "wspd", "pres", "tsun"]
        df['id'] = os.path.basename(file)[12:-4]
        df['combine'] = df["id"] + "_" + df["start"].astype(str) + "-" + df["end"].astype(str) + "-" + df["month"].astype(str)
        stock_data = pd.concat((df, stock_data), axis=0)
        os.remove(file)
        del file
    stock_data = reorder_columns(dataframe=stock_data, col_name="combine", position=0)
    stock_data.to_csv(os.path.join(gdb_dir, "MSC_Normals.csv"), index=False)


    if status == "CreateService":
        # ------------------------------------------------------------------------------
        # %% Creation de la GDB locale
        print("Creation de la GDB locale")
        logging.info("Creation de la GDB locale")
        # ------------------------------------------------------------------------------
        arcpy.management.XYTableToPoint(os.path.join(gdb_dir, "MSC_Stations.csv"), "MSC_Stations", "longitude",
                                        "latitude", "elevation")
        fms = MSC_Daily_fms(os.path.join(gdb_dir, "MSC_Daily.csv"))
        arcpy.conversion.TableToTable(os.path.join(gdb_dir, "MSC_Daily.csv"), gdb_path, "MSC_Daily", "", fms)
        fms = MSC_Hourly_fms(os.path.join(gdb_dir, "MSC_Hourly.csv"))
        arcpy.conversion.TableToTable(os.path.join(gdb_dir, "MSC_Hourly.csv"), gdb_path, "MSC_Hourly", "", fms)
        fms = MSC_Monthly_fms(os.path.join(gdb_dir, "MSC_Monthly.csv"))
        arcpy.conversion.TableToTable(os.path.join(gdb_dir, "MSC_Monthly.csv"), gdb_path, "MSC_Monthly", "", fms)
        fms = MSC_Normals_fms(os.path.join(gdb_dir, "MSC_Normals.csv"))
        arcpy.conversion.TableToTable(os.path.join(gdb_dir, "MSC_Normals.csv"), gdb_path, "MSC_Normals", "", fms)
        for file in os.listdir(gdb_dir):
            if file.endswith(".csv"):
                os.remove(os.path.join(gdb_dir, file))
        del file

        # %% Creation des classes de relation
        tables = arcpy.ListTables()
        for table in tables:
            Relationship_Origin = "MSC_Stations"
            Relationship_Destination = table
            Out_Relationship = "MSC_Stations" + "_to_" + table[4:]
            Cardinality = "ONE_TO_MANY"
            Primary_Key = "id"
            Relationship_Type = "SIMPLE"
            Forward_Label = Relationship_Destination
            Backward_Label = Relationship_Origin
            Message_Direction = "BOTH"
            Attributed = "NONE"
            arcpy.CreateRelationshipClass_management(Relationship_Origin, Relationship_Destination, Out_Relationship,
                                                     Relationship_Type, Forward_Label, Backward_Label, Message_Direction,
                                                     Cardinality, Attributed, Primary_Key, Primary_Key, "", "")
        del table

        # %% Creation du suivi des modifications
        arcpy.management.EnableEditorTracking("MSC_Stations", '', '', "last_edited_user", "last_edited_date", "ADD_FIELDS", "UTC")
        for table in arcpy.ListTables():
            arcpy.management.EnableEditorTracking(table, '', '', "last_edited_user", "last_edited_date", "ADD_FIELDS", "UTC")
        del table

        arcpy.ExportXMLWorkspaceDocument_management(gdb_path, os.path.join(gdb_dir, "MSC.xml"), "SCHEMA_ONLY",
                                                    "BINARY", "METADATA")

        # ------------------------------------------------------------------------------
        # %% Creation du service
        print("Creation du service")
        logging.info("Creation du service")
        # il y a aussi la possibilité d'overwrite un service existant : https://support.esri.com/en-us/knowledge-base/how-to-overwrite-hosted-feature-services-from-arcgis-pr-000023164
        # ------------------------------------------------------------------------------
        arcpy.SignInToPortal(portal_url='https://arcgis.com', username=user, password=pw)
        # %% Set output file names
        service_name = gdb_name[:-4]
        sddraft_filename = service_name + ".sddraft"
        sddraft_output_filename = os.path.join(gdb_dir, sddraft_filename)

        # %% Reference map to publish
        aprx = arcpy.mp.ArcGISProject(r'D:\02_Passerelle_ForetClimat\02_WebMap\WebMap.aprx')
        m = aprx.listMaps(service_name)[0]

        arcpy.mp.CreateWebLayerSDDraft(m, sddraft_output_filename, service_name, service_type="FEATURE_ACCESS", summary="My Summary",
                                       tags="My Tags", description="My Description", credits="My Credits", use_limitations="My Use Limitations",
                                       enable_editing=False, allow_exporting=True, enable_sync=True,
                                       folder_name="TEST_PasserelleForetClimat", overwrite_existing_service=False)

        sd_filename = service_name + ".sd"
        sd_output_filename = os.path.join(gdb_dir, sd_filename)
        arcpy.server.StageService(sddraft_output_filename, sd_output_filename)
        arcpy.server.UploadServiceDefinition(sd_output_filename, "HOSTING_SERVER")
        arcpy.Delete_management(os.path.join(gdb_dir, sddraft_filename))
        arcpy.Delete_management(os.path.join(gdb_dir, "Thumbnail.png"))

    if status == "UpdateService":
        # ------------------------------------------------------------------------------
        # %% Mise a jour de la GDB locale
        print("Mise a jour de la GDB locale")
        logging.info("Mise a jour de la GDB locale")
        # ------------------------------------------------------------------------------
        list_names = ["MSC_Daily.csv", "MSC_Hourly.csv"]
        backtrack = 30
        for file in list_names:
            df = pd.read_csv(os.path.join(gdb_dir, file))
            df = df[df['date'] > (date.today()-timedelta(days=backtrack)).isoformat()]
            df.to_csv(os.path.join(gdb_dir, file), index=False)
        del file

        # %% Mise à jour des dernières données
        EditMode("Start")
        list_names = ["MSC_Stations.csv", "MSC_Daily.csv", "MSC_Hourly.csv"]
        for file in list_names:
            new_data = pd.read_csv(os.path.join(gdb_dir, file), keep_default_na=False, na_values=None)
            header = list(new_data.columns)
            nb_column = len(header)
            curList = list(arcpy.da.SearchCursor(os.path.join(gdb_dir, file), header))
            curDict = {}
            print(" -> " + file[:-4] + " - " + "Update rows")
            for item in curList:
                curDict[item[0]] = item[1:nb_column]
            del item

            with arcpy.da.UpdateCursor(file[:-4], header) as ucur:
                for r in ucur:
                    if r[0] in curDict:
                        for nb in range(nb_column - 1):
                            if r[nb + 1] == curDict[r[0]][nb]:
                                pass
                            else:
                                r[nb + 1] = curDict[r[0]][nb]
                        ucur.updateRow(r)
            del ucur, curList, curDict
        del file

        # %% Ajout des nouvelles données
        list_names = ["MSC_Daily.csv", "MSC_Hourly.csv", "MSC_Monthly.csv", "MSC_Normals.csv"]
        for file in list_names:
            new_data = pd.read_csv(os.path.join(gdb_dir, file), keep_default_na=False, na_values=None)
            header = list(new_data.columns)
            curSource = arcpy.da.SearchCursor(os.path.join(gdb_dir, file), header)
            curTarget = arcpy.da.SearchCursor(file[:-4], header)
            curInsert = arcpy.da.InsertCursor(file[:-4], header)
            curS_list = [row[0] for row in curTarget]
            for r in curSource:
                if not r[0] in curS_list:
                    print(" -> " + file[:-4] + " - Creating " + r[0])
                    curInsert.insertRow(r)
            del curSource, curTarget, curInsert, curS_list
        del file
        EditMode("End")

        # %% Suppression des .csv
        for file in os.listdir(gdb_dir):
            if file.endswith(".csv"):
                file = os.path.join(gdb_dir, file)
                os.remove(file)
        del file

        # ------------------------------------------------------------------------------
        # %% Mise a jour du service
        print("Mise a jour du service")
        logging.info("Mise a jour du service")
        # ------------------------------------------------------------------------------
        # %% Get service from ArcGIS Online
        gis = GIS(url='https://arcgis.com', username=user, password=pw)
        print("Successfully logged in as: " + gis.properties.user.username)
        logging.info("Successfully logged in as: " + gis.properties.user.username)
        search_result = gis.content.search('title:MSC', item_type='Feature Layer')
        service = search_result[0]

        original_sd_file = os.path.join(gdb_dir, "MSC.sd")
        sd_file_name = os.path.basename(original_sd_file)

        # %% Unpack original_sd_file using 7-zip
        exe_7z = r'C:\Program Files\7-Zip\7z.exe'
        temp_dir = os.path.join(gdb_dir, "Unpack_SD")
        if not arcpy.Exists(temp_dir):
            arcpy.CreateFolder_management(gdb_dir, "Unpack_SD")
        call_unzip = '{0} x {1} -o{2}'.format(exe_7z, original_sd_file, temp_dir)
        subprocess.call(call_unzip)

        # %% Replace Online.gdb content
        liveGDB = os.path.join(temp_dir, 'p30', 'msc.gdb')
        shutil.rmtree(liveGDB)
        os.mkdir(liveGDB)

        for root, dirs, files in os.walk(gdb_path):
            files = [f for f in files if '.lock' not in f]
            for f in files:
                shutil.copy2(os.path.join(gdb_path, f), os.path.join(liveGDB, f))
        del root, dirs, files, f

        os.chdir(temp_dir)
        updated_sd = os.path.join(temp_dir, sd_file_name)
        call_zip = '{0} a {1} -m1=LZMA'.format(exe_7z, updated_sd)
        subprocess.call(call_zip)

        manager = FeatureLayerCollection.fromitem(service).manager
        publish = manager.overwrite(updated_sd)
        arcpy.Delete_management(temp_dir)

    # ------------------------------------------------------------------------------
    # %% Fin de la mise à jour
    print("Fin de la mise à jour... {0}".format(datetime.now().strftime(log_format)))
    logging.info("Fin de la mise à jour... {0}".format(datetime.now().strftime(log_format)))
    # ------------------------------------------------------------------------------
    logging.info("...")
    logging.shutdown()

if __name__ == "__main__":
    [status, user] = sys.argv[1:]
    main(status, user)
