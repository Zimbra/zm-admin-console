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
ZaRegisteredDeviceListView = function(parent, className, posStyle, headerList) {
	ZaListView.call(this, parent, className, posStyle, headerList);
}

ZaRegisteredDeviceListView.prototype = new ZaListView;
ZaRegisteredDeviceListView.prototype.constructor  = ZaRegisteredDeviceListView;
ZaRegisteredDeviceListView.prototype.toString = function() {
	return "ZaRegisteredDeviceListView";
};

ZaRegisteredDeviceListView.prototype._createItemHtml =
function(item) {
	var html = new Array(50);
	var	div = document.createElement("div");
	div[DwtListView._STYLE_CLASS] = "Row";
	div[DwtListView._SELECTED_STYLE_CLASS] = div[DwtListView._STYLE_CLASS] + "-" + DwtCssStyle.SELECTED;
	div.className = div[DwtListView._STYLE_CLASS];
	this.associateItemWithElement(item, div, DwtListView.TYPE_LIST_ITEM);
	
	var idx = 0;
	html[idx++] = "<table width='100%' cellspacing='0' cellpadding='0'>";

	html[idx++] = "<tr>";
	if(this._headerList) {
		var cnt = this._headerList.length;
		for(var i = 0; i < cnt; i++) {
			var field = this._headerList[i]._field;
			console.log(field);
			console.log(item[field]);

			if(field == ZaRegisterDevice.RD_Email_Address) {
				html[idx++] = "<td align=left height=20px width=" + this._headerList[i]._width + ">";
				html[idx++] = AjxStringUtil.htmlEncode(item[ZaRegisterDevice.RD_Email_Address]);
				html[idx++] = "</td>";
			} else if(field == ZaRegisterDevice.RD_Last_Login) {
				html[idx++] = "<td align=left height=20px width=" + this._headerList[i]._width + ">";
                html[idx++] = AjxStringUtil.htmlEncode(ZaRegisterDevice.RD_Last_Login);
				html[idx++] = "</td>";
			} else if(field == ZaRegisterDevice.RD_Device_OS) {
				html[idx++] = "<td align=left height=20px width=" + this._headerList[i]._width + ">";
                html[idx++] = AjxStringUtil.htmlEncode(item[ZaRegisterDevice.RD_Device_OS]);
				html[idx++] = "</td>";
			} else if(field == ZaRegisterDevice.RD_Device_ID) {
				html[idx++] = "<td align=left height=20px width=" + this._headerList[i]._width + ">";
				html[idx++] = AjxStringUtil.htmlEncode(item[ZaRegisterDevice.RD_Device_ID]);
				html[idx++] = "</td>";
			} else if(field == ZaRegisterDevice.RD_Status) {
				html[idx++] = "<td align=left height=20px width=" + this._headerList[i]._width + ">";
				html[idx++] = AjxStringUtil.htmlEncode(item[ZaRegisterDevice.RD_Status] === 1 ? "active" : "disabled");
				html[idx++] = "</td>";
			} else if(field == ZaRegisterDevice.RD_EAS_PROTOCOL) {
				html[idx++] = "<td align=left height=20px width=" + this._headerList[i]._width + ">";
				html[idx++] = AjxStringUtil.htmlEncode(item[ZaRegisterDevice.RD_EAS_PROTOCOL]);
				html[idx++] = "</td>";
			} else if(field == ZaRegisterDevice.RD_Server) {
				html[idx++] = "<td align=left height=20px width=" + this._headerList[i]._width + ">";
				html[idx++] = AjxStringUtil.htmlEncode(item[ZaRegisterDevice.RD_Server]);
				html[idx++] = "</td>";
			}	
		}
	}	
	html[idx++] = "</tr></table>";
	div.innerHTML = html.join("");
	return div;
}

ZaRegisteredDeviceListView.prototype._setNoResultsHtml = function() {
	var buffer = new AjxBuffer();
	var	div = document.createElement("div");
	
	buffer.append("<table width='100%' cellspacing='0' cellpadding='1'>",
				  "<tr><td class='NoResults'><br>&nbsp",
				  "</td></tr></table>");
	
	div.innerHTML = buffer.toString();
	this._addRow(div);
};