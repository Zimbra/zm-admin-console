FROM busybox

WORKDIR root
# copy zimbraAdmin in webapps
COPY build/dist/jetty/webapps/zimbraAdmin.war /opt/zimbra/jetty_base/webapps/zimbraAdmin/
COPY WebRoot/WEB-INF/jetty-env.xml /opt/zimbra/jetty_base/etc/zimbraAdmin-jetty-env.xml.in
COPY WebRoot/templates/* /opt/zimbra/conf/templates/admin/
