// ----------------------------------------------------------------------     
// Define Metadata for Statistics (variables) and Factors(classification
// groups)
//
// This script creates a Javascript object 'var_lookup_data' that is an array 
// of Javascript associative objects that hold hard-coded
// lookup data for each variables, such as display name and what color it is 
// represented by, and anything else useful.
// It then creates 3 additional objects using the same data 
// (varnames, varcolors, varlookup) which are merely for convenience  as
// they are in a format that can be passed directly to c3.
//
// This creates another JavaSCript object called 'factor_lookup_data' that does
// the same thing for factors as 'var_lookup_data' does for variables 
// -- factors are ways to classify countries, such as
// by income or geapgraphic region.
//
// These are hard-coded constants; if new variables for factors are added,
// this file would have to be manually modified.
// ----------------------------------------------------------------------                

  //console.log("Loading Lookup Data");
  
  
  var var_lookup_data = 
    [ {
       "variable": "calc_gov_resrev_gdp",
      "values": {
       "name": "Govt Resource Revenue",
      "source": "Calculated: avg of REV$rev_gov_resrev_gdp and REV2$rev2_gov_resrev_gdp",
      "color": "1f77b4",
      "order": 4
      } 
      },{
       "variable": "calc_govt_take",
      "values": {
       "name": "Government Take",
      "source": "Calculated: calc_gov_resrev_gdp / calc_rent_total_gdp",
      "color": "8c564b", //#a6a6a6 ff7878 8c564b,
      "order": 1
      } 
      },{
       "variable": "econ_gdpcon",
      "values": {
       "name": "GDP (constant $)",
      "source": "Economic_Indicators ",
      "color": "" 
      } 
      },{
       "variable": "econ_gdpconpc",
      "values": {
       "name": "GDP per capita (constant $)",
      "source": "Economic_Indicators ",
      "color": "" 
      } 
      },{
       "variable": "econ_govexp",
      "values": {
       "name": "Government Expenditure",
      "source": "Economic_Indicators ",
      "color": "" 
      } 
      },{
       "variable": "econ_govrev",
      "values": {
       "name": "Government Revenue",
      "source": "Economic_Indicators ",
      "color": "" 
      } 
      },{
       "variable": "econ_invtotal",
      "values": {
       "name": "Value of Investments",
      "source": "Economic_Indicators ",
      "color": "" 
      } 
      },{
       "variable": "econ_tax",
      "values": {
       "name": "Government Tax Revenue",
      "source": "Economic_Indicators ",
      "color": "" 
      } 
      },{
       "variable": "calc_rent_total_gdp",
      "values": {
       "name": "Total Rents",
      "source": "Calculated from RENT: sum of RENT$rent_min, RENT$rent_oil, RENT$rent_gas",
      "color": "d62728",
      "order": 2
      } 
      },{
       "variable": "rev_gov_resrev_gdp",
      "values": {
       "name": "Government Resource Revenue",
      "source": "Resource_Revenue",
      "color": "" 
      } 
      },{
       "variable": "rev_gov_resrev_govtrev",
      "values": {
       "name": "Govt Resource Revenue(%GovtRev)",
      "source": "Resource_Revenue",
      "color": "2ca02c",
      "order": 6
      } 
      },{
       "variable": "rev2_gov_nonresrev_gdp",
      "values": {
       "name": "Govt Non-Resource Tax Revenue",
      "source": "Resource_Revenue2",
      "color": "9467bd", //9467bd 1f77b4
      "order": 5
      } 
      },{
       "variable": "rev2_gov_resrev_gdp",
      "values": {
       "name": "Govt Resource Revenue",
      "source": "Resource_Revenue2",
      "color": "" 
      } 
      },{
       "variable": "rev2_gov_rev_gdp",
      "values": {
       "name": "Total Govt Revenue",
      "source": "Resource_Revenue2",
      "color": "bcbd22", //8c564b bcbd22
      "order": 3
       }
       },
       {
          "variable": "prod_total",
          "values": {
            "name": "Total Production (metric tons)",
            "source": "Production_Total",
            "color": "e377c2", 
            "order": 7
          }
       },
       {
        "variable": "exp_fuels",
          "values": {
            "name": "Fuels",
            "source": "Exports",
            "color": "", 
            "order": ""
          }
       },
       {
        "variable": "exp_sitc27",
          "values": {
            "name": "Crude Materials",
            "source": "Exports",
            "color": "", 
            "order": ""
          }
       },
       {
        "variable": "exp_sitc28",
          "values": {
            "name": "Mineral Ores",
            "source": "Exports",
            "color": "", 
            "order": ""
          }
       },
       {
        "variable": "exp_sitc68",
          "values": {
            "name": "Non-Ferrous Metals",
            "source": "Exports",
            "color": "", 
            "order": ""
          }
       },
       {
        "variable": "exp_sitc667",
          "values": {
            "name": "Precious Stones",
            "source": "Exports",
            "color": "", 
            "order": ""
          }
       },    
       {
        "variable": "exp_sitc971",
          "values": {
            "name": "Non-Monetary Gold",
            "source": "Exports",
            "color": "", 
            "order": ""
          }
       },    
       {
        "variable": "exp_eishare",
          "values": {
            "name": "EI% of Total Exports",
            "source": "Exports",
            "color": "", 
            "order": ""
          }
       }      
     ];



    // now do a little processing on the constants to get them into an easy
    // format for c3
    var varnames = {};
    var varcolors = {};
    var varlookup = {};

    var dataAvailable = "#ffbb78";
    var_lookup_data.forEach(function(item, index) {

      varnames[item.variable] = item.values.name;
      varcolors[item.variable] = "#".concat(item.values.color);
      varlookup[item.variable] = item.values;
      /*
      if (varcolors[item.variable] != "#") {            
        var baseColor = d3.rgb(varcolors[item.variable]);
        var darkest = baseColor.darker().darker().darker();
        var lightest = baseColor.brighter().brighter().brighter();
        
        varlookup[item.variable]["lightColor"] = lightest.toString();
        varlookup[item.variable]["darkColor"] = darkest.toString();
      }
      */
    }); 
  
  
    // This is a "manual"" color override
    // I tried to use the d3 default from lighter() and darker() above
    // but didn't like the result, so just picked these instead.
    varlookup["calc_govt_take"].lightColor = "#dcccc9";
    varlookup["calc_govt_take"].darkColor = "#54332d";
    varlookup["calc_gov_resrev_gdp"].lightColor = "#bbd6e8";
    varlookup["calc_gov_resrev_gdp"].darkColor = "#12476c";
    varlookup["calc_rent_total_gdp"].lightColor = "#f2bebe";
    varlookup["calc_rent_total_gdp"].darkColor = "#951b1c";
    varlookup["rev2_gov_nonresrev_gdp"].lightColor = "#ded1eb";
    varlookup["rev2_gov_nonresrev_gdp"].darkColor = "#4a335e";
    varlookup["rev_gov_resrev_govtrev"].lightColor = "#bfe2bf";
    varlookup["rev_gov_resrev_govtrev"].darkColor = "#114011";
    varlookup["rev2_gov_rev_gdp"].lightColor = "#eaebbc";
    varlookup["rev2_gov_rev_gdp"].darkColor = "#5e5e11";
    varlookup["prod_total"].lightColor = "#f6d6ec";
    varlookup["prod_total"].darkColor = "#884774";
  
    
    var factor_lookup_data = [
      {
        "factor": "class_income",
        "name": "Income",
        "color": "",
        "levels": [ 
          { "level": "Low income", "dname":"Low", "code": "LINC" },
          { "level": "Lower middle income", "dname":"Lower Middle", "code": "LMINC" },
          { "level": "Upper middle income", "dname":"Upper Middle", "code": "UMINC" },
          { "level": "High income", "dname":"High", "code": "HINC" },   
        ]
      },
      {
        "factor": "class_reg",
        "name": "Region",
        "color": "",
        "levels": [ 
          { "level": "Africa", "dname":"Africa", "code": "AFR" },
          { "level": "Asia", "dname":"Asia", "code": "ASIA" },
          { "level": "Europe", "dname":"Europe", "code": "EUR" },
          { "level": "Latin America and the Caribbean", "dname":"LAmer.&Carr.", "code": "LAMERC" },   
          { "level": "North America", "dname":"NAmerica", "code": "NAMER" },   
          { "level": "Oceania", "dname":"Oceania", "code": "OCA" },   
        ]
      },
      {
        "factor": "prim_rent",
        "name": "Main Rent Source",
        "color": "",
        "levels": [ 
          { "level": "Oil", "dname":"Oil", "code": "OIL" },
          { "level": "Gas", "dname":"Gas", "code": "GAS" },
/*             { "level": "Coal", "dname":"Coal", "code": "COAL" },   */
          { "level": "Minerals", "dname":"Minerals", "code": "MIN" },
        ]
      },
      {
        "factor": "class_opec",
        "name": "OPEC",
        "color": "",
        "levels": [ 
          { "level": "OPEC", "dname":"Member", "code": "OPEC" },
          { "level": "Non-OPEC", "dname":"Non-Member", "code": "NOPEC" },
        ]
      },         
    ];
    
    //console.log("Finished Loading Lookup Data");
    