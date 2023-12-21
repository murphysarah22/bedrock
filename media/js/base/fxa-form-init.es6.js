/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import FxaForm from './fxa-form.es6.js';

function handleEvent(e) {
    const hasConsent = e.detail.analytics;

    if (hasConsent) {
        FxaForm.init();

        window.removeEventListener('mozConsentChange', handleEvent, false);
    }
}

// Configure Sync for Firefox desktop browsers.
FxaForm.configureSync();

window.addEventListener('mozConsentChange', handleEvent, false);
