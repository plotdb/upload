// Generated by LiveScript 1.6.0
(function(it){
  return it();
})(function(){
  var uploadr, ext;
  uploadr = function(opt){
    var this$ = this;
    opt == null && (opt = {});
    this.root = typeof opt.root === 'string'
      ? document.querySelector(opt.root)
      : opt.root;
    if (!this.root) {
      console.warn("[uploadr] warning: no node found for root ", opt.root);
    }
    this.evtHandler = {};
    this.opt = import$({}, opt);
    this.opt.provider = opt.provider || {
      route: '/d/uploadr',
      host: 'native'
    };
    this.progress = function(v){
      var n, p;
      if (!(n = (v.item || (v.item = {})).node)) {
        return;
      }
      if (!(p = ld$.find(n, '[ld=progress]')[0])) {
        return;
      }
      p.style.width = v.percent * 100 + "%";
      if (v.percent >= 1) {
        return debounce(500).then(function(){
          var i;
          ld$.remove(n);
          if (~(i = this$.lc.files.indexOf(v.item))) {
            return this$.lc.files.splice(i, 1);
          }
        });
      }
    };
    this.lc = {
      files: []
    };
    this.init = proxise.once(function(){
      return this$._init();
    });
    this.init();
    return this;
  };
  uploadr.prototype = import$(Object.create(Object.prototype), {
    on: function(n, cb){
      var ref$;
      return ((ref$ = this.evtHandler)[n] || (ref$[n] = [])).push(cb);
    },
    fire: function(n){
      var v, res$, i$, to$, ref$, len$, cb, results$ = [];
      res$ = [];
      for (i$ = 1, to$ = arguments.length; i$ < to$; ++i$) {
        res$.push(arguments[i$]);
      }
      v = res$;
      for (i$ = 0, len$ = (ref$ = this.evtHandler[n] || []).length; i$ < len$; ++i$) {
        cb = ref$[i$];
        results$.push(cb.apply(this, v));
      }
      return results$;
    },
    _init: function(){
      var this$ = this;
      return Promise.resolve().then(function(){
        var lc, preview, thumbing, view;
        lc = this$.lc;
        preview = function(files){
          var preview, promises;
          preview = view.get('preview');
          promises = files.map(function(file){
            return new Promise(function(res, rej){
              var img;
              img = new Image;
              img.onload = function(){
                var x$, ref$;
                if (preview) {
                  x$ = preview.style;
                  x$.backgroundImage = "url(" + file.thumb + ")";
                  x$.width = img.width + "px";
                  x$.height = img.height + "px";
                }
                return res(import$((ref$ = {}, ref$.width = img.width, ref$.height = img.height, ref$), file));
              };
              return img.src = file.thumb;
            });
          });
          return Promise.all(promises).then(function(){
            lc.files = (lc.files || []).concat(files);
            return debounce(500);
          }).then(function(){
            view.render();
            this$.fire('preview.done');
            this$.lc.loader.off();
            return this$.fire('file.chosen', lc.files);
          });
        };
        thumbing = function(list){
          this$.fire('preview.loading');
          this$.lc.loader.on();
          list = Array.from(list);
          return new Promise(function(res, rej){
            var ret, _;
            ret = [];
            _ = function(list){
              var file, src, img;
              file = list.splice(0, 1)[0];
              if (!file) {
                return res(ret);
              }
              src = URL.createObjectURL(file);
              img = new Image();
              img.onload = function(){
                var ref$, w, h, c1, ctx;
                ref$ = [img.width, img.height], w = ref$[0], h = ref$[1];
                if (w > 200) {
                  ref$ = [200, h * 200 / w], w = ref$[0], h = ref$[1];
                }
                if (h > 150) {
                  ref$ = [w * 150 / h, 150], w = ref$[0], h = ref$[1];
                }
                c1 = document.createElement("canvas");
                c1.width = w;
                c1.height = h;
                ctx = c1.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);
                return c1.toBlob(function(blob){
                  var f;
                  ret.push(f = {
                    thumb: URL.createObjectURL(blob),
                    file: file
                  });
                  preview([f]);
                  return _(list);
                });
              };
              return img.src = src;
            };
            return _(list);
          });
        };
        return this$.lc.view = view = new ldView({
          root: this$.root,
          action: {
            input: {
              input: function(arg$){
                var node, evt;
                node = arg$.node, evt = arg$.evt;
                return thumbing(node.files).then(function(files){
                  var that;
                  node.value = null;
                  if (that = node.form) {
                    return that.reset();
                  }
                });
              }
            },
            click: {
              upload: function(arg$){
                var node, evt;
                node = arg$.node, evt = arg$.evt;
                return this$.upload().then(function(it){
                  this$.clear();
                  return it;
                });
              },
              clear: function(arg$){
                var node, evt;
                node = arg$.node, evt = arg$.evt;
                return this$.clear();
              }
            },
            drop: {
              drop: function(arg$){
                var node, evt;
                node = arg$.node, evt = arg$.evt;
                evt.preventDefault();
                return thumbing(evt.dataTransfer.files);
              }
            },
            dragover: {
              drop: function(arg$){
                var node, evt;
                node = arg$.node, evt = arg$.evt;
                return evt.preventDefault();
              }
            }
          },
          init: {
            loader: function(arg$){
              var node;
              node = arg$.node;
              return this$.lc.loader = new ldLoader({
                root: node
              });
            }
          },
          handler: {
            file: {
              list: function(){
                return lc.files || [];
              },
              view: {
                action: {
                  click: {
                    'delete': function(arg$){
                      var context, idx;
                      context = arg$.context;
                      if (!~(idx = lc.files.indexOf(context))) {
                        return;
                      }
                      lc.files.splice(idx, 1);
                      return lc.view.render('file');
                    }
                  }
                },
                handler: {
                  name: function(arg$){
                    var node, context;
                    node = arg$.node, context = arg$.context;
                    return node.textContent = context.file.name;
                  },
                  size: function(arg$){
                    var node, context;
                    node = arg$.node, context = arg$.context;
                    return node.textContent = Math.round(context.file.size / 1024) + "KB";
                  },
                  thumb: function(arg$){
                    var node, context;
                    node = arg$.node, context = arg$.context;
                    if (node.nodeName.toLowerCase() === 'img') {
                      return node.setAttribute('src', context.thumb);
                    } else {
                      return node.style.backgroundImage = "url(" + context.thumb + ")";
                    }
                  }
                }
              }
            }
          }
        });
      });
    },
    get: function(){
      return this.lc.files;
    },
    clear: function(){
      this.lc.files.splice(0);
      return this.lc.view.render();
    },
    upload: function(){
      var this$ = this;
      return ext[this.opt.provider.host]({
        files: this.lc.files,
        progress: this.progress,
        opt: this.opt.provider
      }).then(function(it){
        this$.fire('upload.done', it);
        return it;
      })['catch'](function(it){
        this$.fire('upload.fail', it);
        return Promise.reject(it);
      });
    }
  });
  uploadr.ext = ext = {};
  ext.dummy = function(arg$){
    var files, progress, opt;
    files = arg$.files, progress = arg$.progress, opt = arg$.opt;
    return new Promise(function(res, rej){
      return res(files.map(function(it){
        return {
          url: "https://i.ibb.co/frf90x6/only-support.png",
          name: it.file.name
        };
      }));
    });
  };
  ext.native = function(arg$){
    var files, progress, opt;
    files = arg$.files, progress = arg$.progress, opt = arg$.opt;
    return new Promise(function(res, rej){
      var ref$, merge, route, fd, ret, len, _;
      ref$ = opt || {}, merge = ref$.merge, route = ref$.route;
      progress({
        percent: 0,
        val: 0,
        len: len
      });
      if (merge) {
        fd = new FormData();
        files.map(function(it){
          return fd.append('file', it.file);
        });
        return ld$.xhr(route, (ref$ = {
          method: 'POST',
          body: fd
        }, ref$.headers = opt.headers, ref$), {
          type: 'json'
        }).then(res)['catch'](rej);
      } else {
        ret = [];
        len = files.length;
        _ = function(list){
          var item, fd, ref$;
          item = list.splice(0, 1)[0];
          if (!item) {
            return res(ret);
          }
          fd = new FormData();
          fd.append('file', item.file);
          return ld$.xhr(route, (ref$ = {
            method: 'POST',
            body: fd
          }, ref$.headers = opt.headers, ref$), {
            type: 'json',
            progress: function(it){
              return progress((it.item = item, it));
            }
          }).then(function(it){
            var o;
            ret.push(o = it[0]);
            return _(list);
          })['catch'](function(it){
            var o;
            return ret.push(o = {
              name: item.file.name,
              error: it
            });
          });
        };
        return _(files);
      }
    });
  };
  ext.imgbb = function(arg$){
    var files, progress, opt;
    files = arg$.files, progress = arg$.progress, opt = arg$.opt;
    return new Promise(function(res, rej){
      var ret, len, _;
      ret = [];
      len = files.length;
      progress({
        percent: 0,
        val: 0,
        len: len
      });
      _ = function(list){
        var item, fd;
        item = list.splice(0, 1)[0];
        if (!item) {
          return res(ret);
        }
        fd = new FormData();
        fd.append('image', item.file);
        return ld$.xhr("https://api.imgbb.com/1/upload?key=" + opt.key, {
          method: 'POST',
          body: fd
        }, {
          type: 'json'
        }).then(function(it){
          var o;
          if (!(it && it.data && it.status === 200)) {
            return Promise.reject(it);
          }
          ret.push(o = {
            url: it.data.display_url,
            name: item.file.name,
            id: it.data.id,
            raw: it.data
          });
          progress({
            percent: (len - list.length) / len,
            val: len - list.length,
            len: len,
            item: o
          });
          return _(list);
        })['catch'](function(it){
          var o;
          ret.push(o = {
            name: item.file.name,
            error: it
          });
          return progress({
            percent: (len - list.length) / len,
            val: len - list.length,
            len: len,
            item: o
          });
        });
      };
      return _(files);
    });
  };
  uploadr.viewer = function(opt){
    var lc, view, this$ = this;
    this.root = typeof opt.root === 'string'
      ? document.querySelector(opt.root)
      : opt.root;
    if (!this.root) {
      console.warn("[uploadr] warning: no node found for root ", opt.root);
    }
    this.evtHandler = {};
    this.lc = lc = {};
    this.files = lc.files = [];
    this.view = view = new ldView({
      root: this.root,
      action: {
        click: {
          list: function(arg$){
            var node, evt, n, src;
            node = arg$.node, evt = arg$.evt;
            if (!(n = ld$.parent(evt.target, '[data-src]', node))) {
              return;
            }
            src = n.getAttribute('data-src');
            return this$.fire('choose', {
              url: src
            });
          }
        }
      },
      handler: {
        file: {
          list: function(){
            return lc.files || [];
          },
          key: function(it){
            return it._id;
          },
          view: {
            text: {
              size: function(arg$){
                var context;
                context = arg$.context;
              },
              name: function(arg$){
                var context;
                context = arg$.context;
              }
            },
            handler: {
              thumb: function(arg$){
                var node, context;
                node = arg$.node, context = arg$.context;
                if (node._load === context.url) {
                  return;
                }
                node._load = context.url;
                node.style.opacity = 0;
                if (node.nodeName.toLowerCase() === 'img') {
                  node.setAttribute('src', context.url);
                  node.onload = function(){
                    return ld$.find(node.parentNode, 'div[ld=thumb]').map(function(it){
                      return it.style.opacity = 1;
                    });
                  };
                } else {
                  node.style.backgroundImage = "url(" + context.url + ")";
                }
                return node.setAttribute('data-src', context.url);
              }
            }
          }
        }
      }
    });
    this.page = opt.page instanceof ldPage
      ? opt.page
      : new ldPage(opt.page || {});
    this.page.init();
    this.page.on('fetch', function(it){
      var files;
      files = it.map(function(it){
        return it._id = Math.random(), it;
      });
      lc.files = lc.files.concat(files);
      view.render();
      return this$.fire('fetch', files);
    });
    this.page.on('finish', function(){
      return this$.fire('finish');
    });
    this.page.on('empty', function(){
      return this$.fire('empty');
    });
    return this;
  };
  uploadr.viewer.prototype = import$(Object.create(Object.prototype), {
    on: function(n, cb){
      var ref$;
      return ((ref$ = this.evtHandler)[n] || (ref$[n] = [])).push(cb);
    },
    fire: function(n){
      var v, res$, i$, to$, ref$, len$, cb, results$ = [];
      res$ = [];
      for (i$ = 1, to$ = arguments.length; i$ < to$; ++i$) {
        res$.push(arguments[i$]);
      }
      v = res$;
      for (i$ = 0, len$ = (ref$ = this.evtHandler[n] || []).length; i$ < len$; ++i$) {
        cb = ref$[i$];
        results$.push(cb.apply(this, v));
      }
      return results$;
    },
    fetch: function(){
      return this.page.fetch();
    },
    reset: function(){
      this.page.reset();
      this.lc.files = [];
      return this.view.render();
    }
  });
  if (typeof module != 'undefined' && module !== null) {
    return module.exports = uploadr;
  } else if (typeof window != 'undefined' && window !== null) {
    return window.uploadr = uploadr;
  }
});
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}
