#Inspiration
Losing memory isn't something fun to anyone. In United State, Alzhemier's diease is vrey common. Statistics shows that there are are more than 3 million cases per year, and we still have no idea how to cure this disease. Although we haven't found a way to cure Alzhemier's disease, research shows that explosing patients to photos from the past and their favorate musics of their age can spark the memory and have retrieve some of the losing memory. We are trying to employ newest technology to help people suffering memory loss to retrieve memories back.

#What it does
jide.life is an VR showcase app to 

Brush Hero
As a child, we all brushed less than the recommended 2 minutes just because brushing is boring. We hoped to make it exciting by having children brush in rhythm. We only demoed quarter notes but that could easily be replaced with a Let It Go or whatever the child wants.

Brush Hero also includes a monster fighting component. We developed an algorithm that rates brushing on a 1-10 scale in three categories (taken directly from the scientific literature): did they brush 2 minutes, was the brush at a 45 degree angle and did they spend roughly 30 seconds in every quadrant of the mouth. The higher the score is, the smaller the monster gives. Since the algorithm contains a time component, the real goal is to manage your quality/sec. That forces kids to get that 45 degree angle and brush for the full 2 minutes.

Analytics Software
While Brush Hero is fun, we also provide a more buttoned up analytics software. It rates your brushing and provides indications where you brush the most.

How we built it
We developed the tracking software with a lovely library called tracking.js. The process behind developing tracking started with a basic "can it recognize a specific color" but quickly multiplied in complexity. Colors are not consistent to a camera (even if it was looking for a unicolor object, which was basically not the case) over time so we developed more and more complex calibration algorithms that would look for the correct color.

Once we told tracking.js what to look for (usually a neon band we wrapped around the brush), it would show us with a little rectangle on screen what it was "looking" for. We exported that data for use in both

Challenges we ran into
We constantly faced calibration issues. We chose to use tracking.js's color detection features because it involves less matrix math on our end than detecting the edges. The problem is colors change over the day (especially with all the natural light in here) and, more disconcertingly, they change with hardware. We did our best to make our app compatible witn as much as we could from a Nexus 6P to an iPhone 7 to an old 2 megapixel webcam.

Accomplishments that we're proud of
What we learned
What's next for Brush Brush Revolution
Built With