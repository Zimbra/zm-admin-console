/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2011, 2013, 2014 Zimbra, Inc.
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
 * All portions of the code are Copyright (C) 2011, 2013, 2014 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */
/**
 * Created by IntelliJ IDEA.
 * User: mingzhang
 * Date: 5/30/11
 * Time: 12:07 AM
 * To change this template use File | Settings | File Templates.
 */
Signature_XFormItem = function() {}
XFormItemFactory.createItemType("_SIGNATURE_", "signature", Signature_XFormItem, Composite_XFormItem);
Signature_XFormItem.prototype.numCols = 1;
Signature_XFormItem.prototype.nowrap = true;

Signature_XFormItem.A_zimbraSigatureName = "name";
Signature_XFormItem.A_zimbraSigatureContent = "content";
Signature_XFormItem.A_zimbraSigatureType = "type";

Signature_XFormItem.prototype.visibilityChecks = [ZaItem.hasReadPermission];
Signature_XFormItem.prototype.enableDisableChecks = [ZaItem.hasWritePermission];
Signature_XFormItem.prototype.initializeItems = function () {
    Composite_XFormItem.prototype.initializeItems.call(this);
}

Signature_XFormItem.typeChoice = [
    {value:"", label: ZaMsg.VALUE_NOT_SET},
    {value:"text/plain", label:ZaMsg.resSignaturePlainType},
    {value:"text/html", label:ZaMsg.resSignatureHTMLType}
];

Signature_XFormItem.prototype.items = [
	{type:_TEXTFIELD_, ref:".", width:"300px", labelLocation:_LEFT_, forceUpdate:true,label:ZaMsg.Dlg_SignatureName,
		//enableDisableChecks:false,
		labelCssStyle:"width:194px",
		getDisplayValue:function(itemVal) {

			if(itemVal && itemVal["name"])
				val = itemVal["name"];
			else {
				val = "";
			}
            return val;
		},

        elementChanged:function(nameVal, curVal, event) {
            var newVal = {};
            if(curVal == "" || !curVal)
                      curVal = {};
            newVal = ZaUtil.deepCloneObject(curVal);
			newVal["name"] = nameVal;

            this.getForm().itemChanged(this.getParentItem(), newVal, event);
        }

	},
	{type:_TEXTAREA_, width: "300px",  forceUpdate:true, ref:".", labelLocation:_LEFT_, label:ZaMsg.Dlg_SignatureContent,
		 labelCssStyle:"width:194px",
		getDisplayValue:function (itemVal) {
			var val;
			if(itemVal && itemVal["content"])
				val = itemVal["content"];
			else val = "";
			return val;
		},
		elementChanged:function(contentVal, curVal, event) {
            var newVal = {};
            if(curVal == "" || !curVal)
                    curVal = {};

            newVal = ZaUtil.deepCloneObject(curVal);
			newVal["content"] = contentVal;
			this.getForm().itemChanged(this.getParentItem(), newVal, event);
		}
	}/*,  Comment it but not delete for it might be used in future
    {ref:".", type:_OSELECT1_, label:ZaMsg.Dlg_SignatureType,
        msgName:ZaMsg.Dlg_SignatureType, labelLocation:_LEFT_,labelCssStyle:"width:194px",
        choices:Signature_XFormItem.typeChoice,
        getDisplayValue:function (itemVal) {
            var val;
            if(itemVal && itemVal["type"])
                val = itemVal["type"];
            else val = "";
            return val;
        },
        elementChanged:function(typeVal, curVal, event) {
            var newVal = {};
            if(curVal == "" || !curVal)
                    curVal = {};

            newVal = ZaUtil.deepCloneObject(curVal);
            newVal["type"] = typeVal;
            this.getForm().itemChanged(this.getParentItem(), newVal, event);
        }
    }*/
];
