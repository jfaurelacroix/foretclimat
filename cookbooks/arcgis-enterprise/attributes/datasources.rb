#
# Cookbook Name:: arcgis-enterprise
# Attributes:: datasources
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

case node['platform']
when 'windows'
  default['arcgis']['misc']['scripts_dir'] = 'C:\\Chef\\misc_scripts'
else # node['platform'] == 'linux'
  default['arcgis']['misc']['scripts_dir'] = '/var/chef/misc_scripts'
end

default['arcgis']['datasources'].tap do |datasource|
  datasource['block_data_copy'] = false
  datasource['ags_connection_file'] = File.join(node['arcgis']['misc']['scripts_dir'], 'AdminConnection.ags')
  datasource['sde_files']['files'] = {}
  datasource['server_config_url'] = "https://#{node['fqdn']}:6443/arcgis"
end
