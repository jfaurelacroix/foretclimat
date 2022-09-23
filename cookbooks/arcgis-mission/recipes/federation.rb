#
# Cookbook Name:: arcgis-mission
# Recipe:: federation
#
# Copyright 2021 Esri
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

# Import public key of ArcGIS Mission Server SSL certificate into portal as 
# root/intermediate certificate.
arcgis_enterprise_portal 'Import Root Certificates' do
  portal_url node['arcgis']['portal']['private_url']
  username node['arcgis']['portal']['admin_username']
  password node['arcgis']['portal']['admin_password']
  root_cert node['arcgis']['portal']['root_cert']
  root_cert_alias node['arcgis']['portal']['root_cert_alias']
  not_if { node['arcgis']['portal']['root_cert'].empty? ||
           node['arcgis']['portal']['root_cert_alias'].empty?}
  retries 5
  retry_delay 30
  action :import_root_cert
end

arcgis_enterprise_portal 'Federate Mission Server' do
  portal_url node['arcgis']['portal']['private_url']
  username node['arcgis']['portal']['admin_username']
  password node['arcgis']['portal']['admin_password']
  server_url node['arcgis']['mission_server']['web_context_url']
  server_admin_url node['arcgis']['mission_server']['private_url']
  server_username node['arcgis']['mission_server']['admin_username']
  server_password node['arcgis']['mission_server']['admin_password']
  is_hosting false
  retries 5
  retry_delay 30
  action :federate_server
end

arcgis_enterprise_portal 'Enable MissionServer server function' do
  portal_url node['arcgis']['portal']['private_url']
  username node['arcgis']['portal']['admin_username']
  password node['arcgis']['portal']['admin_password']
  server_url node['arcgis']['mission_server']['web_context_url']
  server_admin_url node['arcgis']['mission_server']['private_url']
  server_username node['arcgis']['mission_server']['admin_username']
  server_password node['arcgis']['mission_server']['admin_password']
  server_function 'MissionServer'
  is_hosting false
  action :enable_server_function
end
