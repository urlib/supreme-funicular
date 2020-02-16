/*! $FileVersion=1.1.224 */ var operations_fileVersion = "1.1.224"; 
function CreateDataOperations(){var a={apply:function(c,b){try{if(!b){return c}return this[b.name](c,b.params)}catch(d){this._logError("operations:apply: Excption caught("+d.message+". Val("+c+"), operationConfig("+JSON.stringify(b)+")");return null}},noop:function(b){return b},equal:function(b,c){return b==c},isValueValid:function(b){return(b!="[not assigned]")&&(b!="[ruleMismatch]")&&(b!="[ruleError]")},notNull:function(b){return(b!=null)},at:function(b,c){if(!b||!this._isValidValue(b)){return null}return b[c]},combineCustomDate:function(b,c){if(findObjectSize(b)!=findObjectSize(c)){return null}return b.InstalledYear+"-"+b.InstalledMonth+"-"+b.InstalledDate},split:function(b,c){return b.split(c)},first:function(c){for(var b in c){if(c[b]!=null){return c[b]}}return null},mask:function(b,c){return b&c},or:function(c){for(var b in c){if(c[b]){return true}}return false},and:function(c){for(var b in c){if(!c[b]){return false}}return true},multiply:function(b,c){return parseInt(b,10)*c},divide:function(b,c){return parseInt(b,10)/c},join:function(b,c){return b.join(c)},cleanLocaleCode:function(b,d){try{if(b){if(typeof b!="string"){b=String(b)}if(b.length==4){b="0x"+b}}}catch(c){this._logError("splitLocaleCode exception: "+c.message)}return b},daysTo:function(b){if(typeof b.getTime!=="function"){this._logError("daysTo: value is not datetime object ("+b+")");return null}return this._getDaysBetween(b,null)},round:function(f,h){try{if(!h){return f}var c=h.multiple;var b=h.roundUp;if(!c){return f}var d=parseInt((f/c),10)*c;if(b==true){return d+c}return d}catch(g){this._logError("roundtoNearestMultiple: { numToRound: "+f+", multiple: "+c+", roundUp: "+b+" } exception caught with message: "+g.message);return f}},timeSince:function(g,h){if((g==null)||(typeof g.getTime!=="function")){this._logError("daysTo: value is not datetime object ("+g+")");return null}var f=1000*60;var e=f*60;var c=e*24;var d=Date.now();var b=d-g.getTime();if(!h||h==="days"){return parseInt(b/c,10)}if(h==="hours"){return parseInt((b%c)/e,10)}if(h==="minutes"){return parseInt(((b%c)%e)/f,10)}return null},transform:function(b,c){return c[b]},dateToEpoch:function(b){return b.getTime()/1000},epochToISODate:function(c){if(!c){return null}var b=new Date(0);b.setUTCSeconds(c);return b.toISOString()},dateToISO:function(b,c){if(!b||!this._isValidValue(b)){return null}if(c&&c==="dateTime"){return b.toISOString()}return b.toISOString(true)},wssDateToDate:function(d){if(!d||(8!=d.length)){return null}var c=parseInt(d.substr(0,4),10);var e=parseInt(d.substr(4,2),10);var b=parseInt(d.substr(6,2),10);if(!c||!e||!b){return null}return new Date(c,e-1,b)},_isValidValue:function(b){if(b=="[not assigned]"||b=="[ruleMismatch]"||b=="[ruleError]"){return false}return true},_getDaysBetween:function(g,i){try{var c=1000*60*60*24;var d=g.getTime();var f;if(!i){f=Date.now()}else{f=i.getTime()}var b=d-f;return parseInt((b/c),10)}catch(h){this._logError("Exception caught while calculating difference between dates: "+h.message)}return null},containsIn:function(c,d){var b=parseInt(c,10);if(d[b]!==undefined){return d[b]}return null},stringToDate:function(k){try{if(!k||(14>k.length)){return null}var h=parseInt(k.substr(0,4),10);var g=parseInt(k.substr(4,2),10);var i=parseInt(k.substr(6,2),10);var d=parseInt(k.substr(8,2),10);var c=parseInt(k.substr(10,2),10);var b=parseInt(k.substr(12,2),10);var j=!h||!g||!i||!d||!c||!b;if(j){return null}return new Date(h,g-1,i,d,c,b)}catch(f){this._logError("Exception caught in stringToDate: "+f.message)}return null},stringToISODate:function(b){return this.dateToISO(this.stringToDate(b),"dateTime")},_logInfo:function(b){logInformation("operations: "+b)},_logError:function(b){logError("operations: "+b)}};return a}ModuleManager.registerFactory("operations",CreateDataOperations);
//B83ADA56337099379EC27D793124E7B7E7D82756D910582E9858C69DD69EDEE3053CA3DD2A8D0BDD3B5745114062AD3771459BC2BA10080819687C275CDB9930++