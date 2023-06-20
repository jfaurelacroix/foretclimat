# These are some custom chefspec matchers. Users of this cookbook should
# use these matchers to unit test their cookbooks.

if defined?(ChefSpec)
  ChefSpec.define_matcher(:java_properties)

  def merge_java_properties(resource)
    ChefSpec::Matchers::ResourceMatcher.new(:java_properties, :merge, resource)
  end
end
