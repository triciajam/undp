library(reshape2)
library(ggplot2)
library(RColorBrewer)
library(RJSONIO)

options(scipen=999)

# ------------------------------------------------
# First create the dataset for the Line Chart
# ------------------------------------------------

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

resrev2 <- read.csv("raw/Resource_Revenue2.csv")
str(resrev2)
summary(resrev2)
resrev2$year <- factor(resrev2$year)
# Non-Resource-Related Gov Revenue as % GDP 
resrev2$rev2_gov_nonresrev_gdp <- resrev2$rev2_nonrestaxgdp
# Resource-Related Gov Revenue as % GDP 
resrev2$rev2_gov_resrev_gdp <- resrev2$rev2_resrevgdp
# Gov Revenue as % GDP 
resrev2$rev2_gov_rev_gdp <- resrev2$rev2_govrevgdp
table(resrev2$country, resrev2$year)

out <- merge(out, resrev2[c(1,3, 12:14)], by=c("ccode", "year"), all.x=T, all.y=F)
str(out)

# we have two estimates for this one, from the REV table and one from REV2
# take the average if we have both, if not both then use the one we have
cbind(out$rev_gov_resrev_gdp, out$rev2_gov_resrev_gdp)
apply(cbind(out$rev_gov_resrev_gdp, out$rev2_gov_resrev_gdp), 2, function(x) length(which(is.na(x))))
c <- ifelse(apply(out[,c(10,12)], 1, function (x) all(is.na(x))), NA, rowMeans(out[,c(10,12)], na.rm=TRUE))
cbind(out$rev_gov_resrev_gdp, out$rev2_gov_resrev_gdp, c)
out$calc_gov_resrev_gdp <- c

rent <- read.csv("raw/Rent.csv")
rent$year <- factor(rent$year, ordered=TRUE)
rent$rent_total_gdp <- ifelse(apply(rent[,c(4:7)], 1, function (x) all(is.na(x))), NA, rowSums(rent[,c(4:7)], na.rm=TRUE))
str(rent)

out <- merge(out, rent[c(1,3, 8)], by=c("ccode", "year"), all.x=T, all.y=F)
out$calc_govt_take <- out$calc_gov_resrev_gdp / out$rent_total_gdp
str(out)

base <- read.csv("raw/Country_Classification.csv")
str(base)

out_var_cols <- merge(out, base[c(1,2)], by=c("ccode"), all.x=T, all.y=T)
str(out_var_cols)



# ------------------------------------------------
# Create the dataset for the DataMap
# ------------------------------------------------

base <- read.csv("raw/Country_Classification.csv")
str(base)
base <- base[,c(1:3,6:8,10)]

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

# easy flag for Javascript to know if we have resource data
# MUST change indices in Lapply call if # of resource data lines change
d3 <- split(out_var_cols, out_var_cols$ccode)
d4 <- lapply(d3, function(x) all(is.na(melt(x[,c(9:16)])$value)))
d5 <- as.data.frame(unlist(d4))
colnames(d5) = c("haveResourceStats")
d5$haveResourceStats <- ifelse(d5=="TRUE", 0,1) 
d5$haveResourceStats <- factor(d5$haveResourceStats)
d5$ccode <- rownames(d5)
str(d5)

outdm <- merge(outdm, d5, by=c("ccode"), all.x=T, all.y=F)

#outdm_json <- split(outdm, outdm$ccode)
#j4 <- lapply(outdm_json, function(x) toJSON(list(x), .na="null", digits=14))
#j5 <- lapply(j4, function(x) substring(x, 2, nchar(x)))
#j6 <- lapply(j5, function(x) substring(x, 1, nchar(x)-1))

#j7 <- paste("[", paste(j6, collapse=","), "]")
#writeLines(j7, "eigroups.json")

#  put in format to send to JSON
d2 <- split(out_var_cols, out_var_cols$ccode)
#j2 <- lapply(d2, function(x) toJSON(list(ccode=x[1,1],stat=(x[,3:16])), .na="null", digits=14))
j2 <- lapply(d2, function(x) toJSON(list(country=outdm[which(outdm$ccode == x[1,1]),],stat=(x[,3:16])), .na="null", digits=14))
j2 <- lapply(d2, function(x) toJSON(list(country=outdm[which(outdm$ccode == x[1,1]),],macroStats=(x[,3:8]), resourceStats=(x[,c(9,11,13,14,15,16)])), .na="null", digits=14))

j3 <- paste("[", paste(j2, collapse=","), "]")
writeLines(j3, "eidata.json")



# ------------------------------------------------
# Third do major production by value
# ------------------------------------------------

prod <- read.csv("raw/Production_Total.csv")
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
a$all.year.max <- names(a[,2:6])[apply(a[2:6],1,which.max)]

