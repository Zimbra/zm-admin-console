#!/bin/bash

#echo "**** Fixing up the permission ****"
#/opt/zimbra/libexec/zmfixperms

# This is only required in 8.8 patches, for 8.9 this code is already moved to /opt/zimbra/libexec/zmfixperms script
if [ -d /opt/zimbra/conf/templates/ ]; then
  chmod -R 755 /opt/zimbra/conf/templates
  chown -R zimbra:zimbra /opt/zimbra/conf/templates
fi
if lsattr -d /path/to/directory | grep -q 'i'; then
    echo "Immutable attribute already set on the /opt/zimbra/jetty_base/webapps/ (zimbra-mbox-admin-console-war)"
else
        echo "**** apply restrict write access for /opt/zimbra/jetty_base/webapps/ (zimbra-mbox-admin-console-war)****"
        chattr +i -R /opt/zimbra/jetty_base/webapps/
fi
