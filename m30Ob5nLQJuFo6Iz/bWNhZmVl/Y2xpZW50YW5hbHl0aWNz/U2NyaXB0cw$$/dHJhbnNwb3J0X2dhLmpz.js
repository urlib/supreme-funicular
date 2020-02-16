/*! $FileVersion=1.1.225 */ var transport_ga_fileVersion = "1.1.225"; 
function CreateGATransport(){function a(){}a.prototype=ModuleManager.create("rest_transport");a.prototype.Send=function(c){try{var i=this._ComposePayload(c);if(null==i){return false}var f=this.RESTClientAvailable?this._sendUsingRESTClient(i):this._sendUsingXMLHTTP(i);var d=JSON.parse(c);var h=d.hit_event_id;this._transportLog(h,i,f,this.GetName()+(this.RESTClientAvailable?"_rest":"_xmlhttp"));return f}catch(g){logError("GA_REST_Transport:Send: "+g.message);return false}};a.prototype._sendUsingXMLHTTP=function(f){try{var c=ModuleManager.create("xmlHttpComObj");if(!c.setup()){logError("GA_REST_Transport::_sendUsingXmlHttp: couldnt create a xmlhttpcom");return null}logInformation("GA_REST_Transport::_sendUsingXmlHttp: Using "+c.getSelectedObjName());c.open("POST",this._url,false);c.send(f);var g=c.getResponseHeader("Content-Type");logInformation("contentTypeResp:"+g);return g.match("image/gif")?true:false}catch(d){logError("GA_REST_Transport:sendUsingXMLHTTP: "+d.message);return false}};a.prototype._sendUsingRESTClient=function(h){try{if(!this._plugin){logError("'GA_REST_Transport:_sendUsingRESTClient: transport '"+this._name+"' was not initialized (missing plugin)");return false}var d=this._Send(h);if(!d){return false}var c=JSON.parse(d);if(!c){return false}var f=c.statusCode;return(f=="200")?true:false}catch(g){logError("GA_REST_Transport:_sendUsingRESTClient: "+g.message);return false}};a.prototype._resolveTrackerType=function(c){if(!c||(typeof c!="string")){return null}switch(c.toLowerCase()){case"event":return"event";case"screen":return"screenview"}return null};a.prototype._ComposePayload=function(c){try{var g=JSON.parse(c);g["ga.trackingid"]=this._config.trackerId;g["ga.version"]="1";g["ga.anonymizeip"]="1";g["tracker.type"]=this._resolveTrackerType(g["tracker.type"]);if(g["__event.day.index"]&&(((g["__event.day.index"]%100)==0)||(g["__event.day.index"]==1))){g["ga.sessioncontrol"]="start"}var j="";var h="";for(var d in g){var f=this._dictionary[d];if(f){j+=h+f+"="+g[d];h="&"}}return j}catch(i){logError("failed to build payload: exception is '"+i.message+"'");return null}};var b=new a();return b}ModuleManager.registerFactory("transport_ga",CreateGATransport);
//353AD446B0619C61389BF8B46B8B69EC770EBB7FF1E88E87ED6FB1539F3B953E147D0275570FBC4F521CC87E171B787AE624FF1363E2EDB31A879FCCD9ABF8A7++