/*
 * Create and export configuration variables
 * 
 */

// Container for all environments
const environments = {};

// Staging (default) environment
environments.staging = {
  'port': 3000,
  'envName': 'staging'
};

// Production environment 
environments.production = {
  'port': 5000,
  'envName': 'production'
};

// Determine which environment we pass as command-line
// argument
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? 
  process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the
// environments above, if not, default to staging
const environmentToExport = environments[currentEnvironment] ? 
  environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;
