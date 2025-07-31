# Crammar

## Description
This is Crammar, a tool that I created to help me stay on track with my class readings and reduce the time I spend on my computer during Sophomore Summer. It is a full stack app running its own proprietary Crammar API that controls and Adobe PDF Services API and the OpenAI API to scan PDF files from your computer and produce an RSVP (Rapid Serial Visual Presentation) interface to allow the user to read texts at insanely high words per minute.

## Deployed Application
The deployed frontend can be found here: https://crammar.onrender.com/

## Video Demo
https://github.com/user-attachments/assets/1430a1e9-20dc-4e21-8de8-a063341462ae

##  Setup Instructions
Follow these steps to run the project locally:

```bash
# 1. Clone the repository
git clone https://github.com/cannondev/Crammar.git

# 2. Navigate into the project folder
cd path/to/Crammar

# 3. Install dependencies
npm install

# 4. Run the development server
npm run dev
```

## Learning Journey:
I was inspired to create this project for the 25X Dali Lab Application by the combination of the beautiful New Hampshire summertime and the urge to maximize my time spent enjoying it. I was drawn to RSVP as a form of reading presentation because I value absorbing the pure content of a text, and always found that summaries lacked the substance that makes a reading worthwhile. I explored RSVP tools and saw my options were limited to copy and pasting text into a single text are and it plays it back, or a $70 !! price tag on Spreeder. So instead I set out to make my own version that does it exactly how I wanted it to. I hope this app appeals to other students who share the same desire to pursue what they enjoy during this small 10 week term in paradise.

For this project, I learned how to interface with the Adobe PDF Services API and honed my REST API and React skills while learning new skills such as using the Chakra-UI component system and handling real time data and file sharing from local computer drives and static folders with Multer. This was also my first time using JsonWebToken Authentication. This project was a great exercise with Immer and Zustand stores and React State Management. These skills I had originally learned last winter in CS52 Full-Stack Web Development. This app is a combination and expansion on Labs 3, 4, and 5 from that course.

Some major challenges I faced were styling the interfaces and making sure the controls were responsive with the text. I also spent a lot of time fiddling with the pdf file type and storing that and moving it back and forth from the frontend to the api. The Adobe PDF API was complicated and required lots of debugging in Chrome devTools to make sure what I wanted it to output was going to the right places and in the right data types.

Disclaimer: I do believe you sell yourself short by doing anything "half-way," such as reading at 4x your normal wpm or skipping straight to a summary. This project is supposed to be a lighthearted and fun exercise of my development skills. You get out what you put in.
