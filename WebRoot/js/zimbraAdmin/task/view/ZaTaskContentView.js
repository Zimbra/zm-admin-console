/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
/**
 * Created by IntelliJ IDEA.
 * User: mingzhang
 * Date: 9/5/11
 * Time: 1:42 AM
 * To change this template use File | Settings | File Templates.
 */

ZaTaskContentView = function(parent, entry) {
    ZaTabView.call(this, {
        parent:parent,
        cssClassName:"ZaTaskTabView DwtTabView",
        iKeyName:"ZaTaskContentView",
        contextId:"TabContent"
    });
    this.initForm(ZaTask.myXModel,this.getMyXForm(entry), null);
    ZaTaskContentView.showStatusPane = ZaSettings.ENABLED_UI_COMPONENTS[ZaSettings.CARTE_BLANCHE_UI];
    if (!ZaTaskContentView.showStatusPane) {
        for (var i = 0; i < ZaSettings.STATUS_PANE_ITEMS.length; i++) {
            if (ZaSettings.ENABLED_UI_COMPONENTS[ZaSettings.STATUS_PANE_ITEMS[i]]) {
                ZaTaskContentView.showStatusPane = true;
                break;
            }
        }
    }
}

ZaTaskContentView.prototype = new ZaTabView();
ZaTaskContentView.prototype.constructor = ZaTaskContentView;
ZaTabView.XFormModifiers["ZaTaskContentView"] = new Array();

ZaTaskContentView._dialogCache = new Array();
ZaTaskContentView._getDialog =
function(selectedItem) {
    var dialog
    if (selectedItem.type == 1) {
        var cacheName = selectedItem.cacheName;
        var myConstructor = selectedItem.viewForPopup;
        var entry = selectedItem.data;
        if(selectedItem.cacheDialog && !ZaTaskContentView._dialogCache[cacheName])
                ZaTaskContentView._dialogCache[cacheName] = ZaApp.getInstance().dialogs[cacheName];

        if(!selectedItem.cacheDialog ||!ZaTaskContentView._dialogCache[cacheName]){
              ZaTaskContentView._dialogCache[cacheName] = ZaApp.getInstance().dialogs[cacheName] = new myConstructor(ZaApp.getInstance().getAppCtxt().getShell(), entry);
              if (selectedItem.finishCallback)
                   ZaTaskContentView._dialogCache[cacheName].registerCallback(selectedItem.finishCallback.id, selectedItem.finishCallback.callback);
        }

        dialog = ZaTaskContentView._dialogCache[cacheName];
        dialog.setObject(selectedItem.data);
    } else if  (selectedItem.type == 2) {
        dialog = selectedItem.viewForPopup;
    } else {
        // shouldn't go here
    }
    return dialog;
}

ZaTaskContentView.prototype.setObject =
function(entry) {

    this._containedObject = entry;

    this._localXForm.setInstance(this._containedObject);

    this.formDirtyLsnr = new AjxListener(ZaApp.getInstance().getCurrentController(), ZaXFormViewController.prototype.handleXFormChange);
    this._localXForm.addListener(DwtEvent.XFORMS_FORM_DIRTY_CHANGE, this.formDirtyLsnr);
    this._localXForm.addListener(DwtEvent.XFORMS_VALUE_ERROR, this.formDirtyLsnr);
}

ZaTaskContentView.taskItemSelectionListener =
function (ev) {
    var arr = this.widget.getSelection();
    if(arr && arr.length) {
        var selectedItem = arr[0];
        var dialog = ZaTaskContentView._getDialog(selectedItem);
        dialog.popup();
        var position = selectedItem.position;
        dialog.setBounds(position.x, position.y, position.width, position.height);
        if (dialog.handleXFormChange) {
            dialog.handleXFormChange();
        }
    }
}

ZaTaskContentView.myXFormModifier = function(xFormObject, entry) {
    var cases = [];

    var case1 = {
        type: _ZATABCASE_,
        numCols: 1,
        caseKey: 1,
        paddingStyle: "",
        width: "100%",
        getCustomWidth: ZaTaskContentView.prototype.getCustomWidth,
        getCustomHeight: ZaTaskContentView.prototype.getCustomHeight,
        items:[
            {
                type: _AJX_IMAGE_,
                src: "WorkInProgress",
                label: null,
                containerCssStyle: "text-align:center;",
                visibilityChecks: [
                    [
                        XForm.checkInstanceValue,
                        ZaTask.A2_isExpanded,
                        false
                    ]
                ],
                visibilityChangeEventSources: [
                    ZaTask.A2_isExpanded
                ]
            },
            {
                ref: ZaTask.A_workingInProcess,
                type: _OUTPUT_,
                bmolsnr: true,
                value: 0,
                visibilityChecks: [
                    [
                        XForm.checkInstanceValue,
                        ZaTask.A2_isExpanded,
                        false
                    ]
                ],
                visibilityChangeEventSources: [
                    ZaTask.A2_isExpanded
                ],
                containerCssStyle: "padding-bottom:10px;text-align:center;",
                getDisplayValue: function(newValue) {
                    return newValue.length;
                }
            },
            {
                type: _GROUP_,
                numCols: 1,
                visibilityChecks: [
                    [
                        XForm.checkInstanceValue,
                        ZaTask.A2_isExpanded,
                        true
                    ]
                ],
                visibilityChangeEventSources: [
                    ZaTask.A2_isExpanded
                ],
                cssClass: "ZaTaskListGroup",
                items: [
                    {
                        type: _COMPOSITE_,
                        numCols: 3,
                        tableCssStyle: "width:100%",
                        visibilityChecks: [
                            [
                                XForm.checkInstanceValue,
                                ZaTask.A2_isWIPExpanded,
                                true
                            ]
                        ],
                        visibilityChangeEventSources: [
                            ZaTask.A2_isWIPExpanded
                        ],
                        colSizes: [
                            "18px",
                            "16px",
                            "100%"
                        ],
                        items: [
                            {
                                type: _DWT_IMAGE_,
                                value: "ImgNodeExpanded",
                                cssStyle: "position:static;",
                                onClick: function() {
                                    this.setInstanceValue(false, ZaTask.A2_isWIPExpanded);
                                }
                            },
                            {
                                type: _AJX_IMAGE_,
                                src: "WorkInProgress",
                                label: null
                            },
                            {
                                type: _OUTPUT_,
                                value: ZaMsg.MSG_WorkingTask
                            }
                        ],
                        cssClass:"ZaTaskTitleNameHeader"
                    },
                    {
                        type: _COMPOSITE_,
                        numCols: 3,
                        tableCssStyle: "width:100%",
                        visibilityChecks: [
                            [
                                XForm.checkInstanceValue,
                                ZaTask.A2_isWIPExpanded,
                                false
                            ]
                        ],
                        visibilityChangeEventSources: [
                            ZaTask.A2_isWIPExpanded
                        ],
                        colSizes: [
                            "18px",
                            "16px",
                            "100%"
                        ],
                        items: [
                            {
                                type: _DWT_IMAGE_,
                                value: "ImgNodeCollapsed",
                                cssStyle: "position:static;",
                                onClick: function() {
                                    this.setInstanceValue(true, ZaTask.A2_isWIPExpanded);
                                }
                            },
                            {
                                type: _AJX_IMAGE_,
                                src: "WorkInProgress",
                                label: null
                            },
                            {
                                type: _OUTPUT_,
                                value: ZaMsg.MSG_WorkingTask
                            }
                        ],
                        cssClass:"ZaTaskTitleNameHeader"
                    },
                    {
                        ref: ZaTask.A_workingInProcess,
                        type: _DWT_LIST_,
                        cssClass: "ZaTaskListContent",
                        forceUpdate: true,
                        preserveSelection: false,
                        multiselect: false,
                        visibilityChecks: [
                            [
                                XForm.checkInstanceValue,
                                ZaTask.A2_isWIPExpanded,
                                true
                            ]
                        ],
                        visibilityChangeEventSources: [
                            ZaTask.A2_isWIPExpanded
                        ],
                        onSelection: ZaTaskContentView.taskItemSelectionListener
                    }
                ]
            },
            {
                type: _AJX_IMAGE_,
                src: "TaskViewWaiting",
                label: null,
                containerCssStyle: "text-align:center;",
                visibilityChecks: [
                    [
                        XForm.checkInstanceValue,
                        ZaTask.A2_isExpanded,
                        false
                    ]
                ],
                visibilityChangeEventSources: [
                    ZaTask.A2_isExpanded
                ]
            },
            {
                ref: ZaTask.A_runningTask,
                type: _OUTPUT_,
                bmolsnr: true,
                value: 0,
                visibilityChecks: [
                    [
                        XForm.checkInstanceValue,
                        ZaTask.A2_isExpanded,
                        false
                    ]
                ],
                visibilityChangeEventSources: [
                    ZaTask.A2_isExpanded
                ],
                containerCssStyle: "padding-bottom:10px;text-align:center;",
                getDisplayValue: function(newValue) {
                    return newValue.length;
                }
            },
            {
                type: _GROUP_,
                numCols: 1,
                visibilityChecks: [
                    [
                        XForm.checkInstanceValue,
                        ZaTask.A2_isExpanded,
                        true
                    ]
                ],
                visibilityChangeEventSources: [
                    ZaTask.A2_isExpanded
                ],
                cssClass: "ZaTaskListGroup",
                items: [
                    {
                        type:_COMPOSITE_,
                        numCols: 3,
                        tableCssStyle: "width:100%",
                        visibilityChecks: [
                            [
                                XForm.checkInstanceValue,
                                ZaTask.A2_isRTExpanded,
                                true
                            ]
                        ],
                        visibilityChangeEventSources: [
                            ZaTask.A2_isRTExpanded
                        ],
                        colSizes: [
                            "18px",
                            "16px",
                            "100%"
                        ],
                        items: [
                            {
                                type: _DWT_IMAGE_,
                                value: "ImgNodeExpanded",
                                cssStyle: "position:static;",
                                onClick: function() {
                                    this.setInstanceValue(false, ZaTask.A2_isRTExpanded);
                                }
                            },
                            {
                                type: _AJX_IMAGE_,
                                src: "TaskViewWaiting",
                                label: null
                            },
                            {
                                type: _OUTPUT_,
                                value: ZaMsg.MSG_RunningTask
                            }
                        ],
                        cssClass: "ZaTaskTitleNameHeader"
                    },
                    {
                        type: _COMPOSITE_,
                        numCols: 3,
                        tableCssStyle: "width:100%",
                        visibilityChecks: [
                            [
                                XForm.checkInstanceValue,
                                ZaTask.A2_isRTExpanded,
                                false
                            ]
                        ],
                        visibilityChangeEventSources: [
                            ZaTask.A2_isRTExpanded
                        ],
                        colSizes: [
                            "18px",
                            "16px",
                            "100%"
                        ],
                        items: [
                            {
                                type: _DWT_IMAGE_,
                                value: "ImgNodeCollapsed",
                                cssStyle: "position:static;",
                                onClick: function() {
                                    this.setInstanceValue(true, ZaTask.A2_isRTExpanded);
                                }
                            },
                            {
                                type: _AJX_IMAGE_,
                                src: "TaskViewWaiting",
                                label: null
                            },
                            {
                                type: _OUTPUT_,
                                value: ZaMsg.MSG_RunningTask
                            }
                        ],
                        cssClass: "ZaTaskTitleNameHeader"
                    },
                    {
                        ref: ZaTask.A_runningTask,
                        type: _DWT_LIST_,
                        cssClass: "ZaTaskListContent",
                        forceUpdate: true,
                        preserveSelection: false,
                        multiselect: false,
                        visibilityChecks: [
                            [
                                XForm.checkInstanceValue,
                                ZaTask.A2_isRTExpanded,
                                true
                            ]
                        ],
                        visibilityChangeEventSources: [
                            ZaTask.A2_isRTExpanded
                        ],
                        onSelection: ZaTaskContentView.taskItemSelectionListener
                    }
                ]
            },
            {
                type: _AJX_IMAGE_,
                src: "Status",
                label: null,
                containerCssStyle: "text-align:center;",
                visibilityChecks: [
                    [
                        XForm.checkInstanceValue,
                        ZaTask.A2_isExpanded,
                        false
                    ]
                ],
                visibilityChangeEventSources: [
                    ZaTask.A2_isExpanded
                ]
            },
            {
                ref: ZaTask.A2_notificationCount,
                type: _OUTPUT_,
                bmolsnr: true,
                value: 0,
                visibilityChecks: [
                    [
                        XForm.checkInstanceValue,
                        ZaTask.A2_isExpanded,
                        false
                    ]
                ],
                visibilityChangeEventSources: [
                    ZaTask.A2_isExpanded
                ],
                containerCssStyle: "padding-bottom:10px;text-align:center;",
                getDisplayValue: function(newValue) {
                    if (!newValue || newValue < 0) {
                        return 0;
                    }
                    return newValue;
                }
            },
            {
                type: _GROUP_,
                numCols: 1,
                visibilityChecks: [
                    [
                        XForm.checkInstanceValue,
                        ZaTask.A2_isExpanded,
                        true
                    ]
                ],
                visibilityChangeEventSources: [
                    ZaTask.A2_isExpanded
                ],
                cssClass: "ZaTaskListGroup",
                items: [
                    {
                        type: _COMPOSITE_,
                        numCols:3,
                        tableCssStyle: "width:100%",
                        visibilityChecks: [
                            [
                                XForm.checkInstanceValue,
                                ZaTask.A2_isServerExpaned,
                                true
                            ]
                        ],
                        visibilityChangeEventSources: [
                            ZaTask.A2_isServerExpaned
                        ],
                        colSizes: [
                            "18px",
                            "16px",
                            "100%"
                        ],
                        items: [
                            {
                                type: _DWT_IMAGE_,
                                value: "ImgNodeExpanded",
                                cssStyle: "position:static;",
                                onClick: function() {
                                    this.setInstanceValue(false, ZaTask.A2_isServerExpaned);
                                }
                            },
                            {
                                type: _AJX_IMAGE_,
                                src: "Status",
                                label: null
                            },
                            {
                                type: _OUTPUT_,
                                value: ZaMsg.MSG_ServerStatus
                            }
                        ],
                        cssClass: "ZaTaskTitleNameHeader"
                    },
                    {
                        type: _COMPOSITE_,
                        numCols: 3,
                        tableCssStyle: "width:100%",
                        visibilityChecks: [
                            [
                                XForm.checkInstanceValue,
                                ZaTask.A2_isServerExpaned,
                                false
                            ]
                        ],
                        visibilityChangeEventSources: [
                            ZaTask.A2_isServerExpaned
                        ],
                        colSizes: [
                            "18px",
                            "16px",
                            "100%"
                        ],
                        items: [
                            {
                                type: _DWT_IMAGE_,
                                value: "ImgNodeCollapsed",
                                cssStyle: "position:static;",
                                onClick: function() {
                                    this.setInstanceValue(true, ZaTask.A2_isServerExpaned);
                                }
                            },
                            {
                                type: _AJX_IMAGE_,
                                src: "Status",
                                label: null
                            },
                            {
                                type: _OUTPUT_,
                                value: ZaMsg.MSG_ServerStatus
                            }
                        ],
                        cssClass: "ZaTaskTitleNameHeader"
                    },
                    {
                        ref: ZaTask.A_serverStatus,
                        type: _GROUP_,
                        numCols: 1,
                        width: "100%",
                        cssClass: "ZaTaskListContent",
                        forceUpdate: true,
                        preserveSelection: false,
                        multiselect: false,
                        visibilityChecks: [
                            [
                                XForm.checkInstanceValue,
                                ZaTask.A2_isServerExpaned,
                                true
                            ]
                        ],
                        visibilityChangeEventSources: [
                            ZaTask.A2_isServerExpaned
                        ],
                        onSelection: ZaTaskContentView.taskItemSelectionListener,
                        items: [
                            {
                                type: _GROUP_,
                                tableCssClass: "NoResults",
                                width: "100%",
                                visibilityChecks: [
                                    [
                                        ZaTaskContentView.prototype.canShowServerStatusIsHealthy
                                    ]
                                ],
                                visibilityChangeEventSources: [
                                    ZaTask.A2_isRTExpanded,
                                    ZaTask.A2_notificationCount
                                ],
                                items: [
                                    {
                                        type: _OUTPUT_,
                                        value: "<br><br>" + ZaMsg.ServerStatusHealthy,
                                        width: "100%"
                                        //use  <br><br> to align the style of 'Running Tasks' and 'Work in Progress'
                                        //when they are 'No results found'
                                    }
                                ]
                            }
                            //will be appended by others as notification
                        ]
                    }
                ]
            },
            {
                type: _SPACER_,
                height: "10px"
            }
        ]
    };

    cases.push(case1);

    xFormObject.tableCssStyle = "width:100%;";
    xFormObject.items = [
        {
            type: _SWITCH_,
            align: _LEFT_,
            valign: _TOP_,
            items: cases
        }
    ];
}

ZaTaskContentView.prototype.canShowServerStatusIsHealthy = function () {
    var isRTExpanded = this.getInstanceValue( ZaTask.A2_isRTExpanded ) || false;
    var notificationCount = this.getInstanceValue(ZaTask.A2_notificationCount) || 0;
    return  isRTExpanded && (notificationCount == 0)
}

ZaTaskContentView.prototype.getCustomWidth = function () {
    return ZaTaskContentView.showStatusPane ? "100%" : "0px";
}

ZaTaskContentView.prototype.getCustomHeight = function () {
    return ZaTaskContentView.showStatusPane ? "100%" : "0px";
}

ZaTaskContentView.getImgText = function(imageName, label) {
    var     html = [
                "<div class='", "Img", imageName, "' style='text-align:center;'>",label,"</div>"
            ].join("");
    return html;
}
ZaTabView.XFormModifiers["ZaTaskContentView"].push(ZaTaskContentView.myXFormModifier);


ZaTaskContentView.getNotificationBoard = function (taskContentViewXFormObj) {
    return taskContentViewXFormObj.items[0].items[0].items[8].items[2];
}
