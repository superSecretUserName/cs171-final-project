cs171-final-project
===================
Patrick O'Brien, Katy Wyman, Daniel Schultz
Project URL: http://chandra.phptime.biz/
Video URL : https://vimeo.com/93531642

Overview:

This project is composed of three primary elements:
  • The globe/night sky projection
  • The bubble chart
  • Backend scripts used for data wrangling 

Libraries:
  • D3 (obviously)
  • spin.min.js (for the spinning "loading" icon)
  • topojson.js -- used to handle the drawing of the globe

DataSource:
  Our data was taken from the Chandra proposal database. The database itself didn't know how to output a delimited file, so much processing was required. The compiled csv can be found in the file "assets/alldata.csv" A subset of the raw data can be found in the file 'assets/delmited.csv'
The data was compiled into a proper CSV by 'assets/buildCSV.php' and further processed by files like "buildData.html" and "buildNodes.html"
The above files processed the CSV into the JSON structures required by the visualization. This process helped reduce load times.

Features:
  • Obvious
    • Projection of the earth
    • Projection of the night sky
    • Bubble Chart
      • Clicking on a star changes the bubblechart to the associated cycle
  • Non-obvious
    • Clicking on an object in the sky view will cause all other objects of the
      same data cycle to be highlighted
    • Clicking on an object causes that object to remain highlighted
      so users can trace their steps
    • Zoom in and out function


    

