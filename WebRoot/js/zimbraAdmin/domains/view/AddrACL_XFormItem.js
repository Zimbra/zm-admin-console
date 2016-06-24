/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2006, 2007, 2008, 2009, 2010, 2013, 2014 Zimbra, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2008, 2009, 2010, 2013, 2014 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */

/**
* XFormItem class: _ADDR_ACL_
* this item is used in the Admin UI to display ACls for addresses (groups, accounts, etc)
* @class AddrACL_XFormItem
* @constructor AddrACL_XFormItem
* @author Greg Solovyev
**/
AddrACL_XFormItem = function() {}
XFormItemFactory.createItemType("_ADDR_ACL_", "addracl", AddrACL_XFormItem, Composite_XFormItem);
AddrACL_XFormItem.prototype.numCols = 5;
AddrACL_XFormItem.prototype.nowrap = true;
AddrACL_XFormItem.prototype.initializeItems = function() {
	var changeMethod = this.getInheritedProperty("onChange");
	
	if(changeMethod) {
		this.items[0].onChange = changeMethod;
		this.items[1].onChange = changeMethod;		
	} else {
		this.items[0].onChange = null;
		this.items[1].onChange = null;		
	}	
	
	var visibleBoxes = this.getInheritedProperty("visibleBoxes");
	if(visibleBoxes)
		this.items[1].visibleBoxes = visibleBoxes;
		
	var dataFetcherMethod = this.getInheritedProperty("dataFetcherMethod");
	if(dataFetcherMethod)
		this.items[0].dataFetcherMethod = dataFetcherMethod;
		
	var toolTipContent = this.getInheritedProperty("toolTipContent");
	if(toolTipContent)
		this.items[0].toolTipContent = toolTipContent;
		
	Composite_XFormItem.prototype.initializeItems.call(this);
}
AddrACL_XFormItem.prototype.items = [
	{type:_DYNSELECT_, width:"200px", inputSize:30, ref:"name", editable:true, forceUpdate:true,
		dataFetcherClass:ZaSearch,
		visibilityChecks:[],enableDisableChecks:[],
		emptyText:ZaMsg.enterSearchTerm, 
		elementChanged:function(val,instanceValue, event) {
			this.getForm().itemChanged(this, val, event);			
		}
	},
	{type:_ACL_, forceUpdate:true, ref:"acl", labelLocation:_NONE_, label:null}
];

/**
* XFormItem class: _STATIC_ADDR_ACL_
* this item is used in the Admin UI to display ACls for addresses (groups, accounts, etc) with address being read-only
* @class StaticAddrACL_XFormItem
* @constructor StaticAddrACL_XFormItem
* @author Greg Solovyev
**/
StaticAddrACL_XFormItem = function() {}
XFormItemFactory.createItemType("_STATIC_ADDR_ACL_", "staticaddracl", StaticAddrACL_XFormItem, Composite_XFormItem);
StaticAddrACL_XFormItem.prototype.numCols = 5;
StaticAddrACL_XFormItem.prototype.nowrap = true;
StaticAddrACL_XFormItem.prototype.initializeItems = function() {
	var changeMethod = this.getInheritedProperty("onChange");
	
	if(changeMethod) {
		this.items[0].onChange = changeMethod;
		this.items[1].onChange = changeMethod;		
	} else {
		this.items[0].onChange = null;
		this.items[1].onChange = null;		
	}	
	
	var visibleBoxes = this.getInheritedProperty("visibleBoxes");
	if(visibleBoxes)
		this.items[1].visibleBoxes = visibleBoxes;
		
	Composite_XFormItem.prototype.initializeItems.call(this);
}
StaticAddrACL_XFormItem.prototype.items = [
	{type:_OUTPUT_, width:"200px", ref:"name", 
		visibilityChecks:[],enableDisableChecks:[]
	},
	{type:_ACL_, forceUpdate:true, ref:"acl", labelLocation:_NONE_, label:null}
];
