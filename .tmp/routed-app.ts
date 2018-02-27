export type HandleCliendNotification = (tag: string, data: any) => void;

export interface RoutedAppConfig {
  appId: string;
  handleNotification?: HandleCliendNotification;
  allowedOrigins?: string;
}

/**
 * Represents a micro frontend (a client app) the meta router routes to
 */
export class RoutedApp {

    private childConfig: RoutedAppConfig;

    config(config: RoutedAppConfig): void {
      this.childConfig = config;
      if (!config.handleNotification) {
        config.handleNotification = () => {};
      }
      if (!config.allowedOrigins) {
        config.allowedOrigins = '*';
      }
      else if (config.allowedOrigins === 'same-origin') {
        config.allowedOrigins = location.origin;
      }
    }

    init(): void {
      if (!parent) return;
      window.addEventListener('load', this.sendHeight.bind(this), true);
      window.addEventListener('resize', this.sendHeight.bind(this), true);
    }

    /** Sends the current route to the meta router to include it into the url */
    sendRoute(url: string): void {
      parent.postMessage({ message: 'routed', appPath: this.childConfig.appId, route: url  }, this.childConfig.allowedOrigins);
    }

    /** Sends a message to the shell */
    notifyShell(tag: string, data: object): void {
      parent.postMessage({ message: 'notification', tag, data  }, this.childConfig.allowedOrigins);
    }

    /** Sends a message to all routed apps */
    broadcast(tag: string, data: object): void {
      parent.postMessage({ message: 'broadcast', tag, data  }, this.childConfig.allowedOrigins);
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
            else if (e.data.message === 'notification' && this.childConfig.handleNotification) {
              this.childConfig.handleNotification(e.data.tag, e.data.data);
            }
          }, true);
    }

    private sendHeight(): void {
        let html = document.documentElement;
        let height = html.offsetHeight;

        parent.postMessage({ message: 'set-height', appPath: this.childConfig.appId, height: height}, this.childConfig.allowedOrigins);
    }

}
