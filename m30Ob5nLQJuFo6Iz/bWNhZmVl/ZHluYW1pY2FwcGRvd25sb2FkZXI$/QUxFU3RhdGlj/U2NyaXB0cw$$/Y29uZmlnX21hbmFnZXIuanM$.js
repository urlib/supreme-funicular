/*! $FileVersion=1.1.224 */ var config_manager_fileVersion = "1.1.224"; 
function CreateEventConfig(){var a={getEvents:function(){var b=JSONManager.getSingleton("events");return b.data},getProfileNames:function(b){try{return this.getEvents()[b].profileNames}catch(c){return null}},getAttributeRules:function(b){try{return this.getEvents()[b].attributeRules}catch(c){return null}},getPriority:function(c){try{var b=this.getEvents()[c].priority;return b.toLowerCase()}catch(d){return""}},getDataSetNames:function(b){try{return this.getEvents()[b].datasets}catch(c){return[]}},_setEvent:function(d,b){try{return this.getEvents()[d]=b}catch(c){return[]}},getThrottleRule:function(b){try{return this.getEvents()[b].throttleRule}catch(c){logWarning("getThrottleRule: failed, cannot find throttle rule attached to "+b);return null}},_events:null};return a}ModuleManager.registerFactory("config_manager",CreateEventConfig);
//F35707C48653B8D2DF09A577743040A912342C1D74CD91B75AD568BC0078BFFF4D2D669137E2754ACE6824CDF23E277E90B70DA93484FBBE5138BFF9C2467052++