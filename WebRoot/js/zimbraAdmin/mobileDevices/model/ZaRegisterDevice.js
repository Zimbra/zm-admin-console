/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2012, 2013, 2014, 2016, 2020 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2012, 2013, 2014, 2016, 2020 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @author Madhav Dhuppe
 **/
ZaRegisterDevice =
function(name, id) {
    this.id = id;
    this.name = name;
}

ZaRegisterDevice.prototype = new ZaItem;
ZaRegisterDevice.prototype.constructor = ZaRegisterDevice;

ZaRegisterDevice.prototype.toString =
function() {
    return this.name;
}

ZaRegisterDevice.RD_Email_Address = "emailAddress";
ZaRegisterDevice.RD_Last_Login = "lastUsedDate";
ZaRegisterDevice.RD_Device_OS = "os";
ZaRegisterDevice.RD_Device_Name = "friendly_name";
ZaRegisterDevice.RD_Device_ID = "id";
ZaRegisterDevice.RD_Status = "status";
ZaRegisterDevice.RD_EAS_PROTOCOL = "protocol";
ZaRegisterDevice.RD_Server = "server";
ZaRegisterDevice.RD_Mailbox_Id = "mailboxId";
ZaRegisterDevice.MONTH = 31;

ZaRegisterDevice.getDateDifference = function(lastUsedDate) {
    var lUsedDate = new Date(lastUsedDate);
    const diffTime = Math.abs(new Date() - lUsedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays > ZaRegisterDevice.MONTH) {
        return AjxMessageFormat.format(lastUsedDate);
    }

    return AjxMessageFormat.format(ZaMsg["TTL_Retention_Policy_d"], diffDays);
}

ZaRegisterDevice.getFilteredDevices = function (value) {
    return ZaRegisterDevice.getRegisteredDevices("name", value);
}

ZaRegisterDevice.getRegisteredDevices =
function(by, val) {
    var soapDoc = AjxSoapDoc.create("GetDeviceStatusRequest",ZaZimbraAdmin.URN, null);

    if (by && val) {
       var account = soapDoc.set("account", val);
        account.setAttribute("by", by);
    }

    var params = new Object();
    params.soapDoc = soapDoc;

    try{
        var reqMgrParams = {
            controller : ZaApp.getInstance().getCurrentController(),
            busyMsg : ZaMsg.BUSY_GETTING_SYNC_DEVICES
        };

        return ZaRequestMgr.invoke(params, reqMgrParams).Body.GetDeviceStatusResponse.device;
    } catch(ex) {
        throw ex;
        return null;
    }
}

ZaRegisterDevice.quarantineDevice = function(obj) {
    var soapDoc = AjxSoapDoc.create("QuarantineDeviceRequest",ZaZimbraAdmin.URN, null);

    var device = soapDoc.set("device", null, null);
    device.setAttribute("id", obj.id);
    
    var account = soapDoc.set("account", obj[ZaRegisterDevice.RD_Email_Address]);
    account.setAttribute("by", "name");

    var params = new Object();
    params.soapDoc = soapDoc;

    try{
        var reqMgrParams = {
            controller : ZaApp.getInstance().getCurrentController(),
            busyMsg : ZaMsg.BUSY_QUARANTINE_SYNC_DEVICES
        };

        return ZaRequestMgr.invoke(params, reqMgrParams).Body.QuarantineDeviceResponse.device;
    } catch(ex) {
        throw ex;
        return null;
    }
}

ZaRegisterDevice.removeDevice = function(obj) {
    var soapDoc = AjxSoapDoc.create("RemoveDeviceRequest",ZaZimbraAdmin.URN, null);

    var device = soapDoc.set("device", null, null);
    device.setAttribute("id", obj.id);
    
    var account = soapDoc.set("account", obj[ZaRegisterDevice.RD_Email_Address]);
    account.setAttribute("by", "name");
    
    var params = new Object();
    params.soapDoc = soapDoc;

    try{
        var reqMgrParams = {
            controller : ZaApp.getInstance().getCurrentController(),
            busyMsg : ZaMsg.BUSY_REMOVING_SYNC_DEVICES
        };

        ZaRequestMgr.invoke(params, reqMgrParams).Body.RemoveDeviceResponse;

    } catch(ex) {
        throw ex;
        return null;
    }
}

ZaRegisterDevice.allowDeviceSync = function(obj) {
    var soapDoc = AjxSoapDoc.create("AllowDeviceRequest",ZaZimbraAdmin.URN, null);

    var device = soapDoc.set("device", null, null);
    device.setAttribute("id", obj.id);
    
    var account = soapDoc.set("account", obj[ZaRegisterDevice.RD_Email_Address]);
    account.setAttribute("by", "name");
    
    var params = new Object();
    params.soapDoc = soapDoc;

    try{
        var reqMgrParams = {
            controller : ZaApp.getInstance().getCurrentController(),
            busyMsg : ZaMsg.BUSY_RESUMING_SYNC_DEVICES
        };

        return ZaRequestMgr.invoke(params, reqMgrParams).Body.AllowDeviceResponse.device;
    } catch(ex) {
        throw ex;
        return null;
    }
}

ZaRegisterDevice.wipeDevice = function(obj) {
    var soapDoc = AjxSoapDoc.create("RemoteWipeRequest",ZaZimbraAdmin.URN, null);

    var device = soapDoc.set("device", null, null);
    device.setAttribute("id", obj.id);
    
    var account = soapDoc.set("account", obj[ZaRegisterDevice.RD_Email_Address]);
    account.setAttribute("by", "name");
    
    var params = new Object();
    params.soapDoc = soapDoc;

    try{
        var reqMgrParams = {
            controller : ZaApp.getInstance().getCurrentController(),
            busyMsg : ZaMsg.BUSY_WIPING_SYNC_DEVICES
        };

        return ZaRequestMgr.invoke(params, reqMgrParams).Body.RemoteWipeResponse.device;
    } catch(ex) {
        throw ex;
        return null;
    }
}