/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
* @class ZaServerMessageCountPage 
* @contructor ZaServerMessageCountPage
* @param parent
* @param app
* @author Greg Solovyev
**/
ZaServerMessageCountPage = function(parent) {
	this.serverId = parent.serverId; //should save this server id firstly
	DwtTabViewPage.call(this, parent);
	this._fieldIds = new Object(); //stores the ids of all the form elements

	//this._createHTML();
	this.initialized=false;
	this.setScrollStyle(DwtControl.SCROLL);	
}
 
ZaServerMessageCountPage.prototype = new DwtTabViewPage;
ZaServerMessageCountPage.prototype.constructor = ZaServerMessageCountPage;

ZaServerMessageCountPage.prototype.toString = 
function() {
	return "ZaServerMessageCountPage";
}

ZaServerMessageCountPage.prototype.showMe =  function(refresh) {
    this.setZIndex(DwtTabView.Z_ACTIVE_TAB);
	if (this.parent.getHtmlElement().offsetHeight > 26) { 						// if parent visible, use offsetHeight
		this._contentEl.style.height=this.parent.getHtmlElement().offsetHeight-26;
	} else {
		var parentHeight = parseInt(this.parent.getHtmlElement().style.height);	// if parent not visible, resize page to fit parent
		var units = AjxStringUtil.getUnitsFromSizeString(this.parent.getHtmlElement().style.height);
		if (parentHeight > 26) {
			this._contentEl.style.height = (Number(parentHeight-26).toString() + units);
		}
	}
	this._contentEl.style.width = this.parent.getHtmlElement().style.width;	// resize page to fit parent

	if(refresh && this._currentObject) {
		this.setObject(this._currentObject);
	}
	if (this._currentObject) {
	    var item = this._currentObject;
        var serverId = this.serverId;

        var charts = document.getElementById('loggerchartservermc-' + serverId);
        charts.style.display = "block";
        var divIds = [ 'servermc-no-mta-' + serverId,
                       'server-message-count-48hours-' + serverId,
                       'server-message-count-30days-' + serverId,
                       'server-message-count-60days-' + serverId,
                       'server-message-count-year-' + serverId 
                      ];
        ZaGlobalAdvancedStatsPage.hideDIVs(divIds);

	    var hosts = ZaGlobalAdvancedStatsPage.getMTAHosts();
	    if (ZaGlobalAdvancedStatsPage.indexOf(hosts, item.name) != -1) {
            var startTimes = [null, 'now-48h', 'now-30d', 'now-60d', 'now-1y'];
            for (var i=1; i < divIds.length; i++){ //skip divId[0] -- servermv-no-mta
                ZaGlobalAdvancedStatsPage.plotQuickChart( divIds[i], item.name, 'zmmtastats', ['mta_count'], ['msgs'], startTimes[i], 'now', { convertToCount: 1 });
            }


        } else {
            var nomta = document.getElementById('loggerchartservermc-no-mta-' + serverId);
            nomta.style.display = "block";
            charts.style.display = "none";
            ZaGlobalAdvancedStatsPage.setText(nomta, ZaMsg.Stats_NO_MTA);
        }
	}
}

ZaServerMessageCountPage.prototype.setObject =
function (item) {
	this._currentObject = item;	
}

ZaServerMessageCountPage.prototype._createHtml = 
function () {
	var idx = 0;
	var html = new Array(50);
	var serverId = this.serverId;
	DwtTabViewPage.prototype._createHtml.call(this);
	html[idx++] = "<h1 style='display:none;' id='loggerchartservermc-no-mta-" + serverId + "'></h1>";
	html[idx++] = "<div class='StatsHeader'>" + ZaMsg.Stats_MC_Header + "</div>";
	html[idx++] = "<div class='StatsDiv' id='loggerchartservermc-" + serverId + "'>";
	html[idx++] = "<div class='StatsImageTitle'>" + AjxStringUtil.htmlEncode(ZaMsg.NAD_StatsHour) + "</div>";
	html[idx++] = "<div class='StatsImage'>";
	html[idx++] = "<canvas id='loggercanvasserver-message-count-48hours-" + serverId + "'><div id='loggerchartserver-message-count-48hours-" + serverId + "'></div>";
	html[idx++] = "</div>";
	html[idx++] = "<div class='StatsImageTitle'>" + AjxStringUtil.htmlEncode(ZaMsg.NAD_StatsDay) + "</div>";
	html[idx++] = "<div class='StatsImage'>";
	html[idx++] = "<canvas id='loggercanvasserver-message-count-30days-" + serverId + "'><div id='loggerchartserver-message-count-30days-" + serverId + "'></div>";
	html[idx++] = "</div>";
	html[idx++] = "<div class='StatsImageTitle'>" + AjxStringUtil.htmlEncode(ZaMsg.NAD_StatsMonth) + "</div>";
	html[idx++] = "<div class='StatsImage'>";
	html[idx++] = "<canvas id='loggercanvasserver-message-count-60days-" + serverId + "'><div id='loggerchartserver-message-count-60days-" + serverId + "'></div>";
	html[idx++] = "</div>";
	html[idx++] = "<div class='StatsImageTitle'>" + AjxStringUtil.htmlEncode(ZaMsg.NAD_StatsYear) + "</div>";
	html[idx++] = "<div class='StatsImage'>";
	html[idx++] = "<canvas id='loggercanvasserver-message-count-year-" + serverId + "'><div id='loggerchartserver-message-count-year-" + serverId + "'></div>";
	html[idx++] = "</div>";
	html[idx++] = "</div>";
	this.getHtmlElement().innerHTML = html.join("");
}
