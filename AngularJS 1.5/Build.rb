#!/usr/bin/env ruby
require 'optparse'
require 'json'

# default options:
options = {lines: false, verbose: false}

OptionParser.new do |opts|
  # banner and separator are the usage description showed with '--help' or '-h'
  opts.banner = 'Usage: build.rb [options]'
  opts.separator 'Builds the Case-UI node project'
  opts.separator 'Options:'
  # options (switch - true/false)
  opts.on('-r', '--Release', 'Release Build') do |r|
    options[:release] = r
  end
  opts.on('-d', '--Development', 'Development build') do |d|
    options[:development] = d
  end

end.parse!

# Get the package name and find the current version.
#
# @param [String] package_file_name is file that will be parsed for the version number.
# @return [String] version number from the json file.
def get_package_version(package_file_name = 'package.json')
  # Is the file there?
  if File.file?(package_file_name)
    # Suck in the file.
    file = File.read(package_file_name)

    # Parse the file into a hash.
    package_file = JSON.parse(file)

    # Return the value of version.
    return package_file['version']
  else
    # FAIL something went wrong.
    raise Exception.new("File #{package_file_name} was not found. Check the file name.")
  end
end

# Installs the node dependency's.
def npm_install
  puts '#### Start npm install ####'
  `npm install --production`
  puts '#### End npm ####'
  puts '#### install gulp ####'
  `npm install gulp`
  puts '#### End gulp ####'
end

# Installs tsd -> TypeScript Definition manager.


# Deploy to Nexus via Maven.
#
# @note This command requires "isso-settings-clm.xml" to be in the root folder. Since this is run by Jenkins,
# this should not be an issue.
def deploy_maven
  puts '#### Start deploy maven ####'
  # Nexus requires XX.XX.XX.XX version numbers
  compiled_version = get_package_version + '.0'
  output = `mvn -X -B -s isso-settings-clm.xml deploy:deploy-file \
                          -Dpackaging=tar \
                          -Dfile=rule-engine-ui-client.tar \
                          -DgeneratePom=true \
                          -DgroupId=com.capitalone.dsd.ui \
                          -DartifactId=rule-engine-ui-client \
                          -Dversion=#{compiled_version} \
                          -DrepositoryId=nexus \
                          -Durl=https://nexus.kdc.capitalone.com/mother/service/local/staging/deploy/maven2 2>&1`
  puts output
  puts '#### Done deploy maven ####'
end

# Wrapper around the below functions.
def build_dependency
  npm_install
end

# Package up the build and deploy it to Nexus.
def post_build
  puts '### gulp package ###'
  # tar up the files.
  puts `gulp package 2>&1`
  puts '### gulp package done ###'
  deploy_maven
end

# Build the snapshot or development build.
def build_snapshot
  build_dependency
  puts '### dev build ###'
  puts `gulp 2>&1`
  puts '### dev build done ###'
  post_build
end

# Build the release build.
def build_release
  build_dependency
  puts '### release build ###'
  `gulp release`
  puts '### release build done ###'
  post_build
end

# ARGV now contains no options, only file.
if options[:release]
  puts 'Creating Release build.'
  build_release
end

if options[:development]
  puts 'Creating Development build.'
  build_snapshot
end
