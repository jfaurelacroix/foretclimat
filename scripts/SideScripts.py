#!/usr/bin/python3
# -*- coding: utf-8 -*-

""" Auteur: Naïm Perreault
    Date de création: 2022-05-19
    Date de la mise à jour: 2023-06-27
    Version 1.0.

    Passerelle Forêt-Climat - Scripts compagnons
"""

import arcpy
import pandas as pd

# ------------------------------------------------------------------------------
# %% FeatureTabletoDataframe
# ------------------------------------------------------------------------------
# Functionality: Convert feature class to pandas dataframe
# Original Author: [d-wasserman](https://gist.github.com/d-wasserman)
# Modified by [Choumingzhao](https://gist.github.com/Choumingzhao)
# Source: https://gist.github.com/d-wasserman/e9c98be1d0caebc2935afecf0ba239a0
def fc_to_df(in_fc, input_fields=None, drop_shape=True, query=""):
    """Function will convert an arcgis feature class table into a pandas dataframe with an object ID index, and the selected
    input fields using an arcpy.da.SearchCursor.
    :param - in_fc - input feature class or table to convert
    :param - input_fields - fields to input to a da search cursor for retrieval
    :param - drop_shape - drop the shape field from the dataframe
    :param - query - sql query to grab appropriate values
    :returns - pandas.DataFrame"""
    OIDFieldName = arcpy.Describe(in_fc).OIDFieldName
    if input_fields:
        final_fields = [OIDFieldName] + input_fields
    else:
        final_fields = [field.name for field in arcpy.ListFields(in_fc)]
    if drop_shape and u"Shape" in final_fields:
        final_fields.remove(u"Shape")
    data = [row for row in arcpy.da.SearchCursor(in_fc, final_fields, where_clause=query)]
    fc_dataframe = pd.DataFrame(data, columns=final_fields)
    fc_dataframe = fc_dataframe.set_index(OIDFieldName, drop=True)
    return fc_dataframe

def fc_to_df2(in_fc, input_fields=None, drop_shape=True, query="", skip_nulls=False, null_values=None):
    """Function will convert an arcgis feature class table into a pandas dataframe with an object ID index, and the selected
    input fields. Uses TableToNumPyArray to get initial data.
    :param - in_fc - input feature class or table to convert
    :param - input_fields - fields to input into a da numpy converter function
    :param - drop_shape - drop the shape field from the dataframe
    :param - query - sql like query to filter out records returned
    :param - skip_nulls - skip rows with null values
    :param - null_values - values to replace null values with.
    :returns - pandas dataframe"""
    OIDFieldName = arcpy.Describe(in_fc).OIDFieldName
    if input_fields:
        final_fields = [OIDFieldName] + input_fields
    else:
        final_fields = [field.name for field in arcpy.ListFields(in_fc)]
    if drop_shape and u"Shape" in final_fields:
        final_fields.remove(u"Shape")
    np_array = arcpy.da.TableToNumPyArray(in_fc, final_fields, query, skip_nulls, null_values)
    object_id_index = np_array[OIDFieldName]
    fc_dataframe = pd.DataFrame(np_array, index=object_id_index, columns=input_fields)
    return fc_dataframe

# ------------------------------------------------------------------------------
# %% ReorderColumns
# ------------------------------------------------------------------------------
def reorder_columns(dataframe, col_name, position):
    """Reorder a dataframe's column.
    Args:
        dataframe (pd.DataFrame): dataframe to use
        col_name (string): column name to move
        position (0-indexed position): where to relocate column to
    Returns:
        pd.DataFrame: re-assigned dataframe
    """
    temp_col = dataframe[col_name]
    dataframe = dataframe.drop(columns=[col_name])
    dataframe.insert(loc=position, column=col_name, value=temp_col)
    return dataframe


# ------------------------------------------------------------------------------
# %% fields_list if the field is not geometry nor oid
# ------------------------------------------------------------------------------
def fields_list(feature_class):
    fields = []  # variable to store list
    for field in arcpy.ListFields(feature_class):  # for every field in the feature class
        if field.type != 'Geometry' and field.type != 'OID':  # if the field is not geometry nor oid
            fields.append(field.name)  # append the field name to the list
    return fields  # return the list of field names

# ------------------------------------------------------------------------------
# %% Increment ID
# ------------------------------------------------------------------------------
def autoIncrement():
    global rec
    pStart = 1
    pInterval = 1
    if (rec == 0):
        rec = pStart
    else:
        rec = rec + pInterval
    return rec

# ------------------------------------------------------------------------------
# %% EditMode
# ------------------------------------------------------------------------------
edit = arcpy.da.Editor(arcpy.env.workspace)  # Trouver comment intégrer à la fonction EditMode
def EditMode(Status):
    if Status == "Start":
        print("Start editing")
        edit.startEditing(False, False)
        edit.startOperation()
    if Status == "End":
        print("End editing")
        edit.stopOperation()
        edit.stopEditing(True)

# ------------------------------------------------------------------------------
# %% SelectRelatedRecords
# ------------------------------------------------------------------------------
# https://gis.stackexchange.com/questions/50287/efficiently-selecting-related-records-using-arcpy
# OriginTable = "This must be a Table View or Feature Layer"
# DestinationTable = "This must be a Table View or Feature Layer"
# PrimaryKeyField = "Matching Origin Table Field"
# ForiegnKeyField = "Matching Destination Table Field"

def buildWhereClauseFromList(OriginTable, PrimaryKeyField, valueList):
    """Takes a list of values and constructs a SQL WHERE
       clause to select those values within a given PrimaryKeyField
       and OriginTable."""
    fieldDelimited = arcpy.AddFieldDelimiters(arcpy.Describe(OriginTable).path, PrimaryKeyField)  # Add DBMS-specific field delimiters
    fieldType = arcpy.ListFields(OriginTable, PrimaryKeyField)[0].type  # Determine field type
    if str(fieldType) == 'String':  # Add single-quotes for string field values
        valueList = ["'%s'" % value for value in valueList]
    whereClause = "%s IN (%s)" % (fieldDelimited, ', '.join(map(str, valueList)))  # Format WHERE clause in the form of an IN statement
    return whereClause

def selectRelatedRecords(OriginTable, DestinationTable, PrimaryKeyField, ForiegnKeyField):
    """Defines the record selection from the record selection of the OriginTable
      and applys it to the DestinationTable using a SQL WHERE clause built
      in the previous defintion"""
    sourceIDs = set([row[0] for row in arcpy.da.SearchCursor(OriginTable, PrimaryKeyField)])  # Set the SearchCursor to look through the selection of the OriginTable
    whereClause = buildWhereClauseFromList(DestinationTable, ForiegnKeyField, sourceIDs)  # Establishes the where clause used to select records from DestinationTable
    arcpy.SelectLayerByAttribute_management(DestinationTable, "NEW_SELECTION", whereClause)  # Process: Select Layer By Attribute
    #print(whereClause)

# ------------------------------------------------------------------------------
# %% Génerer un liste des valeurs présentent dans un champs
# ------------------------------------------------------------------------------
def unique_values(table, field):
    with arcpy.da.SearchCursor(table, [field]) as scur:
        return {row[0] for row in scur}
    del scur

# ------------------------------------------------------------------------------
# %% Génerer un liste des chiffres entiers manquants
# ------------------------------------------------------------------------------
def find_missing(lst):
    return sorted(set(range(lst[0], lst[-1])) - set(lst))

