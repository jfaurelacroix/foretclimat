# This adds the gems that we package with the cookbook to the load path so they
# can be required.
$:.unshift *Dir[File.expand_path('../../files/default/vendor/gems/**/lib', __FILE__)]
require 'chef/resource'
require 'java-properties'

# This is implemented as a HWRP so we can take advantage of
# method missing for assigning key=value where key is the
# attribute name and value is the attribute value.
class Chef
  class Resource
    class JavaProperties < Chef::Resource

      def initialize(name, run_context=nil)
        super
        @resource_name = :java_properties
        @provider = Chef::Provider::JavaProperties
        @action = :merge
        @allowed_actions = [@action]
        @properties_file = name
        @properties_from_attributes = Hash.new
      end

      # This allows us to define attributes dynamically
      # as attributes on the resource
      def method_missing(name, *args)
        @properties_from_attributes[name.to_sym] = args[0].to_s
      end

      # add a property with key, value
      def property(key, value)
        @properties_from_attributes[key.to_sym] = value
      end

      # add a hash of properties
      def properties(hash)
        @properties_from_attributes.merge!(ensure_all_hash_keys_are_symbols(hash))
      end

      def properties_file(file=nil)
        if file.nil?
          @properties_file
        else
          @properties_file = file.to_s
        end
      end

      def properties_from_file
        if ::File.exist?(@properties_file)
          ensure_all_hash_keys_are_symbols(::JavaProperties.load(@properties_file))
        else
          Hash.new
        end
      end

      def properties_from_attributes
        ensure_all_hash_keys_are_symbols(@properties_from_attributes)
      end

      def ensure_all_hash_keys_are_symbols(hash)
        Hash[hash.map { |(k, v)| [k.to_sym, v] }]
      end
    end
  end

  class Provider
    class JavaProperties < Chef::Provider::LWRPBase
      def load_current_resource
        @current_resource ||= Chef::Resource::JavaProperties.new(new_resource.name)
        @current_resource.properties_file(new_resource.properties_file)
        @current_resource
      end

      def whyrun_supported?
        true
      end

      def action_merge
        current_properties = @current_resource.properties_from_file
        new_properties = new_resource.properties_from_attributes
        merged = current_properties.merge(new_properties)

        if merged != current_properties
          converge_by("Writing properties #{merged} to file #{new_resource.properties_file}") do
            file new_resource.properties_file do
              action :create
              content ::JavaProperties.generate(merged)
            end
          end
        else
          Chef::Log.info 'Skipping writing of properties file because the file already contains the new properties'
        end
      end
    end
  end
end
