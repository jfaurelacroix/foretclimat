#
# Cookbook Name:: arcgis-enterprise
# Recipe:: server_node
#
# Copyright 2022 Esri
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

arcgis_enterprise_server 'Update ArcGIS Server service logon account' do
  install_dir node['arcgis']['server']['install_dir']
  run_as_user node['arcgis']['run_as_user']
  run_as_password node['arcgis']['run_as_password']
  server_directories_root nil
  log_dir node['arcgis']['server']['log_dir']
  config_store_connection_string nil
  not_if { node['arcgis']['run_as_msa'] }
  only_if { Utils.product_installed?(node['arcgis']['server']['product_code']) &&
            node['platform'] == 'windows'}
  action :update_account
end

include_recipe 'arcgis-enterprise::install_server'

arcgis_enterprise_server 'Start ArcGIS Server after upgrade' do
  action :start
end

# Create local server logs directory
directory node['arcgis']['server']['log_dir'] do
  owner node['arcgis']['run_as_user']
  if node['platform'] != 'windows'
    mode '0775'
  end
  recursive true
  not_if { node['arcgis']['server']['log_dir'].start_with?('\\\\') ||
           node['arcgis']['server']['log_dir'].start_with?('/net/') }
  action :create
end

arcgis_enterprise_server 'Authorize ArcGIS Server' do
  authorization_file node['arcgis']['server']['authorization_file']
  authorization_file_version node['arcgis']['server']['authorization_file_version']
  authorization_options node['arcgis']['server']['authorization_options']
  retries 2
  retry_delay 30
  notifies :stop, 'arcgis_enterprise_server[Stop ArcGIS Server]', :immediately
  not_if { node['arcgis']['server']['pull_license'] }
  not_if { node['arcgis']['cache_authorization_files'] &&
           ::File.exists?(node['arcgis']['server']['cached_authorization_file']) &&
           FileUtils.compare_file(node['arcgis']['server']['authorization_file'],
                                  node['arcgis']['server']['cached_authorization_file']) }
  action :authorize
end

# Copy server authorization file to the machine to indicate that server is already authorized
file 'Cache server authorization file' do
  path node['arcgis']['server']['cached_authorization_file']
  if ::File.exists?(node['arcgis']['server']['authorization_file'])
    content File.open(node['arcgis']['server']['authorization_file'], 'rb') { |file| file.read }
  end
  sensitive true
  subscribes :create, 'arcgis_enterprise_server[Authorize ArcGIS Server]', :immediately
  only_if { node['arcgis']['cache_authorization_files'] }
  action :nothing
end

# Create 'C:\Program Files\ESRI' directory with read/write access for run_as_user
if node['platform'] == 'windows'
  directory ::File.join(ENV['ProgramW6432'], 'ESRI') do
    rights :full_control, node['arcgis']['run_as_user']
    only_if { node['arcgis']['server']['pull_license'] }
  end
end

# Set hostname in hostname.properties file
template ::File.join(node['arcgis']['server']['install_dir'],
                     node['arcgis']['server']['install_subdir'],
                     'framework', 'etc', 'hostname.properties') do
  source 'hostname.properties.erb'
  variables ( {:hostname => node['arcgis']['server']['hostname']} )
  notifies :stop, 'arcgis_enterprise_server[Stop ArcGIS Server]', :immediately
  notifies :delete, 'directory[Delete ArcGIS Server certificates directory]', :immediately
  not_if { node['arcgis']['server']['hostname'].empty? }
end

arcgis_enterprise_server 'Stop ArcGIS Server' do
  action :nothing
end

# Delete SSL certificates issued to the old hostname to make ArcGIS Server
# recreate the certificates for hostname set in hostname.properties file.
directory 'Delete ArcGIS Server certificates directory' do
  path ::File.join(node['arcgis']['server']['install_dir'],
                   node['arcgis']['server']['install_subdir'],
                   'framework', 'etc', 'certificates')
  recursive true
  # Do not delete certificates directory if ArcGIS Server site already exists.
  not_if { ::File.exist?(::File.join(node['arcgis']['server']['install_dir'],
                                     node['arcgis']['server']['install_subdir'],
                                     'framework', 'etc', 'config-store-connection.xml')) }
  # Do not delete certificates directory if ArcGIS Server is in upgrade mode.
  not_if { ::File.exist?(::File.join(node['arcgis']['server']['install_dir'],
                                     node['arcgis']['server']['install_subdir'],
                                    'framework', 'etc', 'config-store-connection-upgrade.xml')) }
  action :nothing
end

arcgis_enterprise_server 'Start ArcGIS Server' do
  action :start
end

arcgis_enterprise_server 'Join ArcGIS Server Site' do
  server_url node['arcgis']['server']['url']
  install_dir node['arcgis']['server']['install_dir']
  use_join_site_tool node['arcgis']['server']['use_join_site_tool']
  pull_license node['arcgis']['server']['pull_license']
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
  root_cert node['arcgis']['server']['root_cert']
  root_cert_alias node['arcgis']['server']['root_cert_alias']
  use_join_site_tool node['arcgis']['server']['use_join_site_tool']
  retries 10
  retry_delay 30
  not_if { node['arcgis']['server']['keystore_file'].empty? &&
           node['arcgis']['server']['root_cert'].empty? }
  action :configure_https
end
