#
# Cookbook Name:: arcgis-enterprise
# Recipe:: register_machine
#
# Copyright 2018 Esri
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

arcgis_enterprise_server 'Join ArcGIS Server Site' do
  server_url node['arcgis']['server']['url']
  install_dir node['arcgis']['server']['install_dir']
  use_join_site_tool node['arcgis']['server']['use_join_site_tool']
  if node['arcgis']['server']['use_join_site_tool']
    config_store_connection_string node['arcgis']['server']['config_store_connection_string']
    config_store_connection_secret node['arcgis']['server']['config_store_connection_secret']
    config_store_type node['arcgis']['server']['config_store_type']
  else
    username node['arcgis']['server']['admin_username']
    password node['arcgis']['server']['admin_password']
    primary_server_url node['arcgis']['server']['primary_server_url']
  end
  retries 10
  retry_delay 30
  action :join_site
end

arcgis_enterprise_server 'Add machine to default cluster' do
  server_url node['arcgis']['server']['url']
  username node['arcgis']['server']['admin_username']
  password node['arcgis']['server']['admin_password']
  cluster 'default'
  retries 10
  retry_delay 30
  not_if { node['arcgis']['server']['use_join_site_tool'] }
  action :join_cluster
end

arcgis_enterprise_server 'Set server machine properties' do
  server_url node['arcgis']['server']['url']
  install_dir node['arcgis']['server']['install_dir']
  username node['arcgis']['server']['admin_username']
  password node['arcgis']['server']['admin_password']
  use_join_site_tool node['arcgis']['server']['use_join_site_tool']
  soc_max_heap_size node['arcgis']['server']['soc_max_heap_size']
  retries 5
  retry_delay 30
  action :set_machine_properties
end

arcgis_enterprise_server 'Configure HTTPS' do
  server_url node['arcgis']['server']['url']
  server_admin_url node['arcgis']['server']['url'] + '/admin'
  install_dir node['arcgis']['server']['install_dir']
  username node['arcgis']['server']['admin_username']
  password node['arcgis']['server']['admin_password']
  keystore_file node['arcgis']['server']['keystore_file']
  keystore_password node['arcgis']['server']['keystore_password']
  cert_alias node['arcgis']['server']['cert_alias']
  use_join_site_tool node['arcgis']['server']['use_join_site_tool']
  retries 10
  retry_delay 30
  not_if { node['arcgis']['server']['keystore_file'].empty? }
  action :configure_https
end