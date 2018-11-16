var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var cheerio = require("cheerio");
var request = require("request");
var booru=require("booru");
var fs = require("fs");
var mentionurl = undefined
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

var command = "/" //setting this up so it can be changed 
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

function evaluate(arg){
console.log(arg)
//function parenthesis(a){var exp = a.search("(");var esp = a.splice(exp); var exp2 = esp.search(")") if (exp>-1 && exp2 >-1){evaluate(esp.splice(0,exp2))}} //deal with parenthesis bullshit
function parpos1(a){var exp = a.indexOf(")"); if (exp>-1){return exp}}
function parpos2(a){var exp = a.indexOf("("); if (exp>-1){return exp}}
function exponent(a){var exp = a.indexOf("^"); if (exp>-1){return exp}}
 function multiply(a){var exp = a.indexOf('*'); if (exp>-1){return exp}}
function divide(a){var exp = a.indexOf("/"); if (exp>-1){return exp}}
function addition(a){var add = a.indexOf("+"); if (add>-1){return add}}
function subtraction(a){var exp = a.indexOf("-"); if (exp>-1){return exp}} //define locations of known math stuffs
	equation = [exponent(arg), multiply(arg), divide(arg), addition(arg),subtraction(arg), parpos1(arg), parpos2(arg)]
	equation = equation.sort(function(a,b){return a-b}); //sort the table in descending order
	console.log(equation)
	if (equation[1] != undefined)
	{
		return eval(arg)
	}
	else {return "error: surround the equation in parenthesis"}
	//var b = 0; var i; for (i = 1; i < equation.length; i++) {if (equation != undefined && b < equation[i]) { equation[i] = eval(arg.slice(b, equation[i])); b = i; console.log(equation[i])}} // go through the table and evaluate everything
	//var ii; for (ii = 1; ii < equation.length; ii++) {if (ii < equation.length){equation[1] = eval(equation[ii] + equation[ii + 1])}} //add everything up
 //return sum
	console.log(equation[1])
}

function porn(channelID,t, terms){
typee = t.toLowerCase();
imgs = []
var itemsearch = ''
var assetsearch = ''
console.log(terms)
console.log(typee)
//console.log(terms[1])
var urll = ""
var baseurll = ""
if (typee == 'pony') {
baseurll = 'https://derpibooru.org/'
itemsearch = 'div.media-box'
assetsearch = "data-image-id"
console.log(terms[0])
urll = "https://derpibooru.org/search/index?hidden=1&q="+terms[0]
var i; for (i = 1; i<terms.length;i++){
if (i > 0 && terms[i] != "foalcon" && terms[i] != "child" && terms[i] != "" && terms[i] != undefined){
urll = urll+"%2C"+terms[i];}}}
console.log(urll)
//urll = urll+"&random_image=y"
// node C:\DefaultBot\lib\bin\bot.js
if (typee == "anime") {
}
if (typee == "reallife") {
}
if (typee == "r34") {
itemsearch = "div.shm-thumb.thumb"
assetsearch = "href"
urll = "http://rule34.paheal.net/post/list/"+terms[0]
baseurll = "http://rule34.paheal.net/post/"
var i; for (i = 1; i<terms.length;i++){
if (i > 1 && terms[i] != "foalcon" && terms[i] != "child" && terms[i] != "young" && terms[i] != "loli"){
urll = urll+"%20"+terms[i];}}
urll = urll+"/1"}
if (typee == "e621"){
itemsearch = "span.thumb"
assetsearch = "id"
urll = "https://e621.net/post/?tags="+terms[0]
baseurll = "https://e621.net/post/show/"
var i; for (i = 1; i<terms.length;i++){
if (i > 1 && terms[i] != "foalcon" && terms[i] != "child" && terms[i] != "young" && terms[i] != "loli"){
urll = urll+"%20"+terms[i];}}

}
console.log(urll)

function illegalcontent(searcht) //hardcoded bias against illegal content
{
badstuff = ["foalcon", "child","underage","young","filly","colt","loli","jailbait","shota","shotacon","toddler","foal"]
var i; for (i=1;i<badstuff.length;i++){if(searcht.indexOf(badstuff[i])>-1){return true}}
return false
}

var options = {
  url: urll,
  headers: {'DefaultBot': '1.0/ contact jason@jasonoppenheim.com about issues'},}
  console.log(options)
  
 
  

function callback(error, response, body) {
    var $ = cheerio.load(body);
	console.log('error:', error); // Print the error if one occurred
	console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
	var d = 0
	//console.log(nodederpi.Fetch.search().images)
    $(itemsearch).each(function(i, element){
		console.log($(element))
		if (typee=="r34"){
		$("a.shm-thumb-link").each(function(i, element){
		var check = ""+$(element).attr(assetsearch)
		check = check.slice(6,check.length)
		//request(baseurll+check, function (error, response, body){console.log(response); if (body != undefined && body.indexOf(terms[1])>-1){imgs[d] = check}}) //check to make sure the image is what the user searched
		//var thin = ""+$(element).text(assetsearch)
		//if (thin.indexOf(terms[1])>-1){
		var checkterms = ''+$(element).attr("title")
		console.log(checkterms)
		if (checkterms.indexOf(terms[1])>-1 && illegalcontent(checkterms) == false){
		imgs[d] = check //so we have the link, what about embeddable stuff?
		console.log(check)
		d++}
		})}//}
		else
		{
		if (typee == "e621") {
			var checkterms = ''+$(element).attr("title")
		console.log($(element).attr(assetsearch))
		if (checkterms.indexOf(terms[1])>-1 && illegalcontent(checkterms) == false){
		console.log($(element).attr(assetsearch))
		imgs[d] = $(element).attr(assetsearch).substring(1)}}
		//$(element).removeAttr("data-image-id")
			
		else{
	
	var checkterms = ''+$(element).attr("data-image-tag-aliases")
	if (checkterms.indexOf(terms[1])>-1 && illegalcontent(checkterms) == false){
	console.log($(element).attr(assetsearch))
	imgs[d] = $(element).attr(assetsearch)}}}
		//$(element).removeAttr("data-image-id")
		d++;
	  

    })
console.log(imgs)
if (imgs.length > 0){
bot.sendMessage({
to:channelID,
message: baseurll+imgs[Math.floor(Math.random()*imgs.length)] })}else {bot.sendMessage({
to:channelID,
message: "nothing found under those tags" })};
};
request("http://www.derpibooru.org/filters/current?id=37431")
request(options, callback)
}
function parse(str) {
    var args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, function() {
        return args[i++];
    });
} //parses a string with a variable...

function sendmessage(channelID, message){console.log(message); bot.sendMessage({
to:channelID,
message: parse(message) });
}

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with variable command
	function illegalcontent(searcht) //hardcoded bias against illegal content
{
badstuff = ["foalcon", "child","underage","young","filly","colt","loli","jailbait","shota","shotacon","toddler","foal"]
var i; for (i=1;i<badstuff.length;i++){if(searcht.indexOf(badstuff[i])>-1){return true}}
return false
}



function search(channelID,typee,bbooru, stuff, output){
booru.search(bbooru, stuff, {limit: 1, random: true})
		.then(images => {
		//Log the direct link to each image
		//console.log(images)
		for (let image of images) {
			//console.log(bbooru)
			//console.log(stuff)
		console.log(image.common.file_url)
		if(illegalcontent(image.common.file_url)==false || output == true){
		console.log(image.common.file_url)
		if (output == false){
		bot.sendMessage({
		to:channelID,
		message:image.common.file_url})}else{ mentionurl=""+image.common.file_url}}else{searchbooru(channelID,typee,stuff)}
	}
		})
			.catch(err => {
			if (err.name === 'BooruError') {
			//It's a custom error thrown by the package
			console.log(err.message)
			} else {
			//This means I messed up. Whoops.
			console.log(err)
  }
})
}

function mentionpost(typee, user, channelID, booru, stuff) {
	user = user.replace("@","").replace("<","").replace(">", "").toLowerCase().split('#')
	var descrim
	if (user[1] != undefined) {descrim = user[1].replace("#","")}
	var username = user[0]
	console.log(username, descrim, bot.users)
            //fuck it, I'm leaving this the way it is, too lazy for this shit
	var stop = false;
	var u,users; for (u in bot.users){
		console.log(bot.users[u])
		var matchusername = bot.users[u].username.toLowerCase()
		
		var ii; for (ii=0;ii<=matchusername.length; ii++){
			console.log(matchusername.substring(ii,0), username)
		if (matchusername.substring(ii, 0) == username && stop == false ||bot.users[u].id == username && stop == false || bot.users[u].discriminator == descrim && matchusername.substring(ii, 0) == username && stop == false ){
			stop = true
			search(channelID,typee,booru,stuff,true)
			console.log("test "+mentionurl)
			bot.sendMessage({
		to:channelID,
		message: mentionurl+" <@"+bot.users[u].id+">, consider yourself booped!"
			
		})
		break;
		}}
	
		}}
async function searchbooru(channelID,typee,stuff){
	var e = 0
	
	console.log(stuff[0])
	//console.log(stuff[1])
	  const derpi = new booru("derpi")
	  const e621 = new booru("e621")
	  const sb = new booru("safebooru")
	  if (typee =="safe") {
		  console.log(typee)
		  console.log(stuff)
		   search(channelID,typee, "derpi", stuff, false)
	  }
	  if (typee=="pony"){
		 search(channelID,typee, "derpi", [stuff.join(",")], false)
	  }
	  if (typee=="r34"){porn(channelID,typee,stuff)}
	  if (typee=="e621"){
		  search(channelID,typee, "e6", stuff, false)
		  
	}
  };
    if (message.substring(0, 1) == command) {
        var args = message.substring(1).split(' ');
		var searchterms = message.substring(1).replace(args[0], "").replace(args[1], "").replace(":","%3A").substring(2).split(',');
		//var i; for (i=1; i<searchterms.length;i++){searchterms[i].replace(/\s/g, '')}; //pretty much making the tags site-friendly
		
        var cmd = args[0];
       
        args = args.splice(1);
		if (cmd == 'math')
		{
		var question = args[0]  //hardcoded PEMDAS
		//console.log(args[0])
		question = question.replace(/\s/g, ''); //delete spaces
	//question = question.replace("/(/g",' ').replace("/)/g",' ').replace(',',' ').split(' '); //split up the evaluation by parenthesis
	console.log(question)
	question = evaluate(question) //solve
	//var ii; for (ii = 1; ii < question.length; ii++) {if (ii < question.length){question[1] = eval(question[ii] + question[ii + 1])}} //add
	//return question[1] //sum
	 bot.sendMessage({
                    to: channelID,
                    message: question
                });
		}
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
			
			case 'help':
			bot.sendMessage({
				to:channelID,
				message:'visit https://github.com/Epic-Jason/DefaultBot to see all commands'
			});			
            break;
			
			case 'changeprefix':
			if (args[0] != undefined) {
				command = args[0]
				bot.sendMessage({
				to:channelID,
				message:parse("prefix changed!")
			});
			} else {sendmessage(channelID,"no prefix found?, usage: `changeprefix [prefix]`")}
			break;
			
			case 'lewd':
			//console.log(bot.channels)
			if (bot.channels[parse(channelID)].nsfw==true) {
			if (args[0] != undefined) {
				console.log(args[1])
				searchbooru(channelID, args[0], searchterms)
			}
			else {sendmessage(channelID, "`usage: `lewd pony/r34/e621 [search,terms,seperated,by,commas]`. Pony searches derpibooru, r34 searches rule34, etc ")}}
			break;
			
			case 'boop':
			if (args[0]!=undefined){
				console.log("f")
				mentionpost("safe",args[0],channelID,"derpi",["safe,boop"])
				
			} else{console.log("g") 
			searchterms = ["safe,boop"]
			searchbooru(channelID, "safe", searchterms)}
			break;
			
			case 'art':
			if (args[0] !=undefined){
				searchbooru(channelID, "safe", searchterms)
			}
			
		}
     }
});