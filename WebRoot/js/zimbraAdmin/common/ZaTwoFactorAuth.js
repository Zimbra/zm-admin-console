/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2024 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2024 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates ZaTwoFactorAuth.
 * @class
 * This class is used for two-step authentication settings.
 * 
 */
ZaTwoFactorAuth = function() {
    // do nothing
};

// Consts
ZaTwoFactorAuth.DEFAULT_ORDER = ["app", "email"];
ZaTwoFactorAuth.APP = "app";
ZaTwoFactorAuth.EMAIL = "email";

ZaTwoFactorAuth.ACTION_RESET = "reset";
ZaTwoFactorAuth.ACTION_EMAIL = "email";
ZaTwoFactorAuth.ACTION_UNKNOWN = "unknown";
ZaTwoFactorAuth.RESET_FAILED = "reset failed";
ZaTwoFactorAuth.NOT_SENT = "not sent";

/**
 * non-prototype function.
 *
 * Return sorted zimbraTwoFactorAuthMethodAllowed
 */
ZaTwoFactorAuth.getTwoFactorAuthMethodAllowed =
function(authResponse) {
    var allowedMethod = [];
    if (authResponse) {
        var zimbraTwoFactorAuthMethodAllowed = authResponse.zimbraTwoFactorAuthMethodAllowed;
        if (zimbraTwoFactorAuthMethodAllowed && zimbraTwoFactorAuthMethodAllowed.method) {
            for (var i = 0; i < zimbraTwoFactorAuthMethodAllowed.method.length; i++) {
                allowedMethod.push(zimbraTwoFactorAuthMethodAllowed.method[i]._content);
            }
        }
    }
    if (allowedMethod.length === 0) {
        // for backward compatibility
        allowedMethod = [ZaTwoFactorAuth.APP];
    }

    // do not update allowedMethod directly
    var allowedMethodSorted = [];
    for (var i = 0; i < ZaTwoFactorAuth.DEFAULT_ORDER.length; i++) {
        if (allowedMethod.indexOf(ZaTwoFactorAuth.DEFAULT_ORDER[i]) !== -1) {
            allowedMethodSorted.push(ZaTwoFactorAuth.DEFAULT_ORDER[i]);
        }
    }
    return allowedMethodSorted;
};

/**
 * non-prototype function.
 *
 * Return two-factor authentication methods which are allowed and enabled
 */
ZaTwoFactorAuth.getTwoFactorAuthMethodAllowedAndEnabled =
function(authResponse) {
    var allowedMethod = ZaTwoFactorAuth.getTwoFactorAuthMethodAllowed(authResponse);
    var enabledMethod = [];
    if (authResponse) {
        var zimbraTwoFactorAuthMethodEnabled = authResponse.zimbraTwoFactorAuthMethodEnabled;
        if (zimbraTwoFactorAuthMethodEnabled && zimbraTwoFactorAuthMethodEnabled.method) {
            for (var i = 0; i < zimbraTwoFactorAuthMethodEnabled.method.length; i++) {
                var method = zimbraTwoFactorAuthMethodEnabled.method[i]._content;
                if (method === ZaTwoFactorAuth.EMAIL) {
                    var maskedEmailAddress = authResponse.zimbraPrefPasswordRecoveryAddress && authResponse.zimbraPrefPasswordRecoveryAddress._content;
                    if (!maskedEmailAddress) {
                        continue;
                    }
                }
                enabledMethod.push(zimbraTwoFactorAuthMethodEnabled.method[i]._content);
            }
        }
    }
    // for backward compatibility
    if (enabledMethod.length == 0 && authResponse.twoFactorAuthRequired && authResponse.twoFactorAuthRequired._content === "true") {
        enabledMethod = [ZaTwoFactorAuth.APP];
    }

    var allowedAndEnabledMethod = [];
    for (var i = 0; i < allowedMethod.length; i++) {
        if (enabledMethod.indexOf(allowedMethod[i]) !== -1) {
            allowedAndEnabledMethod.push(allowedMethod[i]);
        }
    }

    return allowedAndEnabledMethod;
};

/**
 * non-prototype function.
 *
 * Return zimbraPrefPrimaryTwoFactorAuthMethod considering allowed and enabled Methods
 */
ZaTwoFactorAuth.getPrefPrimaryTwoFactorAuthMethod =
function(authResponse) {
    var enabledMethod = ZaTwoFactorAuth.getTwoFactorAuthMethodAllowedAndEnabled(authResponse);
    var primaryMethod;
    if (authResponse) {
        var zimbraPrefPrimaryTwoFactorAuthMethod = authResponse.zimbraPrefPrimaryTwoFactorAuthMethod;
        primaryMethod = zimbraPrefPrimaryTwoFactorAuthMethod && zimbraPrefPrimaryTwoFactorAuthMethod._content;
    }

    if (primaryMethod && enabledMethod.indexOf(primaryMethod) !== -1) {
        return primaryMethod;
    }
    return enabledMethod ? enabledMethod[0] : null;
};
