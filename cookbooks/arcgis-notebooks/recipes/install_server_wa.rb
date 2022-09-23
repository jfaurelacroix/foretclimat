#
# Cookbook Name:: arcgis-notebooks
# Recipe:: install_server_wa
#
# Copyright 2019 Esri
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

arcgis_enterprise_webadaptor 'Unpack ArcGIS Web Adaptor' do
  setup_archive node['arcgis']['web_adaptor']['setup_archive']
  setups_repo node['arcgis']['repository']['setups']
  run_as_user node['arcgis']['run_as_user']
  only_if { ::File.exist?(node['arcgis']['web_adaptor']['setup_archive']) &&
            !::File.exist?(node['arcgis']['web_adaptor']['setup']) }
  if node['platform'] == 'windows'
    not_if { !Utils.wa_product_code(node['arcgis']['notebook_server']['wa_name'],
                                    node['arcgis']['web_adaptor']['product_codes']).nil? }
  else
    not_if { ::File.exist?(::File.join(node['arcgis']['web_adaptor']['install_dir'],
                                       node['arcgis']['web_adaptor']['install_subdir'],
                                      'java/arcgis.war')) }
  end
  action :unpack
end

arcgis_enterprise_webadaptor 'Install Web Adaptor for Notebook Server' do
  install_dir node['arcgis']['web_adaptor']['install_dir']
  setup node['arcgis']['web_adaptor']['setup']
  run_as_user node['arcgis']['run_as_user']
  instance_name node['arcgis']['notebook_server']['wa_name']
  if node['platform'] == 'windows'
    not_if { !Utils.wa_product_code(node['arcgis']['notebook_server']['wa_name'],
                                    node['arcgis']['web_adaptor']['product_codes']).nil? }
  else
    not_if { ::File.exist?(::File.join(node['arcgis']['web_adaptor']['install_dir'],
                                       node['arcgis']['web_adaptor']['install_subdir'],
                                      'java/arcgis.war')) }
  end
  action :install
end

arcgis_enterprise_webadaptor 'Deploy Web Adaptor for Notebook Server' do
  install_dir node['arcgis']['web_adaptor']['install_dir']
  instance_name node['arcgis']['notebook_server']['wa_name']
  not_if { node['platform'] == 'windows' }
  action :deploy
end
