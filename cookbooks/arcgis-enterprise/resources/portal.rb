#
# Cookbook Name:: arcgis-enterprise
# Resource:: portal
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

actions :system, :unpack, :install, :uninstall, :stop, :start,
        :update_account, :configure_autostart, :authorize,
        :create_site, :join_site, :set_system_properties, :configure_https,
        :unregister_standby, :register_server, :federate_server,
        :unfederate_server, :enable_server_function, :set_allssl,
        :set_identity_store, :configure_hostidentifiers_properties,
        :import_root_cert

attribute :setup_archive, :kind_of => String
attribute :setups_repo, :kind_of => String
attribute :setup, :kind_of => String
attribute :product_code, :kind_of => String
attribute :install_dir, :kind_of => String
attribute :data_dir, :kind_of => String
attribute :content_dir, :kind_of => String
attribute :content_store_type, :kind_of => String, :default => 'fileStore'
attribute :content_store_provider, :kind_of => String, :default => 'FileSystem'
attribute :content_store_connection_string, :kind_of => [String, Hash]
attribute :object_store, :kind_of => [String, nil]
attribute :run_as_user, :kind_of => String
attribute :run_as_password, :kind_of => String, :sensitive => true
attribute :run_as_msa, :kind_of => [TrueClass, FalseClass], :default => false
attribute :authorization_file, :kind_of => String
attribute :authorization_file_version, :kind_of => String
attribute :portal_url, :kind_of => String
attribute :wa_url, :kind_of => String
attribute :portal_private_url, :kind_of => String
attribute :primary_machine_url, :kind_of => String
attribute :web_context_url, :kind_of => String
attribute :keystore_file, :kind_of => String
attribute :keystore_password, :kind_of => String, :sensitive => true
attribute :cert_alias, :kind_of => String
attribute :root_cert, :kind_of => String
attribute :root_cert_alias, :kind_of => String
attribute :tomcat_java_opts, :kind_of => String
attribute :username, :kind_of => String
attribute :password, :kind_of => String, :sensitive => true
attribute :email, :kind_of => String
attribute :full_name, :kind_of => String
attribute :description, :kind_of => String
attribute :security_question, :kind_of => String
attribute :security_question_answer, :kind_of => String, :sensitive => true
attribute :allssl, :kind_of => [TrueClass, FalseClass], :default => false
attribute :server_url, :kind_of => String
attribute :server_admin_url, :kind_of => String
attribute :server_username, :kind_of => String
attribute :server_password, :kind_of => String, :sensitive => true
attribute :is_hosting, :kind_of => [TrueClass, FalseClass], :default => true
attribute :log_level, :kind_of => String, :default => 'WARNING'
attribute :log_dir, :kind_of => String
attribute :max_log_file_age, :kind_of => Integer, :default => 90
attribute :upgrade_backup, :kind_of => [TrueClass, FalseClass], :default => true
attribute :upgrade_rollback, :kind_of => [TrueClass, FalseClass], :default => true
attribute :user_store_config, :kind_of => Hash, :default => {}
attribute :role_store_config, :kind_of => Hash, :default => {}
attribute :server_function, :kind_of => String
attribute :user_license_type_id, :kind_of => String
attribute :setup_options, :kind_of => String, :default => ''
attribute :system_properties, :kind_of => Hash, :default => {}

def initialize(*args)
  super
  @action = :install
end
