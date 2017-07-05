## Steps to build & deploy.

 - ant admin-prod-deploy

## Dependencies
- zm-timezones
- zm-admin-ajax
- zm-taglib
- zm-soap
- zm-store
- zm-client
- zm-common
- ThirdParty Jars

## Build Pre-requisite
- create .zcs-deps folder in home directory
- clone zimbra-package-stub at same level: git clone https://github.com/Zimbra/zimbra-package-stub.git 
- clone zm-zcs at same level: git clone ssh://git@stash.corp.synacor.com:7999/zimbra/zm-zcs.git 
- clone zm-timezones & zm-admin-ajax.
- zm-admin-ajax is built already.
- copy following jars in the .zcs-deps folder:
    - ant-contrib-1.0b1.jar

NOTE: zmmailboxdctl restart will be triggered after deploying zm-admin-console instance (jetty restarts after ant admin-prod-deploy.