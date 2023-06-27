# java_properties-cookbook

A library cookbook that provides a resource that knows how to manipulate Java properties files. 

## Supported Platforms

   * Windows 
   * Linux

## Usage

This cookbook is available on the public supermarket.

Depend on the `java_properties` cookbook in your cookbook's metadata.rb file
 
`depends 'java_properties'`

### java_properties resource

Example usage:

If the properties file already exists, this resource will merge the properties you set with the properties
contained in the file. Duplicate entries will be overwritten by properties you have set.

If the properties file does not exist, it will be created with the properties you set.

```
java_properties '<properties_file>' do
  # This can be set explicitly or just using the resource name
  properties_file '/tmp/java.properties'
  
  # You can use the 'property' directive to set properties
  property 'key1', 'value1'
  property 'key2', 'value2'
  
  # You can pass an explicit hash of properties
  properties {:key1 => 'value1', :key2 => 'value2'}
  
  # You can use the attribute name as the key dynamically
  key1 'value1'
  key2 'value2'
end
```

## License and Authors

Author:: Ryan Larson (ryan.mango.larson@gmail.com)
