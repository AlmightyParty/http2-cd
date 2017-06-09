const https = require('https') // 若为http2则把'https'模块改为'spdy'模块
const url = require('url')
const spdy=require('spdy');
const http2=require('http2')//这个是绝对不可以用的密钥的问题
// var sts = require('strict-transport-security');
const fs = require('fs')
const express = require('express')//express https spdy
const path = require('path')
const app = express()
//两种不同的方式
// var globalSTS = sts.getSTS({"max-age":{days:30}});
// var localSTS = sts.getSTS({"max-age":{days:10, includeSubDomains:true}});
// app.use(globalSTS)
const options = {
	key: fs.readFileSync(`${__dirname}/server.pass.key`),
	cert: fs.readFileSync(`${__dirname}/server.crt`),
	NPNProtocols: ['h2', 'http 1.1', 'http 1.0'],
	passphrase: '1234'
};
const allow = (res) => {
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Headers", "X-Requested-With")
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")
	// res.header('Strict-Transport-Security', 'max-age=15552000')
	// res.setHeader('Strict-Transport-Security', 'max-age=15552000;')
}

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'static')))
app.get('/', (req, res) => {
	allow(res)
	var data = fs.readFileSync(`${__dirname}/request.js`);
	console.log("同步读取: " + data.toString());
	res.end(data.toString())
})
// app.get('/option/?',localSTS, (req, res) => {
	app.get('/option/?', (req, res) => {
	allow(res)
	let size = req.query['size']
	let delay = req.query['delay']
	let buf = new Buffer(size * 1024 * 1024)
	setTimeout(() => {
		res.send(buf.toString('utf8'))
	}, delay)
})
	//测试hsps
// http.createServer(options, app).listen(7777, (err) => { 
https.createServer(options, app).listen(9991, (err) => { // http2服务器端口为1002
	if (err) throw new Error(err)
	console.log('Http1.x server listening on port 9991.')
})  