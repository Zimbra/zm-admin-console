# 
# ***** BEGIN LICENSE BLOCK *****
# Zimbra Collaboration Suite Server
# Copyright (C) 2020 Synacor, Inc.
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software Foundation,
# version 2 of the License.
#
# This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
# without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
# See the GNU General Public License for more details.
# You should have received a copy of the GNU General Public License along with this program.
# If not, see <https://www.gnu.org/licenses/>.
# ***** END LICENSE BLOCK *****
# 

FROM busybox

WORKDIR root

# copy zimbraAdmin in webapps
COPY build/dist/jetty/webapps/zimbraAdmin.war /opt/zimbra/jetty_base/webapps/zimbraAdmin/
RUN unzip /opt/zimbra/jetty_base/webapps/zimbraAdmin/zimbraAdmin.war -d /opt/zimbra/jetty_base/webapps/zimbraAdmin/ && rm /opt/zimbra/jetty_base/webapps/zimbraAdmin/zimbraAdmin.war
COPY WebRoot/WEB-INF/jetty-env.xml /opt/zimbra/jetty_base/etc/zimbraAdmin-jetty-env.xml.in
COPY WebRoot/templates/* /opt/zimbra/conf/templates/admin/
COPY build/web.xml /opt/zimbra/jetty_base/etc/zimbraAdmin.web.xml.in

# https://stackoverflow.com/questions/47081507/why-does-rewriting-a-file-with-envsubst-file-file-leave-it-empty?rq=1
RUN cd /opt/zimbra/jetty_base/etc/ && cat zimbraAdmin.web.xml.in | sed -e '/REDIRECTBEGIN/ s/\$/ %%comment VAR:zimbraMailMode,-->,redirect%%/' -e '/REDIRECTEND/ s/^/%%comment VAR:zimbraMailMode,<!--,redirect%% /' > zimbraAdmin.web.xml.in.tmp
RUN cd /opt/zimbra/jetty_base/etc/ && mv zimbraAdmin.web.xml.in.tmp zimbraAdmin.web.xml.in