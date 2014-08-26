//########################################################################
//#                       Simple Logger Script                           #
//#----------------------------------------------------------------------#
//# Ahthor : Kyoungil Lee / leekyoungil@gmail.com                        #
//# blog : http://blog.leekyoungil.com                                   #
//# github : https://github.com/LeeKyoungIl                              #
//########################################################################

// debug
var loggerDebugMode = false;

// external server
var externalServer = false;
var externalAddress = null;

//page loading speed check
var beforeload = (new Date()).getTime();

//sLogger Object init
if (typeof sLogger == 'undefined') {
	sLogger = {};
}

//###################################################################
//##                         Util collection                       ##
//###################################################################
sLogger.utils = {
	// String validation check
	stringCheck : function (obj) {
		try {
			if (obj == null || obj.length == 0 || obj == "undefined") {
				return false;
			}
		} catch (e) {
			sLogger.ajaxModule.errorLog("function error", 28, "String check error");
			return false;
		}
		
		return true;
	},
	
	// Locale Date and Time output
	getDateTime : function () {
		var nowDate = new Date();

		return nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate() + " " + nowDate.getHours() + ":" + nowDate.getMinutes() + ":" + nowDate.getSeconds();
	},
	
	// String encoding
	escapeStr : function (strData) {
		var str = null;
	    var bEncURI = "N";
	    
	    eval("try{bEncURI=unescape(encodeURIComponent('Y'));}catch(_e){ }");

	    if (bEncURI == "Y") {
	    	str = unescape(encodeURIComponent(strData));
	    }
	    else {
	    	str = escape(strData);
	    }
	    
	    str = str.split("+").join("%2B");
	    str = str.split("/").join("%2F");
	    str = str.split("&").join("%26");
	    str = str.split("?").join("%3F");
	    str = str.split(":").join("%3A");
	    str = str.split("#").join("%23");
	    
	    return str;
	}, 
	
	// like inArray function (PHP)
	includeArrayData : function (arrayData, checkStr) {
		for (var i = 0; i < arrayData.length; i++) {
			if (checkStr == arrayData[i]) {
				return true;
			}
		}
		
		return false;
	},
	
	// Object validation
	checkObjectLength : function (objData) {
		if (objData == null || objData == "undefined") {
			return false;
		}
		
		var count = 0;

		for (i in objData) {
			if (objData.hasOwnProperty(i)) {
				count++;
			}
		}
		
		return (count == 0) ? false : count;
	},
	
	// page loading time check
	pageLoadTimeCheck : function () {
		var afterload = (new Date()).getTime();
        return (afterload-beforeload)/1000;
	},
	
	// base64 encode
	encordBase64 : function (input, bDataInt, bDataFloat) {
		input = bDataInt+beforeload+input+bDataFloat;
		var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        
        input = this.encordUtf8(input);
        
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
        }
        return output;
	},
	
	// utf8 encode
	encordUtf8 : function (string) {
		string = string.replace(/\r\n/g, "\n");
		
        var utftext = "";
        
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
	},
	
	// make random string
	makeRandomWord : function () {
		var su = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'a', ',b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j');
		
		var returnWord = "";
		var loop = Math.floor(Math.random()*10);
		
		if (loop == 0) { 
			loop = 1; 
		}
		
		for (var i=0; i<loop; i++) {
			var landom = Math.floor(Math.random()*20);
			returnWord += su[landom];
		}
		
		return returnWord;
	}, 
	
	// create UUID
	createUUID : function () {
		// http://www.ietf.org/rfc/rfc4122.txt
	    var s = [];
	    var hexDigits = "0123456789abcdef";
	    for (var i = 0; i < 36; i++) {
	        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	    }
	    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
	    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01

	    var uuid = s.join("");
	    return "U"+uuid+Math.round((new Date()).getTime() / 1000);
	},
	
	// set cookie
	setCookie : function (cookieName, cookieValue, expireMin) {
		var date = new Date();
		date.setTime(date.getTime()+((expireMin*60)*1000));
		var expires = "; expires="+date.toGMTString();

		document.cookie = cookieName + "=" + escape(cookieValue)+"; path=/" + expires + ";";
		
		return cookieValue;
	},
	
	// get cookie
	getCookie : function (cookieName) {
		var search = cookieName + "=";
		var cookie = document.cookie;
		var returnData = "";
		
		if(cookie.length > 0) {
			startIndex = cookie.indexOf(search);
			
			if(startIndex != -1) {
				startIndex += cookieName.length;
				endIndex = cookie.indexOf( ";", startIndex );
			
				if(endIndex == -1) {
					endIndex = cookie.length;
				}
				
				returnData = unescape(cookie.substring(startIndex + 1, endIndex));
		    }
		    else {
		    	returnData =  "";
		    }
		}
		else {
			returnData = "";
		}
		
		if (returnData == "") {
			returnData = this.createUUID();
		}
		
		var cookieExpireTime = 30;
		
		switch (cookieName) {
			case 'UUID':
			case 'SOT_SID':
				cookieExpireTime = 30;
				break;
				
			case 'SOT_UID':
				cookieExpireTime = 99999999;
				break;
		}
		
		returnData = this.setCookie(cookieName, returnData, cookieExpireTime);
		
		return returnData;
	}
};

//###################################################################
//##                      Ajax module                              ##
//###################################################################
var xmlHttp = null;
var xmlHttpObjType = null;
var xmlHttpTimeoutChacker = false;
var ajaxSendCheck = true;
var ajaxTimeoutSec = 5000;
var errorLog = [];
var clickLink = null;
var clickTag = null;

sLogger.ajaxModule = {
		executeId : null,
		xmlHttp : null,
		sendUrl : null,
		sendType : null,
		queryString : null, 
		characterSet : null,
		contentType : "application/x-www-form-urlencoded; charset=",
		
		// error log
		errorLog : function (actionType, line, message) {
			errorLog[errorLog.length] = "["+sLogger.utils.getDateTime()+"] actionType=" + actionType + " | Line=" + line + " | message=" + message;
		},
		
		// error debug
		errorDebug : function () {
			if (loggerDebugMode) {
				var errorLogData = "["+sLogger.utils.getDateTime()+"] Ajax are no errors.";
				
				if (errorLog.length > 0) {
					errorLogData = errorLog.join("<br>");
				}
				
				var newDIV = document.createElement("div"); 
				document.body.appendChild(newDIV);
				newDIV.innerHTML = "-- Ajax Error Debug--<br><b><br>" + errorLogData + "</b>";
				newDIV.style.border = "2px solid red";
			}
		},
		
		// status check
		checkStatus : function () {
			if (xmlHttp == null || !sLogger.utils.stringCheck(this.sendUrl)) {
				return false;
			}
			
			return true;
		},
		
		// init
		init : function (sendUrl, sendType, characterSet, queryString) {
			if (queryString.indexOf('#') != -1) {
				queryString = queryString.replace(/#/gi, '*tspc*Hst*');
			}
			
			// set basic method type
			if (!sLogger.utils.stringCheck(sendType)) {
				this.sendType = "POST";
			}
			
			this.sendType = sendType;
			
			// set characterset (basic is UTF-8)
			if (!sLogger.utils.stringCheck(characterSet)) {
				this.characterSet = "UTF-8";
			}
			
			this.contentType += this.characterSet;
			
			// sendUrl is required
			if (!sLogger.utils.stringCheck(sendUrl)) {
				this.errorLog("variable error", 321, "Ajax sendUrl is Essential value.");
				this.errorDebug();
				return false;
			} else {
                // if the external logServer.
                if (externalServer) {
                    // protocol check
                    if (!(new RegExp(/^http/)).test(sendUrl)) {
                        this.errorLog("url error", 330, "must using http or https protocols.");
                        this.errorDebug();
                        return false;
                    }

                    // Essential domain check
                    if (externalAddress == null || !(new RegExp(eval('/'+externalAddress+'/'))).test(sendUrl)) {
                        this.errorLog("url error", 337, "check the domain.");
                        this.errorDebug();
                        return false;
                    }
                }
				
				this.sendUrl = sendUrl;
			}
			
			// querystring validation
			if (!sLogger.utils.stringCheck(queryString)) {
				this.errorLog("quertStringError", 348, "check the querystring.");
				this.ajaxModule.errorDebug();
				return false;
			} else {
				this.queryString = queryString;
			}
			
			// xmlHttp Object init
			this.createXmlHttpObj();
			
			if (!xmlHttp) {
				return false;
			}
			
			return this;
		},

        // IE browser check
		checkIEBrowser : function (vCheck) {
			if(navigator.appName.toLowerCase() == "microsoft internet explorer") {
                var tmpAppVersion = navigator.appVersion.toLowerCase();
				
				var pos = tmpAppVersion.indexOf("msie");
				var ver = tmpAppVersion.substr(pos,8);
				
				if (vCheck == null || vCheck == 'undefined') {
					return true;
				} else {
					if (sLogger.utils.includeArrayData(vCheck, ver)) {
						return true;
					} else {
						return false;
					}
				}
			}
			
			return false;
		},
		
		// xmlHttp Object generation
		createXmlHttpObj : function () {
			xmlHttp = null;
			
			if (window.XMLHttpRequest) {
				xmlHttp = new XMLHttpRequest();
				xmlHttpObjType = 'XML';
			} else { 
				xmlHttpObjType = 'ActiveX';
				try {
					xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
		        } catch (e) {
		            try {
		            	xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
		            } catch (e) {
		            	xmlHttp = null;

		            	// your browser does not support Ajax
						this.errorLog("ajax Object error", 406, "your browser does not support Ajax.");
						this.errorDebug();
						return false;
		            }
		        }
			}
			
			if (typeof XDomainRequest != "undefined" && ajaxSendCheck){
				xmlHttp = new XDomainRequest();
				xmlHttpObjType = 'XDomain';
			}
		},
		
		// Ajax send start
		send : function () {
			// IE 6, 7 does not support cross-domain request. because of send POST method using hidden iframe.
			var msieVersion = new Array('msie 6.0', 'msie 7.0');
			
			if (this.checkIEBrowser(msieVersion) == true || !sLogger.utils.stringCheck(this.queryString)) {
				var newDiv = document.createElement("div");
				var tmpQuery = this.queryString.split('&');

				var html = [];
				html[html.length] = '<iframe src="" name="hiddenFrame_IE67" width=0 height=0 style="display:none;"></iframe>';
				html[html.length] = '<form name="IE67_Loggerr" method="POST" action="'+this.sendUrl+'">';

				for (var i=0; i<tmpQuery.length; i++) {
					var tmpData = tmpQuery[i].split('=');
					html[html.length] = '<input type="hidden" name="'+tmpData[0]+'" value="'+tmpData[1]+'" />';
				}

				html[html.length] = '</form>';

				newDiv.display = 'none';
				newDiv.innerHTML = html.join('');
				
				if(document.body != null) { 
					document.body.appendChild(newDiv); 
				} else {
					document.getElementsByTagName('body')[0].appendChild(newDiv);
				}

				document.IE67_Loggerr.target = "hiddenFrame_IE67";
				document.IE67_Loggerr.submit();

				var start = new Date().getTime();
			    while (new Date().getTime() < start + 500);
				
				if (!ajaxSendCheck) {
					var startA = new Date().getTime();
				    while (new Date().getTime() < startA + 1000);
					
				    document.body.removeChild(newDiv);
				    sLogger.logData.executeAjax(false);
				    
				    if (clickLink) {
						document.location.href = clickLink;
					}
				    
					return true;
				}
				
				sLogger.logData.executeAjax(false);
				document.body.removeChild(newDiv);
				
				if (clickLink) {
					location.href = clickLink;
				}
			} else {
				//xmlHttp Object check and querystring check
				if (!this.checkStatus() || !sLogger.utils.stringCheck(this.queryString)) {
					this.errorLog("ajax Object error or querystring error", 477, "ajax object (xmlHttp) is null or querystring validation has failed.");
					this.errorDebug();
					
					return sLogger.logData.executeAjax(false);
				}
				
				xmlHttpTimeoutChacker = true;

				if (xmlHttpObjType == 'XDomain') {
					xmlHttp.onerror = this.error;
					xmlHttp.ontimeout = this.timeout;
					xmlHttp.onload = this.handleStateChange;
					xmlHttp.timeout = ajaxTimeoutSec;
					xmlHttp.open(this.sendType, this.sendUrl+'?'+this.queryString);
					xmlHttp.send();
				} else {
					xmlHttp.open(this.sendType, this.sendUrl, ajaxSendCheck);
					
					if (ajaxSendCheck) {
						xmlHttp.onreadystatechange = this.handleStateChange;
					}
					
					xmlHttp.setRequestHeader("Content-Type", this.contentType);
					xmlHttp.withCredentials = true;
					xmlHttp.send(this.queryString);
					
					// basic timeout check (tree second)
					if (ajaxSendCheck) {
						setTimeout(function() {
							xmlHttp.abort();
							
							if (xmlHttpTimeoutChacker) {
								sLogger.ajaxModule.errorLog("ajax target server timeout", 509, "target server has timeout to connect. please check target server.");
								sLogger.ajaxModule.errorDebug();
							}
							
							executeQueue.splice(0, 1);
							sLogger.logData.executeAjax(false);
						}, ajaxTimeoutSec);
					}
				}
				
				if (!ajaxSendCheck) {
					return this.handleStateChange();
				}
			}
		},

        // ajax error handling
		error : function () {
			xmlHttp.abort();
			
			if (xmlHttpTimeoutChacker) {
				sLogger.ajaxModule.errorLog("ajax target server timeout", 529, "target server has timeout to connect. please check target server.");
				sLogger.ajaxModule.errorDebug();
				
				if (clickLink) {
					location.href = clickLink;
				}
				
				executeQueue.splice(0, 1);
				sLogger.logData.executeAjax(false);
			}
		},

        // ajax timeout handling
		timeout : function () {
			xmlHttp.abort();
			
			if (xmlHttpTimeoutChacker) {
				sLogger.ajaxModule.errorLog("ajax target server timeout", 545, "target server has timeout to connect. please check target server.");
				sLogger.ajaxModule.errorDebug();
				
				if (clickLink) {
					location.href = clickLink;
				}
			}
			
			executeQueue.splice(0, 1);
			
			return sLogger.logData.executeAjax(false);
		},
		
		// ajax result handling
		handleStateChange : function () {
			/*
			 * 0 : open()
			 * 1 : loading..
			 * 2 : loading completed
			 * 3 : server processing
			 * 4 : Server processing is completed
			 */
			
			if (xmlHttpObjType == 'XDomain') {
				xmlHttp.readyState = 4;
				xmlHttp.status = 200;
			}
			
			if (!ajaxSendCheck) {
				xmlHttp.readyState = 4;
			}
			
			switch (xmlHttp.readyState) {
				case 0 :
					break;
				case 1 :
					break;
				case 2 : 
					break;
				case 3 : 
					break;
				case 4 :
					/*
					 * 200 : processing is completed
					 * 403 : forbidden
					 * 404 : not found error
					 * 500 : internal server error
					 */
					switch (xmlHttp.status) {
						case 200 :
							xmlHttpTimeoutChacker = false;
							sLogger.ajaxModule.errorLog("ajax completed", 598, "processing is completed");
							sLogger.ajaxModule.errorDebug();
							
							return sLogger.logData.executeAjax(false);
							break;
						case 403 : 
							sLogger.ajaxModule.errorLog("ajax forbidden error", 604, "forbidden");
							sLogger.ajaxModule.errorDebug();
							
							return sLogger.logData.executeAjax(false);
							break;
						case 404 : 
							sLogger.ajaxModule.errorLog("ajax not found error", 610, "not found error");
							sLogger.ajaxModule.errorDebug();
							
							return sLogger.logData.executeAjax(false);
							break;
						case 500 :
							sLogger.ajaxModule.errorLog("ajax internal server error", 616, "internal server error");
							sLogger.ajaxModule.errorDebug();
							
							return sLogger.logData.executeAjax(false);
							break;
					}
					break;
					
					if (clickLink) {
						location.href = clickLink;
					}
			}
			
			return false;
		}
		
};

var executeQueue = [];
var nowExecute = false;

//###################################################################
//##                     Log data generation                       ##
//################################################################### 
sLogger.logData = {
	documentAllCheck : (document.all) ? true : false,
	windowScreenCheck : (window.screen) ? true : false,
			
	addQueue : function (ajaxObj) {
		executeQueue[executeQueue.length] = ajaxObj;
	},

	removeQueue : function () {
		var executeObj = executeQueue[0];

		executeQueue.splice(0, 1);
		executeObj.send();
	},
	
	executeAjax : function (exeValue) {
		if (!exeValue && executeQueue.length == 0) {
			return true;
		} else if (exeValue && executeQueue.length > 0) {
			nowExecute = true;
			
			return this.removeQueue();
		}
	},
	
	/*
	 * init
	 * callType : url (ex test.jsp)
	 * inputData : must using key and value map
	 */
	init : function (logServer, callType, inputData) {
		// page loading time check
		inputData['pageExecuteTime'] = sLogger.utils.pageLoadTimeCheck();
		
		// basic log data generation
		var sendLogData = this.setBasicLogData(callType, inputData);
		
		if (sendLogData == false || sendLogData.length == 0) {
			sLogger.ajaxModule.errorLog("log data error", 690, "log data was not generated.");
			sLogger.ajaxModule.errorDebug();
			return false;
		}
		
		if (!sLogger.utils.stringCheck(document.location.protocol)) {
			document.location.protocol = "http";
		}

        var protocolData = (externalServer) ? (document.location.protocol.indexOf("https") != -1 ? "https://" : "http://") + logServer : '';

		// Ajax add queue
		this.addQueue(sLogger.ajaxModule.init(protocolData + "/" + callType, "POST", "UTF-8", sendLogData.join("&")));
		
		return this.executeAjax(true);
	},		
	
	// error debug
	errorDebug : function () {
		sLogger.ajaxModule.errorDebug();
	},
	
	// generation log data (basic required)
	setBasicLogData : function (callType, inputData) {
        var pageName = (document.getElementsByTagName("title")[0] != undefined) ? document.getElementsByTagName("title")[0].outerHTML.replace(/<title>/gi, "").replace(/<\/title>/gi, "") : '';
        var prePageAddr = document.referrer;
        var tDocRef = "";

        eval("try{ tDocRef=top.document.referrer; }catch(_e){}");

        var tDocUrl = "";

        eval("try{ tDocUrl=top.document.location.href; }catch(_e){}");

        if (prePageAddr == tDocUrl) {
            prePageAddr = tDocRef;
        }

        if (prePageAddr == "undefined") {
            prePageAddr = "";
        }

        var curPageAddr = window.location.toString();

        if (curPageAddr.substr(0, 4) == "file") {
            sLogger.ajaxModule.errorLog("url protocol error", 752, "not supported file protocol.");
            sLogger.ajaxModule.errorDebug();
            return false;
        }

        inputData['prePageAddr'] = prePageAddr;
        inputData['pageName'] = pageName;
        inputData['curPageAddr'] = curPageAddr;
		inputData['beforeload'] = beforeload;

        // set screen size
		try {
			inputData['scwResolution'] = window.screen.availWidth;
			inputData['schResolution'] = window.screen.availHeight;
		} catch (e) { 
			inputData['scwResolution'] = 0;
			inputData['schResolution'] = 0;
		}

        // set browser size
		try {
			inputData['bwwResolution'] = document.body.clientWidth;
			inputData['bwhResolution'] = document.body.clientHeight;
		} catch (e) { 
			inputData['bwwResolution'] = 0;
			inputData['bwhResolution'] = 0;
		}
		
		return this.setExtendLogData(callType, inputData);
		
	},
	
	// generation extend log data
	setExtendLogData : function (callType, inputData) {
        var sendParms = Object.keys(inputData);

		var returnParams = [];
		
		// Korean check
		var korCheck = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

		for (var i = 0; i < sendParms.length; i++) {
			if (sLogger.utils.stringCheck(inputData[sendParms[i]])) {
				// url encoding if it is included korean or ampersand in the params
				if ((new RegExp(korCheck)).test(inputData[sendParms[i]]) || inputData[sendParms[i]].toString().indexOf('&') != -1) {
					inputData[sendParms[i]] = encodeURIComponent(inputData[sendParms[i]]);
				}
				
				returnParams[returnParams.length] = sendParms[i] + "=" + inputData[sendParms[i]];
			}
		}

		return returnParams;
	}
};

var clickLogEvent = false;

// simpleLogger interface
function simpleLogger () {
	this.logUrl = null;
	this.util = sLogger.utils;
	this.ajax = sLogger.ajaxModule;
	this.log = sLogger.logData;
	this.result = false;

	this.logData = [];

    this.setExternalServer = function (v) {
        externalServer = v;
    }

    this.setLogServer = function (v) {
        externalAddress = v;
    };

	this.setLogUrl = function (v) {
		this.logUrl = v;
	};

	this.setLog = function (k, v) {
		this.logData[k] = v;
	};

	this.getLog = function (k) {
		return this.logData[k];
	};

	this.setIsAsync = function (v) {
		ajaxSendCheck = v;
	};

	this.setTimeout = function (v) {
		ajaxTimeoutSec = (v * 1000);
	};

	this.clickLog = function (linkObj, v) {
        if (this.logUrl == null || this.logUrl == 'undefined') {
            return false;
        }

        if (externalServer && (externalAddress == null || externalAddress == 'undefined')) {
            return false;
        }

		clickLogEvent = true;

		clickLink = null;

		try {
			clickLink = linkObj.getAttribute("href");
		} catch (e) {
			clickLink = null;
		}

		if (!sLogger.utils.stringCheck(clickLink)) {
			clickLink = null;
			ajaxTimeoutSec = 5000;
		} else {
			ajaxTimeoutSec = 1000;
		}

		this.setLog('clickLog', v);

		var result = this.log.init(externalAddress, this.logUrl, this.logData);

		clickLogEvent = false;

		return result;
	};

	this.eventClickLog = function () {
        if (this.logUrl == null || this.logUrl == 'undefined') {
            return true;
        }

        if (externalServer && (externalAddress == null || externalAddress == 'undefined')) {
            return true;
        }

		var evt = event || window.event;
		var targ = evt.target || evt.srcElement;

		if (!targ.getAttribute || !targ.getAttribute("slId") || !sLogger.utils.stringCheck(targ.getAttribute("slId")) || clickLogEvent) {
			return true;
		}

		if (evt.preventDefault) {
			evt.preventDefault();
		} else {
			evt.returnValue = false;
		}

		clickTag = null;

		try {
			clickTag = targ.tagName;
		} catch (e) {
			clickTag = null;
		}

		clickLink = null;

		if (clickTag == 'a') {
			try {
				clickLink = targ.getAttribute("href");
			} catch (e) {
				clickLink = null;
			}
		}

		clickTag = null;

		if (!sLogger.utils.stringCheck(clickLink)) {
			clickLink = null;
			ajaxTimeoutSec = 5000;
		} else {
			ajaxTimeoutSec = 1000;
		}

		var innerSimpleLogger = null;

		if (typeof simpleLogger === 'undefined') {
			try {
				innerSimpleLogger = new simpleLogger();
			} catch (e) {
				return false;
			}
		} else {
			if (simpleLogger == null || simpleLogger == 'undefined') {
				try {
					innerSimpleLogger = new simpleLogger();
				} catch (e) {
					return false;
				}
			} else {
				innerSimpleLogger = simpleLogger;
			}
		}

        innerSimpleLogger.setLog('clickLog', targ.getAttribute("slId"));
        innerSimpleLogger.log.init(externalAddress, innerSimpleLogger.logUrl, innerSimpleLogger.logData);
		
		var startS = new Date().getTime();
		var msie6Version = new Array('msie 6.0');
		
		var waitTime = 0.3;
		
		if (sLogger.ajaxModule.checkIEBrowser(msie6Version) == true) {
			waitTime = 0.5;
		}
				
	    while (new Date().getTime() < startS + (waitTime * 1000));
	
		if (clickLink && clickLink != 'null' && clickLink != 'undefined') {
			var targetType = null;
			
			try {
				targetType = targ.getAttribute("target");
			} catch (e) {
				targetType = null;
			}

			if (targetType == null) {
				location.href = clickLink;
			} 
		}
		
		targ.focus();
	};
	
	this.call = function (slpt) {
        if (this.logUrl == null || this.logUrl == 'undefined') {
            return false;
        }

        if (externalServer && (externalAddress == null || externalAddress == 'undefined')) {
            return false;
        }

		clickLink = null;
		var sleepCheck = false;
		
		if (sLogger.utils.stringCheck(slpt)) {
			sleepCheck = true;
			ajaxTimeoutSec = (slpt * 1000) + 1000;
		}
		
		this.result = this.log.init(externalAddress, this.logUrl, this.logData);
		
		if (sleepCheck) {
			var startS = new Date().getTime();
		    while (new Date().getTime() < startS + (slpt * 1000));
		}
		
		return this.result;
	};
	
	this.setDebugMode = function(debugAct) {
		loggerDebugMode = debugAct;
	};
	
	if (window.addEventListener) {             
		window.addEventListener('mousedown', this.eventClickLog, false);
    } else if (document.attachEvent) {
    	document.attachEvent('onmousedown', this.eventClickLog);
    }
}