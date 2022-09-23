#
# Cookbook Name:: arcgis-enterprise
# Resource:: datastore
#
# Copyright 2015 Esri
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

actions :system, :unpack, :install, :uninstall, :update_account, :configure_autostart,
        :stop, :start, :configure, :configure_backup_location, :prepare_upgrade,
        :configure_hostidentifiers_properties, :remove_machine

attribute :setup_archive, :kind_of => String
attribute :setups_repo, :kind_of => String
attribute :setup, :kind_of => String
attribute :product_code, :kind_of => String
attribute :install_dir, :kind_of => String
attribute :data_dir, :kind_of => String
attribute :backup_dir, :kind_of => String
attribute :types, :kind_of => String, :default => 'tileCache,relational'
attribute :mode, :kind_of => String
attribute :run_as_user, :kind_of => String
attribute :run_as_password, :kind_of => String
attribute :run_as_msa, :kind_of => [TrueClass, FalseClass], :default => false
attribute :server_url, :kind_of => String
attribute :username, :kind_of => String
attribute :password, :kind_of => String
attribute :store, :kind_of => String, :default => 'relational'
attribute :backup_type, :kind_of => String, :default => 'fs'
attribute :backup_location, :kind_of => String
attribute :setup_options, :kind_of => String, :default => ''
attribute :preferredidentifier, :kind_of => String, :default => 'hostname'
attribute :hostidentifier, :kind_of => String, :default => ''
attribute :force_remove_machine, :kind_of => [TrueClass, FalseClass], :default => false

def initialize(*args)
  super
  @action = :install
end
