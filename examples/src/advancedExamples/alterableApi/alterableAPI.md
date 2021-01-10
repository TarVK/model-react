This example shows how you can make a frontend model that can easily be synchronized with a backend model.
This example uses the `LoadableField` class to update each field as soon as the remote data is changed by another source, and fetched again. In case a fetch is performed but the data wasn't altered, the local changes will remain.
