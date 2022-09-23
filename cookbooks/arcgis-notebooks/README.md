arcgis-notebooks cookbook
===============

This cookbook installs and configures ArcGIS Notebook Server.

Requirements
------------

### Supported ArcGIS Notebook Server versions

* 10.7.1
* 10.8
* 10.8.1
* 10.9
* 10.9.1

### Supported ArcGIS software

* ArcGIS Notebook Server

### Platforms

* Ubuntu Server 18.04 and 20.04 LTS
* Red Hat Enterprise Linux Server 8
* CentOS Linux 8
* Oracle Linux 8

### Dependencies

The following cookbooks are required:

* arcgis-enterprise
* arcgis-repository
* docker
* iptables

Attributes
----------

* `node['arcgis']['notebook_server']['url']` = ArcGIS Notebook Server URL. Default URL is `https://<FQDN of the machine>:11443`.
* `node['arcgis']['notebook_server']['wa_name']` = Name of ArcGIS Web Adaptor used for ArcGIS Notebook Server. Default name is `notebooks`.
* `node['arcgis']['notebook_server']['wa_url']` = URL of the Web Adaptor used for ArcGIS Notebook Server. Default URL is `https://<FQDN of the machine>/<Notebook Server Web Adaptor name>`.
* `node['arcgis']['notebook_server']['domain_name']` = ArcGIS Notebook Server site domain name. Default domain is FQDN of the machine.
* `node['arcgis']['notebook_server']['private_url']` = Private URL of ArcGIS Notebook Server. Default URL is `https://<FQDN of the machine>:11443/arcgis`.
* `node['arcgis']['notebook_server']['web_context_url']` = Web Context URL of ArcGIS Notebook Server. Default URL is `https://<FQDN of the machine>/<Notebook Server Web Adaptor name>`.
* `node['arcgis']['notebook_server']['authorization_file']` = ArcGIS Notebook Server authorization file path.
* `node['arcgis']['notebook_server']['authorization_file_version']` = ArcGIS Notebook Server authorization file version. Default value is `node['arcgis']['server']['authorization_file_version']`.
* `node['arcgis']['notebook_server']['license_level']` = License level of ArcGIS Notebook Server. Allowed values are `standard` and `advanced`. Default license level is `standard`.
* `node['arcgis']['notebook_server']['install_dir']` = ArcGIS Notebook Server installation directory. By default, ArcGIS Notebook Server is installed to  `%ProgramW6432%\ArcGIS\NotebookServer` on Windows machines and to `/home/arcgis` on Linux machines.
* `node['arcgis']['notebook_server']['directories_root']` = The root ArcGIS Notebook Server server directory location. The default value is `C:\arcgisnotebookserver\directories` on Windows and `/<ArcGIS Notebook Server install directory>/notebookserver/usr/directories` on Linux.
* `node['arcgis']['notebook_server']['config_store_type']` = ArcGIS Notebook Server config store type (FILESYSTEM|AMAZON|AZURE). Default value is `FILESYSTEM`.
* `node['arcgis']['notebook_server']['config_store_connection_string']` = The configuration store location for the ArcGIS Notebook Server site. By default, the configuration store is created in the local directory `C:\arcgisnotebookserver\config-store` on Windows and `/<ArcGIS Notebook Server install directory>/usr/config-store` on Linux.
* `node['arcgis']['notebook_server']['config_store_class_name']` = ArcGIS Notebook Server config store persistence class name. Default value is `com.esri.arcgis.carbon.persistence.impl.filesystem.FSConfigPersistence`.
* `node['arcgis']['notebook_server']['log_level']` = ArcGIS Notebook Server log level. Default value is `WARNING`.
* `node['arcgis']['notebook_server']['log_dir']` = ArcGIS Notebook Server log directory. Default value is `C:\arcgisnotebookserver\logs` on Windows and `/<ArcGIS Notebook Server install directory>/usr/logs` on Linux.
* `node['arcgis']['notebook_server']['max_log_file_age']` = ArcGIS Notebook Server maximum log file age. Default value is `90`.
* `node['arcgis']['notebook_server']['workspace']` = The workspace directory location. This must be a local path; if the site will have additional machines joined to it, a replication method must be set up between the workspace directories of each machine. By default the workspace directory is set to `C:\arcgisnotebookserver\arcgisworkspace` on Windows and to `/<ArcGIS Notebook Server install directory>/usr/arcgisworkspace` on Linux.
* `node['arcgis']['notebook_server']['setup_archive']` = Path to ArcGIS Notebook Server setup archive. Default value depends on `node['arcgis']['version']` attribute value.
* `node['arcgis']['notebook_server']['setup']` = The location of ArcGIS Notebook Server setup executable. Default location is `%USERPROFILE%\Documents\ArcGIS10.9\NotebookServer\Setup.exe` on Windows and `/opt/arcgis/10.9/NotebookServer_Linux/Setup` on Linux.
* `node['arcgis']['notebook_server']['standard_images']` = Standard Docker container images for notebooks. Default value depends on `node['arcgis']['version']` attribute value.
* `node['arcgis']['notebook_server']['advanced_images']` = Advanced Docker container images for notebooks. Default value depends on `node['arcgis']['version']` attribute value.
* `node['arcgis']['notebook_server']['configure_autostart']` = If set to true, on Linux the Notebook Server is configured to start with the operating system. Default value is `true`.
* `node['arcgis']['notebook_server']['admin_username']` = Primary ArcGIS Notebook Server administrator user name. Default user name is `admin`.
* `node['arcgis']['notebook_server']['admin_password']` = Primary ArcGIS Notebook Server administrator password. Default value is `change.it`.
* `node['arcgis']['notebook_server']['primary_server_url']` = The URL of the existing ArcGIS Notebook Server site to join, in the format `https://notebookserver.domain.com:11443/arcgis/admin`. Default URL `nil`.
* `node['arcgis']['notebook_server']['install_system_requirements']` = Enable system-level configuration for ArcGIS Notebook Server. Default value is `true`.
* `node['arcgis']['notebook_server']['install_samples_data']` = If set to `true`, arcgis-notebooks::server recipe includes arcgis-notebooks::data recipe. Default value is `false`.
* `node['arcgis']['notebook_server']['ports']` = Ports to open for Notebook Servier in Windows firewall. Default is `11443`.
* `node['arcgis']['notebook_server']['hostname']` = Host name or IP address of ArcGIS Notebook Server machine. Default value is  `''`.
* `node['arcgis']['notebook_server']['system_properties']` = ArcGIS Notebook Server system properties. Default value is `{}`.
* `node['arcgis']['notebook_server']['data_setup']` = The location of ArcGIS Notebook Server Samples Data setup. Default location is `%USERPROFILE%\Documents\ArcGIS10.9\NotebookServerData\Setup.exe` on Windows and `/opt/arcgis/10.9/NotebookServerData_Linux/ArcGISNotebookServerSamplesData-Setup.sh` on Linux.
* `node['arcgis']['notebook_server']['data_setup_archive']` = Path to ArcGIS Notebook Server Samples Data setup archive. Default value depends on `node['arcgis']['version']` attribute value.

Recipes
-------

### arcgis-notebooks::default

Installs and configures ArcGIS Notebook Server.

### arcgis-notebooks::docker

Installs Docker engine.

### arcgis-notebooks::federation

Federates ArcGIS Notebook Server with Portal for ArcGIS and enables NotebookServer role.

### arcgis-notebooks::fileserver

Configures shared directories for ArcGIS Notebook Server on file server machine.

### arcgis-notebooks::iptables

Reject Docker containers access to EC2 instance metadata IP address.

### arcgis-notebooks::install_server

Installs ArcGIS Notebook Server.

### arcgis-notebooks::install_server_wa

Installs ArcGIS Web Adaptor for ArcGIS Notebook Server.

### arcgis-notebooks::server

Installs and configures ArcGIS Notebook Server.

### arcgis-notebooks::server_node

Joins additional machines to an ArcGIS Notebook Server site.

### arcgis-notebooks::samples_data

Installs ArcGIS Notebook Server Samples Data.

### arcgis-notebooks::server_wa

Installs and configures ArcGIS Web Adaptor for ArcGIS Notebook Server.

### arcgis-notebooks::uninstall_server

Uninstalls ArcGIS Notebook Server.

### arcgis-notebooks::uninstall_server_wa

Uninstalls ArcGIS Web Adaptor for ArcGIS Notebook Server.

### arcgis-notebooks::unregister_machine

Unregisters server machine from the ArcGIS Notebook Server site.

### arcgis-notebooks::unregister_server_wa

Unregisters all ArcGIS Notebook Server Web Adaptors.

Usage
-----

Example JSON for linux deployments:

```JSON
{
    "arcgis": {
        "version": "10.7.1",
        "run_as_user": "arcgis",
        "notebook_server": {
            "setup_archive": "/opt/software/esri/ArcGIS_Notebook_Server_Linux_1071_169927.tar.gz",
            "standard_images": "/opt/software/esri/ArcGIS_Notebook_Docker_Standard_1071_169736.tar.gz",
            "advanced_images": "/opt/software/esri/ArcGIS_Notebook_Docker_Advanced_1071_169738.tar.gz",
            "authorization_file": "/opt/software/esri/notebooksadvsvr_107.ecp",
            "license_level": "advanced",
            "admin_username": "admin",
            "admin_password": "change.it",
            "directories_root": "/home/arcgis/notebookserver/usr/directories",
            "config_store_connection_string": "/home/arcgis/notebookserver/usr/directories/config-store",
            "workspace": "/home/arcgis/notebookserver/usr/directories/config-store",
            "configure_autostart": true,
            "install_system_requirements": true
        }
    },
    "run_list": [
        "recipe[arcgis-enterprise::system]",
        "recipe[arcgis-notebooks::docker]",
        "recipe[arcgis-notebooks::server]"
    ]
}
```

```JSON
{
    "arcgis": {
        "version": "10.7.1",
        "run_as_user": "arcgis",
        "notebook_server": {
            "setup_archive": "/opt/software/esri/ArcGIS_Notebook_Server_Linux_1071_169927.tar.gz",
            "standard_images": "/opt/software/esri/ArcGIS_Notebook_Docker_Standard_1071_169736.tar.gz",
            "advanced_images": "/opt/software/esri/ArcGIS_Notebook_Docker_Advanced_1071_169738.tar.gz",
            "authorization_file": "/opt/software/esri/notebooksadvsvr_107.ecp",
            "license_level": "advanced",
            "primary_server_url": "https://notebookserver.domain.com:11443/arcgis/admin",
            "admin_username": "admin",
            "admin_password": "change.it",
            "configure_autostart": true,
            "install_system_requirements": true
        }
    },
    "run_list": [
        "recipe[arcgis-enterprise::system]",
        "recipe[arcgis-notebooks::docker]",
        "recipe[arcgis-notebooks::server_node]"
    ]
}
```

See [wiki](https://github.com/Esri/arcgis-cookbook/wiki) pages for more information about using ArcGIS cookbooks.

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an [issue](https://github.com/Esri/arcgis-cookbook/issues).

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

Licensing
---------

Copyright 2021 Esri

Licensed under the Apache License, Version 2.0 (the "License");
You may not use this file except in compliance with the License.
You may obtain a copy of the License at
   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [License.txt](https://github.com/Esri/arcgis-cookbook/blob/master/License.txt?raw=true) file.

[](Esri Tags: ArcGIS Enterprise Notebook Server Chef Cookbook)
[](Esri Language: Ruby)
