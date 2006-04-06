/*
 * ***** BEGIN LICENSE BLOCK *****
 * Version: ZPL 1.1
 * 
 * The contents of this file are subject to the Zimbra Public License
 * Version 1.1 ("License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://www.zimbra.com/license
 * 
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
 * the License for the specific language governing rights and limitations
 * under the License.
 * 
 * The Original Code is: Zimbra Collaboration Suite Web Client
 * 
 * The Initial Developer of the Original Code is Zimbra, Inc.
 * Portions created by Zimbra are Copyright (C) 2005 Zimbra, Inc.
 * All Rights Reserved.
 * 
 * Contributor(s):
 * 
 * ***** END LICENSE BLOCK *****
 */

/**
* @class ZaStatus 
* @contructor ZaStatus
* @param app
* @author Greg Solovyev
**/
function ZaStatus(app) {
	ZaItem.call(this, app, "ZaStatus");
	this._init(app);	
}

ZaStatus.prototype = new ZaItem;
ZaStatus.prototype.constructor = ZaStatus;
ZaItem.loadMethods["ZaStatus"] = new Array();
ZaItem.initMethods["ZaStatus"] = new Array();

ZaStatus.A_server = "server";
ZaStatus.A_service = "service";
ZaStatus.A_timestamp = "t";
ZaStatus.PRFX_Server = "status_server";
ZaStatus.PRFX_Service = "status_service";
ZaStatus.PRFX_Time = "status_time";
ZaStatus.PRFX_Status = "status_status";

ZaStatus.loadMethod = 
function() {
	/*
	var soapDoc = AjxSoapDoc.create("GetServiceStatusRequest", "urn:zimbraAdmin", null);
	var resp = ZmCsfeCommand.invoke(soapDoc, null, null, null, true).firstChild;
	this.initFromDom(resp);
	*/
	
	var soapDoc = AjxSoapDoc.create("GetServiceStatusRequest", "urn:zimbraAdmin", null);	
	var resp = null;
	var targetServer = null ;	
	var serverNo = ZaServer.servers.length ;
	//send request to the targetServer as ZaServer.monitorHost
	if (ZaServer.monitorHost != null && ZaServer.monitorHost.id ){
		try {
			targetServer = ZaServer.monitorHost.id ;		
			resp = ZmCsfeCommand.invoke(soapDoc, null, null, targetServer, true).firstChild;
			this.initFromDom(resp);
		} catch (ex) {
			this._app.getStatusViewController()._handleException(ex, "ZaStatus.loadMethod:"+targetServer, null, false);		
		}
	} else if (serverNo > 0 ){//send request to the targetServer one by one
		for (var i =0; i < serverNo; i++){
			try {
				targetServer = ZaServer.servers[i].id ;			
				resp = ZmCsfeCommand.invoke(soapDoc, null, null, targetServer, true).firstChild;
				this.initFromDom(resp);
			} catch (ex) {
				this._app.getStatusViewController()._handleException(ex, "ZaStatus.loadMethod:"+ZaServer.servers[i].id, null, false);		
			}
		}	
	}
	
	/* TODO: use the JSON request in the future
	var soapDoc = AjxSoapDoc.create("GetServiceStatusRequest", "urn:zimbraAdmin", null);
	var getServiceCommand = new ZmCsfeCommand();
	var params = new Object();
	params.soapDoc = soapDoc;	
	var resp = null;
	this.attrs = new Object();
	
	var serverNo = ZaServer.servers.length ;
	//send request to the targetServer as ZaServer.monitorHost
	if (ZaServer.monitorHost != null && ZaServer.monitorHost.id ){
		params.targetServer = ZaServer.monitorHost.id ;		
		resp = getServiceCommand.invoke(params).Body.GetServiceStatusResponse;
		//this.initFromJS(resp.calresource[0]);
	}else if (serverNo > 0 ){//send request to the targetServer one by one
		for (var i =0; i < serverNo; i++){
			params.targetServer = ZaServer.servers[i].id ;			
			resp = getServiceCommand.invoke(params).Body.GetServiceStatusResponse;
			//this.initFromJS(resp.calresource[0]);
		}	
	} */	
}

ZaItem.loadMethods["ZaStatus"].push(ZaStatus.loadMethod);

ZaStatus.initMethod = function (app) {
	this.serverMap = new Object();
	this.statusVector = new AjxVector();
}
ZaItem.initMethods["ZaStatus"].push(ZaStatus.initMethod);

ZaStatus.prototype.initFromDom =
function (node) {
	var children = node.childNodes;
	var cnt = children.length;
	var formatter = AjxDateFormat.getDateTimeInstance(AjxDateFormat.MEDIUM, AjxDateFormat.SHORT);
	for (var i=0; i< cnt;  i++) {
		var child = children[i];
		var serverName = child.getAttribute(ZaStatus.A_server);
		if(serverName) {
			if(!this.serverMap[serverName]) {
				this.serverMap[serverName] = new Object();
				this.serverMap[serverName].name = serverName;
				this.serverMap[serverName].serviceMap = null;
				this.serverMap[serverName].status = 1;
				this.statusVector.add(this.serverMap[serverName]);
			}
			var serviceName = child.getAttribute(ZaStatus.A_service);
			if(serviceName) {

				if(!this.serverMap[serverName].serviceMap)
					this.serverMap[serverName].serviceMap = new Object();
					
				this.serverMap[serverName].serviceMap[serviceName] = new Object();
				this.serverMap[serverName].serviceMap[serviceName].status = child.firstChild.nodeValue;
				var timestamp = child.getAttribute(ZaStatus.A_timestamp);
				this.serverMap[serverName].serviceMap[serviceName].time = formatter.format(new Date(Number(timestamp)*1000));
				if(this.serverMap[serverName].serviceMap[serviceName].status != 1) {
					this.serverMap[serverName].status = 0;
				}
			}
		}
		
	}
}

ZaStatus.prototype.getStatusVector = 
function() {
	return this.statusVector;
}

ZaStatus.compare = function (a,b) {
	return (a.serverName < b.serverName)? -1: ((a.serverName > b.serverName)? 1: 0);
};
