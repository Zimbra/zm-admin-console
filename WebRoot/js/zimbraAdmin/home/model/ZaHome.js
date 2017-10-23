/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
 *
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at: https://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15
 * have been added to cover use of software over a computer network and provide for limited attribution
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * See the License for the specific language governing rights and limitations under the License.
 * The Original Code is Zimbra Open Source Web Client.
 * The Initial Developer of the Original Code is Zimbra, Inc.  All rights to the Original Code were
 * transferred by Zimbra, Inc. to Synacor, Inc. on September 14, 2015.
 *
 * All portions of the code are Copyright (C) 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
/**
 * Created by IntelliJ IDEA.
 * User: mingzhang
 * Date: 8/29/11
 * Time: 9:37 PM
 * To change this template use File | Settings | File Templates.
 */
ZaHome = function() {
	ZaItem.call(this,"ZaHome");
	this._init();
}
ZaItem.loadMethods["ZaHome"] = new Array();
ZaItem.initMethods["ZaHome"] = new Array();
ZaHome.postLoadDataFunction = new Array();

ZaHome.prototype = new ZaItem;
ZaHome.prototype.constructor = ZaHome;

ZaHome.A2_version= "version";
ZaHome.A2_account = "account";
ZaHome.A2_serverNum = "serverNum";
ZaHome.A2_accountNum = "accountNum";
ZaHome.A2_cosNum = "cosNum";
ZaHome.A2_domainNum = "domainNum";
ZaHome.A2_lastCleanup = "lastCleanup";
ZaHome.A2_lastCleanupTime = "lastCleanupTime";
ZaHome.A2_lastLogPurge = "lastLogPurge";
ZaHome.A2_lastLogPurgeTime = "lastLogPurgeTime";
ZaHome.A2_DBCheckType = "dbCheckType";
ZaHome.A2_DBCheckMessage= "dbCheckMessage";
ZaHome.A2_serviceStatus = "serviceStatus";
ZaHome.A2_serviceStatusMessage = "serviceStatusMessage";
ZaHome.A2_serviceDetailedMessage = "serviceDetailedMessage";
ZaHome.A2_activeSession = "activeSession";
ZaHome.A2_queueLength = "queueLength";
ZaHome.A2_messageCount = "messageCount";
ZaHome.A2_messageVolume = "messageVolume";

ZaHome.A2_showWarningPanel = "showWarningPanel";
ZaHome.A2_maintenanceItemNum = "maintenanceItemNum";
ZaHome.initMethod = function () {
	this.attrs = new Object();
	this.type = ZaItem.HOME;
}
ZaItem.initMethods["ZaHome"].push(ZaHome.initMethod);

// Fake here no soap request, just collect all kinds of information everywhere
ZaHome.loadMethod =
function () {
    var now = new Date();
    var formatter = AjxDateFormat.getDateInstance(AjxDateFormat.LONG);
    var currentTime = formatter.format(now);
    this.attrs[ZaHome.A2_account] = ZaZimbraAdmin.currentAdminAccount.attrs.mail;
    this.attrs[ZaHome.A2_version] = ZaServerVersionInfo.version;

    this.attrs[ZaHome.A2_accountNum] = ZaMsg.MSG_HomeLoading;
    this.attrs[ZaHome.A2_cosNum] = ZaMsg.MSG_HomeLoading;
    this.attrs[ZaHome.A2_domainNum] = ZaMsg.MSG_HomeLoading;
    this.attrs[ZaHome.A2_serverNum] = ZaMsg.MSG_HomeLoading;
    this.attrs[ZaHome.A2_activeSession] = ZaMsg.MSG_HomeLoading;

    this.attrs[ZaHome.A2_lastCleanup] = true;
    this.attrs[ZaHome.A2_lastCleanupTime] = currentTime;
    this.attrs[ZaHome.A2_lastLogPurge] = true;
    this.attrs[ZaHome.A2_lastLogPurgeTime] = currentTime;
    this.attrs[ZaHome.A2_DBCheckType] = true;
    this.attrs[ZaHome.A2_DBCheckMessage] = ZaMsg.LBL_HomeStatusOK;
    this.attrs[ZaHome.A2_serviceStatusMessage] = ZaMsg.MSG_HomeLoading;
    this.attrs[ZaHome.A2_serviceDetailedMessage] = ZaMsg.MSG_HomeLoading;
    this.attrs[ZaHome.A2_queueLength] = ZaMsg.MSG_HomeLoading;
    this.attrs[ZaHome.A2_messageCount] = "120/h";
    this.attrs[ZaHome.A2_messageVolume] = "34MB/h";

    this.attrs[ZaHome.A2_showWarningPanel] = false;
    this.attrs[ZaHome.A2_maintenanceItemNum] = 1;
}
ZaItem.loadMethods["ZaHome"].push(ZaHome.loadMethod);

ZaHome.updateMaintenanceNum = function() {
    var num = 1;
    try {
        var homeCtl = ZaApp.getInstance().getHomeViewController();
        var maintainenceGroup = homeCtl._view._localXForm.getItemsById("maintenance_grp");
        num = maintainenceGroup[0].items.length;
    } catch (ex) {

    }
    ZaApp.getInstance().getHomeViewController().setInstanceValue(num, ZaHome.A2_maintenanceItemNum);
}

ZaHome.postLoadDataFunction.push(ZaHome.updateMaintenanceNum);

ZaHome.accountStatCallback = function(accountStat) {
	ZaApp.getInstance().getHomeViewController().setInstanceValue(accountStat[ZaItem.ACCOUNT], ZaHome.A2_accountNum);
}

ZaHome.loadAccountNum = function() {
	var callback =  new AjxCallback(ZaHome.accountStatCallback);
	ZaSearch.getObjectCounts([ZaItem.ACCOUNT],callback);
}
ZaHome.postLoadDataFunction.push(ZaHome.loadAccountNum);

ZaHome.loadServerServerNum = function() {
    var soapDoc = AjxSoapDoc.create("GetAllServersRequest", ZaZimbraAdmin.URN, null);
	soapDoc.getMethod().setAttribute("applyConfig", "false");
//	var command = new ZmCsfeCommand();
    var updateServerNum = new AjxCallback(this, this.updateServerNum);
	var params = new Object();
	params.soapDoc = soapDoc;
	params.asyncMode = true;
    params.callback = updateServerNum;
	var reqMgrParams = {
		controller : ZaApp.getInstance().getCurrentController(),
		busyMsg : ZaMsg.BUSY_GET_ALL_SERVER
	}
	var resp = ZaRequestMgr.invoke(params, reqMgrParams);
	return resp;
}

ZaHome.postLoadDataFunction.push(ZaHome.loadServerServerNum);

ZaHome.prototype.updateServerNum = function(resp) {
    var num = 1;
    try {
        var resp = resp.getResponse().Body.GetAllServersResponse;
        var list = new ZaItemList(ZaServer);
        list.loadFromJS(resp);
        num = list.size();
    } catch (ex) {

    }
    ZaApp.getInstance().getHomeViewController().setInstanceValue(num, ZaHome.A2_serverNum);
}

ZaHome.loadDomainNum = function() {
    var callback = function(domainList) {
        ZaApp.getInstance().getHomeViewController().setInstanceValue(domainList.size(), ZaHome.A2_domainNum);
    }
    try {
        ZaApp.getInstance().getDomainList(true, {asyncMode: true, callback: callback});
    } catch (ex) {
    }
}
ZaHome.postLoadDataFunction.push(ZaHome.loadDomainNum);

ZaHome.loadCosNum = function() {
	var callback = function(cosList) {
		ZaApp.getInstance().getHomeViewController().setInstanceValue(cosList.size(), ZaHome.A2_cosNum);
	};
	try {
		ZaApp.getInstance().getCosList(true, callback);
	} catch (ex) {

	}
};

ZaHome.postLoadDataFunction.push(ZaHome.loadCosNum);

ZaHome.prototype.updateCosNum = function(resp) {
    var num = 1;
    ZaApp.getInstance().getHomeViewController().setInstanceValue(num, ZaHome.A2_cosNum);
}

ZaHome.loadStatusfo = function () {
    try {
		var logHost = ZaApp.getInstance().getGlobalConfig().attrs[ZaServer.A_zimbraLogHostname];
		//if zimbraLogHostname is set
		if (logHost) {
			var soapDoc = AjxSoapDoc.create("GetServiceStatusRequest", ZaZimbraAdmin.URN, null);
            var updateServiceStatus = new AjxCallback(this, this.updateServiceStatus);
			var command = new ZmCsfeCommand();
			var params = new Object();
			params.soapDoc = soapDoc;
            params.asyncMode = true;
            params.noAuthToken = true;
            params.callback = updateServiceStatus;
			command.invoke(params);
		} else {
            this.updateServiceStatus();
        }
    } catch (ex) {
        this.attrs[ZaHome.A2_serviceStatusMessage] = ZaMsg.LBL_HOmeStatusUnknown ;
        this.attrs[ZaHome.A2_serviceDetailedMessage] = ZaMsg.LBL_HomeDetailedServiceUnknown;
    }
}
ZaHome.postLoadDataFunction.push(ZaHome.loadStatusfo);

ZaHome.prototype.updateServiceStatus = function (resp) {
    var status = new ZaStatus();
    if (resp) {
        resp = resp.getResponse().Body.GetServiceStatusResponse;
        status.initFromJS(resp);
    }
    var serviceStatus;
    var serviceStatusMessage = ZaMsg.LBL_HOmeStatusUnknown;
    var serviceDetailedMessage = ZaMsg.LBL_HomeDetailedServiceUnknown;
    try {
        var statusVector = status.getStatusVector();
        var serverStatus;
        if (statusVector.size() > 0) {
            serviceStatus = true;
            serviceStatusMessage = ZaMsg.LBL_HomeStatusRunning ;
            for(var i = 0; i < statusVector.size(); i++) {
                serverStatus = statusVector.get(i);
                if (serverStatus.status != 1) {
                    serviceStatus = false;
                    serviceStatusMessage= ZaMsg.LBL_HomeStatusFailed;
                    serviceDetailedMessage = ZaMsg.LBL_HomeDetailedServiceNotRunning;
                    break;
                }
            }
        }
    } catch (ex) {
    }
    var viewController = ZaApp.getInstance().getHomeViewController();
    viewController.setInstanceValue(serviceStatus, ZaHome.A2_serviceStatus);
    viewController.setInstanceValue(serviceStatusMessage, ZaHome.A2_serviceStatusMessage);
    viewController.setInstanceValue(serviceDetailedMessage, ZaHome.A2_serviceDetailedMessage);
    if (serviceStatus != true && ZaHomeXFormView.showStatusInfo()) {
        viewController.showWarningPanel();
    }
}

ZaHome.startLoadingSessions = function() {
	ZaHome.totalSession = 0;
	var callback = new AjxCallback(this,ZaHome.startLoadingSessionsCallback);
	ZaApp.getInstance().getMailServers(false, callback);
}
ZaHome.postLoadDataFunction.push(ZaHome.startLoadingSessions);

ZaHome.startLoadingSessionsCallback = function(resp) {
	if(resp.getResponse() && resp.getResponse().Body && resp.getResponse().Body.GetAllServersResponse) {
		var list = new ZaItemList(ZaServer);
		list.loadFromJS(resp.getResponse().Body.GetAllServersResponse);
		var serverArray = list.getArray();
		for(var i=0;i<serverArray.length;i++) {
			var server = serverArray[i];
			var callback = new AjxCallback(this,ZaHome.loadActiveSession,server);
			server.loadEffectiveRights("id", server.id, true,callback);
		}
	}
}


ZaHome.totalSession = 0;
ZaHome.loadActiveSession = function (server,rightsResp) {
	if(rightsResp && rightsResp.getResponse() && rightsResp.getResponse().Body && rightsResp.getResponse().Body.GetEffectiveRightsResponse && server) {
		
		server.initEffectiveRightsFromJS(rightsResp.getResponse().Body.GetEffectiveRightsResponse);

        var sessionType = ["soap", "admin", "imap"];
        for (var j = 0 ; j < sessionType.length; j ++) {
            if (ZaItem.hasRight(ZaServer.RIGHT_GET_SESSIONS, server)) {
                var sessionCallback = new  AjxCallback (this, ZaHome.loadOneSessionNumer);
                try {
                    var soapDoc = AjxSoapDoc.create("GetSessionsRequest", ZaZimbraAdmin.URN, null);
                    var params = {};
                    params.type = sessionType[j];

                    soapDoc.getMethod().setAttribute("type", params.type);

                    params.fresh = 1;
                    soapDoc.getMethod().setAttribute("refresh", params.fresh);

                    soapDoc.getMethod().setAttribute("limit", ZaServerSessionStatsPage.PAGE_LIMIT);

                    params.offset = 0 ;

                    soapDoc.getMethod().setAttribute("offset", params.offset);

                    params.sortBy = "nameAsc";

                    soapDoc.getMethod().setAttribute("sortBy", params.sortBy);

                    var getSessCmd = new ZmCsfeCommand ();
                    params.soapDoc = soapDoc ;
                    params.asyncMode = true;
                    params.noAuthToken = true;
                    params.callback = sessionCallback;

                    var resp = getSessCmd.invoke(params);
                } catch (ex) {
                    sessionCallback.run();
                }
            }
        }
    }
}

ZaHome.loadOneSessionNumer = function (resp) {
    if(resp && resp.getException && !resp.getException()) {
        resp = resp.getResponse();
        if (resp && resp.Body && resp.Body.GetSessionsResponse) {
            var sessionStats = resp.Body.GetSessionsResponse;
            ZaHome.totalSession += sessionStats.total;
        }
    }
    this.updateSessionNum(ZaHome.totalSession);
}

ZaHome.prototype.updateSessionNum = function(num) {
    ZaApp.getInstance().getHomeViewController().setInstanceValue(num, ZaHome.A2_activeSession);
}

ZaHome.startLoadingMTAS = function() {
	ZaHome.totalSession = 0;
	var postQList = ZaApp.getInstance().getPostQList();
	if (postQList) {
		var serverArray = postQList.getArray();
		for(var i = 0; i < serverArray.length; i++) {
			var server = serverArray[i];
			var callback = ZaHome.loadQueueLength.bind(this, server);
			server.loadEffectiveRights("id", server.id, true, callback);
		}
	}
}
ZaHome.postLoadDataFunction.push(ZaHome.startLoadingMTAS);

ZaHome.totalQueueLength = 0;
ZaHome.loadQueueLength = function (server,rightsResp) {
	if(rightsResp && rightsResp.getResponse() && rightsResp.getResponse().Body && rightsResp.getResponse().Body.GetEffectiveRightsResponse && server) {
		
		server.initEffectiveRightsFromJS(rightsResp.getResponse().Body.GetEffectiveRightsResponse);
		if(ZaItem.hasRight(ZaServer.MANAGE_MAIL_QUEUE_RIGHT, server)) {
            var isEx = false;
            var queueLengthCallback = new AjxCallback(this, ZaHome.loadOneQueueNumber);
            try {
                var soapDoc = AjxSoapDoc.create("GetMailQueueInfoRequest", ZaZimbraAdmin.URN, null);
                var attr = soapDoc.set("server", "");
                attr.setAttribute("name", server.name);
                var command = new ZmCsfeCommand();
                var params = new Object();
                params.soapDoc = soapDoc ;
                params.asyncMode = true;
                params.noAuthToken = true;
                params.callback = queueLengthCallback;
                command.invoke(params);
            } catch (ex) {
            	//
            }
        }
    } 
}

ZaHome.loadOneQueueNumber = function (resp) {
    if(resp && resp.getException && !resp.getException()) {
    	resp = resp.getResponse();
        var body = resp.Body;
        if(body && body.GetMailQueueInfoResponse.server && body.GetMailQueueInfoResponse.server[0]) {
            var queue =  body.GetMailQueueInfoResponse.server[0].queue;
            for ( var j in queue) {
                if (queue[j].n) {
                	ZaHome.totalQueueLength += parseInt(queue[j].n);
                }
            }
        }
    }
    this.updateQueueLength(ZaHome.totalQueueLength);
}
ZaHome.prototype.updateQueueLength = function(queueLength) {
    ZaApp.getInstance().getHomeViewController().setInstanceValue(queueLength, ZaHome.A2_queueLength);
}

ZaHome.prototype.schedulePostLoading = function () {
    // Don't disturbe the home view rendering process, when view is realy, start to update data.
    var act = new AjxTimedAction(this, ZaHome.prototype.startPostLoading);
	AjxTimedAction.scheduleAction(act, 100);
}

ZaHome.prototype.startPostLoading = function () {
    for (var i = 0; i < ZaHome.postLoadDataFunction.length; i++) {
        ZaHome.postLoadDataFunction[i].call(this);
    }
}

ZaHome.myXModel = {
    items: [
        {id:ZaHome.A2_version,type:_STRING_,  ref:"attrs/" + ZaHome.A2_version},
    	{id:ZaHome.A2_account,type:_STRING_, ref:"attrs/" + ZaHome.A2_account},
    	{id:ZaHome.A2_domainNum,type:_STRING_, ref:"attrs/" + ZaHome.A2_domainNum},
    	{id:ZaHome.A2_cosNum,type:_STRING_, ref:"attrs/" + ZaHome.A2_cosNum},
    	{id:ZaHome.A2_serverNum,type:_STRING_, ref:"attrs/" + ZaHome.A2_serverNum},
    	{id:ZaHome.A2_accountNum,type:_STRING_, ref:"attrs/" + ZaHome.A2_accountNum},
        {id:ZaHome.A2_lastCleanupTime, type:_STRING_, ref: "attrs/" + ZaHome.A2_lastCleanupTime},
        {id:ZaHome.A2_lastCleanup, type:_ENUM_, ref: "attrs/" + ZaHome.A2_lastCleanupTime, choices: ZaModel.BOOLEAN_CHOICES},
        {id:ZaHome.A2_lastLogPurgeTime, type:_STRING_, ref: "attrs/" + ZaHome.A2_lastLogPurgeTime},
        {id:ZaHome.A2_lastLogPurge, type:_ENUM_, ref: "attrs/" + ZaHome.A2_lastLogPurge, choices: ZaModel.BOOLEAN_CHOICES},
        {id:ZaHome.A2_DBCheckMessage, type:_STRING_, ref: "attrs/" + ZaHome.A2_DBCheckMessage},
        {id:ZaHome.A2_DBCheckType, type:_ENUM_, ref: "attrs/" + ZaHome.A2_DBCheckType, choices: ZaModel.BOOLEAN_CHOICES},
        {id:ZaHome.A2_serviceStatusMessage, type:_STRING_, ref: "attrs/" + ZaHome.A2_serviceStatusMessage},
        {id:ZaHome.A2_serviceDetailedMessage, type:_STRING_, ref: "attrs/" + ZaHome.A2_serviceDetailedMessage},
        {id:ZaHome.A2_serviceStatus, type:_ENUM_, ref: "attrs/" + ZaHome.A2_serviceStatus, choices: ZaModel.BOOLEAN_CHOICES},
        {id:ZaHome.A2_activeSession, type:_STRING_, ref:"attrs/" + ZaHome.A2_activeSession},
        {id:ZaHome.A2_queueLength, type:_STRING_, ref:"attrs/" + ZaHome.A2_queueLength},
        {id:ZaHome.A2_messageCount, type:_NUMBER_, ref:"attrs/" + ZaHome.A2_messageCount},
        {id:ZaHome.A2_messageVolume, type:_NUMBER_, ref:"attrs/" + ZaHome.A2_messageVolume},
        {id:ZaHome.A2_showWarningPanel, type:_ENUM_, ref:"attrs/" + ZaHome.A2_showWarningPanel, choices: ZaModel.BOOLEAN_CHOICES1},
        {id:ZaHome.A2_maintenanceItemNum, type:_NUMBER_, ref:"attrs/" + ZaHome.A2_maintenanceItemNum}
    ]
}

