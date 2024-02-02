/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {
    BrowserClient,
    Dedupe,
    GlobalHandlers,
    HttpContext,
    TryCatch,
    defaultStackParser,
    getCurrentHub,
    makeFetchTransport
} from '@sentry/browser';

function handleEvent(e) {
    const hasConsent = e.detail.analytics;

    if (hasConsent) {
        // Get Data Source Name (DSN)
        const sentryDsn = document
            .getElementsByTagName('html')[0]
            .getAttribute('data-sentry-dsn');

        const client = new BrowserClient({
            dsn: sentryDsn,
            sampleRate: 0.1,
            transport: makeFetchTransport,
            stackParser: defaultStackParser,
            integrations: [
                new Dedupe(),
                new GlobalHandlers(),
                new HttpContext(),
                new TryCatch()
            ]
        });

        getCurrentHub().bindClient(client);

        window.removeEventListener('mozConsentChange', handleEvent, false);
    }
}

window.addEventListener('mozConsentChange', handleEvent, false);
