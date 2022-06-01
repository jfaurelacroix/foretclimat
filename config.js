(function () {

  /***************************************
   * Modify this path based on your setup
   ***************************************/
  var pathParts = window.location.pathname.split("/").filter(function (part) {
    return part;
  } );

  var context = pathParts && pathParts.length && pathParts[0] !== "home" ? pathParts[0] : "/";
  if (context !== "/") {
    context = "/" + context + "/";
  }

  var DEPLOY_ROOT = location.protocol + "//" + location.host + context + "home/";


  window.esriGeowConfig = {

    /***************************************
     * Basics
     ***************************************/
    baseUrl: DEPLOY_ROOT,
    webmapViewerPath: "webmap/viewer.html",
    dojoBaseUrl: DEPLOY_ROOT + "/js/dojo/",
    proxyUrl: "",
    proxyServer: location.protocol + "//" + location.host + context + "sharing/proxy",
    restBaseUrl: location.protocol + "//" + location.host + context + "sharing/rest/",
    portalAdminBaseUrl: location.protocol + "//" + location.host + context + "portaladmin",
    enterpriseAdminBaseUrl: location.protocol + "//" + location.host + context + "admin",
    reflectorUrl: location.protocol + "//" + location.host +  context + "sharing/tools/reflect",
    bridgeUrl: location.protocol + "//" + location.host + context + "sharing/tools/bridge",
    marketplaceUrl: location.protocol + "//" + "marketplacedevext.arcgis.com",
    storymapsUrl: location.protocol + "//" + location.host + context + "apps/storymaps",
    openDataUrl: location.protocol + "//" + "opendatadev.arcgis.com/sites",
    kmlService: location.protocol + "//" + location.host + context + "sharing/kml",
    geoRSSService: location.protocol + "//" + location.host + context + "sharing/rss",
    geoIPService: location.protocol + "//" + location.host + context + "sharing/geoip.jsp",
    print: location.protocol + "//" + location.host + context + "sharing/tools/print",
    legend: location.protocol + "//" + location.host + context + "sharing/tools/legend",
    createImageryContentUrl: location.protocol + "../apps/orthomaker/#/createcontent",
    imageManagementUrl: location.protocol + "../apps/orthomaker/#/managedata",
    manageAreasUrl: "../apps/preplanned/preplanned.html?webmap=",
    rasterFunctionEditor: location.protocol + "../../apps/rasterfunctioneditor/index.html",
    surveyUrl: location.protocol + "//" + "survey123.arcgis.com",
    insightsUrl: location.protocol + "//" + location.host + context + "apps/insights",
    urbanUrl: location.protocol + "//" + "urban.arcgis.com",
    webExperienceUrl: location.protocol + "//" + location.host + context + "apps/experiencebuilder/builder/?page=template",
    iotViewerUrl: location.protocol + "//" +  "velocity.arcgis.com",
    newMapViewerUrl: location.protocol + "//" + location.host + context + "apps/mapviewer/index.html",
    enterpriseHelpUrl: "https://enterprise.arcgis.com/",
    kubernetesHelpUrl: "https://enterprise-k8s.arcgis.com/en/",
    isRightToLeft: false,
    cdnServerUrl: ".",
    notebookLandingEnabled: true, // feature toggle for notebook landing page

    // services with these domains will be switched to https if the map viewer is running under https and also count as federated servers with AGOL
    httpsDomains: ["arcgis.com","arcgisonline.com","esrikr.com","premiumservices.blackbridge.com","esripremium.accuweather.com","gbm.digitalglobe.com","firstlook.digitalglobe.com","msi.digitalglobe.com"],
    // whitelist of domains an embedded viewer accepts postMessages from, other than its own; e.g. ["mydomain.com","mydomain2.com"]
    embeddedViewerWhitelist: null,

    /***************************************
     * ArcGIS portal settings
     ***************************************/
    portalName: "Passerelle Forêt-Climat", // used as the initial default name during page load
    portalHeaderImage: "https://www.foretmontmorency.ca/assets/documents/slider/images/rivieremontmorency.jpg",
    explorerName: null,
    tokenExpiration: 120,
    longTokenExpiration: 20160,
    esriGlobalAccount: null,
    useDefaultIdentityStore: true,
    signin: "signin.html",
    signup: "signup.html",
    createAccount: "createaccount.html",
    showSocialMediaLinks: true,
    addContentSecurityText: null,
    showCoachMarksTours: true,
    bingMapsKey: "abc",
    contentPageHiddenTypes: ["Featured Items",null],
    showForgotUsername: false,
    isMultiTenant: false,
    searchArcGISOnlineEnabled: true,
    federatedServerConfigEnabled: true,
    hostedServerConfigEnabled: true,
    webAppBuilderEnabled: true,
    webExperienceEnabled: true,
    sceneViewerEnabled: true,
    restrictOrganizationPageToAdmin: false,
    geocodeAutoComplete: true, // enable suggest [true|false]
    portalAGOConfigEnabled: true, // on-premise hybrid Portal feature, should be false for AGO and disconnected Portal environments
    portalLivingAtlasConfigEnabled: true, // on-premise hybrid Portal feature, should be false for AGO and disconnected Portal environments
    configurePortalAGOEnv: "www.arcgis.com", // on-premise Portal flag to configure AGO environment to connect to for configuring utility services, living atlas content.
    creditBudgetingEnabled: false, // hide/show credit budgeting related UI in the app,
    collaborationsEnabled: true, // hide/show collaborations UI
    showAnalysisHistory: false,  // To show analysis history List UI
    showNewAnalysisSettings: true, //To show analysis settings experimental feature
    tilesOnDemandEnabled: false, // hide/show tiles on demand UI for tiles published from features
    refreshTilesEnabled: false, // hide/show refresh tiles UI for tiles published from features
    systemUsers: ["esri_nav","system_publisher", "esri_livingatlas", "esri_boundaries", "esri_demographics"], // on-premise Portal list of system users to filter out of user searches
    usageTrackingEnabled: true, // Allow/deny usage tracking to be configured by Online organizations
    notebookServerEnabled: true, // hide/show UI for notebooks
    notebookOpenMaxRequests: 40, // the maximum request limit to poll the openNotebook job
    bulkPublishingEnabled: true, // hide/show UI for bulk publishing
    trackViewerEnabled: true, // hide/show the Track Viewer app in app launcher
    locationTrackingUIEnabled: true, // hide/show the Location Tracking UI in organization settings
    missionServerEnabled: true, // hide/show UI for mission server
    workflowManagerServerEnabled: true, // hide/show UI for workflow manager server
    newMapViewerEnabled: false, // hide/show the new Map Viewer application and UI
    semanticSearchEnabled: false, // hide/show the semantic search UI
    solutionsEnabled: false, //feature toggle for ArcGIS Solutions

    //hide fields view in data tab if true
    hideFieldsViewInDataTab: false,
    /***************************************
     * AppSwitcher and AccountSwitcher
     ***************************************/
    appSwitcherConfigItemQuery: "owner:esri AND title:\"AppSwitcher Config\" AND type: \"Application Configuration\"",
    licensesItemQuery: "owner:\"esri\" AND title:\"Licenses Config\" AND type: \"Application Configuration\"",
    showAccountSwitcher: false,

    showCreateDashboard: true,
    showInAppLauncher: ["ArcGIS Dashboards", "ArcGIS Enterprise Sites", "Track Viewer", "Ortho Maker", "ArcGIS Workforce", "ArcGIS QuickCapture Web Designer", "ArcGIS StoryMaps", "ArcGIS Experience Builder", "ArcGIS Field Maps"],

    /***************************************
     * Links
     ***************************************/
    bitlyUrl: null,
    bitlyUrlSSL: null,
    gcsBasemapService: location.protocol + "//services.arcgisonline.com/ArcGIS/rest/services/ESRI_Imagery_World_2D/MapServer",
    extentService: location.protocol + "//services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
    account_edit: "https://webaccounts.esri.com/CAS/index.cfm?fuseaction=Profile.showForm",
    forgotPwd: "https://webaccounts.esri.com/cas/index.cfm?fuseaction=Login.ForgotPwd.ShowForm&appId=RC10SB959G&FailURL=http%3A%2F%2Fwww.arcgis.com&ReturnURL=https%3A%2F%2Fwww.arcgis.com%2Fhome%2Fsignin.html",
    forums: "http://forums.arcgis.com/forums/30-ArcGIS-Online",
    blog: "http://blogs.esri.com/esri/arcgis/category/arcgis-online/",
    esriCommunityLink: "https://geonet.esri.com",
    myEsriLink: "https://my.esri.com",
    learnArcGIS: "http://learn.arcgis.com",
    footerLinks: [{
      title: "ULaval",
      url: "https://www.ulaval.ca"
    }, {
      title: "Contact Us",
      email: "feedback@myorganiz.com",
      type: "contactUs"
    }],
arcadeEditor: (location.protocol === 'file:' ? 'http:' : location.protocol) +
'//' + location.host +
((window.location.href.substring(window.location.href.indexOf(window.location.host) +
window.location.host.length + 1,
window.location.href.indexOf("/home")) != "/")
? "/" +
window.location.href.substring(window.location.href.indexOf(window.location.host)
+ window.location.host.length + 1, window.location.href.indexOf("/home")) : "")
+ "/home/arcade-editor/index.html",
    openTrackViewer: location.protocol + "//" + location.host + context + "apps/trackviewer",
    vectorTileStyleEditor: location.protocol + "//" + location.host + context + "apps/vtseditor/",
    vectorTileStylePreview: location.protocol + "//" + location.host + context + "apps/preplanned/vectorTileStylePreview.html",

    /***************************************
     * Specific groups and owners
     ***************************************/
    //*** Esri user names
    publisherESRI: "(owner:esri OR owner:esri_webapi OR owner:arcgis_explorer OR owner:SLDevTeam OR owner:ArcGISMobileDevTeam OR owner:iOSDevelopmentTeam)",

    /*******************************************************************************
     *******************************************************************************
     * DO NOT MODIFY these following parameters
     *******************************************************************************
     *******************************************************************************/
    userInfo: "",

    googleServiceSearchString: "inurl:rest inurl:services \"Supported Interfaces\" -\"Folders\" -\"KMZ\" -\"GlobeServer\" -\"NAServer\" -\"GPServer\" -\"GeocodeServer\" -\"GeoDataServer\" -\"GeometryServer\"",

    contentModeCookieName: "contentModePrefs",

    //*** search modes (all content, web content only)
    viewQueries: {
      web: " -type:\"Layer\" -type: \"Map Document\" -type:\"Map Package\" -type:\"Basemap Package\" -type:\"Mobile Basemap Package\" -type:\"Mobile Map Package\" -type:\"ArcPad Package\" -type:\"Project Package\" -type:\"Project Template\" -type:\"Desktop Style\" -type:\"Pro Map\" -type:\"Layout\" -type:\"Explorer Map\" -type:\"Globe Document\" -type:\"Scene Document\" -type:\"Published Map\" -type:\"Map Template\" -type:\"Windows Mobile Package\" -type:\"Layer Package\" -type:\"Explorer Layer\" -type:\"Geoprocessing Package\" -type:\"Desktop Application Template\" -type:\"Code Sample\" -type:\"Geoprocessing Package\" -type:\"Geoprocessing Sample\" -type:\"Locator Package\" -type:\"Workflow Manager Package\" -type:\"Windows Mobile Package\" -type:\"Explorer Add In\" -type:\"Desktop Add In\" -type:\"File Geodatabase\" -type:\"Feature Collection Template\" -type:\"Map Area\" -typekeywords:\"MapAreaPackage\"",
      gis: " -type:\"Code Attachment\" -type:\"Featured Items\" -type:\"Symbol Set\" -type:\"Color Set\" -type:\"Windows Viewer Add In\" -type:\"Windows Viewer Configuration\" -type:\"Map Area\" -typekeywords:\"MapAreaPackage\"",
      none: " -type:\"Code Attachment\" -type:\"Featured Items\" -type:\"Symbol Set\" -type:\"Color Set\" -type:\"Windows Viewer Add In\" -type:\"Windows Viewer Configuration\" -type:\"Map Area\" -typekeywords:\"MapAreaPackage\""
    },

    //*** key-value pairs or pre-defined query filters on search results page
    filterQueries: {
      "all": {
        focus: null,
        t: "content",
        f: ""
      },
      "maps": {
        focus: "maps",
        t: "content",
        f: "-type:\"web mapping application\" -type:\"Layer Package\" (type:\"Project Package\" OR type:\"Windows Mobile Package\" OR type:\"Map Package\" OR type:\"Basemap Package\" OR type:\"Mobile Basemap Package\" OR type:\"Mobile Map Package\" OR type:\"Pro Map\" OR type:\"Project Package\" OR type:\"Web Map\" OR type:\"CityEngine Web Scene\" OR type:\"Map Document\" OR type:\"Globe Document\" OR type:\"Scene Document\" OR type:\"Published Map\" OR type:\"Explorer Map\" OR type:\"ArcPad Package\" OR type:\"Map Template\")"
      },
      "scenes": {
        focus: "scenes",
        t: "content",
        f: "-type:\"CityEngine Web Scene\" (type:\"Web Scene\")"
      },
      "layers": {
        focus: "layers",
        t: "content",
        f: "-type:\"web mapping application\" -type:\"Geodata Service\" (type:\"Scene Service\" OR type: \"Feature Collection\" OR type: \"Route Layer\" OR type:\"Layer\" OR type: \"Explorer Layer\" OR type: \"Tile Package\" OR type:\"Vector Tile Package\" OR type: \"Scene Package\" OR type:\"Layer Package\" OR type:\"Feature Service\" OR type:\"Stream Service\" OR type:\"Map Service\" OR type:\"Vector Tile Service\" OR type:\"Image Service\" OR type:\"WMS\" OR type:\"WFS\" OR type:\"WMTS\"  OR type:\"KML\" OR typekeywords:\"OGC\" OR typekeywords:\"Geodata Service\" OR type:\"Globe Service\" OR type:\"CSV\" OR type: \"Shapefile\" OR type: \"GeoJson\" OR type: \"Service Definition\" OR type: \"File Geodatabase\" OR type: \"CAD Drawing\" OR type: \"Relational Database Connection\")"
      },
      "applications": {
        focus: "applications",
        t: "content",
        f: "(type:\"Code Sample\" OR type:\"Web Mapping Application\" OR type:\"Mobile Application\" OR type:\"Application\" OR type:\"Desktop Application Template\" OR type:\"Desktop Application\" OR type:\"Operation View\" OR type:\"Dashboard\" OR type:\"Operations Dashboard Extension\" OR type:\"Workforce Project\" OR type:\"Insights Workbook\" OR type:\"Insights Page\" OR type:\"Insights Model\" OR type:\"Hub Initiative\" OR type:\"Hub Site Application\" OR type:\"Hub Page\")"
      },
      "tools": {
        focus: "tools",
        t: "content",
        f: "-type:\"KML\" (typekeywords:\"tool\" OR type:\"Raster function template\" OR type:\"Geodata Service\" OR type: \"Workflow Manager Package\" OR type:\"Rule Package\" OR type:\"Operations Dashboard Add In\" OR type:\"Workflow Manager Service\" OR type:\"ArcGIS Pro Configuration\")"
      },
      "files": {
        focus: "files",
        t: "content",
        f: "(typekeywords:\"Document\" OR type:\"Image\" OR type:\"Layout\" OR type:\"Desktop Style\" OR type:\"Project Template\" OR type:\"Report Template\" OR type:\"Statistical Data Collection\" OR type:\"360 VR Experience\") -type:\"Map Document\" -type:\"Image Service\" -type:\"Explorer Document\" -type:\"Explorer Map\" -type:\"Globe Document\" -type:\"Scene Document\""
      },
      "maps-webmaps": {
        focus: "maps",
        t: "content",
        f: "(type:\"Web Map\" OR type:\"CityEngine Web Scene\") -type:\"Web Mapping Application\" -(owner:\"esri\" tags:\"basemap\")"
      },
      "maps-mapfiles": {
        focus: "maps",
        t: "content",
        f: "(type:\"Map Document\" OR type:\"Windows Mobile Package\" OR type:\"Globe Document\" OR type:\"Scene Document\"  OR type:\"Published Map\" OR type:\"Explorer Map\" OR type:\"ArcPad Package\" OR type:\"Map Package\" OR type:\"Basemap Package\" OR type:\"Mobile Basemap Package\" OR type:\"Mobile Map Package\" OR type:\"Pro Map\" OR type:\"Project Package\" OR type:\"Map Template\")"
      },
      "maps-mapservices": {
        focus: "maps",
        t: "content",
        f: "(type:\"WMS\" OR type:\"WMTS\" OR type:\"KML\" OR type:\"Map Service\" OR type:\"Image Service\" OR type:\"Feature Service\" OR type:\"Globe Service\")"
      },
      "maps-packages": {
        focus: "maps",
        t: "content",
        f: "(type:\"Layer Package\" OR type:\"Map Package\" OR type:\"Basemap Package\" OR type:\"Mobile Basemap Package\" OR type:\"Mobile Map Package\" OR type:\"Project Package\" OR type:\"Tile Package\" OR type:\"Scene Package\")"
      },
      "maps-others": {
        focus: "maps",
        t: "content",
        f: "(type:\"Shapefile\" OR type:\"GeoJson\" OR type:\"CSV\" OR type:\"Explorer Map\" OR type:\"Map Document\" OR type:\"Globe Document\" OR type:\"Scene Document\" OR type:\"Layer\" OR type:\"Explorer Layer\" OR type:\"Explorer Map\" OR type:\"Published Map\" OR type:\"CAD Drawing\") -type:\"Layer Package\""
      },
      "maps-packages-layer": {
        focus: "maps",
        t: "content",
        f: "type:\"Layer Package\""
      },
      "maps-packages-map": {
        focus: "maps",
        t: "content",
        f: "type:\"Map Package\""
      },
      "layers-weblayers": {
        focus: "layers",
        t: "content",
        f: "(type:\"Feature Collection\" OR type:\"Feature Service\" OR type:\"Image Service\" OR type:\"Map Service\" OR type:\"Vector Tile Service\" OR type:\"Scene Service\" OR type:\"Stream Service\" OR type: \"WMS\" OR type: \"WMTS\" OR type: \"WFS\"  OR type: \"KML\") -type:\"Web Map\" -type:\"Web Mapping Application\" -type:\"Shapefile\""
      },
      "layers-weblayers-features": {
        focus: "layers",
        t: "content",
        f: "(type:\"Feature Collection\" OR type:\"Feature Service\" OR type:\"Stream Service\" OR type:\"WFS\") -typekeywords:\"Table\""
      },
      "layers-weblayers-imagery": {
        focus: "layers",
        t: "content",
        f: "(type:\"Image Service\")"
      },
      "layers-weblayers-tiles": {
        focus: "layers",
        t: "content",
        f: "(type:\"WMTS\" OR type:\"Map Service\" OR type:\"Vector Tile Service\") (typekeywords: \"Hosted\" OR typekeywords:\"Tiled\")"
      },
      "layers-weblayers-mapimage": {
        focus: "layers",
        t: "content",
        f: "(type:\"Map Service\"  OR type: \"WMS\") -typekeywords:\"Tiled\" -typekeywords:\"Hosted\" -type:\"Web Map\" -type:\"Web Mapping Application\" -type:\"Shapefile\""
      },
      "layers-layerfiles": {
        focus: "layers",
        t: "content",
        f: "(type: \"Layer\" OR type: \"Explorer Layer\" OR type: \"Tile Package\" OR type:\"Vector Tile Package\" OR type: \"Scene Package\" OR type:\"Layer Package\" OR type:\"CSV\" OR type: \"Shapefile\" OR type: \"GeoJson\" OR type: \"Service Definition\" OR type: \"File Geodatabase\" OR type: \"CAD Drawing\") -type:\"Explorer Maps\" -type:\"Map Documents\""
      },
      "layers-weblayers-scenelayers": {
        focus: "layers",
        t: "content",
        f: "(type:\"Scene Service\")"
      },
      "layers-weblayers-tables": {
        focus: "layers",
        t: "content",
        f: "(typekeywords:\"Table\")"
      },
      "applications-web": {
        focus: "applications",
        t: "content",
        f: "(type:\"Web Mapping Application\" OR type:\"Dashboard\")"
      },

      "applications-web-flex": {
        focus: "applications",
        t: "content",
        f: "(type:\"Web Mapping Application\" typekeywords:\"Flex\")"
      },
      "applications-web-flex-readytouse": {
        focus: "applications",
        t: "content",
        f: "(type:\"Web Mapping Application\" AND typekeywords:\"Flex\" AND typekeywords:\"Ready To Use\")"
      },
      "applications-web-flex-configurable": {
        focus: "applications",
        t: "content",
        f: "(type:\"Web Mapping Application\" AND typekeywords:\"Flex\" AND typekeywords:\"Configurable\")"
      },
      "applications-web-flex-codesample": {
        focus: "applications",
        t: "content",
        f: "(type:\"Web Mapping Application\" AND typekeywords:\"Flex\" AND typekeywords:\"Code Sample\")"
      },

      "applications-web-javascript": {
        focus: "applications",
        t: "content",
        f: "(type:\"Web Mapping Application\" AND typekeywords:\"Javascript\")"
      },
      "applications-web-javascript-readytouse": {
        focus: "applications",
        t: "content",
        f: "(type:\"Web Mapping Application\" AND typekeywords:\"Javascript\" AND typekeywords:\"Ready To Use\")"
      },
      "applications-web-javascript-configurable": {
        focus: "applications",
        t: "content",
        f: "(type:\"Web Mapping Application\" AND typekeywords:\"Javascript\" AND typekeywords:\"Configurable\")"
      },
      "applications-web-javascript-codesample": {
        focus: "applications",
        t: "content",
        f: "(type:\"Web Mapping Application\" AND typekeywords:\"Javascript\" AND typekeywords:\"Code Sample\")"
      },

      "applications-web-silverlight": {
        focus: "applications",
        t: "content",
        f: "(type:\"Web Mapping Application\" AND typekeywords:\"Silverlight\")"
      },
      "applications-web-silverlight-readytouse": {
        focus: "applications",
        t: "content",
        f: "(type:\"Web Mapping Application\" AND typekeywords:\"Silverlight\" AND typekeywords:\"Ready To Use\")"
      },
      "applications-web-silverlight-configurable": {
        focus: "applications",
        t: "content",
        f: "(type:\"Web Mapping Application\" AND typekeywords:\"Silverlight\" AND typekeywords:\"Configurable\")"
      },
      "applications-web-silverlight-codesample": {
        focus: "applications",
        t: "content",
        f: "(type:\"Web Mapping Application\" AND typekeywords:\"Silverlight\" AND typekeywords:\"Code Sample\")"
      },

      "applications-mobile": {
        focus: "applications",
        t: "content",
        f: "type:\"Mobile Application\""
      },

      "applications-mobile-iphone": {
        focus: "applications",
        t: "content",
        f: "(type:\"Mobile Application\" AND typekeywords:\"ArcGIS for iPhone\")"
      },
      "applications-mobile-iphone-readytouse": {
        focus: "applications",
        t: "content",
        f: "(type:\"Mobile Application\" AND typekeywords:\"ArcGIS for iPhone\" AND typekeywords:\"Ready To Use\")"
      },
      "applications-mobile-iphone-configurable": {
        focus: "applications",
        t: "content",
        f: "(type:\"Mobile Application\" AND typekeywords:\"ArcGIS for iPhone\" AND typekeywords:\"Configurable\")"
      },
      "applications-mobile-iphone-codesample": {
        focus: "applications",
        t: "content",
        f: "(type:\"Mobile Application\" AND typekeywords:\"ArcGIS for iPhone\" AND typekeywords:\"Code Sample\")"
      },

      "applications-mobile-windowsmobile": {
        focus: "applications",
        t: "content",
        f: "(type:\"Mobile Application\" AND typekeywords:\"Windows Mobile\")"
      },
      "applications-mobile-windowsmobile-readytouse": {
        focus: "applications",
        t: "content",
        f: "(type:\"Mobile Application\" AND typekeywords:\"Windows Mobile\" AND typekeywords:\"Ready To Use\")"
      },
      "applications-mobile-windowsmobile-configurable": {
        focus: "applications",
        t: "content",
        f: "(type:\"Mobile Application\" AND typekeywords:\"Windows Mobile\" AND typekeywords:\"Configurable\")"
      },
      "applications-mobile-windowsmobile-codesample": {
        focus: "applications",
        t: "content",
        f: "(type:\"Mobile Application\" AND typekeywords:\"Windows Mobile\" AND typekeywords:\"Code Sample\")"
      },

      "applications-mobile-windowsphone": {
        focus: "applications",
        t: "content",
        f: "(type:\"Mobile Application\" AND typekeywords:\"Windows Phone\")"
      },
      "applications-mobile-windowsphone-readytouse": {
        focus: "applications",
        t: "content",
        f: "(type:\"Mobile Application\" AND typekeywords:\"Windows Phone\" AND typekeywords:\"Ready To Use\")"
      },
      "applications-mobile-windowsphone-configurable": {
        focus: "applications",
        t: "content",
        f: "(type:\"Mobile Application\" AND typekeywords:\"Windows Phone\" AND typekeywords:\"Configurable\")"
      },
      "applications-mobile-windowsphone-codesample": {
        focus: "applications",
        t: "content",
        f: "(type:\"Mobile Application\" AND typekeywords:\"Windows Phone\" AND typekeywords:\"Code Sample\")"
      },

      "applications-mobile-android": {
        focus: "applications",
        t: "content",
        f: "(type:\"Mobile Application\" AND typekeywords:\"Android\")"
      },
      "applications-mobile-android-readytouse": {
        focus: "applications",
        t: "content",
        f: "(type:\"Mobile Application\" AND typekeywords:\"Android\" AND typekeywords:\"Ready To Use\")"
      },
      "applications-mobile-android-configurable": {
        focus: "applications",
        t: "content",
        f: "(type:\"Mobile Application\" AND typekeywords:\"Android\" AND typekeywords:\"Configurable\")"
      },
      "applications-mobile-android-codesample": {
        focus: "applications",
        t: "content",
        f: "(type:\"Mobile Application\" AND typekeywords:\"Android\" AND typekeywords:\"Code Sample\")"
      },

      "applications-mobile-javascript": {
        focus: "applications",
        t: "content",
        f: "(type:\"Mobile Application\" AND typekeywords:\"JavaScript\")"
      },
      "applications-mobile-javascript-readytouse": {
        focus: "applications",
        t: "content",
        f: "(type:\"Mobile Application\" AND typekeywords:\"JavaScript\" AND typekeywords:\"Ready To Use\")"
      },
      "applications-mobile-javascript-configurable": {
        focus: "applications",
        t: "content",
        f: "(type:\"Mobile Application\" AND typekeywords:\"JavaScript\" AND typekeywords:\"Configurable\")"
      },
      "applications-mobile-javascript-codesample": {
        focus: "applications",
        t: "content",
        f: "(type:\"Mobile Application\" AND typekeywords:\"JavaScript\" AND typekeywords:\"Code Sample\")"
      },

      "applications-mobile-flex": {
        focus: "applications",
        t: "content",
        f: "(type:\"Mobile Application\" AND typekeywords:\"Flex\")"
      },
      "applications-mobile-flex-readytouse": {
        focus: "applications",
        t: "content",
        f: "(type:\"Mobile Application\" AND typekeywords:\"Flex\" AND typekeywords:\"Ready To Use\")"
      },
      "applications-mobile-flex-configurable": {
        focus: "applications",
        t: "content",
        f: "(type:\"Mobile Application\" AND typekeywords:\"Flex\" AND typekeywords:\"Configurable\")"
      },
      "applications-mobile-flex-codesample": {
        focus: "applications",
        t: "content",
        f: "(type:\"Mobile Application\" AND typekeywords:\"Flex\" AND typekeywords:\"Code Sample\")"
      },

	  "applications-desktop": {
        focus: "applications",
        t: "content",
        f: "(type:\"Desktop Application\" -type:\"Desktop Application Template\")"
      },

	  "applications-desktop-java": {
        focus: "applications",
        t: "content",
        f: "(type:\"Desktop Application\" AND typekeywords:\"Java\")"
      },

	  "applications-desktop-dotnet": {
        focus: "applications",
        t: "content",
        f: "(type:\"Desktop Application\" AND typekeywords:\".NET-Windows Desktop\")"
      },

	  "applications-desktop-osx": {
        focus: "applications",
        t: "content",
        f: "(type:\"Desktop Application\" AND typekeywords:\"OS X\")"
      },

	  "applications-desktop-qt": {
        focus: "applications",
        t: "content",
        f: "(type:\"Desktop Application\" AND typekeywords:\"Qt\")"
      },

	  "applications-desktop-wpf": {
        focus: "applications",
        t: "content",
        f: "(type:\"Desktop Application\" AND typekeywords:\"WPF\")"
      },

      "tools-locators": {
        focus: "tools",
        t: "content",
        f: "(type:\"Geocoding Service\" OR type:\"Locator Package\")"
      },
      "tools-geodatabase": {
        focus: "tools",
        t: "content",
        f: "type:\"Geodata Service\""
      },
      "tools-geometric": {
        focus: "tools",
        t: "content",
        f: "type:\"Geometry Service\""
      },
      "tools-geoprocessing": {
        focus: "tools",
        t: "content",
        f: "(type:\"Geoprocessing Service\" OR type:\"Geoprocessing Package\" OR type:\"Geoprocessing Sample\")"
      },
      "tools-network": {
        focus: "tools",
        t: "content",
        f: "type:\"Network Analysis Service\""
      },
      "files-document": {
        focus: "files",
        t: "content",
        f: "(typekeywords:\"Document\") -type:\"PDF\""
      },
      "files-pdf": {
        focus: "files",
        t: "content",
        f: "(type:\"PDF\")"
      },
      "files-image": {
        focus: "files",
        t: "content",
        f: "(type:\"Image\" OR type:\"360 VR Experience\") -type:\"Image Service\""
      }
    }
  };

  window.dojoConfig = {
    parseOnLoad: true,
    isDebug: false,
    addOnLoad: function () {
      // ensure the <html> tag's lang attribute is set to the locale in use for accessibility (e.g., screen readers)
      document.getElementsByTagName("html")[0].setAttribute("lang", window.dojoConfig.locale);

      esriGeowConfig.cdnServerUrl = dojo.baseUrl.substring(0, dojo.baseUrl.indexOf("/js"));
      console.log("cdn server url: ", esriGeowConfig.cdnServerUrl);
    },
    has: {
      "dojo-bidi": true,
      "esri-featurelayer-webgl": 1
    },
    packages: [
      {
        name: "dojo",
        location: "../../jsapi/dojo"
      },
      {
        name: "dojox",
        location: "../../jsapi/dojox"
      },
      {
        name: "dijit",
        location: "../../jsapi/dijit"
      },
      {
        name: "esri",
        location: "../../jsapi/esri"
      },
      {
        name: "dgrid",
        location: "../../jsapi/dgrid"
      },
      {
        name: "dgrid1",
        location: "../../jsapi/dgrid1"
      },
      {
        name: "dstore",
        location: "../../jsapi/dstore"
      },
      {
        name: "put-selector",
        location: "../../jsapi/put-selector"
      },
      {
        name: "xstyle",
        location: "../../jsapi/xstyle"
      },
      {
        name: "arcgisonline",
        location: "../../arcgisonline"
      },
      {
        name: "moment",
        location:"../../jsapi/moment"
      },
      {
        name: "calcite-web",
        location:"../../calcite-web/dist"
      },
      {
        name: "telemetry",
        location: "../../arcgis-telemetry.js/dist"
      },
      {
        name: "esri-global-nav",
        location: "../../esri-global-nav/dist"
      },
      {
        name: "dragula",
        location: "../../dragula/dist"
      },
      {
        name: "arcgis-components",
        location: "../../arcgis-components/dist"
      },
      {
        name: "webpack-bundles",
        location: "../../webpack-bundles"
      },
      {
        name: "taginsert",
        location: "../../taginsert/dist"
      },
      {
        name: "preact",
        location: "../../preact",
        main: "preact"
      },
      {
        name: "markdown-it",
        location: "../../markdown-it/dist",
        main: "markdown-it"
      },
      {
        name: "arcgis-raster-function-editor",
        location: DEPLOY_ROOT + "../apps/rasterfunctioneditor/js"
      },
      {
        name: "azure-storage-blob",
        location: "../../azure-storage-blob",
        main: "index"
      }
    ]

  };

}());



//anonymous function call for reading locale cookie and setting rtl logic
(function () {

  // Read a page's GET URL variables and return them as an associative array.
  function getUrlVars () {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split("=");
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }

  // Set the Dojo config locale
  function setDojoLocale (locale) {
    if (locale === "hi") {
      window.dojoConfig.locale = "en";
    } else {
      window.dojoConfig.locale = locale;
    }
  }

  //esriGeowConfig.testLocale = "ar"; // this is the test locale response from self resource call

  //reading locale
  var nameEQ = "arcgisLocale" + "=";
  var sessionCookie = "esri_auth" + "=";
  var ca = document.cookie.split(";");
  var qsLocale = getUrlVars()["lang"];
  var locale = qsLocale || (navigator.language ? navigator.language : navigator.userLanguage);  //default dojoConfig.locale to browser language when no cookie present
  var rtlLocales = ["ar", "he"];
  var i = 0;

  if (locale) {
    window.dojoConfig.locale = locale.toLowerCase();
  }
  loop1:
    for (i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(sessionCookie) == 0) {
        var sValue = unescape(c.substring(sessionCookie.length, c.length));
        var userObj = JSON.parse(sValue);
        locale = userObj.culture;
        if (locale) {
          setDojoLocale(locale.toLowerCase()); // change dojoConfig.locale to the cookie locale when cookie is present
        }
        break loop1;
      }
      if (c.indexOf(nameEQ) == 0) {
        locale = c.substring(nameEQ.length, c.length);
        if (locale) {
          setDojoLocale(locale.toLowerCase()); // change dojoConfig.locale to the cookie locale when cookie is present
        }
      }
    }

  // &locale=<lang code>, overwrites language of page
  if (document.URL.indexOf("locale") > -1) {
    var getValue = function (str, search) {
      var s = str.indexOf("&" + search + "=", 0);
      if (s == -1) {
        s = str.indexOf("?" + search + "=", 0);
      }
      if (s == -1) {
        return null;
      }
      var e = str.indexOf("&", s + 2);
      if (e == -1) {
        e = str.indexOf("#", s + 2);
      }
      if (e == -1) {
        e = str.length;
      }
      return str.substring(s + search.length + 2, e);
    };

    var val = getValue(document.URL, "locale");
    if (val) {
      locale = val.toLowerCase();
      setDojoLocale(locale);
    }
  }

  for (i = 0; i < rtlLocales.length; i++) {
    var rLocale = rtlLocales[i];
    if (window.dojoConfig.locale && window.dojoConfig.locale.indexOf(rLocale) !== -1) {
      if (window.dojoConfig.locale.indexOf("-") !== -1) {
        if (window.dojoConfig.locale.indexOf(rLocale + "-") !== -1) {
          esriGeowConfig.isRightToLeft = true;
        }
      } else {
        esriGeowConfig.isRightToLeft = true; // esriGeowConfig.isRightToLeft property setting to true when the locale is 'ar'
      }
    }
  }

  //setting the document dir type to RTL when esriGeowConfig.isRightToLeft is true
  var dirNode = document.getElementsByTagName("html")[0];
  if (esriGeowConfig.isRightToLeft) {
    dirNode.setAttribute("dir", "rtl");
    dirNode.className += " esriRtl";
    dirNode.className += " " + window.dojoConfig.locale + " " + (window.dojoConfig.locale.indexOf("-") !== -1 ? window.dojoConfig.locale.split("-")[0] : "");
  } else {
    dirNode.setAttribute("dir", "ltr");
    dirNode.className += " esriLtr";
    dirNode.className += " " + window.dojoConfig.locale + " " + (window.dojoConfig.locale.indexOf("-") !== -1 ? window.dojoConfig.locale.split("-")[0] : "");
  }

  // webGL URL parameters
  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) == variable) {
        return decodeURIComponent(pair[1]);
      }
    }
  }
  if (getQueryVariable("webgl") == "false") {
    window.dojoConfig.has["esri-featurelayer-webgl"] = 0;
  } else {
    var maxDrillLevel = Number(getQueryVariable("maxDrillLevel"));
    var maxRecordCountFactor = Number(getQueryVariable("maxRecordCountFactor"));
    if (!isNaN(maxDrillLevel) && !isNaN(maxRecordCountFactor)) {
      window.dojoConfig.has["esri-featurelayer-webgl"] = {
        "maxDrillLevel": maxDrillLevel,
        "maxRecordCountFactor": maxRecordCountFactor
      };
    } else if (!isNaN(maxDrillLevel)) {
      window.dojoConfig.has["esri-featurelayer-webgl"] = {
        "maxDrillLevel": maxDrillLevel
      };
    } else if (!isNaN(maxRecordCountFactor)) {
      window.dojoConfig.has["esri-featurelayer-webgl"] = {
        "maxRecordCountFactor": maxRecordCountFactor
      };
    }
  }

})();
