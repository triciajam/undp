### UNDP/QMSS Extractive Industries Data Dive, April 2014
#### What is the relationship between extractive industry profitability and fiscal revenue from natural resources?


######Goal
Visualize the relationship between EI profitability and fiscal revenue in a useful way.

######Components
* /raw folder : .csv files provided by UNDP.  Not checked into Github.
* ei.R : an R script used to process .csv files into a .json file used by the web page 
* eidata.json : a JSON file containing the data used by the web page, with an entry for each country 
* index.html : the web page that reads in eidata.json and displays the data 
* js/Sunburst.js : custom Sunburst class
* js/Heatmap.js : custom Heatmap class

######Additional Libraries
* D3.js  - Javscript visualization library
* c3.js  - chart library wrapper for D3
* Bootstrap.js - Javascript library for HTML layout and styling
* Angular.js - library user as a "controller" to wire the different visualizations together.* 



#### History
Forked from a repository originally started by bhtucker.
[regcoeff_2.html](https://github.com/bhtucker/undp/blob/master/regcoeffs_2.html) = [bht.atwebpages.com/undp/](http://bht.atwebpages.com/undp/)

