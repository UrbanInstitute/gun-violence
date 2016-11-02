#create geojson from shp file

setwd("/Users/vhou/Documents/Projects/gun_violence/data/oak_data")
oak_data <- read.csv(file="oak_data.csv", header=TRUE, sep=",")
oak_data$GEOID10 <- paste0("0", oak_data$GEOID10)
library(rgdal)
library(raster)
setwd("/Users/vhou/Documents/Projects/gun_violence/data/oak_data/tracts2")
shp <- readOGR("Oakland_Web_Mercator.shp",layer="Oakland_Web_Mercator")
#plot(shp[shp$COUNTYFP == "001",])
#filtered_shp <- shp[shp$COUNTYFP =="001",]
#plot(filtered_shp)
combined_data <- merge(shp, oak_data, by="GEOID10", sort = FALSE, all.x = FALSE)
plot(combined_data)
writeOGR(combined_data, dsn="test", layer="oakland_violence", driver="GeoJSON", overwrite_layer = F)
