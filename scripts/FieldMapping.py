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


