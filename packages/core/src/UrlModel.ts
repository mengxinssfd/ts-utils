import * as urlUtils from './url';

/**
 * 解析url
 * @Author: dyh
 * @Date: 2019-10-17 10:44
 * @Description:
 */
export class UrlModel {
  protocol = '';
  port: number | string = '';
  host = '';
  path = '';
  href = '';
  hash = '';
  query: Partial<{ [key: string]: string[] | string }> = {};

  // queryStr: string = "";

  constructor(url: string) {
    this.href = url;
    this.parseAll(url);
  }

  private parseAll(url: string) {
    this.protocol = urlUtils.getUrlProtocol(url);
    this.host = urlUtils.getUrlHost(url);
    this.port = urlUtils.getUrlPort(url);
    this.path = urlUtils.getUrlPath(url);
    this.hash = urlUtils.getUrlHash(url);
    this.query = urlUtils.getUrlParamObj(url);
  }

  toString(template = '{protocol}{host}{port}{pathname}{params}{hash}') {
    const match = {
      '{protocol}': () => (this.protocol ? `${this.protocol}://` : ''),
      '{host}': () => this.host || '',
      '{port}': () => (this.port ? `:${this.port}` : ''),
      '{pathname}': () => this.path || '',
      '{params}': () => {
        const query = urlUtils.stringifyUrlSearch(this.query);
        if (query) {
          return '?' + query;
        }
        return '';
      },
      '{hash}': () => this.hash || '',
    };
    for (const k in match) {
      const fn = match[k];
      template = template.replace(new RegExp(k, 'g'), fn());
    }
    return template;
  }
}
