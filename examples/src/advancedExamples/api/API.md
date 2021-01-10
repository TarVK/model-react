This example shows how to create a simple application that uses multiple API endpoints. This example is however not especially efficient, since it creates a separate http request per data item.
In a real application, this could be solved by forwarding the initial data received when listing entries, or by making an endpoint from which items can be requested in bulk and pooling data fetches.
