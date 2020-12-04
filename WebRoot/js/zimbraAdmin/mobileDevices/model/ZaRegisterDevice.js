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


ZaRegisterDevice.getRegisteredDevices =
function(by, val) {
    var soapDoc = AjxSoapDoc.create("GetDeviceStatusRequest","urn:zimbraAdmin", null);
    if (by && val) {
        var el = soapDoc.set("cos", val);
        el.setAttribute("by", by);
    }

    var params = new Object();
    params.soapDoc = soapDoc;

    try{
        var reqMgrParams = {
            controller : ZaApp.getInstance().getCurrentController(),
            busyMsg : ZaMsg.BUSY_CREATE_RETENTION_POLICIES
        };

        var resp = ZaRequestMgr.invoke(params, reqMgrParams).Body.GetDeviceStatusResponse.device;
        console.log(resp,'ssssssssss');
        return resp;
    } catch(ex) {
        throw ex;
        return null;
    }
}



// ZaRegisterDevice.prototype.createPolicy =
// function(by, val) {
//     var soapDoc = AjxSoapDoc.create("CreateSystemRetentionPolicyRequest","urn:zimbraAdmin", null);
//     if (by && val) {
//         var el = soapDoc.set("cos", val);
//         el.setAttribute("by", by);
//     }

//     if (this[ZaRegisterDevice.A2_type] !== ZaRegisterDevice.TYPE_KEEP &&
//         this[ZaRegisterDevice.A2_type] !== ZaRegisterDevice.TYPE_PURGE){
//          return;
//     }
//     var wrapper = soapDoc.set(this[ZaRegisterDevice.A2_type], null);
//     var policy = soapDoc.set("policy", null, wrapper, "urn:zimbraMail");
//     policy.setAttribute("name", this[ZaRegisterDevice.A2_name]);
//     policy.setAttribute("lifetime", this.toDays());

//     var params = new Object();
//     params.soapDoc = soapDoc;

//     try{
//         var reqMgrParams = {
//             controller : ZaApp.getInstance().getCurrentController(),
//             busyMsg : ZaMsg.BUSY_CREATE_RETENTION_POLICIES
//         };

//         var resp = ZaRequestMgr.invoke(params, reqMgrParams).Body.CreateSystemRetentionPolicyResponse;
//         if( resp.policy && resp.policy[0]) {
//             this.id = resp.policy[0].id;
//         }
//         return this;
//     } catch(ex) {
//         throw ex;
//         return null;
//     }
// }

// ZaRegisterDevice.checkLifeTime = function (lifetime) {
//     if (!lifetime || lifetime.length < 1) {
//         return false;
//     }
//     var digit = lifetime.substr(0, lifetime.length - 1);
//     if (!digit) {
//         return false;
//     }

//     return AjxUtil.isPositiveInt(digit);
// }

// ZaRegisterDevice.checkValues = function (tmpObj, list) {
//     if (!tmpObj) {
//         return false;
//     }

//     var name = AjxStringUtil.trim(tmpObj[ZaRegisterDevice.A2_name]);
//     if (AjxUtil.isEmpty(name)) {
//         ZaApp.getInstance().getCurrentController().popupErrorDialog(ZaMsg.ERROR_EmptyRPName) ;
//         return false;
//     }

//     if (ZaRegisterDevice.POLICY_CUSTOM == name.toLowerCase()) {
//         ZaApp.getInstance().getCurrentController().popupErrorDialog(AjxMessageFormat.format(ZaMsg.ERROR_RPNameCustomDisallowed, [name])) ;
//         return false;
//     }

//     if (!ZaRegisterDevice.checkLifeTime(tmpObj[ZaRegisterDevice.A2_lifetime])) {
//         ZaApp.getInstance().getCurrentController().popupErrorDialog(ZaMsg.ERROR_InvalidRPLifetime);
//         return false;
//     }

//     if (list && AjxUtil.isArray(list)) {
//         for (var i = 0; i < list.length; i) {
//             if (list[i][ZaRegisterDevice.A2_name] == tmpObj[ZaRegisterDevice.A2_name] &&
//                 list[i] != tmpObj) {
//                 ZaApp.getInstance().getCurrentController().popupErrorDialog(AjxMessageFormat.format(ZaMsg.ERROR_RPExists, [tmpObj[ZaRegisterDevice.A2_name]])) ;
//                 return false;
//             }
//         }
//     }
//     return true;
// }

// ZaRegisterDevice.prototype.modifyPolicy =
// function(by, val) {
//     var soapDoc = AjxSoapDoc.create("ModifySystemRetentionPolicyRequest", "urn:zimbraAdmin", null);
//     if (by && val) {
//         var el = soapDoc.set("cos", val);
//         el.setAttribute("by", by);
//     }

//     var policy = soapDoc.set("policy", null, null, "urn:zimbraMail");
//     policy.setAttribute("name", this[ZaRegisterDevice.A2_name]);
//     policy.setAttribute("id", this[ZaRegisterDevice.A2_id]);
//     policy.setAttribute("lifetime", this.toDays());
//     policy.setAttribute("type", "system");

//     var params = new Object();
//     params.soapDoc = soapDoc;
//     params.skipAuthCheck = false;

//     try{
//         var reqMgrParams = {
//             controller : ZaApp.getInstance().getCurrentController(),
//             busyMsg : ZaMsg.BUSY_MODIFY_RETENTION_POLICIES
//         };

//         ZaRequestMgr.invoke(params, reqMgrParams).Body.ModifySystemRetentionPolicyResponse;

//     } catch(ex) {
//         throw ex;
//         return null;
//     }
// }


// ZaRegisterDevice.prototype.deletePolicy =
// function(by, val) {
//     var soapDoc = AjxSoapDoc.create("DeleteSystemRetentionPolicyRequest", "urn:zimbraAdmin", null);
//     if (by && val) {
//         var el = soapDoc.set("cos", val);
//         el.setAttribute("by", by);
//     }

//     var policy = soapDoc.set("policy", null, null, "urn:zimbraMail");
//     policy.setAttribute("id", this.id);

//     var params = new Object();
//     params.soapDoc = soapDoc;
//     params.skipAuthCheck = false;

//     try{
//         var reqMgrParams = {
//             controller : ZaApp.getInstance().getCurrentController(),
//             busyMsg : ZaMsg.BUSY_DELETE_RETENTION_POLICIES
//         };

//         var resp = ZaRequestMgr.invoke(params, reqMgrParams).Body.DeleteSystemRetentionPolicyResponse;

//     } catch(ex) {
//         throw ex;
//         return null;
//     }
// }