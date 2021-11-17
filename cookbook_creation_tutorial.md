# How to create cookbooks
mkdir cookbooks
chef generate cookbook cookbooks/workstation
chef generate recipe cookbooks/workstation nameofrecipe

chef exec ruby -c cookbooks/workstation/recipes/nameofrecipe.rb