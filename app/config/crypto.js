//reference : http://lollyrock.com/articles/nodejs-encryption/
//encrypt and decrypt mysql data

var crypto = require('crypto');



function Crypt() {
	var algorithm = 'aes-256-ctr';
	var password = 'live4ever';
	
	
	this.encrypt = function(text) {
	  var cipher = crypto.createCipher(algorithm,convertCryptKey(password));
	  var crypted = cipher.update(text,'utf8','hex');
	  crypted += cipher.final('hex');
	  return crypted;
	}
	 
	this.decrypt = function(text){
	  var decipher = crypto.createDecipher(algorithm,convertCryptKey(password))
	  try{
		  var dec = decipher.update(text,'hex','utf8')
		  dec += decipher.final('utf8');
		  return dec;
	  }catch(ex){
		  
		  console.log(' decrypt failed'); 
	  }
	 
	}
	
	function convertCryptKey(strKey) {
	    var newKey = new Buffer([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
	    strKey = new Buffer(strKey);
	    for(var i=0;i<strKey.length;i++) newKey[i%16]^=strKey[i];
	    return newKey;
	}
	
}//Crypto

module.exports = new Crypt();