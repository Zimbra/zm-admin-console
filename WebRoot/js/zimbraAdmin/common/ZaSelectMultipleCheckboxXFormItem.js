/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2023 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2023 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
/**
*	_ZASELECT_MULTIPLE_CHECKBOX_ form item type
**/
ZaSelectMultipleCheckbox_XFormItem = function () {}
XFormItemFactory.createItemType("_ZASELECT_MULTIPLE_CHECKBOX_", "zaselect_multiple_checkbox", ZaSelectMultipleCheckbox_XFormItem, Composite_XFormItem);
ZaSelectMultipleCheckbox_XFormItem.prototype.numCols=3;
ZaSelectMultipleCheckbox_XFormItem.prototype.colSpan=3;
ZaSelectMultipleCheckbox_XFormItem.prototype.colSizes=["275px","225px", "*"];
ZaSelectMultipleCheckbox_XFormItem.prototype.nowrap = false;
ZaSelectMultipleCheckbox_XFormItem.prototype.labelWrap = true;
ZaSelectMultipleCheckbox_XFormItem.prototype.items = [];
ZaSelectMultipleCheckbox_XFormItem.prototype.labelWidth = "275px";
ZaSelectMultipleCheckbox_XFormItem.prototype.labelCssStyle = "";
ZaSelectMultipleCheckbox_XFormItem.prototype.labelCssClass = "gridGroupBodyLabel xform_multiple_checkbox";
ZaSelectMultipleCheckbox_XFormItem.prototype.tableCssClass = "grid_composite_table";
ZaSelectMultipleCheckbox_XFormItem.prototype.visibilityChecks = [ZaItem.hasReadPermission];
ZaSelectMultipleCheckbox_XFormItem.prototype.enableDisableChecks = [ZaItem.hasWritePermission];

ZaSelectWiz_MultipleCheckbox_XFormItem = function () {}
XFormItemFactory.createItemType("_ZASELECT_WIZ_MULTIPLE_CHECKBOX_", "zaselect_wiz_multiple_checkbox", ZaSelectWiz_MultipleCheckbox_XFormItem, ZaSelectMultipleCheckbox_XFormItem);
ZaSelectWiz_MultipleCheckbox_XFormItem.prototype.colSizes = ["200px","300px","150px"];
ZaSelectWiz_MultipleCheckbox_XFormItem.prototype.labelCssStyle = "";
ZaSelectWiz_MultipleCheckbox_XFormItem.prototype.labelCssClass = "";
ZaSelectWiz_MultipleCheckbox_XFormItem.prototype.checkBoxLabelLocation = _RIGHT_;
ZaSelectWiz_MultipleCheckbox_XFormItem.prototype.checkboxSubLabel = "";
ZaSelectWiz_MultipleCheckbox_XFormItem.prototype.checkboxAlign = _RIGHT_;

ZaSelectMultipleCheckbox_XFormItem.prototype.initializeItems = function() {
	var choices = this.getInheritedProperty("choices");
	var label = this.getInheritedProperty("groupLabel");

	var selectChck = {
		type: _OSELECT_CHECK_,
		choices: choices,
		ref: ".",
		width: "275px",
		onChange: function(value, event, form) {
			if (this.getParentItem() && this.getParentItem().getParentItem() && this.getParentItem().getParentItem().getOnChangeMethod()) {
				return this.getParentItem().getParentItem().getOnChangeMethod().call(this, value, event, form);
			} else {
				return this.setInstanceValue(value);
			}
		},
		forceUpdate: true,
		updateElement: function(value) {
			if (!(value instanceof Array)) {
				value = [value];
			}
			OSelect_XFormItem.prototype.updateElement.call(this, value);
		},
		cssStyle: "border:none;"
	};

	var selectChckGrp = {
		type: _GROUP_,
		ref: ".",
		items: [selectChck]
	};

	selectChckGrp.label = label;
	selectChckGrp.labelCssClass = this.getInheritedProperty("labelCssClass");
	selectChckGrp.labelCssStyle = this.getInheritedProperty("labelCssStyle");
	selectChckGrp.cssClass = "";

	this.items = [selectChckGrp];

	Composite_XFormItem.prototype.initializeItems.call(this);

	// replace class name and functions defined in OSelect_Check_XFormItem
	this.containerCssClass = "xform_container";
	this.items[0].items[0].cssClass = this.containerCssClass;
	this.items[0].items[0].getChoiceSelectedCssClass = this.__getChoiceSelectedCssClass;
	this.items[0].items[0].getChoiceCssClass = this.__getChoiceCssClass;
	this.items[0].items[0].getChoiceHTML = this.__getChoiceHTML;
	this.items[0].items[0].setElementEnabled = this.__setElementEnabled;

	this.items[0].items[0].onChoiceOverOriginal = this.items[0].items[0].onChoiceOver;
	this.items[0].items[0].onChoiceOver = this.__onChoiceOver;

	this.items[0].items[0].onChoiceOutOriginal = this.items[0].items[0].onChoiceOut;
	this.items[0].items[0].onChoiceOut = this.__onChoiceOut;

	this.items[0].items[0].onChoiceClickOriginal = this.items[0].items[0].onChoiceClick;
	this.items[0].items[0].onChoiceClick = this.__onChoiceClick;

	this.items[0].items[0].onChoiceDoubleClickOriginal = this.items[0].items[0].onChoiceDoubleClick;
	this.items[0].items[0].onChoiceDoubleClick = this.__onChoiceDoubleClick;
};

// functions to replace the ones defined in OSelect_Check_XFormItem
ZaSelectMultipleCheckbox_XFormItem.prototype.__getChoiceSelectedCssClass =
function() {
	return this.containerCssClass;
};

ZaSelectMultipleCheckbox_XFormItem.prototype.__getChoiceCssClass =
function() {
	return this.containerCssClass;
};

ZaSelectMultipleCheckbox_XFormItem.prototype.__getChoiceHTML =
function(itemNum, value, label, cssClass) {
	var ref = this.getFormGlobalRef() + ".getItemById('"+ this.getId()+ "')";
	var id = this.getId();
	return AjxBuffer.concat(
		"<tr><td class=", cssClass,
			" onmouseover=\"" + ref + ".onChoiceOver(" + itemNum + ", event||window.event)\"",
			" onmouseout=\"" + ref +  ".onChoiceOut(" + itemNum + ", event||window.event)\"",
			" onclick=\"" + ref + ".onChoiceClick(" + itemNum + ", event||window.event)\"",
			" ondblclick=\"" + ref + ".onChoiceDoubleClick(" + itemNum + ", event||window.event)\"",
		">",
		"<table cellspacing=0 cellpadding=0><tr><td><input type=checkbox id='",id,"_choiceitem_",itemNum,"'></td><td>",
		        "<font id=", id, "_label_", itemNum, ">", AjxStringUtil.htmlEncode(label), "</font>",
		"</td></tr></table></td></tr>"
	);
};

ZaSelectMultipleCheckbox_XFormItem.prototype.__setElementEnabled =
function(enabled) {
	var choices = this.getNormalizedChoices();
	if (!choices) {
		return;
	}
	var values = choices.values;
	if (!values) {
		return;
	}
	var cnt = values.length;
	for (var i=0; i < cnt; i ++) {
		var chkbx = this.getElement(this.getId() + "_choiceitem_" + i);
		var label = this.getElement(this.getId() + "_label_" + i);
		if (chkbx) {
			if (enabled) {
				chkbx.className = this.getChoiceCssClass();
				chkbx.disabled = false;
				label.style.color ="";
			} else {
				chkbx.className = this.getChoiceCssClass() + "_disabled";
				chkbx.disabled = true;
				label.style.color ="#808080";
			}
		}
	}
};

ZaSelectMultipleCheckbox_XFormItem.prototype.__onChoiceOver =
function(itemNum) {
	if (this.getIsEnabled()) {
		this.onChoiceOverOriginal(itemNum);
	}
};

ZaSelectMultipleCheckbox_XFormItem.prototype.__onChoiceOut =
function(itemNum) {
	if (this.getIsEnabled()) {
		this.onChoiceOutOriginal(itemNum);
	}
};

ZaSelectMultipleCheckbox_XFormItem.prototype.__onChoiceClick =
function(itemNum, event) {
	if (this.getIsEnabled()) {
		this.onChoiceClickOriginal(itemNum, event);
	}
};

ZaSelectMultipleCheckbox_XFormItem.prototype.__onChoiceDoubleClick =
function(itemNum, event) {
	// address double click as a single click
	if (this.getIsEnabled()) {
		this.onChoiceClickOriginal(itemNum, event);
	}
};
