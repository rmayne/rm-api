var http = require('http')
var fs = require('fs')

var server = http.createServer(function(req, res){
	var responseBody

	if (/^\/api\/person$/.test(req.url)){
		responseBody = fs.createReadStream('data/person/people.json')
	} else if (/^\/api\/person\/[0-9]+/.test(req.url)) {
		id = req.url.match(/[0-9]+$/)
		responseBody = fs.createReadStream('data/person/' + id + '.json')
	}

	if(responseBody){
		// CORS header included
	    res.writeHead(200, {'Access-Control-Allow-Origin' : '*', 'Content-Type': 'application/json'
	    	})

	    responseBody.pipe(res)
	} else {
	    res.writeHead(404, {'Access-Control-Allow-Origin' : '*'})
	    res.end('404')
	}
})

server.listen(Number(process.argv[2]))