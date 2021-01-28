<-(->it!) _

lc = {files: []}

providers = do
  native: host: \native, route: \/d/uploadr
  imgbb: host: \imgbb, key: "97902907ac92c25e4c54b8d0b4c6eeac"

up = new uploadr do
  root: '[ld-scope=uploadr]'
  provider: providers.native

up.on \upload.done, ->
  lc.files ++= it
  ldcv.uploadr.toggle false
  view.render!

ldcv = {}
view = new ldView do
  root: document.body
  init: "ldcv-uploadr": ({node}) -> ldcv.uploadr = new ldCover root: node
  action: click:
    "toggle-uploader": -> ldcv.uploadr.toggle!

view = new ldView do
  root: '[ld-scope=viewer]'
  handler: do
    photo: do
      list: -> lc.files or []
      handle: ({node, data}) ->
        node.style.backgroundImage = "url(#{data.url})"

count = 0
viewer = new uploadr.viewer do
  root: '[ld-scope=image-viewer]'
  page: 
    host: window
    fetch-on-scroll: true
    limit: 9
    boundary: 100
    fetch: -> new Promise (res, rej) ->
      res [1,2,3,4,5,6,7,8,9].map ->
        {url: "/assets/img/sample/#{it}.jpg"}
viewer.page.fetch!

