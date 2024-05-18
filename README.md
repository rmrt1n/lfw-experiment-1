This project is an experiment in building an in-browser syncing database for local-first apps. It's 
also supposed to be my submission for the Celestia Infinite Space Bazaar hackathon. The original idea 
was an in-browser graph database (triple store), where the triples are CRDTs which can be synced to 
multiple devices. Along with the in-browser database was a sync server that would coordinate 
between multiple clients & sync the db state. All transactions (operations on the db) would be written 
to a transaction log, which was originally supposed to be stored in a rollup made using rollkit, 
although I didn't get to that part yet.

The app is barely working, wouldn't build for some reason, but it shows that this is feasible. I 
don't plan on continuing this project, but I am working on the design for a v2 of the client db, 
just without the blockchain part. V2 will hopefully be a usable db with built-in support for user 
accounts, a permission system, pluggable storage, and works on a server runtime.
