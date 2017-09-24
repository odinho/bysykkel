const http = require('http')
const fs = require('fs')

const PORT = 8888

urls = {
  '/': {fn: 'dist/index.html'},
}
http.createServer((req, res) => {
  let u = urls[req.url]
  if (!u || !u.fn)
    u = Object.assign({}, u, {fn: 'dist/' + req.url})
  fs.readFile(u.fn, (err, file) => {
    if (err) {
      if (err.code=='ENOENT') {
        console.log(req.method, req.url, '-> 404')
        res.writeHead(404)
        res.write('not found')
      } else {
        console.log(req.method, req.url, '-> 500')
        console.error(err)
        res.writeHead(500)
        res.write(''+err);
      }
      return void res.end()
    }
    console.log(req.method, req.url, '-> 200')
    res.writeHead(200, {'Content-Type': u.mime||'text/html'})
    res.write(file)
    return res.end()
  })
  return
}).listen(PORT)
console.log(`Running at http://localhost:${PORT}`)
