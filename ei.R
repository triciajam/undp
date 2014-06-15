library(reshape2)
library(ggplot2)
library(RColorBrewer)
library(RJSONIO)

# -----------------------------------------------------------------------------
# R code used to preprare the data provided to us as part of the UNDP/QMSS Data 
# Dive (see CodeBook) for web visualization using D3.
# The goal here is to get the data we want to use into a format that makes it
# easy for D3, Datamaps, and C3 to display it without a lot of extra
# Javscript.
# This happens in three steps - 
# 1) first create a time series data set for each country, 
# 2) second create a non-time series data set for all countries.  
# 3) Then write the JSON file, joining the two sets for each country.
#
# The output of this file is a .JSON file containing our data that the web page
# will then read in.
# -----------------------------------------------------------------------------

# turn off scientific notation
options(scipen=999)



# -----------------------------------------------------------------------------
# -----------------------------------------------------------------------------
# Step 1 Create a Base *Time Series* Data Set, merging data from 
# multiple tables, making sure joins do not drop any data
# -----------------------------------------------------------------------------

# "out" is the output variable


# -----------------------------------------------------------------------------
# COUNTRYCLASSIFICATION table
# this is our base table - includes all the countries

cclass <- read.csv("raw/Country_Classification.csv")
str(cclass)

out.ts <- expand.grid(ccode=cclass$ccode, year=c(2000:2012))
out.ts$year <- factor(as.integer(out.ts$year))
str(out.ts)
#cclass <- cclass[,c(1,2)]
out.ts <- merge(out.ts, cclass[c(1,2)], by=c("ccode"), all.x=T, all.y=F)
str(out.ts)
head(out.ts)
out.ts[which(out.ts$ccode == "AFG"),]
summary(out.ts)

# Economic Indicators Table
ecoind <- read.csv("raw/Economic_Indicators.csv")
#out.ts <- out.ts[which(out.ts$year >= 2000),]
ecoind$year <- factor(ecoind$year, ordered=TRUE)
str(ecoind)
ecoind[duplicated(ecoind[1:3]),]
ecoind <- ecoind[!duplicated(ecoind[1:3]),]
str(ecoind)

out.ts <- merge(out.ts, ecoind[c(1,2,4,6,9:12)], by=c("ccode", "year"), all.x=T, all.y=F)

# -----------------------------------------------------------------------------
# ResRev Table

resrev <- read.csv("raw/Resource_Revenue.csv")
str(resrev)
summary(resrev)
table(resrev$country, resrev$year)
apply(table(resrev$country, resrev$year),1,sum)
# Resource revenue as % Govt Rev 
resrev$rev_gov_resrev_govtrev <- resrev$rev_resrevrev
# Resource revenue as % GDP 
resrev$rev_gov_resrev_gdp <- resrev$rev_resrevgdp
str(resrev)

out.ts <- merge(out.ts, resrev[c(1,3,7,8)], by=c("ccode", "year"), all.x=T, all.y=F)
str(out.ts)


# -----------------------------------------------------------------------------
# ResRev2 Table

resrev2 <- read.csv("raw/Resource_Revenue2.csv")
str(resrev2)
summary(resrev2)
resrev2$year <- factor(resrev2$year)
# Rename some variables for clarity
# Non-Resource-Related Gov Revenue as % GDP 
resrev2$rev2_gov_nonresrev_gdp <- resrev2$rev2_nonrestaxgdp
# Resource-Related Gov Revenue as % GDP 
resrev2$rev2_gov_resrev_gdp <- resrev2$rev2_resrevgdp
# Gov Revenue as % GDP 
resrev2$rev2_gov_rev_gdp <- resrev2$rev2_govrevgdp
table(resrev2$country, resrev2$year)

out.ts <- merge(out.ts, resrev2[c(1,3, 12:14)], by=c("ccode", "year"), all.x=T, all.y=F)
str(out.ts)

# -----------------------------------------------------------------------------
# There are two estimates for Govt Resource Rev as % of GDP, one from the REV 
# table and one from REV2.  
# We take the average if we have both. If not both, then use the one we have.
# Create a new field with 'calc_' prefix for this.
cbind(out.ts$rev_gov_resrev_gdp, out.ts$rev2_gov_resrev_gdp)
apply(cbind(out.ts$rev_gov_resrev_gdp, out.ts$rev2_gov_resrev_gdp), 2, function(x) length(which(is.na(x))))
c <- ifelse(apply(out.ts[,c(11,13)], 1, function (x) all(is.na(x))), NA, rowMeans(out.ts[,c(11,13)], na.rm=TRUE))
cbind(out.ts$rev_gov_resrev_gdp, out.ts$rev2_gov_resrev_gdp, c)
out.ts$calc_gov_resrev_gdp <- c

# -----------------------------------------------------------------------------
# RENT table
# We add up rents for each category type (minerals, fuels, etc, each is a % of 
# GDP) to get a "Total Extractive Industries Rent' value for that country in 
# that year.
rent <- read.csv("raw/Rent.csv")
rent$year <- factor(rent$year, ordered=TRUE)
rent$calc_rent_total_gdp <- ifelse(apply(rent[,c(4:7)], 1, function (x) all(is.na(x))), NA, rowSums(rent[,c(4:7)], na.rm=TRUE))
str(rent)

out.ts <- merge(out.ts, rent[c(1,3, 8)], by=c("ccode", "year"), all.x=T, all.y=F)
out.ts$calc_govt_take <- out.ts$calc_gov_resrev_gdp / out.ts$calc_rent_total_gdp
str(out.ts)


# -----------------------------------------------------------------------------
# -----------------------------------------------------------------------------
# Step 2 
# Create a  *non-Time Series* Data Set for each country, with COUNTRY
# CLASSIFICATION data as the staring point to make sure we get all the ccodes.
# -----------------------------------------------------------------------------


# -----------------------------------------------------------------------------
# COUNTRYCLASSIFICATION table
# again, use our base table so we are sure we have all the countries

cclass <- read.csv("raw/Country_Classification.csv")
str(cclass)
cclass <- cclass[,c(1:8,10)]

# -----------------------------------------------------------------------------
# RESREV table - we only need this for the 'rev_source' classifier
resrev <- read.csv("raw/Resource_Revenue.csv")
str(resrev)


# -----------------------------------------------------------------------------
# Merge the two 
out.no.ts <- merge(cclass, resrev[,c(1,6)], by=c("ccode"), all.x=T);
out.no.ts <- out.no.ts[!duplicated(out.no.ts),]
table(out.no.ts$ccode)
out.no.ts[which(out.no.ts$ccode == "AGO"),]
out.no.ts$class_opec = factor(out.no.ts$class_opec);
out.no.ts$class_hipc = factor(out.no.ts$class_hipc);
out.no.ts$class_ldc = factor(out.no.ts$class_ldc);
out.no.ts$name <- out.no.ts$country
out.no.ts <- out.no.ts[,-2]
str(out.no.ts)

# -----------------------------------------------------------------------------
# This makes a flag indicating whether or not we have any resource data at all
# for a given country.  This uses the ouput from Step 1.
tmpByCountry <- split(out.ts, out.ts$ccode)
tmpDataFlag <- lapply(tmpByCountry, function(x) all(is.na(melt(x[,c(10:17)])$value)))
tmpDataFlag <- as.data.frame(unlist(tmpDataFlag))
colnames(tmpDataFlag) = c("haveResourceStats")
tmpDataFlag$haveResourceStats <- ifelse(tmpDataFlag=="TRUE", 0,1) 
tmpDataFlag$haveResourceStats <- factor(tmpDataFlag$haveResourceStats)
tmpDataFlag$ccode <- rownames(tmpDataFlag)
tmpDataFlag$ccode <- factor(tmpDataFlag$ccode)
str(tmpDataFlag)

# -----------------------------------------------------------------------------
# Merges our new flag with the non-time-series data set
out.no.ts <- merge(out.no.ts, tmpDataFlag, by=c("ccode"), all.x=T, all.y=F)


# -----------------------------------------------------------------------------
# Create a classifier for primary production type
# merge with non-time-series data set
prod <- read.csv("raw/Production_Total.csv")
prod <- prod[-which(prod$ccode == "#N/A"),]
str(prod)
prod$max.prod.source = names(prod[,c(5:9)])[apply(prod[,c(5:9)],1,which.max)] 
a <- table(prod$ccode, prod$max.prod.source)
a <- dcast(as.data.frame(a), Var1 ~ Var2)
a$prim_prod <- names(a[,2:6])[apply(a[2:6],1,which.max)]
a$ccode <- a$Var1
out.no.ts <- merge(out.no.ts, a[,c(7,8)], by=c("ccode"), all.x=T, all.y=F)
out.no.ts$prim_prod <- ifelse(out.no.ts$prim_prod == "prod_fuels", "Fuels", 
                              ifelse(out.no.ts$prim_prod == "prod_indus", "Industrial", 
                                     ifelse(out.no.ts$prim_prod == "prod_ironferr", "Iron&Ferrous Metal",
                                            ifelse(out.no.ts$prim_prod == "prod_prec", "Precious Stone&Metal",                                                   
                                              ifelse(out.no.ts$prim_prod == "prod_nfm", "Non-Ferrous Metal", NA
                                                )))))

# -----------------------------------------------------------------------------
# Create a classifier for primary rent type
# merge with non-time-series data set
rent <- read.csv("raw/Rent.csv")
str(rent)
rent$max.rent.source= names(rent[,c(4:7)])[apply(rent[,c(4:7)],1,which.max)] 
a <- table(rent$ccode, rent$max.rent.source)
a <- dcast(as.data.frame(a), Var1 ~ Var2)
a$prim_rent <- names(a[,2:5])[apply(a[2:5],1,which.max)]
a$ccode <- a$Var1
out.no.ts <- merge(out.no.ts, a[,c(6,7)], by=c("ccode"), all.x=T, all.y=F)
str(out.no.ts)
out.no.ts$prim_rent <- ifelse(out.no.ts$prim_rent == "rent_gas", "Gas", 
                              ifelse(out.no.ts$prim_rent == "rent_min", "Minerals", 
                                     ifelse(out.no.ts$prim_rent == "rent_oil", "Oil", NA
                                            )))

out.no.ts$class_opec <- ifelse(out.no.ts$class_opec == "1", "OPEC", "Non-OPEC") 

# -----------------------------------------------------------------------------
# -----------------------------------------------------------------------------
# Step 3 
# Send all this to JSON encoder.  
# First split by country.

tmpByCountry <- split(out.ts, out.ts$ccode)
#jsonString <- lapply(tmpByCountry, function(x) toJSON(list(ccode=x[1,1],stat=(x[,3:16])), .na="null", digits=14))
#jsonString <- lapply(tmpByCountry, function(x) toJSON(list(country=out.no.ts[which(out.no.ts$ccode == x[1,1]),],stat=(x[,3:16])), .na="null", digits=14))
jsonString <- lapply(tmpByCountry, function(x) toJSON(list(country=out.no.ts[which(out.no.ts$ccode == x[1,1]),],macroStats=(x[,4:9]), resourceStats=(x[,c(10,12,14:17)])), .na="null", digits=14))
jsonString <- paste("[", paste(jsonString, collapse=","), "]")


# -----------------------------------------------------------------------------
# Write the file.
writeLines(jsonString, "eidata.json")

