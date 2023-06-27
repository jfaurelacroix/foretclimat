#!/usr/bin/python3
# -*- coding: utf-8 -*-

""" Auteur: Naïm Perreault
    Date de création: 2022-05-19
    Date de la mise à jour: 2023-06-27
    Version 1.0.

    Passerelle Forêt-Climat - Données météorologique MSC
"""
import sys, os, tempfile, logging, arcpy, fnmatch, glob, gzip, shutil, subprocess
import pandas as pd
from datetime import date, datetime, timedelta
from urllib import request
from arcgis.features import FeatureLayerCollection
from arcgis.gis import GIS
from meteostat import Stations
# from copy import deepcopy


def LoginRoutine (user, itemid):
    # %% Log file
    logging.basicConfig(filename="MSC.log", level=logging.INFO)
    log_format = "%Y-%m-%d %H:%M:%S"
    print("Début de la mise à jour... {0}".format(datetime.now().strftime(log_format)))
    logging.info("Début de la mise à jour... {0}".format(datetime.now().strftime(log_format)))

    # %% Get service from ArcGIS Online
    gis = GIS(url='https://arcgis.com', username=user)
    print("Successfully logged in as: " + gis.properties.user.username)
    logging.info("Successfully logged in as: " + gis.properties.user.username)
    service = gis.content.get(itemid)

    # %% Répertoire de travail
    arcpy.env.overwriteOutput = True
    temp_dir = r'D:\Passerelle_ForetClimat\01_Donnees\Meteo\MSC'
    gdb_name = "MSC.gdb"
    gdb_path = os.path.join(temp_dir, gdb_name)
    if not arcpy.Exists(gdb_path):
        arcpy.CreateFileGDB_management(temp_dir, gdb_name, "CURRENT")
    arcpy.env.workspace = gdb_path
    arcpy.env.scratchWorkspace = gdb_path

    # %% Fonctions SideScripts.py
    sys.path.append(r'C:\Users\NAPER79\OneDrive - Université Laval\Documents\01_Projets\02_Passerelle_ForetClimat\00_Scripts')
    from SideScripts import reorder_columns, EditMode

    DeployRoutine()

    print("Fin de la mise à jour... {0}".format(datetime.now().strftime(log_format)))
    logging.info("Fin de la mise à jour... {0}".format(datetime.now().strftime(log_format)))
    logging.info("...")
    logging.shutdown()


def DeployRoutine():
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
    print(stations)
    stations.to_csv(os.path.join(temp_dir, "MSC_Stations.csv"))

    # logging.info("- Création des stations")
    # arcpy.management.XYTableToPoint(os.path.join(temp_dir, "MSC_Stations.csv"), "MSC_Stations", "longitude", "latitude", "elevation")
    # arcpy.Delete_management(os.path.join(temp_dir, "MSC_Stations.csv"))

    # ------------------------------------------------------------------------------
    # %% Recuperation et decompression des donnees
    print("Recuperation et decompression des donnees")
    logging.info("Recuperation et decompression des donnees")
    # ------------------------------------------------------------------------------
    url = "https://bulk.meteostat.net/v2/"
    list_names = ["hourly", "daily", "monthly", "normals"]
    for station in list_of_stations:
        for file in list_names:
            request.urlretrieve(url + file + '/' + station + '.csv.gz', os.path.join(temp_dir, 'MSC_' + file + '_' + station + '.csv.gz'))
    del station, file

    for file in os.listdir(temp_dir):
        if file.endswith('.gz'):
            file = os.path.join(temp_dir, file)
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
    Daily_List = glob.glob(os.path.join(temp_dir, "MSC_Daily*"))
    stock_data = pd.DataFrame()
    for file in Daily_List:
        df = pd.read_csv(file, header=None)
        df.columns = ["time", "tavg", "tmin", "tmax", "prcp", "snow", "wdir", "wspd", "wpgt", "pres", "tsun"]
        id_ = os.path.basename(file)
        df['id'] = id_[10:-4]
        df['combine'] = df["id"] + "_" + df["time"]
        stock_data = pd.concat((df, stock_data), axis=0)
        os.remove(file)
    del file
    stock_data = reorder_columns(dataframe=stock_data, col_name="combine", position=0)
    stock_data.to_csv(os.path.join(temp_dir, "MSC_Daily.csv"), index=False)

    # %% Hourly
    Hourly_List = glob.glob(os.path.join(temp_dir, "MSC_Hourly*"))
    stock_data = pd.DataFrame()
    for file in Hourly_List:
        df = pd.read_csv(file, parse_dates={"time": [0, 1]}, header=None)
        df.columns = ["time", "temp", "dwpt", "rhum", "prcp", "snow", "wdir", "wspd", "wpgt", "pres", "tsun", "coco"]
        id_ = os.path.basename(file)
        df['id'] = id_[11:-4]
        df['combine'] = df['id'] + "_" + df['time'].astype(str)
        df['combine'] = df['combine'].str.replace(':00:00', '')
        df['combine'] = df['combine'].str.replace(' ', '-')
        stock_data = pd.concat((df, stock_data), axis=0)
        os.remove(file)
    del file
    stock_data = reorder_columns(dataframe=stock_data, col_name="combine", position=0)
    stock_data.to_csv(os.path.join(temp_dir, "MSC_Hourly.csv"), index=False)

    # %% Monthly
    Monthly_List = glob.glob(os.path.join(temp_dir, "MSC_Monthly*"))
    stock_data = pd.DataFrame()
    for file in Monthly_List:
        df = pd.read_csv(file, header=None)
        df.columns = ["year", "month", "tavg", "tmin", "tmax", "prcp", "wspd", "pres", "tsun"]
        df['time'] = pd.to_datetime(df["year"].astype(str) \
                                    + "-" + df["month"].astype(str),
                                    format='%Y-%m')
        id_ = os.path.basename(file)
        df['id'] = id_[12:-4]
        df['combine'] = df['id'] + "_" + df['time'].astype(str)
        stock_data = pd.concat((df, stock_data), axis=0)
        os.remove(file)
    del file
    stock_data = reorder_columns(dataframe=stock_data, col_name="combine", position=0)
    stock_data = reorder_columns(dataframe=stock_data, col_name="time", position=1)
    stock_data.to_csv(os.path.join(temp_dir, "MSC_Monthly.csv"), index=False)

    # %% Normals
    Normals_List = glob.glob(os.path.join(temp_dir, "MSC_Normals*"))
    stock_data = pd.DataFrame()
    for file in Normals_List:
        df = pd.read_csv(file, header=None)
        df.columns = ["start", "end", "month", "tmin", "tmax", "prcp", "wspd", "pres", "tsun"]
        id_ = os.path.basename(file)
        df['id'] = id_[12:-4]
        df['combine'] = df["id"] + "_" + df["start"].astype(str) + "-" + df["end"].astype(str) + "-" + df["month"].astype(str)
        stock_data = pd.concat((df, stock_data), axis=0)
        os.remove(file)
        del file
    stock_data = reorder_columns(dataframe=stock_data, col_name="combine", position=0)
    stock_data.to_csv(os.path.join(temp_dir, "MSC_Normals.csv"), index=False)

    # # ------------------------------------------------------------------------------
    # # %% Remplacement de la GDB locale
    # print("Remplacement de la GDB locale")
    # logging.info("Remplacement de la GDB locale")
    # # ------------------------------------------------------------------------------
    # for file in os.listdir(temp_dir):
    #     if file.endswith(".csv"):
    #         new_name = file[:-4]
    #         #print(new_name)
    #         file = os.path.join(temp_dir, file)
    #         arcpy.conversion.TableToTable(file, gdb_path, new_name)
    #         arcpy.Delete_management(file)
    # del file

    # # ------------------------------------------------------------------------------
    # # %% Creation des classes de relation
    # print("Creation des classes de relation")
    # logging.info("Creation des classes de relation")
    # # ------------------------------------------------------------------------------
    # tables = arcpy.ListTables()
    # for table in tables:
    #     Relationship_Origin = "MSC_Stations"
    #     Relationship_Destination = table
    #     Out_Relationship = "MSC_Stations" + "_to_" + table[4:]
    #     Cardinality = "ONE_TO_MANY"
    #     Primary_Key = "id"
    #     Relationship_Type = "SIMPLE"
    #     Forward_Label = Relationship_Destination
    #     Backward_Label = Relationship_Origin
    #     Message_Direction ="BOTH"
    #     Attributed = "NONE"
    #     arcpy.CreateRelationshipClass_management(Relationship_Origin, Relationship_Destination, Out_Relationship, Relationship_Type, Forward_Label, Backward_Label, Message_Direction, Cardinality, Attributed, Primary_Key , Primary_Key,"", "")
    # del table

    # # ------------------------------------------------------------------------------
    # # %% Creation du suivi des modifications
    # print("Creation du suivi des modifications")
    # logging.info("Creation du suivi des modifications")
    # # ------------------------------------------------------------------------------
    # arcpy.management.EnableEditorTracking("MSC_Stations", '', '', "last_edited_user", "last_edited_date", "ADD_FIELDS", "UTC")
    # for table in arcpy.ListTables():
    #     print(table)
    #     arcpy.management.EnableEditorTracking(table, '', '', "last_edited_user", "last_edited_date", "ADD_FIELDS", "UTC")
    # del table

    # ------------------------------------------------------------------------------
    # %% Mise a jour de la GDB locale
    print("Mise a jour de la GDB locale")
    logging.info("Mise a jour de la GDB locale")
    # ------------------------------------------------------------------------------
    list_names = ["MSC_Daily.csv", "MSC_Hourly.csv"]
    backtrack = 30
    for file in list_names:
        df = pd.read_csv(os.path.join(temp_dir, file))
        df = df[df['time'] > (date.today()-timedelta(days=backtrack)).isoformat()]
        df = df[df['time'] < date.today().isoformat()]
        df.to_csv(os.path.join(temp_dir, file), index=False)
    del file

    # %% Mise à jour des dernières données
    EditMode("Start")
    list_names = ["MSC_Stations.csv", "MSC_Daily.csv", "MSC_Hourly.csv"]
    for file in list_names:
        new_data = pd.read_csv(os.path.join(temp_dir, file), keep_default_na=False, na_values=None)
        header = list(new_data.columns)
        nb_column = len(header)
        curList = list(arcpy.da.SearchCursor(os.path.join(temp_dir, file), header))
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
        new_data = pd.read_csv(os.path.join(temp_dir, file), keep_default_na=False, na_values=None)
        header = list(new_data.columns)
        curSource = arcpy.da.SearchCursor(os.path.join(temp_dir, file), header)
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
    for file in os.listdir(temp_dir):
        if file.endswith(".csv"):
            file = os.path.join(temp_dir, file)
            os.remove(file)
    del file

    # ------------------------------------------------------------------------------
    # %% Remplacement du service Online
    print("Remplacement du service Online")
    logging.info("Remplacement du service Online")
    # ------------------------------------------------------------------------------
    original_sd_file = r'D:\Passerelle_ForetClimat\01_Donnees\Meteo\MSC\MSC.sd'
    sd_file_name = os.path.basename(original_sd_file)

    # %% Unpack original_sd_file using 7-zip
    # path_7z = fnmatch.filter(os.environ['path'].split(';'), '*7-Zip')
    # exe_7z = os.path.join(path_7z[0], '7z.exe')
    exe_7z = r'C:\Program Files\7-Zip\7z.exe'
    temp_dir = tempfile.mkdtemp()
    call_unzip = '{0} x {1} -o{2}'.format(exe_7z, original_sd_file, temp_dir)
    subprocess.call(call_unzip)

    # %% Replace Online.gdb content
    liveGDB = os.path.join(temp_dir, 'p20', 'msc.gdb')
    shutil.rmtree(liveGDB)
    os.mkdir(liveGDB)

    for root, dirs, files in os.walk(gdb_path):
        files = [f for f in files if '.lock' not in f]
        for f in files:
            # shutil.copy2(os.path.join(gdb_path, f), os.path.join(liveGDB, f)) # semble parfois ne pas fonctionner
            shutil.copyfile(os.path.join(gdb_path, f), os.path.join(liveGDB, f))
    del root, dirs, files, f

    os.chdir(temp_dir)
    updated_sd = os.path.join(temp_dir, sd_file_name)
    call_zip = '{0} a {1} -m1=LZMA'.format(exe_7z, updated_sd)
    subprocess.call(call_zip)

    manager = FeatureLayerCollection.fromitem(service).manager
    status = manager.overwrite(updated_sd)

    # # ------------------------------------------------------------------------------
    # # %% Mise a jour du service Online
    # print("Mise a jour du service Online")
    # logging.info("Mise a jour du service Online")
    # # ------------------------------------------------------------------------------
    # # %% Ajout des nouvelles données
    # list_names = ["MSC_Daily.csv", "MSC_Hourly.csv", "MSC_Monthly.csv", "MSC_Normals.csv"]
    # no_file = 0
    # for file in list_names:
    #     new_data = pd.read_csv(os.path.join(temp_dir, file), keep_default_na=False, na_values=None)
    #     header = list(new_data.columns)
    #
    #     table = service.tables[no_file]
    #     no_file = no_file + 1
    #     table_data = table.query() #querying without any conditions returns all the features
    #     all_features = table_data.features
    #
    #     # get the matching row from csv
    #     new_rows = new_data[~new_data["combine"].isin(table_data.sdf["combine"])]
    #
    #     print(" -> " + file[:-4] + " - " + str(len(new_rows)) + " new rows")
    #     logging.info(" -> " + file[:-4] + " - " + str(len(new_rows)) + " new rows")
    #
    #     if len(new_rows) > 0:
    #         features_to_be_added = []
    #         template_feature = deepcopy(all_features[0])
    #
    #         # loop through each row and add to the list of features to be added
    #         for r in new_rows.iterrows():
    #             new_feature = deepcopy(template_feature)
    #
    #             # assign the updated values
    #             for number in range(len(header)):
    #                 new_feature.attributes[header[number]] = r[1][header[number]]
    #             # add this to the list of features to be added
    #             features_to_be_added.append(new_feature)
    #
    #         table.edit_features(adds=features_to_be_added)
    #         del r, number
    #
    # # Mise à jours des dernières données
    #     if file in ["MSC_Daily.csv","MSC_Hourly.csv"]:
    #
    #         features_for_update = []
    #
    #         for r in new_data['combine']:
    #             # get the matching row from csv
    #             original_feature = [f for f in all_features if f.attributes['combine'] == r][0]
    #             feature_to_be_updated = deepcopy(original_feature)
    #
    #             matching_row = new_data.where(new_data['combine'] == r).dropna()
    #
    #             for number in range(len(header)):
    #                 feature_to_be_updated.attributes[header[number]] = matching_row[header[number]].values[0]
    #             features_for_update.append(feature_to_be_updated)
    #
    #         table.edit_features(updates=features_for_update)
    #         del r, number
    # del file
    #
    # # Suppression des .csv
    # for file in os.listdir(temp_dir):
    #     if file.endswith(".csv"):
    #         file = os.path.join(temp_dir, file)
    #         os.remove(file)
    # del file


if __name__ == "__main__":
    [user, itemid] = sys.argv[1:]
    LoginRoutine (user, itemid)
