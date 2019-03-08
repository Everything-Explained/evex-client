title: α12 : fate
author: Aedaeum
date: 7/25/2017

# features

>- **Scrollbars Everywhere!!** - That's right, we've got delicious scrollbars everywhere, including modals. There's currently a [discussion] about the numerous issues I've had with styling the scrollbars, while trying to maintain good functionality over multiple devices and configurations. Long story short, I had to compromise but I think it will pay off in the future.

>- **Changelog Facelift** - At first I was just going to convert all logs into [Markdown] files; that was my [goal]. But as usual I started tinkering, and ended up [bedazzling] the changelog. Oh yeah...it's quite different than it used to be, but I think it's much easier to read this way.
>- Go ahead and hover your mouse over each of these sections and you'll see something fascinating _:P_ There's also a nice loading animation if a log is taking a while to load.

>- **Chat styles v2** - Let's be honest, the chat window was primarily one color and blended a little too much into the interface, losing some obvious compartments. I've staggered the colors between messages, user list, and input box so that it appears more dynamic; as a result, message colors now appear more vibrant as well.
>- One of my favorite changes however, is that Auto-scroll will no longer interrupt you when you try to scroll up through old messages. An honerable mention is also the allowance of [Markdown] in messages for basic message formatting. _Wanna bold or italisize text?_ **Now you can!**
>- Last but not least, messages sent in quick succession will simply append to the previous message block _yay!_ It was much easier than I thought it would be, however there is a caveat. Time data for those messages are lost. I will fix this in the future, but just be aware that if you repeatedly send messages before anyone replies, you will only see the time for the first message in the block.

>- **User List Love** - Yes, I've finally gotten around to updating the user list with a context menu. It displays ping and user group currently, but with future support for any other stats that should be easily accessible. Just **right click** on any user in the user list to access the context menu.

>- **Notices!** - Finally they're here. You are now able to [notice] users, which is not unlike sending a private message, but instead of the message being sent to some special window, it all appears in the main chat. Read more about notices [here](/#faq/notice).
>- To notice a user, just **double click** their name in the user list; it will fill your input with a **command** and **ID**. It will look something like `/notice zh882Egs8QJpK6aAAAf `. Just start typing your message and hit enter to send it. Don't worry about not getting a confirmation, that's just how it works for now.
>
>- _In the future you'll get a message saying that your notice was sent successfully_.

# fixes

>- **Stop that Flicker!** - There was an issue with flickering when you navigated to the different home tab pages. This flickering was due to transitioning transparent to non-transparent colors.

>- **Transparent what?** - During the creation of the site, I had the _brilliant_ idea to make all colors transparent for "theming" purposes, which in hindsight was...well...short-sighted _:P_
>- All colors have been converted to solid colors. There are no more pointless transparent colors on the site. This is a fix, because any transitions from `transparent -> solid` resulted in wonky animation.

# bits and bobs

>- **FAQ page shinanigans** - Unfortunately the faq page is in dire need of a better mechanism for displaying content. Right now I'm updating it with _raw code_, which is just annoying and leaves no room for fancy transitions between topics. This will be addressed in the next update.

# under the hood

>- **Markdown** - It's not particularly obvious, but most of the pages on the site have been converted to [Markdown]. This means I don't have to write raw html to update certain pages anymore. This will speed up development.

>- **Ping, Pong** - Back in the day, when real-time communication was much more difficult, there was a _ping-pong_ message that ensured the client was still connected to the server. The server would send a _ping_ message and the client would return a _pong_ message. If the server did not recieve a _pong_ message within a certain amount of time, the server would disconnect and/or cleanup the client connection.
>- Thankfully such shinanigans are not necessary these days, but...without a series of ongoing _send-recieve_ transactions, there's no way to accurately measure [latency]. So even though it's not necessary from a design standpoint, it's still very helpful for getting an accurate measurement of a clients [latency] to the server. This allows your ping to be measured in the new user context menu.
>
>- _Other real-time stats will piggy-back on this method like: away status, idle time, and message activity_


[discussion]:https://github.com/Noumenae/client/issues/46
[goal]:https://github.com/Noumenae/client/issues/39
[markdown]:https://guides.github.com/features/mastering-markdown/
[bedazzling]:https://www.google.com/search?q=what+is+bedazzle
[notice]:/#faq/what-is-a-notice
[latency]:http://whatis.techtarget.com/definition/latency