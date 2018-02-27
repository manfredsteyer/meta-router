import { UrlParser } from './url-parser';

export interface MetaRoute {

    /** Path the meta router uses */
    path: string;

    /** entry point of the routed client app */
    app: string;

    /** id of the HtmlElement used as outlet. Default: outlet */
    outlet: string;
}

export type HandleNotification = (tag: string, data: any) => void;

export interface MetaRouterConfig {
    hashPrefix: string;
    additionalHeight: number;
    handleNotification: HandleNotification;
    allowedOrigins: string;
}

/**
 * MetaRouter for routing between micro frontends
 */
export class MetaRouter {

    additionalConfig: MetaRouterConfig = {
        hashPrefix: '/',
        additionalHeight: 5,
        handleNotification: () => {},
        allowedOrigins: '*'
    };

    activatedRoute: MetaRoute;

    private routes = new Array<MetaRoute>();

    private urlParser = new UrlParser();

    config(routes: MetaRoute[]): void { this.routes = routes; }

    /**
     * initializes the router after configuring it
     */
    init(): void {
        window.addEventListener('hashchange', this.routeByUrl.bind(this), false);
        window.addEventListener('message', this.handleMessage.bind(this), false);
        if (!location.hash && this.routes && this.routes.length > 0) {
            let defaultRoute = this.routes[0];
            this.go(defaultRoute.path);
        }
        else {
            this.routeByUrl();
        }

        if (this.additionalConfig.allowedOrigins === 'same-origin') {
            this.additionalConfig.allowedOrigins = location.origin;
          }
    
    }

    /**
     * Preloads all the micro frontends by loading them into the page
     */
    preload(): void {
        this.routes.forEach(route => {
            this.ensureIframeCreated(route);
        });
    }

    /**
     * Navigates to a configured meta route
     * @param path path of the routed client app
     * @param subRoute subRoute passed to the client app
     */
    go(path: string, subRoute?: string): void {
        let route = this.routes.find(function(r: MetaRoute) {
            return r.path === path;
        });

        if (!route) throw Error('route not found: ' + route);

        this.ensureIframeCreated(route, subRoute);
        this.activateRoute(route, subRoute);
    }

    private handleMessage(event: MessageEvent): void {
        if (!event.data) return;

        if (this.additionalConfig.allowedOrigins === 'same-origin'
            && event.origin !== location.origin) {
                throw new Error('Received message from not allowed origin');
        }
        else if (this.additionalConfig.allowedOrigins !== '*') {
            let whiteList = this.additionalConfig.allowedOrigins.split(';');
            if (whiteList.indexOf(event.origin) === -1) {
                throw new Error('Received message from not allowed origin');
            }
        }

        if (event.data.message === 'routed') {
            let route = this.routes.find(r => r.path === event.data.appPath);
            this.setRouteInHash(route, event.data.route);
        } 
        else if (event.data.message === 'set-height') {
            this.resizeIframe(event.data.appPath, event.data.height);
        }
        else if (event.data.message === 'notification' && this.additionalConfig.handleNotification) {
            this.additionalConfig.handleNotification(event.data.tag, event.data.data);
        }
        else if (event.data.message === 'broadcast') {
            
            for(let route of this.routes) {
                let iframe = this.getIframe(route);
                if (iframe) {
                    iframe.contentWindow.postMessage({ message: 'notification', tag: event.data.tag, data: event.data.data  }, this.additionalConfig.allowedOrigins);
                }
            }
            
            this.additionalConfig.handleNotification(event.data.tag, event.data.data);
        }

    }

    private resizeIframe(appPath: string, height: number): void {
        let iframe = document.getElementById(appPath);
        if (!iframe) return;
        let newHight = Number(height) + this.additionalConfig.additionalHeight;
        iframe.style.height = newHight + 'px';
    }

    private ensureIframeCreated(route: MetaRoute, subRoute?: string): void {
        if (!this.getIframe(route)) {

            let url = '';

            if (subRoute) {
                url = route.app + '#' + this.additionalConfig.hashPrefix + subRoute;
            }
            else {
                url = route.app;
            }

            let iframe = document.createElement('iframe');
            iframe.style['display'] = 'none';
            iframe.src = url;
            iframe.id = route.path;
            iframe.className = 'outlet-frame';

            let outlet = this.getOutlet(route);
            if (!outlet) throw new Error(`outlet ${outlet} not found`);

            outlet.appendChild(iframe);
        }
    }

    private activateRoute(routeToActivate: MetaRoute, subRoute?: string): void  {
        let that = this;
        this.routes.forEach(function(route) { 
            let iframe = that.getIframe(route);
            if (iframe && route.outlet === routeToActivate.outlet) {
                iframe.style['display'] = route === routeToActivate ? 'block' : 'none';
            }
        });

        if (subRoute) {
            let activatedIframe = this.getIframe(routeToActivate) as HTMLIFrameElement;
            activatedIframe.contentWindow.postMessage({message: 'sub-route', route: subRoute }, this.additionalConfig.allowedOrigins );
        }

        this.setRouteInHash(routeToActivate, subRoute);
        this.activatedRoute = routeToActivate;
    }

    private setRouteInHash(routeToActivate: MetaRoute, subRoute?: string): void {

        let path = routeToActivate.path;

        let currentRoutes = this.parseHash();

        if (subRoute && subRoute.startsWith('/')) {
            subRoute = subRoute.substr(1);
        }

        let hash = '';

        if (subRoute) {
             hash = path + '/' + subRoute;
        }
        else {
            hash = path;
        }

        currentRoutes[routeToActivate.outlet || 'outlet'] = hash;

        history.replaceState(null, null, document.location.pathname + '#' + this.persistUrl(currentRoutes));
    }

    private parseHash(): object {
        let hash = location.hash.substr(1) + '\0';
        return this.urlParser.parse(hash);
    }

    private persistUrl(routes: object): string {

        let url = '';
        if (routes['outlet']) {
            url = routes['outlet'];
        }

        for (let key of Object.getOwnPropertyNames(routes)) {
            if (key !== 'outlet') {
                if (url) url += '//';
                url += key + ':' + routes[key];
            }
        }

        return url;

    }

    private getIframe(route: MetaRoute): HTMLIFrameElement {
        return document.getElementById(route.path) as HTMLIFrameElement;
    }

    private getOutlet(route: MetaRoute): HTMLElement {
        let outlet = route.outlet || 'outlet';
        return document.getElementById(outlet) as HTMLElement;
    }

    private routeByUrl(): void {
        if (!location.hash) return;
        let path = location.hash.substr(1);
        if (!path) return;

        let routes = this.urlParser.parse(path);

        for (let key of Object.getOwnPropertyNames(routes)) {
            let route = routes[key];
            let segments = route.split('/');
            let appPath = segments[0];
            let rest = segments.slice(1).join('/');
            this.go(appPath, rest);
        }
    }
}
