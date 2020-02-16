/*! $FileVersion=1.1.224 */ var registry_fileVersion = "1.1.224"; 
function CreateRegistryHelper(){var a={openKey:function(c,b){if(typeof b!=="boolean"){b=false}if(b){logDebug("open registry in write mode");return this._getPlugin().CreateReg(c)}logDebug("open registry in read mode");return this._getPlugin().OpenReg(c)},openKey64:function(c,b){if(typeof b!=="boolean"){b=false}if(b){logDebug("open registry in write mode (x64)");return this._getPlugin().CreateReg64(c)}logDebug("open registry in read mode (x64)");return this._getPlugin().OpenReg64(c)},queryValue:function(c,b){var g=false;try{if(typeof b==="boolean"){g=b}var f=this._getPlugin().QueryValue(c,g);return f}catch(d){logInformation("Failed to query "+(g?"obfuscated ":"")+"registry key '"+c+"': exception is '"+d.message+"'")}return null},setValue:function(d,f,b){var h=false;try{if(typeof b==="boolean"){h=b}var c=this._getPlugin().SetValue(d,f,h);if(!c){logDebug("registry.setvalue failed ("+d+", "+f+")")}return c}catch(g){logInformation("Failed to set "+(h?"obfuscated":"")+" registry key '"+hivePath+"\\"+d+" to '"+f+"': exception is '"+g.message+"'")}return null},executeAction:function(c){try{if(!c){return null}if(!this._customActions){this._customActions=this._createCustomActions(this)}return this._customActions[c.action](c)}catch(b){logError("registry:custom_actions: "+b.message+"datadefinition("+JSON.stringify(c.action)+")")}return null},fetchFromDataDefinition:function(i){try{if(!i){logError("registry:fetchFromDataDefinition Invalid data definition");return null}var g=i.path;if(!g){g=GetEngineSetting("Analytics.Base.RegKey","HKLM\\SOFTWARE\\McAfee\\McClientAnalytics")}var c=(i.wow64_64==true)?true:false;var h;if(c&&a._isWOW6432Node()){h=a.openKey64(g)}else{h=a.openKey(g)}if(!h){logWarning("registry:fetchFromDataDefinition: Unable to open path ("+g+")");return null}var b=i.obfuscated;var f=i.name;return a.queryValue(f,(b?b:false))}catch(d){logError("registry:fetchFromDataDefinition: "+d.message+"datadefinition("+JSON.stringify(i)+")")}return null},_isWOW6432Node:function(){try{return this.openKey("HKLM\\SOFTWARE\\WOW6432Node")==true}catch(b){logError("registry::_isWOW6432 "+b.message)}},_getPlugin:function(){if(!this._regPlugin){this._regPlugin=getPluginFactory().Create("registry")}return this._regPlugin},_createCustomActions:function(c){var b={findbestpath:function(g){var f=g.data;if(f instanceof Array){for(var d in f){var e=c.fetchFromDataDefinition(f[d]);if(e){return e}}}return null},iterateapplist:function(i){var f=i.applist;var h=[];if(f instanceof Array){var g=i.path;for(var d in f){var e=JSON.parse(JSON.stringify(i));e.path=g+"\\"+f[d];if(c.fetchFromDataDefinition(e)){h.push(f[d])}}return JSON.stringify(h)}return null}};return b},_regPlugin:null,_customActions:null};return a}ModuleManager.registerFactory("registry",CreateRegistryHelper);
//3725BEE80E6E641B81B29289F3CE2C3C278608086B9B1D9985F50444E0EBED4925C1A7CCB7555843D43292C61EA34A806C91858A1C2F431809CD9881932CDAB1++