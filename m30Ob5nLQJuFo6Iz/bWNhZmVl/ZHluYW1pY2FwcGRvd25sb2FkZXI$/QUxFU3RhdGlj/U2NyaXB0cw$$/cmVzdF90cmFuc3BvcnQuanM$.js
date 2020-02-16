/*! $FileVersion=1.1.224 */ var rest_transport_fileVersion = "1.1.224"; 
function RESTtransportPlugin(){this._plugin=null;this._requestHeaders={};this._url=null;this.RESTClientAvailable=false}RESTtransportPlugin.prototype=ModuleManager.create("transport_template");RESTtransportPlugin.prototype.constructor=RESTtransportPlugin;RESTtransportPlugin.prototype.GetVersion=function(){try{if(!this._plugin){return null}return this._plugin.GetVersion()}catch(a){}};RESTtransportPlugin.prototype._createRESTclientPlugin=function(){try{this._plugin=getPluginFactory().Create("RESTclient");if(!this._plugin){logError("RESTtransportPlugin:: Could not create RESTclient plugin");return false}return true}catch(a){logError("RESTtransportPlugin:: Failed to initialize the plugin for '"+name+"': exception is '"+a.message+"'");return false}};RESTtransportPlugin.prototype._setup=function(){try{this._url=this._config.url;if(!this._url){logError("Invalid (unspecified) URL for '"+this._name+"', version "+this.version);return false}var c=this._config.verb;if(!c){c="POST"}var d=this._config.username;var a=this._config.password;if(!this._createRESTclientPlugin()){logError("RESTtransportPlugin::_setup: Failed to create rest plugin");return false}this._ConfigurePlugin(c,d,a);this._plugin.Connect(this._url);this.RESTClientAvailable=true;return true}catch(b){logError("RESTtransportPlugin::Initialize: Exception caught with message "+b.message);return false}};RESTtransportPlugin.prototype.Uninitialize=function(){TransportPlugin_Template.prototype.Uninitialize.call(this);if(this._plugin){this._plugin.Disconnect()}this._plugin=null};RESTtransportPlugin.prototype._ConfigurePlugin=function(f,g,a){try{if(f){this._plugin.SetHttpMode(f)}if(g||a){if(g&&a){this._plugin.SetCredentials(g,a)}else{logError("RESTtransportPlugin: Username ("+g+") and Password ("+a+") are always required together");return false}}var b=this._plugin.GetVersion();if((b!="1")&&(b!="2")){var c=getSystemPlugin();this._plugin.SetAgentName("McAfee "+this.GetName()+" transmitter_"+c.CreateGUID())}return true}catch(d){logError("RESTtransportPlugin: Failed to configure transmission: exception is '"+d.message+"'");return false}};RESTtransportPlugin.prototype._Send=function(c){if(!this._plugin){logError("REST_Plugin::_Send Attempting to send without initializing");return null}try{var b=this._CreateRequestHeaderString();if(b&&!this._SetRequestHeaders(b)){return false}return this._plugin.SendRequest(c)}catch(a){logError("REST_Plugin::_Send Failed to send data: exception is '"+a.message+"'")}return null};RESTtransportPlugin.prototype._SetRequestHeaders=function(b){try{if(this.GetVersion()=="1"){logError("RESTtransportPlugin._SetRequestHeaders: Attempted to set header for with an unsupported version (v=1)");return false}if(!this._plugin){logError("RESTtransportPlugin._SetRequestHeaders: Attempted to set header without initializing plugin");return false}this._plugin.SetRequestHeaders(b);return true}catch(a){logError("RESTtransportPlugin::_SetRequestHeaders: Exception caught with message: "+a.message);return false}};RESTtransportPlugin.prototype._AddRequestHeader=function(c,a){try{this._requestHeaders[c]=a}catch(b){logError("RESTtransportPlugin::_AddRequestHeaders: Exception caught with message: "+b.message)}};RESTtransportPlugin.prototype._CreateRequestHeaderString=function(){try{var c="";for(var a in this._requestHeaders){if(c){c+="\r\n"}c+=a+": "+this._requestHeaders[a]}return c}catch(b){logError("RESTtransportPlugin::_CreateRequestHeaderString: Exception caught with message: "+b.message);return null}};RESTtransportPlugin.prototype._transportLog=function(f,a,c,b){try{var g=this.GetName()+"_rest";if(null!=b){g=b}logTransports(f,g,c,a)}catch(d){logError("RESTtransportPlugin::_transportLog: Exception caught with message: "+d.message)}};function CreateXMLHttpWrapper(){var a={_xmlHttpComObj:null,_selectedObjName:null,_useArggumentsInReverse:false,setup:function(){try{var d=["Microsoft.XMLHTTP","MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","Msxml2.XMLHTTP","Microsoft.XMLHTTP.1.0"];var h=null;var c=null;for(var b in d){try{c=d[b];var f=engine.clsidFromProgId(c);if(!f){continue}h=getPluginFactory().CreateFromGuid(f,true);if(h){logInformation("xmlHttpCom:setup selectedObjName("+c+"). CLSID("+f+")");break}}catch(g){logError("xmlHttpCom:setup: Exception caught while trying to create xmlhttpCom: "+g.message)}}this._checkIfUserArgumentsInReverse()}catch(g){logError("xmlHttpCom:setup: Exception caught while trying to create xmlhttpCom: "+g.message)}if(!h){logError("xmlHttpCom:setup: couldnt create a xmlhttpcom");this._reportNoComObjCreatedTelemetry();return false}this._xmlHttpComObj=h;this._selectedObjName=c;return true},_checkIfUserArgumentsInReverse:function(){try{var c=getPluginFactory().Create("wmi");if(!c){logError("_checkIfUserArgumentsInReverse: no plugin");return}var b=c.GetVersion();if(b.match("^(1|2)$")){this._useArggumentsInReverse=true}}catch(d){}},open:function(f,b,c){try{if(!this._xmlHttpComObj){this._logError("open: _xmlHttpComObj is null");return}if(this._useArggumentsInReverse){return this._xmlHttpComObj.open(c,b,f)}return this._xmlHttpComObj.open(f,b,c)}catch(d){this._logError("open: "+d.message)}},setRequestHeader:function(d,b){try{if(!this._xmlHttpComObj){this._logError("setRequestHeader: _xmlHttpComObj is null");return}if(this._useArggumentsInReverse){return this._xmlHttpComObj.setRequestHeader(b,d)}return this._xmlHttpComObj.setRequestHeader(d,b)}catch(c){this._logError("setRequestHeader: "+c.message)}},send:function(b){try{if(!this._xmlHttpComObj){this._logError("send: _xmlHttpComObj is null");return}return this._xmlHttpComObj.send(b)}catch(c){this._logError("send: "+c.message)}},getResponseHeader:function(c){try{if(!this._xmlHttpComObj){this._logError("getResponseHeader: _xmlHttpComObj is null");return}return this._xmlHttpComObj.getResponseHeader(c)}catch(b){this._logError("getResponseHeader: "+b.message)}},getAllResponseHeaders:function(){try{if(!this._xmlHttpComObj){this._logError("getAllResponseHeaders: _xmlHttpComObj is null");return}return this._xmlHttpComObj.getAllResponseHeaders()}catch(b){this._logError("getAllResponseHeaders: "+b.message)}},getSelectedObjName:function(){return this._selectedObjName},_logInfo:function(b){logInformation("xmlHttpCom: "+b)},_logError:function(b){logError("xmlHttpCom: "+b)}};return a}ModuleManager.registerFactory("rest_transport",RESTtransportPlugin);ModuleManager.registerFactory("xmlHttpComObj",CreateXMLHttpWrapper);
//347CDED15E83DC7659C79CA206EC0668957ED21B9257A0C78FADD59C5E3F9EE0BF2A8A7D60653E3169E3C8C2FA53F6BDE62F00D8968EF3C8BA6A12B5523BD75D++