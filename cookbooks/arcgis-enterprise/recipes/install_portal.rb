#
# Cookbook Name:: arcgis-enterprise
# Recipe:: install_portal
#
# Copyright 2018-2021 Esri
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

if node['platform'] == 'windows'
  arcgis_enterprise_portal 'Update Portal for ArcGIS service logon account' do
    install_dir node['arcgis']['portal']['install_dir']
    run_as_user node['arcgis']['run_as_user']
    run_as_password node['arcgis']['run_as_password']
    not_if { node['arcgis']['run_as_msa'] }
    only_if { Utils.product_installed?(node['arcgis']['portal']['product_code']) }
    action :update_account
  end
end

arcgis_enterprise_portal "Install System Requirements:#{recipe_name}" do
  action :system
  only_if { node['arcgis']['portal']['install_system_requirements'] }
end

arcgis_enterprise_portal 'Unpack Portal for ArcGIS' do
  setup_archive node['arcgis']['portal']['setup_archive']
  setups_repo node['arcgis']['repository']['setups']
  run_as_user node['arcgis']['run_as_user']
  only_if { ::File.exist?(node['arcgis']['portal']['setup_archive']) &&
            !::File.exist?(node['arcgis']['portal']['setup']) }
  if node['platform'] == 'windows'
    not_if { Utils.product_installed?(node['arcgis']['portal']['product_code']) }
  else
    not_if { EsriProperties.product_installed?(node['arcgis']['run_as_user'],
                                               node['hostname'],
                                               node['arcgis']['version'],
                                               :ArcGISPortal) }
  end
  action :unpack
end

arcgis_enterprise_portal 'Install Portal for ArcGIS' do
  install_dir node['arcgis']['portal']['install_dir']
  product_code node['arcgis']['portal']['product_code']
  data_dir node['arcgis']['portal']['data_dir']
  setup node['arcgis']['portal']['setup']
  setup_options node['arcgis']['portal']['setup_options']
  run_as_user node['arcgis']['run_as_user']
  run_as_password node['arcgis']['run_as_password']
  run_as_msa node['arcgis']['run_as_msa']  
  if node['platform'] == 'windows'
    not_if { Utils.product_installed?(node['arcgis']['portal']['product_code']) }
  else
    not_if { EsriProperties.product_installed?(node['arcgis']['run_as_user'],
                                               node['hostname'],
                                               node['arcgis']['version'],
                                               :ArcGISPortal) }
  end
  action :install
end

# Workaround for BUG-000121142
# Upgrade to Portal for ArcGIS 10.7 fails if the content store is in AWS S3.

if node['platform'] == 'windows'
  template ::File.join(node['arcgis']['misc']['scripts_dir'], 'install_portal.bat') do
    source 'install_portal.bat.erb'
    cookbook 'arcgis-enterprise'
    only_if { node['arcgis']['version'] == '10.7' && node['arcgis']['portal']['content_store_provider'] == 'Amazon' }
    subscribes :create, 'arcgis_enterprise_portal[Install Portal for ArcGIS]', :immediately
    notifies :run, 'execute[BUG-000121142]', :immediately
    action :nothing
  end

  execute 'BUG-000121142' do
    command ::File.join(node['arcgis']['misc']['scripts_dir'], 'install_portal.bat')
    action :nothing
  end
else
  template ::File.join(node['arcgis']['misc']['scripts_dir'], 'install_portal.sh') do
    source 'install_portal.sh.erb'
    mode '0777'
    cookbook 'arcgis-enterprise'
    only_if { node['arcgis']['version'] == '10.7' && node['arcgis']['portal']['content_store_provider'] == 'Amazon' }
    subscribes :create, 'arcgis_enterprise_portal[Install Portal for ArcGIS]', :immediately
    notifies :run, 'execute[BUG-000121142]', :immediately
    action :nothing
  end

  execute 'BUG-000121142' do
    cwd ::File.join(node['arcgis']['portal']['install_dir'], node['arcgis']['portal']['install_subdir'])
    user node['arcgis']['run_as_user']
    command ::File.join(node['arcgis']['misc']['scripts_dir'], 'install_portal.sh')
    action :nothing
  end
end

# End workaround for BUG-000121142

arcgis_enterprise_portal 'Configure arcgisportal service' do
  install_dir node['arcgis']['portal']['install_dir']
  only_if { node['arcgis']['portal']['configure_autostart'] }
  action :configure_autostart
end
