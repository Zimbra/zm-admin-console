/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2006, 2007, 2009, 2010, 2013, 2014 Zimbra, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2009, 2010, 2013, 2014 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */
 
/**	
* @class defines XFormItem type _AUTO_COMPLETE_LIST_
* @contructor
* @author Charles Cao
**/

AutoCompleteList_XFormItem = function() {}
XFormItemFactory.createItemType("_AUTO_COMPLETE_LIST_", "auto_complete_list", 
										AutoCompleteList_XFormItem, WidgetAdaptor_XFormItem);

AutoCompleteList_XFormItem.prototype.widgetClass = ZaAutoCompleteListView;


AutoCompleteList_XFormItem.prototype.constructWidget = function () {
	
	var autoCompleteListViewClass = this.getInheritedProperty("widgetClass");
//	var locCallback = new AjxCallback (this, AutoCompleteList_XFormItem.prototype._getAcListLoc);
	var locCallback = new AjxCallback (this, this._getAcListLoc);
	var compCallback = new AjxCallback(this, this.getInheritedProperty("compCallback"));
	//var dataLoadCallback = new AjxCallback (this, dataLoaderClass.prototype._getDataCallback);
	
	var params = { 	//parent: this.getForm() ,
					parent: this.getForm().shell,					
					className: this.getCssClass(),
					dataLoaderClass: this.getInheritedProperty("dataLoaderClass"),
					dataLoaderMethod: this.getInheritedProperty("dataLoaderMethod"), //method that searches for matches (e.g. sends search request to server)
					matchValue: this.getInheritedProperty("matchValue"), //the name of the property in the match list to be used to do the comparison
					matchText: this.getInheritedProperty("matchText"),//the name of the property in the match list to be displayed in the field
					//inputFieldElement: this.getForm().getItemsById (this.getInheritedProperty("inputFieldElementId"))[0].getElement(),
					inputFieldXFormItem: this.getForm().getItemsById (this.getInheritedProperty("inputFieldElementId"))[0],
					//dataLoadCallback: dataLoadCallback,
					locCallback: locCallback, 
					compCallback: compCallback,//called when a value is selected from the list of suggestions
					separator: ""  					
				  };
								
	var widget = new autoCompleteListViewClass(params);
		
	return widget;
};

AutoCompleteList_XFormItem.prototype.insertWidget = function (form, widget, parentElement) {
	//the autocomplete list always belong to the shell
	//so we actually don't need to reparent the element
	return ;
}

AutoCompleteList_XFormItem.prototype.updateWidget = function (newValue) {}

AutoCompleteList_XFormItem.prototype._getAcListLoc =
function(ev) {
	var element = ev.element;
	var loc = Dwt.getLocation(element);
	var height = Dwt.getSize(element).y;
	return (new DwtPoint(loc.x, loc.y + height));
};





