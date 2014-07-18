/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014 Zimbra, Inc.
 * 
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at: http://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 
 * have been added to cover use of software over a computer network and provide for limited attribution 
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B. 
 * 
 * Software distributed under the License is distributed on an "AS IS" basis, 
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. 
 * See the License for the specific language governing rights and limitations under the License. 
 * The Original Code is Zimbra Open Source Web Client. 
 * The Initial Developer of the Original Code is Zimbra, Inc. 
 * All portions of the code are Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */

/**
* @class ZaServerStatsView 
* @contructor ZaServerStatsView
* @param parent
* @param app
* @author Greg Solovyev
**/
ZaServerStatsView = function(parent) {

	DwtTabView.call(this, parent);
	
	this._appCtxt = this.shell.getData(ZaAppCtxt.LABEL);

    this._tabBar.setVisible(false); //new UI doesn't need to show the inner tabbar
    // TODO move add page to constructor function and not in setObject function
    this._lastWidth = 0;
    this._lastHeight = 0;
}

ZaServerStatsView.prototype = new DwtTabView;
ZaServerStatsView.prototype.constructor = ZaServerStatsView;

ZaServerStatsView.prototype._isMtaEnabled = function(server) {
	return server && server.attrs[ZaServer.A_zimbraMtaServiceEnabled];
}

ZaServerStatsView.prototype._isMailStoreEnabled = function(server) {
	return server &&
		server.attrs[ZaServer.A_zimbraMailboxServiceEnabled] &&
		server.attrs[ZaServer.A_zimbraMailStoreServletEnabled];
}

ZaServerStatsView.prototype.toString = 
function() {
	return "ZaServerStatsView";
}

ZaServerStatsView.prototype.getTabToolTip =
function () {
	if (this._containedObject) {
		return	ZaMsg.tt_tab_View + " " + this._containedObject.type + " " + this._containedObject.name + " " + ZaMsg.tt_tab_Statistics ;
	}else{
		return "" ;
	}
}

ZaServerStatsView.prototype.getTabIcon = 
function () {
	return "StatisticsByServer" ;
}

ZaServerStatsView.prototype.getTabTitle =
function () {
	if (this._containedObject) {
		return this._containedObject.name ;
	}else{
		return "" ;
	}
}
 
ZaServerStatsView.prototype.updateTab =
function () {
	var tab = this.getAppTab ();
	tab.resetLabel (this.getTabTitle()) ;
	tab.setImage (this.getTabIcon());
	tab.setToolTipContent (this.getTabToolTip()) ;
}

ZaServerStatsView.prototype.getAppTab =
function () {
	return ZaApp.getInstance().getTabGroup().getTabById(this.__internalId) ;
} 
 
/**
* @method setObject sets the object contained in the view
* @param entry - ZaServer object to display
**/
ZaServerStatsView.prototype.setObject =
function(entry) {
    if ( !entry || !entry.id ){
        return;
    }
    this._containedObject = entry ;
    this.serverId = entry.id;

    if( this._msgCountPage == null ){
        this._diskPage = new ZaServerDiskStatsPage(this);
        this.addTab(ZaMsg.TABT_Disk, this._diskPage);
    }
    this._diskPage.setObject(entry);

    if( this._sessionPage == null ){
        this._sessionPage = new ZaServerSessionStatsPage(this);
        this.addTab(ZaMsg.TABT_Session, this._sessionPage);
    }
    this._sessionPage.setObject(entry);

    if (ZaZimbraAdmin.isGlobalAdmin() && this._isMailStoreEnabled(entry)) {
        if( this._mbxPage == null ){
            this._mbxPage = new ZaServerMBXStatsPage (this);
            ZaServerMBXStatsPage.TAB_KEY = this.addTab(ZaMsg.TABT_MBX, this._mbxPage);
        }
        this._mbxPage.setObject(entry);
    }

	if (this._isMtaEnabled(entry)) {

	    if( this._msgCountPage == null ){
	        this._msgCountPage = new ZaServerMessageCountPage(this);
	        this.addTab(ZaMsg.TABT_InMsgs, this._msgCountPage);
	    }
		this._msgCountPage.setObject(entry);

	    if( this._msgsVolumePage == null ){
	        this._msgsVolumePage = new ZaServerMessageVolumePage(this);
	        this.addTab(ZaMsg.TABT_InData, this._msgsVolumePage);
	    }
	    this._msgsVolumePage.setObject(entry);

		if( this._spamPage == null ){
			this._spamPage = new ZaServerSpamActivityPage(this);
			this.addTab(ZaMsg.TABT_Spam_Activity, this._spamPage);
		}
		this._spamPage.setObject(entry);	
	}

	var szTitle = AjxStringUtil.htmlEncode(ZaMsg.NAD_ServerStatistics);
	if(entry.name) {
		szTitle = szTitle + entry.name;
	}
	this.titleCell.innerHTML = szTitle;
    // Only a hook here to resize all the page
    if (this._lastWidth && this._lastHeight)
        this._resetTabSizes(this._lastWidth, this._lastHeight);
}

ZaServerStatsView.prototype._resetTabSizes = 
function (width, height) {
    this._lastWidth = width;
    this._lastHeight = height;
    var tabBarSize = this._tabBar.getSize();
	var titleCellSize = Dwt.getSize(this.titleCell);

	var tabBarHeight = tabBarSize.y || this._tabBar.getHtmlElement().clientHeight;
	var titleCellHeight = titleCellSize.y || this.titleCell.clientHeight;
		
	var tabWidth = width;
	var newHeight = (height - tabBarHeight - titleCellHeight);
	var tabHeight = ( newHeight > 50 ) ? newHeight : 50;
	
	if(this._tabs && this._tabs.length) {
		for(var curTabKey in this._tabs) {
			if(this._tabs[curTabKey]["view"]) {
				this._tabs[curTabKey]["view"].resetSize(tabWidth, tabHeight);
			}	
		}
	}		
}

ZaServerStatsView.prototype._createHtml = 
function() {
	DwtTabView.prototype._createHtml.call(this);
	this._table = document.createElement("table") ;
	var htmlEl = this.getHtmlElement()
	htmlEl.insertBefore (this._table, htmlEl.firstChild);
	//this.getHtmlElement().appendChild(this._table) ;
	
	var row1;
	//var col1;
	var row2;
	var col2;
	row1 = this._table.insertRow(0);
	row1.align = "center";
	row1.vAlign = "middle";
	
	this.titleCell = row1.insertCell(row1.cells.length);
	this.titleCell.align = "center";
	this.titleCell.vAlign = "middle";
	this.titleCell.noWrap = true;	

	this.titleCell.id = Dwt.getNextId();
	this.titleCell.align="left";
	this.titleCell.innerHTML = AjxStringUtil.htmlEncode(ZaMsg.NAD_ServerStatistics);
	this.titleCell.className="AdminTitleBar";
}


ZaServerStatsView.prototype.getTabChoices =
function() {
    //var innerTabs = this._tab;
    var innerTabs = [ZaMsg.TABT_Disk, ZaMsg.TABT_Session];
    var entry = this._containedObject;

    if (ZaZimbraAdmin.isGlobalAdmin() && this._isMailStoreEnabled(entry)) {
        innerTabs.push(ZaMsg.TABT_MBX);
    }

    if (this._isMtaEnabled(entry)) {
        innerTabs.push(ZaMsg.TABT_InMsgs);
        innerTabs.push(ZaMsg.TABT_InData);
        innerTabs.push(ZaMsg.TABT_Spam_Activity);
    }

    var tabChoices = [];
    //index of _tabs is based on 1 rather than 0
    for (var i = 1; i <= innerTabs.length; i++){
        tabChoices.push({ value: i,
                            label: innerTabs[i-1]
                            //label: innerTabs[i].title
                        });
    }

    return tabChoices;
}



