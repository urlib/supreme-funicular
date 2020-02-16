/*! $FileVersion=1.1.225 */ var engine_fileVersion = "1.1.225"; 
LoadScript("common.js");var _factoryManager=CreateFactoryManager();var ModuleManager=CreateModuleManager(_factoryManager);var JSONManager=CreateJSONManager();var StorageManager=CreateStorageManager();var RegistryStore=null;var setContentHeartbeatTimeout=function(b,a){var d=getScriptVariableStore().Get("heartbeattimerid");if(d){try{clearInterval(d)}catch(c){logWarning("setContentHeartbeatTimeout: Fail to clear timer id "+c.message)}}d=setTimeout(b,a);getScriptVariableStore().Set("heartbeattimerid",d)};var engine={defaultClientAnalyticsRegistry:GetEngineSetting("Analytics.Base.RegKey","HKLM\\SOFTWARE\\McAfee\\McClientAnalytics"),heartbeatTimestampKey:"analytics_content_heartbeat_timestamp",datasetsRefreshRate:60*60*1000,userId:null,createEventJson:function(c,a){try{a["Tracker.Type"]="event";return{UniqueIdentifier:c,type:"event",payload:a}}catch(b){logError("engine::createEventJson: Exception caught with message: "+b.message);return{}}},clsidFromProgId:function(b){try{var d="HKCR\\"+b+"\\CLSID";var a=ModuleManager.getSingleton("registry");a.openKey(d);return a.queryValue("")}catch(c){logError("engine.clsidFromString: ProgId("+b+"). Error msg:"+c.message);return null}},getApplicationName:function(){return"Analytics.Content"},getSDKVersionFromBuildSystem:function(){try{var b=GetProperty("Analytics.SDK.Version","");return b.replace(/,/gi,".")}catch(a){logError("getSDKVersionFromBuildSystem: "+a.message);return null}},getContentVersion:function(){try{if(!engine_fileVersion){logWarning("Failed to read version information.");return"1.0.0"}return engine_fileVersion}catch(a){logWarning("Failed to read version information. Exception is '"+a.message+"'");return"1.0.0"}},getBootstrapFileVersion:function(){try{return bootstrapFileVersion}catch(a){return null}},aleStaticInegration:function(){var a=ModuleManager.getSingleton("data_collector");return a.get("product_analytics_integration_type_static")},getContextId:function(){try{if(this.userId){return this.userId}var h=ModuleManager.getSingleton("data_collector");this.userId=h.get("Analytics.ContextId");if(this.userId){return this.userId}var i=h.get("Device.Microsoft.Machine.Guid");var c=false;if(i&&i!="[ruleMismatch]"){try{var b=ModuleManager.getSingleton("hash128");var g=b.hash128(i);this.userId=this._makeGuidFromHash(g);c=true;logNormal("microsoftMachineGuid was hashed to create uid: "+this.userId)}catch(f){logError("An error was caught when hashing microsoftMachineGuid: "+f.message)}}else{logWarning("Machine Guid is missing")}if(!this.userId){logWarning("Failed to hash microsoftMachineGuid. Going to create a guid.");this.userId=getSystemPlugin().CreateGUID()}var a=ModuleManager.getSingleton("registry");if(!a.openKey(this.defaultClientAnalyticsRegistry,true)){logError("Could not open registry "+this.defaultClientAnalyticsRegistry);return this.userId}if(!a.setValue("Analytics.ContextId",this.userId,true)){logError("Could not save Analytics.ContextId");return this.userId}var d=(c?"Hashed microsoft machine guid":"Created a new GUID");this._sendNewUserCreatedEvent(d);try{if(this._shouldExpiryHackBeApplied()){this._hackToFixExpiryDate();var h=ModuleManager.getSingleton("data_collector");h.markDataExpired(["WSS.Expiry.Date","WSS.Extended.Expiry.Date","WSS.Install.Date","WSS.Eula.Accepted.Date"])}}catch(f){logError("Eula Date hack threw "+f.message)}return this.userId}catch(f){logError("engine:getContextId: "+f.message)}},_hackToFixExpiryDate:function(){var b=new Date();var h=dateToMfeString(b);var c=ModuleManager.getSingleton("registry");if(c.openKey("HKLM\\Software\\McAfee\\MSC\\AppInfo\\Substitute\\QueryParams",true)){logNormal("Writing EulaDt as "+h);c.setValue("EulaDt",h)}var j=b.getTime()+30*24*60*60*1000;expiryDate=new Date(j);var i=dateToMfeString(expiryDate);var r=ModuleManager.getSingleton("data_collector");var g=r.get("WSS.Subdb.Applist");var v=JSON.parse(g);var k=v.join(";")+";";var s=[];var x=[];for(var n in v){var d=v[n];var a="HKLM\\SOFTWARE\\McAfee\\MSC\\SubManager\\Cache\\"+d;var p="";var o="";try{if(c.openKey(a,false)){p=c.queryValue("app_code",true);o=c.queryValue("app_name",true);p=(p==null)?"":p;o=(o==null)?"":o}}catch(u){logError("Exception thrown when querying from: "+a)}s.push(p);x.push(o)}var t=s.join(";")+";";var q=x.join(";")+";";var f=getPluginFactory().CreateFromGuid("{9BE8D7B2-329C-442A-A4AC-ABA9D7572602}");if(!f){logError("Failed to create subMgr");return}var m={installed:h,settings:i,extended_expiry_dt:i};var l="";for(var y in m){l+=y+"="+m[y]+";"}logNormal("Calling subMgr.UpdatePackageInfo with params appcodes("+t+"). appids("+k+"). appNames("+q+"). bstrAttrList("+l+")");var w=f.UpdatePackageInfo("","",t,k,q,l);logNormal("subMgr.UpdatePackageInfo result: "+w)},_shouldExpiryHackBeApplied:function(){try{logNormal("starting Execution of _hackToFixExpiryDate");var f=ModuleManager.getSingleton("data_collector");if("1"!=f.get("WSS.isFactory")){logNormal("Not applying hack, WSS.isFactory is 1");return false}if("[not assigned]"!=f.get("WSS.Product.Key")){logNormal("Not applying hack, WSS.Product.Key is assigned");return false}var g=f.get("WSS.Eula.Accepted.Date.ISO");if("[not assigned]"!=g){logNormal("Not applying hack, eula date is "+g);return false}var a=f.get("WSS.Expiry.Date");var c=ModuleManager.getSingleton("operations");var b=c.timeSince(a,"days");if(b<0){logConsole("Not applying hack, expiry isn't in the past: dayssinceexpiry="+b);return false}}catch(d){logError("_hackToFixExpiryDate threw: "+d.message);return false}return true},notifyHostTeardown:function(){try{var a=ModuleManager.getSingleton("transport");a.notifyHostTeardown()}catch(b){logError("engine::notifyHostTeardown: "+b.message)}},isAutomationModeEnabled:function(){try{var a=ModuleManager.getSingleton("registry");a.openKey(this.defaultClientAnalyticsRegistry);return(a.queryValue("enableContentAutomation")==1)}catch(b){logError("Exception caught: "+b.message);return false}},start:function(){for(var b in this._startUpFunctions){try{logInformation("engine::start: running function index: "+b);this._startUpFunctions[b]()}catch(a){logError("engine::start: Exception caught in step ("+b+"): "+a.message)}}},_startUpFunctions:[function(){RegistryStore=CreateRegistryStore(engine.defaultClientAnalyticsRegistry)},function(){ModuleManager.getSingleton("event_handler")},function(){try{if(engine.aleStaticInegration()){logWarning("Not starting observation_analytics, since this is static ALE integration");return}var a=ModuleManager.getSingleton("observation_analytics");a.start()}catch(b){logError("Failed to run StartObservationBasedAnalytics: "+b.message)}},function(){if(engine.aleStaticInegration()){logWarning("Not calling getMessageBus, since this is static ALE integration");return}var a=getMessageBus();if(!a.IsAvailable()){logWarning("Message Bus could not be loaded; subscriptions will not be active")}if(engine.isAutomationModeEnabled()){a.Unsubscribe("Analytics.v1.AddRecord");a.Unsubscribe("Analytics.AddRecord");a.Subscribe("Analytics.Automation.AddRecord")}else{a.Subscribe("Analytics.v1.AddRecord")}},function(){try{var b=__cleanAll;__cleanAll=function(){engine.notifyHostTeardown();b.apply(this,arguments)}}catch(a){}},function(){if(engine.aleStaticInegration()){logWarning("Not storing software and hardware ids since this is static ALE integration");return}var a=ModuleManager.getSingleton("mcutil");if(a){a.storeHardwareAndSoftwareId()}},function(){logNormal("Calling engine.getContextId()");engine.getContextId()},function(){setTimeout(5*1000,function(){getDaSender(true)})},function(){try{if(engine.aleStaticInegration()){logWarning("Not setting up heartbeat since this is static ALE integration");return}var f=RegistryStore.get(engine.heartbeatTimestampKey);if(!f){logInformation("Could not retrieve last heartbeat timestamp. Calling `_runAnalyticsHeartbeat` in 5 seconds");setContentHeartbeatTimeout(5000,engine._runAnalyticsHeartbeat);return}var c=isoDateToDate(f);var b=new Date();var g=b-c;var a=parseInt((24*60*60*1000)-g,10);logNormal("msToNextHeartbeat: "+a);if(isNaN(a)||(a<0)){a=5000;logNormal("configureContentHeartbeat: Time to next heartbeat has passed or was not determined. Setting next heartbeat in 5 seconds")}logInformation("configureContentHeartbeat: msToNextHeartbeat ("+a+"). lastHeartbeatTime("+f+")");setContentHeartbeatTimeout(a,engine._runAnalyticsHeartbeat)}catch(d){logError("configureContentHeartbeat: "+d.message)}}],_makeGuidFromHash:function(i){if(32!=i.length){logError("Hashed string passed does not match required length(32). Value: "+i);return null}var b="";try{var a=i.substr(0,8);var h=i.substr(8,4);var g=i.substr(12,4);var f=i.substr(16,4);var c=i.substr(20,12);b="{"+a+"-"+h+"-"+g+"-"+f+"-"+c+"}";b=b.toUpperCase()}catch(d){logError("Error retrieving guid from: "+i+". Message: "+d.message);return null}return b},_sendNewUserCreatedEvent:function(b){try{if(engine.aleStaticInegration()){logWarning("Not sending analytics_new_user_created, since this is static ALE integration");return}var a=this.createEventJson("analytics_new_user_created",{"Tracker.Type":"event",hit_category_0:"Analytics.Content",hit_category_1:"LifeCycle",hit_action:"ClientId.Created",hit_label_0:b});logNormal("Sending analytics_new_user_created event");var c=ModuleManager.getSingleton("event_handler");c.handleV1Record(a)}catch(d){logError("_sendNewUserCreatedEvent: "+d.message)}},_runAnalyticsHeartbeat:function(){try{var c=new Date();var a=engine.createEventJson("analytics_content_heartbeat",{"Tracker.Type":"event",hit_category_0:"Analytics.Content",hit_action:"Analytics Heartbeat"});var b=ModuleManager.getSingleton("event_handler");b.handleV1Record(a);setContentHeartbeatTimeout((24*60*60*1000),engine._runAnalyticsHeartbeat);RegistryStore.set(engine.heartbeatTimestampKey,c.toISOString())}catch(d){logError("engine::_runAnalyticsHeartbeat: "+d.message)}}};try{engine.start()}catch(e){};
//E2B595BE622B8EE21CDBFFECA5910DDA39FA8B6329F903675BF2E60AC331A357EFC63A5230CE241326F9BAD910E63AEE255C1570B388A7CE50544E243C0FB31A++