#!/usr/bin/env node

var fs = require("fs"),
    path = require("path");

var rootdir = process.argv[2];
if (rootdir) {

    module.exports = function(context) {

        var cordova_util = context.requireCordovaModule("cordova-lib/src/cordova/util"),
            ConfigParser = context.requireCordovaModule("cordova-common").ConfigParser,
            projectRoot = cordova_util.isCordova(),
            xml = cordova_util.projectConfig(projectRoot),
            cfg = new ConfigParser(xml);


        var getProjectFile = function(platform, relPath) {
            return path.join(projectRoot, "platforms", platform, cfg.name(), relPath);
        };

        var replace = function(path, to_replace, replace_with) {
            var data = fs.readFileSync(path, "utf8");
            var result = data.replace(to_replace, replace_with);
            fs.writeFileSync(path, result, "utf8");
        };

        var updateIOSAppDelegate = function() {
            var appDelegate = getProjectFile("ios", "Classes/AppDelegate.m");
            var plugins = cfg.getPlatformPreference("tabris-plugins", "ios");
            if(typeof plugins !== "undefined" && plugins.length > 0 ) {
                var importReplace = "#import \"AppDelegate.h\"";
                var registerReplace = "self.client.delegate = self;";
                plugins.split(',').forEach(function(plugin){
                    replace(appDelegate, importReplace, importReplace + "\n#import \"" + plugin + ".h\"");
                    replace(appDelegate, registerReplace, "[self.client addRemoteObject:[" + plugin + " class]];" + "\n" + registerReplace);
                });
            }
        };

        context.opts.platforms.forEach(function(platform) {
            if (platform.indexOf("ios") > -1 ) {
                updateIOSAppDelegate();
            }
        });

    };

}