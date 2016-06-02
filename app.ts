
import {Router, NavModel, RouterConfiguration } from 'aurelia-router';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Page, PageElement} from './helpers/page';
import {$} from './helpers/domop';
import * as ajax from 'nanoajax';
import * as encrypt from './helpers/cheap-encrypt';
import {Login} from './app-login';
import {ModernModal} from './helpers/modern-modal';
import {Logger} from './helpers/logger';
import {ErrorHandler} from './helpers/errorHandler';



interface PageConfiguration {
  route: NavModel;
}

export interface MenuItem {
  name: string;
  pages: TabPage[];
  def: string;
  defRoute?: NavModel;
  isActive: boolean;
  routes?: NavModel[];
}

// TODO - Potential for recursive functionality
export interface TabPage {
  name: string;
  hidden?: boolean;
  subPages?: TabPage[];
}


@inject(Element, EventAggregator, ModernModal, Logger, ErrorHandler)
export class App {

  version = '0.4.0';

  router: Router;

  page = Page;

  lightsTimeout = 0;
  lightsOnTimeout = false;

  public mainMenu = [
    {
      name:     'Home',
      pages: [
        {name: 'About'},
        {name: 'Rules'},
        {name: 'FAQ'},
        {name: 'Signin', subPages: [
            {name: 'Invite'},
            {name: 'Signup'}
          ]
        }
      ],
      def:      'About',
      isActive: false,
      defRoute: null,
      routes:   new Array<NavModel>()
    },
    {
      name:     'Chat',
      pages:    [{name: 'Chat'}],
      def:      null,
      isActive: false,
      defRoute: null,
      routes:   new Array<NavModel>()
    },
    {
      name:     'Changelog',
      pages:    [{name: 'Changelog'}],
      def:      null,
      isActive: false,
      defRoute: null,
      routes:   new Array<NavModel>()
    }
  ];

  // Navigation menu list
  navList = [
    {
      name:     'Home',
      pages:    ['About', 'Rules', 'FAQ', 'Signin'],
      def:      'About',
      isActive: false,
      defRoute: null,
      routes:   new Array<NavModel>()
    },
    {
      name:     'Chat',
      pages:    ['Chat'],
      def:      null,
      isActive: false,
      defRoute: null,
      routes:   new Array<NavModel>()
    },
    {
      name:     'Changelog',
      pages:    ['Changelog'],
      def:      null,
      isActive: false,
      defRoute: null,
      routes:   new Array<NavModel>()
    }
  ];

  // page = Page;

  // Currently active navigation routes (Populated)
  activeRoutes = new Array<NavModel>();

  private _scrollbars:   IOptiscrollInstance;
  private _modalOverlay: HTMLElement;
  private _login:        Login;

  constructor(private elem:          Element,
              private _eva:          EventAggregator,
              private _modal:        ModernModal,
              private _log:          Logger,
              private _errorHandler: ErrorHandler)
  {

    this._initFirstMenuItem();


    window.onresize = (ev: UIEvent) => {
      if (this._scrollbars)
        this._scrollbars.update();
    };


  }


  /**
   * Makes sure that the proper menu/page elements are higlighted
   * when the site is loaded for the first time.
   */
  private _initFirstMenuItem() {

    this._eva.subscribeOnce('router:navigation:complete', payload => {

      let activePage = payload.instruction.fragment.substr(1).toLowerCase();

      for (var item of this.mainMenu) {

        this.router.navigation.forEach(route => {

          if (item.name.toLowerCase() === route.config['navName']) {

            // Set active MenuItem obj based on page URL
            if (route.title.toLowerCase() === activePage)
              item.isActive = true;

            // Set the default route object
            if (item.def === route.title) {
              item.defRoute = route;
            }

            // Add routes to INav template obj
            item.routes.push(route);
          }
        });

        if (item.isActive) {
          this.populateRoutes(item);
        }

      }

      this._login = new Login(this._modal);


    });
  }


  /**
   * Sets up an event that fires on every successful page
   * navigation.
   */
  private _setupNavigationCallbackHandler() {

    this._eva.subscribe('router:navigation:complete', payload => {

      // ############   HANDLE PAGE SCROLLBARS   ############ //
      // Make sure there are no active scrollbars
      if (this._scrollbars) this._scrollbars.destroy();

      let content = document.getElementById('PageContent');

      // Only activate scrollbar if the page contains the optiscroll class
      if (content.querySelector('section.optiscroll-content')) {
        this._scrollbars = new Optiscroll(content, {
          autoUpdate: false
        });
      }

      // ############   HANDLE TAB POPULATION   ############ //
      // Execute only if routes have been populated
      // Toggles the tabs on back/forward
      if (this.mainMenu[0].routes.length) {
        this.mainMenu.forEach(n => {
          n.isActive = n.name == payload.instruction.config.navName;
          if (n.isActive) {
            this.populateRoutes(n, null, false);
          }
        });
      }

    });

  }


  /** Aurelia router configuration */
  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Webaeble';
    this.createRoutes(this.mainMenu, config);
    this.router = router;
    console.log(this.router);
  }


  lightsOnOff(ev: MouseEvent) {


    if (ev.button == 0) {

      if (this.lightsOnTimeout) return;
      this.lightsOnTimeout = true;

      let obj = <HTMLElement>ev.target
        , transition = document.createElement('style')
        , timeoutSpeed = 750;

      let transHTML =
        '<style id="Transition">' +
        '* { transition: all .5s !important; }' +
        '</style>';

      $('head')[0].insertAdjacentHTML('afterbegin', transHTML);

      if (obj.classList.contains('light')) {
        localStorage.setItem('lights', 'off');
        obj.classList.remove('light');
        obj.classList.add('dark');
        $('#Theme')[0].setAttribute('href', '../css/themes/dark/theme.css');
        this.lightsTimeout = setTimeout(() => {
          $('head')[0].removeChild($('#Transition')[0]);
          this.lightsOnTimeout = false;
        }, timeoutSpeed);

      }
      else {
        localStorage.setItem('lights', 'on');
        obj.classList.remove('dark');
        obj.classList.add('light');
        $('#Theme')[0].setAttribute('href', '../css/themes/light/theme.css');
        this.lightsTimeout = setTimeout(() => {
          $('head')[0].removeChild($('#Transition')[0]);
          this.lightsOnTimeout = false;
        }, timeoutSpeed);
      }
    }

  }


  /**
   * Map the default navigation routes for the current view
   *
   * @param navList List of navigation objects
   * @param config The Aurelia router configuration variable
   */
  private createRoutes(menuItems: MenuItem[], config: RouterConfiguration) {

    let routes = [];

    for (let item of menuItems) {

      // Add default route
      if (item.def) {
        routes.push({ route: '', redirect: item.pages[0].name.toLowerCase() });
      }

      // TODO - Don't hardcode route params (FAQ/:query)
      // TODO - Won't highlight proper tab or child tabs on first load (FAQ/:query)
      for (let page of item.pages) {
        if (page.name.toLowerCase() == 'faq') {
          routes.push({
            route: [page.name.toLowerCase(), page.name.toLowerCase() + ((page.name.toLowerCase() == 'faq') ? '/:query' : '')],
            moduleId: `./${item.name.toLowerCase() }/${page.name}`,
            nav: true,
            title: page.name,
            navName: item.name
          });
        } else {
          routes.push({
            route: page.name.toLowerCase(),
            moduleId: `./${item.name.toLowerCase() }/${page.name}`,
            nav: true,
            title: page.name,
            navName: item.name
          });
        }
      }
    }

    config.map(routes);

  }

  get lights() {
    return localStorage.getItem('lights') == 'on';
  }


  /** DOM Ready (Called by Aurelia) */
  attached() {

    this._errorHandler.init();
    this._log.init();

    let req = new XMLHttpRequest()
      , lights = localStorage.getItem('lights');

    this._modal.init('overlay');

    // let light = (lights == 'off') ? 'light' : 'dark';
    // req.open('GET', `css/themes/${light}/theme.css`, true);
    // req.send();

  }



  /**
   * Populates the navigation elements for the respective
   * navigation tabs.
   *
   * @param nav A navigation object
   * @param toggleNav Toggle the isActive property on the INav objects
   */
  populateRoutes(item: MenuItem, e?: MouseEvent, toggleNav = false) {

    // Only activate on left-click
    if (e && typeof e != 'undefined') {
      if (e.button != 0) return;
    }

    // TODO - This is a hack and should exist in the router configuration
    if (!item.routes.length) {
      let href = location.href.split('http://')[1].split('/')[0];
      this.goTo('http://' + href);
    }

    // Don't populate tabs without default tab
    if (item.def)
      this.activeRoutes = item.routes;
    else
      this.activeRoutes = [];


    if (toggleNav) {
      this.mainMenu.forEach(i => {
        i.isActive = i === item;
      });

      this.goTo(item.def ? item.defRoute.href : item.routes[0].href);
    }
  }

  // Activate the router manually
  goTo(href: string) {
    location.href = href;
  }


}
