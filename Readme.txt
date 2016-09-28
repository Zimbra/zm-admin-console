Steps to build & deploy.

ant admin-prod-deploy


Build Pre-requisite
	•	create .zcs-deps folder in home directory
	•	clone zimbra-package-stub at same level: git clone https://github.com/Zimbra/zimbra-package-stub.git
	•	clone zm-zcs at same level: git clone ssh://git@stash.corp.synacor.com:7999/zimbra/zm-zcs.git
	•	clone zm-ajax and zm-timezones.
	•	zm-ajax is built already.
	•	copy following jars in the .zcs-deps folder:
	◦	ant-contrib-1.0b1.jar
	•	copy folowing jars in /opt/zimbra/lib/jars/ (Some are required for compilation & others for war packaging.)
	◦	commons-cli-1.2.jar
	◦	gifencoder.jar
	◦	zimbraajax.jar
	◦	zimbrataglib.jar
	◦	zimbrasoap.jar
	◦	zimbrastore.jar
	◦	zimbraclient.jar
	◦	zimbracommon.jar
	◦	gmbal-api-only-2.2.6.jar
	◦	jaxb-api-2.2.6.jar
	◦	jaxb-impl-2.2.6.jar
	◦	jaxws-api-2.2.6.jar
	◦	jaxws-rt-2.2.6.jar
	◦	jsr181-api-2.2.6.jar
	◦	policy-2.2.6.jar
	◦	stax-ex-2.2.6.jar
	◦	streambuffer-2.2.6.jar
NOTE: Assumed jetty will be started manually while deploying zm-admin-console instance.