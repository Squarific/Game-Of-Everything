# Game of everything


The idea is simple. You have a universe in which clients connect. All clients broadcast messages.
Every client themselves decide what they do with these messages.

# Why websocket?

The protocol needed to be simple, work over the internet, have push capabilities and work in a wide variety of languages/platforms/environments. 
Websockets have push and are widely supported (node, python, php, java, cpp, .net, unity, browsers, ...)

# How to use


## Local

If you want to use this locally, just run the server and then connect with your clients to it.
You will need to install node. Then run npm install in the directory. After everything is isntalled simply use `node server.js` to run the server

## Global

The global world is a WIP

# Getting consensus on messages

Consider adding what messages you are sending to the wiki.

https://github.com/Squarific/Game-Of-Everything/wiki/protocol