#!/bin/bash

VOLUMES=(
  "zabbix_mysql_data"
  "mongodb_data"
  "graylog-datanode"
  "graylog_data"
  "graylog_journal"
)

if ! command -v docker &> /dev/null
then
    echo "Error: Docker is not installed or not in the PATH."
    exit 1
fi

create_volumes() {
    echo "--- Starting Volume Creation ---"
    for vol in "${VOLUMES[@]}"; do
        if docker volume inspect "$vol" &> /dev/null; then
            echo " [SKIP] Volume '$vol' already exists."
        else
            docker volume create "$vol" > /dev/null
            echo " [OK]   Volume '$vol' created."
        fi
    done
    echo "--- Done ---"
}

remove_volumes() {
    echo "--- Starting Volume Removal ---"
    for vol in "${VOLUMES[@]}"; do
        # Check if volume exists before trying to remove
        if docker volume inspect "$vol" &> /dev/null; then
            # Attempt to remove and capture errors (e.g., if volume is in use)
            if docker volume rm "$vol" &> /dev/null; then
                echo " [DEL]  Volume '$vol' removed."
            else
                echo " [ERR]  Could not remove '$vol' (It might be in use by a container)."
            fi
        else
            echo " [SKIP] Volume '$vol' does not exist."
        fi
    done
    echo "--- Done ---"
}

if [[ "$1" == "--remove" ]]; then
    remove_volumes
else
    create_volumes
fi