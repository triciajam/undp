library(reshape2)
library(ggplot2)
library(RColorBrewer)
library(RJSONIO)

# First create the dataset

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

# just investigate which of two measures is better
cbind(out$rev_gov_resrev_gdp, out$rev2_gov_resrev_gdp)
apply(cbind(out$rev_gov_resrev_gdp, out$rev2_gov_resrev_gdp), 2, function(x) length(which(is.na(x))))
c <- ifelse(apply(out[,c(10,12)], 1, function (x) all(is.na(x))), NA, rowMeans(out[,c(10,12)], na.rm=TRUE))
cbind(out$rev_gov_resrev_gdp, out$rev2_gov_resrev_gdp, c)

rent <- read.csv("raw/Rent.csv")
rent$year <- factor(rent$year, ordered=TRUE)
rent$rent_total <- ifelse(apply(rent[,c(4:7)], 1, function (x) all(is.na(x))), NA, rowSums(rent[,c(4:7)], na.rm=TRUE))
str(rent)

out <- merge(out, rent[c(1,3, 8)], by=c("ccode", "year"), all.x=T, all.y=F)
str(out)

base <- read.csv("raw/Country_Classification.csv")
str(base)

out_var_cols <- merge(out, base[c(1,2)], by=c("ccode"), all.x=T, all.y=F)
str(out_var_cols)

# Second put in format to send to JSON
d2 <- split(out_var_cols, out_var_cols$ccode)
j2 <- lapply(d2, function(x) toJSON(list(ccode=x[1,1],stat=(x[,3:14])), .na="null"))
j3 <- paste("[", paste(j2, collapse=","), "]")
writeLines(j3, "eidata.json")




# ------------------------
# Below is OLD -- IGNORE

out_time_cols <- melt(out_var_cols)
out_time_cols <- dcast(out_time_cols, ccode + country + variable ~ year)
str(out_time_cols)

write.csv("out1.csv", out_time_cols )


d <- split(out_time_cols, out_time_cols$ccode)
d2 <- split(out_var_cols, out_var_cols$ccode)
j <- toJSON(d2$LBN[,3:14], .na="null")
j <- toJSON(list(ccode="LBN", stat=d2$LBN[,3:14]), .na="null")
writeLines(j, "out.json.txt")

j2 <- lapply(d2, function(x) toJSON(list(ccode=x[1,1],stat=(x[,3:14])), .na="null"))
# adds the column name btu converts all numbers to string unfortunately
#j2 <- lapply(d2, function(x) toJSON(list(ccode=x[1,1],stat=(rbind(colnames(x)[3:14],x[,3:14]))), .na="null"))

j3 <- paste("[", paste(j2, collapse=","), "]")
writeLines(j3, "eidata.json")


