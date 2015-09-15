var http = require('http')
var fs = require('fs')

var server = http.createServer(function(req, res){
	var responseBody

	if (/^\/api\/person$/.test(req.url)){
		responseBody = fs.createReadStream('data/person/people.json')
	} else if (/^\/api\/person\/[0-9]+/) {
		id = req.url.match(/[0-9]+$/)
		responseBody = fs.createReadStream('data/person/' + id + '.json')
	}

	if(responseBody){
	    res.writeHead(200, { 'Content-Type': 'application/json' })
	    responseBody.pipe(res)
	} else {
	    res.writeHead(404)
	    res.end('404')
	}
})

server.listen(Number(process.argv[2]))