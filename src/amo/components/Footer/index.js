/* @flow */
import * as React from 'react';
import { compose } from 'redux';
import config from 'config';

import LanguagePicker from 'amo/components/LanguagePicker';
import Link from 'amo/components/Link';
import { makeQueryStringWithUTM, sanitizeHTML } from 'amo/utils';
import translate from 'amo/i18n/translate';
import Icon from 'amo/components/Icon';
import {
  getStoredTheme,
  setStoredTheme,
  getNextTheme,
  getEffectiveTheme,
} from 'amo/utils/theme';
import type { ThemePreference } from 'amo/utils/theme';
import type { I18nType } from 'amo/types/i18n';

import './styles.scss';

type Props = {|
  noLangPicker?: boolean,
  includeGoogleDisclaimer?: boolean,
|};

type DefaultProps = {|
  _config: typeof config,
|};

type InternalProps = {|
  ...Props,
  ...DefaultProps,
  i18n: I18nType,
|};

type State = {|
  themePreference: ThemePreference,
|};

export class FooterBase extends React.Component<InternalProps, State> {
  static defaultProps: {| ...Props, ...DefaultProps |} = {
    _config: config,
    noLangPicker: false,
  };

  constructor(props: InternalProps) {
    super(props);
    this.state = {
      themePreference: getStoredTheme(),
    };
  }

  onToggleTheme: () => void = () => {
    const next = getNextTheme(this.state.themePreference);
    setStoredTheme(next);
    this.setState({ themePreference: next });
  };

  getThemeLabel(): string {
    const { i18n } = this.props;
    const { themePreference } = this.state;
    const effective = getEffectiveTheme(themePreference);

    switch (themePreference) {
      case 'light':
        return i18n.gettext('Light');
      case 'dark':
        return i18n.gettext('Dark');
      default:
        return effective === 'dark'
          ? i18n.gettext('Auto (Dark)')
          : i18n.gettext('Auto (Light)');
    }
  }

  getThemeIcon(): React.Node {
    const { themePreference } = this.state;
    const effective = getEffectiveTheme(themePreference);

    if (themePreference === 'system') {
      // Monitor/system icon
      return (
        <svg
          viewBox="0 0 16 16"
          width="16"
          height="16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v7a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm4.5 10h3v1h-3v-1zM5 14h6v-1H5v1z" />
        </svg>
      );
    }
    if (effective === 'dark') {
      // Moon icon
      return (
        <svg
          viewBox="0 0 16 16"
          width="16"
          height="16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M6 2a6 6 0 108 8c-4.4 0-8-3.6-8-8z" />
        </svg>
      );
    }
    // Sun icon
    return (
      <svg
        viewBox="0 0 16 16"
        width="16"
        height="16"
        fill="currentColor"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="3" />
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  render(): React.Node {
    const { _config, includeGoogleDisclaimer, i18n, noLangPicker } = this.props;
    const homepageText = i18n.gettext("Go to Mozilla's homepage");

    return (
      <footer className="Footer">
        <div className="Footer-wrapper">
          <div className="Footer-mozilla-link-wrapper">
            <a
              className="Footer-mozilla-link"
              href="https://mozilla.org/"
              title={homepageText}
            >
              <Icon
                alt={homepageText}
                className="Footer-mozilla-logo"
                name="mozilla"
              />
            </a>
          </div>

          <section className="Footer-amo-links">
            <h4 className="Footer-links-header">
              <Link href="/">{i18n.gettext('Add-ons')}</Link>
            </h4>
            <ul className="Footer-links">
              <li>
                <Link to="/about" prependClientApp={false}>
                  {i18n.gettext('About')}
                </Link>
              </li>
              <li>
                <a className="Footer-blog-link" href="/blog/">
                  {i18n.gettext('Firefox Add-ons Blog')}
                </a>
              </li>
              <li>
                <a
                  className="Footer-extension-workshop-link"
                  href={`${_config.get(
                    'extensionWorkshopUrl',
                  )}/${makeQueryStringWithUTM({
                    utm_content: 'footer-link',
                    utm_campaign: null,
                  })}`}
                >
                  {i18n.gettext('Extension Workshop')}
                </a>
              </li>
              <li>
                <Link href="/developers/" prependClientApp={false}>
                  {i18n.gettext('Developer Hub')}
                </Link>
              </li>
              <li>
                <a
                  className="Footer-developer-policies-link"
                  href={`${_config.get(
                    'extensionWorkshopUrl',
                  )}/documentation/publish/add-on-policies/${makeQueryStringWithUTM(
                    {
                      utm_medium: 'photon-footer',
                      utm_campaign: null,
                    },
                  )}`}
                >
                  {i18n.gettext('Developer Policies')}
                </a>
              </li>
              <li>
                <a
                  className="Footer-community-blog-link"
                  href={`https://blog.mozilla.com/addons${makeQueryStringWithUTM(
                    {
                      utm_campaign: null,
                      utm_content: 'footer-link',
                      utm_medium: 'referral',
                    },
                  )}`}
                >
                  {i18n.gettext('Community Blog')}
                </a>
              </li>
              <li>
                <a href="https://discourse.mozilla-community.org/c/add-ons">
                  {i18n.gettext('Forum')}
                </a>
              </li>
              <li>
                <a
                  className="Footer-bug-report-link"
                  href="https://developer.mozilla.org/docs/Mozilla/Add-ons/Contact_us"
                >
                  {i18n.gettext('Report a bug')}
                </a>
              </li>
              <li>
                <Link to="/review_guide" prependClientApp={false}>
                  {i18n.gettext('Review Guide')}
                </Link>
              </li>
            </ul>
          </section>

          <section className="Footer-browsers-links">
            <h4 className="Footer-links-header">{i18n.gettext('Browsers')}</h4>
            <ul className="Footer-links">
              <li>
                <a
                  className="Footer-desktop-link"
                  href={`https://www.mozilla.org/firefox/new/${makeQueryStringWithUTM(
                    {
                      utm_content: 'footer-link',
                      utm_campaign: null,
                    },
                  )}`}
                >
                  Desktop
                </a>
              </li>
              <li>
                <a
                  className="Footer-mobile-link"
                  href={`https://www.mozilla.org/firefox/mobile/${makeQueryStringWithUTM(
                    {
                      utm_content: 'footer-link',
                      utm_campaign: null,
                    },
                  )}`}
                >
                  Mobile
                </a>
              </li>
              <li>
                <a
                  className="Footer-enterprise-link"
                  href={`https://www.mozilla.org/firefox/enterprise/${makeQueryStringWithUTM(
                    {
                      utm_content: 'footer-link',
                      utm_campaign: null,
                    },
                  )}`}
                >
                  Enterprise
                </a>
              </li>
            </ul>
          </section>

          <section className="Footer-product-links">
            <h4 className="Footer-links-header">{i18n.gettext('Products')}</h4>
            <ul className="Footer-links">
              <li>
                <a
                  className="Footer-browsers-link"
                  href={`https://www.mozilla.org/firefox/browsers/${makeQueryStringWithUTM(
                    {
                      utm_content: 'footer-link',
                      utm_campaign: null,
                    },
                  )}`}
                >
                  Browsers
                </a>
              </li>
              <li>
                <a
                  className="Footer-vpn-link"
                  href={`https://www.mozilla.org/products/vpn/${makeQueryStringWithUTM(
                    {
                      utm_content: 'footer-link',
                      utm_campaign: null,
                    },
                  )}#pricing`}
                >
                  VPN
                </a>
              </li>
              <li>
                <a
                  className="Footer-relay-link"
                  href={`https://relay.firefox.com/${makeQueryStringWithUTM({
                    utm_content: 'footer-link',
                    utm_campaign: null,
                  })}`}
                >
                  Relay
                </a>
              </li>
              <li>
                <a
                  className="Footer-monitor-link"
                  href={`https://monitor.firefox.com/${makeQueryStringWithUTM({
                    utm_content: 'footer-link',
                    utm_campaign: null,
                  })}`}
                >
                  Monitor
                </a>
              </li>
              <li>
                <a
                  className="Footer-pocket-link"
                  href={`https://getpocket.com${makeQueryStringWithUTM({
                    utm_content: 'footer-link',
                    utm_campaign: null,
                  })}`}
                >
                  Pocket
                </a>
              </li>
            </ul>
            <ul className="Footer-links Footer-links-social">
              <li className="Footer-link-social">
                <a href="https://bsky.app/profile/firefox.com">
                  <Icon name="bluesky" alt="Bluesky (@firefox.com)" />
                </a>
              </li>
              <li className="Footer-link-social">
                <a href="https://www.instagram.com/firefox/">
                  <Icon name="instagram" alt="Instagram (Firefox)" />
                </a>
              </li>
              <li className="Footer-link-social">
                <a href="https://www.youtube.com/firefoxchannel">
                  <Icon name="youtube" alt="YouTube (firefoxchannel)" />
                </a>
              </li>
            </ul>
          </section>

          <ul className="Footer-legal-links">
            <li>
              <a
                className="Footer-privacy-link"
                href="https://www.mozilla.org/privacy/websites/"
              >
                {i18n.gettext('Privacy')}
              </a>
            </li>
            <li>
              <a
                className="Footer-cookies-link"
                href="https://www.mozilla.org/privacy/websites/"
              >
                {i18n.gettext('Cookies')}
              </a>
            </li>
            <li>
              <a
                className="Footer-legal-link"
                href="https://www.mozilla.org/about/legal/amo-policies/"
              >
                {i18n.gettext('Legal')}
              </a>
            </li>
          </ul>

          <p
            className="Footer-copyright"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={sanitizeHTML(
              i18n.sprintf(
                includeGoogleDisclaimer
                  ? i18n.gettext(`Except where otherwise
                      %(startNotedLink)snoted%(endNotedLink)s, content on this
                      site is licensed under the %(startLicenseLink)sCreative
                      Commons Attribution Share-Alike License
                      v3.0%(endLicenseLink)s or any later version. Android is a
                      trademark of Google LLC.`)
                  : i18n.gettext(`Except where otherwise
                      %(startNotedLink)snoted%(endNotedLink)s, content on this
                      site is licensed under the %(startLicenseLink)sCreative
                      Commons Attribution Share-Alike License
                      v3.0%(endLicenseLink)s or any later version.`),
                {
                  startNotedLink:
                    '<a href="https://www.mozilla.org/en-US/about/legal/">',
                  endNotedLink: '</a>',
                  startLicenseLink:
                    '<a href="https://creativecommons.org/licenses/by-sa/3.0/">',
                  endLicenseLink: '</a>',
                },
              ),
              ['a'],
            )}
          />

          <div className="Footer-theme-toggle">
            <button
              className="Footer-theme-toggle-button"
              onClick={this.onToggleTheme}
              type="button"
              title={i18n.gettext('Toggle color theme')}
            >
              <span className="Footer-theme-toggle-icon">
                {this.getThemeIcon()}
              </span>
              <span className="Footer-theme-toggle-label">
                {this.getThemeLabel()}
              </span>
            </button>
          </div>

          {!noLangPicker && (
            <div className="Footer-language-picker">
              <LanguagePicker />
            </div>
          )}
        </div>
      </footer>
    );
  }
}

const Footer: React.ComponentType<Props> = compose(translate())(FooterBase);

export default Footer;
