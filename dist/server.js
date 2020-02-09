// Generated by LiveScript 1.3.1
var fs, fsExtra, path, crypto, imgtype, uploadr;
fs = require('fs');
fsExtra = require('fs-extra');
path = require('path');
crypto = require('crypto');
imgtype = require('imgtype');
uploadr = function(opt){
  var folder, rooturl, archive, route;
  opt == null && (opt = {});
  folder = opt.folder || 'uploads';
  rooturl = opt.url || folder;
  archive = function(obj){
    var p;
    obj == null && (obj = {});
    p = new Promise(function(res, rej){
      var name, promise;
      name = obj.name || '';
      promise = obj.buf
        ? Promise.resolve(obj.buf)
        : new Promise(function(res, rej){
          return fs.readFile(obj.path, function(e, buf){
            if (e) {
              return rej(e);
            } else {
              return res(buf);
            }
          });
        });
      return promise.then(function(buf){
        var md5, t1, t2, dir;
        md5 = crypto.createHash('md5').update(buf).digest('hex');
        t1 = md5.substring(0, 3);
        t2 = md5.substring(3, 6);
        dir = path.join(folder, t1, t2);
        return imgtype(buf).then(function(arg$){
          var ext, des, url, ref$;
          ext = arg$.ext;
          des = path.join(dir, md5);
          url = path.join(rooturl, t1, t2, md5);
          if (ext) {
            ref$ = [des + "." + ext, url + "." + ext], des = ref$[0], url = ref$[1];
          }
          return fs.exists(des, function(it){
            if (it) {
              res({
                url: url,
                name: name,
                id: md5
              });
            }
            return fsExtra.ensureDir(dir, function(e, b){
              if (e) {
                return res({
                  name: name
                });
              }
              return fs.writeFile(des, buf, function(e, b){
                if (e) {
                  return res({
                    name: name
                  });
                }
                return res({
                  url: url,
                  name: name,
                  id: md5
                });
              });
            });
          });
        });
      })['catch'](function(){
        return res({
          name: name
        });
      });
    });
    return p.then(function(ret){
      return (opt.adopt
        ? opt.adopt(ret)
        : Promise.resolve()).then(function(){
        return ret;
      });
    });
  };
  route = function(req, res){
    var files;
    files = req.files.file;
    files = !files
      ? []
      : Array.isArray(files)
        ? files
        : [files];
    return Promise.all(files.map(archive)).then(function(it){
      return res.send(it);
    })['catch'](function(it){
      console.log(it);
      return res.status(500).send();
    });
  };
  return {
    route: route,
    archive: archive
  };
};
module.exports = uploadr;
