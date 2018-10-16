/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
 
 /**
 * @author Greg Solovyev
 **/
ZaQMessagesListView = function(parent, className, posStyle, headerList) {
	//var headerList = this._getHeaderList();
	ZaListView.call(this, parent, className, posStyle, headerList);
}

ZaQMessagesListView.prototype = new ZaListView;
ZaQMessagesListView.prototype.constructor = ZaQMessagesListView;

ZaQMessagesListView.prototype.toString = function() {
	return "ZaQMessagesListView";
};

ZaQMessagesListView.prototype._createItemHtml =
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
			if(field == ZaMTAQMsgItem.A_id) {
				// type
				html[idx++] = "<td align=left height=20px width=" + this._headerList[i]._width + ">";
				html[idx++] = AjxStringUtil.htmlEncode(String(item[ZaMTAQMsgItem.A_id]));
				html[idx++] = "</td>";
			} else if(field == ZaMTAQMsgItem.A_recipients) {
				// name
				html[idx++] = "<td align=left height=20px width=" + this._headerList[i]._width + ">";
				html[idx++] = item[ZaMTAQMsgItem.A_recipients];
				html[idx++] = "</td>";
			} else if(field == ZaMTAQMsgItem.A_content_filter) {
				// name
				html[idx++] = "<td align=left height=20px width=" + this._headerList[i]._width + ">";
				html[idx++] = item[ZaMTAQMsgItem.A_content_filter];
				html[idx++] = "</td>";
			} else if(field == ZaMTAQMsgItem.A_time) {
				// name
				html[idx++] = "<td align=left height=20px width=" + this._headerList[i]._width + ">";
				html[idx++] = AjxDateUtil.computeDateStr(new Date(), parseInt(item[ZaMTAQMsgItem.A_time]));
				html[idx++] = "</td>";
			} else if(field == ZaMTAQMsgItem.A_origin_host) {
				// name
				html[idx++] = "<td align=left height=20px width=" + this._headerList[i]._width + ">";
				html[idx++] = AjxStringUtil.htmlEncode(item[ZaMTAQMsgItem.A_origin_host]);
				html[idx++] = "</td>";
			} else if(field == ZaMTAQMsgItem.A_sender) {
				// name
				html[idx++] = "<td align=left height=20px width=" + this._headerList[i]._width + ">";
				html[idx++] =item[ZaMTAQMsgItem.A_sender];
				html[idx++] = "</td>";
			} else if(field == ZaMTAQMsgItem.A_origin_ip) {
				// name
				html[idx++] = "<td align=left height=20px width=" + this._headerList[i]._width + ">";
				html[idx++] =item[ZaMTAQMsgItem.A_origin_ip];
				html[idx++] = "</td>";
			} else if(field == ZaMTAQMsgItem.A_fromdomain) {
				// name
				html[idx++] = "<td align=left height=20px width=" + this._headerList[i]._width + ">";
				html[idx++] =item[ZaMTAQMsgItem.A_fromdomain];
				html[idx++] = "</td>";
			}			
		}
	} else {
		html[idx++] = "<td width=100%>";
		html[idx++] = AjxStringUtil.htmlEncode(item);
		html[idx++] = "</td>";
	}
	
	html[idx++] = "</tr></table>";
	div.innerHTML = html.join("");
	return div;
}


ZaQMessagesListView.prototype._setNoResultsHtml = function() {
	var buffer = new AjxBuffer();
	var	div = document.createElement("div");
	
	buffer.append("<table width='100%' cellspacing='0' cellpadding='1'>",
				  "<tr><td class='NoResults'><br>&nbsp",
				  "</td></tr></table>");
	
	div.innerHTML = buffer.toString();
	this._addRow(div);
};

ZaQMessagesListView.prototype._sortColumn = function (columnItem, bSortAsc){
	if (bSortAsc) {
		var comparator = function (a, b) {
			return (a < b)? 1 :((a > b)? -1 : 0);
		};
		this.getList().sort(comparator);
	} else {
		this.getList().sort();
	}
};


ZaQMessagesListView.prototype._handleColHeaderResize = function(ev){
	ZaListView._handleColHeaderResize.call(this,ev);
}


