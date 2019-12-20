FROM busybox

# copy zimbraAdmin in webapps
COPY  build/zimbraAdmin/ /opt/zimbra/jetty_base/webapps/zimbraAdmin/
