export interface MetaRoute {
    
    /** Path the meta router uses */
    path: string;
    
    /** entry point of the routed client app */
    app: string;
}

export interface MetaRouterConfig {
    hashPrefix: string;
}

/**
 * MetaRouter for routing between micro frontends
 */
export class MetaRouter {
    
    additionalConfig: MetaRouterConfig = {
        hashPrefix: '/'
    };

    activatedRoute: MetaRoute;   

    private routes = new Array<MetaRoute>();
    
    config(routes: MetaRoute[]): void { this.routes = routes; }
    
    /**
     * initializes the router after configuring it
     */
    init(): void {
        window.addEventListener('hashchange', this.routeByUrl.bind(this), false);
        window.addEventListener('message', this.handleMessage.bind(this), false);
        if (!location.hash && this.routes && this.routes.length > 0) {
            var defaultRoute = this.routes[0];
            this.go(defaultRoute.path);
        }
        else {
            this.routeByUrl();
        }
    }

    /**
     * Preloads all the micro frontends by loading them into the page
     */
    preload(): void {
        this.routes.forEach(route => {
            this.ensureIframeCreated(route);
        })
    }

    /**
     * Navigates to a configured meta route
     * @param path path of the routed client app
     * @param subRoute subRoute passed to the client app
     */
    go(path: string, subRoute?: string): void {
        var route = this.routes.find(function(route: MetaRoute) { 
            return route.path === path;
        } );
        if (!route) throw Error('route not found: ' + route);

        this.ensureIframeCreated(route, subRoute);
        this.activateRoute(route, subRoute);
    }

    private handleMessage(event: MessageEvent): void {
        if (!event.data) return;

        if (event.data.message == 'routed') {
            this.setRouteInHash(event.data.appPath, event.data.route);
        }
        else if (event.data.message == 'set-height') {
            this.resizeIframe(event.data.appPath, event.data.height);
        }
    }
    
    private resizeIframe(appPath: string, height: number): void {
        let iframe = document.getElementById(appPath);
        if (!iframe) return;
        iframe.style.height = height + 'px';
    }

    private ensureIframeCreated(route: MetaRoute, subRoute?: string): void {
        if (!this.getIframe(route)) {

            var url = '';

            if (subRoute) {
                url = route.app + '#' + this.additionalConfig.hashPrefix + subRoute;
            }
            else {
                url = route.app;
            }

            var iframe = document.createElement('iframe');
            iframe.style['display'] = 'none';
            iframe.src = url;
            iframe.id = route.path;
            iframe.className = 'outlet-frame';

            let outlet = this.getOutlet();
            if (!outlet) throw new Error('outlet not found');

            outlet.appendChild(iframe);
        }
    }
    
    private activateRoute(routeToActivate: MetaRoute, subRoute?: string): void  {
        var that = this;
        this.routes.forEach(function(route) { 
            var iframe = that.getIframe(route);
            if (iframe) {
                iframe.style['display'] = route === routeToActivate ? 'block' : 'none';
            }
        });

        if (subRoute) {
            var activatedIframe = this.getIframe(routeToActivate) as HTMLIFrameElement;
            activatedIframe.contentWindow.postMessage({message: 'sub-route', route: subRoute }, '*' );
        }

        this.setRouteInHash(routeToActivate.path, subRoute);
        this.activatedRoute = routeToActivate;
    }

    private setRouteInHash(path: string, subRoute?: string): void {

        if (subRoute && subRoute.startsWith('/')) {
            subRoute = subRoute.substr(1);
        }
        
        var hash = '';

        if (subRoute) {
             hash = path + '/' + subRoute;
        }
        else {
            hash = path;
        }
        history.replaceState(null, null, document.location.pathname + '#' + hash);
    }
    
    private getIframe(route: MetaRoute): HTMLIFrameElement {
        return document.getElementById(route.path) as HTMLIFrameElement;
    }
    
    private getOutlet(): HTMLElement {
        return document.getElementById('outlet') as HTMLElement;
    }

    private routeByUrl(): void {
        if (!location.hash) return;
        var path = location.hash.substr(1);
        if (!path) return;
        var segments = path.split('/');
        var appPath = segments[0];
        var rest = segments.slice(1).join('/');
        this.go(appPath, rest);
    }

};