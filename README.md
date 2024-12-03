# Devlog - 11/17

## Introducing the Team

- Tools Lead: **Jack O’Brien**
- Engine Lead: **Luke Murayama**
- Design Lead: **Isha Chury**
- Co-design Lead: **Tony Pau**

#### Subroles

- Audio Design: **Vinh Ta**
- Video of Project: **Jack O’Brien**

## Tools and Materials

#### Game platform: p5

### Game engines/frameworks looked at

We plan on utilizing and launching on p5.js because it is a browser-based
framework that can be used to create and upload JavaScript projects on a web
browser. Because it works this way, it has the benefit of being system friendly
for programmers, unlike Unity or Unreal which takes a lot of space and power to
run and create with. We think meets with our design and style goals, while also
satisfying our technical goals.

### Programming languages going to be used

#### JavaScript/TypeScript and JSON

We’re planning to use TypeScript for our project because the team is used to
working with the language from this class and it’s fresh in everybody’s mind.
Everyone also has previous experience working with JavaScript, p5, and Phaser,
so we don’t have to learn a new game framework from scratch. TypeScript also has
other benefits, with the most useful feature being that it is a strongly typed
language. JSON would be used because of its compatibility with
JavaScript/TypeScript.

### Expected tools to use

- **Ableton** - for audio production. It is the digital audio workstation the
  audio designer is most familiar with.
- **Photoshop and other Adobe programs**
- **Deno** - A capable package manager for JavaScript and TypeScript.
- **VS Code** - We’re using VS Code over other code editors for its
  customizability and simplicity. It’ll let us add our own auto formatting and
  code checking. It is also very familiar to the dev team.
- **GitHub** - The most popular choice for source control and collaboration.
  We’ll be using this to keep our code updated between members.
- **Google Workspace** - for documentation. This suite of tools is good for
  making documents and slide decks for design and brainstorming. Highly
  accessible for the dev team, because it doesn’t require any downloads or
  payments. We won’t be needing any fancy tools for documentation or paper
  prototyping.

### Alternate platform choices

We're planning on switching to Phaser just so that when we do have to switch
frameworks, it'll be easier and the game will hopefully be better as a result.
We’re looking at Phaser for its familiarity amongst the dev team, as well as its
capability in creating 2D games for web browsers. It's framework we have all
made games with before in the past. This will allow us to hit the ground running
once we have to switch and get the game complete and polished as soon as
possible.

## Outlook

### What do we hope to accomplish

We hope to create a functional game that incorporates all of the assignment
requirements, while also allowing the player to have fun. Alongside this, we
would also like to include this game on our individual portfolios, and showcase
our individual efforts and work.

- We hope to make a game that exists
- Something fun
- Something to add to our individual portfolios

### What is the hardest/riskiest part of this

The hardest part of this project would be managing various tasks and
responsibilities across team members. It can be difficult to coordinate times to
host team meetings, as well as ensuring everyone contributes equally to the
project. Another challenge would be to handle the random requirement, and change
the project to suit it. In that same vein, it might be difficult to handle tasks
that may be too difficult given our current skill level and develop them within
the assignment’s deadline.

- Working and coordinating with a team.
- Finishing the project requirements on time.
- Dealing with the random requirements.
- Taking on bits that might be too difficult for current skill level within
  deadline.

### What are we hoping to learn from this

We aim to develop our ability to collaborate effectively, both in real-time and
asynchronously, while making meaningful contributions to the game's codebase. We
aim to follow best practices by writing clean, maintainable code, focusing on
implementing coding patterns and ensuring modularity throughout our project. We
hope to learn version control more efficiently and commit on a regular basis,
and follow best practices including formatting our code and refactoring.

- How to work on a game simultaneously and asynchronously so that we can work on
  our own and not have any bottlenecks.
- How to format a game to be extendable and modular within its code
- Version control and committing practices
- Code formatting and refactoring practices

# Devlog 11/27 - F0 Reflection
## How we satisfied the software requirements:

### [F0.a]
The game takes place on a predefined grid. The player can move from one grid cell to any bordering grid cell not including diagonals. The player's movement is fixed to the grid. The player movement is controlled via the WASD keys.

### [F0.b]
The game starts on turn zero. There is a button that allows the player to move one turn forward. Moving forward a turn updates all the plants on the grid based on predefined rules. This is the only way for plants to progress to the next growth stage.

### [F0.c]
When the player moves their mouse around the grid, the grid that their mouse is on is highlighted. If the mouse is too far from the player, it will highlight red and only show the tile information. If the mouse is close to the player, it will be highlighted green and allow the player to plant or harvest in that cell.

### [F0.d]
Each grid location has an associated interface. The interface contains information of the following: plantID, growth, sun, water, backgroundID, and age. Every turn, the sun value is set to a random value and the water value is incremented by a random amount. Plants use up water while they grow. 

### [F0.e]
There are currently six different types of plants and each plant has three distinct growth phases. [Hana Caraka - Farming Crops Pack](https://bagong-games.itch.io/hana-caraka-crops-pack) is the source for the images. The important information for each plant is stored in a separate plants.ts file.

### [F0.f]
There are simple spatial rules that govern plant growth based on the following factors: sun energy, water accumulation, and nearby plants of the same species. Each plant has a different growth rate, maturing at different times. Plants progress through four growth stages: initial planting, sprouting, budding, and full maturity. If two plants of the same species are near one another, they receive a significant boost. However, if three or more plants of the same species are planted next to each other, they will have competition for resources, decreasing their time to grow. If seeds are planted in slots with five or more solar energy points, they receive an initial ten percent growth boost. Similarly, if seeds are planted in slots with five or more water points, plants receive a five percent boost. 

### [F0.g]
The win condition for this level is relatively simple, consisting of the player collecting 12 or more plants of any variety. This was implemented by creating a dictionary to hold information about the plants harvested. Once the plants matured and the player clicked on them, the location slot would revert back to its original state. Before this occurs, information about the species of plant and the number of plants collected is added to a dictionary. This dictionary is later referenced, and if its length is greater than or equal to 12, the win text appears. This indicates that the player has won the level. 

## Reflection:
Jack O’Brien - I think what we got done had fulfilled the requirements we needed for this.  The functionality was well defined and everything seemed to work as intended.  Even though more polish could have been added to the visual side, everything seems conveyed in an understandable way.  I do think we could have talked more about the game as a team and had more meetings throughout the work.  Luke ended up making a lot of the base of the game before most of the discussion had happened.  By doing this, we could have separated the work out more instead of having most of the foundation done by one person.  As a member, I would have liked to contribute more as most of what I did was the win condition and fixing a bug with the growth level which was a problem.  Most of this is due to me working on D3 as well as other projects I had in other classes.
  
Vinh - We definitely could have used a production lead of some sort. Luke laid the foundation of F0 and the rest of the game down, but we had never discussed the themes or details of the game past a few general ideas. F0 was halfway done before we would talk about the game again as a team. Maybe as a result, we decided to move forward with a different language and alternate platform; but I think that’s just the necessity of descoping, as with most class projects. *We’re all busy and stressed out, I don’t blame us for how things started.* With that being said, I don’t know if we’d instate a production lead formally. We’re all on the same page now, and we talk more now. I’m glad about that. I’ve been working ahead on F1, but I do wish I was able to help more with F0. Regardless, everyone’s picking up our game pretty quick. *I’m proud of the team for our ability to work together, and especially appreciative of Luke for getting our momentum going.* I hope I can do more going forward.
  
Tony Pau - For F0 we have completed all the requirements and all within a week too. The big issue was the time spent on F0 was definitely short and could be started at an earlier date. Everything was done within a week after the initial due date. We’ve tried to do group meets and tried to plan everything out but a chaotic week and other factors made it very difficult. I do wish I played a bigger role for F0 since the workload was very unbalanced and although we did call which part we would do, it wasn’t too well planned and could’ve used more group decision to decide a fair even work load. I’m definitely gonna do more for future parts of this project but for F0 specifically I felt pretty useless as we all were busy and all the parts of F0 were pretty much done.
  
Isha Chury - I think that fulfilled all of the requirements necessary for completing the F0 assignment. However, I do think that as a group we could have assigned tasks earlier, and split the workload more evenly. While we did have some team meetings, we weren’t initially certain of the requirements and instead focused on other things including assigning team roles and setting up our workflows. Luke wrote a large amount of code for the F0 assignment, establishing the base of our game and its functionality. While the majority of F0 had been set-up, other team members helped refine the code and add some of the pending requirements. I helped in implementing the growth and spatial rules for plants, as well as refactoring the code for the win condition. I feel that if I had started earlier I could have helped contribute more towards the code. However, because of this, we as a team are talking more about splitting roles and workload more evenly. I think that going forwards, we will be more careful in making sure that no one person has too much of a workload. 
  
Luke Murayama - We had a couple early meetings where we discussed roles and even met up in person to discuss what we were going to do. I first worked on getting p5js to work with Deno and Vite, then I mainly focused on getting it encapsulated so the renderer would be easy to swap. I jumped the gun a bit since I had the free time and began just trying to implement basic features, but I regret not consulting the team first before going ahead, it wasn’t really fair. We had multiple meetings since then and other team members have helped to flesh out the game and actually make it playable. We did end up reducing the scope of the game from some of our more ambitious ideas.
