/**
 * 切换路由参数
 * @param [params={}]
 * @param [template='{pathname}?{params}#{hash}']
 * @return {boolean}
 */
export function historyReplaceState(params = {}, template = "{pathname}{params}{hash}") {
    if(window.URLSearchParams) {
        const _params = new URLSearchParams(location.search);
        for(let k in params) {
            _params.set(k, params[k]);
        }
        const match = {
            "{pathname}": () => location.pathname,
            "{params}": () => "?" + _params.toString(),
            "{hash}": () => location.hash
        };
        for(let k in match) {
            const fn = match[k];
            template = template.replace(new RegExp(k, "g"), fn());
        }
        history.replaceState(
            null,
            "",
            template
        );
        return true;
    }
}