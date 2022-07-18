
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.49.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const isUndefined = value => typeof value === "undefined";

    const isFunction = value => typeof value === "function";

    const isNumber = value => typeof value === "number";

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
    	return (
    		!event.defaultPrevented &&
    		event.button === 0 &&
    		!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
    	);
    }

    function createCounter() {
    	let i = 0;
    	/**
    	 * Returns an id and increments the internal state
    	 * @returns {number}
    	 */
    	return () => i++;
    }

    /**
     * Create a globally unique id
     *
     * @returns {string} An id
     */
    function createGlobalId() {
    	return Math.random().toString(36).substring(2);
    }

    const isSSR = typeof window === "undefined";

    function addListener(target, type, handler) {
    	target.addEventListener(type, handler);
    	return () => target.removeEventListener(type, handler);
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    /*
     * Adapted from https://github.com/EmilTholin/svelte-routing
     *
     * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
     */

    const createKey = ctxName => `@@svnav-ctx__${ctxName}`;

    // Use strings instead of objects, so different versions of
    // svelte-navigator can potentially still work together
    const LOCATION = createKey("LOCATION");
    const ROUTER = createKey("ROUTER");
    const ROUTE = createKey("ROUTE");
    const ROUTE_PARAMS = createKey("ROUTE_PARAMS");
    const FOCUS_ELEM = createKey("FOCUS_ELEM");

    const paramRegex = /^:(.+)/;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    const startsWith = (string, search) =>
    	string.substr(0, search.length) === search;

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    const isRootSegment = segment => segment === "";

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    const isDynamic = segment => paramRegex.test(segment);

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    const isSplat = segment => segment[0] === "*";

    /**
     * Strip potention splat and splatname of the end of a path
     * @param {string} str
     * @return {string}
     */
    const stripSplat = str => str.replace(/\*.*$/, "");

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    const stripSlashes = str => str.replace(/(^\/+|\/+$)/g, "");

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri, filterFalsy = false) {
    	const segments = stripSlashes(uri).split("/");
    	return filterFalsy ? segments.filter(Boolean) : segments;
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    const addQuery = (pathname, query) =>
    	pathname + (query ? `?${query}` : "");

    /**
     * Normalizes a basepath
     *
     * @param {string} path
     * @returns {string}
     *
     * @example
     * normalizePath("base/path/") // -> "/base/path"
     */
    const normalizePath = path => `/${stripSlashes(path)}`;

    /**
     * Joins and normalizes multiple path fragments
     *
     * @param {...string} pathFragments
     * @returns {string}
     */
    function join(...pathFragments) {
    	const joinFragment = fragment => segmentize(fragment, true).join("/");
    	const joinedSegments = pathFragments.map(joinFragment).join("/");
    	return normalizePath(joinedSegments);
    }

    // We start from 1 here, so we can check if an origin id has been passed
    // by using `originId || <fallback>`
    const LINK_ID = 1;
    const ROUTE_ID = 2;
    const ROUTER_ID = 3;
    const USE_FOCUS_ID = 4;
    const USE_LOCATION_ID = 5;
    const USE_MATCH_ID = 6;
    const USE_NAVIGATE_ID = 7;
    const USE_PARAMS_ID = 8;
    const USE_RESOLVABLE_ID = 9;
    const USE_RESOLVE_ID = 10;
    const NAVIGATE_ID = 11;

    const labels = {
    	[LINK_ID]: "Link",
    	[ROUTE_ID]: "Route",
    	[ROUTER_ID]: "Router",
    	[USE_FOCUS_ID]: "useFocus",
    	[USE_LOCATION_ID]: "useLocation",
    	[USE_MATCH_ID]: "useMatch",
    	[USE_NAVIGATE_ID]: "useNavigate",
    	[USE_PARAMS_ID]: "useParams",
    	[USE_RESOLVABLE_ID]: "useResolvable",
    	[USE_RESOLVE_ID]: "useResolve",
    	[NAVIGATE_ID]: "navigate",
    };

    const createLabel = labelId => labels[labelId];

    function createIdentifier(labelId, props) {
    	let attr;
    	if (labelId === ROUTE_ID) {
    		attr = props.path ? `path="${props.path}"` : "default";
    	} else if (labelId === LINK_ID) {
    		attr = `to="${props.to}"`;
    	} else if (labelId === ROUTER_ID) {
    		attr = `basepath="${props.basepath || ""}"`;
    	}
    	return `<${createLabel(labelId)} ${attr || ""} />`;
    }

    function createMessage(labelId, message, props, originId) {
    	const origin = props && createIdentifier(originId || labelId, props);
    	const originMsg = origin ? `\n\nOccurred in: ${origin}` : "";
    	const label = createLabel(labelId);
    	const msg = isFunction(message) ? message(label) : message;
    	return `<${label}> ${msg}${originMsg}`;
    }

    const createMessageHandler = handler => (...args) =>
    	handler(createMessage(...args));

    const fail = createMessageHandler(message => {
    	throw new Error(message);
    });

    // eslint-disable-next-line no-console
    const warn = createMessageHandler(console.warn);

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
    	const score = route.default
    		? 0
    		: segmentize(route.fullPath).reduce((acc, segment) => {
    				let nextScore = acc;
    				nextScore += SEGMENT_POINTS;

    				if (isRootSegment(segment)) {
    					nextScore += ROOT_POINTS;
    				} else if (isDynamic(segment)) {
    					nextScore += DYNAMIC_POINTS;
    				} else if (isSplat(segment)) {
    					nextScore -= SEGMENT_POINTS + SPLAT_PENALTY;
    				} else {
    					nextScore += STATIC_POINTS;
    				}

    				return nextScore;
    		  }, 0);

    	return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
    	return (
    		routes
    			.map(rankRoute)
    			// If two routes have the exact same score, we go by index instead
    			.sort((a, b) => {
    				if (a.score < b.score) {
    					return 1;
    				}
    				if (a.score > b.score) {
    					return -1;
    				}
    				return a.index - b.index;
    			})
    	);
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { fullPath, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
    	let bestMatch;
    	let defaultMatch;

    	const [uriPathname] = uri.split("?");
    	const uriSegments = segmentize(uriPathname);
    	const isRootUri = uriSegments[0] === "";
    	const ranked = rankRoutes(routes);

    	for (let i = 0, l = ranked.length; i < l; i++) {
    		const { route } = ranked[i];
    		let missed = false;
    		const params = {};

    		// eslint-disable-next-line no-shadow
    		const createMatch = uri => ({ ...route, params, uri });

    		if (route.default) {
    			defaultMatch = createMatch(uri);
    			continue;
    		}

    		const routeSegments = segmentize(route.fullPath);
    		const max = Math.max(uriSegments.length, routeSegments.length);
    		let index = 0;

    		for (; index < max; index++) {
    			const routeSegment = routeSegments[index];
    			const uriSegment = uriSegments[index];

    			if (!isUndefined(routeSegment) && isSplat(routeSegment)) {
    				// Hit a splat, just grab the rest, and return a match
    				// uri:   /files/documents/work
    				// route: /files/* or /files/*splatname
    				const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

    				params[splatName] = uriSegments
    					.slice(index)
    					.map(decodeURIComponent)
    					.join("/");
    				break;
    			}

    			if (isUndefined(uriSegment)) {
    				// URI is shorter than the route, no match
    				// uri:   /users
    				// route: /users/:userId
    				missed = true;
    				break;
    			}

    			const dynamicMatch = paramRegex.exec(routeSegment);

    			if (dynamicMatch && !isRootUri) {
    				const value = decodeURIComponent(uriSegment);
    				params[dynamicMatch[1]] = value;
    			} else if (routeSegment !== uriSegment) {
    				// Current segments don't match, not dynamic, not splat, so no match
    				// uri:   /users/123/settings
    				// route: /users/:id/profile
    				missed = true;
    				break;
    			}
    		}

    		if (!missed) {
    			bestMatch = createMatch(join(...uriSegments.slice(0, index)));
    			break;
    		}
    	}

    	return bestMatch || defaultMatch || null;
    }

    /**
     * Check if the `route.fullPath` matches the `uri`.
     * @param {Object} route
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
    	return pick([route], uri);
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
    	// /foo/bar, /baz/qux => /foo/bar
    	if (startsWith(to, "/")) {
    		return to;
    	}

    	const [toPathname, toQuery] = to.split("?");
    	const [basePathname] = base.split("?");
    	const toSegments = segmentize(toPathname);
    	const baseSegments = segmentize(basePathname);

    	// ?a=b, /users?b=c => /users?a=b
    	if (toSegments[0] === "") {
    		return addQuery(basePathname, toQuery);
    	}

    	// profile, /users/789 => /users/789/profile
    	if (!startsWith(toSegments[0], ".")) {
    		const pathname = baseSegments.concat(toSegments).join("/");
    		return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
    	}

    	// ./       , /users/123 => /users/123
    	// ../      , /users/123 => /users
    	// ../..    , /users/123 => /
    	// ../../one, /a/b/c/d   => /a/b/one
    	// .././one , /a/b/c/d   => /a/b/c/one
    	const allSegments = baseSegments.concat(toSegments);
    	const segments = [];

    	allSegments.forEach(segment => {
    		if (segment === "..") {
    			segments.pop();
    		} else if (segment !== ".") {
    			segments.push(segment);
    		}
    	});

    	return addQuery(`/${segments.join("/")}`, toQuery);
    }

    /**
     * Normalizes a location for consumption by `Route` children and the `Router`.
     * It removes the apps basepath from the pathname
     * and sets default values for `search` and `hash` properties.
     *
     * @param {Object} location The current global location supplied by the history component
     * @param {string} basepath The applications basepath (i.e. when serving from a subdirectory)
     *
     * @returns The normalized location
     */
    function normalizeLocation(location, basepath) {
    	const { pathname, hash = "", search = "", state } = location;
    	const baseSegments = segmentize(basepath, true);
    	const pathSegments = segmentize(pathname, true);
    	while (baseSegments.length) {
    		if (baseSegments[0] !== pathSegments[0]) {
    			fail(
    				ROUTER_ID,
    				`Invalid state: All locations must begin with the basepath "${basepath}", found "${pathname}"`,
    			);
    		}
    		baseSegments.shift();
    		pathSegments.shift();
    	}
    	return {
    		pathname: join(...pathSegments),
    		hash,
    		search,
    		state,
    	};
    }

    const normalizeUrlFragment = frag => (frag.length === 1 ? "" : frag);

    /**
     * Creates a location object from an url.
     * It is used to create a location from the url prop used in SSR
     *
     * @param {string} url The url string (e.g. "/path/to/somewhere")
     *
     * @returns {{ pathname: string; search: string; hash: string }} The location
     */
    function createLocation(url) {
    	const searchIndex = url.indexOf("?");
    	const hashIndex = url.indexOf("#");
    	const hasSearchIndex = searchIndex !== -1;
    	const hasHashIndex = hashIndex !== -1;
    	const hash = hasHashIndex ? normalizeUrlFragment(url.substr(hashIndex)) : "";
    	const pathnameAndSearch = hasHashIndex ? url.substr(0, hashIndex) : url;
    	const search = hasSearchIndex
    		? normalizeUrlFragment(pathnameAndSearch.substr(searchIndex))
    		: "";
    	const pathname = hasSearchIndex
    		? pathnameAndSearch.substr(0, searchIndex)
    		: pathnameAndSearch;
    	return { pathname, search, hash };
    }

    /**
     * Resolves a link relative to the parent Route and the Routers basepath.
     *
     * @param {string} path The given path, that will be resolved
     * @param {string} routeBase The current Routes base path
     * @param {string} appBase The basepath of the app. Used, when serving from a subdirectory
     * @returns {string} The resolved path
     *
     * @example
     * resolveLink("relative", "/routeBase", "/") // -> "/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/") // -> "/absolute"
     * resolveLink("relative", "/routeBase", "/base") // -> "/base/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/base") // -> "/base/absolute"
     */
    function resolveLink(path, routeBase, appBase) {
    	return join(appBase, resolve(path, routeBase));
    }

    /**
     * Get the uri for a Route, by matching it against the current location.
     *
     * @param {string} routePath The Routes resolved path
     * @param {string} pathname The current locations pathname
     */
    function extractBaseUri(routePath, pathname) {
    	const fullPath = normalizePath(stripSplat(routePath));
    	const baseSegments = segmentize(fullPath, true);
    	const pathSegments = segmentize(pathname, true).slice(0, baseSegments.length);
    	const routeMatch = match({ fullPath }, join(...pathSegments));
    	return routeMatch && routeMatch.uri;
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const POP = "POP";
    const PUSH = "PUSH";
    const REPLACE = "REPLACE";

    function getLocation(source) {
    	return {
    		...source.location,
    		pathname: encodeURI(decodeURI(source.location.pathname)),
    		state: source.history.state,
    		_key: (source.history.state && source.history.state._key) || "initial",
    	};
    }

    function createHistory(source) {
    	let listeners = [];
    	let location = getLocation(source);
    	let action = POP;

    	const notifyListeners = (listenerFns = listeners) =>
    		listenerFns.forEach(listener => listener({ location, action }));

    	return {
    		get location() {
    			return location;
    		},
    		listen(listener) {
    			listeners.push(listener);

    			const popstateListener = () => {
    				location = getLocation(source);
    				action = POP;
    				notifyListeners([listener]);
    			};

    			// Call listener when it is registered
    			notifyListeners([listener]);

    			const unlisten = addListener(source, "popstate", popstateListener);
    			return () => {
    				unlisten();
    				listeners = listeners.filter(fn => fn !== listener);
    			};
    		},
    		/**
    		 * Navigate to a new absolute route.
    		 *
    		 * @param {string|number} to The path to navigate to.
    		 *
    		 * If `to` is a number we will navigate to the stack entry index + `to`
    		 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    		 * @param {Object} options
    		 * @param {*} [options.state] The state will be accessible through `location.state`
    		 * @param {boolean} [options.replace=false] Replace the current entry in the history
    		 * stack, instead of pushing on a new one
    		 */
    		navigate(to, options) {
    			const { state = {}, replace = false } = options || {};
    			action = replace ? REPLACE : PUSH;
    			if (isNumber(to)) {
    				if (options) {
    					warn(
    						NAVIGATE_ID,
    						"Navigation options (state or replace) are not supported, " +
    							"when passing a number as the first argument to navigate. " +
    							"They are ignored.",
    					);
    				}
    				action = POP;
    				source.history.go(to);
    			} else {
    				const keyedState = { ...state, _key: createGlobalId() };
    				// try...catch iOS Safari limits to 100 pushState calls
    				try {
    					source.history[replace ? "replaceState" : "pushState"](
    						keyedState,
    						"",
    						to,
    					);
    				} catch (e) {
    					source.location[replace ? "replace" : "assign"](to);
    				}
    			}

    			location = getLocation(source);
    			notifyListeners();
    		},
    	};
    }

    function createStackFrame(state, uri) {
    	return { ...createLocation(uri), state };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
    	let index = 0;
    	let stack = [createStackFrame(null, initialPathname)];

    	return {
    		// This is just for testing...
    		get entries() {
    			return stack;
    		},
    		get location() {
    			return stack[index];
    		},
    		addEventListener() {},
    		removeEventListener() {},
    		history: {
    			get state() {
    				return stack[index].state;
    			},
    			pushState(state, title, uri) {
    				index++;
    				// Throw away anything in the stack with an index greater than the current index.
    				// This happens, when we go back using `go(-n)`. The index is now less than `stack.length`.
    				// If we call `go(+n)` the stack entries with an index greater than the current index can
    				// be reused.
    				// However, if we navigate to a path, instead of a number, we want to create a new branch
    				// of navigation.
    				stack = stack.slice(0, index);
    				stack.push(createStackFrame(state, uri));
    			},
    			replaceState(state, title, uri) {
    				stack[index] = createStackFrame(state, uri);
    			},
    			go(to) {
    				const newIndex = index + to;
    				if (newIndex < 0 || newIndex > stack.length - 1) {
    					return;
    				}
    				index = newIndex;
    			},
    		},
    	};
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = !!(
    	!isSSR &&
    	window.document &&
    	window.document.createElement
    );
    // Use memory history in iframes (for example in Svelte REPL)
    const isEmbeddedPage = !isSSR && window.location.origin === "null";
    const globalHistory = createHistory(
    	canUseDOM && !isEmbeddedPage ? window : createMemorySource(),
    );

    // We need to keep the focus candidate in a separate file, so svelte does
    // not update, when we mutate it.
    // Also, we need a single global reference, because taking focus needs to
    // work globally, even if we have multiple top level routers
    // eslint-disable-next-line import/no-mutable-exports
    let focusCandidate = null;

    // eslint-disable-next-line import/no-mutable-exports
    let initialNavigation = true;

    /**
     * Check if RouterA is above RouterB in the document
     * @param {number} routerIdA The first Routers id
     * @param {number} routerIdB The second Routers id
     */
    function isAbove(routerIdA, routerIdB) {
    	const routerMarkers = document.querySelectorAll("[data-svnav-router]");
    	for (let i = 0; i < routerMarkers.length; i++) {
    		const node = routerMarkers[i];
    		const currentId = Number(node.dataset.svnavRouter);
    		if (currentId === routerIdA) return true;
    		if (currentId === routerIdB) return false;
    	}
    	return false;
    }

    /**
     * Check if a Route candidate is the best choice to move focus to,
     * and store the best match.
     * @param {{
         level: number;
         routerId: number;
         route: {
           id: number;
           focusElement: import("svelte/store").Readable<Promise<Element>|null>;
         }
       }} item A Route candidate, that updated and is visible after a navigation
     */
    function pushFocusCandidate(item) {
    	if (
    		// Best candidate if it's the only candidate...
    		!focusCandidate ||
    		// Route is nested deeper, than previous candidate
    		// -> Route change was triggered in the deepest affected
    		// Route, so that's were focus should move to
    		item.level > focusCandidate.level ||
    		// If the level is identical, we want to focus the first Route in the document,
    		// so we pick the first Router lookin from page top to page bottom.
    		(item.level === focusCandidate.level &&
    			isAbove(item.routerId, focusCandidate.routerId))
    	) {
    		focusCandidate = item;
    	}
    }

    /**
     * Reset the focus candidate.
     */
    function clearFocusCandidate() {
    	focusCandidate = null;
    }

    function initialNavigationOccurred() {
    	initialNavigation = false;
    }

    /*
     * `focus` Adapted from https://github.com/oaf-project/oaf-side-effects/blob/master/src/index.ts
     *
     * https://github.com/oaf-project/oaf-side-effects/blob/master/LICENSE
     */
    function focus(elem) {
    	if (!elem) return false;
    	const TABINDEX = "tabindex";
    	try {
    		if (!elem.hasAttribute(TABINDEX)) {
    			elem.setAttribute(TABINDEX, "-1");
    			let unlisten;
    			// We remove tabindex after blur to avoid weird browser behavior
    			// where a mouse click can activate elements with tabindex="-1".
    			const blurListener = () => {
    				elem.removeAttribute(TABINDEX);
    				unlisten();
    			};
    			unlisten = addListener(elem, "blur", blurListener);
    		}
    		elem.focus();
    		return document.activeElement === elem;
    	} catch (e) {
    		// Apparently trying to focus a disabled element in IE can throw.
    		// See https://stackoverflow.com/a/1600194/2476884
    		return false;
    	}
    }

    function isEndMarker(elem, id) {
    	return Number(elem.dataset.svnavRouteEnd) === id;
    }

    function isHeading(elem) {
    	return /^H[1-6]$/i.test(elem.tagName);
    }

    function query(selector, parent = document) {
    	return parent.querySelector(selector);
    }

    function queryHeading(id) {
    	const marker = query(`[data-svnav-route-start="${id}"]`);
    	let current = marker.nextElementSibling;
    	while (!isEndMarker(current, id)) {
    		if (isHeading(current)) {
    			return current;
    		}
    		const heading = query("h1,h2,h3,h4,h5,h6", current);
    		if (heading) {
    			return heading;
    		}
    		current = current.nextElementSibling;
    	}
    	return null;
    }

    function handleFocus(route) {
    	Promise.resolve(get_store_value(route.focusElement)).then(elem => {
    		const focusElement = elem || queryHeading(route.id);
    		if (!focusElement) {
    			warn(
    				ROUTER_ID,
    				"Could not find an element to focus. " +
    					"You should always render a header for accessibility reasons, " +
    					'or set a custom focus element via the "useFocus" hook. ' +
    					"If you don't want this Route or Router to manage focus, " +
    					'pass "primary={false}" to it.',
    				route,
    				ROUTE_ID,
    			);
    		}
    		const headingFocused = focus(focusElement);
    		if (headingFocused) return;
    		focus(document.documentElement);
    	});
    }

    const createTriggerFocus = (a11yConfig, announcementText, location) => (
    	manageFocus,
    	announceNavigation,
    ) =>
    	// Wait until the dom is updated, so we can look for headings
    	tick().then(() => {
    		if (!focusCandidate || initialNavigation) {
    			initialNavigationOccurred();
    			return;
    		}
    		if (manageFocus) {
    			handleFocus(focusCandidate.route);
    		}
    		if (a11yConfig.announcements && announceNavigation) {
    			const { path, fullPath, meta, params, uri } = focusCandidate.route;
    			const announcementMessage = a11yConfig.createAnnouncement(
    				{ path, fullPath, meta, params, uri },
    				get_store_value(location),
    			);
    			Promise.resolve(announcementMessage).then(message => {
    				announcementText.set(message);
    			});
    		}
    		clearFocusCandidate();
    	});

    const visuallyHiddenStyle =
    	"position:fixed;" +
    	"top:-1px;" +
    	"left:0;" +
    	"width:1px;" +
    	"height:1px;" +
    	"padding:0;" +
    	"overflow:hidden;" +
    	"clip:rect(0,0,0,0);" +
    	"white-space:nowrap;" +
    	"border:0;";

    /* node_modules\svelte-navigator\src\Router.svelte generated by Svelte v3.49.0 */

    const file$e = "node_modules\\svelte-navigator\\src\\Router.svelte";

    // (195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}
    function create_if_block$2(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*$announcementText*/ ctx[0]);
    			attr_dev(div, "role", "status");
    			attr_dev(div, "aria-atomic", "true");
    			attr_dev(div, "aria-live", "polite");
    			attr_dev(div, "style", visuallyHiddenStyle);
    			add_location(div, file$e, 195, 1, 5906);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$announcementText*/ 1) set_data_dev(t, /*$announcementText*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let if_block_anchor;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	let if_block = /*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			set_style(div, "display", "none");
    			attr_dev(div, "aria-hidden", "true");
    			attr_dev(div, "data-svnav-router", /*routerId*/ ctx[3]);
    			add_location(div, file$e, 190, 0, 5750);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t0, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId$1 = createCounter();
    const defaultBasepath = "/";

    function instance$e($$self, $$props, $$invalidate) {
    	let $location;
    	let $activeRoute;
    	let $prevLocation;
    	let $routes;
    	let $announcementText;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = defaultBasepath } = $$props;
    	let { url = null } = $$props;
    	let { history = globalHistory } = $$props;
    	let { primary = true } = $$props;
    	let { a11y = {} } = $$props;

    	const a11yConfig = {
    		createAnnouncement: route => `Navigated to ${route.uri}`,
    		announcements: true,
    		...a11y
    	};

    	// Remember the initial `basepath`, so we can fire a warning
    	// when the user changes it later
    	const initialBasepath = basepath;

    	const normalizedBasepath = normalizePath(basepath);
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const isTopLevelRouter = !locationContext;
    	const routerId = createId$1();
    	const manageFocus = primary && !(routerContext && !routerContext.manageFocus);
    	const announcementText = writable("");
    	validate_store(announcementText, 'announcementText');
    	component_subscribe($$self, announcementText, value => $$invalidate(0, $announcementText = value));
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(18, $routes = value));
    	const activeRoute = writable(null);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(16, $activeRoute = value));

    	// Used in SSR to synchronously set that a Route is active.
    	let hasActiveRoute = false;

    	// Nesting level of router.
    	// We will need this to identify sibling routers, when moving
    	// focus on navigation, so we can focus the first possible router
    	const level = isTopLevelRouter ? 0 : routerContext.level + 1;

    	// If we're running an SSR we force the location to the `url` prop
    	const getInitialLocation = () => normalizeLocation(isSSR ? createLocation(url) : history.location, normalizedBasepath);

    	const location = isTopLevelRouter
    	? writable(getInitialLocation())
    	: locationContext;

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(15, $location = value));
    	const prevLocation = writable($location);
    	validate_store(prevLocation, 'prevLocation');
    	component_subscribe($$self, prevLocation, value => $$invalidate(17, $prevLocation = value));
    	const triggerFocus = createTriggerFocus(a11yConfig, announcementText, location);
    	const createRouteFilter = routeId => routeList => routeList.filter(routeItem => routeItem.id !== routeId);

    	function registerRoute(route) {
    		if (isSSR) {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				hasActiveRoute = true;

    				// Return the match in SSR mode, so the matched Route can use it immediatly.
    				// Waiting for activeRoute to update does not work, because it updates
    				// after the Route is initialized
    				return matchingRoute; // eslint-disable-line consistent-return
    			}
    		} else {
    			routes.update(prevRoutes => {
    				// Remove an old version of the updated route,
    				// before pushing the new version
    				const nextRoutes = createRouteFilter(route.id)(prevRoutes);

    				nextRoutes.push(route);
    				return nextRoutes;
    			});
    		}
    	}

    	function unregisterRoute(routeId) {
    		routes.update(createRouteFilter(routeId));
    	}

    	if (!isTopLevelRouter && basepath !== defaultBasepath) {
    		warn(ROUTER_ID, 'Only top-level Routers can have a "basepath" prop. It is ignored.', { basepath });
    	}

    	if (isTopLevelRouter) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = history.listen(changedHistory => {
    				const normalizedLocation = normalizeLocation(changedHistory.location, normalizedBasepath);
    				prevLocation.set($location);
    				location.set(normalizedLocation);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		registerRoute,
    		unregisterRoute,
    		manageFocus,
    		level,
    		id: routerId,
    		history: isTopLevelRouter ? history : routerContext.history,
    		basepath: isTopLevelRouter
    		? normalizedBasepath
    		: routerContext.basepath
    	});

    	const writable_props = ['basepath', 'url', 'history', 'primary', 'a11y'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('$$scope' in $$props) $$invalidate(19, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId: createId$1,
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		normalizePath,
    		pick,
    		match,
    		normalizeLocation,
    		createLocation,
    		isSSR,
    		warn,
    		ROUTER_ID,
    		pushFocusCandidate,
    		visuallyHiddenStyle,
    		createTriggerFocus,
    		defaultBasepath,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		a11yConfig,
    		initialBasepath,
    		normalizedBasepath,
    		locationContext,
    		routerContext,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		level,
    		getInitialLocation,
    		location,
    		prevLocation,
    		triggerFocus,
    		createRouteFilter,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$announcementText
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*basepath*/ 1024) {
    			if (basepath !== initialBasepath) {
    				warn(ROUTER_ID, 'You cannot change the "basepath" prop. It is ignored.');
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$routes, $location*/ 294912) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$location, $prevLocation*/ 163840) {
    			// Manage focus and announce navigation to screen reader users
    			{
    				if (isTopLevelRouter) {
    					const hasHash = !!$location.hash;

    					// When a hash is present in the url, we skip focus management, because
    					// focusing a different element will prevent in-page jumps (See #3)
    					const shouldManageFocus = !hasHash && manageFocus;

    					// We don't want to make an announcement, when the hash changes,
    					// but the active route stays the same
    					const announceNavigation = !hasHash || $location.pathname !== $prevLocation.pathname;

    					triggerFocus(shouldManageFocus, announceNavigation);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$activeRoute*/ 65536) {
    			// Queue matched Route, so top level Router can decide which Route to focus.
    			// Non primary Routers should just be ignored
    			if (manageFocus && $activeRoute && $activeRoute.primary) {
    				pushFocusCandidate({ level, routerId, route: $activeRoute });
    			}
    		}
    	};

    	return [
    		$announcementText,
    		a11yConfig,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		location,
    		prevLocation,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$e,
    			create_fragment$e,
    			safe_not_equal,
    			{
    				basepath: 10,
    				url: 11,
    				history: 12,
    				primary: 13,
    				a11y: 14
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get history() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set history(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get a11y() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set a11y(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Router$1 = Router;

    /**
     * Check if a component or hook have been created outside of a
     * context providing component
     * @param {number} componentId
     * @param {*} props
     * @param {string?} ctxKey
     * @param {number?} ctxProviderId
     */
    function usePreflightCheck(
    	componentId,
    	props,
    	ctxKey = ROUTER,
    	ctxProviderId = ROUTER_ID,
    ) {
    	const ctx = getContext(ctxKey);
    	if (!ctx) {
    		fail(
    			componentId,
    			label =>
    				`You cannot use ${label} outside of a ${createLabel(ctxProviderId)}.`,
    			props,
    		);
    	}
    }

    const toReadonly = ctx => {
    	const { subscribe } = getContext(ctx);
    	return { subscribe };
    };

    /**
     * Access the current location via a readable store.
     * @returns {import("svelte/store").Readable<{
        pathname: string;
        search: string;
        hash: string;
        state: {};
      }>}
     *
     * @example
      ```html
      <script>
        import { useLocation } from "svelte-navigator";

        const location = useLocation();

        $: console.log($location);
        // {
        //   pathname: "/blog",
        //   search: "?id=123",
        //   hash: "#comments",
        //   state: {}
        // }
      </script>
      ```
     */
    function useLocation() {
    	usePreflightCheck(USE_LOCATION_ID);
    	return toReadonly(LOCATION);
    }

    /**
     * @typedef {{
        path: string;
        fullPath: string;
        uri: string;
        params: {};
      }} RouteMatch
     */

    /**
     * @typedef {import("svelte/store").Readable<RouteMatch|null>} RouteMatchStore
     */

    /**
     * Access the history of top level Router.
     */
    function useHistory() {
    	const { history } = getContext(ROUTER);
    	return history;
    }

    /**
     * Access the base of the parent Route.
     */
    function useRouteBase() {
    	const route = getContext(ROUTE);
    	return route ? derived(route, _route => _route.base) : writable("/");
    }

    /**
     * Resolve a given link relative to the current `Route` and the `Router`s `basepath`.
     * It is used under the hood in `Link` and `useNavigate`.
     * You can use it to manually resolve links, when using the `link` or `links` actions.
     *
     * @returns {(path: string) => string}
     *
     * @example
      ```html
      <script>
        import { link, useResolve } from "svelte-navigator";

        const resolve = useResolve();
        // `resolvedLink` will be resolved relative to its parent Route
        // and the Routers `basepath`
        const resolvedLink = resolve("relativePath");
      </script>

      <a href={resolvedLink} use:link>Relative link</a>
      ```
     */
    function useResolve() {
    	usePreflightCheck(USE_RESOLVE_ID);
    	const routeBase = useRouteBase();
    	const { basepath: appBase } = getContext(ROUTER);
    	/**
    	 * Resolves the path relative to the current route and basepath.
    	 *
    	 * @param {string} path The path to resolve
    	 * @returns {string} The resolved path
    	 */
    	const resolve = path => resolveLink(path, get_store_value(routeBase), appBase);
    	return resolve;
    }

    /**
     * A hook, that returns a context-aware version of `navigate`.
     * It will automatically resolve the given link relative to the current Route.
     * It will also resolve a link against the `basepath` of the Router.
     *
     * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router>
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /absolutePath
      </button>
      ```
      *
      * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router basepath="/base">
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /base/route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /base/absolutePath
      </button>
      ```
     */
    function useNavigate() {
    	usePreflightCheck(USE_NAVIGATE_ID);
    	const resolve = useResolve();
    	const { navigate } = useHistory();
    	/**
    	 * Navigate to a new route.
    	 * Resolves the link relative to the current route and basepath.
    	 *
    	 * @param {string|number} to The path to navigate to.
    	 *
    	 * If `to` is a number we will navigate to the stack entry index + `to`
    	 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    	 * @param {Object} options
    	 * @param {*} [options.state]
    	 * @param {boolean} [options.replace=false]
    	 */
    	const navigateRelative = (to, options) => {
    		// If to is a number, we navigate to the target stack entry via `history.go`.
    		// Otherwise resolve the link
    		const target = isNumber(to) ? to : resolve(to);
    		return navigate(target, options);
    	};
    	return navigateRelative;
    }

    /* node_modules\svelte-navigator\src\Route.svelte generated by Svelte v3.49.0 */
    const file$d = "node_modules\\svelte-navigator\\src\\Route.svelte";

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*$params*/ 16,
    	location: dirty & /*$location*/ 8
    });

    const get_default_slot_context = ctx => ({
    	params: isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    	location: /*$location*/ ctx[3],
    	navigate: /*navigate*/ ctx[10]
    });

    // (97:0) {#if isActive}
    function create_if_block$1(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				primary: /*primary*/ ctx[1],
    				$$slots: { default: [create_default_slot$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const router_changes = {};
    			if (dirty & /*primary*/ 2) router_changes.primary = /*primary*/ ctx[1];

    			if (dirty & /*$$scope, component, $location, $params, $$restProps*/ 264217) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(97:0) {#if isActive}",
    		ctx
    	});

    	return block;
    }

    // (113:2) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $params, $location*/ 262168)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(113:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (105:2) {#if component !== null}
    function create_if_block_1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[3] },
    		{ navigate: /*navigate*/ ctx[10] },
    		isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    		/*$$restProps*/ ctx[11]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, navigate, isSSR, get, params, $params, $$restProps*/ 3608)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 8 && { location: /*$location*/ ctx[3] },
    					dirty & /*navigate*/ 1024 && { navigate: /*navigate*/ ctx[10] },
    					dirty & /*isSSR, get, params, $params*/ 528 && get_spread_object(isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4]),
    					dirty & /*$$restProps*/ 2048 && get_spread_object(/*$$restProps*/ ctx[11])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(105:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    // (98:1) <Router {primary}>
    function create_default_slot$a(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(98:1) <Router {primary}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let current;
    	let if_block = /*isActive*/ ctx[2] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			set_style(div0, "display", "none");
    			attr_dev(div0, "aria-hidden", "true");
    			attr_dev(div0, "data-svnav-route-start", /*id*/ ctx[5]);
    			add_location(div0, file$d, 95, 0, 2622);
    			set_style(div1, "display", "none");
    			attr_dev(div1, "aria-hidden", "true");
    			attr_dev(div1, "data-svnav-route-end", /*id*/ ctx[5]);
    			add_location(div1, file$d, 121, 0, 3295);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isActive*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isActive*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t1.parentNode, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId = createCounter();

    function instance$d($$self, $$props, $$invalidate) {
    	let isActive;
    	const omit_props_names = ["path","component","meta","primary"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $activeRoute;
    	let $location;
    	let $parentBase;
    	let $params;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	let { meta = {} } = $$props;
    	let { primary = true } = $$props;
    	usePreflightCheck(ROUTE_ID, $$props);
    	const id = createId();
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(15, $activeRoute = value));
    	const parentBase = useRouteBase();
    	validate_store(parentBase, 'parentBase');
    	component_subscribe($$self, parentBase, value => $$invalidate(16, $parentBase = value));
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(3, $location = value));
    	const focusElement = writable(null);

    	// In SSR we cannot wait for $activeRoute to update,
    	// so we use the match returned from `registerRoute` instead
    	let ssrMatch;

    	const route = writable();
    	const params = writable({});
    	validate_store(params, 'params');
    	component_subscribe($$self, params, value => $$invalidate(4, $params = value));
    	setContext(ROUTE, route);
    	setContext(ROUTE_PARAMS, params);
    	setContext(FOCUS_ELEM, focusElement);

    	// We need to call useNavigate after the route is set,
    	// so we can use the routes path for link resolution
    	const navigate = useNavigate();

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway
    	if (!isSSR) {
    		onDestroy(() => unregisterRoute(id));
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('path' in $$new_props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$new_props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$new_props) $$invalidate(1, primary = $$new_props.primary);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId,
    		getContext,
    		onDestroy,
    		setContext,
    		writable,
    		get: get_store_value,
    		Router: Router$1,
    		ROUTER,
    		ROUTE,
    		ROUTE_PARAMS,
    		FOCUS_ELEM,
    		useLocation,
    		useNavigate,
    		useRouteBase,
    		usePreflightCheck,
    		isSSR,
    		extractBaseUri,
    		join,
    		ROUTE_ID,
    		path,
    		component,
    		meta,
    		primary,
    		id,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		parentBase,
    		location,
    		focusElement,
    		ssrMatch,
    		route,
    		params,
    		navigate,
    		isActive,
    		$activeRoute,
    		$location,
    		$parentBase,
    		$params
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$props) $$invalidate(1, primary = $$new_props.primary);
    		if ('ssrMatch' in $$props) $$invalidate(14, ssrMatch = $$new_props.ssrMatch);
    		if ('isActive' in $$props) $$invalidate(2, isActive = $$new_props.isActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*path, $parentBase, meta, $location, primary*/ 77834) {
    			{
    				// The route store will be re-computed whenever props, location or parentBase change
    				const isDefault = path === "";

    				const rawBase = join($parentBase, path);

    				const updatedRoute = {
    					id,
    					path,
    					meta,
    					// If no path prop is given, this Route will act as the default Route
    					// that is rendered if no other Route in the Router is a match
    					default: isDefault,
    					fullPath: isDefault ? "" : rawBase,
    					base: isDefault
    					? $parentBase
    					: extractBaseUri(rawBase, $location.pathname),
    					primary,
    					focusElement
    				};

    				route.set(updatedRoute);

    				// If we're in SSR mode and the Route matches,
    				// `registerRoute` will return the match
    				$$invalidate(14, ssrMatch = registerRoute(updatedRoute));
    			}
    		}

    		if ($$self.$$.dirty & /*ssrMatch, $activeRoute*/ 49152) {
    			$$invalidate(2, isActive = !!(ssrMatch || $activeRoute && $activeRoute.id === id));
    		}

    		if ($$self.$$.dirty & /*isActive, ssrMatch, $activeRoute*/ 49156) {
    			if (isActive) {
    				const { params: activeParams } = ssrMatch || $activeRoute;
    				params.set(activeParams);
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		primary,
    		isActive,
    		$location,
    		$params,
    		id,
    		activeRoute,
    		parentBase,
    		location,
    		params,
    		navigate,
    		$$restProps,
    		path,
    		meta,
    		ssrMatch,
    		$activeRoute,
    		$parentBase,
    		slots,
    		$$scope
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			path: 12,
    			component: 0,
    			meta: 13,
    			primary: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get meta() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meta(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Route$1 = Route;

    /* node_modules\svelte-navigator\src\Link.svelte generated by Svelte v3.49.0 */
    const file$c = "node_modules\\svelte-navigator\\src\\Link.svelte";

    function create_fragment$c(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	let a_levels = [{ href: /*href*/ ctx[0] }, /*ariaCurrent*/ ctx[2], /*props*/ ctx[1]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$c, 63, 0, 1735);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				dirty & /*ariaCurrent*/ 4 && /*ariaCurrent*/ ctx[2],
    				dirty & /*props*/ 2 && /*props*/ ctx[1]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let href;
    	let isPartiallyCurrent;
    	let isCurrent;
    	let ariaCurrent;
    	let props;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = null } = $$props;
    	usePreflightCheck(LINK_ID, $$props);
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(11, $location = value));
    	const dispatch = createEventDispatcher();
    	const resolve = useResolve();
    	const { navigate } = useHistory();

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = isCurrent || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(17, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(5, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(6, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(7, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		useLocation,
    		useResolve,
    		useHistory,
    		usePreflightCheck,
    		shouldNavigate,
    		isFunction,
    		startsWith,
    		LINK_ID,
    		to,
    		replace,
    		state,
    		getProps,
    		location,
    		dispatch,
    		resolve,
    		navigate,
    		onClick,
    		href,
    		isCurrent,
    		isPartiallyCurrent,
    		props,
    		ariaCurrent,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ('to' in $$props) $$invalidate(5, to = $$new_props.to);
    		if ('replace' in $$props) $$invalidate(6, replace = $$new_props.replace);
    		if ('state' in $$props) $$invalidate(7, state = $$new_props.state);
    		if ('getProps' in $$props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('isCurrent' in $$props) $$invalidate(9, isCurrent = $$new_props.isCurrent);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(10, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $location*/ 2080) {
    			// We need to pass location here to force re-resolution of the link,
    			// when the pathname changes. Otherwise we could end up with stale path params,
    			// when for example an :id changes in the parent Routes path
    			$$invalidate(0, href = resolve(to, $location));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 2049) {
    			$$invalidate(10, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 2049) {
    			$$invalidate(9, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 512) {
    			$$invalidate(2, ariaCurrent = isCurrent ? { "aria-current": "page" } : {});
    		}

    		$$invalidate(1, props = (() => {
    			if (isFunction(getProps)) {
    				const dynamicProps = getProps({
    					location: $location,
    					href,
    					isPartiallyCurrent,
    					isCurrent
    				});

    				return { ...$$restProps, ...dynamicProps };
    			}

    			return $$restProps;
    		})());
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		href,
    		props,
    		ariaCurrent,
    		location,
    		onClick,
    		to,
    		replace,
    		state,
    		getProps,
    		isCurrent,
    		isPartiallyCurrent,
    		$location,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { to: 5, replace: 6, state: 7, getProps: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*to*/ ctx[5] === undefined && !('to' in props)) {
    			console.warn("<Link> was created without expected prop 'to'");
    		}
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Link$1 = Link;

    const userData = writable([]);

    const fetchData = async () => {
      const url = `http://localhost:5000/users`;
      const res = await fetch(url);
      const data = await res.json();
      console.log("DATA: ", data);
      const loadedData = data.map((data, index) => ({
        index: index,
        name: data.name,
        email: data.email,
        password: data.password,
        usergroup: data.usergroup,
        isActive: data.enable,
      }));
      userData.set(loadedData);
    };

    /* src\components\Login.svelte generated by Svelte v3.49.0 */

    const { console: console_1 } = globals;
    const file$b = "src\\components\\Login.svelte";

    // (13:2) {#if username}
    function create_if_block(ctx) {
    	let t_value = /*username*/ ctx[0].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*username*/ 1 && t_value !== (t_value = /*username*/ ctx[0].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(13:2) {#if username}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let main;
    	let t0;
    	let div7;
    	let div6;
    	let div0;
    	let img;
    	let img_src_value;
    	let t1;
    	let h3;
    	let t3;
    	let div5;
    	let div1;
    	let label0;
    	let t5;
    	let input0;
    	let t6;
    	let div4;
    	let div2;
    	let label1;
    	let t8;
    	let input1;
    	let t9;
    	let div3;
    	let button;
    	let t11;
    	let footer;
    	let p;
    	let t12;
    	let t13_value = new Date().getFullYear() + "";
    	let t13;
    	let t14_value = " " + "";
    	let t14;
    	let t15;
    	let a;
    	let t17;
    	let if_block = /*username*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (if_block) if_block.c();
    			t0 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t1 = space();
    			h3 = element("h3");
    			h3.textContent = "Task Management System";
    			t3 = space();
    			div5 = element("div");
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Username";
    			t5 = space();
    			input0 = element("input");
    			t6 = space();
    			div4 = element("div");
    			div2 = element("div");
    			label1 = element("label");
    			label1.textContent = "Password";
    			t8 = space();
    			input1 = element("input");
    			t9 = space();
    			div3 = element("div");
    			button = element("button");
    			button.textContent = "Login";
    			t11 = space();
    			footer = element("footer");
    			p = element("p");
    			t12 = text("Copyright © ");
    			t13 = text(t13_value);
    			t14 = text(t14_value);
    			t15 = space();
    			a = element("a");
    			a.textContent = "Task Management System";
    			t17 = text("\r\n        . All rights reserved.");
    			if (!src_url_equal(img.src, img_src_value = "https://www.outsystems.com/Forge_BL/rest/ComponentThumbnail/GetURL_ComponentThumbnail?ProjectImageId=25068")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "logo");
    			attr_dev(img, "class", "svelte-194w2n9");
    			add_location(img, file$b, 20, 8, 519);
    			attr_dev(div0, "class", "flex justify-center");
    			add_location(div0, file$b, 19, 6, 476);
    			attr_dev(h3, "class", "text-2xl font-bold text-center");
    			add_location(h3, file$b, 25, 6, 703);
    			attr_dev(label0, "for", "username");
    			attr_dev(label0, "class", "block text-sm text-gray-800");
    			add_location(label0, file$b, 29, 10, 894);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "block w-full px-4 py-2 mt-2 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40");
    			attr_dev(input0, "name", "username");
    			add_location(input0, file$b, 32, 10, 1006);
    			add_location(div1, file$b, 27, 8, 809);
    			attr_dev(label1, "for", "password");
    			attr_dev(label1, "class", "block text-sm text-gray-800");
    			add_location(label1, file$b, 40, 12, 1325);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "class", "block w-full px-4 py-2 mt-2 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40");
    			attr_dev(input1, "name", "password");
    			add_location(input1, file$b, 43, 12, 1443);
    			add_location(div2, file$b, 39, 10, 1306);
    			attr_dev(button, "class", "w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-primary rounded-md hover:bg-blue-600 focus:outline-none focus:primary-focus");
    			add_location(button, file$b, 50, 12, 1761);
    			attr_dev(div3, "class", "mt-6");
    			add_location(div3, file$b, 49, 10, 1729);
    			attr_dev(div4, "class", "mt-4");
    			add_location(div4, file$b, 38, 8, 1276);
    			attr_dev(div5, "class", "mt-6");
    			add_location(div5, file$b, 26, 6, 781);
    			attr_dev(div6, "class", "w-full p-6 m-auto bg-white rounded shadow-lg ring-2 lg:max-w-md");
    			add_location(div6, file$b, 16, 4, 378);
    			attr_dev(a, "href", "/");
    			attr_dev(a, "class", "text-muted");
    			add_location(a, file$b, 69, 8, 2514);
    			attr_dev(p, "class", "m-0");
    			add_location(p, file$b, 67, 6, 2431);
    			attr_dev(footer, "class", "border-top text-center p-4 bg-base-300 text-base-content");
    			add_location(footer, file$b, 66, 4, 2350);
    			attr_dev(div7, "class", "relative flex flex-col justify-center min-h-screen ");
    			add_location(div7, file$b, 15, 2, 307);
    			attr_dev(main, "class", "svelte-194w2n9");
    			add_location(main, file$b, 11, 0, 249);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if (if_block) if_block.m(main, null);
    			append_dev(main, t0);
    			append_dev(main, div7);
    			append_dev(div7, div6);
    			append_dev(div6, div0);
    			append_dev(div0, img);
    			append_dev(div6, t1);
    			append_dev(div6, h3);
    			append_dev(div6, t3);
    			append_dev(div6, div5);
    			append_dev(div5, div1);
    			append_dev(div1, label0);
    			append_dev(div1, t5);
    			append_dev(div1, input0);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, label1);
    			append_dev(div2, t8);
    			append_dev(div2, input1);
    			append_dev(div4, t9);
    			append_dev(div4, div3);
    			append_dev(div3, button);
    			append_dev(div7, t11);
    			append_dev(div7, footer);
    			append_dev(footer, p);
    			append_dev(p, t12);
    			append_dev(p, t13);
    			append_dev(p, t14);
    			append_dev(p, t15);
    			append_dev(p, a);
    			append_dev(p, t17);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*username*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(main, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);
    	fetchData();
    	let username = [];

    	// console.log($userData);
    	userData.subscribe(item => {
    		$$invalidate(0, username = item[0]);
    		console.log("username: ", username);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ fetchData, userData, username });

    	$$self.$inject_state = $$props => {
    		if ('username' in $$props) $$invalidate(0, username = $$props.username);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [username];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\components\Home.svelte generated by Svelte v3.49.0 */
    const file$a = "src\\components\\Home.svelte";

    function create_fragment$a(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "All Applications";
    			attr_dev(div0, "class", "text-2xl font-bold mb-5 text-center ");
    			add_location(div0, file$a, 16, 2, 313);
    			attr_dev(div1, "class", "mb-5 mt-20");
    			add_location(div1, file$a, 15, 0, 285);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	fetchData();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ fetchData });
    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\components\Profile.svelte generated by Svelte v3.49.0 */
    const file$9 = "src\\components\\Profile.svelte";

    // (9:8) <Link to="/home" style="color:black">
    function create_default_slot_2$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Home");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(9:8) <Link to=\\\"/home\\\" style=\\\"color:black\\\">",
    		ctx
    	});

    	return block;
    }

    // (35:6) <Link to="/updatepassword">
    function create_default_slot_1$8(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Update Password";
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "btn btn-primary ");
    			add_location(button, file$9, 35, 8, 1118);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$8.name,
    		type: "slot",
    		source: "(35:6) <Link to=\\\"/updatepassword\\\">",
    		ctx
    	});

    	return block;
    }

    // (42:6) <Link to="/updateemail">
    function create_default_slot$9(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Update Email";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-primary");
    			add_location(button, file$9, 42, 8, 1291);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(42:6) <Link to=\\\"/updateemail\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div10;
    	let div0;
    	let ul0;
    	let li0;
    	let link0;
    	let t0;
    	let li1;
    	let t2;
    	let div1;
    	let strong;
    	let t4;
    	let div6;
    	let div5;
    	let div4;
    	let div2;
    	let label0;
    	let t6;
    	let p;
    	let t7;
    	let div3;
    	let label1;
    	let t9;
    	let ul1;
    	let t10;
    	let div9;
    	let div7;
    	let link1;
    	let t11;
    	let div8;
    	let link2;
    	let current;

    	link0 = new Link$1({
    			props: {
    				to: "/home",
    				style: "color:black",
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "/updatepassword",
    				$$slots: { default: [create_default_slot_1$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link$1({
    			props: {
    				to: "/updateemail",
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			div0 = element("div");
    			ul0 = element("ul");
    			li0 = element("li");
    			create_component(link0.$$.fragment);
    			t0 = space();
    			li1 = element("li");
    			li1.textContent = "Profile";
    			t2 = space();
    			div1 = element("div");
    			strong = element("strong");
    			strong.textContent = "'s Profile";
    			t4 = space();
    			div6 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			div2 = element("div");
    			label0 = element("label");
    			label0.textContent = "Email";
    			t6 = space();
    			p = element("p");
    			t7 = space();
    			div3 = element("div");
    			label1 = element("label");
    			label1.textContent = "User Group (s)";
    			t9 = space();
    			ul1 = element("ul");
    			t10 = space();
    			div9 = element("div");
    			div7 = element("div");
    			create_component(link1.$$.fragment);
    			t11 = space();
    			div8 = element("div");
    			create_component(link2.$$.fragment);
    			add_location(li0, file$9, 7, 6, 157);
    			add_location(li1, file$9, 10, 6, 240);
    			add_location(ul0, file$9, 6, 4, 145);
    			attr_dev(div0, "class", "text-sm breadcrumbs m-7");
    			add_location(div0, file$9, 5, 2, 102);
    			add_location(strong, file$9, 14, 4, 343);
    			attr_dev(div1, "class", "text-2xl font-bold mb-5 place-self-center ");
    			add_location(div1, file$9, 13, 2, 281);
    			attr_dev(label0, "class", "block text-black text-sm font-bold mb-2");
    			add_location(label0, file$9, 21, 10, 641);
    			add_location(p, file$9, 22, 10, 721);
    			attr_dev(div2, "class", "mb-6");
    			add_location(div2, file$9, 19, 8, 543);
    			attr_dev(label1, "class", "block text-black text-sm font-bold mb-2");
    			add_location(label1, file$9, 26, 10, 852);
    			add_location(ul1, file$9, 27, 10, 941);
    			attr_dev(div3, "class", "mb-6");
    			add_location(div3, file$9, 24, 8, 754);
    			attr_dev(div4, "class", "grid flex-grow h-40 card bg-base-300 rounded-box m-10 pt-4 text-center");
    			add_location(div4, file$9, 18, 6, 449);
    			attr_dev(div5, "class", "flex flex-col w-full lg:flex-row");
    			add_location(div5, file$9, 17, 4, 395);
    			add_location(div6, file$9, 16, 2, 384);
    			add_location(div7, file$9, 33, 4, 1068);
    			add_location(div8, file$9, 40, 4, 1244);
    			attr_dev(div9, "class", "grid grid-cols-2 place-self-center gap-5 ");
    			add_location(div9, file$9, 32, 2, 1007);
    			attr_dev(div10, "class", "flex flex-col w-full");
    			add_location(div10, file$9, 4, 0, 64);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div0);
    			append_dev(div0, ul0);
    			append_dev(ul0, li0);
    			mount_component(link0, li0, null);
    			append_dev(ul0, t0);
    			append_dev(ul0, li1);
    			append_dev(div10, t2);
    			append_dev(div10, div1);
    			append_dev(div1, strong);
    			append_dev(div10, t4);
    			append_dev(div10, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, label0);
    			append_dev(div2, t6);
    			append_dev(div2, p);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			append_dev(div3, label1);
    			append_dev(div3, t9);
    			append_dev(div3, ul1);
    			append_dev(div10, t10);
    			append_dev(div10, div9);
    			append_dev(div9, div7);
    			mount_component(link1, div7, null);
    			append_dev(div9, t11);
    			append_dev(div9, div8);
    			mount_component(link2, div8, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Profile', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Profile> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link: Link$1 });
    	return [];
    }

    class Profile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Profile",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\components\UpdatePassword.svelte generated by Svelte v3.49.0 */
    const file$8 = "src\\components\\UpdatePassword.svelte";

    // (10:10) <Link to="/home" style="color:black">
    function create_default_slot_1$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Home");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$7.name,
    		type: "slot",
    		source: "(10:10) <Link to=\\\"/home\\\" style=\\\"color:black\\\">",
    		ctx
    	});

    	return block;
    }

    // (13:10) <Link to="/profile" style="color:black">
    function create_default_slot$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Profile");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(13:10) <Link to=\\\"/profile\\\" style=\\\"color:black\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div6;
    	let div1;
    	let div0;
    	let ul;
    	let li0;
    	let link0;
    	let t0;
    	let li1;
    	let link1;
    	let t1;
    	let li2;
    	let t3;
    	let form;
    	let div5;
    	let t4_value = " " + "";
    	let t4;
    	let t5;
    	let div4;
    	let div2;
    	let label0;
    	let t7;
    	let input0;
    	let t8;
    	let div3;
    	let label1;
    	let t10;
    	let input1;
    	let t11;
    	let button;
    	let current;

    	link0 = new Link$1({
    			props: {
    				to: "/home",
    				style: "color:black",
    				$$slots: { default: [create_default_slot_1$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "/profile",
    				style: "color:black",
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			create_component(link0.$$.fragment);
    			t0 = space();
    			li1 = element("li");
    			create_component(link1.$$.fragment);
    			t1 = space();
    			li2 = element("li");
    			li2.textContent = "Update Password";
    			t3 = space();
    			form = element("form");
    			div5 = element("div");
    			t4 = text(t4_value);
    			t5 = space();
    			div4 = element("div");
    			div2 = element("div");
    			label0 = element("label");
    			label0.textContent = "Old Password";
    			t7 = space();
    			input0 = element("input");
    			t8 = space();
    			div3 = element("div");
    			label1 = element("label");
    			label1.textContent = "New Password";
    			t10 = space();
    			input1 = element("input");
    			t11 = space();
    			button = element("button");
    			button.textContent = "Update Password";
    			add_location(li0, file$8, 8, 8, 201);
    			add_location(li1, file$8, 11, 8, 290);
    			add_location(li2, file$8, 14, 8, 385);
    			add_location(ul, file$8, 7, 6, 187);
    			attr_dev(div0, "class", "text-sm breadcrumbs m-7");
    			add_location(div0, file$8, 6, 4, 142);
    			attr_dev(div1, "class", "flex justify-between");
    			add_location(div1, file$8, 5, 2, 102);
    			attr_dev(label0, "class", "block text-gray-700 text-sm font-bold mb-2");
    			add_location(label0, file$8, 24, 10, 715);
    			attr_dev(input0, "class", "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline");
    			attr_dev(input0, "type", "password");
    			attr_dev(input0, "name", "oldpassword");
    			input0.required = true;
    			add_location(input0, file$8, 25, 10, 805);
    			attr_dev(div2, "class", "mb-4");
    			add_location(div2, file$8, 22, 8, 617);
    			attr_dev(label1, "class", "block text-gray-700 text-sm font-bold mb-2");
    			add_location(label1, file$8, 29, 10, 1113);
    			attr_dev(input1, "class", "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline");
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "name", "newpassword");
    			input1.required = true;
    			add_location(input1, file$8, 30, 10, 1203);
    			attr_dev(div3, "class", "mb-6");
    			add_location(div3, file$8, 27, 8, 1015);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "btn btn-primary");
    			add_location(button, file$8, 32, 8, 1418);
    			attr_dev(div4, "class", "content-center text-center");
    			add_location(div4, file$8, 21, 6, 567);
    			attr_dev(div5, "class", "grid flex-grow card bg-base-300 rounded-box place-items-center m-10 p-10");
    			add_location(div5, file$8, 19, 4, 460);
    			add_location(form, file$8, 18, 2, 448);
    			attr_dev(div6, "class", "flex flex-col w-full");
    			add_location(div6, file$8, 4, 0, 64);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div1);
    			append_dev(div1, div0);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			mount_component(link0, li0, null);
    			append_dev(ul, t0);
    			append_dev(ul, li1);
    			mount_component(link1, li1, null);
    			append_dev(ul, t1);
    			append_dev(ul, li2);
    			append_dev(div6, t3);
    			append_dev(div6, form);
    			append_dev(form, div5);
    			append_dev(div5, t4);
    			append_dev(div5, t5);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, label0);
    			append_dev(div2, t7);
    			append_dev(div2, input0);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div3, label1);
    			append_dev(div3, t10);
    			append_dev(div3, input1);
    			append_dev(div4, t11);
    			append_dev(div4, button);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			destroy_component(link0);
    			destroy_component(link1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UpdatePassword', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UpdatePassword> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link: Link$1 });
    	return [];
    }

    class UpdatePassword extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UpdatePassword",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\components\UpdateEmail.svelte generated by Svelte v3.49.0 */
    const file$7 = "src\\components\\UpdateEmail.svelte";

    // (10:10) <Link to="/home" style="color:black">
    function create_default_slot_1$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Home");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(10:10) <Link to=\\\"/home\\\" style=\\\"color:black\\\">",
    		ctx
    	});

    	return block;
    }

    // (13:10) <Link to="/profile" style="color:black">
    function create_default_slot$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Profile");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(13:10) <Link to=\\\"/profile\\\" style=\\\"color:black\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div5;
    	let div1;
    	let div0;
    	let ul;
    	let li0;
    	let link0;
    	let t0;
    	let li1;
    	let link1;
    	let t1;
    	let li2;
    	let t3;
    	let div4;
    	let div3;
    	let div2;
    	let label;
    	let t5;
    	let input;
    	let t6;
    	let button;
    	let current;

    	link0 = new Link$1({
    			props: {
    				to: "/home",
    				style: "color:black",
    				$$slots: { default: [create_default_slot_1$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "/profile",
    				style: "color:black",
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			create_component(link0.$$.fragment);
    			t0 = space();
    			li1 = element("li");
    			create_component(link1.$$.fragment);
    			t1 = space();
    			li2 = element("li");
    			li2.textContent = "Update Email";
    			t3 = space();
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			label = element("label");
    			label.textContent = "Email";
    			t5 = space();
    			input = element("input");
    			t6 = space();
    			button = element("button");
    			button.textContent = "Update Email";
    			add_location(li0, file$7, 8, 8, 201);
    			add_location(li1, file$7, 11, 8, 290);
    			add_location(li2, file$7, 14, 8, 385);
    			add_location(ul, file$7, 7, 6, 187);
    			attr_dev(div0, "class", "text-sm breadcrumbs m-7");
    			add_location(div0, file$7, 6, 4, 142);
    			attr_dev(div1, "class", "flex justify-between");
    			add_location(div1, file$7, 5, 2, 102);
    			attr_dev(label, "class", "block text-gray-700 text-sm font-bold mb-2");
    			add_location(label, file$7, 22, 8, 704);
    			attr_dev(input, "class", "shadow appearance-none border rounded w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline");
    			attr_dev(input, "type", "email");
    			attr_dev(input, "name", "email");
    			add_location(input, file$7, 23, 8, 785);
    			attr_dev(div2, "class", "mb-4");
    			add_location(div2, file$7, 20, 6, 610);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-primary");
    			add_location(button, file$7, 25, 6, 971);
    			attr_dev(div3, "class", "w-full max-w-lg ml-20 place-self-center");
    			add_location(div3, file$7, 19, 4, 549);
    			attr_dev(div4, "class", "grid flex-grow card bg-base-300 rounded-box place-items-center m-10 p-10 text-center");
    			add_location(div4, file$7, 18, 2, 445);
    			attr_dev(div5, "class", "flex flex-col w-full");
    			add_location(div5, file$7, 4, 0, 64);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div1);
    			append_dev(div1, div0);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			mount_component(link0, li0, null);
    			append_dev(ul, t0);
    			append_dev(ul, li1);
    			mount_component(link1, li1, null);
    			append_dev(ul, t1);
    			append_dev(ul, li2);
    			append_dev(div5, t3);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, label);
    			append_dev(div2, t5);
    			append_dev(div2, input);
    			append_dev(div3, t6);
    			append_dev(div3, button);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_component(link0);
    			destroy_component(link1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UpdateEmail', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UpdateEmail> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link: Link$1 });
    	return [];
    }

    class UpdateEmail extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UpdateEmail",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\components\UserManagementSystem.svelte generated by Svelte v3.49.0 */
    const file$6 = "src\\components\\UserManagementSystem.svelte";

    // (13:14) <Link to="/home" style="color:black">
    function create_default_slot_2$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Home");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(13:14) <Link to=\\\"/home\\\" style=\\\"color:black\\\">",
    		ctx
    	});

    	return block;
    }

    // (19:10) <Link to="/creategroup">
    function create_default_slot_1$5(ctx) {
    	let button;
    	let svg;
    	let path;
    	let t0_value = " " + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = text(t0_value);
    			t1 = text("\r\n              Create New Group");
    			attr_dev(path, "strokelinecap", "round");
    			attr_dev(path, "strokelinejoin", "round");
    			attr_dev(path, "strokewidth", "2");
    			attr_dev(path, "d", "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z");
    			add_location(path, file$6, 21, 16, 796);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-5 w-5 mr-2");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			add_location(svg, file$6, 20, 14, 663);
    			attr_dev(button, "class", "inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-md mr-5");
    			add_location(button, file$6, 19, 12, 516);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, svg);
    			append_dev(svg, path);
    			append_dev(svg, t0);
    			append_dev(button, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(19:10) <Link to=\\\"/creategroup\\\">",
    		ctx
    	});

    	return block;
    }

    // (27:10) <Link to="/createuser">
    function create_default_slot$6(ctx) {
    	let button;
    	let svg;
    	let path;
    	let t;

    	const block = {
    		c: function create() {
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t = text("\r\n              Add New User");
    			attr_dev(path, "strokelinecap", "round");
    			attr_dev(path, "strokelinejoin", "round");
    			attr_dev(path, "strokewidth", "2");
    			attr_dev(path, "d", "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z");
    			add_location(path, file$6, 29, 16, 1557);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-5 w-5 mr-2");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			add_location(svg, file$6, 28, 14, 1424);
    			attr_dev(button, "class", "inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-md");
    			add_location(button, file$6, 27, 12, 1282);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, svg);
    			append_dev(svg, path);
    			append_dev(button, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(27:10) <Link to=\\\"/createuser\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div8;
    	let div0;
    	let t0;
    	let div7;
    	let div3;
    	let div1;
    	let ul;
    	let li0;
    	let link0;
    	let t1;
    	let li1;
    	let t3;
    	let div2;
    	let link1;
    	let t4;
    	let link2;
    	let t5;
    	let div5;
    	let div4;
    	let svg;
    	let path;
    	let t6;
    	let input;
    	let t7;
    	let button;
    	let t9;
    	let div6;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t11;
    	let th1;
    	let t13;
    	let th2;
    	let t15;
    	let th3;
    	let t17;
    	let th4;
    	let current;

    	link0 = new Link$1({
    			props: {
    				to: "/home",
    				style: "color:black",
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "/creategroup",
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link$1({
    			props: {
    				to: "/createuser",
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div7 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			create_component(link0.$$.fragment);
    			t1 = space();
    			li1 = element("li");
    			li1.textContent = "User Management System";
    			t3 = space();
    			div2 = element("div");
    			create_component(link1.$$.fragment);
    			t4 = space();
    			create_component(link2.$$.fragment);
    			t5 = space();
    			div5 = element("div");
    			div4 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t6 = space();
    			input = element("input");
    			t7 = space();
    			button = element("button");
    			button.textContent = "Search";
    			t9 = space();
    			div6 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Username";
    			t11 = space();
    			th1 = element("th");
    			th1.textContent = "Email";
    			t13 = space();
    			th2 = element("th");
    			th2.textContent = "User Group (s)";
    			t15 = space();
    			th3 = element("th");
    			th3.textContent = "Status";
    			t17 = space();
    			th4 = element("th");
    			th4.textContent = "Action (s)";
    			attr_dev(div0, "class", "grid place-items-center ");
    			add_location(div0, file$6, 5, 2, 73);
    			add_location(li0, file$6, 11, 12, 251);
    			add_location(li1, file$6, 14, 12, 352);
    			add_location(ul, file$6, 10, 10, 233);
    			attr_dev(div1, "class", "text-sm breadcrumbs m-7");
    			add_location(div1, file$6, 9, 8, 184);
    			attr_dev(div2, "class", "flex justify-end pr-5 pt-5");
    			add_location(div2, file$6, 17, 8, 426);
    			attr_dev(div3, "class", "flex justify-between");
    			add_location(div3, file$6, 8, 6, 140);
    			attr_dev(path, "strokelinecap", "round");
    			attr_dev(path, "strokelinejoin", "round");
    			attr_dev(path, "strokewidth", "2");
    			attr_dev(path, "d", "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z");
    			add_location(path, file$6, 39, 12, 2132);
    			attr_dev(svg, "class", "w-5 h-5 text-gray-500 dark:text-gray-400");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$6, 38, 10, 1975);
    			attr_dev(div4, "class", "flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none");
    			add_location(div4, file$6, 37, 8, 1881);
    			attr_dev(input, "type", "search");
    			attr_dev(input, "class", "block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500");
    			attr_dev(input, "placeholder", "Search Users...");
    			add_location(input, file$6, 42, 8, 2292);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800");
    			add_location(button, file$6, 43, 8, 2628);
    			attr_dev(div5, "class", "relative m-5");
    			add_location(div5, file$6, 36, 6, 1845);
    			add_location(th0, file$6, 52, 14, 3091);
    			add_location(th1, file$6, 53, 14, 3124);
    			add_location(th2, file$6, 54, 14, 3154);
    			add_location(th3, file$6, 55, 14, 3193);
    			add_location(th4, file$6, 56, 14, 3224);
    			add_location(tr, file$6, 51, 12, 3071);
    			add_location(thead, file$6, 50, 10, 3050);
    			attr_dev(table, "class", "table table-zebra w-full");
    			add_location(table, file$6, 49, 8, 2998);
    			attr_dev(div6, "class", "overflow-x-auto m-5");
    			add_location(div6, file$6, 48, 6, 2955);
    			add_location(div7, file$6, 7, 4, 127);
    			add_location(div8, file$6, 4, 0, 64);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div0);
    			append_dev(div8, t0);
    			append_dev(div8, div7);
    			append_dev(div7, div3);
    			append_dev(div3, div1);
    			append_dev(div1, ul);
    			append_dev(ul, li0);
    			mount_component(link0, li0, null);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			mount_component(link1, div2, null);
    			append_dev(div2, t4);
    			mount_component(link2, div2, null);
    			append_dev(div7, t5);
    			append_dev(div7, div5);
    			append_dev(div5, div4);
    			append_dev(div4, svg);
    			append_dev(svg, path);
    			append_dev(div5, t6);
    			append_dev(div5, input);
    			append_dev(div5, t7);
    			append_dev(div5, button);
    			append_dev(div7, t9);
    			append_dev(div7, div6);
    			append_dev(div6, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t11);
    			append_dev(tr, th1);
    			append_dev(tr, t13);
    			append_dev(tr, th2);
    			append_dev(tr, t15);
    			append_dev(tr, th3);
    			append_dev(tr, t17);
    			append_dev(tr, th4);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UserManagementSystem', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UserManagementSystem> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link: Link$1 });
    	return [];
    }

    class UserManagementSystem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserManagementSystem",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\components\CreateUser.svelte generated by Svelte v3.49.0 */
    const file$5 = "src\\components\\CreateUser.svelte";

    // (9:8) <Link to="/home" style="color:black">
    function create_default_slot_1$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Home");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(9:8) <Link to=\\\"/home\\\" style=\\\"color:black\\\">",
    		ctx
    	});

    	return block;
    }

    // (12:8) <Link to="/usermanagementsystem" style="color:black">
    function create_default_slot$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("User Management System");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(12:8) <Link to=\\\"/usermanagementsystem\\\" style=\\\"color:black\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div9;
    	let div0;
    	let ul;
    	let li0;
    	let link0;
    	let t0;
    	let li1;
    	let link1;
    	let t1;
    	let li2;
    	let t3;
    	let form;
    	let div1;
    	let t5;
    	let div8;
    	let div2;
    	let label0;
    	let t7;
    	let input0;
    	let t8;
    	let div3;
    	let label1;
    	let t10;
    	let input1;
    	let t11;
    	let div4;
    	let label2;
    	let t13;
    	let input2;
    	let t14;
    	let div7;
    	let label3;
    	let t16;
    	let div6;
    	let select;
    	let option0;
    	let option1;
    	let t18;
    	let div5;
    	let svg;
    	let path;
    	let t19;
    	let button;
    	let current;

    	link0 = new Link$1({
    			props: {
    				to: "/home",
    				style: "color:black",
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "/usermanagementsystem",
    				style: "color:black",
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div0 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			create_component(link0.$$.fragment);
    			t0 = space();
    			li1 = element("li");
    			create_component(link1.$$.fragment);
    			t1 = space();
    			li2 = element("li");
    			li2.textContent = "Add New User";
    			t3 = space();
    			form = element("form");
    			div1 = element("div");
    			div1.textContent = "Create New User";
    			t5 = space();
    			div8 = element("div");
    			div2 = element("div");
    			label0 = element("label");
    			label0.textContent = "Username";
    			t7 = space();
    			input0 = element("input");
    			t8 = space();
    			div3 = element("div");
    			label1 = element("label");
    			label1.textContent = "Password";
    			t10 = space();
    			input1 = element("input");
    			t11 = space();
    			div4 = element("div");
    			label2 = element("label");
    			label2.textContent = "Email";
    			t13 = space();
    			input2 = element("input");
    			t14 = space();
    			div7 = element("div");
    			label3 = element("label");
    			label3.textContent = "User Group";
    			t16 = space();
    			div6 = element("div");
    			select = element("select");
    			option0 = element("option");
    			option1 = element("option");
    			option1.textContent = "Admin";
    			t18 = space();
    			div5 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t19 = space();
    			button = element("button");
    			button.textContent = "Create User";
    			add_location(li0, file$5, 7, 6, 157);
    			add_location(li1, file$5, 10, 6, 240);
    			add_location(li2, file$5, 13, 6, 357);
    			add_location(ul, file$5, 6, 4, 145);
    			attr_dev(div0, "class", "text-sm breadcrumbs m-7");
    			add_location(div0, file$5, 5, 2, 102);
    			attr_dev(div1, "class", "text-2xl font-bold mb-5 ");
    			add_location(div1, file$5, 18, 4, 477);
    			attr_dev(label0, "class", "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2");
    			attr_dev(label0, "for", "grid-username");
    			add_location(label0, file$5, 22, 8, 690);
    			attr_dev(input0, "class", "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Jane");
    			attr_dev(input0, "name", "username");
    			input0.required = true;
    			add_location(input0, file$5, 25, 8, 840);
    			attr_dev(div2, "class", "w-full px-3");
    			add_location(div2, file$5, 20, 6, 589);
    			attr_dev(label1, "class", "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2");
    			attr_dev(label1, "for", "grid-password");
    			attr_dev(label1, "type", "password");
    			add_location(label1, file$5, 28, 8, 1141);
    			attr_dev(input1, "class", "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500");
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "placeholder", "**********");
    			attr_dev(input1, "name", "password");
    			input1.required = true;
    			add_location(input1, file$5, 31, 8, 1307);
    			attr_dev(div3, "class", "w-full px-3");
    			add_location(div3, file$5, 27, 6, 1106);
    			attr_dev(label2, "class", "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2");
    			attr_dev(label2, "for", "grid-email");
    			add_location(label2, file$5, 34, 8, 1618);
    			attr_dev(input2, "class", "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500");
    			attr_dev(input2, "type", "email");
    			attr_dev(input2, "placeholder", "jane@test.com");
    			attr_dev(input2, "name", "email");
    			input2.required = true;
    			add_location(input2, file$5, 37, 8, 1762);
    			attr_dev(div4, "class", "w-full px-3");
    			add_location(div4, file$5, 33, 6, 1583);
    			attr_dev(label3, "class", "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2");
    			attr_dev(label3, "for", "grid-state");
    			add_location(label3, file$5, 40, 8, 2092);
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$5, 45, 12, 2493);
    			option1.__value = "admin";
    			option1.value = option1.__value;
    			add_location(option1, file$5, 46, 12, 2524);
    			attr_dev(select, "class", "block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500");
    			attr_dev(select, "name", "usergroup");
    			add_location(select, file$5, 44, 10, 2275);
    			attr_dev(path, "d", "M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z");
    			add_location(path, file$5, 50, 14, 2809);
    			attr_dev(svg, "class", "fill-current h-4 w-4");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			add_location(svg, file$5, 49, 12, 2704);
    			attr_dev(div5, "class", "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700");
    			add_location(div5, file$5, 48, 10, 2593);
    			attr_dev(div6, "class", "relative");
    			add_location(div6, file$5, 43, 8, 2241);
    			attr_dev(div7, "class", "w-full md:w-1/3 px-3 mb-6 md:mb-0");
    			add_location(div7, file$5, 39, 6, 2035);
    			attr_dev(div8, "class", "flex flex-wrap -mx-3 mb-6");
    			add_location(div8, file$5, 19, 4, 542);
    			attr_dev(button, "class", "btn btn-primary place-items-center");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$5, 56, 4, 2982);
    			attr_dev(form, "class", "w-full max-w-lg ml-20 place-self-center text-center");
    			add_location(form, file$5, 17, 2, 405);
    			attr_dev(div9, "class", "flex flex-col w-full");
    			add_location(div9, file$5, 4, 0, 64);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div0);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			mount_component(link0, li0, null);
    			append_dev(ul, t0);
    			append_dev(ul, li1);
    			mount_component(link1, li1, null);
    			append_dev(ul, t1);
    			append_dev(ul, li2);
    			append_dev(div9, t3);
    			append_dev(div9, form);
    			append_dev(form, div1);
    			append_dev(form, t5);
    			append_dev(form, div8);
    			append_dev(div8, div2);
    			append_dev(div2, label0);
    			append_dev(div2, t7);
    			append_dev(div2, input0);
    			append_dev(div8, t8);
    			append_dev(div8, div3);
    			append_dev(div3, label1);
    			append_dev(div3, t10);
    			append_dev(div3, input1);
    			append_dev(div8, t11);
    			append_dev(div8, div4);
    			append_dev(div4, label2);
    			append_dev(div4, t13);
    			append_dev(div4, input2);
    			append_dev(div8, t14);
    			append_dev(div8, div7);
    			append_dev(div7, label3);
    			append_dev(div7, t16);
    			append_dev(div7, div6);
    			append_dev(div6, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(div6, t18);
    			append_dev(div6, div5);
    			append_dev(div5, svg);
    			append_dev(svg, path);
    			append_dev(form, t19);
    			append_dev(form, button);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			destroy_component(link0);
    			destroy_component(link1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CreateUser', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CreateUser> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link: Link$1 });
    	return [];
    }

    class CreateUser extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CreateUser",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\components\UpdateUser.svelte generated by Svelte v3.49.0 */
    const file$4 = "src\\components\\UpdateUser.svelte";

    // (10:8) <Link to="/home" style="color:black">
    function create_default_slot_1$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Home");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(10:8) <Link to=\\\"/home\\\" style=\\\"color:black\\\">",
    		ctx
    	});

    	return block;
    }

    // (13:8) <Link to="/usermanagementsystem" style="color:black">
    function create_default_slot$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("User Management System");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(13:8) <Link to=\\\"/usermanagementsystem\\\" style=\\\"color:black\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div11;
    	let div0;
    	let ul;
    	let li0;
    	let link0;
    	let t0;
    	let li1;
    	let link1;
    	let t1;
    	let li2;
    	let t3;
    	let form0;
    	let div1;
    	let t5;
    	let div6;
    	let div2;
    	let label0;
    	let t7;
    	let input0;
    	let t8;
    	let div5;
    	let label1;
    	let t10;
    	let div3;
    	let t11;
    	let label2;
    	let t13;
    	let div4;
    	let t14;
    	let button0;
    	let t16;
    	let hr;
    	let t17;
    	let form1;
    	let div7;
    	let t19;
    	let div10;
    	let div8;
    	let t20;
    	let div9;
    	let label3;
    	let t22;
    	let input1;
    	let t23;
    	let button1;
    	let current;

    	link0 = new Link$1({
    			props: {
    				to: "/home",
    				style: "color:black",
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "/usermanagementsystem",
    				style: "color:black",
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div11 = element("div");
    			div0 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			create_component(link0.$$.fragment);
    			t0 = space();
    			li1 = element("li");
    			create_component(link1.$$.fragment);
    			t1 = space();
    			li2 = element("li");
    			li2.textContent = "Update User";
    			t3 = space();
    			form0 = element("form");
    			div1 = element("div");
    			div1.textContent = "Update Profile:";
    			t5 = space();
    			div6 = element("div");
    			div2 = element("div");
    			label0 = element("label");
    			label0.textContent = "Email";
    			t7 = space();
    			input0 = element("input");
    			t8 = space();
    			div5 = element("div");
    			label1 = element("label");
    			label1.textContent = "User Group";
    			t10 = space();
    			div3 = element("div");
    			t11 = space();
    			label2 = element("label");
    			label2.textContent = "Status";
    			t13 = space();
    			div4 = element("div");
    			t14 = space();
    			button0 = element("button");
    			button0.textContent = "Update User";
    			t16 = space();
    			hr = element("hr");
    			t17 = space();
    			form1 = element("form");
    			div7 = element("div");
    			div7.textContent = "Update Password";
    			t19 = space();
    			div10 = element("div");
    			div8 = element("div");
    			t20 = space();
    			div9 = element("div");
    			label3 = element("label");
    			label3.textContent = "New Password";
    			t22 = space();
    			input1 = element("input");
    			t23 = space();
    			button1 = element("button");
    			button1.textContent = "Update Password";
    			add_location(li0, file$4, 8, 6, 159);
    			add_location(li1, file$4, 11, 6, 242);
    			add_location(li2, file$4, 14, 6, 359);
    			add_location(ul, file$4, 7, 4, 147);
    			attr_dev(div0, "class", "text-sm breadcrumbs m-7");
    			add_location(div0, file$4, 6, 2, 104);
    			attr_dev(div1, "class", "text-2xl font-bold mb-5 ");
    			add_location(div1, file$4, 18, 6, 468);
    			attr_dev(label0, "class", "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2");
    			attr_dev(label0, "for", "grid-password");
    			add_location(label0, file$4, 23, 10, 681);
    			attr_dev(input0, "class", "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "email");
    			add_location(input0, file$4, 26, 10, 834);
    			attr_dev(div2, "class", "w-full px-3");
    			add_location(div2, file$4, 21, 8, 576);
    			attr_dev(label1, "class", "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-3");
    			attr_dev(label1, "for", "grid-state");
    			add_location(label1, file$4, 30, 10, 1192);
    			attr_dev(div3, "class", "relative");
    			add_location(div3, file$4, 33, 10, 1347);
    			attr_dev(label2, "class", "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-5");
    			attr_dev(label2, "for", "grid-state");
    			add_location(label2, file$4, 36, 10, 1410);
    			attr_dev(div4, "class", "relative");
    			add_location(div4, file$4, 39, 10, 1566);
    			attr_dev(div5, "class", "w-full md:w-1/3 px-3 mb-6");
    			add_location(div5, file$4, 28, 8, 1073);
    			attr_dev(div6, "class", "flex flex-wrap");
    			add_location(div6, file$4, 20, 6, 538);
    			attr_dev(button0, "class", "btn btn-primary place-items-center");
    			attr_dev(button0, "type", "button");
    			add_location(button0, file$4, 44, 6, 1656);
    			attr_dev(form0, "class", "w-full max-w-lg ml-20 place-self-center");
    			add_location(form0, file$4, 17, 4, 406);
    			attr_dev(hr, "class", "m-10");
    			add_location(hr, file$4, 48, 2, 1777);
    			attr_dev(div7, "class", "text-2xl font-bold mb-5 ");
    			add_location(div7, file$4, 50, 4, 1860);
    			attr_dev(div8, "class", "w-full px-3");
    			add_location(div8, file$4, 53, 6, 1974);
    			attr_dev(label3, "class", "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2");
    			attr_dev(label3, "for", "grid-password");
    			add_location(label3, file$4, 55, 8, 2048);
    			attr_dev(input1, "class", "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500");
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "name", "password");
    			input1.required = true;
    			add_location(input1, file$4, 58, 8, 2202);
    			attr_dev(div9, "class", "w-full px-3");
    			add_location(div9, file$4, 54, 6, 2013);
    			attr_dev(div10, "class", "flex flex-wrap -mx-3 mb-6");
    			add_location(div10, file$4, 52, 4, 1927);
    			attr_dev(button1, "class", "btn btn-secondary place-items-center mb-10");
    			attr_dev(button1, "type", "button");
    			add_location(button1, file$4, 61, 4, 2463);
    			attr_dev(form1, "class", "w-full max-w-lg ml-20 place-self-center");
    			add_location(form1, file$4, 49, 2, 1800);
    			attr_dev(div11, "class", "flex flex-col w-full");
    			add_location(div11, file$4, 5, 0, 66);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div11, anchor);
    			append_dev(div11, div0);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			mount_component(link0, li0, null);
    			append_dev(ul, t0);
    			append_dev(ul, li1);
    			mount_component(link1, li1, null);
    			append_dev(ul, t1);
    			append_dev(ul, li2);
    			append_dev(div11, t3);
    			append_dev(div11, form0);
    			append_dev(form0, div1);
    			append_dev(form0, t5);
    			append_dev(form0, div6);
    			append_dev(div6, div2);
    			append_dev(div2, label0);
    			append_dev(div2, t7);
    			append_dev(div2, input0);
    			append_dev(div6, t8);
    			append_dev(div6, div5);
    			append_dev(div5, label1);
    			append_dev(div5, t10);
    			append_dev(div5, div3);
    			append_dev(div5, t11);
    			append_dev(div5, label2);
    			append_dev(div5, t13);
    			append_dev(div5, div4);
    			append_dev(form0, t14);
    			append_dev(form0, button0);
    			append_dev(div11, t16);
    			append_dev(div11, hr);
    			append_dev(div11, t17);
    			append_dev(div11, form1);
    			append_dev(form1, div7);
    			append_dev(form1, t19);
    			append_dev(form1, div10);
    			append_dev(div10, div8);
    			append_dev(div10, t20);
    			append_dev(div10, div9);
    			append_dev(div9, label3);
    			append_dev(div9, t22);
    			append_dev(div9, input1);
    			append_dev(form1, t23);
    			append_dev(form1, button1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div11);
    			destroy_component(link0);
    			destroy_component(link1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UpdateUser', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UpdateUser> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link: Link$1 });
    	return [];
    }

    class UpdateUser extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UpdateUser",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\GroupManagementSystem.svelte generated by Svelte v3.49.0 */
    const file$3 = "src\\components\\GroupManagementSystem.svelte";

    // (9:8) <Link to="/home" style="color:black">
    function create_default_slot_1$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Home");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(9:8) <Link to=\\\"/home\\\" style=\\\"color:black\\\">",
    		ctx
    	});

    	return block;
    }

    // (12:8) <Link to="/usermanagementsystem" style="color:black">
    function create_default_slot$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("User Management System");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(12:8) <Link to=\\\"/usermanagementsystem\\\" style=\\\"color:black\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div8;
    	let div0;
    	let ul;
    	let li0;
    	let link0;
    	let t0;
    	let li1;
    	let link1;
    	let t1;
    	let li2;
    	let t3;
    	let form;
    	let div1;
    	let t5;
    	let div3;
    	let div2;
    	let label;
    	let t7;
    	let input0;
    	let t8;
    	let button0;
    	let t10;
    	let hr;
    	let t11;
    	let div5;
    	let div4;
    	let svg;
    	let path;
    	let t12;
    	let input1;
    	let t13;
    	let button1;
    	let t15;
    	let div6;
    	let t16;
    	let div7;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t18;
    	let th1;
    	let t20;
    	let th2;
    	let current;

    	link0 = new Link$1({
    			props: {
    				to: "/home",
    				style: "color:black",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "/usermanagementsystem",
    				style: "color:black",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div0 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			create_component(link0.$$.fragment);
    			t0 = space();
    			li1 = element("li");
    			create_component(link1.$$.fragment);
    			t1 = space();
    			li2 = element("li");
    			li2.textContent = "Add New Group";
    			t3 = space();
    			form = element("form");
    			div1 = element("div");
    			div1.textContent = "Create New Group";
    			t5 = space();
    			div3 = element("div");
    			div2 = element("div");
    			label = element("label");
    			label.textContent = "User Group";
    			t7 = space();
    			input0 = element("input");
    			t8 = space();
    			button0 = element("button");
    			button0.textContent = "Create Group";
    			t10 = space();
    			hr = element("hr");
    			t11 = space();
    			div5 = element("div");
    			div4 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t12 = space();
    			input1 = element("input");
    			t13 = space();
    			button1 = element("button");
    			button1.textContent = "Search";
    			t15 = space();
    			div6 = element("div");
    			t16 = space();
    			div7 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "User Group (s)";
    			t18 = space();
    			th1 = element("th");
    			th1.textContent = "Status";
    			t20 = space();
    			th2 = element("th");
    			th2.textContent = "Action (s)";
    			add_location(li0, file$3, 7, 6, 157);
    			add_location(li1, file$3, 10, 6, 240);
    			add_location(li2, file$3, 13, 6, 357);
    			add_location(ul, file$3, 6, 4, 145);
    			attr_dev(div0, "class", "text-sm breadcrumbs m-7");
    			add_location(div0, file$3, 5, 2, 102);
    			attr_dev(div1, "class", "text-2xl font-bold mb-5 ");
    			add_location(div1, file$3, 18, 4, 478);
    			attr_dev(label, "class", "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2");
    			attr_dev(label, "for", "grid-username");
    			add_location(label, file$3, 22, 8, 692);
    			attr_dev(input0, "class", "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "require", "");
    			add_location(input0, file$3, 25, 8, 844);
    			attr_dev(div2, "class", "w-full px-3");
    			add_location(div2, file$3, 20, 6, 591);
    			attr_dev(div3, "class", "flex flex-wrap -mx-3 mb-6");
    			add_location(div3, file$3, 19, 4, 544);
    			attr_dev(button0, "class", "btn btn-primary place-items-center");
    			attr_dev(button0, "type", "submit");
    			add_location(button0, file$3, 28, 4, 1084);
    			attr_dev(form, "class", "w-full max-w-lg ml-20 place-self-center text-center");
    			add_location(form, file$3, 17, 2, 406);
    			attr_dev(hr, "class", "m-10");
    			add_location(hr, file$3, 33, 2, 1201);
    			attr_dev(path, "strokelinecap", "round");
    			attr_dev(path, "strokelinejoin", "round");
    			attr_dev(path, "strokewidth", "2");
    			attr_dev(path, "d", "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z");
    			add_location(path, file$3, 38, 8, 1501);
    			attr_dev(svg, "class", "w-5 h-5 text-gray-500 dark:text-gray-400");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$3, 37, 6, 1348);
    			attr_dev(div4, "class", "flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none");
    			add_location(div4, file$3, 36, 4, 1258);
    			attr_dev(input1, "type", "search");
    			attr_dev(input1, "class", "block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500");
    			attr_dev(input1, "placeholder", "Search Groups...");
    			add_location(input1, file$3, 41, 4, 1655);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800");
    			add_location(button1, file$3, 42, 4, 1988);
    			attr_dev(div5, "class", "relative m-5");
    			add_location(div5, file$3, 35, 2, 1226);
    			attr_dev(div6, "class", "w-full max-w-lg ml-20 place-self-center");
    			add_location(div6, file$3, 46, 2, 2291);
    			add_location(th0, file$3, 52, 10, 2478);
    			add_location(th1, file$3, 53, 10, 2513);
    			add_location(th2, file$3, 54, 10, 2540);
    			add_location(tr, file$3, 51, 8, 2462);
    			add_location(thead, file$3, 50, 6, 2445);
    			attr_dev(table, "class", "table table-zebra w-full");
    			add_location(table, file$3, 49, 4, 2397);
    			attr_dev(div7, "class", "overflow-x-auto m-5");
    			add_location(div7, file$3, 48, 2, 2358);
    			attr_dev(div8, "class", "flex flex-col w-full");
    			add_location(div8, file$3, 4, 0, 64);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div0);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			mount_component(link0, li0, null);
    			append_dev(ul, t0);
    			append_dev(ul, li1);
    			mount_component(link1, li1, null);
    			append_dev(ul, t1);
    			append_dev(ul, li2);
    			append_dev(div8, t3);
    			append_dev(div8, form);
    			append_dev(form, div1);
    			append_dev(form, t5);
    			append_dev(form, div3);
    			append_dev(div3, div2);
    			append_dev(div2, label);
    			append_dev(div2, t7);
    			append_dev(div2, input0);
    			append_dev(form, t8);
    			append_dev(form, button0);
    			append_dev(div8, t10);
    			append_dev(div8, hr);
    			append_dev(div8, t11);
    			append_dev(div8, div5);
    			append_dev(div5, div4);
    			append_dev(div4, svg);
    			append_dev(svg, path);
    			append_dev(div5, t12);
    			append_dev(div5, input1);
    			append_dev(div5, t13);
    			append_dev(div5, button1);
    			append_dev(div8, t15);
    			append_dev(div8, div6);
    			append_dev(div8, t16);
    			append_dev(div8, div7);
    			append_dev(div7, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t18);
    			append_dev(tr, th1);
    			append_dev(tr, t20);
    			append_dev(tr, th2);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    			destroy_component(link0);
    			destroy_component(link1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GroupManagementSystem', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GroupManagementSystem> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link: Link$1 });
    	return [];
    }

    class GroupManagementSystem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GroupManagementSystem",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\CreateApp.svelte generated by Svelte v3.49.0 */
    const file$2 = "src\\components\\CreateApp.svelte";

    // (9:8) <Link to="/home" style="color:black">
    function create_default_slot$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Home");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(9:8) <Link to=\\\"/home\\\" style=\\\"color:black\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div26;
    	let div0;
    	let ul;
    	let li0;
    	let link;
    	let t0;
    	let li1;
    	let t2;
    	let form;
    	let div1;
    	let t4;
    	let div3;
    	let div2;
    	let label0;
    	let t6;
    	let input0;
    	let t7;
    	let div5;
    	let div4;
    	let label1;
    	let t9;
    	let textarea;
    	let t10;
    	let div9;
    	let div6;
    	let label2;
    	let t12;
    	let input1;
    	let t13;
    	let div7;
    	let label3;
    	let t15;
    	let input2;
    	let t16;
    	let div8;
    	let label4;
    	let t18;
    	let input3;
    	let t19;
    	let div13;
    	let div12;
    	let label5;
    	let t21;
    	let div11;
    	let select0;
    	let option0;
    	let t22;
    	let div10;
    	let svg0;
    	let path0;
    	let t23;
    	let div17;
    	let div16;
    	let label6;
    	let t25;
    	let div15;
    	let select1;
    	let option1;
    	let t26;
    	let div14;
    	let svg1;
    	let path1;
    	let t27;
    	let div21;
    	let div20;
    	let label7;
    	let t29;
    	let div19;
    	let select2;
    	let option2;
    	let t30;
    	let div18;
    	let svg2;
    	let path2;
    	let t31;
    	let div25;
    	let div24;
    	let label8;
    	let t33;
    	let div23;
    	let select3;
    	let option3;
    	let t34;
    	let div22;
    	let svg3;
    	let path3;
    	let t35;
    	let button;
    	let current;

    	link = new Link$1({
    			props: {
    				to: "/home",
    				style: "color:black",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div26 = element("div");
    			div0 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			create_component(link.$$.fragment);
    			t0 = space();
    			li1 = element("li");
    			li1.textContent = "Create New Application";
    			t2 = space();
    			form = element("form");
    			div1 = element("div");
    			div1.textContent = "Create New Application";
    			t4 = space();
    			div3 = element("div");
    			div2 = element("div");
    			label0 = element("label");
    			label0.textContent = "App_Acronym";
    			t6 = space();
    			input0 = element("input");
    			t7 = space();
    			div5 = element("div");
    			div4 = element("div");
    			label1 = element("label");
    			label1.textContent = "App_Description";
    			t9 = space();
    			textarea = element("textarea");
    			t10 = space();
    			div9 = element("div");
    			div6 = element("div");
    			label2 = element("label");
    			label2.textContent = "App_Rnumber";
    			t12 = space();
    			input1 = element("input");
    			t13 = space();
    			div7 = element("div");
    			label3 = element("label");
    			label3.textContent = "App_startDate";
    			t15 = space();
    			input2 = element("input");
    			t16 = space();
    			div8 = element("div");
    			label4 = element("label");
    			label4.textContent = "App_endDate";
    			t18 = space();
    			input3 = element("input");
    			t19 = space();
    			div13 = element("div");
    			div12 = element("div");
    			label5 = element("label");
    			label5.textContent = "App_permit_Create";
    			t21 = space();
    			div11 = element("div");
    			select0 = element("select");
    			option0 = element("option");
    			t22 = space();
    			div10 = element("div");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t23 = space();
    			div17 = element("div");
    			div16 = element("div");
    			label6 = element("label");
    			label6.textContent = "App_permit_Open";
    			t25 = space();
    			div15 = element("div");
    			select1 = element("select");
    			option1 = element("option");
    			t26 = space();
    			div14 = element("div");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t27 = space();
    			div21 = element("div");
    			div20 = element("div");
    			label7 = element("label");
    			label7.textContent = "App_permit_toDoList";
    			t29 = space();
    			div19 = element("div");
    			select2 = element("select");
    			option2 = element("option");
    			t30 = space();
    			div18 = element("div");
    			svg2 = svg_element("svg");
    			path2 = svg_element("path");
    			t31 = space();
    			div25 = element("div");
    			div24 = element("div");
    			label8 = element("label");
    			label8.textContent = "App_permit_Doing";
    			t33 = space();
    			div23 = element("div");
    			select3 = element("select");
    			option3 = element("option");
    			t34 = space();
    			div22 = element("div");
    			svg3 = svg_element("svg");
    			path3 = svg_element("path");
    			t35 = space();
    			button = element("button");
    			button.textContent = "Create Application";
    			add_location(li0, file$2, 7, 6, 157);
    			add_location(li1, file$2, 10, 6, 240);
    			add_location(ul, file$2, 6, 4, 145);
    			attr_dev(div0, "class", "text-sm breadcrumbs m-7");
    			add_location(div0, file$2, 5, 2, 102);
    			attr_dev(div1, "class", "text-2xl font-bold mb-5 ");
    			add_location(div1, file$2, 15, 4, 364);
    			attr_dev(label0, "class", "block tracking-wide text-gray-700 text-xs font-bold mb-2");
    			add_location(label0, file$2, 20, 8, 586);
    			attr_dev(input0, "class", "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "APP");
    			attr_dev(input0, "name", "App_Acronym");
    			input0.required = true;
    			add_location(input0, file$2, 21, 8, 687);
    			attr_dev(div2, "class", "w-full px-3");
    			add_location(div2, file$2, 18, 6, 485);
    			attr_dev(div3, "class", "flex flex-wrap -mx-3 mb-4");
    			add_location(div3, file$2, 17, 4, 438);
    			attr_dev(label1, "class", "block tracking-wide text-gray-700 text-xs font-bold mb-2");
    			add_location(label1, file$2, 27, 8, 1113);
    			attr_dev(textarea, "class", "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500");
    			attr_dev(textarea, "type", "text");
    			attr_dev(textarea, "placeholder", "What is this application about?");
    			attr_dev(textarea, "name", "App_Description");
    			textarea.required = true;
    			add_location(textarea, file$2, 28, 8, 1218);
    			attr_dev(div4, "class", "w-full px-3");
    			add_location(div4, file$2, 25, 6, 1012);
    			attr_dev(div5, "class", "flex flex-wrap -mx-3 mb-4");
    			add_location(div5, file$2, 24, 4, 965);
    			attr_dev(label2, "class", "block tracking-wide text-gray-700 text-xs font-bold mb-2");
    			add_location(label2, file$2, 34, 8, 1701);
    			attr_dev(input1, "class", "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500");
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "placeholder", "001");
    			attr_dev(input1, "min", "0");
    			input1.required = true;
    			add_location(input1, file$2, 35, 8, 1802);
    			attr_dev(div6, "class", "w-full md:w-1/3 px-3 mb-6 md:mb-0");
    			add_location(div6, file$2, 32, 6, 1578);
    			attr_dev(label3, "class", "block tracking-wide text-gray-700 text-xs font-bold mb-2");
    			add_location(label3, file$2, 39, 8, 2179);
    			attr_dev(input2, "class", "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500");
    			attr_dev(input2, "type", "date");
    			input2.required = true;
    			add_location(input2, file$2, 40, 8, 2282);
    			attr_dev(div7, "class", "w-full md:w-1/3 px-3 mb-6 md:mb-0");
    			add_location(div7, file$2, 37, 6, 2056);
    			attr_dev(label4, "class", "block tracking-wide text-gray-700 text-xs font-bold mb-2");
    			add_location(label4, file$2, 44, 8, 2631);
    			attr_dev(input3, "class", "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500");
    			attr_dev(input3, "type", "date");
    			input3.required = true;
    			add_location(input3, file$2, 45, 8, 2732);
    			attr_dev(div8, "class", "w-full md:w-1/3 px-3 mb-6 md:mb-0");
    			add_location(div8, file$2, 42, 6, 2508);
    			attr_dev(div9, "class", "flex flex-wrap -mx-3 mb-4");
    			add_location(div9, file$2, 31, 4, 1531);
    			attr_dev(label5, "class", "block tracking-wide text-gray-700 text-xs font-bold mb-2");
    			add_location(label5, file$2, 51, 8, 3116);
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$2, 54, 12, 3475);
    			attr_dev(select0, "class", "block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500");
    			attr_dev(select0, "name", "usergroup");
    			add_location(select0, file$2, 53, 10, 3257);
    			attr_dev(path0, "d", "M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z");
    			add_location(path0, file$2, 58, 14, 3741);
    			attr_dev(svg0, "class", "fill-current h-4 w-4");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 20 20");
    			add_location(svg0, file$2, 57, 12, 3636);
    			attr_dev(div10, "class", "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700");
    			add_location(div10, file$2, 56, 10, 3525);
    			attr_dev(div11, "class", "relative");
    			add_location(div11, file$2, 52, 8, 3223);
    			attr_dev(div12, "class", "w-full px-3");
    			add_location(div12, file$2, 49, 6, 3015);
    			attr_dev(div13, "class", "flex flex-wrap -mx-3 mb-4");
    			add_location(div13, file$2, 48, 4, 2968);
    			attr_dev(label6, "class", "block tracking-wide text-gray-700 text-xs font-bold mb-2");
    			add_location(label6, file$2, 67, 8, 4062);
    			option1.__value = "";
    			option1.value = option1.__value;
    			add_location(option1, file$2, 70, 12, 4419);
    			attr_dev(select1, "class", "block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500");
    			attr_dev(select1, "name", "usergroup");
    			add_location(select1, file$2, 69, 10, 4201);
    			attr_dev(path1, "d", "M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z");
    			add_location(path1, file$2, 74, 14, 4685);
    			attr_dev(svg1, "class", "fill-current h-4 w-4");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 20 20");
    			add_location(svg1, file$2, 73, 12, 4580);
    			attr_dev(div14, "class", "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700");
    			add_location(div14, file$2, 72, 10, 4469);
    			attr_dev(div15, "class", "relative");
    			add_location(div15, file$2, 68, 8, 4167);
    			attr_dev(div16, "class", "w-full px-3");
    			add_location(div16, file$2, 65, 6, 3961);
    			attr_dev(div17, "class", "flex flex-wrap -mx-3 mb-4");
    			add_location(div17, file$2, 64, 4, 3914);
    			attr_dev(label7, "class", "block tracking-wide text-gray-700 text-xs font-bold mb-2");
    			add_location(label7, file$2, 83, 8, 5006);
    			option2.__value = "";
    			option2.value = option2.__value;
    			add_location(option2, file$2, 86, 12, 5367);
    			attr_dev(select2, "class", "block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500");
    			attr_dev(select2, "name", "usergroup");
    			add_location(select2, file$2, 85, 10, 5149);
    			attr_dev(path2, "d", "M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z");
    			add_location(path2, file$2, 90, 14, 5633);
    			attr_dev(svg2, "class", "fill-current h-4 w-4");
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "viewBox", "0 0 20 20");
    			add_location(svg2, file$2, 89, 12, 5528);
    			attr_dev(div18, "class", "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700");
    			add_location(div18, file$2, 88, 10, 5417);
    			attr_dev(div19, "class", "relative");
    			add_location(div19, file$2, 84, 8, 5115);
    			attr_dev(div20, "class", "w-full px-3");
    			add_location(div20, file$2, 81, 6, 4905);
    			attr_dev(div21, "class", "flex flex-wrap -mx-3 mb-4");
    			add_location(div21, file$2, 80, 4, 4858);
    			attr_dev(label8, "class", "block tracking-wide text-gray-700 text-xs font-bold mb-2");
    			add_location(label8, file$2, 99, 8, 5954);
    			option3.__value = "";
    			option3.value = option3.__value;
    			add_location(option3, file$2, 102, 12, 6312);
    			attr_dev(select3, "class", "block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500");
    			attr_dev(select3, "name", "usergroup");
    			add_location(select3, file$2, 101, 10, 6094);
    			attr_dev(path3, "d", "M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z");
    			add_location(path3, file$2, 106, 14, 6578);
    			attr_dev(svg3, "class", "fill-current h-4 w-4");
    			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg3, "viewBox", "0 0 20 20");
    			add_location(svg3, file$2, 105, 12, 6473);
    			attr_dev(div22, "class", "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700");
    			add_location(div22, file$2, 104, 10, 6362);
    			attr_dev(div23, "class", "relative");
    			add_location(div23, file$2, 100, 8, 6060);
    			attr_dev(div24, "class", "w-full px-3");
    			add_location(div24, file$2, 97, 6, 5853);
    			attr_dev(div25, "class", "flex flex-wrap -mx-3 mb-4");
    			add_location(div25, file$2, 96, 4, 5806);
    			attr_dev(button, "class", "btn btn-primary place-items-center mb-10");
    			attr_dev(button, "type", "button");
    			add_location(button, file$2, 112, 4, 6751);
    			attr_dev(form, "class", "w-full max-w-lg place-self-center text-center");
    			add_location(form, file$2, 14, 2, 298);
    			attr_dev(div26, "class", "flex flex-col w-full");
    			add_location(div26, file$2, 4, 0, 64);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div26, anchor);
    			append_dev(div26, div0);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			mount_component(link, li0, null);
    			append_dev(ul, t0);
    			append_dev(ul, li1);
    			append_dev(div26, t2);
    			append_dev(div26, form);
    			append_dev(form, div1);
    			append_dev(form, t4);
    			append_dev(form, div3);
    			append_dev(div3, div2);
    			append_dev(div2, label0);
    			append_dev(div2, t6);
    			append_dev(div2, input0);
    			append_dev(form, t7);
    			append_dev(form, div5);
    			append_dev(div5, div4);
    			append_dev(div4, label1);
    			append_dev(div4, t9);
    			append_dev(div4, textarea);
    			append_dev(form, t10);
    			append_dev(form, div9);
    			append_dev(div9, div6);
    			append_dev(div6, label2);
    			append_dev(div6, t12);
    			append_dev(div6, input1);
    			append_dev(div9, t13);
    			append_dev(div9, div7);
    			append_dev(div7, label3);
    			append_dev(div7, t15);
    			append_dev(div7, input2);
    			append_dev(div9, t16);
    			append_dev(div9, div8);
    			append_dev(div8, label4);
    			append_dev(div8, t18);
    			append_dev(div8, input3);
    			append_dev(form, t19);
    			append_dev(form, div13);
    			append_dev(div13, div12);
    			append_dev(div12, label5);
    			append_dev(div12, t21);
    			append_dev(div12, div11);
    			append_dev(div11, select0);
    			append_dev(select0, option0);
    			append_dev(div11, t22);
    			append_dev(div11, div10);
    			append_dev(div10, svg0);
    			append_dev(svg0, path0);
    			append_dev(form, t23);
    			append_dev(form, div17);
    			append_dev(div17, div16);
    			append_dev(div16, label6);
    			append_dev(div16, t25);
    			append_dev(div16, div15);
    			append_dev(div15, select1);
    			append_dev(select1, option1);
    			append_dev(div15, t26);
    			append_dev(div15, div14);
    			append_dev(div14, svg1);
    			append_dev(svg1, path1);
    			append_dev(form, t27);
    			append_dev(form, div21);
    			append_dev(div21, div20);
    			append_dev(div20, label7);
    			append_dev(div20, t29);
    			append_dev(div20, div19);
    			append_dev(div19, select2);
    			append_dev(select2, option2);
    			append_dev(div19, t30);
    			append_dev(div19, div18);
    			append_dev(div18, svg2);
    			append_dev(svg2, path2);
    			append_dev(form, t31);
    			append_dev(form, div25);
    			append_dev(div25, div24);
    			append_dev(div24, label8);
    			append_dev(div24, t33);
    			append_dev(div24, div23);
    			append_dev(div23, select3);
    			append_dev(select3, option3);
    			append_dev(div23, t34);
    			append_dev(div23, div22);
    			append_dev(div22, svg3);
    			append_dev(svg3, path3);
    			append_dev(form, t35);
    			append_dev(form, button);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div26);
    			destroy_component(link);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CreateApp', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CreateApp> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link: Link$1 });
    	return [];
    }

    class CreateApp extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CreateApp",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\components\AppDetails.svelte generated by Svelte v3.49.0 */
    const file$1 = "src\\components\\AppDetails.svelte";

    // (9:8) <Link to="/home" style="color:black">
    function create_default_slot_2$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Home");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(9:8) <Link to=\\\"/home\\\" style=\\\"color:black\\\">",
    		ctx
    	});

    	return block;
    }

    // (73:10) <Link to="updateapp/">
    function create_default_slot_1$1(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Edit Application";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-primary ");
    			add_location(button, file$1, 73, 12, 3090);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(73:10) <Link to=\\\"updateapp/\\\">",
    		ctx
    	});

    	return block;
    }

    // (81:8) <Link to="taskmanagementsystem/">
    function create_default_slot$1(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Plans & Tasks";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-primary ");
    			add_location(button, file$1, 81, 10, 3297);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(81:8) <Link to=\\\"taskmanagementsystem/\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div20;
    	let div0;
    	let ul;
    	let li0;
    	let link0;
    	let t0;
    	let li1;
    	let t2;
    	let div1;
    	let strong;
    	let t3;
    	let div19;
    	let div15;
    	let div14;
    	let div13;
    	let div3;
    	let div2;
    	let label0;
    	let t5;
    	let p0;
    	let t6;
    	let div6;
    	let div4;
    	let label1;
    	let t8;
    	let p1;
    	let t9;
    	let div5;
    	let label2;
    	let t11;
    	let p2;
    	let t12;
    	let div12;
    	let div7;
    	let label3;
    	let t14;
    	let p3;
    	let t15;
    	let div8;
    	let label4;
    	let t17;
    	let p4;
    	let t18;
    	let div9;
    	let label5;
    	let t20;
    	let p5;
    	let t21;
    	let div10;
    	let label6;
    	let t23;
    	let p6;
    	let t24;
    	let div11;
    	let label7;
    	let t26;
    	let p7;
    	let t27;
    	let div18;
    	let div16;
    	let link1;
    	let t28;
    	let div17;
    	let link2;
    	let current;

    	link0 = new Link$1({
    			props: {
    				to: "/home",
    				style: "color:black",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "updateapp/",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link$1({
    			props: {
    				to: "taskmanagementsystem/",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div20 = element("div");
    			div0 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			create_component(link0.$$.fragment);
    			t0 = space();
    			li1 = element("li");
    			li1.textContent = "Application 's Details";
    			t2 = space();
    			div1 = element("div");
    			strong = element("strong");
    			t3 = space();
    			div19 = element("div");
    			div15 = element("div");
    			div14 = element("div");
    			div13 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			label0 = element("label");
    			label0.textContent = "Description";
    			t5 = space();
    			p0 = element("p");
    			t6 = space();
    			div6 = element("div");
    			div4 = element("div");
    			label1 = element("label");
    			label1.textContent = "App_startDate";
    			t8 = space();
    			p1 = element("p");
    			t9 = space();
    			div5 = element("div");
    			label2 = element("label");
    			label2.textContent = "App_endDate";
    			t11 = space();
    			p2 = element("p");
    			t12 = space();
    			div12 = element("div");
    			div7 = element("div");
    			label3 = element("label");
    			label3.textContent = "App_permit_Create";
    			t14 = space();
    			p3 = element("p");
    			t15 = space();
    			div8 = element("div");
    			label4 = element("label");
    			label4.textContent = "App_permit_Open";
    			t17 = space();
    			p4 = element("p");
    			t18 = space();
    			div9 = element("div");
    			label5 = element("label");
    			label5.textContent = "App_permit_toDoList";
    			t20 = space();
    			p5 = element("p");
    			t21 = space();
    			div10 = element("div");
    			label6 = element("label");
    			label6.textContent = "App_permit_Doing";
    			t23 = space();
    			p6 = element("p");
    			t24 = space();
    			div11 = element("div");
    			label7 = element("label");
    			label7.textContent = "App_permit_Done";
    			t26 = space();
    			p7 = element("p");
    			t27 = space();
    			div18 = element("div");
    			div16 = element("div");
    			create_component(link1.$$.fragment);
    			t28 = space();
    			div17 = element("div");
    			create_component(link2.$$.fragment);
    			add_location(li0, file$1, 7, 6, 157);
    			add_location(li1, file$1, 10, 6, 240);
    			add_location(ul, file$1, 6, 4, 145);
    			attr_dev(div0, "class", "text-sm breadcrumbs m-7");
    			add_location(div0, file$1, 5, 2, 102);
    			add_location(strong, file$1, 14, 4, 353);
    			attr_dev(div1, "class", "text-2xl font-bold place-self-center ");
    			add_location(div1, file$1, 13, 2, 296);
    			attr_dev(label0, "class", "block text-black text-sm font-bold mb-2");
    			add_location(label0, file$1, 23, 14, 752);
    			add_location(p0, file$1, 24, 14, 842);
    			attr_dev(div2, "class", "w-full px-3");
    			add_location(div2, file$1, 21, 12, 639);
    			attr_dev(div3, "class", "flex flex-wrap -mx-3 mb-4");
    			add_location(div3, file$1, 20, 10, 586);
    			attr_dev(label1, "class", "block text-black text-sm font-bold mb-2");
    			add_location(label1, file$1, 30, 14, 1087);
    			add_location(p1, file$1, 31, 14, 1179);
    			attr_dev(div4, "class", "w-full md:w-1/2 px-3 mb-6 md:mb-0");
    			add_location(div4, file$1, 28, 12, 952);
    			attr_dev(label2, "class", "block text-black text-sm font-bold mb-2");
    			add_location(label2, file$1, 35, 14, 1355);
    			add_location(p2, file$1, 36, 14, 1445);
    			attr_dev(div5, "class", "w-full md:w-1/2 px-3 mb-6 md:mb-0");
    			add_location(div5, file$1, 33, 12, 1220);
    			attr_dev(div6, "class", "flex flex-wrap -mx-3 mb-4");
    			add_location(div6, file$1, 27, 10, 899);
    			attr_dev(label3, "class", "block text-black text-sm font-bold mb-2");
    			add_location(label3, file$1, 42, 14, 1691);
    			add_location(p3, file$1, 43, 14, 1787);
    			attr_dev(div7, "class", "w-full md:w-1/5 px-3 mb-6 md:mb-0");
    			add_location(div7, file$1, 40, 12, 1556);
    			attr_dev(label4, "class", "block text-black text-sm font-bold mb-2");
    			add_location(label4, file$1, 47, 14, 1963);
    			add_location(p4, file$1, 48, 14, 2057);
    			attr_dev(div8, "class", "w-full md:w-1/5 px-3 mb-6 md:mb-0");
    			add_location(div8, file$1, 45, 12, 1828);
    			attr_dev(label5, "class", "block text-black text-sm font-bold mb-2");
    			add_location(label5, file$1, 52, 14, 2233);
    			add_location(p5, file$1, 53, 14, 2331);
    			attr_dev(div9, "class", "w-full md:w-1/5 px-3 mb-6 md:mb-0");
    			add_location(div9, file$1, 50, 12, 2098);
    			attr_dev(label6, "class", "block text-black text-sm font-bold mb-2");
    			add_location(label6, file$1, 57, 14, 2507);
    			add_location(p6, file$1, 58, 14, 2602);
    			attr_dev(div10, "class", "w-full md:w-1/5 px-3 mb-6 md:mb-0");
    			add_location(div10, file$1, 55, 12, 2372);
    			attr_dev(label7, "class", "block text-black text-sm font-bold mb-2");
    			add_location(label7, file$1, 62, 14, 2778);
    			add_location(p7, file$1, 63, 14, 2872);
    			attr_dev(div11, "class", "w-full md:w-1/5 px-3 mb-6 md:mb-0");
    			add_location(div11, file$1, 60, 12, 2643);
    			attr_dev(div12, "class", "flex flex-wrap -mx-40 mb-4");
    			add_location(div12, file$1, 39, 10, 1502);
    			attr_dev(div13, "class", "w-full max-w-lg place-self-center");
    			add_location(div13, file$1, 19, 8, 527);
    			attr_dev(div14, "class", "grid flex-grow card bg-base-300 rounded-box m-10 pt-4 ");
    			add_location(div14, file$1, 18, 6, 449);
    			attr_dev(div15, "class", "flex flex-col w-full lg:flex-row");
    			add_location(div15, file$1, 17, 4, 395);
    			add_location(div16, file$1, 71, 8, 3037);
    			add_location(div17, file$1, 79, 6, 3237);
    			attr_dev(div18, "class", "grid grid-cols-2 content-center pb-10 ...");
    			add_location(div18, file$1, 69, 4, 2965);
    			add_location(div19, file$1, 16, 2, 384);
    			attr_dev(div20, "class", "flex flex-col w-full");
    			add_location(div20, file$1, 4, 0, 64);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div20, anchor);
    			append_dev(div20, div0);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			mount_component(link0, li0, null);
    			append_dev(ul, t0);
    			append_dev(ul, li1);
    			append_dev(div20, t2);
    			append_dev(div20, div1);
    			append_dev(div1, strong);
    			append_dev(div20, t3);
    			append_dev(div20, div19);
    			append_dev(div19, div15);
    			append_dev(div15, div14);
    			append_dev(div14, div13);
    			append_dev(div13, div3);
    			append_dev(div3, div2);
    			append_dev(div2, label0);
    			append_dev(div2, t5);
    			append_dev(div2, p0);
    			append_dev(div13, t6);
    			append_dev(div13, div6);
    			append_dev(div6, div4);
    			append_dev(div4, label1);
    			append_dev(div4, t8);
    			append_dev(div4, p1);
    			append_dev(div6, t9);
    			append_dev(div6, div5);
    			append_dev(div5, label2);
    			append_dev(div5, t11);
    			append_dev(div5, p2);
    			append_dev(div13, t12);
    			append_dev(div13, div12);
    			append_dev(div12, div7);
    			append_dev(div7, label3);
    			append_dev(div7, t14);
    			append_dev(div7, p3);
    			append_dev(div12, t15);
    			append_dev(div12, div8);
    			append_dev(div8, label4);
    			append_dev(div8, t17);
    			append_dev(div8, p4);
    			append_dev(div12, t18);
    			append_dev(div12, div9);
    			append_dev(div9, label5);
    			append_dev(div9, t20);
    			append_dev(div9, p5);
    			append_dev(div12, t21);
    			append_dev(div12, div10);
    			append_dev(div10, label6);
    			append_dev(div10, t23);
    			append_dev(div10, p6);
    			append_dev(div12, t24);
    			append_dev(div12, div11);
    			append_dev(div11, label7);
    			append_dev(div11, t26);
    			append_dev(div11, p7);
    			append_dev(div19, t27);
    			append_dev(div19, div18);
    			append_dev(div18, div16);
    			mount_component(link1, div16, null);
    			append_dev(div18, t28);
    			append_dev(div18, div17);
    			mount_component(link2, div17, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div20);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AppDetails', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AppDetails> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link: Link$1 });
    	return [];
    }

    class AppDetails extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AppDetails",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.49.0 */
    const file = "src\\App.svelte";

    // (26:4) <Link to="/home" class="btn btn-ghost normal-case text-xl" style="color:black; text-decoration:none">
    function create_default_slot_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("TMS");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(26:4) <Link to=\\\"/home\\\" class=\\\"btn btn-ghost normal-case text-xl\\\" style=\\\"color:black; text-decoration:none\\\">",
    		ctx
    	});

    	return block;
    }

    // (29:5) <Link to="/usermanagementsystem" class="btn btn-ghost ml-5 normal-case text-lg" style="color:black; text-decoration:none">
    function create_default_slot_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("User Management System");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(29:5) <Link to=\\\"/usermanagementsystem\\\" class=\\\"btn btn-ghost ml-5 normal-case text-lg\\\" style=\\\"color:black; text-decoration:none\\\">",
    		ctx
    	});

    	return block;
    }

    // (32:5) <Link to="/createapp" class="btn btn-ghost normal-case text-lg" style="color:black; text-decoration:none">
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Create Applications");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(32:5) <Link to=\\\"/createapp\\\" class=\\\"btn btn-ghost normal-case text-lg\\\" style=\\\"color:black; text-decoration:none\\\">",
    		ctx
    	});

    	return block;
    }

    // (44:7) <Link to="/profile" class="justify-between" style="color:black; text-decoration:none">
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Profile");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(44:7) <Link to=\\\"/profile\\\" class=\\\"justify-between\\\" style=\\\"color:black; text-decoration:none\\\">",
    		ctx
    	});

    	return block;
    }

    // (49:7) <Link to="/" style="color:black; text-decoration:none">
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Logout");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(49:7) <Link to=\\\"/\\\" style=\\\"color:black; text-decoration:none\\\">",
    		ctx
    	});

    	return block;
    }

    // (23:1) <Router>
    function create_default_slot(ctx) {
    	let div3;
    	let div0;
    	let link0;
    	let t0;
    	let link1;
    	let t1;
    	let link2;
    	let t2;
    	let div2;
    	let div1;
    	let label1;
    	let label0;
    	let t4;
    	let ul;
    	let li0;
    	let link3;
    	let t5;
    	let li1;
    	let link4;
    	let t6;
    	let route0;
    	let t7;
    	let route1;
    	let t8;
    	let route2;
    	let t9;
    	let route3;
    	let t10;
    	let route4;
    	let t11;
    	let route5;
    	let t12;
    	let route6;
    	let t13;
    	let route7;
    	let t14;
    	let route8;
    	let t15;
    	let route9;
    	let t16;
    	let route10;
    	let current;

    	link0 = new Link$1({
    			props: {
    				to: "/home",
    				class: "btn btn-ghost normal-case text-xl",
    				style: "color:black; text-decoration:none",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "/usermanagementsystem",
    				class: "btn btn-ghost ml-5 normal-case text-lg",
    				style: "color:black; text-decoration:none",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link$1({
    			props: {
    				to: "/createapp",
    				class: "btn btn-ghost normal-case text-lg",
    				style: "color:black; text-decoration:none",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link3 = new Link$1({
    			props: {
    				to: "/profile",
    				class: "justify-between",
    				style: "color:black; text-decoration:none",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link4 = new Link$1({
    			props: {
    				to: "/",
    				style: "color:black; text-decoration:none",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route0 = new Route$1({
    			props: { path: "/", component: Login },
    			$$inline: true
    		});

    	route1 = new Route$1({
    			props: { path: "home", component: Home },
    			$$inline: true
    		});

    	route2 = new Route$1({
    			props: { path: "profile", component: Profile },
    			$$inline: true
    		});

    	route3 = new Route$1({
    			props: {
    				path: "/updatepassword",
    				component: UpdatePassword
    			},
    			$$inline: true
    		});

    	route4 = new Route$1({
    			props: {
    				path: "/updateemail",
    				component: UpdateEmail
    			},
    			$$inline: true
    		});

    	route5 = new Route$1({
    			props: {
    				path: "/usermanagementsystem",
    				component: UserManagementSystem
    			},
    			$$inline: true
    		});

    	route6 = new Route$1({
    			props: {
    				path: "/createuser",
    				component: CreateUser
    			},
    			$$inline: true
    		});

    	route7 = new Route$1({
    			props: {
    				path: "/usermanagementsystem/updateuser/:username",
    				component: UpdateUser
    			},
    			$$inline: true
    		});

    	route8 = new Route$1({
    			props: {
    				path: "/creategroup",
    				component: GroupManagementSystem
    			},
    			$$inline: true
    		});

    	route9 = new Route$1({
    			props: { path: "/createapp", component: CreateApp },
    			$$inline: true
    		});

    	route10 = new Route$1({
    			props: {
    				path: "/home/:App_Acronym",
    				component: AppDetails
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			create_component(link0.$$.fragment);
    			t0 = space();
    			create_component(link1.$$.fragment);
    			t1 = space();
    			create_component(link2.$$.fragment);
    			t2 = space();
    			div2 = element("div");
    			div1 = element("div");
    			label1 = element("label");
    			label0 = element("label");
    			label0.textContent = "Hey";
    			t4 = space();
    			ul = element("ul");
    			li0 = element("li");
    			create_component(link3.$$.fragment);
    			t5 = space();
    			li1 = element("li");
    			create_component(link4.$$.fragment);
    			t6 = space();
    			create_component(route0.$$.fragment);
    			t7 = space();
    			create_component(route1.$$.fragment);
    			t8 = space();
    			create_component(route2.$$.fragment);
    			t9 = space();
    			create_component(route3.$$.fragment);
    			t10 = space();
    			create_component(route4.$$.fragment);
    			t11 = space();
    			create_component(route5.$$.fragment);
    			t12 = space();
    			create_component(route6.$$.fragment);
    			t13 = space();
    			create_component(route7.$$.fragment);
    			t14 = space();
    			create_component(route8.$$.fragment);
    			t15 = space();
    			create_component(route9.$$.fragment);
    			t16 = space();
    			create_component(route10.$$.fragment);
    			attr_dev(div0, "class", "flex-1");
    			add_location(div0, file, 24, 3, 865);
    			attr_dev(label0, "class", "lowercase");
    			add_location(label0, file, 39, 6, 1548);
    			attr_dev(label1, "tabindex", "0");
    			attr_dev(label1, "class", "btn btn-ghost");
    			add_location(label1, file, 38, 5, 1498);
    			add_location(li0, file, 42, 6, 1719);
    			add_location(li1, file, 47, 6, 1872);
    			attr_dev(ul, "tabindex", "0");
    			attr_dev(ul, "class", "mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52");
    			add_location(ul, file, 41, 5, 1606);
    			attr_dev(div1, "class", "dropdown dropdown-end");
    			add_location(div1, file, 36, 4, 1393);
    			attr_dev(div2, "class", "flex-none gap-2");
    			add_location(div2, file, 35, 3, 1358);
    			attr_dev(div3, "class", "navbar bg-base-300 mb-4");
    			add_location(div3, file, 23, 2, 823);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			mount_component(link0, div0, null);
    			append_dev(div0, t0);
    			mount_component(link1, div0, null);
    			append_dev(div0, t1);
    			mount_component(link2, div0, null);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, label1);
    			append_dev(label1, label0);
    			append_dev(div1, t4);
    			append_dev(div1, ul);
    			append_dev(ul, li0);
    			mount_component(link3, li0, null);
    			append_dev(ul, t5);
    			append_dev(ul, li1);
    			mount_component(link4, li1, null);
    			insert_dev(target, t6, anchor);
    			mount_component(route0, target, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(route1, target, anchor);
    			insert_dev(target, t8, anchor);
    			mount_component(route2, target, anchor);
    			insert_dev(target, t9, anchor);
    			mount_component(route3, target, anchor);
    			insert_dev(target, t10, anchor);
    			mount_component(route4, target, anchor);
    			insert_dev(target, t11, anchor);
    			mount_component(route5, target, anchor);
    			insert_dev(target, t12, anchor);
    			mount_component(route6, target, anchor);
    			insert_dev(target, t13, anchor);
    			mount_component(route7, target, anchor);
    			insert_dev(target, t14, anchor);
    			mount_component(route8, target, anchor);
    			insert_dev(target, t15, anchor);
    			mount_component(route9, target, anchor);
    			insert_dev(target, t16, anchor);
    			mount_component(route10, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    			const link3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link3_changes.$$scope = { dirty, ctx };
    			}

    			link3.$set(link3_changes);
    			const link4_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link4_changes.$$scope = { dirty, ctx };
    			}

    			link4.$set(link4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			transition_in(link3.$$.fragment, local);
    			transition_in(link4.$$.fragment, local);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			transition_in(route4.$$.fragment, local);
    			transition_in(route5.$$.fragment, local);
    			transition_in(route6.$$.fragment, local);
    			transition_in(route7.$$.fragment, local);
    			transition_in(route8.$$.fragment, local);
    			transition_in(route9.$$.fragment, local);
    			transition_in(route10.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			transition_out(link3.$$.fragment, local);
    			transition_out(link4.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			transition_out(route4.$$.fragment, local);
    			transition_out(route5.$$.fragment, local);
    			transition_out(route6.$$.fragment, local);
    			transition_out(route7.$$.fragment, local);
    			transition_out(route8.$$.fragment, local);
    			transition_out(route9.$$.fragment, local);
    			transition_out(route10.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    			destroy_component(link3);
    			destroy_component(link4);
    			if (detaching) detach_dev(t6);
    			destroy_component(route0, detaching);
    			if (detaching) detach_dev(t7);
    			destroy_component(route1, detaching);
    			if (detaching) detach_dev(t8);
    			destroy_component(route2, detaching);
    			if (detaching) detach_dev(t9);
    			destroy_component(route3, detaching);
    			if (detaching) detach_dev(t10);
    			destroy_component(route4, detaching);
    			if (detaching) detach_dev(t11);
    			destroy_component(route5, detaching);
    			if (detaching) detach_dev(t12);
    			destroy_component(route6, detaching);
    			if (detaching) detach_dev(t13);
    			destroy_component(route7, detaching);
    			if (detaching) detach_dev(t14);
    			destroy_component(route8, detaching);
    			if (detaching) detach_dev(t15);
    			destroy_component(route9, detaching);
    			if (detaching) detach_dev(t16);
    			destroy_component(route10, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(23:1) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div;
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(router.$$.fragment);
    			attr_dev(div, "class", "App");
    			add_location(div, file, 21, 0, 791);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(router, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router: Router$1,
    		Route: Route$1,
    		Link: Link$1,
    		Login,
    		Home,
    		Profile,
    		UpdatePassword,
    		UpdateEmail,
    		UserManagementSystem,
    		CreateUser,
    		UpdateUser,
    		GroupManagementSystem,
    		CreateApp,
    		AppDetails
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
