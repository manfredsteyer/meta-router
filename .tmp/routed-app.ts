export interface RoutedAppConfig {
  appId: string;
}

/**
 * Represents a micro frontend (a client app) the meta router routes to
 */
export class RoutedApp {

    private childConfig: RoutedAppConfig;

    config(config: RoutedAppConfig): void {
      this.childConfig = config;
    }

    init(): void {
      if (!parent) return;
      window.addEventListener('load', this.sendHeight.bind(this), true);
      window.addEventListener('resize', this.sendHeight.bind(this), true);
    }

    /** Sends the current route to the meta router to include it into the url */
    sendRoute(url: string): void {
      parent.postMessage({ message: 'routed', appPath: this.childConfig.appId, route: url  }, '*');
    }

    /** 
     * Registers a callback that allows the meta router to request 
     * a new route within the routed application 
    */
    registerForRouteChange(callback: (route: string) => void): void {
        window.addEventListener('message', (e) => {
            if (e.data && e.data.message === 'sub-route') {
            callback(e.data.route);
            }
          }, true);
    }

    private sendHeight(): void {
        let html = document.documentElement;
        let height = html.offsetHeight;

        parent.postMessage({ message: 'set-height', appPath: this.childConfig.appId, height: height}, '*');
    }

}