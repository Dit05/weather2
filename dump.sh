#!/bin/bash

# A head azért van, hogy a dump dátumát feltűntető sor ne legyen.
sudo -u mysql mariadb-dump weather | head -n -1 > db-dump.sql
