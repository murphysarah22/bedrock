/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import CookieSettingsForm from '../../../../media/js/privacy/cookie-settings-form.es6';

describe('CookieSettingsForm', function () {
    beforeEach(function () {
        const form = `<form class="cookie-consent-form">
            <ul>
                <li class="cookie-category">
                    <h3 class="cookie-category-title">Functional</h3>
                    <div class="cookie-control" id="cookie-control-functional">
                        <label for="cookie-radio-functional-yes" class="cookie-control-label mzp-u-inline">
                            <input type="radio" name="cookie-radio-functional" id="cookie-radio-functional-yes" value="yes">
                            I Consent
                        </label>

                        <label for="cookie-radio-functional-no" class="cookie-control-label mzp-u-inline">
                            <input type="radio" name="cookie-radio-functional" id="cookie-radio-functional-no" value="no">
                            I Do Not Consent
                        </label>
                    </div>
                </li>
                <li class="cookie-category">
                    <h3 class="cookie-category-title">Analytics</h3>
                    <div class="cookie-control" id="cookie-control-analytics">
                        <label for="cookie-radio-analytics-yes" class="cookie-control-label mzp-u-inline">
                            <input type="radio" name="cookie-radio-analytics" id="cookie-radio-analytics-yes" value="yes">
                            I Consent
                        </label>

                        <label for="cookie-radio-analytics-no" class="cookie-control-label mzp-u-inline">
                            <input type="radio" name="cookie-radio-analytics" id="cookie-radio-analytics-no" value="no">
                            I Do Not Consent
                        </label>
                    </div>
                </li>
                <li class="cookie-category">
                    <h3 class="cookie-category-title">Marketing</h3>
                    <div class="cookie-control" id="cookie-control-marketing">
                        <label for="cookie-radio-marketing-yes" class="cookie-control-label mzp-u-inline">
                            <input type="radio" name="cookie-radio-marketing" id="cookie-radio-marketing-yes" value="yes">
                            I Consent
                        </label>

                        <label for="cookie-radio-marketing-no" class="cookie-control-label mzp-u-inline">
                            <input type="radio" name="cookie-radio-marketing" id="cookie-radio-marketing-no" value="no">
                            I Do Not Consent
                        </label>
                    </div>
                </li>
            </ul>
            <button class="cookie-consent-form-submit mzp-c-button" type="submit">Save Changes</button>
        </form>`;

        document.body.insertAdjacentHTML('beforeend', form);
    });

    afterEach(function () {
        const form = document.querySelector('.cookie-consent-form');

        if (form) {
            form.parentNode.removeChild(form);
        }
    });

    describe('init()', function () {
        it('should initialize default form data if no preference cookie exists', function () {
            spyOn(window.Mozilla.Cookies, 'hasItem').and.returnValue(false);
            CookieSettingsForm.init();
            expect(window.Mozilla.Cookies.hasItem).toHaveBeenCalledWith(
                'moz-consent-pref'
            );
            expect(
                document.getElementById('cookie-radio-functional-no').checked
            ).toBeTruthy();
            expect(
                document.getElementById('cookie-radio-functional-yes').checked
            ).toBeFalsy();
            expect(
                document.getElementById('cookie-radio-analytics-no').checked
            ).toBeTruthy();
            expect(
                document.getElementById('cookie-radio-analytics-yes').checked
            ).toBeFalsy();
            expect(
                document.getElementById('cookie-radio-marketing-no').checked
            ).toBeTruthy();
            expect(
                document.getElementById('cookie-radio-marketing-yes').checked
            ).toBeFalsy();
        });

        it('should update default form data using preference cookie values if they exist', function () {
            const preferences =
                '{"functional":true,"analytics":true,"marketing":true}';

            spyOn(window.Mozilla.Cookies, 'hasItem').and.returnValue(true);
            spyOn(window.Mozilla.Cookies, 'getItem').and.returnValue(
                preferences
            );
            CookieSettingsForm.init();
            expect(window.Mozilla.Cookies.hasItem).toHaveBeenCalledWith(
                'moz-consent-pref'
            );
            expect(
                document.getElementById('cookie-radio-functional-no').checked
            ).toBeFalsy();
            expect(
                document.getElementById('cookie-radio-functional-yes').checked
            ).toBeTruthy();
            expect(
                document.getElementById('cookie-radio-analytics-no').checked
            ).toBeFalsy();
            expect(
                document.getElementById('cookie-radio-analytics-yes').checked
            ).toBeTruthy();
            expect(
                document.getElementById('cookie-radio-marketing-no').checked
            ).toBeFalsy();
            expect(
                document.getElementById('cookie-radio-marketing-yes').checked
            ).toBeTruthy();
        });

        it('should only update specific preferences that have consent', function () {
            const preferences =
                '{"functional":true,"analytics":false,"marketing":false}';

            spyOn(window.Mozilla.Cookies, 'hasItem').and.returnValue(true);
            spyOn(window.Mozilla.Cookies, 'getItem').and.returnValue(
                preferences
            );
            CookieSettingsForm.init();
            expect(window.Mozilla.Cookies.hasItem).toHaveBeenCalledWith(
                'moz-consent-pref'
            );
            expect(
                document.getElementById('cookie-radio-functional-no').checked
            ).toBeFalsy();
            expect(
                document.getElementById('cookie-radio-functional-yes').checked
            ).toBeTruthy();
            expect(
                document.getElementById('cookie-radio-analytics-no').checked
            ).toBeTruthy();
            expect(
                document.getElementById('cookie-radio-analytics-yes').checked
            ).toBeFalsy();
            expect(
                document.getElementById('cookie-radio-marketing-no').checked
            ).toBeTruthy();
            expect(
                document.getElementById('cookie-radio-marketing-yes').checked
            ).toBeFalsy();
        });

        it('should set a preference cookie when the form is submitted', function () {
            spyOn(window.Mozilla.Cookies, 'setItem');
            spyOn(CookieSettingsForm, 'getHostName').and.returnValue(
                '.mozilla.org'
            );

            CookieSettingsForm.init();
            document.getElementById('cookie-radio-functional-yes').click();
            document.getElementById('cookie-radio-analytics-yes').click();
            document.getElementById('cookie-radio-marketing-yes').click();
            document.querySelector('.cookie-consent-form-submit').click();
            expect(window.Mozilla.Cookies.setItem).toHaveBeenCalledWith(
                'moz-consent-pref',
                '{"functional":true,"analytics":true,"marketing":true}',
                jasmine.any(String),
                '/',
                '.mozilla.org',
                false,
                'lax'
            );
        });

        it('should set a preference cookie with the same values that are reflected in the form', function () {
            spyOn(window.Mozilla.Cookies, 'setItem');
            spyOn(CookieSettingsForm, 'getHostName').and.returnValue(
                '.mozilla.org'
            );

            CookieSettingsForm.init();
            document.getElementById('cookie-radio-functional-no').click();
            document.getElementById('cookie-radio-analytics-yes').click();
            document.getElementById('cookie-radio-marketing-no').click();
            document.querySelector('.cookie-consent-form-submit').click();
            expect(window.Mozilla.Cookies.setItem).toHaveBeenCalledWith(
                'moz-consent-pref',
                '{"functional":false,"analytics":true,"marketing":false}',
                jasmine.any(String),
                '/',
                '.mozilla.org',
                false,
                'lax'
            );
        });
    });
});
