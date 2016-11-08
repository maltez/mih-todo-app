const ApplicationConfiguration = (() => {
  const appName = 'mih';
  const vendors = [
    'ngResource',
    'ngAnimate',
    'ui.router',
    'ui.bootstrap',
    'ui.utils',
    'ui-notification',
    'angularFileUpload',
    'modelOptions',
    'rzModule'
  ];
  const  registerModule = (moduleName, dependencies) => {
    // Create angular module
    angular.module(moduleName, dependencies || []);
    // Add the module to the AngularJS configuration file
    angular.module(appName).requires.push(moduleName);
  };

  return {
    applicationModuleName: appName,
    applicationModuleVendorDependencies: vendors,
    registerModule
  };
})();
