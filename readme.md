Game of everything
##################

The idea is simple. You have a universe in which clients connect. All clients broadcast messages.
Every client themselves decide what they do with these messages.

Why websocket?
##############

The protocol needed to be simple, work over the internet, have push capabilities and work in a wide variety of languages/platforms/environments. 
Websockets have push and are widely supported (node, python, php, java, cpp, .net, unity, browsers, ...)
