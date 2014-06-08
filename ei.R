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
# Economic Indicators Table
out <- read.csv("raw/Economic_Indicators.csv")
out <- out[which(out$year >= 2000),]
out$year <- factor(out$year, ordered=TRUE)
str(out)

table(out$ccode, out$year)
out[which(out$ccode == "LBY"),]
out[which(out$ccode == "CZE"),]
out[duplicated(out[1:3]),]

out <- out[!duplicated(out[1:3]),]
str(out)

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

out <- merge(out[,c(1,2,4,6,9:12)], resrev[c(1,3,7,8)], by=c("ccode", "year"), all.x=T, all.y=F)
str(out)

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

out <- merge(out, resrev2[c(1,3, 12:14)], by=c("ccode", "year"), all.x=T, all.y=F)
str(out)

# -----------------------------------------------------------------------------
# There are two estimates for Govt Resource Rev as % of GDP, one from the REV 
# table and one from REV2.  
# We take the average if we have both. If not both, then use the one we have.
# Create a new field with 'calc_' prefix for this.
cbind(out$rev_gov_resrev_gdp, out$rev2_gov_resrev_gdp)
apply(cbind(out$rev_gov_resrev_gdp, out$rev2_gov_resrev_gdp), 2, function(x) length(which(is.na(x))))
c <- ifelse(apply(out[,c(10,12)], 1, function (x) all(is.na(x))), NA, rowMeans(out[,c(10,12)], na.rm=TRUE))
cbind(out$rev_gov_resrev_gdp, out$rev2_gov_resrev_gdp, c)
out$calc_gov_resrev_gdp <- c

# -----------------------------------------------------------------------------
# RENT table
# We add up rents for each category type (minerals, fuels, etc, each is a % of 
# GDP) to get a "Total Extractive Industries Rent' value for that country in 
# that year.
rent <- read.csv("raw/Rent.csv")
rent$year <- factor(rent$year, ordered=TRUE)
rent$rent_total_gdp <- ifelse(apply(rent[,c(4:7)], 1, function (x) all(is.na(x))), NA, rowSums(rent[,c(4:7)], na.rm=TRUE))
str(rent)

out <- merge(out, rent[c(1,3, 8)], by=c("ccode", "year"), all.x=T, all.y=F)
out$calc_govt_take <- out$calc_gov_resrev_gdp / out$rent_total_gdp
str(out)


# -----------------------------------------------------------------------------
# COUNTRYCLASSIFICATION table
# merge with this as an outer join only to insure that we have a set with all 
# ccodes, even if no resource data for them (those will have no for those)
# fields).  This could have been done first, would be cleaner.
base <- read.csv("raw/Country_Classification.csv")
str(base)

out_var_cols <- merge(out, base[c(1,2)], by=c("ccode"), all.x=T, all.y=T)
str(out_var_cols)



# -----------------------------------------------------------------------------
# -----------------------------------------------------------------------------
# Step 2 
# Create a  *non-Time Series* Data Set for each country, with COUNTRY
# CLASSIFICATION data as the staring point to make sure we get all the ccodes.
# -----------------------------------------------------------------------------


# -----------------------------------------------------------------------------
# COUNTRYCLASSIFICATION table
base <- read.csv("raw/Country_Classification.csv")
str(base)
base <- base[,c(1:3,6:8,10)]

# -----------------------------------------------------------------------------
# RESREV table - we only need this for the 'rev_source' classifier
resrev <- read.csv("raw/Resource_Revenue.csv")
str(resrev)

outdm <- merge(base, resrev[,c(1,6)], by=c("ccode"), all.x=T);
outdm <- outdm[!duplicated(outdm),]
table(outdm$ccode)
outdm[which(outdm$ccode == "AGO"),]
outdm$class_opec = factor(outdm$class_opec);
outdm$class_hipc = factor(outdm$class_hipc);
outdm$class_ldc = factor(outdm$class_ldc);
outdm$name <- outdm$country
outdm <- outdm[,-2]
str(outdm)

# -----------------------------------------------------------------------------
# This makes a flag indicating whether or not we have any resource data at all
# for a given country.  This uses the ouput from Step 1
d3 <- split(out_var_cols, out_var_cols$ccode)
d4 <- lapply(d3, function(x) all(is.na(melt(x[,c(9:16)])$value)))
d5 <- as.data.frame(unlist(d4))
colnames(d5) = c("haveResourceStats")
d5$haveResourceStats <- ifelse(d5=="TRUE", 0,1) 
d5$haveResourceStats <- factor(d5$haveResourceStats)
d5$ccode <- rownames(d5)
str(d5)

# -----------------------------------------------------------------------------
# Merges our new flag with the non-time-series data set
outdm <- merge(outdm, d5, by=c("ccode"), all.x=T, all.y=F)


# -----------------------------------------------------------------------------
# Put all of this into a format to send to JSON encoder.
d2 <- split(out_var_cols, out_var_cols$ccode)
#j2 <- lapply(d2, function(x) toJSON(list(ccode=x[1,1],stat=(x[,3:16])), .na="null", digits=14))
#j2 <- lapply(d2, function(x) toJSON(list(country=outdm[which(outdm$ccode == x[1,1]),],stat=(x[,3:16])), .na="null", digits=14))
j2 <- lapply(d2, function(x) toJSON(list(country=outdm[which(outdm$ccode == x[1,1]),],macroStats=(x[,3:8]), resourceStats=(x[,c(9,11,13,14,15,16)])), .na="null", digits=14))
j3 <- paste("[", paste(j2, collapse=","), "]")


# -----------------------------------------------------------------------------
# Write the file.
writeLines(j3, "eidata.json")



# ------------------------------------------------
# NOT USING - IGNORE Below
# Third do major production by value
# ------------------------------------------------

prod <- read.csv("raw/Production_Total.csv")
prod <- prod[-which(prod$ccode == "#N/A"),]
str(prod)
prod$max.prod.source = names(prod[,c(5:9)])[apply(prod[,c(5:9)],1,which.max)] 
a <- table(prod$ccode, prod$max.prod.source)
a <- dcast(as.data.frame(a), Var1 ~ Var2)
a$all.year.max <- names(a[,2:5])[apply(a[2:5],1,which.max)]

rent <- read.csv("raw/Rent.csv")
str(rent)
rent$max.rent.source= names(rent[,c(4:7)])[apply(rent[,c(4:7)],1,which.max)] 
a <- table(rent$ccode, rent$max.rent.source)
a <- dcast(as.data.frame(a), Var1 ~ Var2)
a$all.year.max <- names(a[,2:5])[apply(a[2:5],1,which.max)]

