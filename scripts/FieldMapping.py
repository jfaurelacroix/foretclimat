#!/usr/bin/python3
# -*- coding: utf-8 -*-

""" Auteur: Naïm Perreault
    Date de création: 2022-05-19
    Date de la mise à jour: 2023-04-21
    Version 1.0.

    Projet de réforme des bases de données de la forêt Montmorency - FieldMapping
"""

import arcpy

# ------------------------------------------------------------------------------
# %% FieldsMapping
# ------------------------------------------------------------------------------
def MSC_Daily_fms(fn):
    fms = arcpy.FieldMappings()
    fieldMappingDict = {
        1: {'Name':'combine','Type':'TEXT','Length':25},
        2: {'Name':'date', 'Type':'DATE', 'Length':''},
        3: {'Name':'tavg', 'Type':'DOUBLE', 'Length':''},
        4: {'Name':'tmin', 'Type':'DOUBLE', 'Length':''},
        5: {'Name':'tmax', 'Type':'DOUBLE', 'Length':''},
        6: {'Name':'prcp', 'Type':'DOUBLE', 'Length':''},
        7: {'Name':'snow','Type':'SHORT', 'Length':''},
        8: {'Name':'wdir', 'Type':'SHORT', 'Length':''},
        9: {'Name':'wspd', 'Type':'DOUBLE', 'Length':''},
        10: {'Name':'wpgt', 'Type':'DOUBLE', 'Length':''},
        11: {'Name':'pres', 'Type':'DOUBLE', 'Length':''},
        12: {'Name':'tsun', 'Type':'SHORT', 'Length':''},
        13: {'Name':'id', 'Type':'LONG','Length':''}
    }
    #Loop through the mapping dictionary and set up individual field mappings to add to the fms
    for cid, columnDef in fieldMappingDict.items():
        fm = arcpy.FieldMap()
        fm.addInputField(fn, columnDef['Name'])
        newField = fm.outputField
        newField.type = columnDef['Type']
        newField.length = columnDef['Length']
        fm.outputField = newField
        fms.addFieldMap(fm)
    return fms


def MSC_Hourly_fms(fn):
    fms = arcpy.FieldMappings()
    fieldMappingDict = {
        1: {'Name':'combine','Type':'TEXT','Length':25},
        2: {'Name':'date', 'Type':'DATE', 'Length':''},
        3: {'Name':'temp', 'Type':'DOUBLE', 'Length':''},
        4: {'Name':'dwpt', 'Type':'DOUBLE', 'Length':''},
        5: {'Name':'rhum', 'Type':'SHORT', 'Length':''},
        6: {'Name':'prcp', 'Type':'DOUBLE', 'Length':''},
        7: {'Name':'snow','Type':'SHORT', 'Length':''},
        8: {'Name':'wdir', 'Type':'SHORT', 'Length':''},
        9: {'Name':'wspd', 'Type':'DOUBLE', 'Length':''},
        10: {'Name':'wpgt', 'Type':'DOUBLE', 'Length':''},
        11: {'Name':'pres', 'Type':'DOUBLE', 'Length':''},
        12: {'Name':'tsun', 'Type':'SHORT', 'Length':''},
        13: {'Name':'coco', 'Type':'SHORT', 'Length':''},
        14: {'Name':'id', 'Type':'LONG','Length':''}
    }
    #Loop through the mapping dictionary and set up individual field mappings to add to the fms
    for cid, columnDef in fieldMappingDict.items():
        fm = arcpy.FieldMap()
        fm.addInputField(fn, columnDef['Name'])
        newField = fm.outputField
        newField.type = columnDef['Type']
        newField.length = columnDef['Length']
        fm.outputField = newField
        fms.addFieldMap(fm)
    return fms


def MSC_Monthly_fms(fn):
    fms = arcpy.FieldMappings()
    fieldMappingDict = {
        1: {'Name':'combine','Type':'TEXT','Length':25},
        2: {'Name':'date', 'Type':'DATE', 'Length':''},
        3: {'Name':'year', 'Type':'SHORT', 'Length':''},
        4: {'Name':'month', 'Type':'SHORT', 'Length':''},
        5: {'Name':'tavg', 'Type':'DOUBLE', 'Length':''},
        6: {'Name':'tmin', 'Type':'DOUBLE', 'Length':''},
        7: {'Name':'tmax', 'Type':'DOUBLE', 'Length':''},
        8: {'Name':'prcp', 'Type':'DOUBLE', 'Length':''},
        9: {'Name':'wspd', 'Type':'DOUBLE', 'Length':''},
        10: {'Name':'pres', 'Type':'DOUBLE', 'Length':''},
        11: {'Name':'tsun', 'Type':'SHORT', 'Length':''},
        12: {'Name':'id', 'Type':'LONG','Length':''}
    }
    #Loop through the mapping dictionary and set up individual field mappings to add to the fms
    for cid, columnDef in fieldMappingDict.items():
        fm = arcpy.FieldMap()
        fm.addInputField(fn, columnDef['Name'])
        newField = fm.outputField
        newField.type = columnDef['Type']
        newField.length = columnDef['Length']
        fm.outputField = newField
        fms.addFieldMap(fm)
    return fms


def MSC_Normals_fms(fn):
    fms = arcpy.FieldMappings()
    fieldMappingDict = {
        1: {'Name':'combine','Type':'TEXT','Length':25},
        2: {'Name':'start', 'Type':'SHORT', 'Length':''},
        3: {'Name':'end', 'Type':'SHORT', 'Length':''},
        4: {'Name':'month', 'Type':'DOUBLE', 'Length':''},
        5: {'Name':'tmin', 'Type':'DOUBLE', 'Length':''},
        6: {'Name':'tmax', 'Type':'DOUBLE', 'Length':''},
        7: {'Name':'prcp', 'Type':'DOUBLE', 'Length':''},
        8: {'Name':'wspd', 'Type':'DOUBLE', 'Length':''},
        9: {'Name':'pres', 'Type':'DOUBLE', 'Length':''},
        10: {'Name':'tsun', 'Type':'SHORT', 'Length':''},
        11: {'Name':'id', 'Type':'LONG','Length':''}
    }
    #Loop through the mapping dictionary and set up individual field mappings to add to the fms
    for cid, columnDef in fieldMappingDict.items():
        fm = arcpy.FieldMap()
        fm.addInputField(fn, columnDef['Name'])
        newField = fm.outputField
        newField.type = columnDef['Type']
        newField.length = columnDef['Length']
        fm.outputField = newField
        fms.addFieldMap(fm)
    return fms


def Albedo_Data_fms(fn):
    fms = arcpy.FieldMappings()
    fieldMappingDict = {
        1: {'Name':'Station','Type':'LONG','Length':''},
        2: {'Name':'mois', 'Type':'SHORT', 'Length':''},
        3: {'Name':'t_18_k', 'Type':'DOUBLE', 'Length':''},
        4: {'Name':'t_18_c', 'Type':'DOUBLE', 'Length':''},
        5: {'Name':'albedo', 'Type':'DOUBLE', 'Length':''},
        6: {'Name':'N_pi_tot', 'Type':'LONG', 'Length':''},
        7: {'Name':'N_pi_alb', 'Type':'LONG', 'Length':''},
        8: {'Name':'alb_cv', 'Type':'DOUBLE', 'Length':''},
        9: {'Name':'pct_p_tot', 'Type':'DOUBLE', 'Length':''},
        10: {'Name':'nbjr_neige5', 'Type':'SHORT', 'Length':''},
        11: {'Name':'energie_sol', 'Type':'DOUBLE','Length':''},
        12: {'Name':'region_eco', 'Type':'TEXT','Length':2}
    }
    #Loop through the mapping dictionary and set up individual field mappings to add to the fms
    for cid, columnDef in fieldMappingDict.items():
        fm = arcpy.FieldMap()
        fm.addInputField(fn, columnDef['Name'])
        newField = fm.outputField
        newField.type = columnDef['Type']
        newField.length = columnDef['Length']
        fm.outputField = newField
        fms.addFieldMap(fm)
    return fms


def Albedo_EcoFor_fms(fn):
    # %% Create a fieldmappings
    fms = arcpy.FieldMappings()
    fieldMappingDict = {
        1: {'Name':'Station','Type':'LONG','Length':''},
        2: {'Name':'ORIGINE', 'Type':'TEXT', 'Length':12},
        3: {'Name':'AN_ORIGINE', 'Type':'SHORT', 'Length':''},
        4: {'Name':'PERTURB', 'Type':'TEXT', 'Length':12},
        5: {'Name':'AN_PERTURB', 'Type':'SHORT', 'Length':''},
        6: {'Name':'REB_ESS1', 'Type':'TEXT', 'Length':2},
        7: {'Name':'REB_ESS2', 'Type':'TEXT', 'Length':2},
        8: {'Name':'REB_ESS3', 'Type':'TEXT', 'Length':2},
        9: {'Name':'ET_DOMI', 'Type':'TEXT', 'Length':3},
        10: {'Name':'PART_STR', 'Type':'TEXT', 'Length':2},
        11: {'Name':'TYPE_COUV','Type':'TEXT','Length':1},
        12: {'Name':'GR_ESS', 'Type':'TEXT', 'Length':6},
        13: {'Name':'CL_DENS', 'Type':'TEXT', 'Length':1},
        14: {'Name':'CL_HAUT', 'Type':'TEXT', 'Length':1},
        15: {'Name':'CL_AGE', 'Type':'TEXT', 'Length':5},
        16: {'Name':'ETAGEMENT', 'Type':'TEXT', 'Length':2},
        17: {'Name':'COUV_GAULE', 'Type':'TEXT', 'Length':2},
        18: {'Name':'CL_PENT', 'Type':'TEXT', 'Length':1},
        19: {'Name':'DEP_SUR', 'Type':'TEXT', 'Length':4},
        20: {'Name':'CL_DRAI', 'Type':'TEXT', 'Length':2},
        21: {'Name':'TYPE_ECO','Type':'TEXT','Length':5},
        22: {'Name':'CO_TER', 'Type':'TEXT', 'Length':3},
        23: {'Name':'TYPE_TER', 'Type':'TEXT', 'Length':3},
        24: {'Name':'STRATE', 'Type':'TEXT', 'Length':50},
        25: {'Name':'MET_AT_STR', 'Type':'TEXT', 'Length':8},
        26: {'Name':'SUPERFICIE', 'Type':'DOUBLE', 'Length':''},
        27: {'Name':'TOPONYME', 'Type':'TEXT', 'Length':60},
        28: {'Name':'NO_PRG', 'Type':'TEXT', 'Length':2},
        29: {'Name':'VER_PRG', 'Type':'TEXT', 'Length':10},
        30: {'Name':'IN_MAJ', 'Type':'TEXT', 'Length':3},
        31: {'Name':'SREG_ECO','Type':'TEXT','Length':10},
        32: {'Name':'ETAGE', 'Type':'TEXT', 'Length':10},
        33: {'Name':'TY_COUV_ET', 'Type':'TEXT', 'Length':10},
        34: {'Name':'CL_AGE_ET', 'Type':'TEXT', 'Length':10},
        35: {'Name':'DENSITE', 'Type':'TEXT', 'Length':3},
        36: {'Name':'HAUTEUR', 'Type':'SHORT', 'Length':''},
        37: {'Name':'ETA_ESS_PC"', 'Type':'TEXT', 'Length':50},
        38: {'Name':'etage_sup', 'Type':'TEXT', 'Length':10},
        39: {'Name':'TY_COUV_ET_SUP', 'Type':'TEXT', 'Length':10},
        40: {'Name':'DENSITE_sup', 'Type':'TEXT', 'Length':3},
        41: {'Name':'HAUTEUR_sup','Type':'SHORT','Length':''},
        42: {'Name':'ETA_ESS_PC_sup', 'Type':'TEXT', 'Length':50},
        43: {'Name':'etage_inf', 'Type':'TEXT', 'Length':50},
        44: {'Name':'TY_COUV_ET_inf', 'Type':'TEXT', 'Length':50},
        45: {'Name':'DENSITE_inf', 'Type':'TEXT', 'Length':50},
        46: {'Name':'HAUTEUR_inf', 'Type':'SHORT', 'Length':''},
        47: {'Name':'ETA_ESS_PC_inf', 'Type':'TEXT', 'Length':50},
        48: {'Name':'LATITUDE', 'Type':'DOUBLE', 'Length':''},
        49: {'Name':'AN_PRO_ORI', 'Type':'SHORT', 'Length':''},
        50: {'Name':'vmb_ha_feu', 'Type':'DOUBLE', 'Length':''},
        51: {'Name':'vmb_ha_res','Type':'DOUBLE','Length':''},
        52: {'Name':'tbe_COTE_CUMUL', 'Type':'DOUBLE', 'Length':''},
        53: {'Name':'tbe_Defol2014', 'Type':'DOUBLE', 'Length':''},
        54: {'Name':'tbe_Defol2015', 'Type':'DOUBLE', 'Length':''},
        55: {'Name':'tbe_Defol2016', 'Type':'DOUBLE', 'Length':''},
        56: {'Name':'tbe_Defo2017', 'Type':'DOUBLE', 'Length':''},
        57: {'Name':'tbe_Defol2018', 'Type':'DOUBLE', 'Length':''},
        58: {'Name':'tbe_Defol1019', 'Type':'DOUBLE', 'Length':''},
        59: {'Name':'tbe_Defol1419', 'Type':'DOUBLE', 'Length':''},
        60: {'Name':'defol_tbe', 'Type':'DOUBLE', 'Length':''},
        61: {'Name':'n_mois','Type':'SHORT','Length':''},
        62: {'Name':'region_eco', 'Type':'TEXT', 'Length':2}
    }
    #Loop through the mapping dictionary and set up individual field mappings to add to the fms
    for cid, columnDef in fieldMappingDict.items():
        fm = arcpy.FieldMap()
        fm.addInputField(fn, columnDef['Name'])
        newField = fm.outputField
        newField.type = columnDef['Type']
        newField.length = columnDef['Length']
        fm.outputField = newField
        fms.addFieldMap(fm)
    return fms


