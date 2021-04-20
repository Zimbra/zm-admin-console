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
ZaRegisterDevice.RD_Mailbox_Id = "mailboxId";
ZaRegisterDevice.MONTH = 31;
ZaRegisterDevice.RD_BT_REMOVE = 'remove';
ZaRegisterDevice.RD_BT_SUSPEND = 'suspend';
ZaRegisterDevice.RD_BT_RESUME = 'resume';
ZaRegisterDevice.RD_BT_WIPE = 'wipe';
ZaRegisterDevice.RD_BT_WIPE_CANCEL = 'wipeCancel';
ZaRegisterDevice.RD_BT_REMOVE_ACCOUNT = 'removeAccount';
ZaRegisterDevice.RD_BT_REMOVE_ACCOUNT_CANCEL = 'removeAccountCancel';
ZaRegisterDevice.RD_BT_BLOCK = 'block';

ZaRegisterDevice.ST_NEEDS_PROVISIONING = 0;
ZaRegisterDevice.ST_ACTIVE = 1;
ZaRegisterDevice.ST_SUSPENDED = 2;
ZaRegisterDevice.ST_WIPE_PENDING = 3;
ZaRegisterDevice.ST_WIPE_COMPLETED = 4;
ZaRegisterDevice.ST_BLOCKED = 5;
ZaRegisterDevice.ST_REMOVE_ACCOUNT_PENDING = 6;
ZaRegisterDevice.ST_REMOVE_ACCOUNT_COMPLETED = 7;

ZaRegisterDevice.SYNC_REQUEST = 'Request';
ZaRegisterDevice.SYNC_RESPONSE = 'Response';

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
    return ZaRegisterDevice.getRegisteredDevices(value);
}

ZaRegisterDevice.getRegisteredDevices =
function(optParamValue) {
    var soapDoc = AjxSoapDoc.create("GetDeviceStatusRequest",ZaZimbraAdmin.URN, null);

    if (optParamValue) {
        var account = soapDoc.set("account", optParamValue);
        account.setAttribute("by", "name");
        const convertedDate = new Date(optParamValue);
        let statusValue = parseInt(optParamValue);

        if (convertedDate !== "Invalid Date" && !isNaN(convertedDate)){
            soapDoc.set("deviceLastUsed", convertedDate.toISOString().split('T')[0]);
        } else {
            var device = soapDoc.set("device", optParamValue);
            device.setAttribute("by", "id");

            // Try to get device status (should be integer) from the input string provided by user.
            if (statusValue !== 0 && !statusValue) {
                const localStringArray = [ZaMsg.MB_Waiting.toLowerCase(), ZaMsg.MB_Active.toLowerCase(), ZaMsg.MB_Suspended.toLowerCase(), ZaMsg.MB_Wipe_ACK.toLowerCase(), ZaMsg.MB_Wipe_Comp.toLowerCase(), ZaMsg.MB_Blocked.toLowerCase(), ZaMsg.MB_Remove_Account_ACK.toLowerCase(), ZaMsg.MB_Remove_Account_Comp.toLowerCase()];
                const indexOfParam = localStringArray.indexOf(optParamValue.toLowerCase());

                if (indexOfParam === -1) {
                    const engStringArray = ["waiting for device", "active", "suspended", "wipe pending","wipe completed", "blocked", "remove account pending", "account removed"];
                    statusValue = engStringArray.indexOf(optParamValue.toLowerCase());
                } else {
                    statusValue = indexOfParam;
                }
            }
        }

        if (statusValue >= 0 && statusValue <= 5) {
            soapDoc.set("status", statusValue);
        }

        soapDoc.set("deviceName", optParamValue);
        soapDoc.set("deviceType", optParamValue);
        soapDoc.set("deviceSyncVersion", optParamValue);
        soapDoc.set("filterDevicesByAnd", false);
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

ZaRegisterDevice.processSyncRequest = function(operation, obj) {
    let request, busyMsg;
    
    switch (operation) {
        case ZaRegisterDevice.RD_BT_REMOVE:
            request = "RemoveDevice";
            busyMsg = ZaMsg.BUSY_REMOVING_SYNC_DEVICES;
            break;

        case ZaRegisterDevice.RD_BT_SUSPEND:
            request = "QuarantineDevice";
            busyMsg = ZaMsg.BUSY_QUARANTINE_SYNC_DEVICES;
            break;
            
        case ZaRegisterDevice.RD_BT_RESUME:
            request = "AllowDevice";
            busyMsg = ZaMsg.BUSY_RESUMING_SYNC_DEVICES;
            break;
            
        case ZaRegisterDevice.RD_BT_WIPE:
            request = "RemoteWipe";
            busyMsg = ZaMsg.BUSY_WIPING_SYNC_DEVICES;
            break;

        case ZaRegisterDevice.RD_BT_WIPE_CANCEL: 
            request = "CancelPendingRemoteWipe";
            busyMsg = ZaMsg.BUSY_CANCELLING_WIPE;
            break;

        case ZaRegisterDevice.RD_BT_BLOCK: 
            request = "BlockDevice";
            busyMsg = ZaMsg.BUSY_BLOCKING_SYNC_DEVICES;
            break;

        case ZaRegisterDevice.RD_BT_REMOVE_ACCOUNT: 
            request = "AccountOnlyRemoteWipe";
            busyMsg = ZaMsg.BUSY_REMOVING_SYNC_ACCOUNT;
            break;

        case ZaRegisterDevice.RD_BT_REMOVE_ACCOUNT_CANCEL: 
            request = "CancelPendingAccountOnlyRemoteWipe";
            busyMsg = ZaMsg.BUSY_CANCELLING_ACCOUNT_WIPE;
            break;
    }

    var soapDoc = AjxSoapDoc.create(request.concat(ZaRegisterDevice.SYNC_REQUEST),ZaZimbraAdmin.URN, null);

    var device = soapDoc.set("device", null, null);
    device.setAttribute("id", obj.id);

    var account = soapDoc.set("account", obj[ZaRegisterDevice.RD_Email_Address]);
    account.setAttribute("by", "name");

    var params = new Object();
    params.soapDoc = soapDoc;

    try{
        var reqMgrParams = {
            controller : ZaApp.getInstance().getCurrentController(),
            busyMsg : busyMsg
        };

        if(operation === ZaRegisterDevice.RD_BT_REMOVE) {
            return ZaRequestMgr.invoke(params, reqMgrParams).Body[request.concat(ZaRegisterDevice.SYNC_RESPONSE)];
        }

        return ZaRequestMgr.invoke(params, reqMgrParams).Body[request.concat(ZaRegisterDevice.SYNC_RESPONSE)].device;
    } catch(ex) {
        throw ex;
    }
}