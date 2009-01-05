/*
 * ***** BEGIN LICENSE BLOCK *****
 * 
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007 Zimbra, Inc.
 * 
 * The contents of this file are subject to the Yahoo! Public License
 * Version 1.0 ("License"); you may not use this file except in
 * compliance with the License.  You may obtain a copy of the License at
 * http://www.zimbra.com/license.
 * 
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * 
 * ***** END LICENSE BLOCK *****
 */

/**
* Creates a new wizard dialog.
* @class
* @constructor
* @extends ZaXDialog
* @param parent - parent control {shell} 
* @param className {String} CSS class name
* @param title {String} dialog title
* @param w {Number} content area width
* @param h {Number} content area height
* This class represents a reusable wizard dialog. 
* After calling the constructor, define metadata for and call initForm to draw the contents of the dialog
*/
ZaXWizardDialog = function(parent,className, title, w, h,iKeyName, extraButtons) {
	if (arguments.length == 0) return;

	this._standardButtons = [DwtDialog.CANCEL_BUTTON];

	if(extraButtons) {
		this._extraButtons = extraButtons;
	} else {
		var helpButton = new DwtDialog_ButtonDescriptor(ZaXWizardDialog.HELP_BUTTON, ZaMsg.TBB_Help, DwtDialog.ALIGN_LEFT, new AjxCallback(this, this._helpButtonListener));
		var nextButton = new DwtDialog_ButtonDescriptor(ZaXWizardDialog.NEXT_BUTTON, AjxMsg._next, DwtDialog.ALIGN_RIGHT, new AjxCallback(this, this.goNext));
		var prevButton = new DwtDialog_ButtonDescriptor(ZaXWizardDialog.PREV_BUTTON, AjxMsg._prev, DwtDialog.ALIGN_RIGHT, new AjxCallback(this, this.goPrev));
		var finishButton = new DwtDialog_ButtonDescriptor(ZaXWizardDialog.FINISH_BUTTON, AjxMsg._finish, DwtDialog.ALIGN_RIGHT, new AjxCallback(this, this.finishWizard));
		this._extraButtons = [helpButton,prevButton,nextButton,finishButton];
	}
	ZaXDialog.call(this, parent,className,title, w, h,iKeyName);
	this._pageIx = 1;
	this._currentPage = 1;
}

ZaXWizardDialog.prototype = new ZaXDialog;
ZaXWizardDialog.prototype.constructor = ZaXWizardDialog;

//Z-index contants for the tabbed view contents are based on Dwt z-index constants
ZaXWizardDialog.Z_ACTIVE_PAGE = Dwt.Z_VIEW+10;
ZaXWizardDialog.Z_HIDDEN_PAGE = Dwt.Z_HIDDEN;
ZaXWizardDialog.Z_TAB_PANEL = Dwt.Z_VIEW+20;
ZaXWizardDialog.Z_CURTAIN = Dwt.Z_CURTAIN;

ZaXWizardDialog.NEXT_BUTTON = DwtWizardDialog.NEXT_BUTTON;
ZaXWizardDialog.PREV_BUTTON = DwtWizardDialog.PREV_BUTTON
ZaXWizardDialog.FINISH_BUTTON = DwtWizardDialog.FINISH_BUTTON;
ZaXWizardDialog.HELP_BUTTON = ++DwtDialog.LAST_BUTTON;

//public methods
ZaXWizardDialog.prototype.toString = 
function () {
	return "ZaXWizardDialog";
}
/**
* member of  ZaXWizardDialog
* closes the wizard dialog
**/
ZaXWizardDialog.prototype.popdown = 
function () {
	DwtDialog.prototype.popdown.call(this);
	//clear the newAccountWizard._domains obj
	if (this._domains) {
		this._domains = {} ;
	}
}



/**
* pageKey is the value returned from {@link ZaXWizardDialog#addPage} method
* This method is called by DwtWizardPage#switchToNextPage
* and DwtWizardPage#switchToPrevPage
* @param pageKey - key to the page to be shown. 
**/
ZaXWizardDialog.prototype.goPage = 
function(pageKey) {
	//reset the domain lists
	EmailAddr_XFormItem.resetDomainLists.call (this);
	//release the focus to make the cursor visible
	this._localXForm.releaseFocus();
	this._localXModel.setInstanceValue(this._containedObject,ZaModel.currentStep, pageKey);
	if(this._localXForm.tabGroupIDs[pageKey])
		this._localXForm.focusFirst(this._localXForm.tabGroupIDs[pageKey]);
	else
		this._localXForm.focusFirst();
}

/**
* member of  ZaXWizardDialog
* switches to the next page in the wizard
**/
ZaXWizardDialog.prototype.goNext = 
function() {
	this.goPage(this._containedObject[ZaModel.currentStep]+1);
}

/**
* member of  ZaXWizardDialog
* switches to the previous page in the wizard
**/
ZaXWizardDialog.prototype.goPrev = 
function() {
	this.goPage(this._containedObject[ZaModel.currentStep]-1);
}

/**
* member of  ZaXWizardDialog
* called when "Finish" button is clicked. Calls @see #popdown
**/
ZaXWizardDialog.prototype.finishWizard = 
function() {
	this.popdown();	
}
/**
* member of  ZaXWizardDialog
* @return current step number
**/
ZaXWizardDialog.prototype.getCurrentStep = 
function() {
	return this._containedObject[ZaModel.currentStep];	
}

/**
* member of  ZaXWizardDialog
* @param wizPage - instance of DwtPropertyPage 
* @return the key for the added page. This key can be used to retreive the tab using @link getPage.
**/
ZaXWizardDialog.prototype.addPage =
function (stepTitle) {
	var pageKey = this._pageIx++;	
	return pageKey;
}

/**
* member of  ZaXWizardDialog
* @param xModelMetaData
* @param xFormMetaData
**/
ZaXWizardDialog.prototype.initForm = 
function (xModelMetaData, xFormMetaData) {
	if(xModelMetaData == null || xFormMetaData == null)
		throw new AjxException(ZaMsg.ERROR_METADATA_NOT_DEFINED, AjxException.INVALID_PARAM, "ZaXWizardDialog.prototype.initForm");
		
	this._localXModel = new XModel(xModelMetaData);
	this._localXForm = new XForm(xFormMetaData, this._localXModel, null, this);
	this._localXForm.setController(ZaApp.getInstance());
	this._localXForm.draw(this._pageDiv);
	this._drawn = true;
}


/**
* member of  ZaXWizardDialog
* @return the object contained in the view
* before returning the object this updates the object attributes with 
* tha values from the form fields 
**/
ZaXWizardDialog.prototype.getObject =
function() {
	return this._containedObject;
}

/**
* member of  ZaXWizardDialog
* sets the object contained in the view
* @param entry - ZaDomain object to display
**/
ZaXWizardDialog.prototype.setObject =
function(entry) {
	this._containedObject = new Object();
	this._containedObject.attrs = new Object();

	for (var a in entry.attrs) {
		this._containedObject.attrs[a] = entry.attrs[a];
	}
	
	this._localXForm.setInstance(this._containedObject.attrs);
}