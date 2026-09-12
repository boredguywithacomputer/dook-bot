# dook-bot
dook is a multipurpose discord bot. It can do all sorts of things, from playing music to doxxing!! Its named after a friend of mine.
<a href="https://www.youtube.com/watch?v=7pB8WSvNPnA">Here's a demo video!!</a><br><br>

<img width="566" height="215" alt="image" src="https://github.com/user-attachments/assets/8f1a6e82-3b28-43bb-beb9-ab66ca87a650" />
<img width="447" height="87" alt="image" src="https://github.com/user-attachments/assets/1baabc0d-8f32-401f-adf2-203c6ff3b892" />
<img width="605" height="342" alt="image" src="https://github.com/user-attachments/assets/8a002a20-1af4-4101-9eb2-2a67bc7dbf68" />

# Commands
| Name                         | Description                                                                                      |
|------------------------------|--------------------------------------------------------------------------------------------------|
| /help                        | Displays information and a list of features                                                      |
| /play (song name/link)       | Fetches a youtube video and plays its audio.                                                     |
| /playlist (optional: user)   | Plays the mentioned user's playlist, if they set one.                                            |
| /set-playlist (playlisturl)  | Sets a user's playlist to a link, allowing their playlist to be played by themselves and others. |
| /search (videoname)          | Search for the link of a youtube video.                                                          |
| /skip                        | Skips the current song, if a playlist is playing.                                                |
| /ssid (latitude) (longitude) | Returns a list of SSIDs based on a given lat and long, covering ±0.00003 degrees.                |
| /geocode (location name)     | Searches a place and gives information about it.                                                 |
| /shits                       | Know your shits!                                                                                 |
| /leave                       | Disconnects the bot from the voice channel while playing a song/playlist                         |
| /ping                        | Useless test command                                                                             |

# Requirements
- NodeJS v20+ (maybe previous versions work but I have not tested them)<br>
- The latest yt-dlp version<br>

# Host your own dook bot!!
## Clone the repo
```git clone https://github.com/boredguywithacomputer/dook-bot.git```
## Modify the example .env file
- Your Discord bot token can be acquired from the Discord Developer Portal<br>
- A Google Cloud API key with the Youtube Data API enabled<br>
- Get a WiGle auth from the account page. It should like like the image below:<br>
- Set your discord id to use owner-only commands<br>
<img width="1240" height="69" alt="image" src="https://github.com/user-attachments/assets/b26b0f26-c459-42c3-a1a4-0ccb93bd3bf2"></img>

## Run the bot
Run `npm install`<br>
Enter the project directory and run `node index`

## Notes
- Most of this thing is based off of yt-dlp. Instead of loading videos in chunks, I chose to download entire songs to a file and play from it. This reduces the likelyhood of the song cutting out in the middle, and the bot subsequently leaving the voice channel due to inactivity.  
- WiGle's api rate limits start extremely low, but increase over time and by participating, hence the command being locked down to owner only.


## Dependencies and Credits
- yt-dlp
- discord.js<br>
- @discordjs/voice
- axios
- lowdb
- yt-dlp nodejs
- WiGle
- openstreetmap
- thanks to my friends for voluntarily testing and finding a bunch of bugs
