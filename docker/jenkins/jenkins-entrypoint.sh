#!/bin/bash
set -e

echo "Fixing permissions for Jenkins_home..."
sudo chown -R jenkins:jenkins /var/jenkins_home

# Change the ownership of the Docker socket using sudo
if [ -S /var/run/docker.sock ]; then
    sudo chown root:docker /var/run/docker.sock
fi

# Execute the main container command
exec "$@"