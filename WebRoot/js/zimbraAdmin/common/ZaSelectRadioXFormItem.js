/*
 * ***** BEGIN LICENSE BLOCK *****
 * 
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2010 Zimbra, Inc.
 * 
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”);
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at: http://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 
 * have been added to cover use of software over a computer network and provide for limited attribution 
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B. 
 * 
 * Software distributed under the License is distributed on an “AS IS” basis, 
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. 
 * See the License for the specific language governing rights and limitations under the License. 
 * The Original Code is Zimbra Open Source Web Client. 
 * The Initial Developer of the Original Code is Zimbra, Inc. 
 * All portions of the code are Copyright (C) 2010 Zimbra, Inc. All Rights Reserved. 
 * 
 * ***** END LICENSE BLOCK *****
 */
/**
*	_ZASELECT_RADIO_ form item type
**/
ZaSelectRadio_XFormItem = function () {}
XFormItemFactory.createItemType("_ZASELECT_RADIO_", "zaselect_radio", ZaSelectRadio_XFormItem, Composite_XFormItem);
ZaSelectRadio_XFormItem.prototype.numCols=2;
ZaSelectRadio_XFormItem.prototype.colSizes=["275px","275px"];
ZaSelectRadio_XFormItem.prototype.nowrap = false;
ZaSelectRadio_XFormItem.prototype.labelWrap = true;
ZaSelectRadio_XFormItem.prototype.items = [];
ZaSelectRadio_XFormItem.prototype.labelWidth = "275px";

ZaSelectRadio_XFormItem.prototype.initializeItems = function() {
	var selectRef = this.getInheritedProperty("selectRef");
	var radioBoxLabel1 = this.getInheritedProperty("radioBoxLabel1");
	var radioBoxLabel2 = this.getInheritedProperty("radioBoxLabel2");
	var choices = this.getInheritedProperty("choices");	

	var radioBox1 = {type:_RADIO_, groupname:this.id+"zimlet_select_check_grp"+selectRef,ref:".",
		label:radioBoxLabel1, labelLocation:_RIGHT_,
		elementChanged:function(elementValue,instanceValue, event) {
			if(elementValue==true) {
				this.getForm().itemChanged(this.getParentItem(), null, event);	
			}
		},
		updateElement:function(value) {
			this.getElement().checked = !value;
		}
		
	};
	
	var radioBox2 = {type:_RADIO_, groupname:this.id+"zimlet_select_check_grp"+selectRef,ref:".",
		label:radioBoxLabel2, labelLocation:_RIGHT_ ,
		updateElement:function(value) {
			this.getElement().checked = value;
		},
		elementChanged:function(elementValue,instanceValue, event) {

		}
	};
		
	var selectChck = {
		type:_OSELECT_CHECK_,
		choices:choices,
		colSpan:3,
		ref:selectRef,
		width:"275px",
		onChange:function (value, event, form) {
			if (this.getParentItem() && this.getParentItem().getParentItem() && this.getParentItem().getParentItem().getOnChangeMethod()) {
				return this.getParentItem().getParentItem().getOnChangeMethod().call(this, value, event, form);
			} else {
				return this.setInstanceValue(value);
			}
		},
		forceUpdate:true,
		updateElement:function(value) {
			OSelect_XFormItem.prototype.updateElement.call(this, value);
		},
		cssStyle:"margin-bottom:5px;margin-top:5px;border:2px inset gray;"				
	};
	
	var selectChckGrp = {
		type:_GROUP_,
		numCols:3,
		colSizes:["130px","15px","130px"],
		items:[
			selectChck,
			{type:_DWT_BUTTON_,label:ZaMsg.SelectAll,width:"120px",
				onActivate:function (ev) {
					var lstElement = this.getParentItem().items[0];
					if(lstElement) {
						lstElement.selectAll(ev);
					}
				}
			},
			{type:_CELLSPACER_,width:"15px"},
			{type:_DWT_BUTTON_,label:ZaMsg.DeselectAll,width:"120px",
				onActivate:function (ev) {
					var lstElement = this.getParentItem().items[0];
					if(lstElement) {
						lstElement.deselectAll(ev);
					}
				}
			}
		]
		
	}
		
	this.items = [radioBox1,radioBox2,{type:_CELLSPACER_,width:this.labelWidth},selectChckGrp];
	
	
	Composite_XFormItem.prototype.initializeItems.call(this);
}
