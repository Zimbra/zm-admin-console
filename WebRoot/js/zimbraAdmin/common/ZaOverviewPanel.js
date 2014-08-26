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


ZaOverviewPanel = function(params) {
        if (arguments.length == 0) { return; }
	this.overviewId = params.id;
	params.id = ZaId.getOverviewId(ZaId.PANEL_APP);	
        params = Dwt.getParams(arguments, ZaOverviewPanel.PARAMS);
        params.className = params.className || "ZaOverviewPanel";
        DwtComposite.call(this, params);

	this.addControlListener(new AjxListener(this, this._panelControlListener));
	this._createFolderTree();
	this._layout();
}

ZaOverviewPanel.PARAMS = ["parent", "className", "posStyle", "id"];

ZaOverviewPanel.prototype = new DwtComposite();
ZaOverviewPanel.constructor = ZaOverviewPanel;

ZaOverviewPanel._MIN_FOLDERTREE_SIZE = 100;

ZaOverviewPanel.prototype.toString = 
function() {
	return "ZaOverviewPanel";
}

ZaOverviewPanel.prototype.getFolderTree =
function() {
	return this._tree;
}

ZaOverviewPanel.prototype._createFolderTree =
function() {
    this._treePanel = new DwtComposite({
		parent:		this, 
		className:	"OverviewTreePanel", 
		posStyle:	DwtControl.RELATIVE_STYLE,
		id:		ZaId.getTreeId(this.overviewId, this.type)
	});

    this._treePanel.setScrollStyle(Dwt.SCROLL_Y);


    this._tree = new ZaTree({
	parent:		this._treePanel,
	style:		DwtTree.SINGLE_STYLE,
	className:	"OverviewTree" ,
	posStyle:	DwtControl.ABSOLUTE_STYLE,
	id:		ZaId.getTreeId(this.overviewId, DwtTree.SINGLE_STYLE)
    });


}
	
ZaOverviewPanel.prototype._layout =
function() {
	var opSz = this.getSize();
//	opSz.x+=100;
	var h = opSz.y;
//	h = (h > ZaOverviewPanel._MIN_FOLDERTREE_SIZE) ? h : ZaOverviewPanel._MIN_FOLDERTREE_SIZE;
	var w = opSz.x;
	this._treePanel.setBounds(0, 0, w, h);
//	var tfBds = this._treePanel.getBounds();
}

ZaOverviewPanel.prototype._panelControlListener =
function(ev) {
	this._layout();
}
