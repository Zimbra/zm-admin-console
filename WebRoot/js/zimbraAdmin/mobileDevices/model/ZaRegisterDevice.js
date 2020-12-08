/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @author Madhav Dhuppe
 **/
ZaRegisterDevice =
function(name, id, lifetime, type) {
    this.id = id;
    this.name = name;

    console.log(name,id,'ZaRegisterDeviceZaRegisterDevice');
    // if (!lifetime) {
    //     this.lifetime = "1d";
    // } else {
    //     var number = lifetime.substr(0, lifetime.length - 1);
    //     if (number % ZaRegisterDevice.YEAR == 0) {
    //         this.lifetime = (number / ZaRegisterDevice.YEAR)  "y";
    //     } else if (number % ZaRegisterDevice.MONTH == 0) {
    //         this.lifetime = (number / ZaRegisterDevice.MONTH)  "m";
    //     } else if (number % ZaRegisterDevice.WEEK == 0) {
    //         this.lifetime = (number / ZaRegisterDevice.WEEK)  "w";
    //     } else {
    //         this.lifetime = lifetime;
    //     }
    // }
    // this.type = type ? type: ZaRegisterDevice.TYPE_KEEP;
}

ZaRegisterDevice.prototype = new ZaItem;
ZaRegisterDevice.prototype.constructor = ZaRegisterDevice;

ZaRegisterDevice.prototype.toString =
function() {
    return this.name;
}

// ZaRegisterDevice.prototype.toDays = function () {
//     var number = this.lifetime.substr(0, this.lifetime.length - 1);
//     var unit = this.lifetime.substr(this.lifetime.length - 1, 1);
//     if (unit == "y") {
    
//         return number * ZaRegisterDevice.YEAR  "d";
//     }
//     if (unit == "m") {
//         return number * ZaRegisterDevice.MONTH  "d";
//     }
//     if (unit == "w") {
//         return number * ZaRegisterDevice.WEEK  "d";
//     }
//     return this.lifetime;
// }

ZaRegisterDevice.RD_Email_Address = "emailAddress";
ZaRegisterDevice.RD_Last_Login = "lastUsedDate";
ZaRegisterDevice.RD_Device_OS = "os";
ZaRegisterDevice.RD_Device_ID = "id";
ZaRegisterDevice.RD_Status = "status";
ZaRegisterDevice.RD_EAS_PROTOCOL = "protocol";
ZaRegisterDevice.RD_Server = "server";
ZaRegisterDevice.RD_Mailbox_Id = "mailboxId";



// ZaRegisterDevice.myXModel = {
//     items:[
//         {id:ZaRegisterDevice.A2_id, type:_STRING_, ref:ZaRegisterDevice.A2_id},
//         {id:ZaRegisterDevice.A2_name, type:_STRING_, ref:ZaRegisterDevice.A2_name, required:true},
//         {id:ZaRegisterDevice.A2_lifetime, type:_MLIFETIME_, ref:ZaRegisterDevice.A2_lifetime, minInclusive: 1},
//         {id:ZaRegisterDevice.A2_type, type:_STRING_, ref:ZaRegisterDevice.A2_type}
//     ]
// }

// BUSY_QUARANTINE_SYNC_DEVICES = Quarantining synced devices ...
// BUSY_RESUMING_SYNC_DEVICES = Resuming synced devices ...
// BUSY_REMOVING_SYNC_DEVICES = Removing synced devices ...
// BUSY_RESETING_SYNC_DEVICES = Reseting synced devices ...
// BUSY_WIPING_SYNC_DEVICES = Wiping synced devices ...


ZaRegisterDevice.getRegisteredDevices =
function(by, val) {

    return [
        {"id":"androidc1628606379","type":"Android","ua":"Android-Mail/2020.11.01.342354497.Release","protocol":"14.1","model":"ONEPLUS A5000","friendly_name":"ONEPLUS A5000","os":"Android 7.1.1","server":"zmc-mailbox","provisionable":true,"status":2,"firstReqReceived":1606805217,"lastPolicyUpdate":1607345937,"lastUsedDate":"2020-12-07","mailboxId":3,"emailAddress":"admin@zmc.com"},
        {"id":"androidc521192406","type":"Android","ua":"Android-Mail/2020.11.01.342354497.Release","protocol":"14.1","model":"Redmi Note 7 Pro","friendly_name":"Redmi Note 7 Pro","os":"Android 10","server":"zmc-mailbox","provisionable":true,"status":1,"firstReqReceived":1607339601,"lastPolicyUpdate":1607344751,"lastUsedDate":"2020-12-07","mailboxId":3,"emailAddress":"admin@zmc.com"}
    ]
    var soapDoc = AjxSoapDoc.create("GetDeviceStatusRequest",ZaZimbraAdmin.URN, null);

    if (by && val) {
        var el = soapDoc.set("cos", val);
        el.setAttribute("by", by);
    }

    var params = new Object();
    params.soapDoc = soapDoc;

    try{
        var reqMgrParams = {
            controller : ZaApp.getInstance().getCurrentController(),
            busyMsg : ZaMsg.BUSY_GETTING_SYNC_DEVICES
        };

        var resp = ZaRequestMgr.invoke(params, reqMgrParams).Body.GetDeviceStatusResponse.device;
        console.log(resp,'ssssssssss');
        return resp;
    } catch(ex) {
        throw ex;
        return null;
    }
}


ZaRegisterDevice.quarantineDevice = function(obj) {
    var soapDoc = AjxSoapDoc.create("QuarantineDeviceRequest",ZaZimbraAdmin.URN, null);

    for (var i = 0; i < obj.length; i++) {
        var current = obj[i];
        var device = soapDoc.set("device", null, null);
        device.setAttribute("id", current.id);
    }    
    
    var params = new Object();
    params.soapDoc = soapDoc;

    try{
        var reqMgrParams = {
            controller : ZaApp.getInstance().getCurrentController(),
            busyMsg : ZaMsg.BUSY_QUARANTINE_SYNC_DEVICES
        };

        var resp = ZaRequestMgr.invoke(params, reqMgrParams).Body.GetDeviceStatusResponse;
        console.log(resp,'ssssssssss');
        return resp;
    } catch(ex) {
        throw ex;
        return null;
    }
}

ZaRegisterDevice.removeDevice = function(obj) {
    var soapDoc = AjxSoapDoc.create("RemoveDeviceRequest",ZaZimbraAdmin.URN, null);

    for (var i = 0; i < obj.length; i++) {
        var current = obj[i];
        var device = soapDoc.set("device", null, null);
        device.setAttribute("id", current.id);
    }    
    
    var params = new Object();
    params.soapDoc = soapDoc;

    try{
        var reqMgrParams = {
            controller : ZaApp.getInstance().getCurrentController(),
            busyMsg : ZaMsg.BUSY_REMOVING_SYNC_DEVICES
        };

        var resp = ZaRequestMgr.invoke(params, reqMgrParams).Body.GetDeviceStatusResponse;
        return resp;
    } catch(ex) {
        throw ex;
        return null;
    }
}

ZaRegisterDevice.allowDeviceSync = function(obj) {
    var soapDoc = AjxSoapDoc.create("AllowDeviceRequest",ZaZimbraAdmin.URN, null);

    for (var i = 0; i < obj.length; i++) {
        var current = obj[i];
        var device = soapDoc.set("device", null, null);
        device.setAttribute("id", current.id);
    }    
    
    var params = new Object();
    params.soapDoc = soapDoc;

    try{
        var reqMgrParams = {
            controller : ZaApp.getInstance().getCurrentController(),
            busyMsg : ZaMsg.BUSY_RESUMING_SYNC_DEVICES
        };

        var resp = ZaRequestMgr.invoke(params, reqMgrParams).Body.GetDeviceStatusResponse;
        return resp;
    } catch(ex) {
        throw ex;
        return null;
    }
}

ZaRegisterDevice.wipeDevice = function(obj) {
    var soapDoc = AjxSoapDoc.create("RemoteWipeRequest",ZaZimbraAdmin.URN, null);

    for (var i = 0; i < obj.length; i++) {
        var current = obj[i];
        var device = soapDoc.set("device", null, null);
        device.setAttribute("id", current.id);
    }
    
    var params = new Object();
    params.soapDoc = soapDoc;

    try{
        var reqMgrParams = {
            controller : ZaApp.getInstance().getCurrentController(),
            busyMsg : ZaMsg.BUSY_WIPING_SYNC_DEVICES
        };

        var resp = ZaRequestMgr.invoke(params, reqMgrParams).Body.GetDeviceStatusResponse;
        return resp;
    } catch(ex) {
        throw ex;
        return null;
    }
}