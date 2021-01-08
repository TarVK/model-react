Data Sources can pass exceptions to received data hooks. These exceptions are primarily useful for signalling data loading issues.
This system prevents having to add explicit try catch blocks for these situations, and support displaying multiple exceptions.
