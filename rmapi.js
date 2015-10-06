var http = require('http')
var fs = require('fs')
var url = require('url')

var server = http.createServer(function(req, res) {
	var responseBody

	switch (req.method ){

		// for preflight request
		case "OPTIONS" :
			// CORS headers
		    res.writeHead(200, {
			    "Access-Control-Allow-Origin" : req.headers.origin	,
			    "Access-Control-Allow-Methods" : "GET, POST, PUT, OPTIONS",
			    "Access-Control-Allow-Headers" : "X-Custom-Header, content-type",
			    "Content-Type": "application/json"
	    	})
	    	responseBody = '{"message" : "Success!"}'
			break

		// for resource list and individual resources
		case "GET" :
			// CORS headers
		    res.writeHead(200, {
		    	'Access-Control-Allow-Origin' : req.headers.origin,
		    	'Content-Type': 'application/json'
	    	})
	    	//resource list
			if (/^\/api\/person$/.test(req.url)){
				responseBody = fs.createReadStream('data/person/people.json')
			// resource
			} else if (/^\/api\/person\/[0-9]+/.test(req.url)) {
				id = req.url.match(/[0-9]+$/)
				responseBody = fs.createReadStream('data/person/' + id + '.json')
			}
			break

		// new resource instance
		case "POST" :
			// CORS headers
		    res.writeHead(200, {
		    	'Access-Control-Allow-Origin' : req.headers.origin,
		    	'Content-Type': 'application/json'
	    	})
	    	//grabs the query params
	    	query = url.parse(req.url, true).query
	    	responseBody = 	'{"id" : 666, "firstname" : "' + query.firstname + '", "lastname" : "' + query.lastname + '", "description" : "' + query.description + '"}'
			break

		//update resource instance
		case "PUT" :
			// CORS headers
		    res.writeHead(200, {
		    	'Access-Control-Allow-Origin' : req.headers.origin,
		    	'Content-Type': 'application/json'
	    	})
	    	// could have used the url module, but regex non capture group is so fun!
			id = req.url.match(/([0-9]+)(?:\?)/)[1]
			// grab the query params
	    	query = url.parse(req.url, true).query
	    	responseBody = 	'{"id" : ' + id + ', "firstname" : "' + query.firstname + '", "lastname" : "' + query.lastname + '", "description" : "' + query.description + '"}'
			break
	}

	// flush output
	// for matched requests
	if(responseBody){
		// for string types
		if (typeof responseBody == 'string'){
	    	res.end(responseBody)
    	// for stream types
		} else {
		    responseBody.pipe(res)
		}
	// for unmathced requests
	} else {
	    res.writeHead(404, {'Access-Control-Allow-Origin' : req.headers.origin})
	    res.end('404')
	}
})

server.listen(Number(process.argv[2]))