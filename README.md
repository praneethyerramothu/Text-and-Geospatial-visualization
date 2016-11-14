# Text-and-Geospatial-visualization

[![IMAGE ALT TEXT](https://github.com/praneethyerramothu/Visualizing-Time-Series/blob/master/PRESENTATION11.png)]  ( https://www.youtube.com/watch?v=v2vanjBYFbg "Video Title")

Text and Geospatial visualization is representation of data that enables us to effectively discover patterns through graphical means, and to represent these findings in a meaningful and effective way. The dataset that we will use contains various attributes that can be combined together to build interesting data visualizations. Geospatial Visualization allows us to see how the user profiles and usage behavior changes based on the location. A clear depiction of data visualization that combines a map that shows user locations together with various charts that summarizes users’ information and usage behavior is provided in this project. More importantly, a text representation is shown in the form of word cloud in this project. A word cloud is a type of text visualization that allows to visualize a set of texts/text in any particular way the user desires. In this particular project, we are going to deal with a word cloud to show the frequencies or occurrences of words or terms in a news post. To make things clearer and accurate during a particular interval of time, the word cloud is integrated with a graph that allows a user to understand the frequencies of a word/words over the time selected by the user. Additionally, this project also includes the relationship between the terms. The terms being the top 50 of any category or any time period. Furthermore, if the word cloud were to display a set of category ‘Location names’ in the Word cloud, the same are also identified geospatially on the map.

## Word cloud:

![ScreenShot](https://github.com/praneethyerramothu/Text-and-Geospatial-visualization/blob/master/Screen%20Shot%202016-11-14%20at%2013.10.28.png)

A word cloud is a visualized data representation of words used in a particular text. The size of each word indicates its frequency or importance. This word cloud is associated with drop down buttons, ‘Month’ and ‘Year’, of which, the user has the choice to choose from. As the user hits the ‘Word cloud Generate’ button and selects a time/ time interval, a word cloud is visualized on the screen. This visualization contains of the text visualization that has top 50 words frequently occurred during the period of time selected by the user. Moreover, this word cloud is associated with a graph that presents the data with line charts that depict frequency vs time. When the mouse is hovered upon the text visualization, the frequency of the current terms is displayed with a label.

## Relationship between terms:

![ScreenShot](https://github.com/praneethyerramothu/Text-and-Geospatial-visualization/blob/master/Screen%20Shot%202016-11-14%20at%2013.11.32.png)

During a particular period of time, there are a set of top 50 words for a particular post. Each word in a particular time must have coincided with one of the other 49 terms during that time. The representation of that data of terms that involve correlation with each other is shown by the use of directed-edged graphs, basic arc diagrams or force graph. These diagrams and graphs are the ones that are used to relate the terms/words show relationship between any two or multiple terms.

![ScreenShot](https://github.com/praneethyerramothu/Text-and-Geospatial-visualization/blob/master/Screen%20Shot%202016-11-14%20at%2013.11.46.png)

## Geospatial Visualization:

![ScreenShot](https://github.com/praneethyerramothu/Text-and-Geospatial-visualization/blob/master/Screen%20Shot%202016-11-14%20at%2013.10.59.png)
One of the categories in the data that we have visualized in ‘Location’. Every location has a particular point/ place in a geographical map. Geospatial visualization is the physical representation of such geological location on the map.

## BubbleCloud:

![ScreenShot](https://github.com/praneethyerramothu/Text-and-Geospatial-visualization/blob/master/Screen%20Shot%202016-11-14%20at%2013.12.07.png)
Bubble cloud visualizations actually combine SVG and Html element. The bubble elements themselves are circle’s inside of a SVG element, but the text on top of them is actually maintained in regular DIV’s. Both sets of visual elements are backed by the data, so there is very little code duplication or overhead using this structure. The use of SVG and plain html components in the same visualization, saving the state of the visualization using links, creating a custom gravity effect, creating a custom collision detection mechanism are few of the features that are shown in the bubblecloud.

## Contribution of each team member:

### Kiran Patrudu Gopalasetty(Leader):
Mr. Gopalasetty was responsible for most of the project work involved in completing all the required tasks. Few of the requiements of the project are searching for a related terms, visualizing terms etc.  He worked on Relationships between terms, BubbleCloud and Wordle. 

### Praneeth Yerramothu:
Mr.Yerramothu, primarily worked on integrating the data  and all the individual modules required to finish the project. He has also worked on Visualizing data on the map. Top 50 locations in a given post(Huffington or Wikinews) are visualized on a map which followed patternson's map layout.

## Softwares required:
Following are the softwares required to run this file,
1. Brackets[Macintosh],Sublime[Windows]
2. Web browser[Internet Explorer, Mozilla Firefox, Google Chrome]
3. D3 Library[Optional]

## How to run the program:
Following are the steps to run the program,
1.Open any web browser and type in the url- " https://praneethyerramothu.github.io/Text-and-Geospatial-visualization/Bubblecloud.html" .
         {OR}
1.Open any web browser and log into your github account.
2.Find the repository called "Text-and-Geospatial-Visualization" .
3.Download the repository and run the html file called, "Bubblecloud.html".

## Acknowledgement:

This project work is the project-2 that is assigned to all the students, but divided in groups, of Visualization and Visual Analytics class of the year Fall '16.

