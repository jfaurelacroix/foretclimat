#
# Cookbook Name:: arcgis-enterprise
# Resource:: webstyles
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

actions :unpack, :install

attribute :setup_archive, :kind_of => String
attribute :setups_repo, :kind_of => String
attribute :run_as_user, :kind_of => String
attribute :product_code, :kind_of => String
attribute :setup, :kind_of => String
attribute :setup_options, :kind_of => String, :default => ''

def initialize(*args)
  super
  @action = :install
end
