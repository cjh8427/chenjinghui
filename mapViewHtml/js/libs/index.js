/* eslint-disable linebreak-style */
// import module from './store';
import LMap from './Map';
import LTilelayer from './TileLayer';
import LMarker from './Marker';
import LPopup from './Popup';
import LTooltip from './Tooltip';

const plugin = {};

plugin.install = function (Vue, store, moduleName = 'VL') {
    // if(this.installed) return

    // store.registerModule(moduleName, module);
    //
    // if (store.state.hasOwnProperty(moduleName) === false) {
    //     console.error('vue-leaflet module is not correctly initialized. Please check the module name:', moduleName);
    // }

    Vue.component('LMap', LMap);
    Vue.component('LTilelayer', LTilelayer);
    Vue.component('LMarker', LMarker);
    Vue.component('LPopup', LPopup);
    Vue.component('LTooltip', LTooltip);
};

export default {
    // module,
    LMap,
    plugin,
    LTilelayer,
    LMarker,
    LPopup,
    LTooltip,
};
