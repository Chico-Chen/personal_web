
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
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
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
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
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
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
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
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
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
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
        flushing = false;
        seen_callbacks.clear();
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
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
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
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
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
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
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
            mount_component(component, options.target, options.anchor);
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.32.2' }, detail)));
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
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
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

    /* src\Typewriter.svelte generated by Svelte v3.32.2 */
    const file = "src\\Typewriter.svelte";

    function create_fragment(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "font svelte-1rzgfgt");

    			set_style(div, "--cursor-color", typeof /*cursor*/ ctx[0] === "string"
    			? /*cursor*/ ctx[0]
    			: "black");

    			toggle_class(div, "cursor", /*cursor*/ ctx[0]);
    			add_location(div, file, 81, 0, 2026);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[6](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 16) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*cursor*/ 1) {
    				set_style(div, "--cursor-color", typeof /*cursor*/ ctx[0] === "string"
    				? /*cursor*/ ctx[0]
    				: "black");
    			}

    			if (dirty & /*cursor*/ 1) {
    				toggle_class(div, "cursor", /*cursor*/ ctx[0]);
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
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[6](null);
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
    	validate_slots("Typewriter", slots, ['default']);
    	let { interval = 30 } = $$props;
    	let { loop = false } = $$props;
    	let { cursor = true } = $$props;
    	const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    	const rng = (min, max) => Math.floor(Math.random() * (max - min) + min);

    	const typingInterval = async () => Array.isArray(interval)
    	? await sleep(interval[rng(0, interval.length)])
    	: await sleep(interval);

    	const typewriterEffect = async el => {
    		const elText = el.textContent.split("");
    		el.textContent = "";
    		el.classList.add("typing");

    		for (const letter of elText) {
    			el.textContent += letter;
    			const fullyWritten = el.textContent === elText.join("");

    			if (fullyWritten) {
    				typeof loop === "number"
    				? await sleep(loop)
    				: await sleep(1500);

    				while (el.textContent !== "") {
    					el.textContent = el.textContent.slice(0, -1);
    					await typingInterval();
    				}

    				return;
    			}

    			await typingInterval();
    		}

    		if (el.nextSibling !== null) el.classList.remove("typing");
    	};

    	let node;

    	onMount(async () => {
    		const elements = [...node.children].map(el => el.textContent.split(""));
    		const loopParagraphTag = node.firstChild.tagName.toLowerCase();
    		const loopParagraph = document.createElement(loopParagraphTag);
    		node.childNodes.forEach(el => el.remove());
    		node.appendChild(loopParagraph);

    		const loop = async () => {
    			for (const text of elements) {
    				loopParagraph.textContent = text.join("");
    				await typewriterEffect(loopParagraph);
    			}

    			loop();
    		};

    		loop();
    	});

    	const writable_props = ["interval", "loop", "cursor"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Typewriter> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			node = $$value;
    			$$invalidate(1, node);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("interval" in $$props) $$invalidate(2, interval = $$props.interval);
    		if ("loop" in $$props) $$invalidate(3, loop = $$props.loop);
    		if ("cursor" in $$props) $$invalidate(0, cursor = $$props.cursor);
    		if ("$$scope" in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		interval,
    		loop,
    		cursor,
    		sleep,
    		rng,
    		typingInterval,
    		typewriterEffect,
    		node
    	});

    	$$self.$inject_state = $$props => {
    		if ("interval" in $$props) $$invalidate(2, interval = $$props.interval);
    		if ("loop" in $$props) $$invalidate(3, loop = $$props.loop);
    		if ("cursor" in $$props) $$invalidate(0, cursor = $$props.cursor);
    		if ("node" in $$props) $$invalidate(1, node = $$props.node);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [cursor, node, interval, loop, $$scope, slots, div_binding];
    }

    class Typewriter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { interval: 2, loop: 3, cursor: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Typewriter",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get interval() {
    		throw new Error("<Typewriter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set interval(value) {
    		throw new Error("<Typewriter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loop() {
    		throw new Error("<Typewriter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loop(value) {
    		throw new Error("<Typewriter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cursor() {
    		throw new Error("<Typewriter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cursor(value) {
    		throw new Error("<Typewriter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Home.svelte generated by Svelte v3.32.2 */
    const file$1 = "src\\Home.svelte";

    // (9:12) <Typewriter loop={true} interval={100}>
    function create_default_slot(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "A Software Developer";
    			attr_dev(h2, "class", "h2 svelte-1jcp245");
    			add_location(h2, file$1, 9, 16, 292);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(9:12) <Typewriter loop={true} interval={100}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let section;
    	let div1;
    	let div0;
    	let h1;
    	let t1;
    	let typewriter;
    	let t2;
    	let a;
    	let current;

    	typewriter = new Typewriter({
    			props: {
    				loop: true,
    				interval: 100,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			div1 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Hello, I'm Chico Chen";
    			t1 = space();
    			create_component(typewriter.$$.fragment);
    			t2 = space();
    			a = element("a");
    			a.textContent = "Download Resume";
    			attr_dev(h1, "class", "svelte-1jcp245");
    			add_location(h1, file$1, 7, 12, 191);
    			attr_dev(a, "class", "download-button svelte-1jcp245");
    			attr_dev(a, "href", "https://drive.google.com/file/d/1exkhP-DC8RD-9zYpTku2G82J-RefM3xB/view?usp=sharing");
    			add_location(a, file$1, 11, 12, 373);
    			attr_dev(div0, "class", "content svelte-1jcp245");
    			add_location(div0, file$1, 6, 8, 156);
    			attr_dev(div1, "class", "container svelte-1jcp245");
    			add_location(div1, file$1, 5, 4, 123);
    			attr_dev(section, "class", "home_background svelte-1jcp245");
    			attr_dev(section, "id", "home");
    			add_location(section, file$1, 4, 0, 74);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			mount_component(typewriter, div0, null);
    			append_dev(div0, t2);
    			append_dev(div0, a);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const typewriter_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				typewriter_changes.$$scope = { dirty, ctx };
    			}

    			typewriter.$set(typewriter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(typewriter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(typewriter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(typewriter);
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
    	validate_slots("Home", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Typewriter });
    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }

    var _ = {
      $(selector) {
        if (typeof selector === "string") {
          return document.querySelector(selector);
        }
        return selector;
      },
      extend(...args) {
        return Object.assign(...args);
      },
      cumulativeOffset(element) {
        let top = 0;
        let left = 0;

        do {
          top += element.offsetTop || 0;
          left += element.offsetLeft || 0;
          element = element.offsetParent;
        } while (element);

        return {
          top: top,
          left: left
        };
      },
      directScroll(element) {
        return element && element !== document && element !== document.body;
      },
      scrollTop(element, value) {
        let inSetter = value !== undefined;
        if (this.directScroll(element)) {
          return inSetter ? (element.scrollTop = value) : element.scrollTop;
        } else {
          return inSetter
            ? (document.documentElement.scrollTop = document.body.scrollTop = value)
            : window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0;
        }
      },
      scrollLeft(element, value) {
        let inSetter = value !== undefined;
        if (this.directScroll(element)) {
          return inSetter ? (element.scrollLeft = value) : element.scrollLeft;
        } else {
          return inSetter
            ? (document.documentElement.scrollLeft = document.body.scrollLeft = value)
            : window.pageXOffset ||
                document.documentElement.scrollLeft ||
                document.body.scrollLeft ||
                0;
        }
      }
    };

    const defaultOptions = {
      container: "body",
      duration: 500,
      delay: 0,
      offset: 0,
      easing: cubicInOut,
      onStart: noop,
      onDone: noop,
      onAborting: noop,
      scrollX: false,
      scrollY: true
    };

    const _scrollTo = options => {
      let {
        offset,
        duration,
        delay,
        easing,
        x=0,
        y=0,
        scrollX,
        scrollY,
        onStart,
        onDone,
        container,
        onAborting,
        element
      } = options;

      if (typeof offset === "function") {
        offset = offset();
      }

      var cumulativeOffsetContainer = _.cumulativeOffset(container);
      var cumulativeOffsetTarget = element
        ? _.cumulativeOffset(element)
        : { top: y, left: x };

      var initialX = _.scrollLeft(container);
      var initialY = _.scrollTop(container);

      var targetX =
        cumulativeOffsetTarget.left - cumulativeOffsetContainer.left + offset;
      var targetY =
        cumulativeOffsetTarget.top - cumulativeOffsetContainer.top + offset;

      var diffX = targetX - initialX;
    	var diffY = targetY - initialY;

      let scrolling = true;
      let started = false;
      let start_time = now() + delay;
      let end_time = start_time + duration;

      function scrollToTopLeft(element, top, left) {
        if (scrollX) _.scrollLeft(element, left);
        if (scrollY) _.scrollTop(element, top);
      }

      function start(delayStart) {
        if (!delayStart) {
          started = true;
          onStart(element, {x, y});
        }
      }

      function tick(progress) {
        scrollToTopLeft(
          container,
          initialY + diffY * progress,
          initialX + diffX * progress
        );
      }

      function stop() {
        scrolling = false;
      }

      loop(now => {
        if (!started && now >= start_time) {
          start(false);
        }

        if (started && now >= end_time) {
          tick(1);
          stop();
          onDone(element, {x, y});
        }

        if (!scrolling) {
          onAborting(element, {x, y});
          return false;
        }
        if (started) {
          const p = now - start_time;
          const t = 0 + 1 * easing(p / duration);
          tick(t);
        }

        return true;
      });

      start(delay);

      tick(0);

      return stop;
    };

    const proceedOptions = options => {
    	let opts = _.extend({}, defaultOptions, options);
      opts.container = _.$(opts.container);
      opts.element = _.$(opts.element);
      return opts;
    };

    const scrollContainerHeight = containerElement => {
      if (
        containerElement &&
        containerElement !== document &&
        containerElement !== document.body
      ) {
        return containerElement.scrollHeight - containerElement.offsetHeight;
      } else {
        let body = document.body;
        let html = document.documentElement;

        return Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.clientHeight,
          html.scrollHeight,
          html.offsetHeight
        );
      }
    };

    const setGlobalOptions = options => {
    	_.extend(defaultOptions, options || {});
    };

    const scrollTo = options => {
      return _scrollTo(proceedOptions(options));
    };

    const scrollToBottom = options => {
      options = proceedOptions(options);

      return _scrollTo(
        _.extend(options, {
          element: null,
          y: scrollContainerHeight(options.container)
        })
      );
    };

    const scrollToTop = options => {
      options = proceedOptions(options);

      return _scrollTo(
        _.extend(options, {
          element: null,
          y: 0
        })
      );
    };

    const makeScrollToAction = scrollToFunc => {
      return (node, options) => {
        let current = options;
        const handle = e => {
          e.preventDefault();
          scrollToFunc(
            typeof current === "string" ? { element: current } : current
          );
        };
        node.addEventListener("click", handle);
        node.addEventListener("touchstart", handle);
        return {
          update(options) {
            current = options;
          },
          destroy() {
            node.removeEventListener("click", handle);
            node.removeEventListener("touchstart", handle);
          }
        };
      };
    };

    const scrollto = makeScrollToAction(scrollTo);
    const scrolltotop = makeScrollToAction(scrollToTop);
    const scrolltobottom = makeScrollToAction(scrollToBottom);

    var animateScroll = /*#__PURE__*/Object.freeze({
        __proto__: null,
        setGlobalOptions: setGlobalOptions,
        scrollTo: scrollTo,
        scrollToBottom: scrollToBottom,
        scrollToTop: scrollToTop,
        makeScrollToAction: makeScrollToAction,
        scrollto: scrollto,
        scrolltotop: scrolltotop,
        scrolltobottom: scrolltobottom
    });

    /* src\Header.svelte generated by Svelte v3.32.2 */
    const file$2 = "src\\Header.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let ul;
    	let li0;
    	let a0;
    	let t1;
    	let li1;
    	let a1;
    	let t3;
    	let li2;
    	let a2;
    	let t5;
    	let li3;
    	let a3;
    	let t7;
    	let li4;
    	let a4;
    	let t9;
    	let li5;
    	let a5;
    	let t11;
    	let li6;
    	let a6;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Home";
    			t1 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "About Me";
    			t3 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Experience";
    			t5 = space();
    			li3 = element("li");
    			a3 = element("a");
    			a3.textContent = "Education";
    			t7 = space();
    			li4 = element("li");
    			a4 = element("a");
    			a4.textContent = "Projects";
    			t9 = space();
    			li5 = element("li");
    			a5 = element("a");
    			a5.textContent = "Skills";
    			t11 = space();
    			li6 = element("li");
    			a6 = element("a");
    			a6.textContent = "Contact";
    			attr_dev(a0, "class", "nav-link svelte-10k6172");
    			attr_dev(a0, "href", "#home");
    			add_location(a0, file$2, 6, 12, 175);
    			attr_dev(li0, "class", "nav-item svelte-10k6172");
    			add_location(li0, file$2, 5, 8, 140);
    			attr_dev(a1, "class", "nav-link svelte-10k6172");
    			attr_dev(a1, "href", "#aboutMe");
    			add_location(a1, file$2, 9, 12, 313);
    			attr_dev(li1, "class", "nav-item svelte-10k6172");
    			add_location(li1, file$2, 8, 8, 278);
    			attr_dev(a2, "class", "nav-link svelte-10k6172");
    			attr_dev(a2, "href", "#experience");
    			add_location(a2, file$2, 12, 12, 461);
    			attr_dev(li2, "class", "nav-item svelte-10k6172");
    			add_location(li2, file$2, 11, 8, 426);
    			attr_dev(a3, "class", "nav-link svelte-10k6172");
    			attr_dev(a3, "href", "#education");
    			add_location(a3, file$2, 15, 12, 617);
    			attr_dev(li3, "class", "nav-item svelte-10k6172");
    			add_location(li3, file$2, 14, 8, 582);
    			attr_dev(a4, "class", "nav-link svelte-10k6172");
    			attr_dev(a4, "href", "#projects");
    			add_location(a4, file$2, 18, 12, 770);
    			attr_dev(li4, "class", "nav-item svelte-10k6172");
    			add_location(li4, file$2, 17, 8, 735);
    			attr_dev(a5, "class", "nav-link svelte-10k6172");
    			attr_dev(a5, "href", "#skills");
    			add_location(a5, file$2, 21, 12, 920);
    			attr_dev(li5, "class", "nav-item svelte-10k6172");
    			add_location(li5, file$2, 20, 8, 885);
    			attr_dev(a6, "class", "nav-link svelte-10k6172");
    			attr_dev(a6, "href", "#skills");
    			add_location(a6, file$2, 24, 12, 1064);
    			attr_dev(li6, "class", "nav-item svelte-10k6172");
    			add_location(li6, file$2, 23, 8, 1029);
    			attr_dev(ul, "class", "nav svelte-10k6172");
    			add_location(ul, file$2, 4, 4, 114);
    			attr_dev(div, "id", "header");
    			attr_dev(div, "class", "header svelte-10k6172");
    			add_location(div, file$2, 3, 0, 76);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t3);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(ul, t5);
    			append_dev(ul, li3);
    			append_dev(li3, a3);
    			append_dev(ul, t7);
    			append_dev(ul, li4);
    			append_dev(li4, a4);
    			append_dev(ul, t9);
    			append_dev(ul, li5);
    			append_dev(li5, a5);
    			append_dev(ul, t11);
    			append_dev(ul, li6);
    			append_dev(li6, a6);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(scrollto(a0, "#home")),
    					action_destroyer(scrollto(a1, "#aboutMe")),
    					action_destroyer(scrollto(a2, "#experience")),
    					action_destroyer(scrollto(a3, "#education")),
    					action_destroyer(scrollto(a4, "#projects")),
    					action_destroyer(scrollto(a5, "#skills")),
    					action_destroyer(scrollto(a6, "#contact"))
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots("Header", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ animateScroll });
    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\AboutMe.svelte generated by Svelte v3.32.2 */

    const file$3 = "src\\AboutMe.svelte";

    function create_fragment$3(ctx) {
    	let div4;
    	let div3;
    	let h1;
    	let t1;
    	let div2;
    	let div0;
    	let img;
    	let img_src_value;
    	let t2;
    	let div1;
    	let p;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			h1 = element("h1");
    			h1.textContent = "About Me";
    			t1 = space();
    			div2 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t2 = space();
    			div1 = element("div");
    			p = element("p");
    			p.textContent = "Hello! My name is Chico(Qi) Chen and I am currently a\r\n                    graduate student at Northeastern University pursuing a\r\n                    master’s degree in Information System. I'm passinate about\r\n                    software development, especially interested in web\r\n                    development. I enjoy being challenged and get ready to learn\r\n                    and try new stuff.";
    			attr_dev(h1, "class", "title svelte-1k3fpcc");
    			add_location(h1, file$3, 2, 8, 74);
    			if (img.src !== (img_src_value = "./build/image/me.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "me");
    			attr_dev(img, "class", "svelte-1k3fpcc");
    			add_location(img, file$3, 5, 16, 187);
    			attr_dev(div0, "class", "image svelte-1k3fpcc");
    			add_location(div0, file$3, 4, 12, 150);
    			attr_dev(p, "class", "svelte-1k3fpcc");
    			add_location(p, file$3, 8, 16, 308);
    			attr_dev(div1, "class", "text-content svelte-1k3fpcc");
    			add_location(div1, file$3, 7, 12, 264);
    			attr_dev(div2, "class", "content svelte-1k3fpcc");
    			add_location(div2, file$3, 3, 8, 115);
    			attr_dev(div3, "class", "container svelte-1k3fpcc");
    			add_location(div3, file$3, 1, 4, 41);
    			attr_dev(div4, "id", "aboutMe");
    			attr_dev(div4, "class", "about-me svelte-1k3fpcc");
    			add_location(div4, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, h1);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, img);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, p);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
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

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("AboutMe", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<AboutMe> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class AboutMe extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AboutMe",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\Experience.svelte generated by Svelte v3.32.2 */

    const file$4 = "src\\Experience.svelte";

    function create_fragment$4(ctx) {
    	let div4;
    	let h1;
    	let t1;
    	let div2;
    	let h20;
    	let t3;
    	let div0;
    	let h30;
    	let t5;
    	let h40;
    	let t7;
    	let p0;
    	let t9;
    	let p1;
    	let t11;
    	let h21;
    	let t13;
    	let div1;
    	let h31;
    	let t15;
    	let h41;
    	let t17;
    	let p2;
    	let t19;
    	let p3;
    	let t21;
    	let div3;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Experience";
    			t1 = space();
    			div2 = element("div");
    			h20 = element("h2");
    			h20.textContent = "2018";
    			t3 = space();
    			div0 = element("div");
    			h30 = element("h3");
    			h30.textContent = "ZhuanZhuan Company";
    			t5 = space();
    			h40 = element("h4");
    			h40.textContent = "Java Intern";
    			t7 = space();
    			p0 = element("p");
    			p0.textContent = "- Built a product management website in Java to help company\r\n                visualize the product sales tendency, using Spring MVC and\r\n                MyBatis to communicate with MySQL database";
    			t9 = space();
    			p1 = element("p");
    			p1.textContent = "- Updated user’s searching result with JQuery AJAX instead of\r\n                refreshing the webpage";
    			t11 = space();
    			h21 = element("h2");
    			h21.textContent = "2021";
    			t13 = space();
    			div1 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Futuriest Academy";
    			t15 = space();
    			h41 = element("h4");
    			h41.textContent = "Software Engineer Intern";
    			t17 = space();
    			p2 = element("p");
    			p2.textContent = "- Gained knowledge about graph database, GSQL, and web framework Svelte";
    			t19 = space();
    			p3 = element("p");
    			p3.textContent = "- Building an Android application capture mobile screen usage";
    			t21 = space();
    			div3 = element("div");
    			attr_dev(h1, "class", "title svelte-fba2v4");
    			add_location(h1, file$4, 1, 4, 46);
    			attr_dev(h20, "class", "timeline_item timeline_item--year svelte-fba2v4");
    			add_location(h20, file$4, 3, 8, 117);
    			attr_dev(h30, "class", "timeline_title svelte-fba2v4");
    			add_location(h30, file$4, 5, 12, 223);
    			attr_dev(h40, "class", "svelte-fba2v4");
    			add_location(h40, file$4, 6, 12, 287);
    			attr_dev(p0, "class", "timeline_blurb svelte-fba2v4");
    			add_location(p0, file$4, 7, 12, 321);
    			attr_dev(p1, "class", "timeline-blurb svelte-fba2v4");
    			add_location(p1, file$4, 12, 12, 593);
    			attr_dev(div0, "class", "timeline_item svelte-fba2v4");
    			add_location(div0, file$4, 4, 8, 182);
    			attr_dev(h21, "class", "timeline_item timeline_item--year svelte-fba2v4");
    			add_location(h21, file$4, 17, 8, 782);
    			attr_dev(h31, "class", "timeline_title svelte-fba2v4");
    			add_location(h31, file$4, 19, 12, 888);
    			attr_dev(h41, "class", "svelte-fba2v4");
    			add_location(h41, file$4, 20, 12, 951);
    			attr_dev(p2, "class", "timeline_blurb svelte-fba2v4");
    			add_location(p2, file$4, 21, 12, 998);
    			attr_dev(p3, "class", "timeline-blurb svelte-fba2v4");
    			add_location(p3, file$4, 24, 12, 1145);
    			attr_dev(div1, "class", "timeline_item svelte-fba2v4");
    			add_location(div1, file$4, 18, 8, 847);
    			attr_dev(div2, "class", "timeline svelte-fba2v4");
    			add_location(div2, file$4, 2, 4, 85);
    			attr_dev(div3, "class", "footer svelte-fba2v4");
    			add_location(div3, file$4, 29, 4, 1302);
    			attr_dev(div4, "class", "experience svelte-fba2v4");
    			attr_dev(div4, "id", "experience");
    			add_location(div4, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, h1);
    			append_dev(div4, t1);
    			append_dev(div4, div2);
    			append_dev(div2, h20);
    			append_dev(div2, t3);
    			append_dev(div2, div0);
    			append_dev(div0, h30);
    			append_dev(div0, t5);
    			append_dev(div0, h40);
    			append_dev(div0, t7);
    			append_dev(div0, p0);
    			append_dev(div0, t9);
    			append_dev(div0, p1);
    			append_dev(div2, t11);
    			append_dev(div2, h21);
    			append_dev(div2, t13);
    			append_dev(div2, div1);
    			append_dev(div1, h31);
    			append_dev(div1, t15);
    			append_dev(div1, h41);
    			append_dev(div1, t17);
    			append_dev(div1, p2);
    			append_dev(div1, t19);
    			append_dev(div1, p3);
    			append_dev(div4, t21);
    			append_dev(div4, div3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
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

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Experience", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Experience> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Experience extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Experience",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\Education.svelte generated by Svelte v3.32.2 */

    const file$5 = "src\\Education.svelte";

    function create_fragment$5(ctx) {
    	let div5;
    	let h2;
    	let t1;
    	let div4;
    	let div1;
    	let div0;
    	let span0;
    	let t3;
    	let h50;
    	let t5;
    	let p0;
    	let t7;
    	let p1;
    	let t9;
    	let p2;
    	let t11;
    	let div3;
    	let div2;
    	let span1;
    	let t13;
    	let h51;
    	let t15;
    	let p3;
    	let t17;
    	let p4;
    	let t19;
    	let p5;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Education";
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = "2019-2021";
    			t3 = space();
    			h50 = element("h5");
    			h50.textContent = "Master in Information Systems";
    			t5 = space();
    			p0 = element("p");
    			p0.textContent = "Northeastern University";
    			t7 = space();
    			p1 = element("p");
    			p1.textContent = "-GPA: 3.52/4.00";
    			t9 = space();
    			p2 = element("p");
    			p2.textContent = "-Relevant Courses: Web Development, Data Structure & Algorithm, Parallelism & Concurrency";
    			t11 = space();
    			div3 = element("div");
    			div2 = element("div");
    			span1 = element("span");
    			span1.textContent = "2014-2018";
    			t13 = space();
    			h51 = element("h5");
    			h51.textContent = "Master in Software Engineering";
    			t15 = space();
    			p3 = element("p");
    			p3.textContent = "Inner Mongolia University";
    			t17 = space();
    			p4 = element("p");
    			p4.textContent = "-GPA: 3.5/4.00";
    			t19 = space();
    			p5 = element("p");
    			p5.textContent = "-Relevant Courses: Probability and Statistics, Data Structure & Algorithm, Software Engineer";
    			attr_dev(h2, "class", "title svelte-wao0k4");
    			add_location(h2, file$5, 1, 4, 26);
    			attr_dev(span0, "class", "font-weight-bold svelte-wao0k4");
    			add_location(span0, file$5, 5, 16, 170);
    			attr_dev(h50, "class", "svelte-wao0k4");
    			add_location(h50, file$5, 6, 16, 235);
    			attr_dev(p0, "class", "text-muted small-xl svelte-wao0k4");
    			add_location(p0, file$5, 7, 16, 291);
    			attr_dev(p1, "class", "svelte-wao0k4");
    			add_location(p1, file$5, 8, 16, 367);
    			attr_dev(p2, "class", "svelte-wao0k4");
    			add_location(p2, file$5, 9, 16, 407);
    			attr_dev(div0, "class", "card-body svelte-wao0k4");
    			add_location(div0, file$5, 4, 12, 129);
    			attr_dev(div1, "class", "card svelte-wao0k4");
    			add_location(div1, file$5, 3, 8, 97);
    			attr_dev(span1, "class", "font-weight-bold svelte-wao0k4");
    			add_location(span1, file$5, 14, 16, 622);
    			attr_dev(h51, "class", "svelte-wao0k4");
    			add_location(h51, file$5, 15, 16, 687);
    			attr_dev(p3, "class", "text-muted small-xl svelte-wao0k4");
    			add_location(p3, file$5, 16, 16, 744);
    			attr_dev(p4, "class", "svelte-wao0k4");
    			add_location(p4, file$5, 17, 16, 822);
    			attr_dev(p5, "class", "svelte-wao0k4");
    			add_location(p5, file$5, 18, 16, 861);
    			attr_dev(div2, "class", "card-body svelte-wao0k4");
    			add_location(div2, file$5, 13, 12, 581);
    			attr_dev(div3, "class", "card svelte-wao0k4");
    			add_location(div3, file$5, 12, 8, 549);
    			attr_dev(div4, "class", "container svelte-wao0k4");
    			add_location(div4, file$5, 2, 4, 64);
    			attr_dev(div5, "id", "education");
    			attr_dev(div5, "class", "svelte-wao0k4");
    			add_location(div5, file$5, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, h2);
    			append_dev(div5, t1);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div0, span0);
    			append_dev(div0, t3);
    			append_dev(div0, h50);
    			append_dev(div0, t5);
    			append_dev(div0, p0);
    			append_dev(div0, t7);
    			append_dev(div0, p1);
    			append_dev(div0, t9);
    			append_dev(div0, p2);
    			append_dev(div4, t11);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, span1);
    			append_dev(div2, t13);
    			append_dev(div2, h51);
    			append_dev(div2, t15);
    			append_dev(div2, p3);
    			append_dev(div2, t17);
    			append_dev(div2, p4);
    			append_dev(div2, t19);
    			append_dev(div2, p5);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
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

    function instance$5($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Education", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Education> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Education extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Education",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\Project.svelte generated by Svelte v3.32.2 */

    const file$6 = "src\\Project.svelte";

    function create_fragment$6(ctx) {
    	let div13;
    	let h1;
    	let t1;
    	let div12;
    	let ul3;
    	let li2;
    	let div3;
    	let div0;
    	let t2;
    	let div2;
    	let div1;
    	let t4;
    	let span0;
    	let t6;
    	let span1;
    	let t7;
    	let p0;
    	let t9;
    	let ul0;
    	let li0;
    	let a0;
    	let i0;
    	let t10;
    	let li1;
    	let a1;
    	let i1;
    	let t11;
    	let li4;
    	let div7;
    	let div4;
    	let t12;
    	let div6;
    	let div5;
    	let t14;
    	let span2;
    	let t16;
    	let p1;
    	let t18;
    	let ul1;
    	let li3;
    	let a2;
    	let i2;
    	let t19;
    	let li6;
    	let div11;
    	let div8;
    	let t20;
    	let div10;
    	let div9;
    	let t22;
    	let span3;
    	let t24;
    	let p2;
    	let t26;
    	let ul2;
    	let li5;
    	let a3;
    	let i3;
    	let t27;
    	let a4;
    	let i4;
    	let t28;
    	let a5;
    	let i5;

    	const block = {
    		c: function create() {
    			div13 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Projects";
    			t1 = space();
    			div12 = element("div");
    			ul3 = element("ul");
    			li2 = element("li");
    			div3 = element("div");
    			div0 = element("div");
    			t2 = space();
    			div2 = element("div");
    			div1 = element("div");
    			div1.textContent = "TodoList app";
    			t4 = space();
    			span0 = element("span");
    			span0.textContent = "Svelte";
    			t6 = space();
    			span1 = element("span");
    			t7 = space();
    			p0 = element("p");
    			p0.textContent = "Created a todolist application with Svelte, enabled\r\n                            user edit tasks and add checklists for each task";
    			t9 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			i0 = element("i");
    			t10 = space();
    			li1 = element("li");
    			a1 = element("a");
    			i1 = element("i");
    			t11 = space();
    			li4 = element("li");
    			div7 = element("div");
    			div4 = element("div");
    			t12 = space();
    			div6 = element("div");
    			div5 = element("div");
    			div5.textContent = "Location Sharing App";
    			t14 = space();
    			span2 = element("span");
    			span2.textContent = "React, ExpressJS, MongoDB, Restful APIs";
    			t16 = space();
    			p1 = element("p");
    			p1.textContent = "Implemented an application where users can share\r\n                            places with images and location with other users";
    			t18 = space();
    			ul1 = element("ul");
    			li3 = element("li");
    			a2 = element("a");
    			i2 = element("i");
<<<<<<< Updated upstream:build/bundle.js
    			attr_dev(h1, "class", "title svelte-jxkzj5");
=======
    			t19 = space();
    			li6 = element("li");
    			div11 = element("div");
    			div8 = element("div");
    			t20 = space();
    			div10 = element("div");
    			div9 = element("div");
    			div9.textContent = "Shortest Path & Centrality Web App";
    			t22 = space();
    			span3 = element("span");
    			span3.textContent = "TigerGraph, Streamlit, Graphistry";
    			t24 = space();
    			p2 = element("p");
    			p2.textContent = "Created an web application using Streamlit that launches airports' shortest path\r\n                            and centrality analysis. Used TigerGraph Graph - Centrality database.";
    			t26 = space();
    			ul2 = element("ul");
    			li5 = element("li");
    			a3 = element("a");
    			i3 = element("i");
    			t27 = space();
    			a4 = element("a");
    			i4 = element("i");
    			t28 = space();
    			a5 = element("a");
    			i5 = element("i");
    			attr_dev(h1, "class", "title svelte-yplc5");
>>>>>>> Stashed changes:public/build/bundle.js
    			add_location(h1, file$6, 1, 4, 25);
    			attr_dev(div0, "class", "card__image card__image--fence svelte-jxkzj5");
    			add_location(div0, file$6, 6, 20, 209);
    			attr_dev(div1, "class", "card__title svelte-jxkzj5");
    			add_location(div1, file$6, 8, 24, 330);
    			attr_dev(span0, "class", "svelte-jxkzj5");
    			add_location(span0, file$6, 9, 24, 399);
    			attr_dev(span1, "class", "svelte-jxkzj5");
    			add_location(span1, file$6, 10, 24, 444);
    			attr_dev(p0, "class", "card__text svelte-jxkzj5");
    			add_location(p0, file$6, 11, 24, 478);
    			attr_dev(i0, "class", "fa fa-github svelte-jxkzj5");
    			add_location(i0, file$6, 20, 36, 952);
    			attr_dev(a0, "href", "https://github.com/Chico-Chen/svelte_practice");
    			attr_dev(a0, "class", "svelte-jxkzj5");
    			add_location(a0, file$6, 17, 32, 787);
    			attr_dev(li0, "class", "svelte-jxkzj5");
    			add_location(li0, file$6, 16, 28, 749);
    			attr_dev(i1, "class", "fa fa-medium svelte-jxkzj5");
    			add_location(i1, file$6, 27, 36, 1321);
    			attr_dev(a1, "href", "https://chicoq1996.medium.com/svelte-starter-building-a-todo-list-app-b39cced5b770");
    			attr_dev(a1, "class", "svelte-jxkzj5");
    			add_location(a1, file$6, 24, 32, 1119);
    			attr_dev(li1, "class", "svelte-jxkzj5");
    			add_location(li1, file$6, 23, 28, 1081);
    			attr_dev(ul0, "class", "svelte-jxkzj5");
    			add_location(ul0, file$6, 15, 24, 715);
    			attr_dev(div2, "class", "card__content svelte-jxkzj5");
    			add_location(div2, file$6, 7, 20, 277);
    			attr_dev(div3, "class", "card svelte-jxkzj5");
    			add_location(div3, file$6, 5, 16, 169);
    			attr_dev(li2, "class", "cards__item svelte-jxkzj5");
    			add_location(li2, file$6, 4, 12, 127);
    			attr_dev(div4, "class", "card__image card__image--river svelte-jxkzj5");
    			add_location(div4, file$6, 36, 20, 1618);
    			attr_dev(div5, "class", "card__title svelte-jxkzj5");
    			add_location(div5, file$6, 38, 24, 1739);
    			attr_dev(span2, "class", "svelte-jxkzj5");
    			add_location(span2, file$6, 39, 24, 1816);
    			attr_dev(p1, "class", "card__text svelte-jxkzj5");
    			add_location(p1, file$6, 40, 24, 1894);
    			attr_dev(i2, "class", "fa fa-github svelte-jxkzj5");
    			add_location(i2, file$6, 49, 36, 2371);
    			attr_dev(a2, "href", "https://github.com/Chico-Chen/share-places-frontend");
    			attr_dev(a2, "class", "svelte-jxkzj5");
    			add_location(a2, file$6, 46, 32, 2200);
    			attr_dev(li3, "class", "svelte-jxkzj5");
    			add_location(li3, file$6, 45, 28, 2162);
    			attr_dev(ul1, "class", "svelte-jxkzj5");
    			add_location(ul1, file$6, 44, 24, 2128);
    			attr_dev(div6, "class", "card__content svelte-jxkzj5");
    			add_location(div6, file$6, 37, 20, 1686);
    			attr_dev(div7, "class", "card svelte-jxkzj5");
    			add_location(div7, file$6, 35, 16, 1578);
    			attr_dev(li4, "class", "cards__item svelte-jxkzj5");
    			add_location(li4, file$6, 34, 12, 1536);
<<<<<<< Updated upstream:build/bundle.js
    			attr_dev(ul2, "class", "cards svelte-jxkzj5");
    			add_location(ul2, file$6, 3, 8, 95);
    			attr_dev(div8, "class", "container svelte-jxkzj5");
    			add_location(div8, file$6, 2, 4, 62);
    			attr_dev(div9, "id", "projects");
    			attr_dev(div9, "class", "svelte-jxkzj5");
    			add_location(div9, file$6, 0, 0, 0);
=======
    			attr_dev(div8, "class", "card__image card__image--hackathon svelte-yplc5");
    			add_location(div8, file$6, 58, 20, 2668);
    			attr_dev(div9, "class", "card__title svelte-yplc5");
    			add_location(div9, file$6, 60, 24, 2793);
    			attr_dev(span3, "class", "svelte-yplc5");
    			add_location(span3, file$6, 61, 24, 2884);
    			attr_dev(p2, "class", "card__text svelte-yplc5");
    			add_location(p2, file$6, 62, 24, 2956);
    			attr_dev(i3, "class", "fa fa-github svelte-yplc5");
    			add_location(i3, file$6, 71, 36, 3496);
    			attr_dev(a3, "href", "https://github.com/github-organization-account-name/hackathon");
    			attr_dev(a3, "class", "svelte-yplc5");
    			add_location(a3, file$6, 68, 32, 3315);
    			attr_dev(i4, "class", "fa fa-medium svelte-yplc5");
    			add_location(i4, file$6, 76, 36, 3848);
    			attr_dev(a4, "href", "https://chicoq1996.medium.com/creating-an-airport-centrality-data-visualization-web-application-with-tigergraph-streamlit-35252235bf0a");
    			attr_dev(a4, "class", "svelte-yplc5");
    			add_location(a4, file$6, 73, 32, 3594);
    			attr_dev(i5, "class", "fa fa-medium svelte-yplc5");
    			add_location(i5, file$6, 81, 36, 4179);
    			attr_dev(a5, "href", "https://chicoq1996.medium.com/how-to-render-a-react-page-into-streamlit-and-build-an-interactive-map-790757145a20");
    			attr_dev(a5, "class", "svelte-yplc5");
    			add_location(a5, file$6, 78, 32, 3946);
    			attr_dev(li5, "class", "svelte-yplc5");
    			add_location(li5, file$6, 67, 28, 3277);
    			attr_dev(ul2, "class", "svelte-yplc5");
    			add_location(ul2, file$6, 66, 24, 3243);
    			attr_dev(div10, "class", "card__content svelte-yplc5");
    			add_location(div10, file$6, 59, 20, 2740);
    			attr_dev(div11, "class", "card svelte-yplc5");
    			add_location(div11, file$6, 57, 16, 2628);
    			attr_dev(li6, "class", "cards__item svelte-yplc5");
    			add_location(li6, file$6, 56, 12, 2586);
    			attr_dev(ul3, "class", "cards svelte-yplc5");
    			add_location(ul3, file$6, 3, 8, 95);
    			attr_dev(div12, "class", "container svelte-yplc5");
    			add_location(div12, file$6, 2, 4, 62);
    			attr_dev(div13, "id", "projects");
    			attr_dev(div13, "class", "svelte-yplc5");
    			add_location(div13, file$6, 0, 0, 0);
>>>>>>> Stashed changes:public/build/bundle.js
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div13, anchor);
    			append_dev(div13, h1);
    			append_dev(div13, t1);
    			append_dev(div13, div12);
    			append_dev(div12, ul3);
    			append_dev(ul3, li2);
    			append_dev(li2, div3);
    			append_dev(div3, div0);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div2, t4);
    			append_dev(div2, span0);
    			append_dev(div2, t6);
    			append_dev(div2, span1);
    			append_dev(div2, t7);
    			append_dev(div2, p0);
    			append_dev(div2, t9);
    			append_dev(div2, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, a0);
    			append_dev(a0, i0);
    			append_dev(ul0, t10);
    			append_dev(ul0, li1);
    			append_dev(li1, a1);
    			append_dev(a1, i1);
    			append_dev(ul3, t11);
    			append_dev(ul3, li4);
    			append_dev(li4, div7);
    			append_dev(div7, div4);
    			append_dev(div7, t12);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div6, t14);
    			append_dev(div6, span2);
    			append_dev(div6, t16);
    			append_dev(div6, p1);
    			append_dev(div6, t18);
    			append_dev(div6, ul1);
    			append_dev(ul1, li3);
    			append_dev(li3, a2);
    			append_dev(a2, i2);
    			append_dev(ul3, t19);
    			append_dev(ul3, li6);
    			append_dev(li6, div11);
    			append_dev(div11, div8);
    			append_dev(div11, t20);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div10, t22);
    			append_dev(div10, span3);
    			append_dev(div10, t24);
    			append_dev(div10, p2);
    			append_dev(div10, t26);
    			append_dev(div10, ul2);
    			append_dev(ul2, li5);
    			append_dev(li5, a3);
    			append_dev(a3, i3);
    			append_dev(li5, t27);
    			append_dev(li5, a4);
    			append_dev(a4, i4);
    			append_dev(li5, t28);
    			append_dev(li5, a5);
    			append_dev(a5, i5);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div13);
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

    function instance$6($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Project", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Project> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Project extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Project",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\Footer.svelte generated by Svelte v3.32.2 */

    const file$7 = "src\\Footer.svelte";

    function create_fragment$7(ctx) {
    	let footer;
    	let div2;
    	let div0;
    	let ul;
    	let li0;
    	let a0;
    	let i0;
    	let t0;
    	let li1;
    	let a1;
    	let i1;
    	let t1;
    	let li2;
    	let a2;
    	let i2;
    	let t2;
    	let div1;
    	let p;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div2 = element("div");
    			div0 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			i0 = element("i");
    			t0 = space();
    			li1 = element("li");
    			a1 = element("a");
    			i1 = element("i");
    			t1 = space();
    			li2 = element("li");
    			a2 = element("a");
    			i2 = element("i");
    			t2 = space();
    			div1 = element("div");
    			p = element("p");
    			p.textContent = "Copyright © 2021 Qi Chen";
    			attr_dev(i0, "class", "fa fa-linkedin svelte-1ilvrt3");
    			add_location(i0, file$7, 8, 24, 282);
    			attr_dev(a0, "href", "https://www.linkedin.com/in/chico-chen/?locale=en_US");
    			add_location(a0, file$7, 5, 20, 146);
    			attr_dev(li0, "class", "svelte-1ilvrt3");
    			add_location(li0, file$7, 4, 16, 120);
    			attr_dev(i1, "class", "fa fa-medium svelte-1ilvrt3");
    			add_location(i1, file$7, 13, 24, 470);
    			attr_dev(a1, "href", "https://chicoq1996.medium.com/");
    			add_location(a1, file$7, 12, 20, 403);
    			attr_dev(li1, "class", "svelte-1ilvrt3");
    			add_location(li1, file$7, 11, 16, 377);
    			attr_dev(i2, "class", "fa fa-github svelte-1ilvrt3");
    			add_location(i2, file$7, 18, 24, 672);
    			attr_dev(a2, "href", "https://github.com/Chico-Chen?tab=repositories");
    			add_location(a2, file$7, 17, 20, 589);
    			attr_dev(li2, "class", "svelte-1ilvrt3");
    			add_location(li2, file$7, 16, 16, 563);
    			attr_dev(ul, "class", "svelte-1ilvrt3");
    			add_location(ul, file$7, 3, 12, 98);
    			attr_dev(div0, "class", "float-right svelte-1ilvrt3");
    			add_location(div0, file$7, 2, 8, 59);
    			add_location(p, file$7, 24, 12, 831);
    			attr_dev(div1, "class", "footer-left svelte-1ilvrt3");
    			add_location(div1, file$7, 23, 8, 792);
    			attr_dev(div2, "class", "container svelte-1ilvrt3");
    			add_location(div2, file$7, 1, 4, 26);
    			attr_dev(footer, "id", "footer");
    			attr_dev(footer, "class", "svelte-1ilvrt3");
    			add_location(footer, file$7, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div2);
    			append_dev(div2, div0);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(a0, i0);
    			append_dev(ul, t0);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(a1, i1);
    			append_dev(ul, t1);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(a2, i2);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, p);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
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

    function instance$7($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Footer", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\Skills.svelte generated by Svelte v3.32.2 */

    const file$8 = "src\\Skills.svelte";

    function create_fragment$8(ctx) {
    	let div36;
    	let h2;
    	let t1;
    	let div34;
    	let div16;
    	let h30;
    	let t3;
    	let div3;
    	let div0;
    	let t4;
    	let span0;
    	let t6;
    	let div2;
    	let div1;
    	let t7;
    	let div7;
    	let div4;
    	let t8;
    	let span1;
    	let t10;
    	let div6;
    	let div5;
    	let t11;
    	let div11;
    	let div8;
    	let t12;
    	let span2;
    	let t14;
    	let div10;
    	let div9;
    	let t15;
    	let div15;
    	let div12;
    	let t16;
    	let span3;
    	let t18;
    	let div14;
    	let div13;
    	let t19;
    	let div33;
    	let h31;
    	let t21;
    	let div20;
    	let div17;
    	let t22;
    	let span4;
    	let t24;
    	let div19;
    	let div18;
    	let t25;
    	let div24;
    	let div21;
    	let t26;
    	let span5;
    	let t28;
    	let div23;
    	let div22;
    	let t29;
    	let div28;
    	let div25;
    	let t30;
    	let span6;
    	let t32;
    	let div27;
    	let div26;
    	let t33;
    	let div32;
    	let div29;
    	let t34;
    	let span7;
    	let t36;
    	let div31;
    	let div30;
    	let t37;
    	let div35;

    	const block = {
    		c: function create() {
    			div36 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Skills";
    			t1 = space();
    			div34 = element("div");
    			div16 = element("div");
    			h30 = element("h3");
    			h30.textContent = "Web Framework Skills";
    			t3 = space();
    			div3 = element("div");
    			div0 = element("div");
    			t4 = text("Angular\r\n                    ");
    			span0 = element("span");
    			span0.textContent = "85%";
    			t6 = space();
    			div2 = element("div");
    			div1 = element("div");
    			t7 = space();
    			div7 = element("div");
    			div4 = element("div");
    			t8 = text("React\r\n                    ");
    			span1 = element("span");
    			span1.textContent = "80%";
    			t10 = space();
    			div6 = element("div");
    			div5 = element("div");
    			t11 = space();
    			div11 = element("div");
    			div8 = element("div");
    			t12 = text("Svelte\r\n                    ");
    			span2 = element("span");
    			span2.textContent = "80%";
    			t14 = space();
    			div10 = element("div");
    			div9 = element("div");
    			t15 = space();
    			div15 = element("div");
    			div12 = element("div");
    			t16 = text("Flutter\r\n                    ");
    			span3 = element("span");
    			span3.textContent = "40%";
    			t18 = space();
    			div14 = element("div");
    			div13 = element("div");
    			t19 = space();
    			div33 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Programming Languages";
    			t21 = space();
    			div20 = element("div");
    			div17 = element("div");
    			t22 = text("Java\r\n                    ");
    			span4 = element("span");
    			span4.textContent = "90%";
    			t24 = space();
    			div19 = element("div");
    			div18 = element("div");
    			t25 = space();
    			div24 = element("div");
    			div21 = element("div");
    			t26 = text("JavaScript\r\n                    ");
    			span5 = element("span");
    			span5.textContent = "80%";
    			t28 = space();
    			div23 = element("div");
    			div22 = element("div");
    			t29 = space();
    			div28 = element("div");
    			div25 = element("div");
    			t30 = text("C++\r\n                    ");
    			span6 = element("span");
    			span6.textContent = "75%";
    			t32 = space();
    			div27 = element("div");
    			div26 = element("div");
    			t33 = space();
    			div32 = element("div");
    			div29 = element("div");
    			t34 = text("Python\r\n                    ");
    			span7 = element("span");
    			span7.textContent = "70%";
    			t36 = space();
    			div31 = element("div");
    			div30 = element("div");
    			t37 = space();
    			div35 = element("div");
    			attr_dev(h2, "class", "title svelte-ek8el4");
    			add_location(h2, file$8, 1, 4, 23);
    			add_location(h30, file$8, 4, 12, 131);
    			attr_dev(span0, "class", "badge float-right svelte-ek8el4");
    			add_location(span0, file$8, 8, 20, 286);
    			attr_dev(div0, "class", "skill-name svelte-ek8el4");
    			add_location(div0, file$8, 6, 16, 211);
    			attr_dev(div1, "class", "progress-bar svelte-ek8el4");
    			set_style(div1, "width", "85%");
    			attr_dev(div1, "aria-valuenow", "85");
    			attr_dev(div1, "aria-valuemax", "100");
    			attr_dev(div1, "aria-valuemin", "0");
    			add_location(div1, file$8, 11, 20, 414);
    			attr_dev(div2, "class", "progress svelte-ek8el4");
    			add_location(div2, file$8, 10, 16, 370);
    			attr_dev(div3, "class", "skill svelte-ek8el4");
    			add_location(div3, file$8, 5, 12, 174);
    			attr_dev(span1, "class", "badge float-right svelte-ek8el4");
    			add_location(span1, file$8, 23, 20, 831);
    			attr_dev(div4, "class", "skill-name svelte-ek8el4");
    			add_location(div4, file$8, 21, 16, 758);
    			attr_dev(div5, "class", "progress-bar svelte-ek8el4");
    			set_style(div5, "width", "80%");
    			attr_dev(div5, "aria-valuenow", "80");
    			attr_dev(div5, "aria-valuemax", "100");
    			attr_dev(div5, "aria-valuemin", "0");
    			add_location(div5, file$8, 26, 20, 959);
    			attr_dev(div6, "class", "progress svelte-ek8el4");
    			add_location(div6, file$8, 25, 16, 915);
    			attr_dev(div7, "class", "skill svelte-ek8el4");
    			add_location(div7, file$8, 20, 12, 721);
    			attr_dev(span2, "class", "badge float-right svelte-ek8el4");
    			add_location(span2, file$8, 38, 20, 1377);
    			attr_dev(div8, "class", "skill-name svelte-ek8el4");
    			add_location(div8, file$8, 36, 16, 1303);
    			attr_dev(div9, "class", "progress-bar svelte-ek8el4");
    			set_style(div9, "width", "80%");
    			attr_dev(div9, "aria-valuenow", "80");
    			attr_dev(div9, "aria-valuemax", "100");
    			attr_dev(div9, "aria-valuemin", "0");
    			add_location(div9, file$8, 41, 20, 1505);
    			attr_dev(div10, "class", "progress svelte-ek8el4");
    			add_location(div10, file$8, 40, 16, 1461);
    			attr_dev(div11, "class", "skill svelte-ek8el4");
    			add_location(div11, file$8, 35, 12, 1266);
    			attr_dev(span3, "class", "badge float-right svelte-ek8el4");
    			add_location(span3, file$8, 53, 20, 1924);
    			attr_dev(div12, "class", "skill-name svelte-ek8el4");
    			add_location(div12, file$8, 51, 16, 1849);
    			attr_dev(div13, "class", "progress-bar svelte-ek8el4");
    			set_style(div13, "width", "40%");
    			attr_dev(div13, "aria-valuenow", "40");
    			attr_dev(div13, "aria-valuemax", "100");
    			attr_dev(div13, "aria-valuemin", "0");
    			add_location(div13, file$8, 56, 20, 2052);
    			attr_dev(div14, "class", "progress svelte-ek8el4");
    			add_location(div14, file$8, 55, 16, 2008);
    			attr_dev(div15, "class", "skill svelte-ek8el4");
    			add_location(div15, file$8, 50, 12, 1812);
    			attr_dev(div16, "class", "left-content svelte-ek8el4");
    			add_location(div16, file$8, 3, 8, 91);
    			add_location(h31, file$8, 67, 12, 2411);
    			attr_dev(span4, "class", "badge float-right svelte-ek8el4");
    			add_location(span4, file$8, 71, 20, 2564);
    			attr_dev(div17, "class", "skill-name svelte-ek8el4");
    			add_location(div17, file$8, 69, 16, 2492);
    			attr_dev(div18, "class", "progress-bar svelte-ek8el4");
    			set_style(div18, "width", "90%");
    			attr_dev(div18, "aria-valuenow", "90");
    			attr_dev(div18, "aria-valuemax", "100");
    			attr_dev(div18, "aria-valuemin", "0");
    			add_location(div18, file$8, 74, 20, 2692);
    			attr_dev(div19, "class", "progress svelte-ek8el4");
    			add_location(div19, file$8, 73, 16, 2648);
    			attr_dev(div20, "class", "skill svelte-ek8el4");
    			add_location(div20, file$8, 68, 12, 2455);
    			attr_dev(span5, "class", "badge float-right svelte-ek8el4");
    			add_location(span5, file$8, 86, 20, 3114);
    			attr_dev(div21, "class", "skill-name svelte-ek8el4");
    			add_location(div21, file$8, 84, 16, 3036);
    			attr_dev(div22, "class", "progress-bar svelte-ek8el4");
    			set_style(div22, "width", "80%");
    			attr_dev(div22, "aria-valuenow", "80");
    			attr_dev(div22, "aria-valuemax", "100");
    			attr_dev(div22, "aria-valuemin", "0");
    			add_location(div22, file$8, 89, 20, 3242);
    			attr_dev(div23, "class", "progress svelte-ek8el4");
    			add_location(div23, file$8, 88, 16, 3198);
    			attr_dev(div24, "class", "skill svelte-ek8el4");
    			add_location(div24, file$8, 83, 12, 2999);
    			attr_dev(span6, "class", "badge float-right svelte-ek8el4");
    			add_location(span6, file$8, 101, 20, 3657);
    			attr_dev(div25, "class", "skill-name svelte-ek8el4");
    			add_location(div25, file$8, 99, 16, 3586);
    			attr_dev(div26, "class", "progress-bar svelte-ek8el4");
    			set_style(div26, "width", "75%");
    			attr_dev(div26, "aria-valuenow", "75");
    			attr_dev(div26, "aria-valuemax", "100");
    			attr_dev(div26, "aria-valuemin", "0");
    			add_location(div26, file$8, 104, 20, 3785);
    			attr_dev(div27, "class", "progress svelte-ek8el4");
    			add_location(div27, file$8, 103, 16, 3741);
    			attr_dev(div28, "class", "skill svelte-ek8el4");
    			add_location(div28, file$8, 98, 12, 3549);
    			attr_dev(span7, "class", "badge float-right svelte-ek8el4");
    			add_location(span7, file$8, 116, 20, 4203);
    			attr_dev(div29, "class", "skill-name svelte-ek8el4");
    			add_location(div29, file$8, 114, 16, 4129);
    			attr_dev(div30, "class", "progress-bar svelte-ek8el4");
    			set_style(div30, "width", "70%");
    			attr_dev(div30, "aria-valuenow", "70");
    			attr_dev(div30, "aria-valuemax", "100");
    			attr_dev(div30, "aria-valuemin", "0");
    			add_location(div30, file$8, 119, 20, 4331);
    			attr_dev(div31, "class", "progress svelte-ek8el4");
    			add_location(div31, file$8, 118, 16, 4287);
    			attr_dev(div32, "class", "skill svelte-ek8el4");
    			add_location(div32, file$8, 113, 12, 4092);
    			attr_dev(div33, "class", "left-content svelte-ek8el4");
    			add_location(div33, file$8, 66, 8, 2371);
    			attr_dev(div34, "class", "container svelte-ek8el4");
    			add_location(div34, file$8, 2, 4, 58);
    			add_location(div35, file$8, 130, 4, 4658);
    			attr_dev(div36, "id", "skills");
    			attr_dev(div36, "class", "svelte-ek8el4");
    			add_location(div36, file$8, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div36, anchor);
    			append_dev(div36, h2);
    			append_dev(div36, t1);
    			append_dev(div36, div34);
    			append_dev(div34, div16);
    			append_dev(div16, h30);
    			append_dev(div16, t3);
    			append_dev(div16, div3);
    			append_dev(div3, div0);
    			append_dev(div0, t4);
    			append_dev(div0, span0);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div16, t7);
    			append_dev(div16, div7);
    			append_dev(div7, div4);
    			append_dev(div4, t8);
    			append_dev(div4, span1);
    			append_dev(div7, t10);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div16, t11);
    			append_dev(div16, div11);
    			append_dev(div11, div8);
    			append_dev(div8, t12);
    			append_dev(div8, span2);
    			append_dev(div11, t14);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div16, t15);
    			append_dev(div16, div15);
    			append_dev(div15, div12);
    			append_dev(div12, t16);
    			append_dev(div12, span3);
    			append_dev(div15, t18);
    			append_dev(div15, div14);
    			append_dev(div14, div13);
    			append_dev(div34, t19);
    			append_dev(div34, div33);
    			append_dev(div33, h31);
    			append_dev(div33, t21);
    			append_dev(div33, div20);
    			append_dev(div20, div17);
    			append_dev(div17, t22);
    			append_dev(div17, span4);
    			append_dev(div20, t24);
    			append_dev(div20, div19);
    			append_dev(div19, div18);
    			append_dev(div33, t25);
    			append_dev(div33, div24);
    			append_dev(div24, div21);
    			append_dev(div21, t26);
    			append_dev(div21, span5);
    			append_dev(div24, t28);
    			append_dev(div24, div23);
    			append_dev(div23, div22);
    			append_dev(div33, t29);
    			append_dev(div33, div28);
    			append_dev(div28, div25);
    			append_dev(div25, t30);
    			append_dev(div25, span6);
    			append_dev(div28, t32);
    			append_dev(div28, div27);
    			append_dev(div27, div26);
    			append_dev(div33, t33);
    			append_dev(div33, div32);
    			append_dev(div32, div29);
    			append_dev(div29, t34);
    			append_dev(div29, span7);
    			append_dev(div32, t36);
    			append_dev(div32, div31);
    			append_dev(div31, div30);
    			append_dev(div36, t37);
    			append_dev(div36, div35);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div36);
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

    function instance$8($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Skills", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Skills> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Skills extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Skills",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\Contact.svelte generated by Svelte v3.32.2 */
    const file$9 = "src\\Contact.svelte";

    function create_fragment$9(ctx) {
    	let div10;
    	let h1;
    	let t1;
    	let div8;
    	let form;
    	let div7;
    	let div1;
    	let div0;
    	let input0;
    	let t2;
    	let label0;
    	let t4;
    	let div3;
    	let div2;
    	let input1;
    	let t5;
    	let label1;
    	let t7;
    	let div5;
    	let div4;
    	let textarea;
    	let t8;
    	let label2;
    	let t10;
    	let div6;
    	let button;
    	let t12;
    	let div9;

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Stay Connected";
    			t1 = space();
    			div8 = element("div");
    			form = element("form");
    			div7 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			input0 = element("input");
    			t2 = space();
    			label0 = element("label");
    			label0.textContent = "Name";
    			t4 = space();
    			div3 = element("div");
    			div2 = element("div");
    			input1 = element("input");
    			t5 = space();
    			label1 = element("label");
    			label1.textContent = "Email";
    			t7 = space();
    			div5 = element("div");
    			div4 = element("div");
    			textarea = element("textarea");
    			t8 = space();
    			label2 = element("label");
    			label2.textContent = "Message";
    			t10 = space();
    			div6 = element("div");
    			button = element("button");
    			button.textContent = "Send Message";
    			t12 = space();
    			div9 = element("div");
    			attr_dev(h1, "class", "title svelte-iky0oy");
    			add_location(h1, file$9, 5, 4, 73);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "_name");
    			input0.required = true;
    			attr_dev(input0, "class", "svelte-iky0oy");
    			add_location(input0, file$9, 17, 24, 533);
    			attr_dev(label0, "class", "svelte-iky0oy");
    			add_location(label0, file$9, 19, 24, 684);
    			attr_dev(div0, "class", "styled-input svelte-iky0oy");
    			add_location(div0, file$9, 16, 20, 481);
    			attr_dev(div1, "class", "col-md-6 col-sm-12");
    			add_location(div1, file$9, 15, 16, 427);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "name", "_replyto");
    			input1.required = true;
    			attr_dev(input1, "class", "svelte-iky0oy");
    			add_location(input1, file$9, 24, 24, 900);
    			attr_dev(label1, "class", "svelte-iky0oy");
    			add_location(label1, file$9, 26, 24, 1054);
    			attr_dev(div2, "class", "styled-input svelte-iky0oy");
    			set_style(div2, "float", "right");
    			add_location(div2, file$9, 23, 20, 827);
    			attr_dev(div3, "class", "col-md-6 col-sm-12");
    			add_location(div3, file$9, 22, 16, 773);
    			attr_dev(textarea, "name", "message");
    			textarea.required = true;
    			attr_dev(textarea, "class", "svelte-iky0oy");
    			add_location(textarea, file$9, 31, 24, 1246);
    			attr_dev(label2, "class", "svelte-iky0oy");
    			add_location(label2, file$9, 33, 24, 1390);
    			attr_dev(div4, "class", "styled-input wide svelte-iky0oy");
    			add_location(div4, file$9, 30, 20, 1189);
    			attr_dev(div5, "class", "col-xs-12");
    			add_location(div5, file$9, 29, 16, 1144);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "btn-lrg submit-btn svelte-iky0oy");
    			add_location(button, file$9, 38, 20, 1628);
    			attr_dev(div6, "class", "col-xs-12");
    			add_location(div6, file$9, 36, 16, 1482);
    			attr_dev(div7, "class", "row input-container svelte-iky0oy");
    			add_location(div7, file$9, 14, 12, 376);
    			attr_dev(form, "method", "POST");
    			attr_dev(form, "action", "https://formkeep.com/f/010e1db52313");
    			attr_dev(form, "accept-charset", "UTF-8");
    			attr_dev(form, "enctype", "multipart/form-data");
    			add_location(form, file$9, 8, 8, 182);
    			attr_dev(div8, "class", "container svelte-iky0oy");
    			add_location(div8, file$9, 7, 4, 149);
    			attr_dev(div9, "class", "footer svelte-iky0oy");
    			add_location(div9, file$9, 45, 4, 1825);
    			attr_dev(div10, "id", "contact");
    			attr_dev(div10, "class", "svelte-iky0oy");
    			add_location(div10, file$9, 4, 0, 49);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, h1);
    			append_dev(div10, t1);
    			append_dev(div10, div8);
    			append_dev(div8, form);
    			append_dev(form, div7);
    			append_dev(div7, div1);
    			append_dev(div1, div0);
    			append_dev(div0, input0);
    			append_dev(div0, t2);
    			append_dev(div0, label0);
    			append_dev(div7, t4);
    			append_dev(div7, div3);
    			append_dev(div3, div2);
    			append_dev(div2, input1);
    			append_dev(div2, t5);
    			append_dev(div2, label1);
    			append_dev(div7, t7);
    			append_dev(div7, div5);
    			append_dev(div5, div4);
    			append_dev(div4, textarea);
    			append_dev(div4, t8);
    			append_dev(div4, label2);
    			append_dev(div7, t10);
    			append_dev(div7, div6);
    			append_dev(div6, button);
    			append_dev(div10, t12);
    			append_dev(div10, div9);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
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

    function instance$9($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Contact", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.32.2 */
    const file$a = "src\\App.svelte";

    function create_fragment$a(ctx) {
    	let main;
    	let header;
    	let t0;
    	let home;
    	let t1;
    	let aboutme;
    	let t2;
    	let experience;
    	let t3;
    	let education;
    	let t4;
    	let project;
    	let t5;
    	let skills;
    	let t6;
    	let contact;
    	let t7;
    	let footer;
    	let current;
    	header = new Header({ $$inline: true });
    	home = new Home({ $$inline: true });
    	aboutme = new AboutMe({ $$inline: true });
    	experience = new Experience({ $$inline: true });
    	education = new Education({ $$inline: true });
    	project = new Project({ $$inline: true });
    	skills = new Skills({ $$inline: true });
    	contact = new Contact({ $$inline: true });
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			create_component(home.$$.fragment);
    			t1 = space();
    			create_component(aboutme.$$.fragment);
    			t2 = space();
    			create_component(experience.$$.fragment);
    			t3 = space();
    			create_component(education.$$.fragment);
    			t4 = space();
    			create_component(project.$$.fragment);
    			t5 = space();
    			create_component(skills.$$.fragment);
    			t6 = space();
    			create_component(contact.$$.fragment);
    			t7 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(main, "class", "svelte-1w1bprh");
    			add_location(main, file$a, 12, 0, 402);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t0);
    			mount_component(home, main, null);
    			append_dev(main, t1);
    			mount_component(aboutme, main, null);
    			append_dev(main, t2);
    			mount_component(experience, main, null);
    			append_dev(main, t3);
    			mount_component(education, main, null);
    			append_dev(main, t4);
    			mount_component(project, main, null);
    			append_dev(main, t5);
    			mount_component(skills, main, null);
    			append_dev(main, t6);
    			mount_component(contact, main, null);
    			append_dev(main, t7);
    			mount_component(footer, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(home.$$.fragment, local);
    			transition_in(aboutme.$$.fragment, local);
    			transition_in(experience.$$.fragment, local);
    			transition_in(education.$$.fragment, local);
    			transition_in(project.$$.fragment, local);
    			transition_in(skills.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(home.$$.fragment, local);
    			transition_out(aboutme.$$.fragment, local);
    			transition_out(experience.$$.fragment, local);
    			transition_out(education.$$.fragment, local);
    			transition_out(project.$$.fragment, local);
    			transition_out(skills.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			destroy_component(home);
    			destroy_component(aboutme);
    			destroy_component(experience);
    			destroy_component(education);
    			destroy_component(project);
    			destroy_component(skills);
    			destroy_component(contact);
    			destroy_component(footer);
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
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Home,
    		Header,
    		AboutMe,
    		Experience,
    		Education,
    		Project,
    		Footer,
    		Skills,
    		Contact
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
