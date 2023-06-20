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

require 'net/http'
require 'uri'
require 'json'
require 'socket'

#
# ArcGIS helper classes
#
module ArcGIS
  #
  # Client class for ArcGIS Portal Directory.
  #
  class PortalAdminClient
    READ_TIMEOUT = 3600

    @portal_url = nil
    @generate_token_url = nil
    @admin_username = nil
    @admin_password = nil

    def initialize(portal_url, admin_username, admin_password)
      @portal_url = portal_url
      @generate_token_url = @portal_url + '/sharing/rest/generateToken'
      @admin_username = admin_username
      @admin_password = admin_password
    end

    def wait_until_available(redirects = 0)
      Utils.wait_until_url_available(@portal_url + '/portaladmin', redirects)
    end

    def site_exist?
      uri = URI.parse(@portal_url + '/portaladmin/?f=json')

      request = Net::HTTP::Get.new(uri.request_uri)

      http = Net::HTTP.new(uri.host, uri.port)
      http.read_timeout = 600

      if uri.scheme == 'https'
        http.use_ssl = true
        http.verify_mode = OpenSSL::SSL::VERIFY_NONE
      end

      response = http.request(request)

      if response.code.to_i == 200
        error_info = JSON.parse(response.body)
        return true if !error_info['error'].nil? &&
                       error_info['error']['code'].to_i == 499
      end

      false
    end

    def upgrade_required?
      uri = URI.parse(@portal_url + '/portaladmin/?f=json')

      request = Net::HTTP::Get.new(uri.request_uri)

      http = Net::HTTP.new(uri.host, uri.port)
      http.read_timeout = READ_TIMEOUT

      if uri.scheme == 'https'
        http.use_ssl = true
        http.verify_mode = OpenSSL::SSL::VERIFY_NONE
      end

      Chef::Log.debug("Request: #{request.method} #{uri.scheme}://#{uri.host}:#{uri.port}#{request.path}")

      response = http.request(request)

      Chef::Log.debug("Response: #{response.code} #{response.body}")

      if response.code.to_i == 200
        return JSON.parse(response.body)['isUpgrade'] == true
      end

      false
    end

    def poll_upgrade_status(auth = false)
      upgrade_uri = URI.parse(@portal_url + '/portaladmin/upgrade')

      if auth
        token = generate_token(@generate_token_url)
        upgrade_uri.query = URI.encode_www_form('token' => token, 'f' => 'json')
      else
        upgrade_uri.query = URI.encode_www_form('f' => 'json')
      end

      request = Net::HTTP::Get.new(upgrade_uri.request_uri)

      request.add_field('Referer', 'referer')

      response = send_request(request)

      validate_response(response)

      response
    end

    def complete_upgrade(is_backup_required, is_rollback_required, license_file, enable_debug = false)
      if upgrade_required?
        Chef::Log.info("Completing portal upgrade...")

        upgrade_uri = URI.parse(@portal_url + '/portaladmin/upgrade')

        request = Net::HTTP::Post::Multipart.new(
          upgrade_uri.path,
          'isBackupRequired' => is_backup_required,
          'isRollbackRequired' => is_rollback_required,
          'isReindexRequired' => true,
          'file' => UploadIO.new(File.new(license_file),
                                  'application/json',
                                  File.basename(license_file)),
          'async' => true,
          'enableDebug' => enable_debug,
          'f' => 'json'
        )

        response = send_request(request)
        validate_response(response)
        upgrade_status = JSON.parse(response.body)

        while upgrade_status['status'] == 'in progress'
          sleep(5.0)
          response = poll_upgrade_status(false)
          validate_response(response)
          upgrade_status = JSON.parse(response.body)
        end

        unless upgrade_status['stages'].nil?
          # Log upgrade stages
          upgrade_status['stages'].each do |stage|
            Chef::Log.info("#{stage['name']}: #{stage['state']}")
          end
        end

        unless upgrade_status['warnings'].nil?
          # Log upgrade warnings
          upgrade_status['warnings'].each do |warning|
            Chef::Log.warn(warning)
          end
        end

        messages = upgrade_status['messages'].nil? ? '' : upgrade_status['messages'].join(' ')

        if upgrade_status['status'] == 'success' || upgrade_status['status'] == 'success with warnings'
          unless upgrade_status['upgradeFromVersion'].nil? || upgrade_status['upgradeToVersion'].nil?
            Chef::Log.info("Portal upgrade from #{upgrade_status['upgradeFromVersion']} to #{upgrade_status['upgradeToVersion']} completed successfully.")
          else
            Chef::Log.info("Portal upgrade completed successfully.")
          end

          return true
        else
          raise "Portal upgrade failed. #{messages}"
        end
      end

      return false
    end

    def post_upgrade_required?
      token = generate_token(@generate_token_url)

      uri = URI.parse(@portal_url + "/portaladmin")

      uri.query = URI.encode_www_form('token' => token, 'f' => 'json')

      request = Net::HTTP::Get.new(uri.request_uri)

      request.add_field('Referer', 'referer')

      response = send_request(request)

      validate_response(response)

      JSON.parse(response.body)['isPostUpgrade']
    end

    def post_upgrade
      if post_upgrade_required?
        Chef::Log.info("Portal post-upgrade...")

        request = Net::HTTP::Post.new(URI.parse(@portal_url +
          "/portaladmin/postUpgrade").request_uri)

        request.add_field('Referer', 'referer')

        token = generate_token(@generate_token_url)

        request.set_form_data(
          'token' => token,
          'f' => 'json')

        response = send_request(request)

        validate_response(response)
      end
    end

    def reindex(mode='FULL_MODE', includes='')
      Chef::Log.info("Reindexing portal content...")

      request = Net::HTTP::Post.new(URI.parse(@portal_url +
        "/portaladmin/system/indexer/reindex").request_uri)

      request.add_field('Referer', 'referer')

      token = generate_token(@generate_token_url)

      request.set_form_data(
        'token' => token,
        'mode' => mode,
        'includes' => includes,
        'f' => 'json')

      response = send_request(request)

      validate_response(response)
    end

    def upgrade_livingatlas(group_ids)
      Chef::Log.info("Upgrading Living Atlas...")

      request = Net::HTTP::Post.new(URI.parse(@portal_url +
        "/portaladmin/system/content/livingatlas/upgrade").request_uri)

      request.add_field('Referer', 'referer')

      token = generate_token(@generate_token_url)

      group_ids.each do |group_id|
        request.set_form_data(
          'token' => token,
          'groupId' => group_id,
          'f' => 'json')

        response = send_request(request)

        validate_response(response)
      end
    end

    def create_site(admin_email,
                    admin_full_name,
                    admin_description,
                    security_question,
                    security_question_answer,
                    content_store,
                    user_license_type_id,
                    license_file)
      create_site_uri = URI.parse(@portal_url + '/portaladmin/createNewSite')

      request = Net::HTTP::Post::Multipart.new(
        create_site_uri.path,
        'username' => @admin_username,
        'password' => @admin_password,
        'email' => admin_email,
        'fullname' => admin_full_name,
        'description' => admin_description,
        'securityQuestion' => security_question,
        'securityQuestionAns' => security_question_answer,
        'contentStore' => content_store,
        'userLicenseTypeId' => user_license_type_id,
        'file' => UploadIO.new(File.new(license_file),
                                'application/json',
                                File.basename(license_file)),
        'f' => 'json')

      response = send_request(request, true)

      validate_response(response)
    end

    def join_site(machine_admin_url)
      join_site_uri = URI.parse(@portal_url + '/portaladmin/joinSite')

      request = Net::HTTP::Post.new(join_site_uri.request_uri)

      request.set_form_data('username' => @admin_username,
                            'password' => @admin_password,
                            'machineAdminUrl' => machine_admin_url,
                            'f' => 'json')

      response = send_request(request, true)

      validate_response(response)
    end

    def machines
      token = generate_token(@generate_token_url)

      uri = URI.parse(@portal_url + "/portaladmin/machines")

      uri.query = URI.encode_www_form('token' => token, 'f' => 'json')

      request = Net::HTTP::Get.new(uri.request_uri)

      request.add_field('Referer', 'referer')

      response = send_request(request)

      validate_response(response)

      JSON.parse(response.body)['machines']
    end

    # Select the machine name that corresponds to the local machine IP address
    # from the list of machines returned by /portaladmin/machines call.
    def local_machine_name
      # Get local IP addresses as an array.
      local_ip_addresses = Socket.ip_address_list

      machines.each do |machine|
        if local_ip_addresses.any? { |a| a.ip_address == Addrinfo.ip(machine['machineName']).ip_address }
          return machine['machineName']
        end
      end

      # None of the portal machines have local IP addresses. Return the first machine name.
      machines[0]['machineName']
    end

    # Returns portal admin API URL for SSL certificates.
    # Before Portal for ArcGIS 10.8 the SSL certificates are configured per site.
    # Starting from Portal for ArcGIS 10.8 the SSL certificates are configured per machine.
    def ssl_certificates_url
      url = @portal_url + "/portaladmin/machines/#{local_machine_name}/sslCertificates"

      token = generate_token(@generate_token_url)

      uri = URI.parse(url)
      uri.query = URI.encode_www_form('token' => token, 'f' => 'json')

      request = Net::HTTP::Get.new(uri.request_uri)
      request.add_field('Referer', 'referer')

      validate_response(send_request(request))

      url
    rescue Exception
      @portal_url + '/portaladmin/security/sslCertificates'
    end

    def unregister_machine(machine_name)
      request = Net::HTTP::Post.new(URI.parse(@portal_url +
        "/portaladmin/machines/unregister").request_uri)

      request.add_field('Referer', 'referer')

      token = generate_token(@generate_token_url)

      request.set_form_data(
        'machineName' => machine_name,
        'token' => token,
        'f' => 'json')

      response = send_request(request)

      validate_response(response)
    end

    def ssl_certificate_exist?(cert_alias)
      token = generate_token(@generate_token_url)

      uri = URI.parse(ssl_certificates_url + "/#{cert_alias}")

      request = Net::HTTP::Get.new(uri.request_uri)

      request.add_field('Referer', 'referer')

      request.set_form_data('token' => token, 'f' => 'json')

      response = send_request(request)

      validate_response(response)

      ['PrivateKeyEntry', 'trustedCertEntry'].include?(JSON.parse(response.body)['entryType'])
    rescue Exception
      false
    end

    def import_server_ssl_certificate(cert_file, cert_password, cert_alias)
      begin
        require 'net/http/post/multipart'
      rescue LoadError
        Chef::Log.error("Missing gem 'multipart-post'. Use the 'system' recipe to install it first.")
      end

      url = URI.parse(ssl_certificates_url + "/importExistingServerCertificate")

      token = generate_token(@generate_token_url)

      request = Net::HTTP::Post::Multipart.new(url.path,
        'file' => UploadIO.new(File.new(cert_file), 'application/x-pkcs12', cert_alias),
        'password' => cert_password,
        'alias' => cert_alias,
        'token' => token,
        'f' => 'json')

      request.add_field('Referer', 'referer')

      response = send_request(request, true)

      if response.code.to_i == 200
        error_info = JSON.parse(response.body)
        raise error_info['error']['message'] unless error_info['error'].nil?
      end
    end

    def ssl_certificates
      token = generate_token(@generate_token_url)

      uri = URI.parse(ssl_certificates_url)

      uri.query = URI.encode_www_form('token' => token, 'f' => 'json')

      request = Net::HTTP::Get.new(uri.request_uri)

      request.add_field('Referer', 'referer')

      response = send_request(request)

      JSON.parse(response.body)
    end

    def server_ssl_certificate
      ssl_certificates['webServerCertificateAlias']
    end

    def set_server_ssl_certificate(cert_alias)
      certs = ssl_certificates

      request = Net::HTTP::Post.new(URI.parse(ssl_certificates_url + "/update").request_uri)

      request.add_field('Referer', 'referer')

      token = generate_token(@generate_token_url)

      hsts_enabled = certs['HSTSEnabled'].nil? ? false : certs['HSTSEnabled']

      request.set_form_data(
        'webServerCertificateAlias' => cert_alias,
        'sslProtocols' => certs['sslProtocols'],
        'cipherSuites' => certs['cipherSuites'],
        'HSTSEnabled' => hsts_enabled,
        'token' => token,
        'f' => 'json')

      response = send_request(request)

      validate_response(response)
    end

    def content_dir
      token = generate_token(@generate_token_url)

      content_directory_uri = URI.parse(@portal_url + '/portaladmin/system/directories/content')

      content_directory_uri.query = URI.encode_www_form('token' => token,
                                                        'f' => 'json')

      request = Net::HTTP::Get.new(content_directory_uri.request_uri)
      request.add_field('Referer', 'referer')

      response = send_request(request)

      validate_response(response)

      JSON.parse(response.body)['physicalPath']
    end

    def set_content_dir(content_dir)
      token = generate_token(@generate_token_url)

      request = Net::HTTP::Post.new(URI.parse(
        @portal_url + '/portaladmin/system/directories/content/edit').request_uri)
      request.add_field('Referer', 'referer')

      request.set_form_data('token' => token,
                            'physicalPath' => content_dir,
                            'description' => 'The content directory.',
                            'f' => 'json')

      response = send_request(request)

      validate_response(response)
    end

    def servers
      uri = URI.parse(@portal_url + '/sharing/rest/portals/self/servers/')

      token = generate_token(@generate_token_url)

      uri.query = URI.encode_www_form('token' => token,
                                      'f' => 'json')

      request = Net::HTTP::Get.new(uri.request_uri)
      request.add_field('Referer', 'referer')

      response = send_request(request)

      validate_response(response)

      JSON.parse(response.body)['servers']
    end

    def register_server(server_name, server_url, admin_url, is_hosted, server_type)
      token = generate_token(@generate_token_url)

      request = Net::HTTP::Post.new(URI.parse(
        @portal_url + '/sharing/rest/portals/self/servers/register').request_uri)
      request.add_field('Referer', 'referer')

      request.set_form_data('token' => token,
                            'name' => server_name,
                            'url' => server_url,
                            'adminUrl' => admin_url,
                            'isHosted' => is_hosted,
                            'serverType' => server_type,
                            'f' => 'json')

      response = send_request(request)

      validate_response(response)

      JSON.parse(response.body)
    end

    def federate_server(server_url, admin_url, username, password)
      token = generate_token(@generate_token_url)

      request = Net::HTTP::Post.new(URI.parse(
        @portal_url + '/portaladmin/federation/servers/federate').request_uri)
      request.add_field('Referer', 'referer')

      request.set_form_data('token' => token,
                            'url' => server_url,
                            'adminUrl' => admin_url,
                            'username' => username,
                            'password' => password,
                            'f' => 'json')

      response = send_request(request, true)

      validate_response(response)

      JSON.parse(response.body)['serverId']
    end

    def unfederate_server(server_id, force = true)
      token = generate_token(@generate_token_url)

      request = Net::HTTP::Post.new(URI.parse(@portal_url +
        "/portaladmin/federation/servers/#{server_id}/unfederate").request_uri)
      request.add_field('Referer', 'referer')

      request.set_form_data('token' => token,
                            'forceUnfederate' => force,
                            'f' => 'json')

      response = send_request(request)

      validate_response(response)
    end

    def update_server(server_id, server_role, function)
      token = generate_token(@generate_token_url)

      request = Net::HTTP::Post.new(URI.parse(@portal_url +
        "/portaladmin/federation/servers/#{server_id}/update").request_uri)
      request.add_field('Referer', 'referer')

      request.set_form_data('token' => token,
                            'serverRole' => server_role,
                            'serverFunction' => function,
                            'f' => 'json')

      response = send_request(request)

      validate_response(response)

      JSON.parse(response.body)['serverId']
    end

    def system_properties
      uri = URI.parse(@portal_url + '/portaladmin/system/properties')

      token = generate_token(@generate_token_url)

      uri.query = URI.encode_www_form('token' => token,
                                      'f' => 'json')

      request = Net::HTTP::Get.new(uri.request_uri)
      request.add_field('Referer', 'referer')

      response = send_request(request)

      validate_response(response)

      JSON.parse(response.body)
    end

    def update_system_properties(system_properties)
      return if system_properties.empty?

      request = Net::HTTP::Post.new(URI.parse(
        @portal_url + '/portaladmin/system/properties/update').request_uri)

      request.add_field('Referer', 'referer')

      token = generate_token(@generate_token_url)

      request.set_form_data('token' => token,
                            'properties' => system_properties.to_json,
                            'f' => 'json')

      response = send_request(request)

      validate_response(response)
    end

    def set_allssl(allssl)
      token = generate_token(@generate_token_url)

      request = Net::HTTP::Post.new(URI.parse(
        @portal_url + '/sharing/rest/portals/self/update').request_uri)
      request.add_field('Referer', 'referer')

      request.set_form_data('token' => token,
                            'allSSL' => allssl,
                            'f' => 'json')

      response = send_request(request)

      validate_response(response)

      JSON.parse(response.body)
    end

    def webadaptors_shared_key
      uri = URI.parse(@portal_url + '/portaladmin/system/webadaptors/config/')

      token = generate_token(@generate_token_url)

      uri.query = URI.encode_www_form('token' => token,
                                      'f' => 'json')

      request = Net::HTTP::Get.new(uri.request_uri)
      request.add_field('Referer', 'referer')

      response = send_request(request)

      validate_response(response)

      JSON.parse(response.body)['sharedKey']
    end

    def update_webadaptors_shared_key(shared_key)
      request = Net::HTTP::Post.new(URI.parse(
        @portal_url + '/portaladmin/system/webadaptors/config/update').request_uri)
      request.add_field('Referer', 'referer')

      token = generate_token(@generate_token_url)

      web_adaptors_config = { 'sharedKey' => shared_key }

      request.set_form_data('webAdaptorsConfig' => web_adaptors_config.to_json,
                            'token' => token,
                            'f' => 'json')

      response = send_request(request)

      validate_response(response)
    end

    def generate_token(generate_token_url)
      request = Net::HTTP::Post.new(URI.parse(generate_token_url).request_uri)

      request.set_form_data('username' => @admin_username,
                            'password' => @admin_password,
                            'client' => 'referer',
                            'referer' => 'referer',
                            'expiration' => '600',
                            'f' => 'json')

      response = send_request(request, true)

      validate_response(response)

      JSON.parse(response.body)['token']
    end

    def edit_log_settings(log_level, log_dir, max_log_file_age)
      request = Net::HTTP::Post.new(URI.parse(
        @portal_url + '/portaladmin/logs/settings/edit').request_uri)

      request.add_field('Referer', 'referer')

      token = generate_token(@generate_token_url)

      request.set_form_data('logLevel' => log_level,
                            'logDir' => log_dir,
                            'maxLogFileAge' => max_log_file_age,
                            'token' => token,
                            'f' => 'json')

      response = send_request(request)

      validate_response(response)
    end

    def set_identity_store(user_store_config, role_store_config)
      request = Net::HTTP::Post.new(URI.parse(@portal_url + '/portaladmin/security/config/updateIdentityStore').request_uri)

      request.add_field('Referer', 'referer')

      token = generate_token(@generate_token_url)

      request.set_form_data('userStoreConfig' => user_store_config.to_json,
                            'groupStoreConfig' => role_store_config.to_json,
                            'token' => token,
                            'f' => 'json')

      response = send_request(request)

      validate_response(response)
    end

    def add_root_cert(cert_location, cert_alias, norestart)
      begin
        require 'net/http/post/multipart'
      rescue LoadError
        Chef::Log.error("Missing gem 'multipart-post'. Use the 'system' recipe to install it first.")
      end

      url = URI.parse(ssl_certificates_url + "/importRootOrIntermediate")
      token = generate_token(@generate_token_url)

      request = Net::HTTP::Post::Multipart.new(url.path,
        'file' => UploadIO.new(cert_location, 'application/x-x509-ca-cert'),
        'alias' => cert_alias,
        'norestart' => norestart,
        'token' => token,
        'f' => 'json')

      request.add_field('Referer', 'referer')

      response = send_request(request)

      if response.code.to_i == 200
        error_info = JSON.parse(response.body)
        raise error_info['error']['message'] unless error_info['error'].nil?
      end
    end

    def is_user_type_licensing
      uri = URI.parse(@portal_url + '/portaladmin/')

      uri.query = URI.encode_www_form('f' => 'json')

      request = Net::HTTP::Get.new(uri.request_uri)
      request.add_field('Referer', 'referer')

      response = send_request(request)

      if response.code.to_i == 200
        error_info = JSON.parse(response.body)
        unless error_info['error'].nil?
          if error_info['error']['code'] == 499 # token required
            # Try again with a token
            token = generate_token(@generate_token_url)

            uri.query = URI.encode_www_form('token' => token,
                                            'f' => 'json')

            request = Net::HTTP::Get.new(uri.request_uri)
            request.add_field('Referer', 'referer')

            response = send_request(request)
          else
            return false
          end
        end
      end

      JSON.parse(response.body)['isUserTypeLicensing']
    end

    def validate_license(license_file)
      begin
        require 'net/http/post/multipart'
      rescue LoadError
        Chef::Log.error("Missing gem 'multipart-post'. Use the 'system' recipe to install it first.")
      end

      uri = URI.parse(@portal_url + '/portaladmin/license/validateLicense')

      request = Net::HTTP::Post::Multipart.new(uri.path,
        'file' => UploadIO.new(File.new(license_file),
                               'application/json',
                               File.basename(license_file)),
        'f' => 'json')

      request.add_field('Referer', 'referer')

      response = send_request(request)

      if response.code.to_i == 200
        error_info = JSON.parse(response.body)
        if !error_info['error'].nil? 
          if error_info['error']['code'] == 499 # token required
            # Try again with a token
            token = generate_token(@generate_token_url)

            request = Net::HTTP::Post::Multipart.new(uri.path,
              'file' => UploadIO.new(File.new(license_file),
                                     'application/json',
                                     File.basename(license_file)),
              'token' => token,
              'f' => 'json')

            request.add_field('Referer', 'referer')

            response = send_request(request)
          else
            raise error_info['error']['message'] unless error_info['error'].nil?
          end
        end
      end

      JSON.parse(response.body)
    end

    def populate_license
      request = Net::HTTP::Post.new(URI.parse(@portal_url + '/portaladmin/license/populateLicense').request_uri)

      request.add_field('Referer', 'referer')

      token = generate_token(@generate_token_url)

      request.set_form_data('token' => token,
                            'f' => 'json')

      response = send_request(request)

      validate_response(response)
    end

    private

    def send_request(request, sensitive = false)
      uri = URI.parse(@portal_url)

      http = Net::HTTP.new(uri.host, uri.port)
      http.read_timeout = READ_TIMEOUT

      if uri.scheme == 'https'
        http.use_ssl = true
        http.verify_mode = OpenSSL::SSL::VERIFY_NONE
      end

      Chef::Log.debug("Request: #{request.method} #{uri.scheme}://#{uri.host}:#{uri.port}#{request.path}")

      if sensitive
        Chef::Log.debug("Request body was not logged because it contains sensitive information.") 
      else
        Chef::Log.debug(request.body) unless request.body.nil?
      end

      response = http.request(request)

      if [301, 302].include? response.code.to_i
        Chef::Log.debug("Moved to: #{response.header['location']}")

        uri = URI.parse(response.header['location'])

        http = Net::HTTP.new(uri.host, uri.port)
        http.read_timeout = READ_TIMEOUT

        if uri.scheme == 'https'
          http.use_ssl = true
          http.verify_mode = OpenSSL::SSL::VERIFY_NONE
        end

        if request.method == 'POST'
          body = request.body
          request = Net::HTTP::Post.new(URI.parse(response.header['location']).request_uri)
          request.body = (body)
        else
          request = Net::HTTP::Get.new(URI.parse(response.header['location']).request_uri)
        end

        request.add_field('Referer', 'referer')

        response = http.request(request)
      end

      Chef::Log.debug("Response: #{response.code} #{response.body}")

      response
    end

    def validate_response(response)
      if response.code.to_i >= 300
        raise response.message
      elsif response.code.to_i == 200
        error_info = JSON.parse(response.body)
        raise error_info['error']['message'] unless error_info['error'].nil?
        error_info
      end
    end
  end
end
