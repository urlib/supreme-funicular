/*! $FileVersion=1.1.206 */ var event_config_fileVersion = "1.1.206"; 
function getEventConfiguration(){var a={};try{a=JSONManager.create("events")}catch(b){logError("ERROR: Could not load events.json "+b.message)}return a}ModuleManager.registerFactory("event_config",getEventConfiguration);
//62F8EA7E0504D45D3A7A1A9E3F7F246BDE30717C3732E849CCFF03B594E72C1848C956F0BD04F604554FE699CFCF7768B6A07F76ABEC7AA3A0E06F7D22E32E1F++