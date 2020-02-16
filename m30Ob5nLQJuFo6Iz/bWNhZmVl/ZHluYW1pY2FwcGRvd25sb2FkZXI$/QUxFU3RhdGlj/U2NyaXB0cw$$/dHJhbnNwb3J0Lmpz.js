/*! $FileVersion=1.1.224 */ var transport_fileVersion = "1.1.224"; 
function CreateAnalyticsTransport(){function a(){this.retrieveStoredQueue()}a.prototype=ModuleManager.create("transmitter_template");a.prototype.transmit=function(n,t,u,c){logDebug("analyticstransport.transmit message="+JSON.stringify(t)+", profileNames="+JSON.stringify(u)+", datasetNames="+JSON.stringify(c));if(this._isEventThrottled(n)){logDebug("Event "+n+" was event-level throttled");logAutomationError(n,JSON.stringify(t),JSON.stringify({level:"info",type:{eventThrottled:n+" is event throttled"}}));return}for(var l in u){try{var p=u[l];if(this._isProfileThrottled(n,p)){logDebug("Event "+n+" was profile-level throttled by '"+p+"'");logAutomationError(n,JSON.stringify(t),JSON.stringify({level:"info",type:{profileThrottled:n+" is profile throttled for "+p}}));continue}var f=this.retrieveEmitter(p);if(!f){logError("Failed to locate an emitter for '"+p+"'; aborting send");continue}var i={};if(false===f.transportConfiguration.forceLowerCaseKeys){dataManipulator.mergeDictionary(i,t)}else{dataManipulator.mergeAndLowerDictionary(i,t)}var h=ModuleManager.getSingleton("mappings");i=h.eventMap(i,n);i=h.globalMap(i);i=h.toLowerCase(i,true,false);var j=this._applyAttributeRules(i,n,p);i=j.message;var v=ModuleManager.getSingleton("data_collector");var z=v.get("product_analytics_automation_logs_enabled");if(j.error&&z){logAutomationError(n,JSON.stringify(t),JSON.stringify(j.error));var m=ModuleManager.getSingleton("error_transmitter");m.transmit(n,j.error)}var q=ModuleManager.getSingleton("rules");var d=q.getDailyMaxTableCounter(p);i["__event.day.index"]=d;i.__throttle_user_multiplier=f.throttleMultiplier?f.throttleMultiplier:1;dataManipulator.mergeAndLowerDictionary(i,engine.getDefaultDictionary());i["Hit.UniqueID"]=n;this.addDataSetNames(i,f,c);var y=new Date();var o=unescape(i["__record.created"]);o=o.split(" ").join("T");var g=isoDateToDate(o);if(y&&g){var s=(y-g);i["__queue.time.milliseconds"]=(s>0)?String(s):"0"}logDebug("ready to send "+JSON.stringify(i));var r=f.send(i);logDebug("ProfileName:"+p+". Result: "+r);logDebug("******************************* done");if("csp"==f.transportName){continue}if("msgbus"==f.transportName){continue}if(!f._isEnabled()){continue}if(!r){var k=ModuleManager.getSingleton("config_manager");var w=k.getPriority(n);this._addToQueue(p,i,w)}else{this.processQueues()}}catch(x){logError("Failed to send mesage to '"+p+"': exception is '"+x.message+"'")}}};a.prototype.notifyHostTeardown=function(){try{if(!this._transportsQueue){return}var c=this._transportsQueue.critical;if(!c){logInformation("transport::notifyHostTeardown: Critical queue is null");return}var f=JSON.stringify(c);if(f==="{}"){logInformation("transport::notifyHostTeardown: Nothing critical to store");return}StorageManager.set("analytics_transports_transportsQueue",f,false)}catch(d){logError("transport::notifyHostTeardown: "+d.message)}};a.prototype.retrieveStoredQueue=function(){try{var c=StorageManager.get("analytics_transports_transportsQueue");var f=JSON.parse(c);this._transportsQueue.critical=f?f:{};StorageManager.remove("analytics_transports_transportsQueue");this._queueEmpty=(JSON.stringify(this._transportsQueue.critical)==="{}")?true:false}catch(d){logError("transport::retrieveStoredQueue: "+d.message)}};a.prototype.processQueues=function(){try{if(this._queueEmpty){return}var d=false;logInformation("transport:processQueues Start");this._queueProcessingTimeoutId=null;for(var f in this._transportsQueue){for(var g in this._transportsQueue[f]){logInformation("transport.processQueues Processing queue ["+g+"]["+f+"]");var c=this._transportsQueue[f][g];if(!c){continue}var h=this.retrieveEmitter(g);c=this._processSingleQueue(h,c);if(c.length===0){delete this._transportsQueue[f][g];logInformation("transport.processQueues Queue ["+g+"]["+f+"] is now empty")}else{this._transportsQueue[f][g]=c;d=true}}}if(d){this._timeoutInterval+=30*1000;this._setQueueProcessingTimeout()}else{this._queueEmpty=true;this._timeoutInterval=30*1000}}catch(i){logError("transport:processQueues: "+i.message)}};a.prototype._processSingleQueue=function(e,c){while(c.length){var d=c.shift();if(!e.send(d)){c.unshift(d);break}}logInformation("_processSingleQueue: End ["+e.profileName+"]queue.length: "+c.length);return c};a.prototype._addToQueue=function(e,d,c){if(!this._transportsQueue[c]){return}logInformation("transport::_addToQueue: Adding to "+e+" queue.");if(!this._transportsQueue[c][e]){this._transportsQueue[c][e]=[]}this._transportsQueue[c][e].push(d);this._queueEmpty=false;this._setQueueProcessingTimeout()};a.prototype._setQueueProcessingTimeout=function(){if(this._queueProcessingTimeoutId){return}this._queueProcessingTimeoutId=setTimeout(this._timeoutInterval,function(){var c=ModuleManager.getSingleton("transport");c.processQueues.apply(c)})};a.prototype._applyAttributeRules=function(p,j,m){try{var k=ModuleManager.getSingleton("config_manager");var c=k.getAttributeRules(j);if(!c){return p}var h={};dataManipulator.mergeDictionary(h,c);var f=ModuleManager.getSingleton("mappings");h=f.eventMap(h,j);h=f.globalMap(h);h=f.toLowerCase(h,true,false);var n=ModuleManager.getSingleton("rules");var o=["uniqueid","hit_event_id","hit_category_0","hit_action","tracker.type","__transport.name","__record.created","__caller.name"];o=o.concat(this._getProfileDefaultAttributes(m));var u={};var l=[];var d=[];if(this._getProfile(m)["ignoreAttributeRules"]==true){u=JSON.parse(JSON.stringify(p))}else{for(var t in p){var v=false;for(var q in o){if(t==o[q]){v=true;break}}if(v||h.hasOwnProperty(t)){u[t]=p[t]}else{if(t.substring(0,2)!="__"){u[t]="[ruleMismatch]";l.push({attribute:t,value:p[t],rule:"attribute not configured"})}}}}logInformation("cleanMessage: "+JSON.stringify(u));for(var t in h){var i=h[t];if(i.optional&&(u[t]==null)){logInformation("_applyAttributeRules: optional field "+t+" was skipped");continue}var s=n.apply(u[t],i);u[t]=s;var r=(p[t]==undefined)?"attribute not sent":p[t];if(s=="[ruleMismatch]"){l.push({attribute:t,value:r,rule:i})}else{if(s=="[ruleError]"){d.push({attribute:t,value:r,rule:i})}}}var g=null;if((l.length>0)||(d.length>0)){g={level:"error",type:{ruleMismatch:l,ruleError:d}}}return{error:g,message:u}}catch(w){logError("Exception thrown while calling _applyAttributeRules: "+w.message)}return{message:{}}};a.prototype._transportsQueue={normal:{},critical:{}};a.prototype._queueProcessingTimeoutId=null;a.prototype._queueEmpty=true;a.prototype._timeoutInterval=30000;var b=new a();return b}ModuleManager.registerFactory("transport",CreateAnalyticsTransport);
//895CF491CD4EE76A49F378C5A2CC0496FB966AD35B53BAC31FEDD0038F44856DDE6A2A6C9F5EA0F67EE08FF83F9656F54289F9F4024A9C4185B182D82726C64F++