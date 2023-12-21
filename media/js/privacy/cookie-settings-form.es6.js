/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const COOKIE_ID = 'moz-consent-pref';
const COOKIE_EXPIRY_DAYS = 182; // 6 months

const CookieSettingsForm = {};

CookieSettingsForm.getPrefCookie = () => {
    try {
        return (
            window.Mozilla.Cookies.hasItem(COOKIE_ID) &&
            JSON.parse(window.Mozilla.Cookies.getItem(COOKIE_ID))
        );
    } catch (e) {
        return false;
    }
};

CookieSettingsForm.setPrefCookie = (data) => {
    try {
        const date = new Date();
        date.setDate(date.getDate() + COOKIE_EXPIRY_DAYS);
        const expires = date.toUTCString();

        window.Mozilla.Cookies.setItem(
            COOKIE_ID,
            JSON.stringify(data),
            expires,
            '/',
            CookieSettingsForm.getHostName(),
            false,
            'lax'
        );

        return true;
    } catch (e) {
        return false;
    }
};

CookieSettingsForm.getHostName = () => {
    const url = window.location.hostname;
    let domain = null;

    if (url.indexOf('.allizom.org') !== -1) {
        domain = '.allizom.org';
    }

    if (url.indexOf('.mozilla.org') !== -1) {
        domain = '.mozilla.org';
    }

    return domain;
};

CookieSettingsForm.getFormData = () => {
    const form = document.querySelector('.cookie-consent-form');
    const formData = new FormData(form);

    return {
        functional: formData.get('cookie-radio-functional') === 'yes',
        analytics: formData.get('cookie-radio-analytics') === 'yes',
        marketing: formData.get('cookie-radio-marketing') === 'yes'
    };
};

CookieSettingsForm.setFormData = (data) => {
    // functional cookie yes
    document.getElementById('cookie-radio-functional-yes').checked =
        data.functional;

    // functional cookie no
    document.getElementById('cookie-radio-functional-no').checked =
        !data.functional;

    // analytics cookie yes
    document.getElementById('cookie-radio-analytics-yes').checked =
        data.analytics;

    // analytics cookie no
    document.getElementById('cookie-radio-analytics-no').checked =
        !data.analytics;

    // marketing cookie yes
    document.getElementById('cookie-radio-marketing-yes').checked =
        data.marketing;

    // marketing cookie no
    document.getElementById('cookie-radio-marketing-no').checked =
        !data.marketing;
};

CookieSettingsForm.onFormSubmit = (e) => {
    e.preventDefault();
    const config = CookieSettingsForm.getFormData();
    CookieSettingsForm.setPrefCookie(config);
};

CookieSettingsForm.unbindEvents = () => {
    document
        .querySelector('.cookie-consent-form')
        .removeEventListener('submit', CookieSettingsForm.onFormSubmit, false);
};

CookieSettingsForm.bindEvents = () => {
    document
        .querySelector('.cookie-consent-form')
        .addEventListener('submit', CookieSettingsForm.onFormSubmit, false);
};

CookieSettingsForm.initBreadCrumbLinks = () => {
    const breadCrumbLinks = document.querySelector('.mzp-c-breadcrumb');

    if (!breadCrumbLinks) {
        return;
    }

    // Only show previous page link if there's page history.
    if (window.history.length > 1) {
        breadCrumbLinks.classList.remove('is-hidden');

        breadCrumbLinks.addEventListener(
            'click',
            (e) => {
                e.preventDefault();
                window.history.back();
            },
            false
        );
    }
};

CookieSettingsForm.init = () => {
    const defaultConfig = {
        functional: false,
        analytics: false,
        marketing: false
    };
    const config = CookieSettingsForm.getPrefCookie() || defaultConfig;

    CookieSettingsForm.setFormData(config);
    CookieSettingsForm.bindEvents();
    CookieSettingsForm.initBreadCrumbLinks();
};

export default CookieSettingsForm;
