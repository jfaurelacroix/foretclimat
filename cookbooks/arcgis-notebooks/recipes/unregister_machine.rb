#
# Cookbook Name:: arcgis-notebooks
# Recipe:: unregister_machine
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

arcgis_notebooks_server 'Unregister server machine' do
  server_url node['arcgis']['notebook_server']['url']
  username node['arcgis']['notebook_server']['admin_username']
  password node['arcgis']['notebook_server']['admin_password']
  hostname node['arcgis']['notebook_server']['hostname']
  retries 5
  retry_delay 30
  action :unregister_machine
end
