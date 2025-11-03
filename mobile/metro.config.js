const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../');

const config = getDefaultConfig(projectRoot);

// Ensure Metro only resolves from the mobile directory
config.projectRoot = projectRoot;
config.watchFolders = [projectRoot];

// Prefer CommonJS modules over ESM to avoid import.meta issues
config.resolver.unstable_conditionNames = ['browser', 'require', 'react-native'];

// Block react-router patterns more aggressively - use absolute paths
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const parentNodeModulesPattern = new RegExp(`^${escapeRegex(monorepoRoot)}[/\\\\]node_modules[/\\\\].*`);

// CRITICAL: Block ALL parent node_modules first
config.resolver.blockList = [
  // Block entire parent node_modules directory FIRST - most aggressive
  parentNodeModulesPattern,
  // Then block react-router specifically
  new RegExp(`^${escapeRegex(path.join(monorepoRoot, 'node_modules', 'react-router'))}[/\\\\].*`),
  new RegExp(`^${escapeRegex(path.join(monorepoRoot, 'node_modules', 'react-router-dom'))}[/\\\\].*`),
  // Block react-router from anywhere (relative patterns)
  /.*[/\\]react-router[/\\].*/,
  /.*[/\\]react-router-dom[/\\].*/,
  /.*[/\\]react-router-native[/\\].*/,
];

// Only resolve node_modules from the mobile directory - ensure no parent resolution
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
];

// Prevent Metro from resolving from parent directory - prioritize mobile
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Add middleware to block react-router requests at the HTTP level
const originalEnhanceMiddleware = config.server?.enhanceMiddleware;
config.server = config.server || {};
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    // Block any request to react-router files
    if (req.url && req.url.includes('react-router')) {
      res.statusCode = 404;
      res.end(`BLOCKED: react-router is not supported in React Native. Requested: ${req.url}`);
      return;
    }
    
    // Block requests to parent node_modules
    if (req.url && req.url.includes(monorepoRoot) && req.url.includes('node_modules')) {
      // Only allow React/Expo core modules
      const allowedPatterns = ['/react/', '/react-native/', '/@react-native/', '/expo/', '/@expo/'];
      const isAllowed = allowedPatterns.some(pattern => req.url.includes(pattern));
      
      if (!isAllowed) {
        res.statusCode = 404;
        res.end(`BLOCKED: Cannot load from parent node_modules: ${req.url}`);
        return;
      }
    }
    
    if (originalEnhanceMiddleware) {
      return originalEnhanceMiddleware(middleware)(req, res, next);
    }
    
    return middleware(req, res, next);
  };
};

// Custom resolver to completely block parent node_modules and react-router
const originalResolveRequest = config.resolver.resolveRequest;
const parentNodeModulesPath = path.join(monorepoRoot, 'node_modules');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // CRITICAL: Block react-router BEFORE any resolution attempt
  if (moduleName && (
    moduleName === 'react-router' ||
    moduleName === 'react-router-dom' ||
    moduleName === 'react-router-native' ||
    (typeof moduleName === 'string' && (
      moduleName.includes('react-router') ||
      moduleName.includes('react-router-dom')
    ))
  )) {
    throw new Error(
      `BLOCKED: Cannot resolve '${moduleName}' - react-router is not supported in React Native. ` +
      `If you need routing, use @react-navigation/native instead.`
    );
  }
  
  // Check if we're trying to resolve from parent directory
  if (context && context.originModulePath && context.originModulePath.includes(parentNodeModulesPath)) {
    throw new Error(
      `BLOCKED: Cannot resolve modules from parent directory. Origin: ${context.originModulePath}`
    );
  }
  
  if (originalResolveRequest) {
    try {
      const result = originalResolveRequest(context, moduleName, platform);
      
      // Double-check: Block any resolution result that points to parent node_modules
      if (result && result.filePath) {
        const filePath = result.filePath;
        
        // Block if it contains react-router
        if (filePath.includes('react-router')) {
          throw new Error(
            `BLOCKED: react-router detected in resolved path: ${filePath}`
          );
        }
        
        // Block if it's from parent node_modules (except core React/Expo modules)
        if (filePath.includes(parentNodeModulesPath)) {
          const allowedModules = ['react', 'react-native', '@react-native', 'expo', '@expo'];
          const isAllowed = allowedModules.some(prefix => 
            moduleName && typeof moduleName === 'string' && moduleName.startsWith(prefix)
          );
          
          if (!isAllowed) {
            throw new Error(
              `BLOCKED: Cannot resolve '${moduleName}' from parent node_modules at ${filePath}. ` +
              `This package must be installed in mobile/node_modules.`
            );
          }
        }
      }
      
      return result;
    } catch (error) {
      // Re-throw our custom errors
      const errorMsg = error.message || String(error);
      if (errorMsg.includes('react-router') || errorMsg.includes('parent node_modules') || errorMsg.includes('BLOCKED')) {
        throw error;
      }
      throw error;
    }
  }
  
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;

